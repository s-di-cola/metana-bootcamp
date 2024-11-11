import { ethers, upgrades } from "hardhat";

async function deploy() {
  const BaseNFT = await ethers.getContractFactory("BaseERC721");

  const proxy = await upgrades.deployProxy(BaseNFT, ["UNIQUEX", "UNQ"], {
    initializer: "initialize",
  });
  await proxy.waitForDeployment();
  const proxyAddress = await proxy.getAddress();

  console.log("BaseNFT proxy deployed to:", proxyAddress);

  // If you want to get the implementation address:
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxyAddress
  );
  console.log("Implementation address:", implementationAddress);
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
