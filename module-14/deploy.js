"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: '.env' });
const defender_sdk_1 = require("@openzeppelin/defender-sdk");
const fs = __importStar(require("node:fs"));
async function deployLimitOrderContract() {
    const client = new defender_sdk_1.Defender({
        apiKey: process.env.OPENZEPPELIN_DEFENDER_API_KEY,
        apiSecret: process.env.OPENZEPPELIN_DEFENDER_SECRET_KEY
    });
    console.log(process.cwd());
    const UNISWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
    const deployment = await client.deploy.deployContract({
        contractName: "LimitOrder",
        contractPath: "contracts/LimitOrder.sol",
        network: "sepolia",
        verifySourceCode: true,
        constructorInputs: [UNISWAP_ROUTER],
        artifactPayload: fs.readFileSync('box.json', 'utf-8'),
        salt: 'limit-order-salt'
    });
    const deploymentStatus = await client.deploy.getDeployedContract(deployment.deploymentId);
    console.log(deploymentStatus);
}
deployLimitOrderContract().then(r => console.log(r)).catch(e => console.error(e));
