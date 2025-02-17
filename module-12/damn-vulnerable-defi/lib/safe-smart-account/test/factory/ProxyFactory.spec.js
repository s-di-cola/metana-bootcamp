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
var chai_1 = require("chai");
var hardhat_1 = require("hardhat");
require("@nomiclabs/hardhat-ethers");
var setup_1 = require("../utils/setup");
var constants_1 = require("@ethersproject/constants");
var ethers_1 = require("ethers");
var proxies_1 = require("../../src/utils/proxies");
var encoding_1 = require("../utils/encoding");
describe("ProxyFactory", function () { return __awaiter(void 0, void 0, void 0, function () {
    var SINGLETON_SOURCE, user1, setupTests;
    return __generator(this, function (_a) {
        SINGLETON_SOURCE = "\n    contract Test {\n        address _singleton;\n        address public creator;\n        bool public isInitialized;\n        constructor() payable {\n            creator = msg.sender;\n        }\n\n        function init() public {\n            require(!isInitialized, \"Is initialized\");\n            creator = msg.sender;\n            isInitialized = true;\n        }\n\n        function masterCopy() public pure returns (address) {\n            return address(0);\n        }\n\n        function forward(address to, bytes memory data) public returns (bytes memory result) {\n            (,result) = to.call(data);\n        }\n    }";
        user1 = hardhat_1.waffle.provider.getWallets()[0];
        setupTests = hardhat_1.deployments.createFixture(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var singleton;
            var _c;
            var deployments = _b.deployments;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, deployments.fixture()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, (0, setup_1.deployContract)(user1, SINGLETON_SOURCE)];
                    case 2:
                        singleton = _d.sent();
                        _c = {};
                        return [4 /*yield*/, (0, setup_1.getSafeWithOwners)([user1.address])];
                    case 3:
                        _c.safe = _d.sent();
                        return [4 /*yield*/, (0, setup_1.getFactory)()];
                    case 4:
                        _c.factory = _d.sent();
                        return [4 /*yield*/, (0, setup_1.getMock)()];
                    case 5: return [2 /*return*/, (_c.mock = _d.sent(),
                            _c.singleton = singleton,
                            _c)];
                }
            });
        }); });
        describe("createProxyWithNonce", function () { return __awaiter(void 0, void 0, void 0, function () {
            var saltNonce;
            return __generator(this, function (_a) {
                saltNonce = 42;
                it("should revert if singleton address is not a contract", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var factory, randomAddress;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                factory = (_a.sent()).factory;
                                randomAddress = hardhat_1.ethers.utils.getAddress(hardhat_1.ethers.utils.hexlify(hardhat_1.ethers.utils.randomBytes(20)));
                                return [4 /*yield*/, (0, chai_1.expect)(factory.createProxyWithNonce(randomAddress, "0x", saltNonce)).to.be.revertedWith("Singleton contract not deployed")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert with invalid initializer", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, factory, singleton;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), factory = _a.factory, singleton = _a.singleton;
                                return [4 /*yield*/, (0, chai_1.expect)(factory.createProxyWithNonce(singleton.address, "0x42baddad", saltNonce)).to.be.revertedWith("Transaction reverted without a reason")];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should emit event without initializing", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, factory, singleton, initCode, proxyAddress, proxy, _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _j.sent(), factory = _a.factory, singleton = _a.singleton;
                                initCode = "0x";
                                return [4 /*yield*/, (0, proxies_1.calculateProxyAddress)(factory, singleton.address, initCode, saltNonce)];
                            case 2:
                                proxyAddress = _j.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(factory.createProxyWithNonce(singleton.address, initCode, saltNonce))
                                        .to.emit(factory, "ProxyCreation")
                                        .withArgs(proxyAddress, singleton.address)];
                            case 3:
                                _j.sent();
                                proxy = singleton.attach(proxyAddress);
                                _b = chai_1.expect;
                                return [4 /*yield*/, proxy.creator()];
                            case 4:
                                _b.apply(void 0, [_j.sent()]).to.be.eq(constants_1.AddressZero);
                                _c = chai_1.expect;
                                return [4 /*yield*/, proxy.isInitialized()];
                            case 5:
                                _c.apply(void 0, [_j.sent()]).to.be.eq(false);
                                _d = chai_1.expect;
                                return [4 /*yield*/, proxy.masterCopy()];
                            case 6:
                                _d.apply(void 0, [_j.sent()]).to.be.eq(singleton.address);
                                _e = chai_1.expect;
                                return [4 /*yield*/, singleton.masterCopy()];
                            case 7:
                                _e.apply(void 0, [_j.sent()]).to.be.eq(constants_1.AddressZero);
                                _g = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getCode(proxyAddress)];
                            case 8:
                                _h = (_f = _g.apply(void 0, [_j.sent()]).to.be).eq;
                                return [4 /*yield*/, (0, setup_1.getSafeProxyRuntimeCode)()];
                            case 9:
                                _h.apply(_f, [_j.sent()]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should emit event with initializing", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, factory, singleton, initCode, proxyAddress, proxy, _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _j.sent(), factory = _a.factory, singleton = _a.singleton;
                                initCode = singleton.interface.encodeFunctionData("init", []);
                                return [4 /*yield*/, (0, proxies_1.calculateProxyAddress)(factory, singleton.address, initCode, saltNonce)];
                            case 2:
                                proxyAddress = _j.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(factory.createProxyWithNonce(singleton.address, initCode, saltNonce))
                                        .to.emit(factory, "ProxyCreation")
                                        .withArgs(proxyAddress, singleton.address)];
                            case 3:
                                _j.sent();
                                proxy = singleton.attach(proxyAddress);
                                _b = chai_1.expect;
                                return [4 /*yield*/, proxy.creator()];
                            case 4:
                                _b.apply(void 0, [_j.sent()]).to.be.eq(factory.address);
                                _c = chai_1.expect;
                                return [4 /*yield*/, proxy.isInitialized()];
                            case 5:
                                _c.apply(void 0, [_j.sent()]).to.be.eq(true);
                                _d = chai_1.expect;
                                return [4 /*yield*/, proxy.masterCopy()];
                            case 6:
                                _d.apply(void 0, [_j.sent()]).to.be.eq(singleton.address);
                                _e = chai_1.expect;
                                return [4 /*yield*/, singleton.masterCopy()];
                            case 7:
                                _e.apply(void 0, [_j.sent()]).to.be.eq(constants_1.AddressZero);
                                _g = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getCode(proxyAddress)];
                            case 8:
                                _h = (_f = _g.apply(void 0, [_j.sent()]).to.be).eq;
                                return [4 /*yield*/, (0, setup_1.getSafeProxyRuntimeCode)()];
                            case 9:
                                _h.apply(_f, [_j.sent()]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should not be able to deploy same proxy twice", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, factory, singleton, initCode, proxyAddress;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), factory = _a.factory, singleton = _a.singleton;
                                initCode = singleton.interface.encodeFunctionData("init", []);
                                return [4 /*yield*/, (0, proxies_1.calculateProxyAddress)(factory, singleton.address, initCode, saltNonce)];
                            case 2:
                                proxyAddress = _b.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(factory.createProxyWithNonce(singleton.address, initCode, saltNonce))
                                        .to.emit(factory, "ProxyCreation")
                                        .withArgs(proxyAddress, singleton.address)];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(factory.createProxyWithNonce(singleton.address, initCode, saltNonce)).to.be.revertedWith("Create2 call failed")];
                            case 4:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("createChainSpecificProxyWithNonce", function () { return __awaiter(void 0, void 0, void 0, function () {
            var saltNonce;
            return __generator(this, function (_a) {
                saltNonce = 42;
                it("should revert if singleton address is not a contract", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var factory;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                factory = (_a.sent()).factory;
                                return [4 /*yield*/, (0, chai_1.expect)(factory.createProxyWithNonce(constants_1.AddressZero, "0x", saltNonce)).to.be.revertedWith("Singleton contract not deployed")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert with invalid initializer", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, factory, singleton;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), factory = _a.factory, singleton = _a.singleton;
                                return [4 /*yield*/, (0, chai_1.expect)(factory.createProxyWithNonce(singleton.address, "0x42baddad", saltNonce)).to.be.revertedWith("Transaction reverted without a reason")];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should emit event without initializing", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, factory, singleton, initCode, proxyAddress, proxy, _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _j.sent(), factory = _a.factory, singleton = _a.singleton;
                                initCode = "0x";
                                return [4 /*yield*/, (0, proxies_1.calculateProxyAddress)(factory, singleton.address, initCode, saltNonce)];
                            case 2:
                                proxyAddress = _j.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(factory.createProxyWithNonce(singleton.address, initCode, saltNonce))
                                        .to.emit(factory, "ProxyCreation")
                                        .withArgs(proxyAddress, singleton.address)];
                            case 3:
                                _j.sent();
                                proxy = singleton.attach(proxyAddress);
                                _b = chai_1.expect;
                                return [4 /*yield*/, proxy.creator()];
                            case 4:
                                _b.apply(void 0, [_j.sent()]).to.be.eq(constants_1.AddressZero);
                                _c = chai_1.expect;
                                return [4 /*yield*/, proxy.isInitialized()];
                            case 5:
                                _c.apply(void 0, [_j.sent()]).to.be.eq(false);
                                _d = chai_1.expect;
                                return [4 /*yield*/, proxy.masterCopy()];
                            case 6:
                                _d.apply(void 0, [_j.sent()]).to.be.eq(singleton.address);
                                _e = chai_1.expect;
                                return [4 /*yield*/, singleton.masterCopy()];
                            case 7:
                                _e.apply(void 0, [_j.sent()]).to.be.eq(constants_1.AddressZero);
                                _g = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getCode(proxyAddress)];
                            case 8:
                                _h = (_f = _g.apply(void 0, [_j.sent()]).to.be).eq;
                                return [4 /*yield*/, (0, setup_1.getSafeProxyRuntimeCode)()];
                            case 9:
                                _h.apply(_f, [_j.sent()]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should emit event with initializing", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, factory, singleton, initCode, proxyAddress, proxy, _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _j.sent(), factory = _a.factory, singleton = _a.singleton;
                                initCode = singleton.interface.encodeFunctionData("init", []);
                                return [4 /*yield*/, (0, proxies_1.calculateProxyAddress)(factory, singleton.address, initCode, saltNonce)];
                            case 2:
                                proxyAddress = _j.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(factory.createProxyWithNonce(singleton.address, initCode, saltNonce))
                                        .to.emit(factory, "ProxyCreation")
                                        .withArgs(proxyAddress, singleton.address)];
                            case 3:
                                _j.sent();
                                proxy = singleton.attach(proxyAddress);
                                _b = chai_1.expect;
                                return [4 /*yield*/, proxy.creator()];
                            case 4:
                                _b.apply(void 0, [_j.sent()]).to.be.eq(factory.address);
                                _c = chai_1.expect;
                                return [4 /*yield*/, proxy.isInitialized()];
                            case 5:
                                _c.apply(void 0, [_j.sent()]).to.be.eq(true);
                                _d = chai_1.expect;
                                return [4 /*yield*/, proxy.masterCopy()];
                            case 6:
                                _d.apply(void 0, [_j.sent()]).to.be.eq(singleton.address);
                                _e = chai_1.expect;
                                return [4 /*yield*/, singleton.masterCopy()];
                            case 7:
                                _e.apply(void 0, [_j.sent()]).to.be.eq(constants_1.AddressZero);
                                _g = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getCode(proxyAddress)];
                            case 8:
                                _h = (_f = _g.apply(void 0, [_j.sent()]).to.be).eq;
                                return [4 /*yield*/, (0, setup_1.getSafeProxyRuntimeCode)()];
                            case 9:
                                _h.apply(_f, [_j.sent()]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should deploy proxy to create2 address with chainid included in salt", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, factory, singleton, provider, initCode, proxyAddress, _b, _c, _d, _e, _f, _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _h.sent(), factory = _a.factory, singleton = _a.singleton;
                                provider = hardhat_1.default.ethers.provider;
                                initCode = singleton.interface.encodeFunctionData("init", []);
                                _b = proxies_1.calculateChainSpecificProxyAddress;
                                _c = [factory, singleton.address, initCode, saltNonce];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 2: return [4 /*yield*/, _b.apply(void 0, _c.concat([_h.sent()]))];
                            case 3:
                                proxyAddress = _h.sent();
                                _d = chai_1.expect;
                                return [4 /*yield*/, provider.getCode(proxyAddress)];
                            case 4:
                                _d.apply(void 0, [_h.sent()]).to.eq("0x");
                                return [4 /*yield*/, factory.createChainSpecificProxyWithNonce(singleton.address, initCode, saltNonce)];
                            case 5:
                                _h.sent();
                                _f = chai_1.expect;
                                return [4 /*yield*/, provider.getCode(proxyAddress)];
                            case 6:
                                _g = (_e = _f.apply(void 0, [_h.sent()]).to.be).eq;
                                return [4 /*yield*/, (0, setup_1.getSafeProxyRuntimeCode)()];
                            case 7:
                                _g.apply(_e, [_h.sent()]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should not be able to deploy same proxy twice", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, factory, singleton, initCode, proxyAddress;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), factory = _a.factory, singleton = _a.singleton;
                                initCode = singleton.interface.encodeFunctionData("init", []);
                                return [4 /*yield*/, (0, proxies_1.calculateProxyAddress)(factory, singleton.address, initCode, saltNonce)];
                            case 2:
                                proxyAddress = _b.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(factory.createProxyWithNonce(singleton.address, initCode, saltNonce))
                                        .to.emit(factory, "ProxyCreation")
                                        .withArgs(proxyAddress, singleton.address)];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(factory.createProxyWithNonce(singleton.address, initCode, saltNonce)).to.be.revertedWith("Create2 call failed")];
                            case 4:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("createProxyWithCallback", function () { return __awaiter(void 0, void 0, void 0, function () {
            var saltNonce;
            return __generator(this, function (_a) {
                saltNonce = 42;
                it("check callback is invoked", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, factory, mock, singleton, callback, initCode, proxyAddress, _b, callbackData, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _d.sent(), factory = _a.factory, mock = _a.mock, singleton = _a.singleton;
                                return [4 /*yield*/, hardhat_1.default.ethers.getContractAt("IProxyCreationCallback", mock.address)];
                            case 2:
                                callback = _d.sent();
                                initCode = singleton.interface.encodeFunctionData("init", []);
                                return [4 /*yield*/, (0, proxies_1.calculateProxyAddressWithCallback)(factory, singleton.address, initCode, saltNonce, mock.address)];
                            case 3:
                                proxyAddress = _d.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(factory.createProxyWithCallback(singleton.address, initCode, saltNonce, mock.address))
                                        .to.emit(factory, "ProxyCreation")
                                        .withArgs(proxyAddress, singleton.address)];
                            case 4:
                                _d.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, mock.callStatic.invocationCount()];
                            case 5:
                                _b.apply(void 0, [_d.sent()]).to.be.deep.equal(ethers_1.BigNumber.from(1));
                                callbackData = callback.interface.encodeFunctionData("proxyCreated", [
                                    proxyAddress,
                                    factory.address,
                                    initCode,
                                    saltNonce,
                                ]);
                                _c = chai_1.expect;
                                return [4 /*yield*/, mock.callStatic.invocationCountForMethod(callbackData)];
                            case 6:
                                _c.apply(void 0, [_d.sent()]).to.be.deep.equal(ethers_1.BigNumber.from(1));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("check callback error cancels deployment", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, factory, mock, singleton, initCode, proxyAddress;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), factory = _a.factory, mock = _a.mock, singleton = _a.singleton;
                                initCode = "0x";
                                return [4 /*yield*/, mock.givenAnyRevert()];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(factory.createProxyWithCallback(singleton.address, initCode, saltNonce, mock.address), "Should fail if callback fails").to.be.reverted];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, mock.reset()];
                            case 4:
                                _b.sent();
                                return [4 /*yield*/, (0, proxies_1.calculateProxyAddressWithCallback)(factory, singleton.address, initCode, saltNonce, mock.address)];
                            case 5:
                                proxyAddress = _b.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(factory.createProxyWithCallback(singleton.address, initCode, saltNonce, mock.address))
                                        .to.emit(factory, "ProxyCreation")
                                        .withArgs(proxyAddress, singleton.address)];
                            case 6:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should work without callback", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, factory, singleton, initCode, proxyAddress, proxy, _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _j.sent(), factory = _a.factory, singleton = _a.singleton;
                                initCode = "0x";
                                return [4 /*yield*/, (0, proxies_1.calculateProxyAddressWithCallback)(factory, singleton.address, initCode, saltNonce, constants_1.AddressZero)];
                            case 2:
                                proxyAddress = _j.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(factory.createProxyWithCallback(singleton.address, initCode, saltNonce, constants_1.AddressZero))
                                        .to.emit(factory, "ProxyCreation")
                                        .withArgs(proxyAddress, singleton.address)];
                            case 3:
                                _j.sent();
                                proxy = singleton.attach(proxyAddress);
                                _b = chai_1.expect;
                                return [4 /*yield*/, proxy.creator()];
                            case 4:
                                _b.apply(void 0, [_j.sent()]).to.be.eq(constants_1.AddressZero);
                                _c = chai_1.expect;
                                return [4 /*yield*/, proxy.isInitialized()];
                            case 5:
                                _c.apply(void 0, [_j.sent()]).to.be.eq(false);
                                _d = chai_1.expect;
                                return [4 /*yield*/, proxy.masterCopy()];
                            case 6:
                                _d.apply(void 0, [_j.sent()]).to.be.eq(singleton.address);
                                _e = chai_1.expect;
                                return [4 /*yield*/, singleton.masterCopy()];
                            case 7:
                                _e.apply(void 0, [_j.sent()]).to.be.eq(constants_1.AddressZero);
                                _g = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getCode(proxyAddress)];
                            case 8:
                                _h = (_f = _g.apply(void 0, [_j.sent()]).to.be).eq;
                                return [4 /*yield*/, (0, setup_1.getSafeProxyRuntimeCode)()];
                            case 9:
                                _h.apply(_f, [_j.sent()]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        return [2 /*return*/];
    });
}); });
