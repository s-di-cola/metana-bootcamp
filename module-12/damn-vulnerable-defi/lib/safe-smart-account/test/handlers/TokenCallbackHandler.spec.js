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
describe("TokenCallbackHandler", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hardhat_1.deployments.fixture()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe("ERC1155", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should support ERC1155 interface", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var handler, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, setup_1.getTokenCallbackHandler)()];
                            case 1:
                                handler = _b.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, handler.callStatic.supportsInterface("0x4e2312e0")];
                            case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).to.be.eq(true)];
                            case 3:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("to handle onERC1155Received", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var handler, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, setup_1.getTokenCallbackHandler)()];
                            case 1:
                                handler = _b.sent();
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
                            case 0: return [4 /*yield*/, (0, setup_1.getTokenCallbackHandler)()];
                            case 1:
                                handler = _b.sent();
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
                it("should support ERC721 interface", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var handler, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, setup_1.getTokenCallbackHandler)()];
                            case 1:
                                handler = _b.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, handler.callStatic.supportsInterface("0x150b7a02")];
                            case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).to.be.eq(true)];
                            case 3:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("to handle onERC721Received", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var handler, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, setup_1.getTokenCallbackHandler)()];
                            case 1:
                                handler = _b.sent();
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
                            case 0: return [4 /*yield*/, (0, setup_1.getTokenCallbackHandler)()];
                            case 1:
                                handler = _a.sent();
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
        describe("ERC165", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should support ERC165 interface", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var handler, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, setup_1.getTokenCallbackHandler)()];
                            case 1:
                                handler = _b.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, handler.callStatic.supportsInterface("0x01ffc9a7")];
                            case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).to.be.eq(true)];
                            case 3:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should not support random interface", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var handler, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, setup_1.getTokenCallbackHandler)()];
                            case 1:
                                handler = _b.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, handler.callStatic.supportsInterface("0xbaddad42")];
                            case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).to.be.eq(false)];
                            case 3:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should not support invalid interface", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var handler, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, setup_1.getTokenCallbackHandler)()];
                            case 1:
                                handler = _b.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, handler.callStatic.supportsInterface("0xffffffff")];
                            case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).to.be.eq(false)];
                            case 3:
                                _b.sent();
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
