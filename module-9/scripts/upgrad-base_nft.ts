import { ethers, upgrades } from "hardhat";

async function upgradeBaseNFT() {
  const baseNFTV2 = await ethers.getContractFactory("BaseERC721V2");

  const proxy = await upgrades.upgradeProxy(
    "0x247b1c3e3D1386adafbE7B94109D33307f64768C",
    baseNFTV2
  );

  await proxy.waitForDeployment();
  console.log("BaseNFT Proxy upgraded to:", await proxy.getAddress());
}

upgradeBaseNFT()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
