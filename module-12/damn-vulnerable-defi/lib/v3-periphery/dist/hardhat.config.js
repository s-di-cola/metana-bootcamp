"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-typechain");
require("hardhat-watcher");
const LOW_OPTIMIZER_COMPILER_SETTINGS = {
    version: '0.8.15',
    settings: {
        optimizer: {
            enabled: true,
            runs: 2000,
        },
        metadata: {
            bytecodeHash: 'none',
        },
    },
};
const LOWEST_OPTIMIZER_COMPILER_SETTINGS = {
    version: '0.8.15',
    settings: {
        viaIR: true,
        optimizer: {
            enabled: true,
            runs: 1000,
        },
        metadata: {
            bytecodeHash: 'none',
        },
    },
};
const DEFAULT_COMPILER_SETTINGS = {
    version: '0.8.15',
    settings: {
        optimizer: {
            enabled: true,
            runs: 1000000,
        },
        metadata: {
            bytecodeHash: 'none',
        },
    },
};
exports.default = {
    networks: {
        hardhat: {
            allowUnlimitedContractSize: false,
        },
        mainnet: {
            url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
        },
        ropsten: {
            url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
        },
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
        },
        goerli: {
            url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
        },
        kovan: {
            url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
        },
        arbitrumRinkeby: {
            url: `https://arbitrum-rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
        },
        arbitrum: {
            url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
        },
        optimismKovan: {
            url: `https://optimism-kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
        },
        optimism: {
            url: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
        },
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    solidity: {
        compilers: [DEFAULT_COMPILER_SETTINGS],
        overrides: {
            'contracts/NonfungiblePositionManager.sol': LOW_OPTIMIZER_COMPILER_SETTINGS,
            'contracts/test/MockTimeNonfungiblePositionManager.sol': LOW_OPTIMIZER_COMPILER_SETTINGS,
            'contracts/test/NFTDescriptorTest.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
            'contracts/NonfungibleTokenPositionDescriptor.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
            'contracts/libraries/NFTDescriptor.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
            'contracts/libraries/NFTSVG.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
        },
    },
    watcher: {
        test: {
            tasks: [{ command: 'test', params: { testFiles: ['{path}'] } }],
            files: ['./test/**/*'],
            verbose: true,
        },
    },
};
