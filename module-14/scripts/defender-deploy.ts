import {config} from "dotenv";
config({path: '../.env'});
import {Defender} from "@openzeppelin/defender-sdk";
import hre from "hardhat";

async function deployLimitOrderContract() {
    const UNISWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
    const EXECUTOR="0xede1ee98Ad6d35C30368Ff7711e7511592542100"
    const ADMIN="0x88055326795DD479B39335CAb1c48357A66a6a6F"

    const client = new Defender({
        apiKey: process.env.OPENZEPPELIN_DEFENDER_API_KEY,
        apiSecret: process.env.OPENZEPPELIN_DEFENDER_SECRET_KEY
    });

    const artifactPayload = await hre.artifacts.getBuildInfo('contracts/LimitOrder.sol:LimitOrder');

    const deployment = await client.deploy.deployContract({
        contractName: "LimitOrder",
        contractPath: "contracts/LimitOrder.sol",
        network: "mainent-fork-tenderly",
        verifySourceCode: true,
        constructorInputs: [UNISWAP_ROUTER,ADMIN,EXECUTOR],
        artifactPayload: JSON.stringify(artifactPayload),
        salt: 'limit-order-salt'
    });

    const deploymentStatus = await client.deploy.getDeployedContract(deployment.deploymentId);
    console.log(deploymentStatus);
}

(async () => {
    try {
        await deployLimitOrderContract();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();

