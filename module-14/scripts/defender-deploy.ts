import 'dotenv/config';
import {Defender} from "@openzeppelin/defender-sdk";
import hre from "hardhat";

async function deployLimitOrderContract() {
    const UNISWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
    const EXECUTOR_RELAYER="0xf3AaEc82876e0619Ae49b9788ccc20dF9EA1D064"
    const EOA="0x88055326795DD479B39335CAb1c48357A66a6a6F"

    const client = new Defender({
        apiKey: process.env.OPENZEPPELIN_DEFENDER_API_KEY,
        apiSecret: process.env.OPENZEPPELIN_DEFENDER_SECRET_KEY
    });

    const artifactPayload = await hre.artifacts.getBuildInfo('contracts/LimitOrder.sol:LimitOrder');

    const deployment = await client.deploy.deployContract({
        contractName: "LimitOrder",
        contractPath: "contracts/LimitOrder.sol",
        network: "buildbear-nasty-northstar",
        verifySourceCode: true,
        constructorInputs: [UNISWAP_ROUTER,EOA,EXECUTOR_RELAYER],
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

