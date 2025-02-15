import type {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import 'dotenv/config'
import "@tenderly/hardhat-tenderly";

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.28",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200
                    }
                }
            },
            {
                version: "0.7.6",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200
                    }
                }
            }
        ],
    },
    networks: {
        virtual_mainnet: {
            url: "https://virtual.mainnet.rpc.tenderly.co/552e8c48-222e-4c5b-a437-d94e1b0d5189",
            chainId: 1,
        },
        hardhat: {
            forking: {
                url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
                blockNumber: 19000000
            }
        }
    },
    tenderly: {
        project: "project",
        username: "sdicola",
    },
};

export default config;
