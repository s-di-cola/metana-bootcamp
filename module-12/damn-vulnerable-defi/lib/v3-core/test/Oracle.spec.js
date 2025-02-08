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
var ethers_1 = require("ethers");
var hardhat_1 = require("hardhat");
var checkObservationEquals_1 = require("./shared/checkObservationEquals");
var expect_1 = require("./shared/expect");
var fixtures_1 = require("./shared/fixtures");
var snapshotGasCost_1 = require("./shared/snapshotGasCost");
var utilities_1 = require("./shared/utilities");
describe('Oracle', function () {
    var wallet, other;
    var loadFixture;
    before('create fixture loader', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ;
                    return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    _a = _b.sent(), wallet = _a[0], other = _a[1];
                    loadFixture = hardhat_1.waffle.createFixtureLoader([wallet, other]);
                    return [2 /*return*/];
            }
        });
    }); });
    var oracleFixture = function () { return __awaiter(void 0, void 0, void 0, function () {
        var oracleTestFactory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('OracleTest')];
                case 1:
                    oracleTestFactory = _a.sent();
                    return [4 /*yield*/, oracleTestFactory.deploy()];
                case 2: return [2 /*return*/, (_a.sent())];
            }
        });
    }); };
    var initializedOracleFixture = function () { return __awaiter(void 0, void 0, void 0, function () {
        var oracle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, oracleFixture()];
                case 1:
                    oracle = _a.sent();
                    return [4 /*yield*/, oracle.initialize({
                            time: 0,
                            tick: 0,
                            liquidity: 0,
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, oracle];
            }
        });
    }); };
    describe('#initialize', function () {
        var oracle;
        beforeEach('deploy test oracle', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loadFixture(oracleFixture)];
                    case 1:
                        oracle = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('index is 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 1, tick: 1, time: 1 })];
                    case 1:
                        _b.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, oracle.index()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('cardinality is 1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 1, tick: 1, time: 1 })];
                    case 1:
                        _b.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, oracle.cardinality()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).to.eq(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('cardinality next is 1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 1, tick: 1, time: 1 })];
                    case 1:
                        _b.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, oracle.cardinalityNext()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).to.eq(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('sets first slot timestamp only', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 1, tick: 1, time: 1 })];
                    case 1:
                        _b.sent();
                        _a = checkObservationEquals_1.default;
                        return [4 /*yield*/, oracle.observations(0)];
                    case 2:
                        _a.apply(void 0, [_b.sent(), {
                                initialized: true,
                                blockTimestamp: 1,
                                tickCumulative: 0,
                                secondsPerLiquidityCumulativeX128: 0,
                            }]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.initialize({ liquidity: 1, tick: 1, time: 1 }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#grow', function () {
        var oracle;
        beforeEach('deploy initialized test oracle', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loadFixture(initializedOracleFixture)];
                    case 1:
                        oracle = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('increases the cardinality next for the first call', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, oracle.grow(5)];
                    case 1:
                        _d.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, oracle.index()];
                    case 2:
                        _a.apply(void 0, [_d.sent()]).to.eq(0);
                        _b = expect_1.expect;
                        return [4 /*yield*/, oracle.cardinality()];
                    case 3:
                        _b.apply(void 0, [_d.sent()]).to.eq(1);
                        _c = expect_1.expect;
                        return [4 /*yield*/, oracle.cardinalityNext()];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).to.eq(5);
                        return [2 /*return*/];
                }
            });
        }); });
        it('does not touch the first slot', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, oracle.grow(5)];
                    case 1:
                        _b.sent();
                        _a = checkObservationEquals_1.default;
                        return [4 /*yield*/, oracle.observations(0)];
                    case 2:
                        _a.apply(void 0, [_b.sent(), {
                                secondsPerLiquidityCumulativeX128: 0,
                                tickCumulative: 0,
                                blockTimestamp: 0,
                                initialized: true,
                            }]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('is no op if oracle is already gte that size', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, oracle.grow(5)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, oracle.grow(3)];
                    case 2:
                        _d.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, oracle.index()];
                    case 3:
                        _a.apply(void 0, [_d.sent()]).to.eq(0);
                        _b = expect_1.expect;
                        return [4 /*yield*/, oracle.cardinality()];
                    case 4:
                        _b.apply(void 0, [_d.sent()]).to.eq(1);
                        _c = expect_1.expect;
                        return [4 /*yield*/, oracle.cardinalityNext()];
                    case 5:
                        _c.apply(void 0, [_d.sent()]).to.eq(5);
                        return [2 /*return*/];
                }
            });
        }); });
        it('adds data to all the slots', function () { return __awaiter(void 0, void 0, void 0, function () {
            var i, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, oracle.grow(5)];
                    case 1:
                        _b.sent();
                        i = 1;
                        _b.label = 2;
                    case 2:
                        if (!(i < 5)) return [3 /*break*/, 5];
                        _a = checkObservationEquals_1.default;
                        return [4 /*yield*/, oracle.observations(i)];
                    case 3:
                        _a.apply(void 0, [_b.sent(), {
                                secondsPerLiquidityCumulativeX128: 0,
                                tickCumulative: 0,
                                blockTimestamp: 1,
                                initialized: false,
                            }]);
                        _b.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        it('grow after wrap', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, oracle.grow(2)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, oracle.update({ advanceTimeBy: 2, liquidity: 1, tick: 1 })]; // index is now 1
                    case 2:
                        _e.sent(); // index is now 1
                        return [4 /*yield*/, oracle.update({ advanceTimeBy: 2, liquidity: 1, tick: 1 })]; // index is now 0 again
                    case 3:
                        _e.sent(); // index is now 0 again
                        _a = expect_1.expect;
                        return [4 /*yield*/, oracle.index()];
                    case 4:
                        _a.apply(void 0, [_e.sent()]).to.eq(0);
                        return [4 /*yield*/, oracle.grow(3)];
                    case 5:
                        _e.sent();
                        _b = expect_1.expect;
                        return [4 /*yield*/, oracle.index()];
                    case 6:
                        _b.apply(void 0, [_e.sent()]).to.eq(0);
                        _c = expect_1.expect;
                        return [4 /*yield*/, oracle.cardinality()];
                    case 7:
                        _c.apply(void 0, [_e.sent()]).to.eq(2);
                        _d = expect_1.expect;
                        return [4 /*yield*/, oracle.cardinalityNext()];
                    case 8:
                        _d.apply(void 0, [_e.sent()]).to.eq(3);
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas for growing by 1 slot when index == cardinality - 1', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.grow(2))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas for growing by 10 slots when index == cardinality - 1', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.grow(11))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas for growing by 1 slot when index != cardinality - 1', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, oracle.grow(2)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.grow(3))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas for growing by 10 slots when index != cardinality - 1', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, oracle.grow(2)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.grow(12))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#write', function () {
        var oracle;
        beforeEach('deploy initialized test oracle', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loadFixture(initializedOracleFixture)];
                    case 1:
                        oracle = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('single element array gets overwritten', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, oracle.update({ advanceTimeBy: 1, tick: 2, liquidity: 5 })];
                    case 1:
                        _g.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, oracle.index()];
                    case 2:
                        _a.apply(void 0, [_g.sent()]).to.eq(0);
                        _b = checkObservationEquals_1.default;
                        return [4 /*yield*/, oracle.observations(0)];
                    case 3:
                        _b.apply(void 0, [_g.sent(), {
                                initialized: true,
                                secondsPerLiquidityCumulativeX128: '340282366920938463463374607431768211456',
                                tickCumulative: 0,
                                blockTimestamp: 1,
                            }]);
                        return [4 /*yield*/, oracle.update({ advanceTimeBy: 5, tick: -1, liquidity: 8 })];
                    case 4:
                        _g.sent();
                        _c = expect_1.expect;
                        return [4 /*yield*/, oracle.index()];
                    case 5:
                        _c.apply(void 0, [_g.sent()]).to.eq(0);
                        _d = checkObservationEquals_1.default;
                        return [4 /*yield*/, oracle.observations(0)];
                    case 6:
                        _d.apply(void 0, [_g.sent(), {
                                initialized: true,
                                secondsPerLiquidityCumulativeX128: '680564733841876926926749214863536422912',
                                tickCumulative: 10,
                                blockTimestamp: 6,
                            }]);
                        return [4 /*yield*/, oracle.update({ advanceTimeBy: 3, tick: 2, liquidity: 3 })];
                    case 7:
                        _g.sent();
                        _e = expect_1.expect;
                        return [4 /*yield*/, oracle.index()];
                    case 8:
                        _e.apply(void 0, [_g.sent()]).to.eq(0);
                        _f = checkObservationEquals_1.default;
                        return [4 /*yield*/, oracle.observations(0)];
                    case 9:
                        _f.apply(void 0, [_g.sent(), {
                                initialized: true,
                                secondsPerLiquidityCumulativeX128: '808170621437228850725514692650449502208',
                                tickCumulative: 7,
                                blockTimestamp: 9,
                            }]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('does nothing if time has not changed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, oracle.grow(2)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, oracle.update({ advanceTimeBy: 1, tick: 3, liquidity: 2 })];
                    case 2:
                        _c.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, oracle.index()];
                    case 3:
                        _a.apply(void 0, [_c.sent()]).to.eq(1);
                        return [4 /*yield*/, oracle.update({ advanceTimeBy: 0, tick: -5, liquidity: 9 })];
                    case 4:
                        _c.sent();
                        _b = expect_1.expect;
                        return [4 /*yield*/, oracle.index()];
                    case 5:
                        _b.apply(void 0, [_c.sent()]).to.eq(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('writes an index if time has changed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, oracle.grow(3)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, oracle.update({ advanceTimeBy: 6, tick: 3, liquidity: 2 })];
                    case 2:
                        _d.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, oracle.index()];
                    case 3:
                        _a.apply(void 0, [_d.sent()]).to.eq(1);
                        return [4 /*yield*/, oracle.update({ advanceTimeBy: 4, tick: -5, liquidity: 9 })];
                    case 4:
                        _d.sent();
                        _b = expect_1.expect;
                        return [4 /*yield*/, oracle.index()];
                    case 5:
                        _b.apply(void 0, [_d.sent()]).to.eq(2);
                        _c = checkObservationEquals_1.default;
                        return [4 /*yield*/, oracle.observations(1)];
                    case 6:
                        _c.apply(void 0, [_d.sent(), {
                                tickCumulative: 0,
                                secondsPerLiquidityCumulativeX128: '2041694201525630780780247644590609268736',
                                initialized: true,
                                blockTimestamp: 6,
                            }]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('grows cardinality when writing past', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, oracle.grow(2)];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, oracle.grow(4)];
                    case 2:
                        _f.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, oracle.cardinality()];
                    case 3:
                        _a.apply(void 0, [_f.sent()]).to.eq(1);
                        return [4 /*yield*/, oracle.update({ advanceTimeBy: 3, tick: 5, liquidity: 6 })];
                    case 4:
                        _f.sent();
                        _b = expect_1.expect;
                        return [4 /*yield*/, oracle.cardinality()];
                    case 5:
                        _b.apply(void 0, [_f.sent()]).to.eq(4);
                        return [4 /*yield*/, oracle.update({ advanceTimeBy: 4, tick: 6, liquidity: 4 })];
                    case 6:
                        _f.sent();
                        _c = expect_1.expect;
                        return [4 /*yield*/, oracle.cardinality()];
                    case 7:
                        _c.apply(void 0, [_f.sent()]).to.eq(4);
                        _d = expect_1.expect;
                        return [4 /*yield*/, oracle.index()];
                    case 8:
                        _d.apply(void 0, [_f.sent()]).to.eq(2);
                        _e = checkObservationEquals_1.default;
                        return [4 /*yield*/, oracle.observations(2)];
                    case 9:
                        _e.apply(void 0, [_f.sent(), {
                                secondsPerLiquidityCumulativeX128: '1247702012043441032699040227249816775338',
                                tickCumulative: 20,
                                initialized: true,
                                blockTimestamp: 7,
                            }]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('wraps around', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, oracle.grow(3)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, oracle.update({ advanceTimeBy: 3, tick: 1, liquidity: 2 })];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, oracle.update({ advanceTimeBy: 4, tick: 2, liquidity: 3 })];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, oracle.update({ advanceTimeBy: 5, tick: 3, liquidity: 4 })];
                    case 4:
                        _c.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, oracle.index()];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).to.eq(0);
                        _b = checkObservationEquals_1.default;
                        return [4 /*yield*/, oracle.observations(0)];
                    case 6:
                        _b.apply(void 0, [_c.sent(), {
                                secondsPerLiquidityCumulativeX128: '2268549112806256423089164049545121409706',
                                tickCumulative: 14,
                                initialized: true,
                                blockTimestamp: 12,
                            }]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('accumulates liquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, oracle.grow(4)];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, oracle.update({ advanceTimeBy: 3, tick: 3, liquidity: 2 })];
                    case 2:
                        _f.sent();
                        return [4 /*yield*/, oracle.update({ advanceTimeBy: 4, tick: -7, liquidity: 6 })];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, oracle.update({ advanceTimeBy: 5, tick: -2, liquidity: 4 })];
                    case 4:
                        _f.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, oracle.index()];
                    case 5:
                        _a.apply(void 0, [_f.sent()]).to.eq(3);
                        _b = checkObservationEquals_1.default;
                        return [4 /*yield*/, oracle.observations(1)];
                    case 6:
                        _b.apply(void 0, [_f.sent(), {
                                initialized: true,
                                tickCumulative: 0,
                                secondsPerLiquidityCumulativeX128: '1020847100762815390390123822295304634368',
                                blockTimestamp: 3,
                            }]);
                        _c = checkObservationEquals_1.default;
                        return [4 /*yield*/, oracle.observations(2)];
                    case 7:
                        _c.apply(void 0, [_f.sent(), {
                                initialized: true,
                                tickCumulative: 12,
                                secondsPerLiquidityCumulativeX128: '1701411834604692317316873037158841057280',
                                blockTimestamp: 7,
                            }]);
                        _d = checkObservationEquals_1.default;
                        return [4 /*yield*/, oracle.observations(3)];
                    case 8:
                        _d.apply(void 0, [_f.sent(), {
                                initialized: true,
                                tickCumulative: -23,
                                secondsPerLiquidityCumulativeX128: '1984980473705474370203018543351981233493',
                                blockTimestamp: 12,
                            }]);
                        _e = checkObservationEquals_1.default;
                        return [4 /*yield*/, oracle.observations(4)];
                    case 9:
                        _e.apply(void 0, [_f.sent(), {
                                initialized: false,
                                tickCumulative: 0,
                                secondsPerLiquidityCumulativeX128: 0,
                                blockTimestamp: 0,
                            }]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#observe', function () {
        describe('before initialization', function () { return __awaiter(void 0, void 0, void 0, function () {
            var oracle, observeSingle;
            return __generator(this, function (_a) {
                beforeEach('deploy test oracle', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, loadFixture(oracleFixture)];
                            case 1:
                                oracle = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                observeSingle = function (secondsAgo) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.observe([secondsAgo])];
                            case 1:
                                _a = _b.sent(), tickCumulative = _a.tickCumulatives[0], secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128s[0];
                                return [2 /*return*/, { secondsPerLiquidityCumulativeX128: secondsPerLiquidityCumulativeX128, tickCumulative: tickCumulative }];
                        }
                    });
                }); };
                it('fails before initialize', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(observeSingle(0)).to.be.revertedWith('I')];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('fails if an older observation does not exist', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 4, tick: 2, time: 5 })];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, expect_1.expect)(observeSingle(1)).to.be.revertedWith('OLD')];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('does not fail across overflow boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 4, tick: 2, time: Math.pow(2, 32) - 1 })];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, oracle.advanceTime(2)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, observeSingle(1)];
                            case 3:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.be.eq(2);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.be.eq('85070591730234615865843651857942052864');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('interpolates correctly at max liquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: utilities_1.MaxUint128, tick: 0, time: 0 })];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, oracle.grow(2)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 13, tick: 0, liquidity: 0 })];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, observeSingle(0)];
                            case 4:
                                secondsPerLiquidityCumulativeX128 = (_a.sent()).secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(13);
                                return [4 /*yield*/, observeSingle(6)];
                            case 5:
                                (secondsPerLiquidityCumulativeX128 = (_a.sent()).secondsPerLiquidityCumulativeX128);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(7);
                                return [4 /*yield*/, observeSingle(12)];
                            case 6:
                                (secondsPerLiquidityCumulativeX128 = (_a.sent()).secondsPerLiquidityCumulativeX128);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(1);
                                return [4 /*yield*/, observeSingle(13)];
                            case 7:
                                (secondsPerLiquidityCumulativeX128 = (_a.sent()).secondsPerLiquidityCumulativeX128);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('interpolates correctly at min liquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 0, tick: 0, time: 0 })];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, oracle.grow(2)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 13, tick: 0, liquidity: utilities_1.MaxUint128 })];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, observeSingle(0)];
                            case 4:
                                secondsPerLiquidityCumulativeX128 = (_a.sent()).secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(ethers_1.BigNumber.from(13).shl(128));
                                return [4 /*yield*/, observeSingle(6)];
                            case 5:
                                (secondsPerLiquidityCumulativeX128 = (_a.sent()).secondsPerLiquidityCumulativeX128);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(ethers_1.BigNumber.from(7).shl(128));
                                return [4 /*yield*/, observeSingle(12)];
                            case 6:
                                (secondsPerLiquidityCumulativeX128 = (_a.sent()).secondsPerLiquidityCumulativeX128);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(ethers_1.BigNumber.from(1).shl(128));
                                return [4 /*yield*/, observeSingle(13)];
                            case 7:
                                (secondsPerLiquidityCumulativeX128 = (_a.sent()).secondsPerLiquidityCumulativeX128);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('interpolates the same as 0 liquidity for 1 liquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 1, tick: 0, time: 0 })];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, oracle.grow(2)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 13, tick: 0, liquidity: utilities_1.MaxUint128 })];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, observeSingle(0)];
                            case 4:
                                secondsPerLiquidityCumulativeX128 = (_a.sent()).secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(ethers_1.BigNumber.from(13).shl(128));
                                return [4 /*yield*/, observeSingle(6)];
                            case 5:
                                (secondsPerLiquidityCumulativeX128 = (_a.sent()).secondsPerLiquidityCumulativeX128);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(ethers_1.BigNumber.from(7).shl(128));
                                return [4 /*yield*/, observeSingle(12)];
                            case 6:
                                (secondsPerLiquidityCumulativeX128 = (_a.sent()).secondsPerLiquidityCumulativeX128);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(ethers_1.BigNumber.from(1).shl(128));
                                return [4 /*yield*/, observeSingle(13)];
                            case 7:
                                (secondsPerLiquidityCumulativeX128 = (_a.sent()).secondsPerLiquidityCumulativeX128);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('interpolates correctly across uint32 seconds boundaries', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // setup
                            return [4 /*yield*/, oracle.initialize({ liquidity: 0, tick: 0, time: 0 })];
                            case 1:
                                // setup
                                _a.sent();
                                return [4 /*yield*/, oracle.grow(2)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: Math.pow(2, 32) - 6, tick: 0, liquidity: 0 })];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, observeSingle(0)];
                            case 4:
                                secondsPerLiquidityCumulativeX128 = (_a.sent()).secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(ethers_1.BigNumber.from(Math.pow(2, 32) - 6).shl(128));
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 13, tick: 0, liquidity: 0 })];
                            case 5:
                                _a.sent();
                                return [4 /*yield*/, observeSingle(0)];
                            case 6:
                                (secondsPerLiquidityCumulativeX128 = (_a.sent()).secondsPerLiquidityCumulativeX128);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(ethers_1.BigNumber.from(7).shl(128));
                                return [4 /*yield*/, observeSingle(3)];
                            case 7:
                                (secondsPerLiquidityCumulativeX128 = (_a.sent()).secondsPerLiquidityCumulativeX128);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(ethers_1.BigNumber.from(4).shl(128));
                                return [4 /*yield*/, observeSingle(8)];
                            case 8:
                                (secondsPerLiquidityCumulativeX128 = (_a.sent()).secondsPerLiquidityCumulativeX128);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(ethers_1.BigNumber.from(Math.pow(2, 32) - 1).shl(128));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('single observation at current time', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 4, tick: 2, time: 5 })];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, observeSingle(0)];
                            case 2:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(0);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('single observation in past but not earlier than secondsAgo', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 4, tick: 2, time: 5 })];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, oracle.advanceTime(3)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, expect_1.expect)(observeSingle(4)).to.be.revertedWith('OLD')];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('single observation in past at exactly seconds ago', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 4, tick: 2, time: 5 })];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, oracle.advanceTime(3)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, observeSingle(3)];
                            case 3:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(0);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('single observation in past counterfactual in past', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 4, tick: 2, time: 5 })];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, oracle.advanceTime(3)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, observeSingle(1)];
                            case 3:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(4);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq('170141183460469231731687303715884105728');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('single observation in past counterfactual now', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 4, tick: 2, time: 5 })];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, oracle.advanceTime(3)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, observeSingle(0)];
                            case 3:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(6);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq('255211775190703847597530955573826158592');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('two observations in chronological order 0 seconds ago exact', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 5, tick: -5, time: 5 })];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, oracle.grow(2)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 4, tick: 1, liquidity: 2 })];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, observeSingle(0)];
                            case 4:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(-20);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq('272225893536750770770699685945414569164');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('two observations in chronological order 0 seconds ago counterfactual', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 5, tick: -5, time: 5 })];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, oracle.grow(2)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 4, tick: 1, liquidity: 2 })];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, oracle.advanceTime(7)];
                            case 4:
                                _b.sent();
                                return [4 /*yield*/, observeSingle(0)];
                            case 5:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(-13);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq('1463214177760035392892510811956603309260');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('two observations in chronological order seconds ago is exactly on first observation', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 5, tick: -5, time: 5 })];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, oracle.grow(2)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 4, tick: 1, liquidity: 2 })];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, oracle.advanceTime(7)];
                            case 4:
                                _b.sent();
                                return [4 /*yield*/, observeSingle(11)];
                            case 5:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(0);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('two observations in chronological order seconds ago is between first and second', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 5, tick: -5, time: 5 })];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, oracle.grow(2)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 4, tick: 1, liquidity: 2 })];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, oracle.advanceTime(7)];
                            case 4:
                                _b.sent();
                                return [4 /*yield*/, observeSingle(9)];
                            case 5:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(-10);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq('136112946768375385385349842972707284582');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('two observations in reverse order 0 seconds ago exact', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 5, tick: -5, time: 5 })];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, oracle.grow(2)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 4, tick: 1, liquidity: 2 })];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 3, tick: -5, liquidity: 4 })];
                            case 4:
                                _b.sent();
                                return [4 /*yield*/, observeSingle(0)];
                            case 5:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(-17);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq('782649443918158465965761597093066886348');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('two observations in reverse order 0 seconds ago counterfactual', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 5, tick: -5, time: 5 })];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, oracle.grow(2)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 4, tick: 1, liquidity: 2 })];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 3, tick: -5, liquidity: 4 })];
                            case 4:
                                _b.sent();
                                return [4 /*yield*/, oracle.advanceTime(7)];
                            case 5:
                                _b.sent();
                                return [4 /*yield*/, observeSingle(0)];
                            case 6:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(-52);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq('1378143586029800777026667160098661256396');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('two observations in reverse order seconds ago is exactly on first observation', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 5, tick: -5, time: 5 })];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, oracle.grow(2)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 4, tick: 1, liquidity: 2 })];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 3, tick: -5, liquidity: 4 })];
                            case 4:
                                _b.sent();
                                return [4 /*yield*/, oracle.advanceTime(7)];
                            case 5:
                                _b.sent();
                                return [4 /*yield*/, observeSingle(10)];
                            case 6:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(-20);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq('272225893536750770770699685945414569164');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('two observations in reverse order seconds ago is between first and second', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 5, tick: -5, time: 5 })];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, oracle.grow(2)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 4, tick: 1, liquidity: 2 })];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 3, tick: -5, liquidity: 4 })];
                            case 4:
                                _b.sent();
                                return [4 /*yield*/, oracle.advanceTime(7)];
                            case 5:
                                _b.sent();
                                return [4 /*yield*/, observeSingle(9)];
                            case 6:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(-19);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq('442367076997220002502386989661298674892');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('can fetch multiple observations', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulatives, secondsPerLiquidityCumulativeX128s;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ time: 5, tick: 2, liquidity: ethers_1.BigNumber.from(2).pow(15) })];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, oracle.grow(4)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 13, tick: 6, liquidity: ethers_1.BigNumber.from(2).pow(12) })];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, oracle.advanceTime(5)];
                            case 4:
                                _b.sent();
                                return [4 /*yield*/, oracle.observe([0, 3, 8, 13, 15, 18])];
                            case 5:
                                _a = _b.sent(), tickCumulatives = _a.tickCumulatives, secondsPerLiquidityCumulativeX128s = _a.secondsPerLiquidityCumulativeX128s;
                                (0, expect_1.expect)(tickCumulatives).to.have.lengthOf(6);
                                (0, expect_1.expect)(tickCumulatives[0]).to.eq(56);
                                (0, expect_1.expect)(tickCumulatives[1]).to.eq(38);
                                (0, expect_1.expect)(tickCumulatives[2]).to.eq(20);
                                (0, expect_1.expect)(tickCumulatives[3]).to.eq(10);
                                (0, expect_1.expect)(tickCumulatives[4]).to.eq(6);
                                (0, expect_1.expect)(tickCumulatives[5]).to.eq(0);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128s).to.have.lengthOf(6);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128s[0]).to.eq('550383467004691728624232610897330176');
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128s[1]).to.eq('301153217795020002454768787094765568');
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128s[2]).to.eq('103845937170696552570609926584401920');
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128s[3]).to.eq('51922968585348276285304963292200960');
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128s[4]).to.eq('31153781151208965771182977975320576');
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128s[5]).to.eq(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('gas for observe since most recent', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 5, tick: -5, time: 5 })];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, oracle.advanceTime(2)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.getGasCostOfObserve([1]))];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('gas for single observation at current time', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 5, tick: -5, time: 5 })];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.getGasCostOfObserve([0]))];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('gas for single observation at current time counterfactually computed', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, oracle.initialize({ liquidity: 5, tick: -5, time: 5 })];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, oracle.advanceTime(5)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.getGasCostOfObserve([0]))];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        var _loop_1 = function (startingTime) {
            describe("initialized with 5 observations with starting time of ".concat(startingTime), function () {
                var oracleFixture5Observations = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oracle;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, oracleFixture()];
                            case 1:
                                oracle = _a.sent();
                                return [4 /*yield*/, oracle.initialize({ liquidity: 5, tick: -5, time: startingTime })];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, oracle.grow(5)];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 3, tick: 1, liquidity: 2 })];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 2, tick: -6, liquidity: 4 })];
                            case 5:
                                _a.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 4, tick: -2, liquidity: 4 })];
                            case 6:
                                _a.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 1, tick: -2, liquidity: 9 })];
                            case 7:
                                _a.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 3, tick: 4, liquidity: 2 })];
                            case 8:
                                _a.sent();
                                return [4 /*yield*/, oracle.update({ advanceTimeBy: 6, tick: 6, liquidity: 7 })];
                            case 9:
                                _a.sent();
                                return [2 /*return*/, oracle];
                        }
                    });
                }); };
                var oracle;
                beforeEach('set up observations', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, loadFixture(oracleFixture5Observations)];
                            case 1:
                                oracle = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                var observeSingle = function (secondsAgo) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.observe([secondsAgo])];
                            case 1:
                                _a = _b.sent(), tickCumulative = _a.tickCumulatives[0], secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128s[0];
                                return [2 /*return*/, { secondsPerLiquidityCumulativeX128: secondsPerLiquidityCumulativeX128, tickCumulative: tickCumulative }];
                        }
                    });
                }); };
                it('index, cardinality, cardinality next', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _a = expect_1.expect;
                                return [4 /*yield*/, oracle.index()];
                            case 1:
                                _a.apply(void 0, [_d.sent()]).to.eq(1);
                                _b = expect_1.expect;
                                return [4 /*yield*/, oracle.cardinality()];
                            case 2:
                                _b.apply(void 0, [_d.sent()]).to.eq(5);
                                _c = expect_1.expect;
                                return [4 /*yield*/, oracle.cardinalityNext()];
                            case 3:
                                _c.apply(void 0, [_d.sent()]).to.eq(5);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('latest observation same time as latest', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, observeSingle(0)];
                            case 1:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(-21);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq('2104079302127802832415199655953100107502');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('latest observation 5 seconds after latest', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.advanceTime(5)];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, observeSingle(5)];
                            case 2:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(-21);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq('2104079302127802832415199655953100107502');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('current observation 5 seconds after latest', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.advanceTime(5)];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, observeSingle(0)];
                            case 2:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(9);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq('2347138135642758877746181518404363115684');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('between latest observation and just before latest observation at same time as latest', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, observeSingle(3)];
                            case 1:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(-33);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq('1593655751746395137220137744805447790318');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('between latest observation and just before latest observation after the latest observation', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.advanceTime(5)];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, observeSingle(8)];
                            case 2:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(-33);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq('1593655751746395137220137744805447790318');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('older than oldest reverts', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(observeSingle(15)).to.be.revertedWith('OLD')];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, oracle.advanceTime(5)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, expect_1.expect)(observeSingle(20)).to.be.revertedWith('OLD')];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('oldest observation', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, observeSingle(14)];
                            case 1:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(-13);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq('544451787073501541541399371890829138329');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('oldest observation after some time', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulative, secondsPerLiquidityCumulativeX128;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.advanceTime(6)];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, observeSingle(20)];
                            case 2:
                                _a = _b.sent(), tickCumulative = _a.tickCumulative, secondsPerLiquidityCumulativeX128 = _a.secondsPerLiquidityCumulativeX128;
                                (0, expect_1.expect)(tickCumulative).to.eq(-13);
                                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq('544451787073501541541399371890829138329');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('fetch many values', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, tickCumulatives, secondsPerLiquidityCumulativeX128s;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, oracle.advanceTime(6)];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, oracle.observe([
                                        20, 17, 13, 10, 5, 1, 0,
                                    ])];
                            case 2:
                                _a = _b.sent(), tickCumulatives = _a.tickCumulatives, secondsPerLiquidityCumulativeX128s = _a.secondsPerLiquidityCumulativeX128s;
                                (0, expect_1.expect)({
                                    tickCumulatives: tickCumulatives.map(function (tc) { return tc.toNumber(); }),
                                    secondsPerLiquidityCumulativeX128s: secondsPerLiquidityCumulativeX128s.map(function (lc) { return lc.toString(); }),
                                }).to.matchSnapshot();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('gas all of last 20 seconds', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, oracle.advanceTime(6)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.getGasCostOfObserve([20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]))];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('gas latest equal', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.getGasCostOfObserve([0]))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('gas latest transform', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, oracle.advanceTime(5)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.getGasCostOfObserve([0]))];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('gas oldest', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.getGasCostOfObserve([14]))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('gas between oldest and oldest + 1', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.getGasCostOfObserve([13]))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('gas middle', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.getGasCostOfObserve([5]))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        };
        for (var _i = 0, _a = [5, Math.pow(2, 32) - 5]; _i < _a.length; _i++) {
            var startingTime = _a[_i];
            _loop_1(startingTime);
        }
    });
    describe.skip('full oracle', function () {
        var _this = this;
        this.timeout(1200000);
        var oracle;
        var BATCH_SIZE = 300;
        var STARTING_TIME = fixtures_1.TEST_POOL_START_TIME;
        var maxedOutOracleFixture = function () { return __awaiter(_this, void 0, void 0, function () {
            var oracle, cardinalityNext, growTo, _loop_2, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, oracleFixture()];
                    case 1:
                        oracle = _a.sent();
                        return [4 /*yield*/, oracle.initialize({ liquidity: 0, tick: 0, time: STARTING_TIME })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, oracle.cardinalityNext()];
                    case 3:
                        cardinalityNext = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!(cardinalityNext < 65535)) return [3 /*break*/, 6];
                        growTo = Math.min(65535, cardinalityNext + BATCH_SIZE);
                        console.log('growing from', cardinalityNext, 'to', growTo);
                        return [4 /*yield*/, oracle.grow(growTo)];
                    case 5:
                        _a.sent();
                        cardinalityNext = growTo;
                        return [3 /*break*/, 4];
                    case 6:
                        _loop_2 = function (i) {
                            var batch;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        console.log('batch update starting at', i);
                                        batch = Array(BATCH_SIZE)
                                            .fill(null)
                                            .map(function (_, j) { return ({
                                            advanceTimeBy: 13,
                                            tick: -i - j,
                                            liquidity: i + j,
                                        }); });
                                        return [4 /*yield*/, oracle.batchUpdate(batch)];
                                    case 1:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        i = 0;
                        _a.label = 7;
                    case 7:
                        if (!(i < 65535)) return [3 /*break*/, 10];
                        return [5 /*yield**/, _loop_2(i)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        i += BATCH_SIZE;
                        return [3 /*break*/, 7];
                    case 10: return [2 /*return*/, oracle];
                }
            });
        }); };
        beforeEach('create a full oracle', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loadFixture(maxedOutOracleFixture)];
                    case 1:
                        oracle = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('has max cardinality next', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, oracle.cardinalityNext()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(65535);
                        return [2 /*return*/];
                }
            });
        }); });
        it('has max cardinality', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, oracle.cardinality()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(65535);
                        return [2 /*return*/];
                }
            });
        }); });
        it('index wrapped around', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, oracle.index()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(165);
                        return [2 /*return*/];
                }
            });
        }); });
        function checkObserve(secondsAgo, expected) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, tickCumulatives, secondsPerLiquidityCumulativeX128s, check;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, oracle.observe([secondsAgo])];
                        case 1:
                            _a = _b.sent(), tickCumulatives = _a.tickCumulatives, secondsPerLiquidityCumulativeX128s = _a.secondsPerLiquidityCumulativeX128s;
                            check = {
                                tickCumulative: tickCumulatives[0].toString(),
                                secondsPerLiquidityCumulativeX128: secondsPerLiquidityCumulativeX128s[0].toString(),
                            };
                            if (typeof expected === 'undefined') {
                                (0, expect_1.expect)(check).to.matchSnapshot();
                            }
                            else {
                                (0, expect_1.expect)(check).to.deep.eq({
                                    tickCumulative: expected.tickCumulative.toString(),
                                    secondsPerLiquidityCumulativeX128: expected.secondsPerLiquidityCumulativeX128.toString(),
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
        it('can observe into the ordered portion with exact seconds ago', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, checkObserve(100 * 13, {
                            secondsPerLiquidityCumulativeX128: '60465049086512033878831623038233202591033',
                            tickCumulative: '-27970560813',
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('can observe into the ordered portion with unexact seconds ago', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, checkObserve(100 * 13 + 5, {
                            secondsPerLiquidityCumulativeX128: '60465023149565257990964350912969670793706',
                            tickCumulative: '-27970232823',
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('can observe at exactly the latest observation', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, checkObserve(0, {
                            secondsPerLiquidityCumulativeX128: '60471787506468701386237800669810720099776',
                            tickCumulative: '-28055903863',
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('can observe at exactly the latest observation after some time passes', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, oracle.advanceTime(5)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, checkObserve(5, {
                                secondsPerLiquidityCumulativeX128: '60471787506468701386237800669810720099776',
                                tickCumulative: '-28055903863',
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('can observe after the latest observation counterfactual', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, oracle.advanceTime(5)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, checkObserve(3, {
                                secondsPerLiquidityCumulativeX128: '60471797865298117996489508104462919730461',
                                tickCumulative: '-28056035261',
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('can observe into the unordered portion of array at exact seconds ago of observation', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, checkObserve(200 * 13, {
                            secondsPerLiquidityCumulativeX128: '60458300386499273141628780395875293027404',
                            tickCumulative: '-27885347763',
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('can observe into the unordered portion of array at seconds ago between observations', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, checkObserve(200 * 13 + 5, {
                            secondsPerLiquidityCumulativeX128: '60458274409952896081377821330361274907140',
                            tickCumulative: '-27885020273',
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('can observe the oldest observation 13*65534 seconds ago', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, checkObserve(13 * 65534, {
                            secondsPerLiquidityCumulativeX128: '33974356747348039873972993881117400879779',
                            tickCumulative: '-175890',
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('can observe the oldest observation 13*65534 + 5 seconds ago if time has elapsed', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, oracle.advanceTime(5)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, checkObserve(13 * 65534 + 5, {
                                secondsPerLiquidityCumulativeX128: '33974356747348039873972993881117400879779',
                                tickCumulative: '-175890',
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas cost of observe(0)', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.getGasCostOfObserve([0]))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas cost of observe(200 * 13)', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.getGasCostOfObserve([200 + 13]))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas cost of observe(200 * 13 + 5)', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.getGasCostOfObserve([200 + 13 + 5]))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas cost of observe(0) after 5 seconds', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, oracle.advanceTime(5)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.getGasCostOfObserve([0]))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas cost of observe(5) after 5 seconds', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, oracle.advanceTime(5)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.getGasCostOfObserve([5]))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas cost of observe(oldest)', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.getGasCostOfObserve([65534 * 13]))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas cost of observe(oldest) after 5 seconds', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, oracle.advanceTime(5)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.getGasCostOfObserve([65534 * 13 + 5]))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
