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
var encoding_1 = require("../utils/encoding");
describe("Safe", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user1, user2, setupTests;
    return __generator(this, function (_b) {
        _a = hardhat_1.waffle.provider.getWallets(), user1 = _a[0], user2 = _a[1];
        setupTests = hardhat_1.deployments.createFixture(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var setterSource, storageSetter, reverterSource, reverter;
            var _c;
            var deployments = _b.deployments;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, deployments.fixture()];
                    case 1:
                        _d.sent();
                        setterSource = "\n            contract StorageSetter {\n                function setStorage(bytes3 data) public {\n                    bytes32 slot = 0x4242424242424242424242424242424242424242424242424242424242424242;\n                    // solhint-disable-next-line no-inline-assembly\n                    assembly {\n                        sstore(slot, data)\n                    }\n                }\n            }";
                        return [4 /*yield*/, (0, setup_1.deployContract)(user1, setterSource)];
                    case 2:
                        storageSetter = _d.sent();
                        reverterSource = "\n            contract Reverter {\n                function revert() public {\n                    require(false, \"Shit happens\");\n                }\n            }";
                        return [4 /*yield*/, (0, setup_1.deployContract)(user1, reverterSource)];
                    case 3:
                        reverter = _d.sent();
                        _c = {};
                        return [4 /*yield*/, (0, setup_1.getSafeWithOwners)([user1.address])];
                    case 4: return [2 /*return*/, (_c.safe = _d.sent(),
                            _c.reverter = reverter,
                            _c.storageSetter = storageSetter,
                            _c)];
                }
            });
        }); });
        describe("execTransaction", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should revert if too little gas is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, signatureBytes, _b;
                    var _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_d.sent()).safe;
                                _a = execution_1.buildSafeTransaction;
                                _c = { to: safe.address, safeTxGas: 1000000 };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_c.nonce = _d.sent(), _c)]);
                                _b = execution_1.buildSignatureBytes;
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, tx, true)];
                            case 3:
                                signatureBytes = _b.apply(void 0, [[_d.sent()]]);
                                return [4 /*yield*/, (0, chai_1.expect)(safe.execTransaction(tx.to, tx.value, tx.data, tx.operation, tx.safeTxGas, tx.baseGas, tx.gasPrice, tx.gasToken, tx.refundReceiver, signatureBytes, { gasLimit: 1000000 })).to.be.revertedWith("GS010")];
                            case 4:
                                _d.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should emit event for successful call execution", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, storageSetter, txHash, _b, _c, _d, _e, _f, _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _h.sent(), safe = _a.safe, storageSetter = _a.storageSetter;
                                _b = execution_1.calculateSafeTransactionHash;
                                _c = [safe];
                                _d = execution_1.buildContractCall;
                                _e = [storageSetter, "setStorage", ["0xbaddad"]];
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                _c = _c.concat([_d.apply(void 0, _e.concat([_h.sent()]))]);
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 3:
                                txHash = _b.apply(void 0, _c.concat([_h.sent()]));
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, storageSetter, "setStorage", ["0xbaddad"], [user1]))
                                        .to.emit(safe, "ExecutionSuccess")
                                        .withArgs(txHash, 0)];
                            case 4:
                                _h.sent();
                                _f = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, "0x4242424242424242424242424242424242424242424242424242424242424242")];
                            case 5: return [4 /*yield*/, _f.apply(void 0, [_h.sent()]).to.be.eq("0x" + "".padEnd(64, "0"))];
                            case 6:
                                _h.sent();
                                _g = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(storageSetter.address, "0x4242424242424242424242424242424242424242424242424242424242424242")];
                            case 7: return [4 /*yield*/, _g.apply(void 0, [_h.sent()]).to.be.eq("0x" + "baddad".padEnd(64, "0"))];
                            case 8:
                                _h.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should emit event for failed call execution if safeTxGas > 0", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, reverter;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, reverter = _a.reverter;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, reverter, "revert", [], [user1], false, { safeTxGas: 1 })).to.emit(safe, "ExecutionFailure")];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should emit event for failed call execution if gasPrice > 0", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, reverter;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, reverter = _a.reverter;
                                // Fund refund
                                return [4 /*yield*/, user1.sendTransaction({ to: safe.address, value: 10000000 })];
                            case 2:
                                // Fund refund
                                _b.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, reverter, "revert", [], [user1], false, { gasPrice: 1 })).to.emit(safe, "ExecutionFailure")];
                            case 3:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert for failed call execution if gasPrice == 0 and safeTxGas == 0", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, reverter;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, reverter = _a.reverter;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, reverter, "revert", [], [user1])).to.revertedWith("GS013")];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should emit event for successful delegatecall execution", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, storageSetter, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _d.sent(), safe = _a.safe, storageSetter = _a.storageSetter;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, storageSetter, "setStorage", ["0xbaddad"], [user1], true)).to.emit(safe, "ExecutionSuccess")];
                            case 2:
                                _d.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, "0x4242424242424242424242424242424242424242424242424242424242424242")];
                            case 3: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).to.be.eq("0x" + "baddad".padEnd(64, "0"))];
                            case 4:
                                _d.sent();
                                _c = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(storageSetter.address, "0x4242424242424242424242424242424242424242424242424242424242424242")];
                            case 5: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).to.be.eq("0x" + "".padEnd(64, "0"))];
                            case 6:
                                _d.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should emit event for failed delegatecall execution  if safeTxGas > 0", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, reverter, txHash, _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _f.sent(), safe = _a.safe, reverter = _a.reverter;
                                _b = execution_1.calculateSafeTransactionHash;
                                _c = [safe];
                                _d = execution_1.buildContractCall;
                                _e = [reverter, "revert", []];
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                _c = _c.concat([_d.apply(void 0, _e.concat([_f.sent(), true, { safeTxGas: 1 }]))]);
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 3:
                                txHash = _b.apply(void 0, _c.concat([_f.sent()]));
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, reverter, "revert", [], [user1], true, { safeTxGas: 1 }))
                                        .to.emit(safe, "ExecutionFailure")
                                        .withArgs(txHash, 0)];
                            case 4:
                                _f.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should emit event for failed delegatecall execution if gasPrice > 0", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, reverter;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, reverter = _a.reverter;
                                return [4 /*yield*/, user1.sendTransaction({ to: safe.address, value: 10000000 })];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, reverter, "revert", [], [user1], true, { gasPrice: 1 })).to.emit(safe, "ExecutionFailure")];
                            case 3:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should emit event for failed delegatecall execution if gasPrice == 0 and safeTxGas == 0", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, reverter;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, reverter = _a.reverter;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, reverter, "revert", [], [user1], true)).to.revertedWith("GS013")];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert on unknown operation", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, _b, _c, _d;
                    var _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_f.sent()).safe;
                                _a = execution_1.buildSafeTransaction;
                                _e = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_e.nonce = _f.sent(), _e.operation = 2, _e)]);
                                _b = chai_1.expect;
                                _c = execution_1.executeTx;
                                _d = [safe, tx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, tx, true)];
                            case 3: return [4 /*yield*/, _b.apply(void 0, [_c.apply(void 0, _d.concat([[_f.sent()]]))]).to.be.reverted];
                            case 4:
                                _f.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should emit payment in success event", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, userBalance, _b, executedTx, _c, _d, _e, receipt, logIndex, successEvent, _f, _g, _h, _j, _k;
                    var _l;
                    return __generator(this, function (_m) {
                        switch (_m.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_m.sent()).safe;
                                _a = execution_1.buildSafeTransaction;
                                _l = {
                                    to: user1.address
                                };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_l.nonce = _m.sent(),
                                        _l.operation = 0,
                                        _l.gasPrice = 1,
                                        _l.safeTxGas = 100000,
                                        _l.refundReceiver = user2.address,
                                        _l)]);
                                return [4 /*yield*/, user1.sendTransaction({ to: safe.address, value: (0, units_1.parseEther)("1") })];
                            case 3:
                                _m.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(user2.address)];
                            case 4:
                                userBalance = _m.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(safe.address)];
                            case 5: return [4 /*yield*/, _b.apply(void 0, [_m.sent()]).to.be.deep.eq((0, units_1.parseEther)("1"))];
                            case 6:
                                _m.sent();
                                _c = chai_1.expect;
                                _d = execution_1.executeTx;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, tx, true)];
                            case 7: return [4 /*yield*/, _c.apply(void 0, [_d.apply(void 0, _e.concat([[_m.sent()]])).then(function (tx) {
                                        executedTx = tx;
                                        return tx;
                                    })]).to.emit(safe, "ExecutionSuccess")];
                            case 8:
                                _m.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getTransactionReceipt(executedTx.hash)];
                            case 9:
                                receipt = _m.sent();
                                logIndex = receipt.logs.length - 1;
                                successEvent = safe.interface.decodeEventLog("ExecutionSuccess", receipt.logs[logIndex].data, receipt.logs[logIndex].topics);
                                _g = (_f = (0, chai_1.expect)(successEvent.txHash).to.be).eq;
                                _h = execution_1.calculateSafeTransactionHash;
                                _j = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 10:
                                _g.apply(_f, [_h.apply(void 0, _j.concat([_m.sent()]))]);
                                // Gas costs are around 3000, so even if we specified a safeTxGas from 100000 we should not use more
                                (0, chai_1.expect)(successEvent.payment.toNumber()).to.be.lte(5000);
                                _k = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(user2.address)];
                            case 11: return [4 /*yield*/, _k.apply(void 0, [_m.sent()]).to.be.deep.eq(userBalance.add(successEvent.payment))];
                            case 12:
                                _m.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should emit payment in failure event", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, storageSetter, data, tx, _b, userBalance, _c, executedTx, _d, _e, _f, receipt, logIndex, successEvent, _g, _h, _j, _k, _l;
                    var _m;
                    return __generator(this, function (_o) {
                        switch (_o.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _o.sent(), safe = _a.safe, storageSetter = _a.storageSetter;
                                data = storageSetter.interface.encodeFunctionData("setStorage", [0xbaddad]);
                                _b = execution_1.buildSafeTransaction;
                                _m = {
                                    to: storageSetter.address,
                                    data: data
                                };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _b.apply(void 0, [(_m.nonce = _o.sent(),
                                        _m.operation = 0,
                                        _m.gasPrice = 1,
                                        _m.safeTxGas = 3000,
                                        _m.refundReceiver = user2.address,
                                        _m)]);
                                return [4 /*yield*/, user1.sendTransaction({ to: safe.address, value: (0, units_1.parseEther)("1") })];
                            case 3:
                                _o.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(user2.address)];
                            case 4:
                                userBalance = _o.sent();
                                _c = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(safe.address)];
                            case 5: return [4 /*yield*/, _c.apply(void 0, [_o.sent()]).to.be.deep.eq((0, units_1.parseEther)("1"))];
                            case 6:
                                _o.sent();
                                _d = chai_1.expect;
                                _e = execution_1.executeTx;
                                _f = [safe, tx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, tx, true)];
                            case 7: return [4 /*yield*/, _d.apply(void 0, [_e.apply(void 0, _f.concat([[_o.sent()]])).then(function (tx) {
                                        executedTx = tx;
                                        return tx;
                                    })]).to.emit(safe, "ExecutionFailure")];
                            case 8:
                                _o.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getTransactionReceipt(executedTx.hash)];
                            case 9:
                                receipt = _o.sent();
                                logIndex = receipt.logs.length - 1;
                                successEvent = safe.interface.decodeEventLog("ExecutionFailure", receipt.logs[logIndex].data, receipt.logs[logIndex].topics);
                                _h = (_g = (0, chai_1.expect)(successEvent.txHash).to.be).eq;
                                _j = execution_1.calculateSafeTransactionHash;
                                _k = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 10:
                                _h.apply(_g, [_j.apply(void 0, _k.concat([_o.sent()]))]);
                                // FIXME: When running out of gas the gas used is slightly higher than the safeTxGas and the user has to overpay
                                (0, chai_1.expect)(successEvent.payment.toNumber()).to.be.lte(10000);
                                _l = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(user2.address)];
                            case 11: return [4 /*yield*/, _l.apply(void 0, [_o.sent()]).to.be.deep.eq(userBalance.add(successEvent.payment))];
                            case 12:
                                _o.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should be possible to manually increase gas", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, gasUserSource, gasUser, to, data, safeTxGas, tx, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                    var _l;
                    return __generator(this, function (_m) {
                        switch (_m.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_m.sent()).safe;
                                gasUserSource = "\n            contract GasUser {\n        \n                uint256[] public data;\n        \n                constructor() payable {}\n        \n                function nested(uint256 level, uint256 count) external {\n                    if (level == 0) {\n                        for (uint256 i = 0; i < count; i++) {\n                            data.push(i);\n                        }\n                        return;\n                    }\n                    this.nested(level - 1, count);\n                }\n        \n                function useGas(uint256 count) public {\n                    this.nested(6, count);\n                    this.nested(8, count);\n                }\n            }";
                                return [4 /*yield*/, (0, setup_1.deployContract)(user1, gasUserSource)];
                            case 2:
                                gasUser = _m.sent();
                                to = gasUser.address;
                                data = gasUser.interface.encodeFunctionData("useGas", [80]);
                                safeTxGas = 10000;
                                _a = execution_1.buildSafeTransaction;
                                _l = { to: to, data: data, safeTxGas: safeTxGas };
                                return [4 /*yield*/, safe.nonce()];
                            case 3:
                                tx = _a.apply(void 0, [(_l.nonce = _m.sent(), _l)]);
                                _b = chai_1.expect;
                                _c = execution_1.executeTx;
                                _d = [safe, tx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, tx, true)];
                            case 4: return [4 /*yield*/, _b.apply(void 0, [_c.apply(void 0, _d.concat([[_m.sent()], { gasLimit: 170000 }])),
                                    "Safe transaction should fail with low gasLimit"]).to.emit(safe, "ExecutionFailure")];
                            case 5:
                                _m.sent();
                                _e = chai_1.expect;
                                _f = execution_1.executeTx;
                                _g = [safe, tx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, tx, true)];
                            case 6: return [4 /*yield*/, _e.apply(void 0, [_f.apply(void 0, _g.concat([[_m.sent()], { gasLimit: 6000000 }])),
                                    "Safe transaction should succeed with high gasLimit"]).to.emit(safe, "ExecutionSuccess")];
                            case 7:
                                _m.sent();
                                // This should only work if the gasPrice is 0
                                tx.gasPrice = 1;
                                return [4 /*yield*/, user1.sendTransaction({ to: safe.address, value: (0, units_1.parseEther)("1") })];
                            case 8:
                                _m.sent();
                                _h = chai_1.expect;
                                _j = execution_1.executeTx;
                                _k = [safe, tx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, tx, true)];
                            case 9: return [4 /*yield*/, _h.apply(void 0, [_j.apply(void 0, _k.concat([[_m.sent()], { gasLimit: 6000000 }])),
                                    "Safe transaction should fail with gasPrice 1 and high gasLimit"]).to.emit(safe, "ExecutionFailure")];
                            case 10:
                                _m.sent();
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
