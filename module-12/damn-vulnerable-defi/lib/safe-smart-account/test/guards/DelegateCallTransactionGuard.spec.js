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
var constants_1 = require("@ethersproject/constants");
var setup_1 = require("../utils/setup");
var execution_1 = require("../../src/utils/execution");
var constants_2 = require("../../src/utils/constants");
describe("DelegateCallTransactionGuard", function () { return __awaiter(void 0, void 0, void 0, function () {
    var user1, setupTests;
    return __generator(this, function (_a) {
        user1 = hardhat_1.waffle.provider.getWallets()[0];
        setupTests = hardhat_1.deployments.createFixture(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var safe, guardFactory, guard;
            var deployments = _b.deployments;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, deployments.fixture()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, (0, setup_1.getSafeWithOwners)([user1.address])];
                    case 2:
                        safe = _c.sent();
                        return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory("DelegateCallTransactionGuard")];
                    case 3:
                        guardFactory = _c.sent();
                        return [4 /*yield*/, guardFactory.deploy(constants_1.AddressZero)];
                    case 4:
                        guard = _c.sent();
                        return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "setGuard", [guard.address], [user1])];
                    case 5:
                        _c.sent();
                        return [2 /*return*/, {
                                safe: safe,
                                guardFactory: guardFactory,
                                guard: guard,
                            }];
                }
            });
        }); });
        describe("fallback", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("must NOT revert on fallback without value", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var guard;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                guard = (_a.sent()).guard;
                                return [4 /*yield*/, user1.sendTransaction({
                                        to: guard.address,
                                        data: "0xbaddad",
                                    })];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert on fallback with value", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var guard;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                guard = (_a.sent()).guard;
                                return [4 /*yield*/, (0, chai_1.expect)(user1.sendTransaction({
                                        to: guard.address,
                                        data: "0xbaddad",
                                        value: 1,
                                    })).to.be.reverted];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("checkTransaction", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should revert delegate call", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, guard, tx;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, guard = _a.guard;
                                tx = (0, execution_1.buildContractCall)(safe, "setGuard", [constants_1.AddressZero], 0, true);
                                return [4 /*yield*/, (0, chai_1.expect)(guard.checkTransaction(tx.to, tx.value, tx.data, tx.operation, tx.safeTxGas, tx.baseGas, tx.gasPrice, tx.gasToken, tx.refundReceiver, "0x", user1.address)).to.be.revertedWith("This call is restricted")];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("must NOT revert normal call", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, guard, tx;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, guard = _a.guard;
                                tx = (0, execution_1.buildContractCall)(safe, "setGuard", [constants_1.AddressZero], 0);
                                return [4 /*yield*/, guard.checkTransaction(tx.to, tx.value, tx.data, tx.operation, tx.safeTxGas, tx.baseGas, tx.gasPrice, tx.gasToken, tx.refundReceiver, "0x", user1.address)];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert on delegate call via Safe", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "setGuard", [constants_1.AddressZero], [user1], true)).to.be.revertedWith("This call is restricted")];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "setGuard", [constants_1.AddressZero], [user1])];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can set allowed target via Safe", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, guardFactory, guard, _b, allowedTarget;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _c.sent(), safe = _a.safe, guardFactory = _a.guardFactory;
                                return [4 /*yield*/, guardFactory.deploy(constants_2.AddressOne)];
                            case 2:
                                guard = _c.sent();
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "setGuard", [guard.address], [user1])];
                            case 3:
                                _c.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, guard.allowedTarget()];
                            case 4:
                                _b.apply(void 0, [_c.sent()]).to.be.eq(constants_2.AddressOne);
                                allowedTarget = safe.attach(constants_2.AddressOne);
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "setFallbackHandler", [constants_1.AddressZero], [user1], true)).to.be.revertedWith("This call is restricted")];
                            case 5:
                                _c.sent();
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, allowedTarget, "setFallbackHandler", [constants_1.AddressZero], [user1], true)];
                            case 6:
                                _c.sent();
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
