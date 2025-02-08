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
var execution_1 = require("../../src/utils/execution");
var chai_1 = require("chai");
var hardhat_1 = require("hardhat");
require("@nomiclabs/hardhat-ethers");
var constants_1 = require("@ethersproject/constants");
var setup_1 = require("../utils/setup");
var execution_2 = require("../../src/utils/execution");
var encoding_1 = require("../utils/encoding");
var ethers_1 = require("ethers");
var contracts_1 = require("../utils/contracts");
describe("CompatibilityFallbackHandler", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user1, user2, setupTests;
    return __generator(this, function (_b) {
        _a = hardhat_1.waffle.provider.getWallets(), user1 = _a[0], user2 = _a[1];
        setupTests = hardhat_1.deployments.createFixture(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var signLib, handler, signerSafe, safe, validator, killLib;
            var deployments = _b.deployments;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, deployments.fixture()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory("SignMessageLib")];
                    case 2: return [4 /*yield*/, (_c.sent()).deploy()];
                    case 3:
                        signLib = _c.sent();
                        return [4 /*yield*/, (0, setup_1.getCompatFallbackHandler)()];
                    case 4:
                        handler = _c.sent();
                        return [4 /*yield*/, (0, setup_1.getSafeWithOwners)([user1.address], 1, handler.address)];
                    case 5:
                        signerSafe = _c.sent();
                        return [4 /*yield*/, (0, setup_1.getSafeWithOwners)([user1.address, user2.address, signerSafe.address], 2, handler.address)];
                    case 6:
                        safe = _c.sent();
                        return [4 /*yield*/, (0, setup_1.compatFallbackHandlerContract)()];
                    case 7:
                        validator = (_c.sent()).attach(safe.address);
                        return [4 /*yield*/, (0, contracts_1.killLibContract)(user1)];
                    case 8:
                        killLib = _c.sent();
                        return [2 /*return*/, {
                                safe: safe,
                                validator: validator,
                                handler: handler,
                                killLib: killLib,
                                signLib: signLib,
                                signerSafe: signerSafe,
                            }];
                }
            });
        }); });
        describe("ERC1155", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("to handle onERC1155Received", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var handler, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                handler = (_b.sent()).handler;
                                _a = chai_1.expect;
                                return [4 /*yield*/, handler.callStatic.onERC1155Received(constants_1.AddressZero, constants_1.AddressZero, 0, 0, "0x")];
                            case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).to.be.eq("0xf23a6e61")];
                            case 3:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("to handle onERC1155BatchReceived", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var handler, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                handler = (_b.sent()).handler;
                                _a = chai_1.expect;
                                return [4 /*yield*/, handler.callStatic.onERC1155BatchReceived(constants_1.AddressZero, constants_1.AddressZero, [], [], "0x")];
                            case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).to.be.eq("0xbc197c81")];
                            case 3:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("ERC721", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("to handle onERC721Received", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var handler, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                handler = (_b.sent()).handler;
                                _a = chai_1.expect;
                                return [4 /*yield*/, handler.callStatic.onERC721Received(constants_1.AddressZero, constants_1.AddressZero, 0, "0x")];
                            case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).to.be.eq("0x150b7a02")];
                            case 3:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("ERC777", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("to handle tokensReceived", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var handler;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                handler = (_a.sent()).handler;
                                return [4 /*yield*/, handler.callStatic.tokensReceived(constants_1.AddressZero, constants_1.AddressZero, constants_1.AddressZero, 0, "0x", "0x")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("isValidSignature(bytes,bytes)", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should revert if called directly", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var handler;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                handler = (_a.sent()).handler;
                                return [4 /*yield*/, (0, chai_1.expect)(handler.callStatic["isValidSignature(bytes,bytes)"]("0xbaddad", "0x")).to.be.revertedWith("function call to a non-contract account")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if message was not signed", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var validator;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                validator = (_a.sent()).validator;
                                return [4 /*yield*/, (0, chai_1.expect)(validator.callStatic["isValidSignature(bytes,bytes)"]("0xbaddad", "0x")).to.be.revertedWith("Hash not approved")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if signature is not valid", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var validator;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                validator = (_a.sent()).validator;
                                return [4 /*yield*/, (0, chai_1.expect)(validator.callStatic["isValidSignature(bytes,bytes)"]("0xbaddad", "0xdeaddeaddeaddead")).to.be.reverted];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should return magic value if message was signed", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, validator, signLib, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _c.sent(), safe = _a.safe, validator = _a.validator, signLib = _a.signLib;
                                return [4 /*yield*/, (0, execution_2.executeContractCallWithSigners)(safe, signLib, "signMessage", ["0xbaddad"], [user1, user2], true)];
                            case 2:
                                _c.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, validator.callStatic["isValidSignature(bytes,bytes)"]("0xbaddad", "0x")];
                            case 3:
                                _b.apply(void 0, [_c.sent()]).to.be.eq("0x20c13b0b");
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should return magic value if enough owners signed and allow a mix different signature types", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, validator, signerSafe, sig1, _b, _c, sig2, _d, _e, _f, _g, validatorPreImageMessage, _h, _j, signerSafeMessageHash, _k, _l, signerSafeOwnerSignature, signerSafeSig, _m;
                    var _o, _p;
                    return __generator(this, function (_q) {
                        switch (_q.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _q.sent(), validator = _a.validator, signerSafe = _a.signerSafe;
                                _o = {
                                    signer: user1.address
                                };
                                _c = (_b = user1)._signTypedData;
                                _p = { verifyingContract: validator.address };
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 2: return [4 /*yield*/, _c.apply(_b, [(_p.chainId = _q.sent(), _p), execution_2.EIP712_SAFE_MESSAGE_TYPE,
                                    { message: "0xbaddad" }])];
                            case 3:
                                sig1 = (_o.data = _q.sent(),
                                    _o);
                                _d = execution_2.signHash;
                                _e = [user2];
                                _f = execution_2.calculateSafeMessageHash;
                                _g = [validator, "0xbaddad"];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4: return [4 /*yield*/, _d.apply(void 0, _e.concat([_f.apply(void 0, _g.concat([_q.sent()]))]))];
                            case 5:
                                sig2 = _q.sent();
                                _h = execution_2.preimageSafeMessageHash;
                                _j = [validator, "0xbaddad"];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 6:
                                validatorPreImageMessage = _h.apply(void 0, _j.concat([_q.sent()]));
                                _k = execution_2.calculateSafeMessageHash;
                                _l = [signerSafe, validatorPreImageMessage];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 7:
                                signerSafeMessageHash = _k.apply(void 0, _l.concat([_q.sent()]));
                                return [4 /*yield*/, (0, execution_2.signHash)(user1, signerSafeMessageHash)];
                            case 8:
                                signerSafeOwnerSignature = _q.sent();
                                signerSafeSig = (0, execution_1.buildContractSignature)(signerSafe.address, signerSafeOwnerSignature.data);
                                _m = chai_1.expect;
                                return [4 /*yield*/, validator.callStatic["isValidSignature(bytes,bytes)"]("0xbaddad", (0, execution_2.buildSignatureBytes)([sig1, sig2, signerSafeSig]))];
                            case 9:
                                _m.apply(void 0, [_q.sent()]).to.be.eq("0x20c13b0b");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("isValidSignature(bytes32,bytes)", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should revert if called directly", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var handler, dataHash;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                handler = (_a.sent()).handler;
                                dataHash = hardhat_1.ethers.utils.keccak256("0xbaddad");
                                return [4 /*yield*/, (0, chai_1.expect)(handler.callStatic["isValidSignature(bytes32,bytes)"](dataHash, "0x")).to.be.revertedWith("function call to a non-contract account")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if message was not signed", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var validator, dataHash;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                validator = (_a.sent()).validator;
                                dataHash = hardhat_1.ethers.utils.keccak256("0xbaddad");
                                return [4 /*yield*/, (0, chai_1.expect)(validator.callStatic["isValidSignature(bytes32,bytes)"](dataHash, "0x")).to.be.revertedWith("Hash not approved")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if signature is not valid", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var validator, dataHash;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                validator = (_a.sent()).validator;
                                dataHash = hardhat_1.ethers.utils.keccak256("0xbaddad");
                                return [4 /*yield*/, (0, chai_1.expect)(validator.callStatic["isValidSignature(bytes32,bytes)"](dataHash, "0xdeaddeaddeaddead")).to.be.reverted];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should return magic value if message was signed", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, validator, signLib, dataHash, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _c.sent(), safe = _a.safe, validator = _a.validator, signLib = _a.signLib;
                                dataHash = hardhat_1.ethers.utils.keccak256("0xbaddad");
                                return [4 /*yield*/, (0, execution_2.executeContractCallWithSigners)(safe, signLib, "signMessage", [dataHash], [user1, user2], true)];
                            case 2:
                                _c.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, validator.callStatic["isValidSignature(bytes32,bytes)"](dataHash, "0x")];
                            case 3:
                                _b.apply(void 0, [_c.sent()]).to.be.eq("0x1626ba7e");
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should return magic value if enough owners signed and allow a mix different signature types", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, validator, signerSafe, dataHash, typedDataSig, _b, _c, ethSignSig, _d, _e, _f, _g, validatorPreImageMessage, _h, _j, signerSafeMessageHash, _k, _l, signerSafeOwnerSignature, signerSafeSig, _m;
                    var _o, _p;
                    return __generator(this, function (_q) {
                        switch (_q.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _q.sent(), validator = _a.validator, signerSafe = _a.signerSafe;
                                dataHash = hardhat_1.ethers.utils.keccak256("0xbaddad");
                                _o = {
                                    signer: user1.address
                                };
                                _c = (_b = user1)._signTypedData;
                                _p = { verifyingContract: validator.address };
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 2: return [4 /*yield*/, _c.apply(_b, [(_p.chainId = _q.sent(), _p), execution_2.EIP712_SAFE_MESSAGE_TYPE,
                                    { message: dataHash }])];
                            case 3:
                                typedDataSig = (_o.data = _q.sent(),
                                    _o);
                                _d = execution_2.signHash;
                                _e = [user2];
                                _f = execution_2.calculateSafeMessageHash;
                                _g = [validator, dataHash];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4: return [4 /*yield*/, _d.apply(void 0, _e.concat([_f.apply(void 0, _g.concat([_q.sent()]))]))];
                            case 5:
                                ethSignSig = _q.sent();
                                _h = execution_2.preimageSafeMessageHash;
                                _j = [validator, dataHash];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 6:
                                validatorPreImageMessage = _h.apply(void 0, _j.concat([_q.sent()]));
                                _k = execution_2.calculateSafeMessageHash;
                                _l = [signerSafe, validatorPreImageMessage];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 7:
                                signerSafeMessageHash = _k.apply(void 0, _l.concat([_q.sent()]));
                                return [4 /*yield*/, (0, execution_2.signHash)(user1, signerSafeMessageHash)];
                            case 8:
                                signerSafeOwnerSignature = _q.sent();
                                signerSafeSig = (0, execution_1.buildContractSignature)(signerSafe.address, signerSafeOwnerSignature.data);
                                _m = chai_1.expect;
                                return [4 /*yield*/, validator.callStatic["isValidSignature(bytes32,bytes)"](dataHash, (0, execution_2.buildSignatureBytes)([typedDataSig, ethSignSig, signerSafeSig]))];
                            case 9:
                                _m.apply(void 0, [_q.sent()]).to.be.eq("0x1626ba7e");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("getModules", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("returns enabled modules", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, validator, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _d.sent(), safe = _a.safe, validator = _a.validator;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_2.executeContractCallWithSigners)(safe, safe, "enableModule", [user2.address], [user1, user2]))
                                        .to.emit(safe, "EnabledModule")
                                        .withArgs(user2.address)];
                            case 2:
                                _d.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, safe.isModuleEnabled(user2.address)];
                            case 3: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).to.be.true];
                            case 4:
                                _d.sent();
                                _c = chai_1.expect;
                                return [4 /*yield*/, validator.getModules()];
                            case 5: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).to.be.deep.equal([user2.address])];
                            case 6:
                                _d.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("getMessageHash", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should generate the correct hash", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, validator, _b, _c, _d, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _g.sent(), safe = _a.safe, validator = _a.validator;
                                _c = chai_1.expect;
                                return [4 /*yield*/, validator.getMessageHash("0xdead")];
                            case 2:
                                _d = (_b = _c.apply(void 0, [_g.sent()]).to.be).eq;
                                _e = execution_2.calculateSafeMessageHash;
                                _f = [safe, "0xdead"];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 3:
                                _d.apply(_b, [_e.apply(void 0, _f.concat([_g.sent()]))]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("getMessageHashForSafe", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should revert if target does not return domain separator", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var handler;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                handler = (_a.sent()).handler;
                                return [4 /*yield*/, (0, chai_1.expect)(handler.getMessageHashForSafe(handler.address, "0xdead")).to.be.reverted];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should generate the correct hash", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, handler, safe, _b, _c, _d, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _g.sent(), handler = _a.handler, safe = _a.safe;
                                _c = chai_1.expect;
                                return [4 /*yield*/, handler.getMessageHashForSafe(safe.address, "0xdead")];
                            case 2:
                                _d = (_b = _c.apply(void 0, [_g.sent()]).to.be).eq;
                                _e = execution_2.calculateSafeMessageHash;
                                _f = [safe, "0xdead"];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 3:
                                _d.apply(_b, [_e.apply(void 0, _f.concat([_g.sent()]))]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("simulate", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                it.skip("can be called for any Safe", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/];
                }); }); });
                it("should revert changes", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, validator, killLib, code, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _d.sent(), validator = _a.validator, killLib = _a.killLib;
                                return [4 /*yield*/, hardhat_1.ethers.provider.getCode(validator.address)];
                            case 2:
                                code = _d.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, validator.callStatic.simulate(killLib.address, killLib.interface.encodeFunctionData("killme"))];
                            case 3:
                                _b.apply(void 0, [_d.sent()]).to.be.eq("0x");
                                _c = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.ethers.provider.getCode(validator.address)];
                            case 4:
                                _c.apply(void 0, [_d.sent()]).to.be.eq(code);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should return result", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, validator, killLib, handler, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _c.sent(), validator = _a.validator, killLib = _a.killLib, handler = _a.handler;
                                _b = chai_1.expect;
                                return [4 /*yield*/, validator.callStatic.simulate(killLib.address, killLib.interface.encodeFunctionData("expose"))];
                            case 2:
                                _b.apply(void 0, [_c.sent()]).to.be.eq("0x000000000000000000000000" + handler.address.slice(2).toLowerCase());
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should propagate revert message", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, validator, killLib;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), validator = _a.validator, killLib = _a.killLib;
                                return [4 /*yield*/, (0, chai_1.expect)(validator.callStatic.simulate(killLib.address, killLib.interface.encodeFunctionData("trever"))).to.revertedWith("Why are you doing this?")];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should simulate transaction", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, validator, killLib, estimate;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), validator = _a.validator, killLib = _a.killLib;
                                return [4 /*yield*/, validator.callStatic.simulate(killLib.address, killLib.interface.encodeFunctionData("estimate", [validator.address, "0x"]))];
                            case 2:
                                estimate = _b.sent();
                                (0, chai_1.expect)(ethers_1.BigNumber.from(estimate).toNumber()).to.be.lte(5000);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should return modified state", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, validator, killLib, value, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _c.sent(), validator = _a.validator, killLib = _a.killLib;
                                return [4 /*yield*/, validator.callStatic.simulate(killLib.address, killLib.interface.encodeFunctionData("updateAndGet", []))];
                            case 2:
                                value = _c.sent();
                                (0, chai_1.expect)(ethers_1.BigNumber.from(value).toNumber()).to.be.eq(1);
                                _b = chai_1.expect;
                                return [4 /*yield*/, killLib.value()];
                            case 3:
                                _b.apply(void 0, [(_c.sent()).toNumber()]).to.be.eq(0);
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
