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
var encoding_1 = require("../utils/encoding");
describe("SignMessageLib", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user1, user2, setupTests;
    return __generator(this, function (_b) {
        _a = hardhat_1.waffle.provider.getWallets(), user1 = _a[0], user2 = _a[1];
        setupTests = hardhat_1.deployments.createFixture(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var lib;
            var _c;
            var deployments = _b.deployments;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, deployments.fixture()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory("SignMessageLib")];
                    case 2: return [4 /*yield*/, (_d.sent()).deploy()];
                    case 3:
                        lib = _d.sent();
                        _c = {};
                        return [4 /*yield*/, (0, setup_1.getSafeWithOwners)([user1.address, user2.address])];
                    case 4: return [2 /*return*/, (_c.safe = _d.sent(),
                            _c.lib = lib,
                            _c)];
                }
            });
        }); });
        describe("signMessage", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("can only if msg.sender provides domain separator", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var lib;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                lib = (_a.sent()).lib;
                                return [4 /*yield*/, (0, chai_1.expect)(lib.signMessage("0xbaddad")).to.be.reverted];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should emit event", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, lib, libSafe, messageHash, _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _f.sent(), safe = _a.safe, lib = _a.lib;
                                libSafe = lib.attach(safe.address);
                                _b = execution_1.calculateSafeMessageHash;
                                _c = [safe, "0xbaddad"];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 2:
                                messageHash = _b.apply(void 0, _c.concat([_f.sent()]));
                                _d = chai_1.expect;
                                return [4 /*yield*/, safe.signedMessages(messageHash)];
                            case 3:
                                _d.apply(void 0, [_f.sent()]).to.be.eq(0);
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, lib, "signMessage", ["0xbaddad"], [user1, user2], true))
                                        .to.emit(libSafe, "SignMsg")
                                        .withArgs(messageHash)];
                            case 4:
                                _f.sent();
                                _e = chai_1.expect;
                                return [4 /*yield*/, safe.signedMessages(messageHash)];
                            case 5:
                                _e.apply(void 0, [_f.sent()]).to.be.eq(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can be used only via DELEGATECALL opcode", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var lib;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                lib = (_a.sent()).lib;
                                (0, chai_1.expect)(lib.signMessage("0xbaddad")).to.revertedWith("function selector was not recognized and there's no fallback function");
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("changes the expected storage slot without touching the most important ones", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, lib, SIGNED_MESSAGES_MAPPING_STORAGE_SLOT, message, eip191MessageHash, safeInternalMsgHash, _b, _c, expectedStorageSlot, masterCopyAddressBeforeSigning, ownerCountBeforeSigning, thresholdBeforeSigning, nonceBeforeSigning, msgStorageSlotBeforeSigning, _d, masterCopyAddressAfterSigning, ownerCountAfterSigning, thresholdAfterSigning, nonceAfterSigning, msgStorageSlotAfterSigning, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _f.sent(), safe = _a.safe, lib = _a.lib;
                                SIGNED_MESSAGES_MAPPING_STORAGE_SLOT = 7;
                                message = "no rugpull, funds must be safu";
                                eip191MessageHash = hardhat_1.default.ethers.utils.hashMessage(message);
                                _b = execution_1.calculateSafeMessageHash;
                                _c = [safe, hardhat_1.default.ethers.utils.hashMessage(message)];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 2:
                                safeInternalMsgHash = _b.apply(void 0, _c.concat([_f.sent()]));
                                expectedStorageSlot = hardhat_1.default.ethers.utils.keccak256(hardhat_1.default.ethers.utils.defaultAbiCoder.encode(["bytes32", "uint256"], [safeInternalMsgHash, SIGNED_MESSAGES_MAPPING_STORAGE_SLOT]));
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, 0)];
                            case 3:
                                masterCopyAddressBeforeSigning = _f.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, 3)];
                            case 4:
                                ownerCountBeforeSigning = _f.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, 4)];
                            case 5:
                                thresholdBeforeSigning = _f.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, 5)];
                            case 6:
                                nonceBeforeSigning = _f.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, expectedStorageSlot)];
                            case 7:
                                msgStorageSlotBeforeSigning = _f.sent();
                                (0, chai_1.expect)(nonceBeforeSigning).to.be.eq("0x".concat("0".padStart(64, "0")));
                                _d = chai_1.expect;
                                return [4 /*yield*/, safe.signedMessages(safeInternalMsgHash)];
                            case 8:
                                _d.apply(void 0, [_f.sent()]).to.be.eq(0);
                                (0, chai_1.expect)(msgStorageSlotBeforeSigning).to.be.eq("0x".concat("0".padStart(64, "0")));
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, lib, "signMessage", [eip191MessageHash], [user1, user2], true)];
                            case 9:
                                _f.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, 0)];
                            case 10:
                                masterCopyAddressAfterSigning = _f.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, 3)];
                            case 11:
                                ownerCountAfterSigning = _f.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, 4)];
                            case 12:
                                thresholdAfterSigning = _f.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, 5)];
                            case 13:
                                nonceAfterSigning = _f.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, expectedStorageSlot)];
                            case 14:
                                msgStorageSlotAfterSigning = _f.sent();
                                _e = chai_1.expect;
                                return [4 /*yield*/, safe.signedMessages(safeInternalMsgHash)];
                            case 15:
                                _e.apply(void 0, [_f.sent()]).to.be.eq(1);
                                (0, chai_1.expect)(masterCopyAddressBeforeSigning).to.be.eq(masterCopyAddressAfterSigning);
                                (0, chai_1.expect)(thresholdBeforeSigning).to.be.eq(thresholdAfterSigning);
                                (0, chai_1.expect)(ownerCountBeforeSigning).to.be.eq(ownerCountAfterSigning);
                                (0, chai_1.expect)(nonceAfterSigning).to.be.eq("0x".concat("1".padStart(64, "0")));
                                (0, chai_1.expect)(msgStorageSlotAfterSigning).to.be.eq("0x".concat("1".padStart(64, "0")));
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
