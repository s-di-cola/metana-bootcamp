"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require("hardhat-deploy");
var dotenv_1 = require("dotenv");
var yargs_1 = require("yargs");
var safe_singleton_factory_1 = require("@gnosis.pm/safe-singleton-factory");
var argv = yargs_1.default
    .option("network", {
    type: "string",
    default: "hardhat",
})
    .help(false)
    .version(false).argv;
// Load environment variables.
dotenv_1.default.config();
var _a = process.env, NODE_URL = _a.NODE_URL, INFURA_KEY = _a.INFURA_KEY, MNEMONIC = _a.MNEMONIC, ETHERSCAN_API_KEY = _a.ETHERSCAN_API_KEY, PK = _a.PK, SOLIDITY_VERSION = _a.SOLIDITY_VERSION, SOLIDITY_SETTINGS = _a.SOLIDITY_SETTINGS;
var DEFAULT_MNEMONIC = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";
var sharedNetworkConfig = {};
if (PK) {
    sharedNetworkConfig.accounts = [PK];
}
else {
    sharedNetworkConfig.accounts = {
        mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
    };
}
if (["mainnet", "rinkeby", "kovan", "goerli", "ropsten", "mumbai", "polygon"].includes(argv.network) && INFURA_KEY === undefined) {
    throw new Error("Could not find Infura key in env, unable to connect to network ".concat(argv.network));
}
require("./src/tasks/local_verify");
require("./src/tasks/deploy_contracts");
require("./src/tasks/show_codesize");
var bignumber_1 = require("@ethersproject/bignumber");
var primarySolidityVersion = SOLIDITY_VERSION || "0.7.6";
var soliditySettings = SOLIDITY_SETTINGS ? JSON.parse(SOLIDITY_SETTINGS) : undefined;
var deterministicDeployment = function (network) {
    var info = (0, safe_singleton_factory_1.getSingletonFactoryInfo)(parseInt(network));
    if (!info) {
        throw new Error("\n        Safe factory not found for network ".concat(network, ". You can request a new deployment at https://github.com/safe-global/safe-singleton-factory.\n        For more information, see https://github.com/safe-global/safe-contracts#replay-protection-eip-155\n      "));
    }
    return {
        factory: info.address,
        deployer: info.signerAddress,
        funding: bignumber_1.BigNumber.from(info.gasLimit).mul(bignumber_1.BigNumber.from(info.gasPrice)).toString(),
        signedTx: info.transaction,
    };
};
var userConfig = {
    paths: {
        artifacts: "build/artifacts",
        cache: "build/cache",
        deploy: "src/deploy",
        sources: "contracts",
    },
    solidity: {
        compilers: [{ version: primarySolidityVersion, settings: soliditySettings }, { version: "0.6.12" }, { version: "0.5.17" }],
    },
    networks: {
        hardhat: {
            allowUnlimitedContractSize: true,
            blockGasLimit: 100000000,
            gas: 100000000,
        },
        mainnet: __assign(__assign({}, sharedNetworkConfig), { url: "https://mainnet.infura.io/v3/".concat(INFURA_KEY) }),
        gnosis: __assign(__assign({}, sharedNetworkConfig), { url: "https://rpc.gnosischain.com" }),
        ewc: __assign(__assign({}, sharedNetworkConfig), { url: "https://rpc.energyweb.org" }),
        goerli: __assign(__assign({}, sharedNetworkConfig), { url: "https://goerli.infura.io/v3/".concat(INFURA_KEY) }),
        mumbai: __assign(__assign({}, sharedNetworkConfig), { url: "https://polygon-mumbai.infura.io/v3/".concat(INFURA_KEY) }),
        polygon: __assign(__assign({}, sharedNetworkConfig), { url: "https://polygon-mainnet.infura.io/v3/".concat(INFURA_KEY) }),
        volta: __assign(__assign({}, sharedNetworkConfig), { url: "https://volta-rpc.energyweb.org" }),
        bsc: __assign(__assign({}, sharedNetworkConfig), { url: "https://bsc-dataseed.binance.org/" }),
        arbitrum: __assign(__assign({}, sharedNetworkConfig), { url: "https://arb1.arbitrum.io/rpc" }),
        fantomTestnet: __assign(__assign({}, sharedNetworkConfig), { url: "https://rpc.testnet.fantom.network/" }),
        avalanche: __assign(__assign({}, sharedNetworkConfig), { url: "https://api.avax.network/ext/bc/C/rpc" }),
    },
    deterministicDeployment: deterministicDeployment,
    namedAccounts: {
        deployer: 0,
    },
    mocha: {
        timeout: 2000000,
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
};
if (NODE_URL) {
    userConfig.networks.custom = __assign(__assign({}, sharedNetworkConfig), { url: NODE_URL });
}
exports.default = userConfig;
