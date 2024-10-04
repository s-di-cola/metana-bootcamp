import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { parseEther } from "viem";
import chai, { expect } from "chai";
import BN from "bn.js";
import { ERC20Token$Type } from "../../../artifacts/module-1/deliverables/1_ERC20Token.sol/ERC20Token";

chai.use(require("chai-bn")(BN));

describe("ERC20Token", () => {
  function deployContract() {
    return hre.viem.deployContract(
      "module-1/deliverables/1_ERC20Token.sol:ERC20Token",
      ["Test Token", "TT"],
    );
  }
  let erc20Token: any;

  beforeEach(async () => {
    erc20Token = await loadFixture(deployContract);
  });

  it("should handle sellBack", async () => {
    const [owner, user] = await hre.viem.getWalletClients();
    const publicClient = await hre.viem.getPublicClient();

    const initialEthBalance = await publicClient.getBalance({
      address: user.account.address,
    });

    const initialTokenBalance = await erc20Token.read.balanceOf([
      user.account.address,
    ]);

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
    const finalTokenBalance = await erc20Token.read.balanceOf([
      user.account.address,
    ]);

    expect(initialTokenBalance).to.be.eq(0n);
    expect(initialEthBalance).to.be.eq(parseEther("10000"));
    expect(finalTokenBalance).to.be.eq(0n);
    expect(
      new BN(finalEthBalance.toString()),
    ).to.be.a.bignumber.that.is.closeTo(
      new BN(initialEthBalance.toString()).sub(
        new BN(parseEther("0.5").toString()),
      ),
      new BN(parseEther("0.01").toString()),
    );
  });

  it("should revert with insufficient amount", () => {
    return expect(async () => {
      const erc20Token = await loadFixture(deployContract);
      const [owner, user] = await hre.viem.getWalletClients();
      await erc20Token.write.mintTokens({
        account: user.account,
        value: parseEther("1"),
      });

      const amount = parseEther("1001");
      await expect(
        erc20Token.write.sellBack([amount], {
          account: user.account,
        }),
      ).to.be.rejectedWith("Insufficient amount");
    });
  });
});
