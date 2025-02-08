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
var execution_1 = require("../../src/utils/execution");
var units_1 = require("@ethersproject/units");
var CONTRACT_SOURCE = "\ncontract Test {\n    address public creator;\n    constructor() payable {\n        creator = msg.sender;\n    }\n\n    function x() public pure returns (uint) {\n        return 21;\n    }\n}";
describe("CreateCall", function () { return __awaiter(void 0, void 0, void 0, function () {
    var user1, setupTests;
    return __generator(this, function (_a) {
        user1 = hardhat_1.waffle.provider.getWallets()[0];
        setupTests = hardhat_1.deployments.createFixture(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var testContract;
            var _c;
            var deployments = _b.deployments;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, deployments.fixture()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, (0, setup_1.compile)(CONTRACT_SOURCE)];
                    case 2:
                        testContract = _d.sent();
                        _c = {};
                        return [4 /*yield*/, (0, setup_1.getSafeWithOwners)([user1.address])];
                    case 3:
                        _c.safe = _d.sent();
                        return [4 /*yield*/, (0, setup_1.getCreateCall)()];
                    case 4: return [2 /*return*/, (_c.createCall = _d.sent(),
                            _c.testContract = testContract,
                            _c)];
                }
            });
        }); });
        describe("performCreate", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should revert if called directly and no value is on the factory", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, createCall, testContract;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), createCall = _a.createCall, testContract = _a.testContract;
                                return [4 /*yield*/, (0, chai_1.expect)(createCall.performCreate(1, testContract.data)).to.be.revertedWith("Could not deploy contract")];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can call factory directly", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, createCall, testContract, createCallNonce, address, newContract, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _c.sent(), createCall = _a.createCall, testContract = _a.testContract;
                                return [4 /*yield*/, hardhat_1.ethers.provider.getTransactionCount(createCall.address)];
                            case 2:
                                createCallNonce = _c.sent();
                                address = hardhat_1.ethers.utils.getContractAddress({ from: createCall.address, nonce: createCallNonce });
                                return [4 /*yield*/, (0, chai_1.expect)(createCall.performCreate(0, testContract.data)).to.emit(createCall, "ContractCreation").withArgs(address)];
                            case 3:
                                _c.sent();
                                newContract = new hardhat_1.ethers.Contract(address, testContract.interface, user1);
                                _b = chai_1.expect;
                                return [4 /*yield*/, newContract.creator()];
                            case 4:
                                _b.apply(void 0, [_c.sent()]).to.be.eq(createCall.address);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should fail if Safe does not have value to send along", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, createCall, testContract, tx, _b, _c, _d, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _g.sent(), safe = _a.safe, createCall = _a.createCall, testContract = _a.testContract;
                                _b = execution_1.buildContractCall;
                                _c = [createCall, "performCreate", [1, testContract.data]];
                                return [4 /*yield*/, safe.nonce()];
                            case 2: return [4 /*yield*/, _b.apply(void 0, _c.concat([_g.sent(), true]))];
                            case 3:
                                tx = _g.sent();
                                _d = chai_1.expect;
                                _e = execution_1.executeTx;
                                _f = [safe, tx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, tx, true)];
                            case 4: return [4 /*yield*/, _d.apply(void 0, [_e.apply(void 0, _f.concat([[_g.sent()]]))]).to.revertedWith("GS013")];
                            case 5:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should successfully create contract and emit event", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, createCall, testContract, safeEthereumNonce, address, safeCreateCall, tx, _b, _c, _d, _e, _f, newContract, _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _h.sent(), safe = _a.safe, createCall = _a.createCall, testContract = _a.testContract;
                                return [4 /*yield*/, hardhat_1.ethers.provider.getTransactionCount(safe.address)];
                            case 2:
                                safeEthereumNonce = _h.sent();
                                address = hardhat_1.ethers.utils.getContractAddress({ from: safe.address, nonce: safeEthereumNonce });
                                safeCreateCall = createCall.attach(safe.address);
                                _b = execution_1.buildContractCall;
                                _c = [createCall, "performCreate", [0, testContract.data]];
                                return [4 /*yield*/, safe.nonce()];
                            case 3: return [4 /*yield*/, _b.apply(void 0, _c.concat([_h.sent(), true]))];
                            case 4:
                                tx = _h.sent();
                                _d = chai_1.expect;
                                _e = execution_1.executeTx;
                                _f = [safe, tx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, tx, true)];
                            case 5: return [4 /*yield*/, _d.apply(void 0, [_e.apply(void 0, _f.concat([[_h.sent()]]))])
                                    .to.emit(safe, "ExecutionSuccess")
                                    .and.to.emit(safeCreateCall, "ContractCreation")
                                    .withArgs(address)];
                            case 6:
                                _h.sent();
                                newContract = new hardhat_1.ethers.Contract(address, testContract.interface, user1);
                                _g = chai_1.expect;
                                return [4 /*yield*/, newContract.creator()];
                            case 7:
                                _g.apply(void 0, [_h.sent()]).to.be.eq(safe.address);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should successfully create contract and send along ether", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, createCall, testContract, _b, safeEthereumNonce, address, safeCreateCall, tx, _c, _d, _e, _f, _g, _h, _j, newContract, _k;
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _l.sent(), safe = _a.safe, createCall = _a.createCall, testContract = _a.testContract;
                                return [4 /*yield*/, user1.sendTransaction({ to: safe.address, value: (0, units_1.parseEther)("1") })];
                            case 2:
                                _l.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(safe.address)];
                            case 3: return [4 /*yield*/, _b.apply(void 0, [_l.sent()]).to.be.deep.eq((0, units_1.parseEther)("1"))];
                            case 4:
                                _l.sent();
                                return [4 /*yield*/, hardhat_1.ethers.provider.getTransactionCount(safe.address)];
                            case 5:
                                safeEthereumNonce = _l.sent();
                                address = hardhat_1.ethers.utils.getContractAddress({ from: safe.address, nonce: safeEthereumNonce });
                                safeCreateCall = createCall.attach(safe.address);
                                _c = execution_1.buildContractCall;
                                _d = [createCall, "performCreate", [(0, units_1.parseEther)("1"), testContract.data]];
                                return [4 /*yield*/, safe.nonce()];
                            case 6: return [4 /*yield*/, _c.apply(void 0, _d.concat([_l.sent(), true]))];
                            case 7:
                                tx = _l.sent();
                                _e = chai_1.expect;
                                _f = execution_1.executeTx;
                                _g = [safe, tx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, tx, true)];
                            case 8: return [4 /*yield*/, _e.apply(void 0, [_f.apply(void 0, _g.concat([[_l.sent()]]))])
                                    .to.emit(safe, "ExecutionSuccess")
                                    .and.to.emit(safeCreateCall, "ContractCreation")
                                    .withArgs(address)];
                            case 9:
                                _l.sent();
                                _h = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(safe.address)];
                            case 10: return [4 /*yield*/, _h.apply(void 0, [_l.sent()]).to.be.deep.eq((0, units_1.parseEther)("0"))];
                            case 11:
                                _l.sent();
                                _j = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(address)];
                            case 12: return [4 /*yield*/, _j.apply(void 0, [_l.sent()]).to.be.deep.eq((0, units_1.parseEther)("1"))];
                            case 13:
                                _l.sent();
                                newContract = new hardhat_1.ethers.Contract(address, testContract.interface, user1);
                                _k = chai_1.expect;
                                return [4 /*yield*/, newContract.creator()];
                            case 14:
                                _k.apply(void 0, [_l.sent()]).to.be.eq(safe.address);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("performCreate2", function () { return __awaiter(void 0, void 0, void 0, function () {
            var salt;
            return __generator(this, function (_a) {
                salt = hardhat_1.ethers.utils.keccak256(hardhat_1.ethers.utils.toUtf8Bytes("createCall"));
                it("should revert if called directly and no value is on the factory", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, createCall, testContract;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), createCall = _a.createCall, testContract = _a.testContract;
                                return [4 /*yield*/, (0, chai_1.expect)(createCall.performCreate2(1, testContract.data, salt)).to.be.revertedWith("Could not deploy contract")];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can call factory directly", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, createCall, testContract, address, newContract, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _c.sent(), createCall = _a.createCall, testContract = _a.testContract;
                                address = hardhat_1.ethers.utils.getCreate2Address(createCall.address, salt, hardhat_1.ethers.utils.keccak256(testContract.data));
                                return [4 /*yield*/, (0, chai_1.expect)(createCall.performCreate2(0, testContract.data, salt)).to.emit(createCall, "ContractCreation").withArgs(address)];
                            case 2:
                                _c.sent();
                                newContract = new hardhat_1.ethers.Contract(address, testContract.interface, user1);
                                _b = chai_1.expect;
                                return [4 /*yield*/, newContract.creator()];
                            case 3:
                                _b.apply(void 0, [_c.sent()]).to.be.eq(createCall.address);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should fail if Safe does not have value to send along", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, createCall, testContract, tx, _b, _c, _d, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _g.sent(), safe = _a.safe, createCall = _a.createCall, testContract = _a.testContract;
                                _b = execution_1.buildContractCall;
                                _c = [createCall, "performCreate2", [1, testContract.data, salt]];
                                return [4 /*yield*/, safe.nonce()];
                            case 2: return [4 /*yield*/, _b.apply(void 0, _c.concat([_g.sent(), true]))];
                            case 3:
                                tx = _g.sent();
                                _d = chai_1.expect;
                                _e = execution_1.executeTx;
                                _f = [safe, tx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, tx, true)];
                            case 4: return [4 /*yield*/, _d.apply(void 0, [_e.apply(void 0, _f.concat([[_g.sent()]]))]).to.revertedWith("GS013")];
                            case 5:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should successfully create contract and emit event", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, createCall, testContract, address, safeCreateCall, tx, _b, _c, _d, _e, _f, newContract, _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _h.sent(), safe = _a.safe, createCall = _a.createCall, testContract = _a.testContract;
                                address = hardhat_1.ethers.utils.getCreate2Address(safe.address, salt, hardhat_1.ethers.utils.keccak256(testContract.data));
                                safeCreateCall = createCall.attach(safe.address);
                                _b = execution_1.buildContractCall;
                                _c = [createCall, "performCreate2", [0, testContract.data, salt]];
                                return [4 /*yield*/, safe.nonce()];
                            case 2: return [4 /*yield*/, _b.apply(void 0, _c.concat([_h.sent(), true]))];
                            case 3:
                                tx = _h.sent();
                                _d = chai_1.expect;
                                _e = execution_1.executeTx;
                                _f = [safe, tx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, tx, true)];
                            case 4: return [4 /*yield*/, _d.apply(void 0, [_e.apply(void 0, _f.concat([[_h.sent()]]))])
                                    .to.emit(safe, "ExecutionSuccess")
                                    .and.to.emit(safeCreateCall, "ContractCreation")
                                    .withArgs(address)];
                            case 5:
                                _h.sent();
                                newContract = new hardhat_1.ethers.Contract(address, testContract.interface, user1);
                                _g = chai_1.expect;
                                return [4 /*yield*/, newContract.creator()];
                            case 6:
                                _g.apply(void 0, [_h.sent()]).to.be.eq(safe.address);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should successfully create contract and send along ether", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, createCall, testContract, _b, address, safeCreateCall, tx, _c, _d, _e, _f, _g, _h, _j, newContract, _k;
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _l.sent(), safe = _a.safe, createCall = _a.createCall, testContract = _a.testContract;
                                return [4 /*yield*/, user1.sendTransaction({ to: safe.address, value: (0, units_1.parseEther)("1") })];
                            case 2:
                                _l.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(safe.address)];
                            case 3: return [4 /*yield*/, _b.apply(void 0, [_l.sent()]).to.be.deep.eq((0, units_1.parseEther)("1"))];
                            case 4:
                                _l.sent();
                                address = hardhat_1.ethers.utils.getCreate2Address(safe.address, salt, hardhat_1.ethers.utils.keccak256(testContract.data));
                                safeCreateCall = createCall.attach(safe.address);
                                _c = execution_1.buildContractCall;
                                _d = [createCall,
                                    "performCreate2",
                                    [(0, units_1.parseEther)("1"), testContract.data, salt]];
                                return [4 /*yield*/, safe.nonce()];
                            case 5: return [4 /*yield*/, _c.apply(void 0, _d.concat([_l.sent(), true]))];
                            case 6:
                                tx = _l.sent();
                                _e = chai_1.expect;
                                _f = execution_1.executeTx;
                                _g = [safe, tx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, tx, true)];
                            case 7: return [4 /*yield*/, _e.apply(void 0, [_f.apply(void 0, _g.concat([[_l.sent()]]))])
                                    .to.emit(safe, "ExecutionSuccess")
                                    .and.to.emit(safeCreateCall, "ContractCreation")
                                    .withArgs(address)];
                            case 8:
                                _l.sent();
                                _h = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(safe.address)];
                            case 9: return [4 /*yield*/, _h.apply(void 0, [_l.sent()]).to.be.deep.eq((0, units_1.parseEther)("0"))];
                            case 10:
                                _l.sent();
                                _j = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(address)];
                            case 11: return [4 /*yield*/, _j.apply(void 0, [_l.sent()]).to.be.deep.eq((0, units_1.parseEther)("1"))];
                            case 12:
                                _l.sent();
                                newContract = new hardhat_1.ethers.Contract(address, testContract.interface, user1);
                                _k = chai_1.expect;
                                return [4 /*yield*/, newContract.creator()];
                            case 13:
                                _k.apply(void 0, [_l.sent()]).to.be.eq(safe.address);
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
