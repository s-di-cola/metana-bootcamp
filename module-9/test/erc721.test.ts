import { ethers, upgrades } from "hardhat";
import { expect } from "chai";

describe("Metana OpenSea", () => {
  it("should upgrade max supply to 100", async () => {
    const MetanaNFTV1 = await ethers.getContractFactory("MetanaOpensea");
    const MetanaNFTV2 = await ethers.getContractFactory("MetanaOpenseaV2");

    const instance = await upgrades.deployProxy(MetanaNFTV1, ["MetanaV1"]);
    const upgraded = await upgrades.upgradeProxy(
      await instance.getAddress(),
      MetanaNFTV2
    );

    const value = await upgraded.symbol();
    expect(value.toString()).to.equal("MetanaV1");
    const maxSupply = await upgraded.getMaximumSupply();
    expect(maxSupply.toString()).to.equal("100");
  });
});
