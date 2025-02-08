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
var utils_1 = require("ethers/lib/utils");
describe("SimulateTxAccessor", function () { return __awaiter(void 0, void 0, void 0, function () {
    var killLibSource, _a, user1, user2, setupTests;
    return __generator(this, function (_b) {
        killLibSource = "\n    contract Test {\n        function killme() public {\n            selfdestruct(payable(msg.sender));\n        }\n    }";
        _a = hardhat_1.waffle.provider.getWallets(), user1 = _a[0], user2 = _a[1];
        setupTests = hardhat_1.deployments.createFixture(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var accessor, source, interactor, handler, safe, simulator;
            var deployments = _b.deployments;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, deployments.fixture()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, (0, setup_1.getSimulateTxAccessor)()];
                    case 2:
                        accessor = _c.sent();
                        source = "\n        contract Test {\n            function sendAndReturnBalance(address payable target, uint256 amount) public returns (uint256) {\n                (bool success,) = target.call{ value: amount }(\"\");\n                require(success, \"Transfer failed\");\n                return target.balance;\n            }\n        }";
                        return [4 /*yield*/, (0, setup_1.deployContract)(user1, source)];
                    case 3:
                        interactor = _c.sent();
                        return [4 /*yield*/, (0, setup_1.getCompatFallbackHandler)()];
                    case 4:
                        handler = _c.sent();
                        return [4 /*yield*/, (0, setup_1.getSafeWithOwners)([user1.address], 1, handler.address)];
                    case 5:
                        safe = _c.sent();
                        simulator = handler.attach(safe.address);
                        return [2 /*return*/, {
                                safe: safe,
                                accessor: accessor,
                                interactor: interactor,
                                simulator: simulator,
                            }];
                }
            });
        }); });
        describe("estimate", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should enforce delegatecall", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var accessor, killLib, tx, code, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                accessor = (_b.sent()).accessor;
                                return [4 /*yield*/, (0, setup_1.deployContract)(user1, killLibSource)];
                            case 2:
                                killLib = _b.sent();
                                tx = (0, execution_1.buildContractCall)(killLib, "killme", [], 0);
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getCode(accessor.address)];
                            case 3:
                                code = _b.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(accessor.simulate(tx.to, tx.value, tx.data, tx.operation)).to.be.revertedWith("SimulateTxAccessor should only be called via delegatecall")];
                            case 4:
                                _b.sent();
                                _a = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getCode(accessor.address)];
                            case 5:
                                _a.apply(void 0, [_b.sent()]).to.be.eq(code);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("simulate call", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, accessor, simulator, tx, simulationData, acccessibleData, simulation;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, accessor = _a.accessor, simulator = _a.simulator;
                                tx = (0, execution_1.buildContractCall)(safe, "getOwners", [], 0);
                                simulationData = accessor.interface.encodeFunctionData("simulate", [tx.to, tx.value, tx.data, tx.operation]);
                                return [4 /*yield*/, simulator.callStatic.simulate(accessor.address, simulationData)];
                            case 2:
                                acccessibleData = _b.sent();
                                simulation = accessor.interface.decodeFunctionResult("simulate", acccessibleData);
                                (0, chai_1.expect)(safe.interface.decodeFunctionResult("getOwners", simulation.returnData)[0]).to.be.deep.eq([user1.address]);
                                (0, chai_1.expect)(simulation.success).to.be.true;
                                (0, chai_1.expect)(simulation.estimate.toNumber()).to.be.lte(10000);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("simulate delegatecall", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, accessor, interactor, simulator, userBalance, tx, simulationData, acccessibleData, simulation;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, accessor = _a.accessor, interactor = _a.interactor, simulator = _a.simulator;
                                return [4 /*yield*/, user1.sendTransaction({ to: safe.address, value: (0, utils_1.parseEther)("1") })];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(user2.address)];
                            case 3:
                                userBalance = _b.sent();
                                tx = (0, execution_1.buildContractCall)(interactor, "sendAndReturnBalance", [user2.address, (0, utils_1.parseEther)("1")], 0, true);
                                simulationData = accessor.interface.encodeFunctionData("simulate", [tx.to, tx.value, tx.data, tx.operation]);
                                return [4 /*yield*/, simulator.callStatic.simulate(accessor.address, simulationData)];
                            case 4:
                                acccessibleData = _b.sent();
                                simulation = accessor.interface.decodeFunctionResult("simulate", acccessibleData);
                                (0, chai_1.expect)(interactor.interface.decodeFunctionResult("sendAndReturnBalance", simulation.returnData)[0]).to.be.deep.eq(userBalance.add((0, utils_1.parseEther)("1")));
                                (0, chai_1.expect)(simulation.success).to.be.true;
                                (0, chai_1.expect)(simulation.estimate.toNumber()).to.be.lte(15000);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("simulate selfdestruct", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, accessor, simulator, expectedCode, killLib, tx, simulationData, code, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _c.sent(), safe = _a.safe, accessor = _a.accessor, simulator = _a.simulator;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getCode(safe.address)];
                            case 2:
                                expectedCode = _c.sent();
                                return [4 /*yield*/, user1.sendTransaction({ to: safe.address, value: (0, utils_1.parseEther)("1") })];
                            case 3:
                                _c.sent();
                                return [4 /*yield*/, (0, setup_1.deployContract)(user1, killLibSource)];
                            case 4:
                                killLib = _c.sent();
                                tx = (0, execution_1.buildContractCall)(killLib, "killme", [], 0, true);
                                simulationData = accessor.interface.encodeFunctionData("simulate", [tx.to, tx.value, tx.data, tx.operation]);
                                return [4 /*yield*/, simulator.simulate(accessor.address, simulationData)];
                            case 5:
                                _c.sent();
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getCode(safe.address)];
                            case 6:
                                code = _c.sent();
                                (0, chai_1.expect)(code).to.be.eq(expectedCode);
                                (0, chai_1.expect)(code).to.be.not.eq("0x");
                                // Selfdestruct Safe (to be sure that this test works)
                                return [4 /*yield*/, (0, execution_1.executeTxWithSigners)(safe, tx, [user1])];
                            case 7:
                                // Selfdestruct Safe (to be sure that this test works)
                                _c.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getCode(safe.address)];
                            case 8:
                                _b.apply(void 0, [_c.sent()]).to.be.eq("0x");
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("simulate revert", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, accessor, interactor, simulator, tx, simulationData, acccessibleData, simulation;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), accessor = _a.accessor, interactor = _a.interactor, simulator = _a.simulator;
                                tx = (0, execution_1.buildContractCall)(interactor, "sendAndReturnBalance", [user2.address, (0, utils_1.parseEther)("1")], 0, true);
                                simulationData = accessor.interface.encodeFunctionData("simulate", [tx.to, tx.value, tx.data, tx.operation]);
                                return [4 /*yield*/, simulator.callStatic.simulate(accessor.address, simulationData)];
                            case 2:
                                acccessibleData = _b.sent();
                                simulation = accessor.interface.decodeFunctionResult("simulate", acccessibleData);
                                (0, chai_1.expect)(simulation.returnData).to.be.deep.eq("0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000f5472616e73666572206661696c65640000000000000000000000000000000000");
                                (0, chai_1.expect)(simulation.success).to.be.false;
                                (0, chai_1.expect)(simulation.estimate.toNumber()).to.be.lte(20000);
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
