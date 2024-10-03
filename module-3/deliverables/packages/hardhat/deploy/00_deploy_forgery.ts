import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the Forgery contract using the deployer account
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployForgeryContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("Forgery", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const forgeryContract = await hre.ethers.getContract<Contract>("Forgery", deployer);
  console.log("Forgery contract deployed at:", forgeryContract.address);
};

export default deployForgeryContract;

deployForgeryContract.tags = ["Forgery"];
