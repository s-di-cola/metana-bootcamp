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
var multisend_1 = require("../../src/utils/multisend");
var units_1 = require("@ethersproject/units");
describe("MultiSend", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user1, user2, setupTests;
    return __generator(this, function (_b) {
        _a = hardhat_1.waffle.provider.getWallets(), user1 = _a[0], user2 = _a[1];
        setupTests = hardhat_1.deployments.createFixture(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var setterSource, storageSetter;
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
                        _c = {};
                        return [4 /*yield*/, (0, setup_1.getSafeWithOwners)([user1.address])];
                    case 3:
                        _c.safe = _d.sent();
                        return [4 /*yield*/, (0, setup_1.getMultiSend)()];
                    case 4:
                        _c.multiSend = _d.sent();
                        return [4 /*yield*/, (0, setup_1.getMock)()];
                    case 5: return [2 /*return*/, (_c.mock = _d.sent(),
                            _c.storageSetter = storageSetter,
                            _c)];
                }
            });
        }); });
        describe("multiSend", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should enforce delegatecall to MultiSend", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var multiSend, source, killLib, nestedTransactionData, multiSendCode, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                multiSend = (_b.sent()).multiSend;
                                source = "\n            contract Test {\n                function killme() public {\n                    selfdestruct(payable(msg.sender));\n                }\n            }";
                                return [4 /*yield*/, (0, setup_1.deployContract)(user1, source)];
                            case 2:
                                killLib = _b.sent();
                                nestedTransactionData = (0, multisend_1.encodeMultiSend)([(0, execution_1.buildContractCall)(killLib, "killme", [], 0)]);
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getCode(multiSend.address)];
                            case 3:
                                multiSendCode = _b.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(multiSend.multiSend(nestedTransactionData)).to.be.revertedWith("MultiSend should only be called via delegatecall")];
                            case 4:
                                _b.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getCode(multiSend.address)];
                            case 5:
                                _a.apply(void 0, [_b.sent()]).to.be.eq(multiSendCode);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("Should fail when using invalid operation", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, multiSend, txs, safeTx, _b, _c, _d, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _g.sent(), safe = _a.safe, multiSend = _a.multiSend;
                                txs = [(0, execution_1.buildSafeTransaction)({ to: user2.address, operation: 2, nonce: 0 })];
                                _b = multisend_1.buildMultiSendSafeTx;
                                _c = [multiSend, txs];
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                safeTx = _b.apply(void 0, _c.concat([_g.sent()]));
                                _d = chai_1.expect;
                                _e = execution_1.executeTx;
                                _f = [safe, safeTx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, safeTx, true)];
                            case 3: return [4 /*yield*/, _d.apply(void 0, [_e.apply(void 0, _f.concat([[_g.sent()]]))]).to.revertedWith("GS013")];
                            case 4:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("Can execute empty multisend", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, multiSend, txs, safeTx, _b, _c, _d, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _g.sent(), safe = _a.safe, multiSend = _a.multiSend;
                                txs = [];
                                _b = multisend_1.buildMultiSendSafeTx;
                                _c = [multiSend, txs];
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                safeTx = _b.apply(void 0, _c.concat([_g.sent()]));
                                _d = chai_1.expect;
                                _e = execution_1.executeTx;
                                _f = [safe, safeTx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, safeTx, true)];
                            case 3: return [4 /*yield*/, _d.apply(void 0, [_e.apply(void 0, _f.concat([[_g.sent()]]))]).to.emit(safe, "ExecutionSuccess")];
                            case 4:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("Can execute single ether transfer", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, multiSend, userBalance, _b, txs, safeTx, _c, _d, _e, _f, _g, _h, _j;
                    return __generator(this, function (_k) {
                        switch (_k.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _k.sent(), safe = _a.safe, multiSend = _a.multiSend;
                                return [4 /*yield*/, user1.sendTransaction({ to: safe.address, value: (0, units_1.parseEther)("1") })];
                            case 2:
                                _k.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(user2.address)];
                            case 3:
                                userBalance = _k.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(safe.address)];
                            case 4: return [4 /*yield*/, _b.apply(void 0, [_k.sent()]).to.be.deep.eq((0, units_1.parseEther)("1"))];
                            case 5:
                                _k.sent();
                                txs = [(0, execution_1.buildSafeTransaction)({ to: user2.address, value: (0, units_1.parseEther)("1"), nonce: 0 })];
                                _c = multisend_1.buildMultiSendSafeTx;
                                _d = [multiSend, txs];
                                return [4 /*yield*/, safe.nonce()];
                            case 6:
                                safeTx = _c.apply(void 0, _d.concat([_k.sent()]));
                                _e = chai_1.expect;
                                _f = execution_1.executeTx;
                                _g = [safe, safeTx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, safeTx, true)];
                            case 7: return [4 /*yield*/, _e.apply(void 0, [_f.apply(void 0, _g.concat([[_k.sent()]]))]).to.emit(safe, "ExecutionSuccess")];
                            case 8:
                                _k.sent();
                                _h = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(safe.address)];
                            case 9: return [4 /*yield*/, _h.apply(void 0, [_k.sent()]).to.be.deep.eq((0, units_1.parseEther)("0"))];
                            case 10:
                                _k.sent();
                                _j = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(user2.address)];
                            case 11: return [4 /*yield*/, _j.apply(void 0, [_k.sent()]).to.be.deep.eq(userBalance.add((0, units_1.parseEther)("1")))];
                            case 12:
                                _k.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("reverts all tx if any fails", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, multiSend, userBalance, _b, txs, safeTx, _c, _d, _e, _f, _g, _h, _j;
                    return __generator(this, function (_k) {
                        switch (_k.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _k.sent(), safe = _a.safe, multiSend = _a.multiSend;
                                return [4 /*yield*/, user1.sendTransaction({ to: safe.address, value: (0, units_1.parseEther)("1") })];
                            case 2:
                                _k.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(user2.address)];
                            case 3:
                                userBalance = _k.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(safe.address)];
                            case 4: return [4 /*yield*/, _b.apply(void 0, [_k.sent()]).to.be.deep.eq((0, units_1.parseEther)("1"))];
                            case 5:
                                _k.sent();
                                txs = [
                                    (0, execution_1.buildSafeTransaction)({ to: user2.address, value: (0, units_1.parseEther)("1"), nonce: 0 }),
                                    (0, execution_1.buildSafeTransaction)({ to: user2.address, value: (0, units_1.parseEther)("1"), nonce: 0 }),
                                ];
                                _c = multisend_1.buildMultiSendSafeTx;
                                _d = [multiSend, txs];
                                return [4 /*yield*/, safe.nonce()];
                            case 6:
                                safeTx = _c.apply(void 0, _d.concat([_k.sent(), { safeTxGas: 1 }]));
                                _e = chai_1.expect;
                                _f = execution_1.executeTx;
                                _g = [safe, safeTx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, safeTx, true)];
                            case 7: return [4 /*yield*/, _e.apply(void 0, [_f.apply(void 0, _g.concat([[_k.sent()]]))]).to.emit(safe, "ExecutionFailure")];
                            case 8:
                                _k.sent();
                                _h = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(safe.address)];
                            case 9: return [4 /*yield*/, _h.apply(void 0, [_k.sent()]).to.be.deep.eq((0, units_1.parseEther)("1"))];
                            case 10:
                                _k.sent();
                                _j = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(user2.address)];
                            case 11: return [4 /*yield*/, _j.apply(void 0, [_k.sent()]).to.be.deep.eq(userBalance)];
                            case 12:
                                _k.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can be used when ETH is sent with execution", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, multiSend, storageSetter, txs, safeTx, _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _j.sent(), safe = _a.safe, multiSend = _a.multiSend, storageSetter = _a.storageSetter;
                                txs = [(0, execution_1.buildContractCall)(storageSetter, "setStorage", ["0xbaddad"], 0)];
                                _b = multisend_1.buildMultiSendSafeTx;
                                _c = [multiSend, txs];
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                safeTx = _b.apply(void 0, _c.concat([_j.sent()]));
                                _d = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(safe.address)];
                            case 3: return [4 /*yield*/, _d.apply(void 0, [_j.sent()]).to.be.deep.eq((0, units_1.parseEther)("0"))];
                            case 4:
                                _j.sent();
                                _e = chai_1.expect;
                                _f = execution_1.executeTx;
                                _g = [safe, safeTx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, safeTx, true)];
                            case 5: return [4 /*yield*/, _e.apply(void 0, [_f.apply(void 0, _g.concat([[_j.sent()], { value: (0, units_1.parseEther)("1") }]))]).to.emit(safe, "ExecutionSuccess")];
                            case 6:
                                _j.sent();
                                _h = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(safe.address)];
                            case 7: return [4 /*yield*/, _h.apply(void 0, [_j.sent()]).to.be.deep.eq((0, units_1.parseEther)("1"))];
                            case 8:
                                _j.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can execute contract calls", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, multiSend, storageSetter, txs, safeTx, _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _j.sent(), safe = _a.safe, multiSend = _a.multiSend, storageSetter = _a.storageSetter;
                                txs = [(0, execution_1.buildContractCall)(storageSetter, "setStorage", ["0xbaddad"], 0)];
                                _b = multisend_1.buildMultiSendSafeTx;
                                _c = [multiSend, txs];
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                safeTx = _b.apply(void 0, _c.concat([_j.sent()]));
                                _d = chai_1.expect;
                                _e = execution_1.executeTx;
                                _f = [safe, safeTx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, safeTx, true)];
                            case 3: return [4 /*yield*/, _d.apply(void 0, [_e.apply(void 0, _f.concat([[_j.sent()]]))]).to.emit(safe, "ExecutionSuccess")];
                            case 4:
                                _j.sent();
                                _g = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, "0x4242424242424242424242424242424242424242424242424242424242424242")];
                            case 5: return [4 /*yield*/, _g.apply(void 0, [_j.sent()]).to.be.eq("0x" + "".padEnd(64, "0"))];
                            case 6:
                                _j.sent();
                                _h = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(storageSetter.address, "0x4242424242424242424242424242424242424242424242424242424242424242")];
                            case 7: return [4 /*yield*/, _h.apply(void 0, [_j.sent()]).to.be.eq("0x" + "baddad".padEnd(64, "0"))];
                            case 8:
                                _j.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can execute contract delegatecalls", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, multiSend, storageSetter, txs, safeTx, _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _j.sent(), safe = _a.safe, multiSend = _a.multiSend, storageSetter = _a.storageSetter;
                                txs = [(0, execution_1.buildContractCall)(storageSetter, "setStorage", ["0xbaddad"], 0, true)];
                                _b = multisend_1.buildMultiSendSafeTx;
                                _c = [multiSend, txs];
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                safeTx = _b.apply(void 0, _c.concat([_j.sent()]));
                                _d = chai_1.expect;
                                _e = execution_1.executeTx;
                                _f = [safe, safeTx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, safeTx, true)];
                            case 3: return [4 /*yield*/, _d.apply(void 0, [_e.apply(void 0, _f.concat([[_j.sent()]]))]).to.emit(safe, "ExecutionSuccess")];
                            case 4:
                                _j.sent();
                                _g = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, "0x4242424242424242424242424242424242424242424242424242424242424242")];
                            case 5: return [4 /*yield*/, _g.apply(void 0, [_j.sent()]).to.be.eq("0x" + "baddad".padEnd(64, "0"))];
                            case 6:
                                _j.sent();
                                _h = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(storageSetter.address, "0x4242424242424242424242424242424242424242424242424242424242424242")];
                            case 7: return [4 /*yield*/, _h.apply(void 0, [_j.sent()]).to.be.eq("0x" + "".padEnd(64, "0"))];
                            case 8:
                                _j.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can execute all calls in combination", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, multiSend, storageSetter, userBalance, _b, txs, safeTx, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                    return __generator(this, function (_m) {
                        switch (_m.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _m.sent(), safe = _a.safe, multiSend = _a.multiSend, storageSetter = _a.storageSetter;
                                return [4 /*yield*/, user1.sendTransaction({ to: safe.address, value: (0, units_1.parseEther)("1") })];
                            case 2:
                                _m.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(user2.address)];
                            case 3:
                                userBalance = _m.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(safe.address)];
                            case 4: return [4 /*yield*/, _b.apply(void 0, [_m.sent()]).to.be.deep.eq((0, units_1.parseEther)("1"))];
                            case 5:
                                _m.sent();
                                txs = [
                                    (0, execution_1.buildSafeTransaction)({ to: user2.address, value: (0, units_1.parseEther)("1"), nonce: 0 }),
                                    (0, execution_1.buildContractCall)(storageSetter, "setStorage", ["0xbaddad"], 0, true),
                                    (0, execution_1.buildContractCall)(storageSetter, "setStorage", ["0xbaddad"], 0),
                                ];
                                _c = multisend_1.buildMultiSendSafeTx;
                                _d = [multiSend, txs];
                                return [4 /*yield*/, safe.nonce()];
                            case 6:
                                safeTx = _c.apply(void 0, _d.concat([_m.sent()]));
                                _e = chai_1.expect;
                                _f = execution_1.executeTx;
                                _g = [safe, safeTx];
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, safeTx, true)];
                            case 7: return [4 /*yield*/, _e.apply(void 0, [_f.apply(void 0, _g.concat([[_m.sent()]]))]).to.emit(safe, "ExecutionSuccess")];
                            case 8:
                                _m.sent();
                                _h = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(safe.address)];
                            case 9: return [4 /*yield*/, _h.apply(void 0, [_m.sent()]).to.be.deep.eq((0, units_1.parseEther)("0"))];
                            case 10:
                                _m.sent();
                                _j = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(user2.address)];
                            case 11: return [4 /*yield*/, _j.apply(void 0, [_m.sent()]).to.be.deep.eq(userBalance.add((0, units_1.parseEther)("1")))];
                            case 12:
                                _m.sent();
                                _k = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, "0x4242424242424242424242424242424242424242424242424242424242424242")];
                            case 13: return [4 /*yield*/, _k.apply(void 0, [_m.sent()]).to.be.eq("0x" + "baddad".padEnd(64, "0"))];
                            case 14:
                                _m.sent();
                                _l = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(storageSetter.address, "0x4242424242424242424242424242424242424242424242424242424242424242")];
                            case 15: return [4 /*yield*/, _l.apply(void 0, [_m.sent()]).to.be.eq("0x" + "baddad".padEnd(64, "0"))];
                            case 16:
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
