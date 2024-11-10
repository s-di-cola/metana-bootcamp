"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox");
const dotenv_1 = __importDefault(require("dotenv"));
require("@openzeppelin/hardhat-upgrades");
dotenv_1.default.config();
// Verify that the environment variables are set
["ALCHEMY_API_KEY", "DEPLOYER_PRIVATE_KEY", "ETHERSCAN_API_KEY"].forEach((envVar) => {
    if (process.env[envVar] === undefined) {
        throw new Error(`Please set your ${envVar} environment variable`);
    }
});
const config = {
    solidity: "0.8.27",
    defaultNetwork: "localhost",
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
    networks: {
        hardhat: {
            forking: {
                url: "https://eth-mainnet.alchemyapi.io/v2/your-api-key",
                enabled: process.env.MAINNET_FORKING_ENABLED === "true",
            },
        },
        holesky: {
            url: `https://eth-holesky.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
            accounts: [process.env.DEPLOYER_PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    sourcify: {
        enabled: true,
    },
};
exports.default = config;
