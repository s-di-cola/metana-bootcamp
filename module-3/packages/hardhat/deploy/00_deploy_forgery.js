"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Deploys the Forgery contract using the deployer account
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployForgeryContract = async function (hre) {
    const { deployer } = await hre.getNamedAccounts();
    const { deploy } = hre.deployments;
    await deploy("Forgery", {
        from: deployer,
        args: [],
        log: true,
        autoMine: true,
    });
    // Get the deployed contract to interact with it after deploying.
    const forgeryContract = await hre.ethers.getContract("Forgery", deployer);
    console.log("Forgery contract deployed at:", forgeryContract.address);
};
exports.default = deployForgeryContract;
deployForgeryContract.tags = ["Forgery"];
