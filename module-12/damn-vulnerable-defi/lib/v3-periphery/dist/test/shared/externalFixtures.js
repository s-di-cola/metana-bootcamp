"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.v3RouterFixture = exports.v2FactoryFixture = void 0;
const UniswapV3Factory_json_1 = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json");
const UniswapV2Factory_json_1 = require("@uniswap/v2-core/build/UniswapV2Factory.json");
const hardhat_1 = require("hardhat");
const WETH9_json_1 = __importDefault(require("../contracts/WETH9.json"));
const ethers_1 = require("ethers");
const wethFixture = async ([wallet]) => {
    const weth9 = (await hardhat_1.waffle.deployContract(wallet, {
        bytecode: WETH9_json_1.default.bytecode,
        abi: WETH9_json_1.default.abi,
    }));
    return { weth9 };
};
const v2FactoryFixture = async ([wallet]) => {
    const factory = await hardhat_1.waffle.deployContract(wallet, {
        bytecode: UniswapV2Factory_json_1.bytecode,
        abi: UniswapV2Factory_json_1.abi,
    }, [ethers_1.constants.AddressZero]);
    return { factory };
};
exports.v2FactoryFixture = v2FactoryFixture;
const v3CoreFactoryFixture = async ([wallet]) => {
    return (await hardhat_1.waffle.deployContract(wallet, {
        bytecode: UniswapV3Factory_json_1.bytecode,
        abi: UniswapV3Factory_json_1.abi,
    }));
};
const v3RouterFixture = async ([wallet], provider) => {
    const { weth9 } = await wethFixture([wallet], provider);
    const factory = await v3CoreFactoryFixture([wallet], provider);
    const router = (await (await hardhat_1.ethers.getContractFactory('MockTimeSwapRouter')).deploy(factory.address, weth9.address));
    return { factory, weth9, router };
};
exports.v3RouterFixture = v3RouterFixture;
