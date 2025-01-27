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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.benchmark = exports.setupBenchmarkContracts = exports.configs = void 0;
var chai_1 = require("chai");
var hardhat_1 = require("hardhat");
require("@nomiclabs/hardhat-ethers");
var setup_1 = require("../../test/utils/setup");
var execution_1 = require("../../src/utils/execution");
var constants_1 = require("@ethersproject/constants");
var _a = hardhat_1.waffle.provider.getWallets(), user1 = _a[0], user2 = _a[1], user3 = _a[2], user4 = _a[3], user5 = _a[4];
var generateTarget = function (owners, threshold, guardAddress, logGasUsage) { return __awaiter(void 0, void 0, void 0, function () {
    var fallbackHandler, safe;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, setup_1.getTokenCallbackHandler)()];
            case 1:
                fallbackHandler = _a.sent();
                return [4 /*yield*/, (0, setup_1.getSafeWithOwners)(owners.map(function (owner) { return owner.address; }), threshold, fallbackHandler.address, logGasUsage)];
            case 2:
                safe = _a.sent();
                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "setGuard", [guardAddress], owners)];
            case 3:
                _a.sent();
                return [2 /*return*/, safe];
        }
    });
}); };
exports.configs = [
    { name: "single owner", signers: [user1], threshold: 1 },
    { name: "single owner and guard", signers: [user1], threshold: 1, useGuard: true },
    { name: "2 out of 2", signers: [user1, user2], threshold: 2 },
    { name: "3 out of 3", signers: [user1, user2, user3], threshold: 3 },
    { name: "3 out of 5", signers: [user1, user2, user3, user4, user5], threshold: 3 },
];
var setupBenchmarkContracts = function (benchmarkFixture, logGasUsage) {
    return hardhat_1.deployments.createFixture(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var guardFactory, guard, targets, _i, configs_1, config, _c, _d, _e;
        var _f;
        var deployments = _b.deployments;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, deployments.fixture()];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory("DelegateCallTransactionGuard")];
                case 2:
                    guardFactory = _g.sent();
                    return [4 /*yield*/, guardFactory.deploy(constants_1.AddressZero)];
                case 3:
                    guard = _g.sent();
                    targets = [];
                    _i = 0, configs_1 = exports.configs;
                    _g.label = 4;
                case 4:
                    if (!(_i < configs_1.length)) return [3 /*break*/, 7];
                    config = configs_1[_i];
                    _d = (_c = targets).push;
                    return [4 /*yield*/, generateTarget(config.signers, config.threshold, config.useGuard ? guard.address : constants_1.AddressZero, logGasUsage)];
                case 5:
                    _d.apply(_c, [_g.sent()]);
                    _g.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    _f = {
                        targets: targets
                    };
                    if (!benchmarkFixture) return [3 /*break*/, 9];
                    return [4 /*yield*/, benchmarkFixture()];
                case 8:
                    _e = _g.sent();
                    return [3 /*break*/, 10];
                case 9:
                    _e = undefined;
                    _g.label = 10;
                case 10: return [2 /*return*/, (_f.additions = (_e),
                        _f)];
            }
        });
    }); });
};
exports.setupBenchmarkContracts = setupBenchmarkContracts;
var benchmark = function (topic, benchmarks) { return __awaiter(void 0, void 0, void 0, function () {
    var _loop_1, _i, benchmarks_1, benchmark_1;
    return __generator(this, function (_a) {
        _loop_1 = function (benchmark_1) {
            var name_1 = benchmark_1.name, prepare = benchmark_1.prepare, after = benchmark_1.after, fixture = benchmark_1.fixture;
            var contractSetup = (0, exports.setupBenchmarkContracts)(fixture);
            describe("".concat(topic, " - ").concat(name_1), function () { return __awaiter(void 0, void 0, void 0, function () {
                var _loop_2, i;
                return __generator(this, function (_a) {
                    it("with an EOA", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var contracts, tx;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, contractSetup()];
                                case 1:
                                    contracts = _a.sent();
                                    return [4 /*yield*/, prepare(contracts, user2.address, 0)];
                                case 2:
                                    tx = _a.sent();
                                    return [4 /*yield*/, (0, execution_1.logGas)(name_1, user2.sendTransaction({
                                            to: tx.to,
                                            value: tx.value,
                                            data: tx.data
                                        }))];
                                case 3:
                                    _a.sent();
                                    if (!after) return [3 /*break*/, 5];
                                    return [4 /*yield*/, after(contracts)];
                                case 4:
                                    _a.sent();
                                    _a.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    _loop_2 = function (i) {
                        var config = exports.configs[i];
                        it("with a ".concat(config.name, " Safe"), function () { return __awaiter(void 0, void 0, void 0, function () {
                            var contracts, target, nonce, tx, threshold, sigs;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, contractSetup()];
                                    case 1:
                                        contracts = _a.sent();
                                        target = contracts.targets[i];
                                        return [4 /*yield*/, target.nonce()];
                                    case 2:
                                        nonce = _a.sent();
                                        return [4 /*yield*/, prepare(contracts, target.address, nonce)];
                                    case 3:
                                        tx = _a.sent();
                                        return [4 /*yield*/, target.getThreshold()];
                                    case 4:
                                        threshold = _a.sent();
                                        return [4 /*yield*/, Promise.all(config.signers.slice(0, threshold).map(function (signer) { return __awaiter(void 0, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, (0, execution_1.safeSignTypedData)(signer, target, tx)];
                                                        case 1: return [2 /*return*/, _a.sent()];
                                                    }
                                                });
                                            }); }))];
                                    case 5:
                                        sigs = _a.sent();
                                        return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.logGas)(name_1, (0, execution_1.executeTx)(target, tx, sigs))).to.emit(target, "ExecutionSuccess")];
                                    case 6:
                                        _a.sent();
                                        if (!after) return [3 /*break*/, 8];
                                        return [4 /*yield*/, after(contracts)];
                                    case 7:
                                        _a.sent();
                                        _a.label = 8;
                                    case 8: return [2 /*return*/];
                                }
                            });
                        }); });
                    };
                    for (i in exports.configs) {
                        _loop_2(i);
                    }
                    return [2 /*return*/];
                });
            }); });
        };
        for (_i = 0, benchmarks_1 = benchmarks; _i < benchmarks_1.length; _i++) {
            benchmark_1 = benchmarks_1[_i];
            _loop_1(benchmark_1);
        }
        return [2 /*return*/];
    });
}); };
exports.benchmark = benchmark;
