import { ethers, upgrades } from "hardhat";
import { expect } from "chai";

describe("ERC20 Upgrade", () => {
  it("should deploy initial version", async () => {
    const erc20V1 = await ethers.getContractFactory("ERC20Exchange");
    const proxy = await upgrades.deployProxy(erc20V1, ["TestToken", "TEX"]);
    await proxy.waitForDeployment();

    expect(await proxy.name()).to.equal("TestToken");
    expect(await proxy.symbol()).to.equal("TEX");
  });

  it("should upgrade to V2", async () => {
    const erc20V1 = await ethers.getContractFactory("ERC20Exchange");
    const erc20v2 = await ethers.getContractFactory("ERC20ExchangeV2");

    const proxy = await upgrades.deployProxy(erc20V1, ["TestToken", "TEX"]);
    await proxy.waitForDeployment();
    const proxyAddress = await proxy.getAddress();

    const upgradedProxy = await upgrades.upgradeProxy(proxyAddress, erc20v2);
    await upgradedProxy.waitForDeployment();

    await upgradedProxy.initializeV2();
    expect(await upgradedProxy.exchangeRate()).to.equal(100);
  });

  it("should fail when trying to initialize V1 again after upgrade", async () => {
    const erc20V1 = await ethers.getContractFactory("ERC20Exchange");
    const erc20v2 = await ethers.getContractFactory("ERC20ExchangeV2");

    const proxy = await upgrades.deployProxy(erc20V1, ["TestToken", "TEX"]);
    await proxy.waitForDeployment();
    const proxyAddress = await proxy.getAddress();

    const upgradedProxy = await upgrades.upgradeProxy(proxyAddress, erc20v2);
    await upgradedProxy.waitForDeployment();

    await expect(upgradedProxy.initialize("TestToken", "NEWTEX")).to.be
      .reverted;
  });
});
