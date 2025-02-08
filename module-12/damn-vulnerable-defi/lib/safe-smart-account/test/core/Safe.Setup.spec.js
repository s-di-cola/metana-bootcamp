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
var units_1 = require("@ethersproject/units");
var setup_1 = require("../utils/setup");
var execution_1 = require("../../src/utils/execution");
var constants_2 = require("../../src/utils/constants");
var encoding_1 = require("../utils/encoding");
describe("Safe", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        return [4 /*yield*/, (0, setup_1.getSafeTemplate)()];
                    case 2:
                        _c.template = _d.sent();
                        return [4 /*yield*/, (0, setup_1.getMock)()];
                    case 3: return [2 /*return*/, (_c.mock = _d.sent(),
                            _c)];
                }
            });
        }); });
        describe("setup", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should not allow to call setup on singleton", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var singleton, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, hardhat_1.deployments.fixture()];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, (0, setup_1.getSafeSingleton)()];
                            case 2:
                                singleton = _b.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, singleton.getThreshold()];
                            case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).to.be.deep.eq(ethers_1.BigNumber.from(1))];
                            case 4:
                                _b.sent();
                                // Because setup wasn't called on the singleton it breaks the assumption made
                                // within `getModulesPaginated` method that the linked list will be always correctly
                                // initialized with 0x1 as a starting element and 0x1 as the end
                                // But because `setupModules` wasn't called, it is empty.
                                return [4 /*yield*/, (0, chai_1.expect)(singleton.getModulesPaginated(constants_2.AddressOne, 10)).to.be.reverted];
                            case 5:
                                // Because setup wasn't called on the singleton it breaks the assumption made
                                // within `getModulesPaginated` method that the linked list will be always correctly
                                // initialized with 0x1 as a starting element and 0x1 as the end
                                // But because `setupModules` wasn't called, it is empty.
                                _b.sent();
                                // "Should not be able to retrieve owners (currently the contract will run in an endless loop when not initialized)"
                                return [4 /*yield*/, (0, chai_1.expect)(singleton.getOwners()).to.be.reverted];
                            case 6:
                                // "Should not be able to retrieve owners (currently the contract will run in an endless loop when not initialized)"
                                _b.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(singleton.setup([user1.address, user2.address, user3.address], 2, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero)).to.be.revertedWith("GS200")];
                            case 7:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should set domain hash", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var template, _a, _b, _c, _d, _e, _f, _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                template = (_h.sent()).template;
                                return [4 /*yield*/, (0, chai_1.expect)(template.setup([user1.address, user2.address, user3.address], 2, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero))
                                        .to.emit(template, "SafeSetup")
                                        .withArgs(user1.address, [user1.address, user2.address, user3.address], 2, constants_1.AddressZero, constants_1.AddressZero)];
                            case 2:
                                _h.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, template.domainSeparator()];
                            case 3:
                                _c = (_a = _b.apply(void 0, [_h.sent()]).to.be).eq;
                                _d = execution_1.calculateSafeDomainSeparator;
                                _e = [template];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4: return [4 /*yield*/, _c.apply(_a, [_d.apply(void 0, _e.concat([_h.sent()]))])];
                            case 5:
                                _h.sent();
                                _f = chai_1.expect;
                                return [4 /*yield*/, template.getOwners()];
                            case 6: return [4 /*yield*/, _f.apply(void 0, [_h.sent()]).to.be.deep.eq([user1.address, user2.address, user3.address])];
                            case 7:
                                _h.sent();
                                _g = chai_1.expect;
                                return [4 /*yield*/, template.getThreshold()];
                            case 8: return [4 /*yield*/, _g.apply(void 0, [_h.sent()]).to.be.deep.eq(ethers_1.BigNumber.from(2))];
                            case 9:
                                _h.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if called twice", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var template;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                template = (_a.sent()).template;
                                return [4 /*yield*/, template.setup([user1.address, user2.address, user3.address], 2, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(template.setup([user1.address, user2.address, user3.address], 2, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero)).to.be.revertedWith("GS200")];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if same owner is included twice", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var template;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                template = (_a.sent()).template;
                                return [4 /*yield*/, (0, chai_1.expect)(template.setup([user2.address, user1.address, user2.address], 2, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero)).to.be.revertedWith("GS204")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if 0 address is used as an owner", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var template;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                template = (_a.sent()).template;
                                return [4 /*yield*/, (0, chai_1.expect)(template.setup([user2.address, constants_1.AddressZero], 2, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero)).to.be.revertedWith("GS203")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if Safe itself is used as an owner", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var template;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                template = (_a.sent()).template;
                                return [4 /*yield*/, (0, chai_1.expect)(template.setup([user2.address, template.address], 2, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero)).to.be.revertedWith("GS203")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if sentinel is used as an owner", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var template;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                template = (_a.sent()).template;
                                return [4 /*yield*/, (0, chai_1.expect)(template.setup([user2.address, constants_2.AddressOne], 2, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero)).to.be.revertedWith("GS203")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if same owner is included twice one after each other", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var template;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                template = (_a.sent()).template;
                                return [4 /*yield*/, (0, chai_1.expect)(template.setup([user2.address, user2.address], 2, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero)).to.be.revertedWith("GS203")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if threshold is too high", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var template;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                template = (_a.sent()).template;
                                return [4 /*yield*/, (0, chai_1.expect)(template.setup([user1.address, user2.address, user3.address], 4, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero)).to.be.revertedWith("GS201")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if threshold is 0", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var template;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                template = (_a.sent()).template;
                                return [4 /*yield*/, (0, chai_1.expect)(template.setup([user1.address, user2.address, user3.address], 0, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero)).to.be.revertedWith("GS202")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if owners are empty", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var template;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                template = (_a.sent()).template;
                                return [4 /*yield*/, (0, chai_1.expect)(template.setup([], 0, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero)).to.be.revertedWith("GS202")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should set fallback handler and call sub inititalizer", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var template, source, testIntializer, initData, _a, _b, _c, _d, _e, _f, _g, _h, _j;
                    return __generator(this, function (_k) {
                        switch (_k.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                template = (_k.sent()).template;
                                source = "\n            contract Initializer {\n                function init(bytes4 data) public {\n                    bytes32 slot = 0x4242424242424242424242424242424242424242424242424242424242424242;\n                    // solhint-disable-next-line no-inline-assembly\n                    assembly {\n                        sstore(slot, data)\n                    }\n                }\n            }";
                                return [4 /*yield*/, (0, setup_1.deployContract)(user1, source)];
                            case 2:
                                testIntializer = _k.sent();
                                initData = testIntializer.interface.encodeFunctionData("init", ["0x42baddad"]);
                                return [4 /*yield*/, (0, chai_1.expect)(template.setup([user1.address, user2.address, user3.address], 2, testIntializer.address, initData, constants_2.AddressOne, constants_1.AddressZero, 0, constants_1.AddressZero))
                                        .to.emit(template, "SafeSetup")
                                        .withArgs(user1.address, [user1.address, user2.address, user3.address], 2, testIntializer.address, constants_2.AddressOne)];
                            case 3:
                                _k.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, template.domainSeparator()];
                            case 4:
                                _c = (_a = _b.apply(void 0, [_k.sent()]).to.be).eq;
                                _d = execution_1.calculateSafeDomainSeparator;
                                _e = [template];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 5: return [4 /*yield*/, _c.apply(_a, [_d.apply(void 0, _e.concat([_k.sent()]))])];
                            case 6:
                                _k.sent();
                                _f = chai_1.expect;
                                return [4 /*yield*/, template.getOwners()];
                            case 7: return [4 /*yield*/, _f.apply(void 0, [_k.sent()]).to.be.deep.eq([user1.address, user2.address, user3.address])];
                            case 8:
                                _k.sent();
                                _g = chai_1.expect;
                                return [4 /*yield*/, template.getThreshold()];
                            case 9: return [4 /*yield*/, _g.apply(void 0, [_k.sent()]).to.be.deep.eq(ethers_1.BigNumber.from(2))];
                            case 10:
                                _k.sent();
                                _h = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(template.address, "0x6c9a6c4a39284e37ed1cf53d337577d14212a4870fb976a4366c693b939918d5")];
                            case 11: return [4 /*yield*/, _h.apply(void 0, [_k.sent()]).to.be.eq("0x" + "1".padStart(64, "0"))];
                            case 12:
                                _k.sent();
                                _j = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(template.address, "0x4242424242424242424242424242424242424242424242424242424242424242")];
                            case 13: return [4 /*yield*/, _j.apply(void 0, [_k.sent()]).to.be.eq("0x" + "42baddad".padEnd(64, "0"))];
                            case 14:
                                _k.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should fail if sub initializer fails", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var template, source, testIntializer, initData;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                template = (_a.sent()).template;
                                source = "\n            contract Initializer {\n                function init(bytes4 data) public {\n                    require(false, \"Computer says nah\");\n                }\n            }";
                                return [4 /*yield*/, (0, setup_1.deployContract)(user1, source)];
                            case 2:
                                testIntializer = _a.sent();
                                initData = testIntializer.interface.encodeFunctionData("init", ["0x42baddad"]);
                                return [4 /*yield*/, (0, chai_1.expect)(template.setup([user1.address, user2.address, user3.address], 2, testIntializer.address, initData, constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero)).to.be.revertedWith("GS000")];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should fail if ether payment fails", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, template, mock, payment, transferData;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), template = _a.template, mock = _a.mock;
                                payment = 133742;
                                transferData = (0, encoding_1.encodeTransfer)(user1.address, payment);
                                return [4 /*yield*/, mock.givenCalldataRevert(transferData)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(template.setup([user1.address, user2.address, user3.address], 2, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, payment, constants_1.AddressZero)).to.be.revertedWith("GS011")];
                            case 3:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should work with ether payment to deployer", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var template, payment, userBalance, _a, _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                template = (_f.sent()).template;
                                payment = (0, units_1.parseEther)("10");
                                return [4 /*yield*/, user1.sendTransaction({ to: template.address, value: payment })];
                            case 2:
                                _f.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(user1.address)];
                            case 3:
                                userBalance = _f.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(template.address)];
                            case 4: return [4 /*yield*/, _a.apply(void 0, [_f.sent()]).to.be.deep.eq((0, units_1.parseEther)("10"))];
                            case 5:
                                _f.sent();
                                return [4 /*yield*/, template.setup([user1.address, user2.address, user3.address], 2, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, payment, constants_1.AddressZero)];
                            case 6:
                                _f.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(template.address)];
                            case 7: return [4 /*yield*/, _b.apply(void 0, [_f.sent()]).to.be.deep.eq((0, units_1.parseEther)("0"))];
                            case 8:
                                _f.sent();
                                _c = chai_1.expect;
                                _e = (_d = userBalance).lt;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(user1.address)];
                            case 9: return [4 /*yield*/, _c.apply(void 0, [_e.apply(_d, [_f.sent()])]).to.be.true];
                            case 10:
                                _f.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should work with ether payment to account", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var template, payment, userBalance, _a, _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                template = (_e.sent()).template;
                                payment = (0, units_1.parseEther)("10");
                                return [4 /*yield*/, user1.sendTransaction({ to: template.address, value: payment })];
                            case 2:
                                _e.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(user2.address)];
                            case 3:
                                userBalance = _e.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(template.address)];
                            case 4: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).to.be.deep.eq((0, units_1.parseEther)("10"))];
                            case 5:
                                _e.sent();
                                return [4 /*yield*/, template.setup([user1.address, user2.address, user3.address], 2, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, payment, user2.address)];
                            case 6:
                                _e.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(template.address)];
                            case 7: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).to.be.deep.eq((0, units_1.parseEther)("0"))];
                            case 8:
                                _e.sent();
                                _c = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(user2.address)];
                            case 9: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).to.be.deep.eq(userBalance.add(payment))];
                            case 10:
                                _e.sent();
                                _d = chai_1.expect;
                                return [4 /*yield*/, template.getOwners()];
                            case 11: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).to.be.deep.eq([user1.address, user2.address, user3.address])];
                            case 12:
                                _e.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should fail if token payment fails", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, template, mock, payment, transferData;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), template = _a.template, mock = _a.mock;
                                payment = 133742;
                                transferData = (0, encoding_1.encodeTransfer)(user1.address, payment);
                                return [4 /*yield*/, mock.givenCalldataRevert(transferData)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(template.setup([user1.address, user2.address, user3.address], 2, constants_1.AddressZero, "0x", constants_1.AddressZero, mock.address, payment, constants_1.AddressZero)).to.be.revertedWith("GS012")];
                            case 3:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should work with token payment to deployer", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, template, mock, payment, transferData, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _d.sent(), template = _a.template, mock = _a.mock;
                                payment = 133742;
                                transferData = (0, encoding_1.encodeTransfer)(user1.address, payment);
                                return [4 /*yield*/, mock.givenCalldataReturnBool(transferData, true)];
                            case 2:
                                _d.sent();
                                return [4 /*yield*/, template.setup([user1.address, user2.address, user3.address], 2, constants_1.AddressZero, "0x", constants_1.AddressZero, mock.address, payment, constants_1.AddressZero)];
                            case 3:
                                _d.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, mock.callStatic.invocationCountForCalldata(transferData)];
                            case 4:
                                _b.apply(void 0, [_d.sent()]).to.be.deep.equals(ethers_1.BigNumber.from(1));
                                _c = chai_1.expect;
                                return [4 /*yield*/, template.getOwners()];
                            case 5: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).to.be.deep.eq([user1.address, user2.address, user3.address])];
                            case 6:
                                _d.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should work with token payment to account", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, template, mock, payment, transferData, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _d.sent(), template = _a.template, mock = _a.mock;
                                payment = 133742;
                                transferData = (0, encoding_1.encodeTransfer)(user2.address, payment);
                                return [4 /*yield*/, mock.givenCalldataReturnBool(transferData, true)];
                            case 2:
                                _d.sent();
                                return [4 /*yield*/, template.setup([user1.address, user2.address, user3.address], 2, constants_1.AddressZero, "0x", constants_1.AddressZero, mock.address, payment, user2.address)];
                            case 3:
                                _d.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, mock.callStatic.invocationCountForCalldata(transferData)];
                            case 4:
                                _b.apply(void 0, [_d.sent()]).to.be.deep.equals(ethers_1.BigNumber.from(1));
                                _c = chai_1.expect;
                                return [4 /*yield*/, template.getOwners()];
                            case 5: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).to.be.deep.eq([user1.address, user2.address, user3.address])];
                            case 6:
                                _d.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should revert if the initializer address does not contain code", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var template;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                template = (_a.sent()).template;
                                return [4 /*yield*/, (0, chai_1.expect)(template.setup([user1.address], 1, user2.address, "0xbeef73", constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero)).to.be.revertedWith("GS002")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should fail if tried to set the fallback handler address to self", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var template;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                template = (_a.sent()).template;
                                return [4 /*yield*/, (0, chai_1.expect)(template.setup([user1.address], 1, constants_1.AddressZero, "0x", template.address, constants_1.AddressZero, 0, constants_1.AddressZero)).to.be.revertedWith("GS400")];
                            case 2:
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
