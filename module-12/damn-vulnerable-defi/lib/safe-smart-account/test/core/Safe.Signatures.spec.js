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
var setup_1 = require("../utils/setup");
var execution_1 = require("../../src/utils/execution");
var chai_1 = require("chai");
var hardhat_1 = require("hardhat");
require("@nomiclabs/hardhat-ethers");
var constants_1 = require("@ethersproject/constants");
var crypto_1 = require("crypto");
var setup_2 = require("../utils/setup");
var execution_2 = require("../../src/utils/execution");
var encoding_1 = require("../utils/encoding");
describe("Safe", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user1, user2, user3, user4, user5, setupTests;
    return __generator(this, function (_b) {
        _a = hardhat_1.waffle.provider.getWallets(), user1 = _a[0], user2 = _a[1], user3 = _a[2], user4 = _a[3], user5 = _a[4];
        setupTests = hardhat_1.deployments.createFixture(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var _c;
            var deployments = _b.deployments;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, deployments.fixture()];
                    case 1:
                        _d.sent();
                        _c = {};
                        return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user1.address])];
                    case 2: return [2 /*return*/, (_c.safe = _d.sent(),
                            _c)];
                }
            });
        }); });
        describe("domainSeparator", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should be correct according to EIP-712", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, domainSeparator, _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_d.sent()).safe;
                                _a = execution_2.calculateSafeDomainSeparator;
                                _b = [safe];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 2:
                                domainSeparator = _a.apply(void 0, _b.concat([_d.sent()]));
                                _c = chai_1.expect;
                                return [4 /*yield*/, safe.domainSeparator()];
                            case 3: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).to.be.eq(domainSeparator)];
                            case 4:
                                _d.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("getTransactionHash", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should correctly calculate EIP-712 hash", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, typedDataHash, _b, _c, _d;
                    var _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_f.sent()).safe;
                                _a = execution_2.buildSafeTransaction;
                                _e = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_e.nonce = _f.sent(), _e)]);
                                _b = execution_2.calculateSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 3:
                                typedDataHash = _b.apply(void 0, _c.concat([_f.sent()]));
                                _d = chai_1.expect;
                                return [4 /*yield*/, safe.getTransactionHash(tx.to, tx.value, tx.data, tx.operation, tx.safeTxGas, tx.baseGas, tx.gasPrice, tx.gasToken, tx.refundReceiver, tx.nonce)];
                            case 4: return [4 /*yield*/, _d.apply(void 0, [_f.sent()]).to.be.eq(typedDataHash)];
                            case 5:
                                _f.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("getChainId", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should return correct id", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_d.sent()).safe;
                                _b = chai_1.expect;
                                return [4 /*yield*/, safe.getChainId()];
                            case 2:
                                _c = (_a = _b.apply(void 0, [_d.sent()]).to.be).eq;
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 3:
                                _c.apply(_a, [_d.sent()]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("approveHash", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("approving should only be allowed for owners", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, txHash, _b, _c, signerSafe;
                    var _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_e.sent()).safe;
                                _a = execution_2.buildSafeTransaction;
                                _d = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_d.nonce = _e.sent(), _d)]);
                                _b = execution_2.calculateSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 3:
                                txHash = _b.apply(void 0, _c.concat([_e.sent()]));
                                signerSafe = safe.connect(user2);
                                return [4 /*yield*/, (0, chai_1.expect)(signerSafe.approveHash(txHash)).to.be.revertedWith("GS030")];
                            case 4:
                                _e.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("approving should emit event", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, txHash, _b, _c;
                    var _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_e.sent()).safe;
                                _a = execution_2.buildSafeTransaction;
                                _d = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_d.nonce = _e.sent(), _d)]);
                                _b = execution_2.calculateSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 3:
                                txHash = _b.apply(void 0, _c.concat([_e.sent()]));
                                return [4 /*yield*/, (0, chai_1.expect)(safe.approveHash(txHash)).emit(safe, "ApproveHash").withArgs(txHash, user1.address)];
                            case 4:
                                _e.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("execTransaction", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should fail if signature points into static part", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, signatures;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                signatures = "0x" +
                                    "000000000000000000000000" +
                                    user1.address.slice(2) +
                                    "0000000000000000000000000000000000000000000000000000000000000020" +
                                    "00" + // r, s, v
                                    "0000000000000000000000000000000000000000000000000000000000000000";
                                return [4 /*yield*/, (0, chai_1.expect)(safe.execTransaction(safe.address, 0, "0x", 0, 0, 0, 0, constants_1.AddressZero, constants_1.AddressZero, signatures)).to.be.revertedWith("GS021")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should fail if sigantures data is not present", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, signatures;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                signatures = "0x" +
                                    "000000000000000000000000" +
                                    user1.address.slice(2) +
                                    "0000000000000000000000000000000000000000000000000000000000000041" +
                                    "00";
                                return [4 /*yield*/, (0, chai_1.expect)(safe.execTransaction(safe.address, 0, "0x", 0, 0, 0, 0, constants_1.AddressZero, constants_1.AddressZero, signatures)).to.be.revertedWith("GS022")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should fail if sigantures data is too short", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, signatures;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                signatures = "0x" +
                                    "000000000000000000000000" +
                                    user1.address.slice(2) +
                                    "0000000000000000000000000000000000000000000000000000000000000041" +
                                    "00" + // r, s, v
                                    "0000000000000000000000000000000000000000000000000000000000000020";
                                return [4 /*yield*/, (0, chai_1.expect)(safe.execTransaction(safe.address, 0, "0x", 0, 0, 0, 0, constants_1.AddressZero, constants_1.AddressZero, signatures)).to.be.revertedWith("GS023")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should be able to use EIP-712 for signature generation", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, _b, _c, _d, _e, _f;
                    var _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_h.sent()).safe;
                                _a = execution_2.buildSafeTransaction;
                                _g = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_g.nonce = _h.sent(), _g)]);
                                _b = chai_1.expect;
                                _c = execution_2.logGas;
                                _d = ["Execute cancel transaction with EIP-712 signature"];
                                _e = execution_2.executeTx;
                                _f = [safe, tx];
                                return [4 /*yield*/, (0, execution_2.safeSignTypedData)(user1, safe, tx)];
                            case 3: return [4 /*yield*/, _b.apply(void 0, [_c.apply(void 0, _d.concat([_e.apply(void 0, _f.concat([[_h.sent()]]))]))]).to.emit(safe, "ExecutionSuccess")];
                            case 4:
                                _h.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should not be able to use different chainId for signing", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, _b, _c, _d;
                    var _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _f.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user1.address])];
                            case 2:
                                safe = _f.sent();
                                _a = execution_2.buildSafeTransaction;
                                _e = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 3:
                                tx = _a.apply(void 0, [(_e.nonce = _f.sent(), _e)]);
                                _b = chai_1.expect;
                                _c = execution_2.executeTx;
                                _d = [safe, tx];
                                return [4 /*yield*/, (0, execution_2.safeSignTypedData)(user1, safe, tx, 1)];
                            case 4: return [4 /*yield*/, _b.apply(void 0, [_c.apply(void 0, _d.concat([[_f.sent()]]))]).to.be.revertedWith("GS026")];
                            case 5:
                                _f.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should be able to use Signed Ethereum Messages for signature generation", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, _b, _c, _d, _e, _f;
                    var _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_h.sent()).safe;
                                _a = execution_2.buildSafeTransaction;
                                _g = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_g.nonce = _h.sent(), _g)]);
                                _b = chai_1.expect;
                                _c = execution_2.logGas;
                                _d = ["Execute cancel transaction with signed Ethereum message"];
                                _e = execution_2.executeTx;
                                _f = [safe, tx];
                                return [4 /*yield*/, (0, execution_2.safeSignMessage)(user1, safe, tx)];
                            case 3: return [4 /*yield*/, _b.apply(void 0, [_c.apply(void 0, _d.concat([_e.apply(void 0, _f.concat([[_h.sent()]]))]))]).to.emit(safe, "ExecutionSuccess")];
                            case 4:
                                _h.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("msg.sender does not need to approve before", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, _b, _c, _d, _e, _f;
                    var _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_h.sent()).safe;
                                _a = execution_2.buildSafeTransaction;
                                _g = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_g.nonce = _h.sent(), _g)]);
                                _b = chai_1.expect;
                                _c = execution_2.logGas;
                                _d = ["Without pre approved signature for msg.sender"];
                                _e = execution_2.executeTx;
                                _f = [safe, tx];
                                return [4 /*yield*/, (0, execution_2.safeApproveHash)(user1, safe, tx, true)];
                            case 3: return [4 /*yield*/, _b.apply(void 0, [_c.apply(void 0, _d.concat([_e.apply(void 0, _f.concat([[_h.sent()]]))]))]).to.emit(safe, "ExecutionSuccess")];
                            case 4:
                                _h.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("if not msg.sender on-chain approval is required", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, user2Safe, tx, _a, _b, _c, _d;
                    var _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_f.sent()).safe;
                                user2Safe = safe.connect(user2);
                                _a = execution_2.buildSafeTransaction;
                                _e = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_e.nonce = _f.sent(), _e)]);
                                _b = chai_1.expect;
                                _c = execution_2.executeTx;
                                _d = [user2Safe, tx];
                                return [4 /*yield*/, (0, execution_2.safeApproveHash)(user1, safe, tx, true)];
                            case 3: return [4 /*yield*/, _b.apply(void 0, [_c.apply(void 0, _d.concat([[_f.sent()]]))]).to.be.revertedWith("GS025")];
                            case 4:
                                _f.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should be able to use pre approved hashes for signature generation", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, user2Safe, tx, _a, txHash, _b, _c, approveHashSig, _d, _e;
                    var _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_g.sent()).safe;
                                user2Safe = safe.connect(user2);
                                _a = execution_2.buildSafeTransaction;
                                _f = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_f.nonce = _g.sent(), _f)]);
                                _b = execution_2.calculateSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 3:
                                txHash = _b.apply(void 0, _c.concat([_g.sent()]));
                                return [4 /*yield*/, (0, execution_2.safeApproveHash)(user1, safe, tx)];
                            case 4:
                                approveHashSig = _g.sent();
                                _d = chai_1.expect;
                                return [4 /*yield*/, safe.approvedHashes(user1.address, txHash)];
                            case 5:
                                _d.apply(void 0, [_g.sent()]).to.be.eq(1);
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_2.logGas)("With pre approved signature", (0, execution_2.executeTx)(user2Safe, tx, [approveHashSig]))).to.emit(safe, "ExecutionSuccess")];
                            case 6:
                                _g.sent();
                                // Approved hash should not reset automatically
                                _e = chai_1.expect;
                                return [4 /*yield*/, safe.approvedHashes(user1.address, txHash)];
                            case 7:
                                // Approved hash should not reset automatically
                                _e.apply(void 0, [_g.sent()]).to.be.eq(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if threshold is not set", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _c.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeTemplate)()];
                            case 2:
                                safe = _c.sent();
                                _a = execution_2.buildSafeTransaction;
                                _b = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 3:
                                tx = _a.apply(void 0, [(_b.nonce = _c.sent(), _b)]);
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_2.executeTx)(safe, tx, [])).to.be.revertedWith("GS001")];
                            case 4:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if not the required amount of signature data is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _c.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user1.address, user2.address, user3.address])];
                            case 2:
                                safe = _c.sent();
                                _a = execution_2.buildSafeTransaction;
                                _b = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 3:
                                tx = _a.apply(void 0, [(_b.nonce = _c.sent(), _b)]);
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_2.executeTx)(safe, tx, [])).to.be.revertedWith("GS020")];
                            case 4:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should not be able to use different signature type of same owner", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, _b, _c, _d, _e;
                    var _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _g.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user1.address, user2.address, user3.address])];
                            case 2:
                                safe = _g.sent();
                                _a = execution_2.buildSafeTransaction;
                                _f = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 3:
                                tx = _a.apply(void 0, [(_f.nonce = _g.sent(), _f)]);
                                _b = chai_1.expect;
                                _c = execution_2.executeTx;
                                _d = [safe, tx];
                                return [4 /*yield*/, (0, execution_2.safeApproveHash)(user1, safe, tx)];
                            case 4:
                                _e = [
                                    _g.sent()
                                ];
                                return [4 /*yield*/, (0, execution_2.safeSignTypedData)(user1, safe, tx)];
                            case 5:
                                _e = _e.concat([
                                    _g.sent()
                                ]);
                                return [4 /*yield*/, (0, execution_2.safeSignTypedData)(user3, safe, tx)];
                            case 6: return [4 /*yield*/, _b.apply(void 0, [_c.apply(void 0, _d.concat([_e.concat([
                                            _g.sent()
                                        ])]))]).to.be.revertedWith("GS026")];
                            case 7:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should be able to mix all signature types", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var compatFallbackHandler, signerSafe, safe, tx, _a, txHashData, _b, _c, safeMessageHash, _d, _e, signerSafeOwnerSignature, signerSafeSig, _f, _g, _h, _j, _k, _l;
                    var _m;
                    return __generator(this, function (_o) {
                        switch (_o.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _o.sent();
                                return [4 /*yield*/, (0, setup_1.getCompatFallbackHandler)()];
                            case 2:
                                compatFallbackHandler = _o.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user5.address], 1, compatFallbackHandler.address)];
                            case 3:
                                signerSafe = _o.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user1.address, user2.address, user3.address, user4.address, signerSafe.address])];
                            case 4:
                                safe = _o.sent();
                                _a = execution_2.buildSafeTransaction;
                                _m = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 5:
                                tx = _a.apply(void 0, [(_m.nonce = _o.sent(), _m)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 6:
                                txHashData = _b.apply(void 0, _c.concat([_o.sent()]));
                                _d = execution_1.calculateSafeMessageHash;
                                _e = [signerSafe, txHashData];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 7:
                                safeMessageHash = _d.apply(void 0, _e.concat([_o.sent()]));
                                return [4 /*yield*/, (0, execution_1.signHash)(user5, safeMessageHash)];
                            case 8:
                                signerSafeOwnerSignature = _o.sent();
                                signerSafeSig = (0, execution_1.buildContractSignature)(signerSafe.address, signerSafeOwnerSignature.data);
                                _f = chai_1.expect;
                                _g = execution_2.logGas;
                                _h = ["Execute cancel transaction with 5 owners (1 owner is another Safe)"];
                                _j = execution_2.executeTx;
                                _k = [safe, tx];
                                return [4 /*yield*/, (0, execution_2.safeApproveHash)(user1, safe, tx, true)];
                            case 9:
                                _l = [
                                    _o.sent()
                                ];
                                return [4 /*yield*/, (0, execution_2.safeApproveHash)(user4, safe, tx)];
                            case 10:
                                _l = _l.concat([
                                    _o.sent()
                                ]);
                                return [4 /*yield*/, (0, execution_2.safeSignTypedData)(user2, safe, tx)];
                            case 11:
                                _l = _l.concat([
                                    _o.sent()
                                ]);
                                return [4 /*yield*/, (0, execution_2.safeSignTypedData)(user3, safe, tx)];
                            case 12: return [4 /*yield*/, _f.apply(void 0, [_g.apply(void 0, _h.concat([_j.apply(void 0, _k.concat([_l.concat([
                                                _o.sent(),
                                                signerSafeSig
                                            ])]))]))]).to.emit(safe, "ExecutionSuccess")];
                            case 13:
                                _o.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("checkSignatures", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should fail if signature points into static part", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, txHashData, _b, _c, txHash, _d, _e, signatures;
                    var _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_g.sent()).safe;
                                _a = execution_2.buildSafeTransaction;
                                _f = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_f.nonce = _g.sent(), _f)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 3:
                                txHashData = _b.apply(void 0, _c.concat([_g.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                txHash = _d.apply(void 0, _e.concat([_g.sent()]));
                                signatures = "0x" +
                                    "000000000000000000000000" +
                                    user1.address.slice(2) +
                                    "0000000000000000000000000000000000000000000000000000000000000020" +
                                    "00" + // r, s, v
                                    "0000000000000000000000000000000000000000000000000000000000000000";
                                return [4 /*yield*/, (0, chai_1.expect)(safe.checkSignatures(txHash, txHashData, signatures)).to.be.revertedWith("GS021")];
                            case 5:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should fail if signatures data is not present", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, txHashData, _b, _c, txHash, _d, _e, signatures;
                    var _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_g.sent()).safe;
                                _a = execution_2.buildSafeTransaction;
                                _f = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_f.nonce = _g.sent(), _f)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 3:
                                txHashData = _b.apply(void 0, _c.concat([_g.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                txHash = _d.apply(void 0, _e.concat([_g.sent()]));
                                signatures = "0x" +
                                    "000000000000000000000000" +
                                    user1.address.slice(2) +
                                    "0000000000000000000000000000000000000000000000000000000000000041" +
                                    "00";
                                return [4 /*yield*/, (0, chai_1.expect)(safe.checkSignatures(txHash, txHashData, signatures)).to.be.revertedWith("GS022")];
                            case 5:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should fail if signatures data is too short", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, txHashData, _b, _c, txHash, _d, _e, signatures;
                    var _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_g.sent()).safe;
                                _a = execution_2.buildSafeTransaction;
                                _f = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_f.nonce = _g.sent(), _f)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 3:
                                txHashData = _b.apply(void 0, _c.concat([_g.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                txHash = _d.apply(void 0, _e.concat([_g.sent()]));
                                signatures = "0x" +
                                    "000000000000000000000000" +
                                    user1.address.slice(2) +
                                    "0000000000000000000000000000000000000000000000000000000000000041" +
                                    "00" + // r, s, v
                                    "0000000000000000000000000000000000000000000000000000000000000020";
                                return [4 /*yield*/, (0, chai_1.expect)(safe.checkSignatures(txHash, txHashData, signatures)).to.be.revertedWith("GS023")];
                            case 5:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should not be able to use different chainId for signing", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, txHashData, _b, _c, txHash, _d, _e, signatures, _f;
                    var _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _h.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user1.address])];
                            case 2:
                                safe = _h.sent();
                                _a = execution_2.buildSafeTransaction;
                                _g = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 3:
                                tx = _a.apply(void 0, [(_g.nonce = _h.sent(), _g)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                txHashData = _b.apply(void 0, _c.concat([_h.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 5:
                                txHash = _d.apply(void 0, _e.concat([_h.sent()]));
                                _f = execution_2.buildSignatureBytes;
                                return [4 /*yield*/, (0, execution_2.safeSignTypedData)(user1, safe, tx, 1)];
                            case 6:
                                signatures = _f.apply(void 0, [[_h.sent()]]);
                                return [4 /*yield*/, (0, chai_1.expect)(safe.checkSignatures(txHash, txHashData, signatures)).to.be.revertedWith("GS026")];
                            case 7:
                                _h.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("if not msg.sender on-chain approval is required", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, user2Safe, tx, _a, txHashData, _b, _c, txHash, _d, _e, signatures, _f;
                    var _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_h.sent()).safe;
                                user2Safe = safe.connect(user2);
                                _a = execution_2.buildSafeTransaction;
                                _g = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_g.nonce = _h.sent(), _g)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 3:
                                txHashData = _b.apply(void 0, _c.concat([_h.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                txHash = _d.apply(void 0, _e.concat([_h.sent()]));
                                _f = execution_2.buildSignatureBytes;
                                return [4 /*yield*/, (0, execution_2.safeApproveHash)(user1, safe, tx, true)];
                            case 5:
                                signatures = _f.apply(void 0, [[_h.sent()]]);
                                return [4 /*yield*/, (0, chai_1.expect)(user2Safe.checkSignatures(txHash, txHashData, signatures)).to.be.revertedWith("GS025")];
                            case 6:
                                _h.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if threshold is not set", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, txHashData, _b, _c, txHash, _d, _e;
                    var _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _g.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeTemplate)()];
                            case 2:
                                safe = _g.sent();
                                _a = execution_2.buildSafeTransaction;
                                _f = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 3:
                                tx = _a.apply(void 0, [(_f.nonce = _g.sent(), _f)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                txHashData = _b.apply(void 0, _c.concat([_g.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 5:
                                txHash = _d.apply(void 0, _e.concat([_g.sent()]));
                                return [4 /*yield*/, (0, chai_1.expect)(safe.checkSignatures(txHash, txHashData, "0x")).to.be.revertedWith("GS001")];
                            case 6:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if not the required amount of signature data is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, txHashData, _b, _c, txHash, _d, _e;
                    var _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _g.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user1.address, user2.address, user3.address])];
                            case 2:
                                safe = _g.sent();
                                _a = execution_2.buildSafeTransaction;
                                _f = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 3:
                                tx = _a.apply(void 0, [(_f.nonce = _g.sent(), _f)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                txHashData = _b.apply(void 0, _c.concat([_g.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 5:
                                txHash = _d.apply(void 0, _e.concat([_g.sent()]));
                                return [4 /*yield*/, (0, chai_1.expect)(safe.checkSignatures(txHash, txHashData, "0x")).to.be.revertedWith("GS020")];
                            case 6:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should not be able to use different signature type of same owner", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, txHashData, _b, _c, txHash, _d, _e, signatures, _f, _g;
                    var _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _j.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user1.address, user2.address, user3.address])];
                            case 2:
                                safe = _j.sent();
                                _a = execution_2.buildSafeTransaction;
                                _h = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 3:
                                tx = _a.apply(void 0, [(_h.nonce = _j.sent(), _h)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                txHashData = _b.apply(void 0, _c.concat([_j.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 5:
                                txHash = _d.apply(void 0, _e.concat([_j.sent()]));
                                _f = execution_2.buildSignatureBytes;
                                return [4 /*yield*/, (0, execution_2.safeApproveHash)(user1, safe, tx)];
                            case 6:
                                _g = [
                                    _j.sent()
                                ];
                                return [4 /*yield*/, (0, execution_2.safeSignTypedData)(user1, safe, tx)];
                            case 7:
                                _g = _g.concat([
                                    _j.sent()
                                ]);
                                return [4 /*yield*/, (0, execution_2.safeSignTypedData)(user3, safe, tx)];
                            case 8:
                                signatures = _f.apply(void 0, [_g.concat([
                                        _j.sent()
                                    ])]);
                                return [4 /*yield*/, (0, chai_1.expect)(safe.checkSignatures(txHash, txHashData, signatures)).to.be.revertedWith("GS026")];
                            case 9:
                                _j.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should be able to mix all signature types", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var compatFallbackHandler, signerSafe, safe, tx, _a, txHashData, _b, _c, txHash, _d, _e, safeMessageHash, _f, _g, signerSafeOwnerSignature, signerSafeSig, signatures, _h, _j;
                    var _k;
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _l.sent();
                                return [4 /*yield*/, (0, setup_1.getCompatFallbackHandler)()];
                            case 2:
                                compatFallbackHandler = _l.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user5.address], 1, compatFallbackHandler.address)];
                            case 3:
                                signerSafe = _l.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user1.address, user2.address, user3.address, user4.address, signerSafe.address])];
                            case 4:
                                safe = _l.sent();
                                _a = execution_2.buildSafeTransaction;
                                _k = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 5:
                                tx = _a.apply(void 0, [(_k.nonce = _l.sent(), _k)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 6:
                                txHashData = _b.apply(void 0, _c.concat([_l.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 7:
                                txHash = _d.apply(void 0, _e.concat([_l.sent()]));
                                _f = execution_1.calculateSafeMessageHash;
                                _g = [signerSafe, txHashData];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 8:
                                safeMessageHash = _f.apply(void 0, _g.concat([_l.sent()]));
                                return [4 /*yield*/, (0, execution_1.signHash)(user5, safeMessageHash)];
                            case 9:
                                signerSafeOwnerSignature = _l.sent();
                                signerSafeSig = (0, execution_1.buildContractSignature)(signerSafe.address, signerSafeOwnerSignature.data);
                                _h = execution_2.buildSignatureBytes;
                                return [4 /*yield*/, (0, execution_2.safeApproveHash)(user1, safe, tx, true)];
                            case 10:
                                _j = [
                                    _l.sent()
                                ];
                                return [4 /*yield*/, (0, execution_2.safeApproveHash)(user4, safe, tx)];
                            case 11:
                                _j = _j.concat([
                                    _l.sent()
                                ]);
                                return [4 /*yield*/, (0, execution_2.safeSignTypedData)(user2, safe, tx)];
                            case 12:
                                _j = _j.concat([
                                    _l.sent()
                                ]);
                                return [4 /*yield*/, (0, execution_2.safeSignTypedData)(user3, safe, tx)];
                            case 13:
                                signatures = _h.apply(void 0, [_j.concat([
                                        _l.sent(),
                                        signerSafeSig
                                    ])]);
                                return [4 /*yield*/, safe.checkSignatures(txHash, txHashData, signatures)];
                            case 14:
                                _l.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("checkSignatures", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should fail if signature points into static part", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, txHashData, _b, _c, txHash, _d, _e, signatures;
                    var _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_g.sent()).safe;
                                _a = execution_2.buildSafeTransaction;
                                _f = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_f.nonce = _g.sent(), _f)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 3:
                                txHashData = _b.apply(void 0, _c.concat([_g.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                txHash = _d.apply(void 0, _e.concat([_g.sent()]));
                                signatures = "0x" +
                                    "000000000000000000000000" +
                                    user1.address.slice(2) +
                                    "0000000000000000000000000000000000000000000000000000000000000020" +
                                    "00" + // r, s, v
                                    "0000000000000000000000000000000000000000000000000000000000000000";
                                return [4 /*yield*/, (0, chai_1.expect)(safe.checkNSignatures(txHash, txHashData, signatures, 1)).to.be.revertedWith("GS021")];
                            case 5:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should fail if signatures data is not present", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, txHashData, _b, _c, txHash, _d, _e, signatures;
                    var _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_g.sent()).safe;
                                _a = execution_2.buildSafeTransaction;
                                _f = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_f.nonce = _g.sent(), _f)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 3:
                                txHashData = _b.apply(void 0, _c.concat([_g.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                txHash = _d.apply(void 0, _e.concat([_g.sent()]));
                                signatures = "0x" +
                                    "000000000000000000000000" +
                                    user1.address.slice(2) +
                                    "0000000000000000000000000000000000000000000000000000000000000041" +
                                    "00";
                                return [4 /*yield*/, (0, chai_1.expect)(safe.checkNSignatures(txHash, txHashData, signatures, 1)).to.be.revertedWith("GS022")];
                            case 5:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should fail if signatures data is too short", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, txHashData, _b, _c, txHash, _d, _e, signatures;
                    var _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_g.sent()).safe;
                                _a = execution_2.buildSafeTransaction;
                                _f = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_f.nonce = _g.sent(), _f)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 3:
                                txHashData = _b.apply(void 0, _c.concat([_g.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                txHash = _d.apply(void 0, _e.concat([_g.sent()]));
                                signatures = "0x" +
                                    "000000000000000000000000" +
                                    user1.address.slice(2) +
                                    "0000000000000000000000000000000000000000000000000000000000000041" +
                                    "00" + // r, s, v
                                    "0000000000000000000000000000000000000000000000000000000000000020";
                                return [4 /*yield*/, (0, chai_1.expect)(safe.checkNSignatures(txHash, txHashData, signatures, 1)).to.be.revertedWith("GS023")];
                            case 5:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should not be able to use different chainId for signing", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, txHashData, _b, _c, txHash, _d, _e, signatures, _f;
                    var _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _h.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user1.address])];
                            case 2:
                                safe = _h.sent();
                                _a = execution_2.buildSafeTransaction;
                                _g = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 3:
                                tx = _a.apply(void 0, [(_g.nonce = _h.sent(), _g)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                txHashData = _b.apply(void 0, _c.concat([_h.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 5:
                                txHash = _d.apply(void 0, _e.concat([_h.sent()]));
                                _f = execution_2.buildSignatureBytes;
                                return [4 /*yield*/, (0, execution_2.safeSignTypedData)(user1, safe, tx, 1)];
                            case 6:
                                signatures = _f.apply(void 0, [[_h.sent()]]);
                                return [4 /*yield*/, (0, chai_1.expect)(safe.checkNSignatures(txHash, txHashData, signatures, 1)).to.be.revertedWith("GS026")];
                            case 7:
                                _h.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("if not msg.sender on-chain approval is required", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, user2Safe, tx, _a, txHashData, _b, _c, txHash, _d, _e, signatures, _f;
                    var _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_h.sent()).safe;
                                user2Safe = safe.connect(user2);
                                _a = execution_2.buildSafeTransaction;
                                _g = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_g.nonce = _h.sent(), _g)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 3:
                                txHashData = _b.apply(void 0, _c.concat([_h.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                txHash = _d.apply(void 0, _e.concat([_h.sent()]));
                                _f = execution_2.buildSignatureBytes;
                                return [4 /*yield*/, (0, execution_2.safeApproveHash)(user1, safe, tx, true)];
                            case 5:
                                signatures = _f.apply(void 0, [[_h.sent()]]);
                                return [4 /*yield*/, (0, chai_1.expect)(user2Safe.checkNSignatures(txHash, txHashData, signatures, 1)).to.be.revertedWith("GS025")];
                            case 6:
                                _h.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if not the required amount of signature data is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, txHashData, _b, _c, txHash, _d, _e;
                    var _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _g.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user1.address, user2.address, user3.address])];
                            case 2:
                                safe = _g.sent();
                                _a = execution_2.buildSafeTransaction;
                                _f = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 3:
                                tx = _a.apply(void 0, [(_f.nonce = _g.sent(), _f)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                txHashData = _b.apply(void 0, _c.concat([_g.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 5:
                                txHash = _d.apply(void 0, _e.concat([_g.sent()]));
                                return [4 /*yield*/, (0, chai_1.expect)(safe.checkNSignatures(txHash, txHashData, "0x", 1)).to.be.revertedWith("GS020")];
                            case 6:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should not be able to use different signature type of same owner", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, txHashData, _b, _c, txHash, _d, _e, signatures, _f, _g;
                    var _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _j.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user1.address, user2.address, user3.address])];
                            case 2:
                                safe = _j.sent();
                                _a = execution_2.buildSafeTransaction;
                                _h = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 3:
                                tx = _a.apply(void 0, [(_h.nonce = _j.sent(), _h)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                txHashData = _b.apply(void 0, _c.concat([_j.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 5:
                                txHash = _d.apply(void 0, _e.concat([_j.sent()]));
                                _f = execution_2.buildSignatureBytes;
                                return [4 /*yield*/, (0, execution_2.safeApproveHash)(user1, safe, tx)];
                            case 6:
                                _g = [
                                    _j.sent()
                                ];
                                return [4 /*yield*/, (0, execution_2.safeSignTypedData)(user1, safe, tx)];
                            case 7:
                                _g = _g.concat([
                                    _j.sent()
                                ]);
                                return [4 /*yield*/, (0, execution_2.safeSignTypedData)(user3, safe, tx)];
                            case 8:
                                signatures = _f.apply(void 0, [_g.concat([
                                        _j.sent()
                                    ])]);
                                return [4 /*yield*/, (0, chai_1.expect)(safe.checkNSignatures(txHash, txHashData, signatures, 3)).to.be.revertedWith("GS026")];
                            case 9:
                                _j.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should be able to mix all signature types", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var compatFallbackHandler, signerSafe, safe, tx, _a, txHashData, _b, _c, txHash, _d, _e, safeMessageHash, _f, _g, signerSafeOwnerSignature, signerSafeSig, signatures, _h, _j;
                    var _k;
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _l.sent();
                                return [4 /*yield*/, (0, setup_1.getCompatFallbackHandler)()];
                            case 2:
                                compatFallbackHandler = _l.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user5.address], 1, compatFallbackHandler.address)];
                            case 3:
                                signerSafe = _l.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user1.address, user2.address, user3.address, user4.address, signerSafe.address])];
                            case 4:
                                safe = _l.sent();
                                _a = execution_2.buildSafeTransaction;
                                _k = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 5:
                                tx = _a.apply(void 0, [(_k.nonce = _l.sent(), _k)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 6:
                                txHashData = _b.apply(void 0, _c.concat([_l.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 7:
                                txHash = _d.apply(void 0, _e.concat([_l.sent()]));
                                _f = execution_1.calculateSafeMessageHash;
                                _g = [signerSafe, txHashData];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 8:
                                safeMessageHash = _f.apply(void 0, _g.concat([_l.sent()]));
                                return [4 /*yield*/, (0, execution_1.signHash)(user5, safeMessageHash)];
                            case 9:
                                signerSafeOwnerSignature = _l.sent();
                                signerSafeSig = (0, execution_1.buildContractSignature)(signerSafe.address, signerSafeOwnerSignature.data);
                                _h = execution_2.buildSignatureBytes;
                                return [4 /*yield*/, (0, execution_2.safeApproveHash)(user1, safe, tx, true)];
                            case 10:
                                _j = [
                                    _l.sent()
                                ];
                                return [4 /*yield*/, (0, execution_2.safeApproveHash)(user4, safe, tx)];
                            case 11:
                                _j = _j.concat([
                                    _l.sent()
                                ]);
                                return [4 /*yield*/, (0, execution_2.safeSignTypedData)(user2, safe, tx)];
                            case 12:
                                _j = _j.concat([
                                    _l.sent()
                                ]);
                                return [4 /*yield*/, (0, execution_2.safeSignTypedData)(user3, safe, tx)];
                            case 13:
                                signatures = _h.apply(void 0, [_j.concat([
                                        _l.sent(),
                                        signerSafeSig
                                    ])]);
                                return [4 /*yield*/, safe.checkNSignatures(txHash, txHashData, signatures, 5)];
                            case 14:
                                _l.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should be able to require no signatures", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, txHashData, _b, _c, txHash, _d, _e;
                    var _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _g.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeTemplate)()];
                            case 2:
                                safe = _g.sent();
                                _a = execution_2.buildSafeTransaction;
                                _f = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 3:
                                tx = _a.apply(void 0, [(_f.nonce = _g.sent(), _f)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                txHashData = _b.apply(void 0, _c.concat([_g.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 5:
                                txHash = _d.apply(void 0, _e.concat([_g.sent()]));
                                return [4 /*yield*/, safe.checkNSignatures(txHash, txHashData, "0x", 0)];
                            case 6:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should be able to require less signatures than the threshold", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, txHashData, _b, _c, txHash, _d, _e, signatures, _f;
                    var _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _h.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user1.address, user2.address, user3.address, user4.address])];
                            case 2:
                                safe = _h.sent();
                                _a = execution_2.buildSafeTransaction;
                                _g = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 3:
                                tx = _a.apply(void 0, [(_g.nonce = _h.sent(), _g)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                txHashData = _b.apply(void 0, _c.concat([_h.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 5:
                                txHash = _d.apply(void 0, _e.concat([_h.sent()]));
                                _f = execution_2.buildSignatureBytes;
                                return [4 /*yield*/, (0, execution_2.safeSignTypedData)(user3, safe, tx)];
                            case 6:
                                signatures = _f.apply(void 0, [[_h.sent()]]);
                                return [4 /*yield*/, safe.checkNSignatures(txHash, txHashData, signatures, 1)];
                            case 7:
                                _h.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should be able to require more signatures than the threshold", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, txHashData, _b, _c, txHash, _d, _e, signatures, _f, _g;
                    var _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _j.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user1.address, user2.address, user3.address, user4.address], 2)];
                            case 2:
                                safe = _j.sent();
                                _a = execution_2.buildSafeTransaction;
                                _h = { to: safe.address };
                                return [4 /*yield*/, safe.nonce()];
                            case 3:
                                tx = _a.apply(void 0, [(_h.nonce = _j.sent(), _h)]);
                                _b = execution_2.preimageSafeTransactionHash;
                                _c = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                txHashData = _b.apply(void 0, _c.concat([_j.sent()]));
                                _d = execution_2.calculateSafeTransactionHash;
                                _e = [safe, tx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 5:
                                txHash = _d.apply(void 0, _e.concat([_j.sent()]));
                                _f = execution_2.buildSignatureBytes;
                                return [4 /*yield*/, (0, execution_2.safeApproveHash)(user1, safe, tx, true)];
                            case 6:
                                _g = [
                                    _j.sent()
                                ];
                                return [4 /*yield*/, (0, execution_2.safeApproveHash)(user4, safe, tx)];
                            case 7:
                                _g = _g.concat([
                                    _j.sent()
                                ]);
                                return [4 /*yield*/, (0, execution_2.safeSignTypedData)(user2, safe, tx)];
                            case 8:
                                signatures = _f.apply(void 0, [_g.concat([
                                        _j.sent()
                                    ])]);
                                // Should fail as only 3 signatures are provided
                                return [4 /*yield*/, (0, chai_1.expect)(safe.checkNSignatures(txHash, txHashData, signatures, 4)).to.be.revertedWith("GS020")];
                            case 9:
                                // Should fail as only 3 signatures are provided
                                _j.sent();
                                return [4 /*yield*/, safe.checkNSignatures(txHash, txHashData, signatures, 3)];
                            case 10:
                                _j.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if the hash of the pre-image data and dataHash do not match for EIP-1271 signature", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, randomHash, randomBytes, randomAddress, randomSignature, eip1271Sig, signatures;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, setup_2.getSafeWithOwners)([user1.address, user2.address, user3.address, user4.address], 2)];
                            case 2:
                                safe = _a.sent();
                                randomHash = "0x".concat(crypto_1.default.pseudoRandomBytes(32).toString("hex"));
                                randomBytes = "0x".concat(crypto_1.default.pseudoRandomBytes(128).toString("hex"));
                                randomAddress = "0x".concat(crypto_1.default.pseudoRandomBytes(20).toString("hex"));
                                randomSignature = "0x".concat(crypto_1.default.pseudoRandomBytes(65).toString("hex"));
                                eip1271Sig = (0, execution_1.buildContractSignature)(randomAddress, randomSignature);
                                signatures = (0, execution_2.buildSignatureBytes)([eip1271Sig]);
                                return [4 /*yield*/, (0, chai_1.expect)(safe.checkNSignatures(randomHash, randomBytes, signatures, 1)).to.be.revertedWith("GS027")];
                            case 3:
                                _a.sent();
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
