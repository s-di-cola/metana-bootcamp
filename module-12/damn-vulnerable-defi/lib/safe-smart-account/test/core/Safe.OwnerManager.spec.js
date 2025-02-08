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
describe("OwnerManager", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                    case 2: return [2 /*return*/, (_c.safe = _d.sent(),
                            _c)];
                }
            });
        }); });
        describe("addOwnerWithThreshold", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("can only be called from Safe itself", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)(safe.addOwnerWithThreshold(user2.address, 1)).to.be.revertedWith("GS031")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not set Safe itself", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [safe.address, 1], [user1])).to.revertedWith("GS013")];
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
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [constants_2.AddressOne, 1], [user1])).to.revertedWith("GS013")];
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
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [constants_1.AddressZero, 1], [user1])).to.revertedWith("GS013")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not add owner twice", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [user2.address, 1], [user1])];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [user2.address, 1], [user1])).to.revertedWith("GS013")];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not add owner and change threshold to 0", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [user2.address, 0], [user1])).to.revertedWith("GS013")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not add owner and change threshold to larger number than new owner count", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [user2.address, 3], [user1])).to.revertedWith("GS013")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("emits event for new owner", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_d.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [user2.address, 1], [user1]))
                                        .to.emit(safe, "AddedOwner")
                                        .withArgs(user2.address)
                                        .and.to.not.emit(safe, "ChangedThreshold")];
                            case 2:
                                _d.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, safe.getThreshold()];
                            case 3: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).to.be.deep.eq(ethers_1.BigNumber.from(1))];
                            case 4:
                                _d.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, safe.isOwner(user1.address)];
                            case 5: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).to.be.true];
                            case 6:
                                _d.sent();
                                _c = chai_1.expect;
                                return [4 /*yield*/, safe.getOwners()];
                            case 7: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).to.be.deep.equal([user2.address, user1.address])];
                            case 8:
                                _d.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("emits event for new owner and threshold if changed", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_d.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [user2.address, 2], [user1]))
                                        .to.emit(safe, "AddedOwner")
                                        .withArgs(user2.address)
                                        .and.to.emit(safe, "ChangedThreshold")
                                        .withArgs(2)];
                            case 2:
                                _d.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, safe.getThreshold()];
                            case 3: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).to.be.deep.eq(ethers_1.BigNumber.from(2))];
                            case 4:
                                _d.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, safe.isOwner(user1.address)];
                            case 5: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).to.be.true];
                            case 6:
                                _d.sent();
                                _c = chai_1.expect;
                                return [4 /*yield*/, safe.getOwners()];
                            case 7: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).to.be.deep.equal([user2.address, user1.address])];
                            case 8:
                                _d.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("removeOwner", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("can only be called from Safe itself", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)(safe.removeOwner(constants_2.AddressOne, user2.address, 1)).to.be.revertedWith("GS031")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not remove sentinel", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [user2.address, 1], [user1])];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "removeOwner", [constants_2.AddressOne, constants_2.AddressOne, 1], [user1])).to.revertedWith("GS013")];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not remove 0 Address", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [user2.address, 1], [user1])];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "removeOwner", [constants_2.AddressOne, constants_1.AddressZero, 1], [user1])).to.revertedWith("GS013")];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("Invalid prevOwner, owner pair provided - Invalid target", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [user2.address, 1], [user1])];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "removeOwner", [constants_2.AddressOne, user1.address, 1], [user1])).to.revertedWith("GS013")];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("Invalid prevOwner, owner pair provided - Invalid sentinel", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [user2.address, 1], [user1])];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "removeOwner", [constants_1.AddressZero, user2.address, 1], [user1])).to.revertedWith("GS013")];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("Invalid prevOwner, owner pair provided - Invalid source", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [user2.address, 1], [user1])];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "removeOwner", [user1.address, user2.address, 1], [user1])).to.revertedWith("GS013")];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not remove owner and change threshold to larger number than new owner count", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [user2.address, 1], [user1])];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "removeOwner", [user2.address, user1.address, 2], [user1])).to.revertedWith("GS013")];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not remove owner and change threshold to 0", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [user2.address, 1], [user1])];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "removeOwner", [user2.address, user1.address, 0], [user1])).to.revertedWith("GS013")];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not remove owner only owner", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "removeOwner", [constants_2.AddressOne, user1.address, 1], [user1])).to.revertedWith("GS013")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("emits event for removed owner and threshold if changed", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                    return __generator(this, function (_r) {
                        switch (_r.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_r.sent()).safe;
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [user2.address, 1], [user1])];
                            case 2:
                                _r.sent();
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [user3.address, 2], [user1])];
                            case 3:
                                _r.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, safe.getOwners()];
                            case 4: return [4 /*yield*/, _a.apply(void 0, [_r.sent()]).to.be.deep.equal([user3.address, user2.address, user1.address])];
                            case 5:
                                _r.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, safe.getThreshold()];
                            case 6: return [4 /*yield*/, _b.apply(void 0, [_r.sent()]).to.be.deep.eq(ethers_1.BigNumber.from(2))];
                            case 7:
                                _r.sent();
                                _c = chai_1.expect;
                                return [4 /*yield*/, safe.isOwner(user1.address)];
                            case 8: return [4 /*yield*/, _c.apply(void 0, [_r.sent()]).to.be.true];
                            case 9:
                                _r.sent();
                                _d = chai_1.expect;
                                return [4 /*yield*/, safe.isOwner(user2.address)];
                            case 10: return [4 /*yield*/, _d.apply(void 0, [_r.sent()]).to.be.true];
                            case 11:
                                _r.sent();
                                _e = chai_1.expect;
                                return [4 /*yield*/, safe.isOwner(user3.address)];
                            case 12: return [4 /*yield*/, _e.apply(void 0, [_r.sent()]).to.be.true];
                            case 13:
                                _r.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "removeOwner", [user3.address, user2.address, 1], [user1, user2]))
                                        .to.emit(safe, "RemovedOwner")
                                        .withArgs(user2.address)
                                        .and.to.emit(safe, "ChangedThreshold")
                                        .withArgs(1)];
                            case 14:
                                _r.sent();
                                _f = chai_1.expect;
                                return [4 /*yield*/, safe.getOwners()];
                            case 15: return [4 /*yield*/, _f.apply(void 0, [_r.sent()]).to.be.deep.equal([user3.address, user1.address])];
                            case 16:
                                _r.sent();
                                _g = chai_1.expect;
                                return [4 /*yield*/, safe.getThreshold()];
                            case 17: return [4 /*yield*/, _g.apply(void 0, [_r.sent()]).to.be.deep.eq(ethers_1.BigNumber.from(1))];
                            case 18:
                                _r.sent();
                                _h = chai_1.expect;
                                return [4 /*yield*/, safe.isOwner(user1.address)];
                            case 19: return [4 /*yield*/, _h.apply(void 0, [_r.sent()]).to.be.true];
                            case 20:
                                _r.sent();
                                _j = chai_1.expect;
                                return [4 /*yield*/, safe.isOwner(user2.address)];
                            case 21: return [4 /*yield*/, _j.apply(void 0, [_r.sent()]).to.be.false];
                            case 22:
                                _r.sent();
                                _k = chai_1.expect;
                                return [4 /*yield*/, safe.isOwner(user3.address)];
                            case 23: return [4 /*yield*/, _k.apply(void 0, [_r.sent()]).to.be.true];
                            case 24:
                                _r.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "removeOwner", [constants_2.AddressOne, user3.address, 1], [user1]))
                                        .to.emit(safe, "RemovedOwner")
                                        .withArgs(user3.address)
                                        .and.to.not.emit(safe, "ChangedThreshold")];
                            case 25:
                                _r.sent();
                                _l = chai_1.expect;
                                return [4 /*yield*/, safe.getThreshold()];
                            case 26: return [4 /*yield*/, _l.apply(void 0, [_r.sent()]).to.be.deep.eq(ethers_1.BigNumber.from(1))];
                            case 27:
                                _r.sent();
                                _m = chai_1.expect;
                                return [4 /*yield*/, safe.isOwner(user1.address)];
                            case 28: return [4 /*yield*/, _m.apply(void 0, [_r.sent()]).to.be.true];
                            case 29:
                                _r.sent();
                                _o = chai_1.expect;
                                return [4 /*yield*/, safe.isOwner(user2.address)];
                            case 30: return [4 /*yield*/, _o.apply(void 0, [_r.sent()]).to.be.false];
                            case 31:
                                _r.sent();
                                _p = chai_1.expect;
                                return [4 /*yield*/, safe.isOwner(user3.address)];
                            case 32: return [4 /*yield*/, _p.apply(void 0, [_r.sent()]).to.be.false];
                            case 33:
                                _r.sent();
                                _q = chai_1.expect;
                                return [4 /*yield*/, safe.getOwners()];
                            case 34: return [4 /*yield*/, _q.apply(void 0, [_r.sent()]).to.be.deep.equal([user1.address])];
                            case 35:
                                _r.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it.skip("Check internal ownercount state", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "addOwnerWithThreshold", [user2.address, 1], [user1])];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "removeOwner", [user2.address, user1.address, 2], [user1])).to.revertedWith("GS013")];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("swapOwner", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("can only be called from Safe itself", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)(safe.swapOwner(constants_2.AddressOne, user1.address, user2.address)).to.be.revertedWith("GS031")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not swap in Safe itself", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "swapOwner", [constants_2.AddressOne, user1.address, safe.address], [user1])).to.revertedWith("GS013")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not swap in sentinel", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "swapOwner", [constants_2.AddressOne, user1.address, constants_2.AddressOne], [user1])).to.revertedWith("GS013")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not swap in 0 Address", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "swapOwner", [constants_2.AddressOne, user1.address, constants_1.AddressZero], [user1])).to.revertedWith("GS013")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not swap in existing owner", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "swapOwner", [constants_2.AddressOne, user1.address, user1.address], [user1])).to.revertedWith("GS013")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not swap out sentinel", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "swapOwner", [user1.address, constants_2.AddressOne, user2.address], [user1])).to.revertedWith("GS013")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("can not swap out 0 address", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "swapOwner", [user3.address, constants_1.AddressZero, user2.address], [user1])).to.revertedWith("GS013")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("Invalid prevOwner, owner pair provided - Invalid target", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "swapOwner", [constants_2.AddressOne, user3.address, user2.address], [user1])).to.revertedWith("GS013")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("Invalid prevOwner, owner pair provided - Invalid sentinel", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "swapOwner", [constants_1.AddressZero, user1.address, user2.address], [user1])).to.revertedWith("GS013")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("Invalid prevOwner, owner pair provided - Invalid source", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "swapOwner", [user2.address, user1.address, user2.address], [user1])).to.revertedWith("GS013")];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("emits event for replacing owner", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, _a, _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_j.sent()).safe;
                                _a = chai_1.expect;
                                return [4 /*yield*/, safe.getOwners()];
                            case 2: return [4 /*yield*/, _a.apply(void 0, [_j.sent()]).to.be.deep.equal([user1.address])];
                            case 3:
                                _j.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, safe.getThreshold()];
                            case 4: return [4 /*yield*/, _b.apply(void 0, [_j.sent()]).to.be.deep.eq(ethers_1.BigNumber.from(1))];
                            case 5:
                                _j.sent();
                                _c = chai_1.expect;
                                return [4 /*yield*/, safe.isOwner(user1.address)];
                            case 6: return [4 /*yield*/, _c.apply(void 0, [_j.sent()]).to.be.true];
                            case 7:
                                _j.sent();
                                _d = chai_1.expect;
                                return [4 /*yield*/, safe.isOwner(user2.address)];
                            case 8: return [4 /*yield*/, _d.apply(void 0, [_j.sent()]).to.be.false];
                            case 9:
                                _j.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "swapOwner", [constants_2.AddressOne, user1.address, user2.address], [user1]))
                                        .to.emit(safe, "RemovedOwner")
                                        .withArgs(user1.address)
                                        .and.to.emit(safe, "AddedOwner")
                                        .withArgs(user2.address)];
                            case 10:
                                _j.sent();
                                _e = chai_1.expect;
                                return [4 /*yield*/, safe.getOwners()];
                            case 11: return [4 /*yield*/, _e.apply(void 0, [_j.sent()]).to.be.deep.equal([user2.address])];
                            case 12:
                                _j.sent();
                                _f = chai_1.expect;
                                return [4 /*yield*/, safe.getThreshold()];
                            case 13: return [4 /*yield*/, _f.apply(void 0, [_j.sent()]).to.be.deep.eq(ethers_1.BigNumber.from(1))];
                            case 14:
                                _j.sent();
                                _g = chai_1.expect;
                                return [4 /*yield*/, safe.isOwner(user1.address)];
                            case 15: return [4 /*yield*/, _g.apply(void 0, [_j.sent()]).to.be.false];
                            case 16:
                                _j.sent();
                                _h = chai_1.expect;
                                return [4 /*yield*/, safe.isOwner(user2.address)];
                            case 17: return [4 /*yield*/, _h.apply(void 0, [_j.sent()]).to.be.true];
                            case 18:
                                _j.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("changeThreshold", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("can only be called from Safe itself", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, chai_1.expect)(safe.changeThreshold(1)).to.be.revertedWith("GS031")];
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
