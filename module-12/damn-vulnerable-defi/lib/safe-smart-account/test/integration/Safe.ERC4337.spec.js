"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var hardhat_1 = require("hardhat");
var chai_1 = require("chai");
var constants_1 = require("@ethersproject/constants");
var utils_1 = require("ethers/lib/utils");
var setup_1 = require("../utils/setup");
var proxies_1 = require("../../src/utils/proxies");
var ERC4337_TEST_ENV_VARIABLES_DEFINED = typeof process.env.ERC4337_TEST_BUNDLER_URL !== "undefined" &&
    typeof process.env.ERC4337_TEST_NODE_URL !== "undefined" &&
    typeof process.env.ERC4337_TEST_SAFE_FACTORY_ADDRESS !== "undefined" &&
    typeof process.env.ERC4337_TEST_SINGLETON_ADDRESS !== "undefined" &&
    typeof process.env.MNEMONIC !== "undefined";
var itif = ERC4337_TEST_ENV_VARIABLES_DEFINED ? it : it.skip;
var SAFE_FACTORY_ADDRESS = process.env.ERC4337_TEST_SAFE_FACTORY_ADDRESS;
var SINGLETON_ADDRESS = process.env.ERC4337_TEST_SINGLETON_ADDRESS;
var BUNDLER_URL = process.env.ERC4337_TEST_BUNDLER_URL;
var NODE_URL = process.env.ERC4337_TEST_NODE_URL;
var MNEMONIC = process.env.MNEMONIC;
var sleep = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
describe("Safe.ERC4337", function () {
    var setupTests = function () { return __awaiter(void 0, void 0, void 0, function () {
        var factory, singleton, bundlerProvider, provider, userWallet, entryPoints;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.getFactoryContract)()];
                case 1:
                    factory = _a.sent();
                    return [4 /*yield*/, (0, setup_1.getSafeSingletonContract)()];
                case 2:
                    singleton = _a.sent();
                    bundlerProvider = new hardhat_1.default.ethers.providers.JsonRpcProvider(BUNDLER_URL);
                    provider = new hardhat_1.default.ethers.providers.JsonRpcProvider(NODE_URL);
                    userWallet = hardhat_1.default.ethers.Wallet.fromMnemonic(MNEMONIC).connect(provider);
                    return [4 /*yield*/, bundlerProvider.send("eth_supportedEntryPoints", [])];
                case 3:
                    entryPoints = _a.sent();
                    if (entryPoints.length === 0) {
                        throw new Error("No entry points found");
                    }
                    return [2 /*return*/, {
                            factory: factory.attach(SAFE_FACTORY_ADDRESS).connect(userWallet),
                            singleton: singleton.attach(SINGLETON_ADDRESS).connect(provider),
                            bundlerProvider: bundlerProvider,
                            provider: provider,
                            userWallet: userWallet,
                            entryPoints: entryPoints,
                        }];
            }
        });
    }); };
    /**
     * This test verifies the ERC4337 based on gas estimation for a user operation
     * The user operation deploys a Safe with the ERC4337 module and a handler
     * and executes a transaction, thus verifying two things:
     * 1. Deployment of the Safe with the ERC4337 module and handler is possible
     * 2. Executing a transaction is possible
     */
    itif("should pass the ERC4337 validation", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, singleton, factory, provider, bundlerProvider, userWallet, entryPoints, ENTRYPOINT_ADDRESS, erc4337ModuleAndHandlerFactory, erc4337ModuleAndHandler, feeData, maxFeePerGas, maxPriorityFeePerGas, moduleInitializer, encodedInitializer, deployedAddress, initCode, userOpCallData, userOperation, DEBUG_MESSAGE, estimatedGas;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, setupTests()];
                case 1:
                    _a = _b.sent(), singleton = _a.singleton, factory = _a.factory, provider = _a.provider, bundlerProvider = _a.bundlerProvider, userWallet = _a.userWallet, entryPoints = _a.entryPoints;
                    ENTRYPOINT_ADDRESS = entryPoints[0];
                    return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory("Test4337ModuleAndHandler")];
                case 2:
                    erc4337ModuleAndHandlerFactory = (_b.sent()).connect(userWallet);
                    return [4 /*yield*/, erc4337ModuleAndHandlerFactory.deploy(ENTRYPOINT_ADDRESS)];
                case 3:
                    erc4337ModuleAndHandler = _b.sent();
                    // The bundler uses a different node, so we need to allow it sometime to sync
                    return [4 /*yield*/, sleep(10000)];
                case 4:
                    // The bundler uses a different node, so we need to allow it sometime to sync
                    _b.sent();
                    return [4 /*yield*/, provider.getFeeData()];
                case 5:
                    feeData = _b.sent();
                    maxFeePerGas = feeData.maxFeePerGas.toHexString();
                    maxPriorityFeePerGas = feeData.maxPriorityFeePerGas.toHexString();
                    moduleInitializer = erc4337ModuleAndHandler.interface.encodeFunctionData("enableMyself", []);
                    encodedInitializer = singleton.interface.encodeFunctionData("setup", [
                        [userWallet.address],
                        1,
                        erc4337ModuleAndHandler.address,
                        moduleInitializer,
                        erc4337ModuleAndHandler.address,
                        constants_1.AddressZero,
                        0,
                        constants_1.AddressZero,
                    ]);
                    return [4 /*yield*/, (0, proxies_1.calculateProxyAddress)(factory, singleton.address, encodedInitializer, 73)];
                case 6:
                    deployedAddress = _b.sent();
                    initCode = (0, utils_1.hexConcat)([
                        factory.address,
                        factory.interface.encodeFunctionData("createProxyWithNonce", [singleton.address, encodedInitializer, 73]),
                    ]);
                    userOpCallData = erc4337ModuleAndHandler.interface.encodeFunctionData("execTransaction", [userWallet.address, 0, 0]);
                    // Native tokens for the pre-fund 💸
                    return [4 /*yield*/, userWallet.sendTransaction({ to: deployedAddress, value: hardhat_1.default.ethers.utils.parseEther("0.001") })];
                case 7:
                    // Native tokens for the pre-fund 💸
                    _b.sent();
                    // The bundler uses a different node, so we need to allow it sometime to sync
                    return [4 /*yield*/, sleep(10000)];
                case 8:
                    // The bundler uses a different node, so we need to allow it sometime to sync
                    _b.sent();
                    userOperation = {
                        sender: deployedAddress,
                        nonce: "0x0",
                        initCode: initCode,
                        callData: userOpCallData,
                        callGasLimit: "0x7A120",
                        verificationGasLimit: "0x7A120",
                        preVerificationGas: "0x186A0",
                        maxFeePerGas: maxFeePerGas,
                        maxPriorityFeePerGas: maxPriorityFeePerGas,
                        paymasterAndData: "0x",
                        signature: "0x",
                    };
                    DEBUG_MESSAGE = "\n            Using entry point: ".concat(ENTRYPOINT_ADDRESS, "\n            Deployed Safe address: ").concat(deployedAddress, "\n            Module/Handler address: ").concat(erc4337ModuleAndHandler.address, "\n            User operation: \n            ").concat(JSON.stringify(userOperation, null, 2), "\n        ");
                    console.log(DEBUG_MESSAGE);
                    return [4 /*yield*/, bundlerProvider.send("eth_estimateUserOperationGas", [userOperation, ENTRYPOINT_ADDRESS])];
                case 9:
                    estimatedGas = _b.sent();
                    (0, chai_1.expect)(estimatedGas).to.not.be.undefined;
                    return [2 /*return*/];
            }
        });
    }); });
});
