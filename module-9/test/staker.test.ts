import { ethers, upgrades } from "hardhat";
import chai from "chai";
import BN from "bn.js";
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);
const { expect } = chai;
import { Contract, Signer } from "ethers";

describe("Staker", () => {
  let stacker: any;
  let erc20Token: Contract;
  let erc721Token: Contract;
  let proxy: Contract;
  let signer: Signer;
  let currentAddr: string;

  beforeEach(async () => {
    [signer] = await ethers.getSigners();
    currentAddr = await signer.getAddress();

    stacker = await ethers.getContractFactory("Staker");
    const erc20TokenFactory = await ethers.getContractFactory("S_ERC20Token");
    const erc721TokenFactory = await ethers.getContractFactory("S_ERC721Token");

    erc20Token = await erc20TokenFactory.deploy();
    await erc20Token.waitForDeployment();

    const erc20TokenAddress = await erc20Token.getAddress();

    erc721Token = await erc721TokenFactory.deploy(
      100,
      100000,
      erc20TokenAddress
    );
    await erc721Token.waitForDeployment();
    const erc721TokenAddress = await erc721Token.getAddress();

    proxy = await upgrades.deployProxy(
      stacker,
      [erc20TokenAddress, erc721TokenAddress],
      {
        kind: "uups",
        initializer: "initialize",
      }
    );
    await proxy.waitForDeployment();

    await erc20Token.setStaker(await proxy.getAddress());
  });

  it("should deploy initial version", async () => {
    const tokenId = 1;
    const stakedNFT = await proxy.stakedNFTs(tokenId, currentAddr);

    expect(stakedNFT.stakingTimestamp).to.equal(0);
    expect(stakedNFT.lastRewardClaimTimestamp).to.equal(0);
  });

  it("should upgrade to V2 and use new multiplier feature", async () => {
    const tokenId = 1;
    const nftPrice = await erc721Token.NFT_PRICE();

    await erc20Token.approve(await erc721Token.getAddress(), nftPrice);
    await erc721Token.mint(tokenId);
    await erc721Token.approve(await proxy.getAddress(), tokenId);
    await proxy.stakeNFT(tokenId);

    const stakedNFTv1 = await proxy.stakedNFTs(tokenId, currentAddr);
    expect(stakedNFTv1.stakingTimestamp).to.not.equal(0);
    expect(stakedNFTv1.lastRewardClaimTimestamp).to.not.equal(0);

    const StakerV2 = await ethers.getContractFactory("StakerV2");
    const proxyV2 = await upgrades.upgradeProxy(
      await proxy.getAddress(),
      StakerV2,
      {
        kind: "uups",
        call: {
          fn: "initialize",
          args: [await erc20Token.getAddress(), await erc721Token.getAddress()],
        },
      }
    );

    expect(await proxyV2.rewardMultiplier()).to.equal(1);

    const stakedNFTv2 = await proxyV2.stakedNFTs(tokenId, currentAddr);
    expect(stakedNFTv2.stakingTimestamp).to.equal(stakedNFTv1.stakingTimestamp);
    expect(stakedNFTv2.lastRewardClaimTimestamp).to.equal(
      stakedNFTv1.lastRewardClaimTimestamp
    );

    await proxyV2.setRewardMultiplier(2);
    expect(await proxyV2.rewardMultiplier()).to.equal(2);

    await ethers.provider.send("evm_increaseTime", [86400]);
    await ethers.provider.send("evm_mine", []);

    const balanceBefore = await erc20Token.balanceOf(currentAddr);
    await proxyV2.withdrawReward();
    const balanceAfter = await erc20Token.balanceOf(currentAddr);

    const rewardAmount = balanceAfter - balanceBefore;
    const expectedReward = new BN("20000000000000000000000000000000000000"); // 20 * 10^21
    const actualReward = new BN(rewardAmount.toString());
    expect(actualReward).to.be.bignumber.equal(expectedReward);
  });
});
