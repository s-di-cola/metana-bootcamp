import {HardhatUserConfig, vars} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import 'dotenv/config'

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.28",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    sourcify: {
        enabled: true,
    },
    etherscan:{
        apiKey:{
            polygonAmoy: vars.get("AMOY_EXPLORER_API_KEY")
        }
    },
    networks:{
        hardhat:{
            forking:{
                url: vars.get("ETH_MAINNET_HTTPS_RPC_URL"),
                blockNumber: 19800000
            },
            mining:{
                auto:true,
                interval:0
            }
        },
        polygonAmoy:{
            url: vars.get("AMOY_HTTPS_RPC_URL"),
            accounts: [vars.get("WALLET_PRIVATE_KEY")!],
            chainId: 80002,
        }
    }
}

export default config;
