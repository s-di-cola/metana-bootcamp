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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployContract = exports.compile = exports.getSafeProxyRuntimeCode = exports.getCompatFallbackHandler = exports.getTokenCallbackHandler = exports.getSafeWithOwners = exports.getSafeTemplate = exports.getMock = exports.migrationContract = exports.getCreateCall = exports.getMultiSendCallOnly = exports.getMultiSend = exports.getSimulateTxAccessor = exports.getFactory = exports.getFactoryContract = exports.getSafeSingletonContract = exports.getSafeSingleton = exports.compatFallbackHandlerContract = exports.compatFallbackHandlerDeployment = exports.defaultTokenCallbackHandlerContract = exports.defaultTokenCallbackHandlerDeployment = void 0;
var hardhat_1 = require("hardhat");
var ethers_1 = require("ethers");
var constants_1 = require("@ethersproject/constants");
var solc_1 = require("solc");
var execution_1 = require("../../src/utils/execution");
var config_1 = require("./config");
var numbers_1 = require("./numbers");
var defaultTokenCallbackHandlerDeployment = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hardhat_1.deployments.get("TokenCallbackHandler")];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.defaultTokenCallbackHandlerDeployment = defaultTokenCallbackHandlerDeployment;
var defaultTokenCallbackHandlerContract = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory("TokenCallbackHandler")];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.defaultTokenCallbackHandlerContract = defaultTokenCallbackHandlerContract;
var compatFallbackHandlerDeployment = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hardhat_1.deployments.get("CompatibilityFallbackHandler")];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.compatFallbackHandlerDeployment = compatFallbackHandlerDeployment;
var compatFallbackHandlerContract = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory("CompatibilityFallbackHandler")];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.compatFallbackHandlerContract = compatFallbackHandlerContract;
var getSafeSingleton = function () { return __awaiter(void 0, void 0, void 0, function () {
    var SafeDeployment, Safe;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hardhat_1.deployments.get((0, config_1.safeContractUnderTest)())];
            case 1:
                SafeDeployment = _a.sent();
                return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory((0, config_1.safeContractUnderTest)())];
            case 2:
                Safe = _a.sent();
                return [2 /*return*/, Safe.attach(SafeDeployment.address)];
        }
    });
}); };
exports.getSafeSingleton = getSafeSingleton;
var getSafeSingletonContract = function () { return __awaiter(void 0, void 0, void 0, function () {
    var safeSingleton;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory((0, config_1.safeContractUnderTest)())];
            case 1:
                safeSingleton = _a.sent();
                return [2 /*return*/, safeSingleton];
        }
    });
}); };
exports.getSafeSingletonContract = getSafeSingletonContract;
var getFactoryContract = function () { return __awaiter(void 0, void 0, void 0, function () {
    var factory;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory("SafeProxyFactory")];
            case 1:
                factory = _a.sent();
                return [2 /*return*/, factory];
        }
    });
}); };
exports.getFactoryContract = getFactoryContract;
var getFactory = function () { return __awaiter(void 0, void 0, void 0, function () {
    var FactoryDeployment, Factory;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hardhat_1.deployments.get("SafeProxyFactory")];
            case 1:
                FactoryDeployment = _a.sent();
                return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory("SafeProxyFactory")];
            case 2:
                Factory = _a.sent();
                return [2 /*return*/, Factory.attach(FactoryDeployment.address)];
        }
    });
}); };
exports.getFactory = getFactory;
var getSimulateTxAccessor = function () { return __awaiter(void 0, void 0, void 0, function () {
    var SimulateTxAccessorDeployment, SimulateTxAccessor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hardhat_1.deployments.get("SimulateTxAccessor")];
            case 1:
                SimulateTxAccessorDeployment = _a.sent();
                return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory("SimulateTxAccessor")];
            case 2:
                SimulateTxAccessor = _a.sent();
                return [2 /*return*/, SimulateTxAccessor.attach(SimulateTxAccessorDeployment.address)];
        }
    });
}); };
exports.getSimulateTxAccessor = getSimulateTxAccessor;
var getMultiSend = function () { return __awaiter(void 0, void 0, void 0, function () {
    var MultiSendDeployment, MultiSend;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hardhat_1.deployments.get("MultiSend")];
            case 1:
                MultiSendDeployment = _a.sent();
                return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory("MultiSend")];
            case 2:
                MultiSend = _a.sent();
                return [2 /*return*/, MultiSend.attach(MultiSendDeployment.address)];
        }
    });
}); };
exports.getMultiSend = getMultiSend;
var getMultiSendCallOnly = function () { return __awaiter(void 0, void 0, void 0, function () {
    var MultiSendDeployment, MultiSend;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hardhat_1.deployments.get("MultiSendCallOnly")];
            case 1:
                MultiSendDeployment = _a.sent();
                return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory("MultiSendCallOnly")];
            case 2:
                MultiSend = _a.sent();
                return [2 /*return*/, MultiSend.attach(MultiSendDeployment.address)];
        }
    });
}); };
exports.getMultiSendCallOnly = getMultiSendCallOnly;
var getCreateCall = function () { return __awaiter(void 0, void 0, void 0, function () {
    var CreateCallDeployment, CreateCall;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hardhat_1.deployments.get("CreateCall")];
            case 1:
                CreateCallDeployment = _a.sent();
                return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory("CreateCall")];
            case 2:
                CreateCall = _a.sent();
                return [2 /*return*/, CreateCall.attach(CreateCallDeployment.address)];
        }
    });
}); };
exports.getCreateCall = getCreateCall;
var migrationContract = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory("Migration")];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.migrationContract = migrationContract;
var getMock = function () { return __awaiter(void 0, void 0, void 0, function () {
    var Mock;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory("MockContract")];
            case 1:
                Mock = _a.sent();
                return [4 /*yield*/, Mock.deploy()];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getMock = getMock;
var getSafeTemplate = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (saltNumber) {
        var singleton, factory, template, Safe;
        if (saltNumber === void 0) { saltNumber = (0, numbers_1.getRandomIntAsString)(); }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.getSafeSingleton)()];
                case 1:
                    singleton = _a.sent();
                    return [4 /*yield*/, (0, exports.getFactory)()];
                case 2:
                    factory = _a.sent();
                    return [4 /*yield*/, factory.callStatic.createProxyWithNonce(singleton.address, "0x", saltNumber)];
                case 3:
                    template = _a.sent();
                    return [4 /*yield*/, factory.createProxyWithNonce(singleton.address, "0x", saltNumber).then(function (tx) { return tx.wait(); })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory((0, config_1.safeContractUnderTest)())];
                case 5:
                    Safe = _a.sent();
                    return [2 /*return*/, Safe.attach(template)];
            }
        });
    });
};
exports.getSafeTemplate = getSafeTemplate;
var getSafeWithOwners = function (owners_1, threshold_1, fallbackHandler_1, logGasUsage_1) {
    var args_1 = [];
    for (var _i = 4; _i < arguments.length; _i++) {
        args_1[_i - 4] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([owners_1, threshold_1, fallbackHandler_1, logGasUsage_1], args_1, true), void 0, function (owners, threshold, fallbackHandler, logGasUsage, saltNumber) {
        var template;
        if (saltNumber === void 0) { saltNumber = (0, numbers_1.getRandomIntAsString)(); }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.getSafeTemplate)(saltNumber)];
                case 1:
                    template = _a.sent();
                    return [4 /*yield*/, (0, execution_1.logGas)("Setup Safe with ".concat(owners.length, " owner(s)").concat(fallbackHandler && fallbackHandler !== constants_1.AddressZero ? " and fallback handler" : ""), template.setup(owners, threshold || owners.length, constants_1.AddressZero, "0x", fallbackHandler || constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero), !logGasUsage)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, template];
            }
        });
    });
};
exports.getSafeWithOwners = getSafeWithOwners;
var getTokenCallbackHandler = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, exports.defaultTokenCallbackHandlerContract)()];
            case 1:
                _b = (_a = (_c.sent())).attach;
                return [4 /*yield*/, (0, exports.defaultTokenCallbackHandlerDeployment)()];
            case 2: return [2 /*return*/, _b.apply(_a, [(_c.sent()).address])];
        }
    });
}); };
exports.getTokenCallbackHandler = getTokenCallbackHandler;
var getCompatFallbackHandler = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, exports.compatFallbackHandlerContract)()];
            case 1:
                _b = (_a = (_c.sent())).attach;
                return [4 /*yield*/, (0, exports.compatFallbackHandlerDeployment)()];
            case 2: return [2 /*return*/, _b.apply(_a, [(_c.sent()).address])];
        }
    });
}); };
exports.getCompatFallbackHandler = getCompatFallbackHandler;
var getSafeProxyRuntimeCode = function () { return __awaiter(void 0, void 0, void 0, function () {
    var proxyArtifact;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hardhat_1.default.artifacts.readArtifact("SafeProxy")];
            case 1:
                proxyArtifact = _a.sent();
                return [2 /*return*/, proxyArtifact.deployedBytecode];
        }
    });
}); };
exports.getSafeProxyRuntimeCode = getSafeProxyRuntimeCode;
var compile = function (source) { return __awaiter(void 0, void 0, void 0, function () {
    var input, solcData, output, fileOutput, contractOutput, abi, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                input = JSON.stringify({
                    language: "Solidity",
                    settings: {
                        outputSelection: {
                            "*": {
                                "*": ["abi", "evm.bytecode"],
                            },
                        },
                    },
                    sources: {
                        "tmp.sol": {
                            content: source,
                        },
                    },
                });
                return [4 /*yield*/, solc_1.default.compile(input)];
            case 1:
                solcData = _a.sent();
                output = JSON.parse(solcData);
                if (!output["contracts"]) {
                    console.log(output);
                    throw Error("Could not compile contract");
                }
                fileOutput = output["contracts"]["tmp.sol"];
                contractOutput = fileOutput[Object.keys(fileOutput)[0]];
                abi = contractOutput["abi"];
                data = "0x" + contractOutput["evm"]["bytecode"]["object"];
                return [2 /*return*/, {
                        data: data,
                        interface: abi,
                    }];
        }
    });
}); };
exports.compile = compile;
var deployContract = function (deployer, source) { return __awaiter(void 0, void 0, void 0, function () {
    var output, transaction, receipt;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.compile)(source)];
            case 1:
                output = _a.sent();
                return [4 /*yield*/, deployer.sendTransaction({ data: output.data, gasLimit: 6000000 })];
            case 2:
                transaction = _a.sent();
                return [4 /*yield*/, transaction.wait()];
            case 3:
                receipt = _a.sent();
                return [2 /*return*/, new ethers_1.Contract(receipt.contractAddress, output.interface, deployer)];
        }
    });
}); };
exports.deployContract = deployContract;
