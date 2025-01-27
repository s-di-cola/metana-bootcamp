"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = __importDefault(require("hardhat"));
const chai_1 = require("chai");
const constants_1 = require("@ethersproject/constants");
const utils_1 = require("ethers/lib/utils");
const setup_1 = require("../utils/setup");
const proxies_1 = require("../../src/utils/proxies");
const ERC4337_TEST_ENV_VARIABLES_DEFINED = typeof process.env.ERC4337_TEST_BUNDLER_URL !== "undefined" &&
    typeof process.env.ERC4337_TEST_NODE_URL !== "undefined" &&
    typeof process.env.ERC4337_TEST_SAFE_FACTORY_ADDRESS !== "undefined" &&
    typeof process.env.ERC4337_TEST_SINGLETON_ADDRESS !== "undefined" &&
    typeof process.env.MNEMONIC !== "undefined";
const itif = ERC4337_TEST_ENV_VARIABLES_DEFINED ? it : it.skip;
const SAFE_FACTORY_ADDRESS = process.env.ERC4337_TEST_SAFE_FACTORY_ADDRESS;
const SINGLETON_ADDRESS = process.env.ERC4337_TEST_SINGLETON_ADDRESS;
const BUNDLER_URL = process.env.ERC4337_TEST_BUNDLER_URL;
const NODE_URL = process.env.ERC4337_TEST_NODE_URL;
const MNEMONIC = process.env.MNEMONIC;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
describe("Safe.ERC4337", () => {
    const setupTests = async () => {
        const factory = await (0, setup_1.getFactoryContract)();
        const singleton = await (0, setup_1.getSafeSingletonContract)();
        const bundlerProvider = new hardhat_1.default.ethers.providers.JsonRpcProvider(BUNDLER_URL);
        const provider = new hardhat_1.default.ethers.providers.JsonRpcProvider(NODE_URL);
        const userWallet = hardhat_1.default.ethers.Wallet.fromMnemonic(MNEMONIC).connect(provider);
        const entryPoints = await bundlerProvider.send("eth_supportedEntryPoints", []);
        if (entryPoints.length === 0) {
            throw new Error("No entry points found");
        }
        return {
            factory: factory.attach(SAFE_FACTORY_ADDRESS).connect(userWallet),
            singleton: singleton.attach(SINGLETON_ADDRESS).connect(provider),
            bundlerProvider,
            provider,
            userWallet,
            entryPoints,
        };
    };
    /**
     * This test verifies the ERC4337 based on gas estimation for a user operation
     * The user operation deploys a Safe with the ERC4337 module and a handler
     * and executes a transaction, thus verifying two things:
     * 1. Deployment of the Safe with the ERC4337 module and handler is possible
     * 2. Executing a transaction is possible
     */
    itif("should pass the ERC4337 validation", async () => {
        const { singleton, factory, provider, bundlerProvider, userWallet, entryPoints } = await setupTests();
        const ENTRYPOINT_ADDRESS = entryPoints[0];
        const erc4337ModuleAndHandlerFactory = (await hardhat_1.default.ethers.getContractFactory("Test4337ModuleAndHandler")).connect(userWallet);
        const erc4337ModuleAndHandler = await erc4337ModuleAndHandlerFactory.deploy(ENTRYPOINT_ADDRESS);
        // The bundler uses a different node, so we need to allow it sometime to sync
        await sleep(10000);
        const feeData = await provider.getFeeData();
        const maxFeePerGas = feeData.maxFeePerGas.toHexString();
        const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas.toHexString();
        const moduleInitializer = erc4337ModuleAndHandler.interface.encodeFunctionData("enableMyself", []);
        const encodedInitializer = singleton.interface.encodeFunctionData("setup", [
            [userWallet.address],
            1,
            erc4337ModuleAndHandler.address,
            moduleInitializer,
            erc4337ModuleAndHandler.address,
            constants_1.AddressZero,
            0,
            constants_1.AddressZero,
        ]);
        const deployedAddress = await (0, proxies_1.calculateProxyAddress)(factory, singleton.address, encodedInitializer, 73);
        // The initCode contains 20 bytes of the factory address and the rest is the calldata to be forwarded
        const initCode = (0, utils_1.hexConcat)([
            factory.address,
            factory.interface.encodeFunctionData("createProxyWithNonce", [singleton.address, encodedInitializer, 73]),
        ]);
        const userOpCallData = erc4337ModuleAndHandler.interface.encodeFunctionData("execTransaction", [userWallet.address, 0, 0]);
        // Native tokens for the pre-fund 💸
        await userWallet.sendTransaction({ to: deployedAddress, value: hardhat_1.default.ethers.utils.parseEther("0.001") });
        // The bundler uses a different node, so we need to allow it sometime to sync
        await sleep(10000);
        const userOperation = {
            sender: deployedAddress,
            nonce: "0x0",
            initCode,
            callData: userOpCallData,
            callGasLimit: "0x7A120",
            verificationGasLimit: "0x7A120",
            preVerificationGas: "0x186A0",
            maxFeePerGas,
            maxPriorityFeePerGas,
            paymasterAndData: "0x",
            signature: "0x",
        };
        const DEBUG_MESSAGE = `
            Using entry point: ${ENTRYPOINT_ADDRESS}
            Deployed Safe address: ${deployedAddress}
            Module/Handler address: ${erc4337ModuleAndHandler.address}
            User operation: 
            ${JSON.stringify(userOperation, null, 2)}
        `;
        console.log(DEBUG_MESSAGE);
        const estimatedGas = await bundlerProvider.send("eth_estimateUserOperationGas", [userOperation, ENTRYPOINT_ADDRESS]);
        (0, chai_1.expect)(estimatedGas).to.not.be.undefined;
    });
});
