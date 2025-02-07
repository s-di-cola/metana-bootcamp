"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox-viem");
const config = {
    solidity: {
        compilers: [
            {
                version: "0.8.28",
            },
            {
                version: "0.7.6",
            }
        ],
    },
    networks: {
        hardhat: {
            forking: {
                url: "https://eth-mainnet.alchemyapi.io/v2/your-api-key",
                blockNumber: 13000000
            }
        }
    },
};
exports.default = config;
