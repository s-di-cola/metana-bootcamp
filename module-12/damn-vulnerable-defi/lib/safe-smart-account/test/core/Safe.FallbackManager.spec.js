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
describe("FallbackManager", function () { return __awaiter(void 0, void 0, void 0, function () {
    var setupWithTemplate, _a, user1, user2;
    return __generator(this, function (_b) {
        setupWithTemplate = hardhat_1.deployments.createFixture(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var source, mirror;
            var _c;
            var deployments = _b.deployments;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, deployments.fixture()];
                    case 1:
                        _d.sent();
                        source = "\n        contract Mirror {\n            function lookAtMe() public returns (bytes memory) {\n                return msg.data;\n            }\n\n            function nowLookAtYou(address you, string memory howYouLikeThat) public returns (bytes memory) {\n                return msg.data;\n            }\n        }";
                        return [4 /*yield*/, (0, setup_1.deployContract)(user1, source)];
                    case 2:
                        mirror = _d.sent();
                        _c = {};
                        return [4 /*yield*/, (0, setup_1.getSafeTemplate)()];
                    case 3: return [2 /*return*/, (_c.safe = _d.sent(),
                            _c.mirror = mirror,
                            _c)];
                }
            });
        }); });
        _a = hardhat_1.waffle.provider.getWallets(), user1 = _a[0], user2 = _a[1];
        describe("setFallbackManager", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("is correctly set on deployment", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, handler, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupWithTemplate()];
                            case 1:
                                safe = (_c.sent()).safe;
                                return [4 /*yield*/, (0, setup_1.defaultTokenCallbackHandlerDeployment)()];
                            case 2:
                                handler = _c.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, "0x6c9a6c4a39284e37ed1cf53d337577d14212a4870fb976a4366c693b939918d5")];
                            case 3: 
                            // Check fallback handler
                            return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).to.be.eq("0x" + "".padStart(64, "0"))];
                            case 4:
                                // Check fallback handler
                                _c.sent();
                                // Setup Safe
                                return [4 /*yield*/, safe.setup([user1.address, user2.address], 1, constants_1.AddressZero, "0x", handler.address, constants_1.AddressZero, 0, constants_1.AddressZero)];
                            case 5:
                                // Setup Safe
                                _c.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, "0x6c9a6c4a39284e37ed1cf53d337577d14212a4870fb976a4366c693b939918d5")];
                            case 6: 
                            // Check fallback handler
                            return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).to.be.eq("0x" + handler.address.toLowerCase().slice(2).padStart(64, "0"))];
                            case 7:
                                // Check fallback handler
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("is correctly set", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, handler, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupWithTemplate()];
                            case 1:
                                safe = (_c.sent()).safe;
                                return [4 /*yield*/, (0, setup_1.defaultTokenCallbackHandlerDeployment)()];
                            case 2:
                                handler = _c.sent();
                                // Setup Safe
                                return [4 /*yield*/, safe.setup([user1.address, user2.address], 1, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero)];
                            case 3:
                                // Setup Safe
                                _c.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, "0x6c9a6c4a39284e37ed1cf53d337577d14212a4870fb976a4366c693b939918d5")];
                            case 4: 
                            // Check fallback handler
                            return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).to.be.eq("0x" + "".padStart(64, "0"))];
                            case 5:
                                // Check fallback handler
                                _c.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "setFallbackHandler", [handler.address], [user1]))
                                        .to.emit(safe, "ChangedFallbackHandler")
                                        .withArgs(handler.address)];
                            case 6:
                                _c.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, "0x6c9a6c4a39284e37ed1cf53d337577d14212a4870fb976a4366c693b939918d5")];
                            case 7: 
                            // Check fallback handler
                            return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).to.be.eq("0x" + handler.address.toLowerCase().slice(2).padStart(64, "0"))];
                            case 8:
                                // Check fallback handler
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("emits event when is set", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, handler;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupWithTemplate()];
                            case 1:
                                safe = (_a.sent()).safe;
                                return [4 /*yield*/, (0, setup_1.defaultTokenCallbackHandlerDeployment)()];
                            case 2:
                                handler = _a.sent();
                                // Setup Safe
                                return [4 /*yield*/, safe.setup([user1.address, user2.address], 1, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero)];
                            case 3:
                                // Setup Safe
                                _a.sent();
                                // Check event
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "setFallbackHandler", [handler.address], [user1]))
                                        .to.emit(safe, "ChangedFallbackHandler")
                                        .withArgs(handler.address)];
                            case 4:
                                // Check event
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("is called when set", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, handler, safeHandler, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupWithTemplate()];
                            case 1:
                                safe = (_c.sent()).safe;
                                return [4 /*yield*/, (0, setup_1.defaultTokenCallbackHandlerDeployment)()];
                            case 2:
                                handler = _c.sent();
                                return [4 /*yield*/, (0, setup_1.defaultTokenCallbackHandlerContract)()];
                            case 3:
                                safeHandler = (_c.sent()).attach(safe.address);
                                _a = chai_1.expect;
                                return [4 /*yield*/, safe.getThreshold()];
                            case 4: 
                            // Check that Safe is NOT setup
                            return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).to.be.deep.eq(ethers_1.BigNumber.from(0))];
                            case 5:
                                // Check that Safe is NOT setup
                                _c.sent();
                                // Check unset callbacks
                                return [4 /*yield*/, (0, chai_1.expect)(safeHandler.callStatic.onERC1155Received(constants_1.AddressZero, constants_1.AddressZero, 0, 0, "0x")).to.be.reverted];
                            case 6:
                                // Check unset callbacks
                                _c.sent();
                                // Setup Safe
                                return [4 /*yield*/, safe.setup([user1.address, user2.address], 1, constants_1.AddressZero, "0x", handler.address, constants_1.AddressZero, 0, constants_1.AddressZero)];
                            case 7:
                                // Setup Safe
                                _c.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, safeHandler.callStatic.onERC1155Received(constants_1.AddressZero, constants_1.AddressZero, 0, 0, "0x")];
                            case 8: 
                            // Check callbacks
                            return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).to.be.eq("0xf23a6e61")];
                            case 9:
                                // Check callbacks
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("sends along msg.sender on simple call", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, mirror, tx, response;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupWithTemplate()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, mirror = _a.mirror;
                                // Setup Safe
                                return [4 /*yield*/, safe.setup([user1.address, user2.address], 1, constants_1.AddressZero, "0x", mirror.address, constants_1.AddressZero, 0, constants_1.AddressZero)];
                            case 2:
                                // Setup Safe
                                _b.sent();
                                tx = {
                                    to: safe.address,
                                    data: mirror.interface.encodeFunctionData("lookAtMe"),
                                };
                                return [4 /*yield*/, user1.call(tx)];
                            case 3:
                                response = _b.sent();
                                (0, chai_1.expect)(response).to.be.eq("0x" +
                                    "0000000000000000000000000000000000000000000000000000000000000020" +
                                    "0000000000000000000000000000000000000000000000000000000000000018" +
                                    "7f8dc53c" +
                                    user1.address.slice(2).toLowerCase() +
                                    "0000000000000000");
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("sends along msg.sender on more complex call", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, mirror, tx, response;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupWithTemplate()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, mirror = _a.mirror;
                                // Setup Safe
                                return [4 /*yield*/, safe.setup([user1.address, user2.address], 1, constants_1.AddressZero, "0x", mirror.address, constants_1.AddressZero, 0, constants_1.AddressZero)];
                            case 2:
                                // Setup Safe
                                _b.sent();
                                tx = {
                                    to: safe.address,
                                    data: mirror.interface.encodeFunctionData("nowLookAtYou", [user2.address, "pink<>black"]),
                                };
                                return [4 /*yield*/, user1.call(tx)];
                            case 3:
                                response = _b.sent();
                                (0, chai_1.expect)(response).to.be.eq("0x" +
                                    "0000000000000000000000000000000000000000000000000000000000000020" +
                                    "0000000000000000000000000000000000000000000000000000000000000098" +
                                    // Function call
                                    "b2a88d99" +
                                    "000000000000000000000000" +
                                    user2.address.slice(2).toLowerCase() +
                                    "0000000000000000000000000000000000000000000000000000000000000040" +
                                    "000000000000000000000000000000000000000000000000000000000000000b" +
                                    "70696e6b3c3e626c61636b000000000000000000000000000000000000000000" +
                                    user1.address.slice(2).toLowerCase() +
                                    "0000000000000000");
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("cannot be set to self", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupWithTemplate()];
                            case 1:
                                safe = (_a.sent()).safe;
                                // Setup Safe
                                return [4 /*yield*/, safe.setup([user1.address], 1, constants_1.AddressZero, "0x", constants_1.AddressZero, constants_1.AddressZero, 0, constants_1.AddressZero)];
                            case 2:
                                // Setup Safe
                                _a.sent();
                                // The transaction execution function doesn't bubble up revert messages so we check for a generic transaction fail code GS013
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "setFallbackHandler", [safe.address], [user1])).to.be.revertedWith("GS013")];
                            case 3:
                                // The transaction execution function doesn't bubble up revert messages so we check for a generic transaction fail code GS013
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
