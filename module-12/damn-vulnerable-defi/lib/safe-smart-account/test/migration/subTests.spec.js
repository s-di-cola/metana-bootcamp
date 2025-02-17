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
exports.verificationTests = void 0;
var ethers_1 = require("ethers");
var units_1 = require("@ethersproject/units");
var chai_1 = require("chai");
var hardhat_1 = require("hardhat");
var constants_1 = require("../../src/utils/constants");
var execution_1 = require("../../src/utils/execution");
var multisend_1 = require("../../src/utils/multisend");
var verificationTests = function (setupTests) {
    var _a = hardhat_1.waffle.provider.getWallets(), user1 = _a[0], user2 = _a[1], user3 = _a[2];
    describe("execTransaction", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            it("should be able to transfer ETH", function () { return __awaiter(void 0, void 0, void 0, function () {
                var migratedSafe, nonce, tx, userBalance, _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, setupTests()];
                        case 1:
                            migratedSafe = (_d.sent()).migratedSafe;
                            return [4 /*yield*/, user1.sendTransaction({ to: migratedSafe.address, value: (0, units_1.parseEther)("1") })];
                        case 2:
                            _d.sent();
                            return [4 /*yield*/, migratedSafe.nonce()];
                        case 3:
                            nonce = _d.sent();
                            tx = (0, execution_1.buildSafeTransaction)({ to: user2.address, value: (0, units_1.parseEther)("1"), nonce: nonce });
                            return [4 /*yield*/, hardhat_1.ethers.provider.getBalance(user2.address)];
                        case 4:
                            userBalance = _d.sent();
                            _a = chai_1.expect;
                            return [4 /*yield*/, hardhat_1.ethers.provider.getBalance(migratedSafe.address)];
                        case 5: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).to.be.deep.eq((0, units_1.parseEther)("1"))];
                        case 6:
                            _d.sent();
                            return [4 /*yield*/, (0, execution_1.executeTxWithSigners)(migratedSafe, tx, [user1])];
                        case 7:
                            _d.sent();
                            _b = chai_1.expect;
                            return [4 /*yield*/, hardhat_1.ethers.provider.getBalance(user2.address)];
                        case 8: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).to.be.deep.eq(userBalance.add((0, units_1.parseEther)("1")))];
                        case 9:
                            _d.sent();
                            _c = chai_1.expect;
                            return [4 /*yield*/, hardhat_1.ethers.provider.getBalance(migratedSafe.address)];
                        case 10: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).to.be.deep.eq((0, units_1.parseEther)("0"))];
                        case 11:
                            _d.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
    describe("addOwner", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            it("should add owner and change treshold", function () { return __awaiter(void 0, void 0, void 0, function () {
                var migratedSafe, _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0: return [4 /*yield*/, setupTests()];
                        case 1:
                            migratedSafe = (_h.sent()).migratedSafe;
                            return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(migratedSafe, migratedSafe, "addOwnerWithThreshold", [user2.address, 2], [user1]))
                                    .to.emit(migratedSafe, "AddedOwner")
                                    .withArgs(user2.address)
                                    .and.to.emit(migratedSafe, "ChangedThreshold")];
                        case 2:
                            _h.sent();
                            _a = chai_1.expect;
                            return [4 /*yield*/, migratedSafe.getThreshold()];
                        case 3: return [4 /*yield*/, _a.apply(void 0, [_h.sent()]).to.be.deep.eq(ethers_1.BigNumber.from(2))];
                        case 4:
                            _h.sent();
                            _b = chai_1.expect;
                            return [4 /*yield*/, migratedSafe.getOwners()];
                        case 5: return [4 /*yield*/, _b.apply(void 0, [_h.sent()]).to.be.deep.equal([user2.address, user1.address])];
                        case 6:
                            _h.sent();
                            return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(migratedSafe, migratedSafe, "addOwnerWithThreshold", [user3.address, 1], [user1, user2]))
                                    .to.emit(migratedSafe, "AddedOwner")
                                    .withArgs(user3.address)
                                    .and.to.emit(migratedSafe, "ChangedThreshold")];
                        case 7:
                            _h.sent();
                            _c = chai_1.expect;
                            return [4 /*yield*/, migratedSafe.getThreshold()];
                        case 8: return [4 /*yield*/, _c.apply(void 0, [_h.sent()]).to.be.deep.eq(ethers_1.BigNumber.from(1))];
                        case 9:
                            _h.sent();
                            _d = chai_1.expect;
                            return [4 /*yield*/, migratedSafe.getOwners()];
                        case 10: return [4 /*yield*/, _d.apply(void 0, [_h.sent()]).to.be.deep.equal([user3.address, user2.address, user1.address])];
                        case 11:
                            _h.sent();
                            _e = chai_1.expect;
                            return [4 /*yield*/, migratedSafe.isOwner(user1.address)];
                        case 12: return [4 /*yield*/, _e.apply(void 0, [_h.sent()]).to.be.true];
                        case 13:
                            _h.sent();
                            _f = chai_1.expect;
                            return [4 /*yield*/, migratedSafe.isOwner(user2.address)];
                        case 14: return [4 /*yield*/, _f.apply(void 0, [_h.sent()]).to.be.true];
                        case 15:
                            _h.sent();
                            _g = chai_1.expect;
                            return [4 /*yield*/, migratedSafe.isOwner(user3.address)];
                        case 16: return [4 /*yield*/, _g.apply(void 0, [_h.sent()]).to.be.true];
                        case 17:
                            _h.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
    describe("enableModule", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            it("should enabled module and be able to use it", function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, migratedSafe, mock, _b, _c, user2Safe, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, setupTests()];
                        case 1:
                            _a = _e.sent(), migratedSafe = _a.migratedSafe, mock = _a.mock;
                            return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(migratedSafe, migratedSafe, "enableModule", [user2.address], [user1]))
                                    .to.emit(migratedSafe, "EnabledModule")
                                    .withArgs(user2.address)];
                        case 2:
                            _e.sent();
                            _b = chai_1.expect;
                            return [4 /*yield*/, migratedSafe.isModuleEnabled(user2.address)];
                        case 3: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).to.be.true];
                        case 4:
                            _e.sent();
                            _c = chai_1.expect;
                            return [4 /*yield*/, migratedSafe.getModulesPaginated(constants_1.AddressOne, 10)];
                        case 5: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).to.be.deep.equal([[user2.address], constants_1.AddressOne])];
                        case 6:
                            _e.sent();
                            user2Safe = migratedSafe.connect(user2);
                            return [4 /*yield*/, (0, chai_1.expect)(user2Safe.execTransactionFromModule(mock.address, 0, "0xbaddad", 0))
                                    .to.emit(migratedSafe, "ExecutionFromModuleSuccess")
                                    .withArgs(user2.address)];
                        case 7:
                            _e.sent();
                            _d = chai_1.expect;
                            return [4 /*yield*/, mock.callStatic.invocationCountForCalldata("0xbaddad")];
                        case 8:
                            _d.apply(void 0, [_e.sent()]).to.be.deep.equals(ethers_1.BigNumber.from(1));
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
    describe("multiSend", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            it("execute multisend via delegatecall", function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, migratedSafe, mock, multiSend, userBalance, _b, txs, safeTx, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0: return [4 /*yield*/, setupTests()];
                        case 1:
                            _a = _h.sent(), migratedSafe = _a.migratedSafe, mock = _a.mock, multiSend = _a.multiSend;
                            return [4 /*yield*/, user1.sendTransaction({ to: migratedSafe.address, value: (0, units_1.parseEther)("1") })];
                        case 2:
                            _h.sent();
                            return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(user2.address)];
                        case 3:
                            userBalance = _h.sent();
                            _b = chai_1.expect;
                            return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(migratedSafe.address)];
                        case 4: return [4 /*yield*/, _b.apply(void 0, [_h.sent()]).to.be.deep.eq((0, units_1.parseEther)("1"))];
                        case 5:
                            _h.sent();
                            txs = [
                                (0, execution_1.buildSafeTransaction)({ to: user2.address, value: (0, units_1.parseEther)("1"), nonce: 0 }),
                                (0, execution_1.buildSafeTransaction)({ to: mock.address, data: "0xbaddad", nonce: 0 }),
                            ];
                            _c = multisend_1.buildMultiSendSafeTx;
                            _d = [multiSend, txs];
                            return [4 /*yield*/, migratedSafe.nonce()];
                        case 6:
                            safeTx = _c.apply(void 0, _d.concat([_h.sent()]));
                            return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeTxWithSigners)(migratedSafe, safeTx, [user1])).to.emit(migratedSafe, "ExecutionSuccess")];
                        case 7:
                            _h.sent();
                            _e = chai_1.expect;
                            return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(migratedSafe.address)];
                        case 8: return [4 /*yield*/, _e.apply(void 0, [_h.sent()]).to.be.deep.eq((0, units_1.parseEther)("0"))];
                        case 9:
                            _h.sent();
                            _f = chai_1.expect;
                            return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(user2.address)];
                        case 10: return [4 /*yield*/, _f.apply(void 0, [_h.sent()]).to.be.deep.eq(userBalance.add((0, units_1.parseEther)("1")))];
                        case 11:
                            _h.sent();
                            _g = chai_1.expect;
                            return [4 /*yield*/, mock.callStatic.invocationCountForCalldata("0xbaddad")];
                        case 12:
                            _g.apply(void 0, [_h.sent()]).to.be.deep.equals(ethers_1.BigNumber.from(1));
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
    describe("fallbackHandler", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            it("should be correctly set", function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, migratedSafe, mock, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, setupTests()];
                        case 1:
                            _a = _c.sent(), migratedSafe = _a.migratedSafe, mock = _a.mock;
                            _b = chai_1.expect;
                            return [4 /*yield*/, hardhat_1.ethers.provider.getStorageAt(migratedSafe.address, "0x6c9a6c4a39284e37ed1cf53d337577d14212a4870fb976a4366c693b939918d5")];
                        case 2: 
                        // Check fallback handler
                        return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).to.be.eq("0x" + mock.address.toLowerCase().slice(2).padStart(64, "0"))];
                        case 3:
                            // Check fallback handler
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
};
exports.verificationTests = verificationTests;
