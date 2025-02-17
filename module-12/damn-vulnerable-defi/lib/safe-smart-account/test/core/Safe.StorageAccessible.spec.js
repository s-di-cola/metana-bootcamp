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
var ethers_1 = require("ethers");
var contracts_1 = require("../utils/contracts");
describe("StorageAccessible", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user1, user2, setupTests;
    return __generator(this, function (_b) {
        _a = hardhat_1.waffle.provider.getWallets(), user1 = _a[0], user2 = _a[1];
        setupTests = hardhat_1.deployments.createFixture(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var killLib;
            var _c;
            var deployments = _b.deployments;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, deployments.fixture()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, (0, contracts_1.killLibContract)(user1)];
                    case 2:
                        killLib = _d.sent();
                        _c = {};
                        return [4 /*yield*/, (0, setup_1.getSafeWithOwners)([user1.address, user2.address], 1)];
                    case 3: return [2 /*return*/, (_c.safe = _d.sent(),
                            _c.killLib = killLib,
                            _c)];
                }
            });
        }); });
        describe("getStorageAt", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("can read singleton", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var singleton, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, (0, setup_1.getSafeSingleton)()];
                            case 2:
                                singleton = _b.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, singleton.getStorageAt(3, 2)];
                            case 3:
                                _a.apply(void 0, [_b.sent()]).to.be.eq(ethers_1.utils.solidityPack(["uint256", "uint256"], [0, 1]));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can read instantiated Safe", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, singleton, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_b.sent()).safe;
                                return [4 /*yield*/, (0, setup_1.getSafeSingleton)()];
                            case 2:
                                singleton = _b.sent();
                                // Read singleton address, empty slots for module and owner linked lists, owner count and threshold
                                _a = chai_1.expect;
                                return [4 /*yield*/, safe.getStorageAt(0, 5)];
                            case 3:
                                // Read singleton address, empty slots for module and owner linked lists, owner count and threshold
                                _a.apply(void 0, [_b.sent()]).to.be.eq(ethers_1.utils.solidityPack(["uint256", "uint256", "uint256", "uint256", "uint256"], [singleton.address, 0, 0, 2, 1]));
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("simulateAndRevert", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should revert changes", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, killLib;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, killLib = _a.killLib;
                                return [4 /*yield*/, (0, chai_1.expect)(safe.callStatic.simulateAndRevert(killLib.address, killLib.interface.encodeFunctionData("killme"))).to.be.reverted];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert the revert with message", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, killLib;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, killLib = _a.killLib;
                                return [4 /*yield*/, (0, chai_1.expect)(safe.callStatic.simulateAndRevert(killLib.address, killLib.interface.encodeFunctionData("trever"))).to.be.reverted];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should return estimate in revert", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, killLib;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, killLib = _a.killLib;
                                return [4 /*yield*/, (0, chai_1.expect)(safe.callStatic.simulateAndRevert(killLib.address, killLib.interface.encodeFunctionData("estimate", [safe.address, "0x"]))).to.be.reverted];
                            case 2:
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
