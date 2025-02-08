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
var execution_1 = require("../../src/utils/execution");
var constants_2 = require("../../src/utils/constants");
describe("ModuleManager", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user1, user2, user3, setupTests;
    return __generator(this, function (_b) {
        _a = hardhat_1.waffle.provider.getWallets(), user1 = _a[0], user2 = _a[1], user3 = _a[2];
        setupTests = hardhat_1.deployments.createFixture(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var _c;
            var deployments = _b.deployments;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, deployments.fixture()];
                    case 1:
                        _d.sent();
                        _c = {};
                        return [4 /*yield*/, (0, setup_1.getSafeWithOwners)([user1.address])];
                    case 2:
                        _c.safe = _d.sent();
                        return [4 /*yield*/, (0, setup_1.getMock)()];
                    case 3: return [2 /*return*/, (_c.mock = _d.sent(),
                            _c)];
                }
            });
        }); });
        describe("enableModule", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("can only be called from Safe itself", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)(safe.enableModule(user2.address)).to.be.revertedWith("GS031")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not set sentinel", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [constants_2.AddressOne], [user1])).to.revertedWith("GS013")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not set 0 Address", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [constants_1.AddressZero], [user1])).to.revertedWith("GS013")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not add module twice", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                // Use module for execution to see error
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user2.address], [user1])];
                            case 2:
                                // Use module for execution to see error
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user2.address], [user1])).to.revertedWith("GS013")];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("emits event for a new module", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_c.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user2.address], [user1]))
                                        .to.emit(safe, "EnabledModule")
                                        .withArgs(user2.address)];
                            case 2:
                                _c.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, safe.isModuleEnabled(user2.address)];
                            case 3: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).to.be.true];
                            case 4:
                                _c.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, safe.getModulesPaginated(constants_2.AddressOne, 10)];
                            case 5: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).to.be.deep.equal([[user2.address], constants_2.AddressOne])];
                            case 6:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can enable multiple", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, _a, _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_e.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user1.address], [user1]))
                                        .to.emit(safe, "EnabledModule")
                                        .withArgs(user1.address)];
                            case 2:
                                _e.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, safe.isModuleEnabled(user1.address)];
                            case 3: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).to.be.true];
                            case 4:
                                _e.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, safe.getModulesPaginated(constants_2.AddressOne, 10)];
                            case 5: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).to.be.deep.equal([[user1.address], constants_2.AddressOne])];
                            case 6:
                                _e.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user2.address], [user1]))
                                        .to.emit(safe, "EnabledModule")
                                        .withArgs(user2.address)];
                            case 7:
                                _e.sent();
                                _c = chai_1.expect;
                                return [4 /*yield*/, safe.isModuleEnabled(user2.address)];
                            case 8: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).to.be.true];
                            case 9:
                                _e.sent();
                                _d = chai_1.expect;
                                return [4 /*yield*/, safe.getModulesPaginated(constants_2.AddressOne, 10)];
                            case 10: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).to.be.deep.equal([[user2.address, user1.address], constants_2.AddressOne])];
                            case 11:
                                _e.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("disableModule", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("can only be called from Safe itself", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)(safe.disableModule(constants_2.AddressOne, user2.address)).to.be.revertedWith("GS031")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not set sentinel", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "disableModule", [constants_2.AddressOne, constants_2.AddressOne], [user1])).to.revertedWith("GS013")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not set 0 Address", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "disableModule", [constants_2.AddressOne, constants_1.AddressZero], [user1])).to.revertedWith("GS013")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("Invalid prevModule, module pair provided - Invalid target", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user2.address], [user1])];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "disableModule", [constants_2.AddressOne, user1.address], [user1])).to.revertedWith("GS013")];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("Invalid prevModule, module pair provided - Invalid sentinel", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user2.address], [user1])];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "disableModule", [constants_1.AddressZero, user2.address], [user1])).to.revertedWith("GS013")];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("Invalid prevModule, module pair provided - Invalid source", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user1.address], [user1])];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user2.address], [user1])];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "disableModule", [user1.address, user2.address], [user1])).to.revertedWith("GS013")];
                            case 4:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("emits event for disabled module", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, _a, _b, _c, _d, _e, _f, _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_h.sent()).safe;
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user1.address], [user1])];
                            case 2:
                                _h.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, safe.isModuleEnabled(user1.address)];
                            case 3: return [4 /*yield*/, _a.apply(void 0, [_h.sent()]).to.be.true];
                            case 4:
                                _h.sent();
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user2.address], [user1])];
                            case 5:
                                _h.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, safe.isModuleEnabled(user2.address)];
                            case 6: return [4 /*yield*/, _b.apply(void 0, [_h.sent()]).to.be.true];
                            case 7:
                                _h.sent();
                                _c = chai_1.expect;
                                return [4 /*yield*/, safe.getModulesPaginated(constants_2.AddressOne, 10)];
                            case 8: return [4 /*yield*/, _c.apply(void 0, [_h.sent()]).to.be.deep.equal([[user2.address, user1.address], constants_2.AddressOne])];
                            case 9:
                                _h.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "disableModule", [user2.address, user1.address], [user1]))
                                        .to.emit(safe, "DisabledModule")
                                        .withArgs(user1.address)];
                            case 10:
                                _h.sent();
                                _d = chai_1.expect;
                                return [4 /*yield*/, safe.isModuleEnabled(user1.address)];
                            case 11: return [4 /*yield*/, _d.apply(void 0, [_h.sent()]).to.be.false];
                            case 12:
                                _h.sent();
                                _e = chai_1.expect;
                                return [4 /*yield*/, safe.getModulesPaginated(constants_2.AddressOne, 10)];
                            case 13: return [4 /*yield*/, _e.apply(void 0, [_h.sent()]).to.be.deep.equal([[user2.address], constants_2.AddressOne])];
                            case 14:
                                _h.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "disableModule", [constants_2.AddressOne, user2.address], [user1]))
                                        .to.emit(safe, "DisabledModule")
                                        .withArgs(user2.address)];
                            case 15:
                                _h.sent();
                                _f = chai_1.expect;
                                return [4 /*yield*/, safe.isModuleEnabled(user2.address)];
                            case 16: return [4 /*yield*/, _f.apply(void 0, [_h.sent()]).to.be.false];
                            case 17:
                                _h.sent();
                                _g = chai_1.expect;
                                return [4 /*yield*/, safe.getModulesPaginated(constants_2.AddressOne, 10)];
                            case 18: return [4 /*yield*/, _g.apply(void 0, [_h.sent()]).to.be.deep.equal([[], constants_2.AddressOne])];
                            case 19:
                                _h.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("execTransactionFromModule", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("can not be called from sentinel", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, mock, readOnlySafe;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, mock = _a.mock;
                                readOnlySafe = safe.connect(hardhat_1.default.ethers.provider);
                                return [4 /*yield*/, (0, chai_1.expect)(readOnlySafe.callStatic.execTransactionFromModule(mock.address, 0, "0xbaddad", 0, { from: constants_2.AddressOne })).to.be.revertedWith("GS104")];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can only be called from enabled module", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, mock, user2Safe;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, mock = _a.mock;
                                user2Safe = safe.connect(user2);
                                return [4 /*yield*/, (0, chai_1.expect)(user2Safe.execTransactionFromModule(mock.address, 0, "0xbaddad", 0)).to.be.revertedWith("GS104")];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("emits event on execution success", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, mock, user2Safe, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _c.sent(), safe = _a.safe, mock = _a.mock;
                                user2Safe = safe.connect(user2);
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user2.address], [user1])];
                            case 2:
                                _c.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(user2Safe.execTransactionFromModule(mock.address, 0, "0xbaddad", 0))
                                        .to.emit(safe, "ExecutionFromModuleSuccess")
                                        .withArgs(user2.address)];
                            case 3:
                                _c.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, mock.callStatic.invocationCountForCalldata("0xbaddad")];
                            case 4:
                                _b.apply(void 0, [_c.sent()]).to.be.deep.equals(ethers_1.BigNumber.from(1));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("emits event on execution failure", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, mock, user2Safe;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, mock = _a.mock;
                                user2Safe = safe.connect(user2);
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user2.address], [user1])];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, mock.givenAnyRevert()];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(user2Safe.execTransactionFromModule(mock.address, 0, "0xbaddad", 0))
                                        .to.emit(safe, "ExecutionFromModuleFailure")
                                        .withArgs(user2.address)];
                            case 4:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("execTransactionFromModuleReturnData", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("can not be called from sentinel", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, mock, readOnlySafe;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, mock = _a.mock;
                                readOnlySafe = safe.connect(hardhat_1.default.ethers.provider);
                                return [4 /*yield*/, (0, chai_1.expect)(readOnlySafe.callStatic.execTransactionFromModuleReturnData(mock.address, 0, "0xbaddad", 0, { from: constants_2.AddressOne })).to.be.revertedWith("GS104")];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can only be called from enabled module", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, mock, user2Safe;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, mock = _a.mock;
                                user2Safe = safe.connect(user2);
                                return [4 /*yield*/, (0, chai_1.expect)(user2Safe.execTransactionFromModuleReturnData(mock.address, 0, "0xbaddad", 0)).to.be.revertedWith("GS104")];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("emits event on execution failure", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, mock, user2Safe;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, mock = _a.mock;
                                user2Safe = safe.connect(user2);
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user2.address], [user1])];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, mock.givenAnyRevert()];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(user2Safe.execTransactionFromModuleReturnData(mock.address, 0, "0xbaddad", 0))
                                        .to.emit(safe, "ExecutionFromModuleFailure")
                                        .withArgs(user2.address)];
                            case 4:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("emits event on execution success", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, mock, user2Safe, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _c.sent(), safe = _a.safe, mock = _a.mock;
                                user2Safe = safe.connect(user2);
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user2.address], [user1])];
                            case 2:
                                _c.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(user2Safe.execTransactionFromModuleReturnData(mock.address, 0, "0xbaddad", 0))
                                        .to.emit(safe, "ExecutionFromModuleSuccess")
                                        .withArgs(user2.address)];
                            case 3:
                                _c.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, mock.callStatic.invocationCountForCalldata("0xbaddad")];
                            case 4:
                                _b.apply(void 0, [_c.sent()]).to.be.deep.equals(ethers_1.BigNumber.from(1));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("Returns expected from contract on successs", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, mock, user2Safe, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _c.sent(), safe = _a.safe, mock = _a.mock;
                                user2Safe = safe.connect(user2);
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user2.address], [user1])];
                            case 2:
                                _c.sent();
                                return [4 /*yield*/, mock.givenCalldataReturn("0xbaddad", "0xdeaddeed")];
                            case 3:
                                _c.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, user2Safe.callStatic.execTransactionFromModuleReturnData(mock.address, 0, "0xbaddad", 0)];
                            case 4: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).to.be.deep.eq([
                                    true,
                                    "0xdeaddeed",
                                ])];
                            case 5:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("Returns expected from contract on failure", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, mock, user2Safe, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _c.sent(), safe = _a.safe, mock = _a.mock;
                                user2Safe = safe.connect(user2);
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user2.address], [user1])];
                            case 2:
                                _c.sent();
                                return [4 /*yield*/, mock.givenCalldataRevertWithMessage("0xbaddad", "Some random message")];
                            case 3:
                                _c.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, user2Safe.callStatic.execTransactionFromModuleReturnData(mock.address, 0, "0xbaddad", 0)];
                            case 4: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).to.be.deep.eq([
                                    false,
                                    "0x08c379a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000013536f6d652072616e646f6d206d65737361676500000000000000000000000000",
                                ])];
                            case 5:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("getModulesPaginated", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("requires page size to be greater than 0", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)(safe.getModulesPaginated(constants_2.AddressOne, 0)).to.be.revertedWith("GS106")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("requires start to be a module or start pointer", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_b.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)(safe.getModulesPaginated(constants_1.AddressZero, 1)).to.be.reverted];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user1.address], [user1])];
                            case 3:
                                _b.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, safe.getModulesPaginated(user1.address, 1)];
                            case 4:
                                _a.apply(void 0, [_b.sent()]).to.be.deep.equal([[], constants_2.AddressOne]);
                                return [4 /*yield*/, (0, chai_1.expect)(safe.getModulesPaginated(user2.address, 1)).to.be.revertedWith("GS105")];
                            case 5:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("Returns all modules over multiple pages", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, _a, _b, _c, _d, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_g.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user1.address], [user1]))
                                        .to.emit(safe, "EnabledModule")
                                        .withArgs(user1.address)];
                            case 2:
                                _g.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user2.address], [user1]))
                                        .to.emit(safe, "EnabledModule")
                                        .withArgs(user2.address)];
                            case 3:
                                _g.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user3.address], [user1]))
                                        .to.emit(safe, "EnabledModule")
                                        .withArgs(user3.address)];
                            case 4:
                                _g.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, safe.isModuleEnabled(user1.address)];
                            case 5: return [4 /*yield*/, _a.apply(void 0, [_g.sent()]).to.be.true];
                            case 6:
                                _g.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, safe.isModuleEnabled(user2.address)];
                            case 7: return [4 /*yield*/, _b.apply(void 0, [_g.sent()]).to.be.true];
                            case 8:
                                _g.sent();
                                _c = chai_1.expect;
                                return [4 /*yield*/, safe.isModuleEnabled(user3.address)];
                            case 9: return [4 /*yield*/, _c.apply(void 0, [_g.sent()]).to.be.true];
                            case 10:
                                _g.sent();
                                _d = chai_1.expect;
                                return [4 /*yield*/, safe.getModulesPaginated(constants_2.AddressOne, 1)];
                            case 11: 
                            /*
                            This will pass the test which is not correct
                            await expect(await safe.getModulesPaginated(AddressOne, 1)).to.be.deep.equal([[user3.address], user2.address])
                            await expect(await safe.getModulesPaginated(user2.address, 1)).to.be.deep.equal([[user1.address], AddressOne])
                            */
                            return [4 /*yield*/, _d.apply(void 0, [_g.sent()]).to.be.deep.equal([[user3.address], user3.address])];
                            case 12:
                                /*
                                This will pass the test which is not correct
                                await expect(await safe.getModulesPaginated(AddressOne, 1)).to.be.deep.equal([[user3.address], user2.address])
                                await expect(await safe.getModulesPaginated(user2.address, 1)).to.be.deep.equal([[user1.address], AddressOne])
                                */
                                _g.sent();
                                _e = chai_1.expect;
                                return [4 /*yield*/, safe.getModulesPaginated(user3.address, 1)];
                            case 13: return [4 /*yield*/, _e.apply(void 0, [_g.sent()]).to.be.deep.equal([[user2.address], user2.address])];
                            case 14:
                                _g.sent();
                                _f = chai_1.expect;
                                return [4 /*yield*/, safe.getModulesPaginated(user2.address, 1)];
                            case 15: return [4 /*yield*/, _f.apply(void 0, [_g.sent()]).to.be.deep.equal([[user1.address], constants_2.AddressOne])];
                            case 16:
                                _g.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("returns an empty array and end pointer for a safe with no modules", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_b.sent()).safe;
                                _a = chai_1.expect;
                                return [4 /*yield*/, safe.getModulesPaginated(constants_2.AddressOne, 10)];
                            case 2:
                                _a.apply(void 0, [_b.sent()]).to.be.deep.equal([[], constants_2.AddressOne]);
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
