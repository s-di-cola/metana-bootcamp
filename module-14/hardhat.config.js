"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox-viem");
require("dotenv/config");
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
                url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
                blockNumber: 19000000
            }
        }
    },
};
exports.default = config;
