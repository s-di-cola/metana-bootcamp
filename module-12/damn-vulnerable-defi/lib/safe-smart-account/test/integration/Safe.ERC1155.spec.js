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
var ethers_1 = require("ethers");
require("@nomiclabs/hardhat-ethers");
var constants_1 = require("@ethersproject/constants");
var setup_1 = require("../utils/setup");
describe("Safe", function () { return __awaiter(void 0, void 0, void 0, function () {
    var mockErc1155, setupWithTemplate, _a, user1, user2;
    return __generator(this, function (_b) {
        mockErc1155 = function () { return __awaiter(void 0, void 0, void 0, function () {
            var Erc1155;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory("ERC1155Token")];
                    case 1:
                        Erc1155 = _a.sent();
                        return [4 /*yield*/, Erc1155.deploy()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        setupWithTemplate = hardhat_1.deployments.createFixture(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var _c;
            var deployments = _b.deployments;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, deployments.fixture()];
                    case 1:
                        _d.sent();
                        _c = {};
                        return [4 /*yield*/, (0, setup_1.getSafeTemplate)()];
                    case 2:
                        _c.safe = _d.sent();
                        return [4 /*yield*/, mockErc1155()];
                    case 3: return [2 /*return*/, (_c.token = _d.sent(),
                            _c)];
                }
            });
        }); });
        _a = hardhat_1.waffle.provider.getWallets(), user1 = _a[0], user2 = _a[1];
        describe("ERC1155", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should reject if callback not accepted", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, token, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupWithTemplate()];
                            case 1:
                                _a = _c.sent(), safe = _a.safe, token = _a.token;
                                // Setup Safe
                                return [4 /*yield*/, safe.setup([user1.address, user2.address], 1, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero)];
                            case 2:
                                // Setup Safe
                                _c.sent();
                                // Mint test tokens
                                return [4 /*yield*/, token.mint(user1.address, 23, 1337, "0x")];
                            case 3:
                                // Mint test tokens
                                _c.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, token.balanceOf(user1.address, 23)];
                            case 4: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).to.be.deep.eq(ethers_1.BigNumber.from(1337))];
                            case 5:
                                _c.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(token.mint(safe.address, 23, 1337, "0x"), "Should not accept minted token if handler not set").to.be.reverted];
                            case 6:
                                _c.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(token.safeTransferFrom(user1.address, safe.address, 23, 1337, "0x"), "Should not accept sent token if handler not set").to.be.reverted];
                            case 7:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should not reject if callback is accepted", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, token, handler, _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, setupWithTemplate()];
                            case 1:
                                _a = _f.sent(), safe = _a.safe, token = _a.token;
                                return [4 /*yield*/, (0, setup_1.defaultTokenCallbackHandlerDeployment)()];
                            case 2:
                                handler = _f.sent();
                                // Setup Safe
                                return [4 /*yield*/, safe.setup([user1.address, user2.address], 1, constants_1.AddressZero, "0x", handler.address, constants_1.AddressZero, 0, constants_1.AddressZero)];
                            case 3:
                                // Setup Safe
                                _f.sent();
                                return [4 /*yield*/, token.mint(safe.address, 23, 1337, "0x")];
                            case 4:
                                _f.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, token.balanceOf(safe.address, 23)];
                            case 5: return [4 /*yield*/, _b.apply(void 0, [_f.sent()]).to.be.deep.eq(ethers_1.BigNumber.from(1337))];
                            case 6:
                                _f.sent();
                                return [4 /*yield*/, token.mint(user1.address, 23, 23, "0x")];
                            case 7:
                                _f.sent();
                                _c = chai_1.expect;
                                return [4 /*yield*/, token.balanceOf(user1.address, 23)];
                            case 8: return [4 /*yield*/, _c.apply(void 0, [_f.sent()]).to.be.deep.eq(ethers_1.BigNumber.from(23))];
                            case 9:
                                _f.sent();
                                return [4 /*yield*/, token.safeTransferFrom(user1.address, safe.address, 23, 23, "0x")];
                            case 10:
                                _f.sent();
                                _d = chai_1.expect;
                                return [4 /*yield*/, token.balanceOf(user1.address, 23)];
                            case 11: return [4 /*yield*/, _d.apply(void 0, [_f.sent()]).to.be.deep.eq(ethers_1.BigNumber.from(0))];
                            case 12:
                                _f.sent();
                                _e = chai_1.expect;
                                return [4 /*yield*/, token.balanceOf(safe.address, 23)];
                            case 13: return [4 /*yield*/, _e.apply(void 0, [_f.sent()]).to.be.deep.eq(ethers_1.BigNumber.from(1360))];
                            case 14:
                                _f.sent();
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
