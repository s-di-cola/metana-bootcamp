import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { parseEther } from "viem";
import chai, { expect } from "chai";
import BN from "bn.js";

chai.use(require("chai-bn")(BN));

describe("ERC20Token", () => {
  async function deployContract() {
    const erc20Token = await hre.viem.deployContract(
      "contracts/1_ERC20Token.sol:ERC20Token",
      ["Test Token", "TT"],
    );
    const [owner, user] = await hre.viem.getWalletClients();
    const publicClient = await hre.viem.getPublicClient();

    return { erc20Token, owner, user, publicClient };
  }

  it("should sell back if account is authorised", async () => {
    const { erc20Token, user, publicClient } =
      await loadFixture(deployContract);

    const initialEthBalance = await publicClient.getBalance({
      address: user.account.address,
    });

    await erc20Token.write.mintTokens({
      account: user.account,
      value: parseEther("1"),
    });

    const amount = parseEther("1000");
    await erc20Token.write.sellBack([amount], {
      account: user.account,
    });

    const finalEthBalance = await publicClient.getBalance({
      address: user.account.address,
    });
    expect(
      new BN(finalEthBalance.toString()),
    ).to.be.a.bignumber.that.is.closeTo(
      new BN(initialEthBalance.toString()).sub(
        new BN(parseEther("0.5").toString()),
      ),
      new BN(parseEther("0.01").toString()),
    );
  });

  it("should revert with insufficient amount", async () => {
    const { erc20Token } = await loadFixture(deployContract);
    await expect(
      erc20Token.write.sellBack([parseEther("5000")]),
    ).to.be.rejectedWith("You do not have enough tokens to sell");
  });

  it("should revert is account is blacklisted", async () => {
    const { erc20Token, user, owner } = await loadFixture(deployContract);
    await erc20Token.write.mintTokensToAddress([
      user.account.address,
      parseEther("1"),
    ]);

    await erc20Token.write.blacklistAddress([user.account.address], {
      account: owner.account,
    });

    await expect(
      erc20Token.write.sellBack([parseEther("1000")], {
        account: user.account,
      }),
    ).to.be.rejectedWith("This address is blacklisted");
  });

  it("should sell back when account is removed from blacklist", async () => {
    const { erc20Token, user, owner } = await loadFixture(deployContract);
    await erc20Token.write.mintTokens({
      account: user.account,
      value: parseEther("1"),
    });
    await erc20Token.write.blacklistAddress([user.account.address], {
      account: owner.account,
    });
    await expect(
      erc20Token.write.sellBack([parseEther("1000")], {
        account: user.account,
      }),
    ).to.be.rejectedWith("This address is blacklisted");
    await erc20Token.write.unBlacklistAddress([user.account.address], {
      account: owner.account,
    });
    await expect(
      erc20Token.write.sellBack([parseEther("500")], {
        account: user.account,
      }),
    ).to.be.fulfilled;
  });
  it("should revert when insufficient ETH", async () => {
    const { erc20Token, owner } = await loadFixture(deployContract);
    await erc20Token.write.mintTokensToAddress([
      owner.account.address,
      parseEther("50000"),
    ]);
    await expect(
      erc20Token.write.sellBack([parseEther("1000")], {
        account: owner.account,
      }),
    ).to.be.rejectedWith("The contract does not have enough ether to pay you");
  });

  it("should revert when transfer fails", async () => {
    const [owner] = await hre.viem.getWalletClients();
    const mockERC20Token = await hre.viem.deployContract(
      "contracts/mocks/MockERC20Token.sol:MockERC20Token",
      ["Mock Token", "MT"],
    );
    await mockERC20Token.write.mintTokens({ value: parseEther("1") });
    await expect(
      mockERC20Token.write.sellBack([parseEther("1000")], {
        account: owner.account,
      }),
    ).to.be.rejectedWith("Transfer to contract failed'");
  });

  it("should restrict blacklist to owner", async () => {
    const { erc20Token, user } = await loadFixture(deployContract);
    await expect(
      erc20Token.write.blacklistAddress([user.account.address], {
        account: user.account,
      }),
    ).to.be.rejectedWith("Only the contract owner can call this function");
  });
  it("should restrict unblacklist to owner", async () => {
    const { erc20Token, user } = await loadFixture(deployContract);
    await expect(
      erc20Token.write.unBlacklistAddress([user.account.address], {
        account: user.account,
      }),
    ).to.be.rejectedWith("Only the contract owner can call this function");
  });
  it("should restrict mintTokensToAddress to owner", async () => {
    const { erc20Token, user } = await loadFixture(deployContract);
    await expect(
      erc20Token.write.mintTokensToAddress(
        [user.account.address, parseEther("1")],
        {
          account: user.account,
        },
      ),
    ).to.be.rejectedWith("Only the contract owner can call this function");
  });
  it("should revert sell back when all tokens have been authoritatively transferred", async () => {
    const { erc20Token, user, owner } = await loadFixture(deployContract);
    await erc20Token.write.mintTokensToAddress([
      user.account.address,
      parseEther("1"),
    ]);
    await erc20Token.write.authoritativeTransferFrom(
      [user.account.address, owner.account.address],
      {
        account: owner.account,
      },
    );
    await expect(
      erc20Token.write.sellBack([parseEther("1")], {
        account: user.account,
      }),
    ).to.be.rejectedWith("You do not have enough tokens to sell");
  });
  it("should revert sell back when a portion of tokens have been authoritatively transferred ", async () => {
    const { erc20Token, user, owner } = await loadFixture(deployContract);
    for (let i = 0; i < 3; i++) {
      await erc20Token.write.mintTokens({
        account: user.account,
        value: parseEther("1"),
      });
    }
    await erc20Token.write.authoritativeTransferFrom(
      [user.account.address, owner.account.address, parseEther("2")],
      {
        account: owner.account,
      },
    );
    await expect(
      erc20Token.write.sellBack([parseEther("1")], {
        account: user.account,
      }),
    ).to.be.fulfilled;
  });
  it("should restrict partial authoritative transfer to contract owner", async () => {
    const { erc20Token, user } = await loadFixture(deployContract);
    await expect(
      erc20Token.write.authoritativeTransferFrom(
        [user.account.address, user.account.address, parseEther("1")],
        {
          account: user.account,
        },
      ),
    ).to.be.rejectedWith("Only the contract owner can call this function");
  });
  it("should restrict full authoritative transfer to contract owner", async () => {
    const { erc20Token, user } = await loadFixture(deployContract);
    await expect(
      erc20Token.write.authoritativeTransferFrom(
        [user.account.address, user.account.address],
        {
          account: user.account,
        },
      ),
    ).to.be.rejectedWith("Only the contract owner can call this function");
  });
  it("should revert when minting an insufficient amount of ETH", async () => {
    const { erc20Token, user } = await loadFixture(deployContract);
    await expect(
      erc20Token.write.mintTokens({
        account: user.account,
        value: parseEther("0.99"),
      }),
    ).to.be.rejectedWith("You must send 1 ether to mint 1000 tokens");
  });
  it("should revert when minting an excessive amount of ETH", async () => {
    const { erc20Token, user } = await loadFixture(deployContract);
    await expect(
      erc20Token.write.mintTokens({
        account: user.account,
        value: parseEther("1.01"),
      }),
    ).to.be.rejectedWith("You must send 1 ether to mint 1000 tokens");
  });
});
