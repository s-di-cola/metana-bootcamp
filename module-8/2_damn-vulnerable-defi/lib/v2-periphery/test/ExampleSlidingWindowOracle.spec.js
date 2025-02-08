"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = __importStar(require("chai"));
var utils_1 = require("ethers/utils");
var ethereum_waffle_1 = require("ethereum-waffle");
var utilities_1 = require("./shared/utilities");
var fixtures_1 = require("./shared/fixtures");
var ExampleSlidingWindowOracle_json_1 = __importDefault(require("../build/ExampleSlidingWindowOracle.json"));
chai_1.default.use(ethereum_waffle_1.solidity);
var overrides = {
    gasLimit: 9999999
};
var defaultToken0Amount = (0, utilities_1.expandTo18Decimals)(5);
var defaultToken1Amount = (0, utilities_1.expandTo18Decimals)(10);
describe('ExampleSlidingWindowOracle', function () {
    var provider = new ethereum_waffle_1.MockProvider({
        hardfork: 'istanbul',
        mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
        gasLimit: 9999999
    });
    var wallet = provider.getWallets()[0];
    var loadFixture = (0, ethereum_waffle_1.createFixtureLoader)(provider, [wallet]);
    var token0;
    var token1;
    var pair;
    var weth;
    var factory;
    function addLiquidity() {
        return __awaiter(this, arguments, void 0, function (amount0, amount1) {
            if (amount0 === void 0) { amount0 = defaultToken0Amount; }
            if (amount1 === void 0) { amount1 = defaultToken1Amount; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!amount0.isZero()) return [3 /*break*/, 2];
                        return [4 /*yield*/, token0.transfer(pair.address, amount0)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!!amount1.isZero()) return [3 /*break*/, 4];
                        return [4 /*yield*/, token1.transfer(pair.address, amount1)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, pair.sync()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    var defaultWindowSize = 86400; // 24 hours
    var defaultGranularity = 24; // 1 hour each
    function observationIndexOf(timestamp, windowSize, granularity) {
        if (windowSize === void 0) { windowSize = defaultWindowSize; }
        if (granularity === void 0) { granularity = defaultGranularity; }
        var periodSize = Math.floor(windowSize / granularity);
        var epochPeriod = Math.floor(timestamp / periodSize);
        return epochPeriod % granularity;
    }
    function deployOracle(windowSize, granularity) {
        return (0, ethereum_waffle_1.deployContract)(wallet, ExampleSlidingWindowOracle_json_1.default, [factory.address, windowSize, granularity], overrides);
    }
    beforeEach('deploy fixture', function () {
        return __awaiter(this, void 0, void 0, function () {
            var fixture;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loadFixture(fixtures_1.v2Fixture)];
                    case 1:
                        fixture = _a.sent();
                        token0 = fixture.token0;
                        token1 = fixture.token1;
                        pair = fixture.pair;
                        weth = fixture.WETH;
                        factory = fixture.factoryV2;
                        return [2 /*return*/];
                }
            });
        });
    });
    // 1/1/2020 @ 12:00 am UTC
    // cannot be 0 because that instructs ganache to set it to current timestamp
    // cannot be 86400 because then timestamp 0 is a valid historical observation
    var startTime = 1577836800;
    // must come before adding liquidity to pairs for correct cumulative price computations
    // cannot use 0 because that resets to current timestamp
    beforeEach("set start time to ".concat(startTime), function () { return (0, utilities_1.mineBlock)(provider, startTime); });
    it('requires granularity to be greater than 0', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, chai_1.expect)(deployOracle(defaultWindowSize, 0)).to.be.revertedWith('SlidingWindowOracle: GRANULARITY')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('requires windowSize to be evenly divisible by granularity', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, chai_1.expect)(deployOracle(defaultWindowSize - 1, defaultGranularity)).to.be.revertedWith('SlidingWindowOracle: WINDOW_NOT_EVENLY_DIVISIBLE')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('computes the periodSize correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
        var oracle, _a, oracleOther, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, deployOracle(defaultWindowSize, defaultGranularity)];
                case 1:
                    oracle = _c.sent();
                    _a = chai_1.expect;
                    return [4 /*yield*/, oracle.periodSize()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).to.eq(3600);
                    return [4 /*yield*/, deployOracle(defaultWindowSize * 2, defaultGranularity / 2)];
                case 3:
                    oracleOther = _c.sent();
                    _b = chai_1.expect;
                    return [4 /*yield*/, oracleOther.periodSize()];
                case 4:
                    _b.apply(void 0, [_c.sent()]).to.eq(3600 * 4);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#observationIndexOf', function () {
        it('works for examples', function () { return __awaiter(void 0, void 0, void 0, function () {
            var oracle, _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0: return [4 /*yield*/, deployOracle(defaultWindowSize, defaultGranularity)];
                    case 1:
                        oracle = _k.sent();
                        _a = chai_1.expect;
                        return [4 /*yield*/, oracle.observationIndexOf(0)];
                    case 2:
                        _a.apply(void 0, [_k.sent()]).to.eq(0);
                        _b = chai_1.expect;
                        return [4 /*yield*/, oracle.observationIndexOf(3599)];
                    case 3:
                        _b.apply(void 0, [_k.sent()]).to.eq(0);
                        _c = chai_1.expect;
                        return [4 /*yield*/, oracle.observationIndexOf(3600)];
                    case 4:
                        _c.apply(void 0, [_k.sent()]).to.eq(1);
                        _d = chai_1.expect;
                        return [4 /*yield*/, oracle.observationIndexOf(4800)];
                    case 5:
                        _d.apply(void 0, [_k.sent()]).to.eq(1);
                        _e = chai_1.expect;
                        return [4 /*yield*/, oracle.observationIndexOf(7199)];
                    case 6:
                        _e.apply(void 0, [_k.sent()]).to.eq(1);
                        _f = chai_1.expect;
                        return [4 /*yield*/, oracle.observationIndexOf(7200)];
                    case 7:
                        _f.apply(void 0, [_k.sent()]).to.eq(2);
                        _g = chai_1.expect;
                        return [4 /*yield*/, oracle.observationIndexOf(86399)];
                    case 8:
                        _g.apply(void 0, [_k.sent()]).to.eq(23);
                        _h = chai_1.expect;
                        return [4 /*yield*/, oracle.observationIndexOf(86400)];
                    case 9:
                        _h.apply(void 0, [_k.sent()]).to.eq(0);
                        _j = chai_1.expect;
                        return [4 /*yield*/, oracle.observationIndexOf(90000)];
                    case 10:
                        _j.apply(void 0, [_k.sent()]).to.eq(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('overflow safe', function () { return __awaiter(void 0, void 0, void 0, function () {
            var oracle, _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, deployOracle(25500, 255)]; // 100 period size
                    case 1:
                        oracle = _g.sent() // 100 period size
                        ;
                        _a = chai_1.expect;
                        return [4 /*yield*/, oracle.observationIndexOf(0)];
                    case 2:
                        _a.apply(void 0, [_g.sent()]).to.eq(0);
                        _b = chai_1.expect;
                        return [4 /*yield*/, oracle.observationIndexOf(99)];
                    case 3:
                        _b.apply(void 0, [_g.sent()]).to.eq(0);
                        _c = chai_1.expect;
                        return [4 /*yield*/, oracle.observationIndexOf(100)];
                    case 4:
                        _c.apply(void 0, [_g.sent()]).to.eq(1);
                        _d = chai_1.expect;
                        return [4 /*yield*/, oracle.observationIndexOf(199)];
                    case 5:
                        _d.apply(void 0, [_g.sent()]).to.eq(1);
                        _e = chai_1.expect;
                        return [4 /*yield*/, oracle.observationIndexOf(25499)];
                    case 6:
                        _e.apply(void 0, [_g.sent()]).to.eq(254); // 255th element
                        _f = chai_1.expect;
                        return [4 /*yield*/, oracle.observationIndexOf(25500)];
                    case 7:
                        _f.apply(void 0, [_g.sent()]).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('matches offline computation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var oracle, _i, _a, timestamp, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, deployOracle(defaultWindowSize, defaultGranularity)];
                    case 1:
                        oracle = _c.sent();
                        _i = 0, _a = [0, 5000, 1000, 25000, 86399, 86400, 86401];
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        timestamp = _a[_i];
                        _b = chai_1.expect;
                        return [4 /*yield*/, oracle.observationIndexOf(timestamp)];
                    case 3:
                        _b.apply(void 0, [_c.sent()]).to.eq(observationIndexOf(timestamp));
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#update', function () {
        var slidingWindowOracle;
        beforeEach('deploy oracle', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, deployOracle(defaultWindowSize, defaultGranularity)];
                case 1: return [2 /*return*/, (slidingWindowOracle = _a.sent())];
            }
        }); }); });
        beforeEach('add default liquidity', function () { return addLiquidity(); });
        it('succeeds', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, slidingWindowOracle.update(token0.address, token1.address, overrides)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('sets the appropriate epoch slot', function () { return __awaiter(void 0, void 0, void 0, function () {
            var blockTimestamp, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, pair.getReserves()];
                    case 1:
                        blockTimestamp = (_e.sent())[2];
                        (0, chai_1.expect)(blockTimestamp).to.eq(startTime);
                        return [4 /*yield*/, slidingWindowOracle.update(token0.address, token1.address, overrides)];
                    case 2:
                        _e.sent();
                        _b = chai_1.expect;
                        return [4 /*yield*/, slidingWindowOracle.pairObservations(pair.address, observationIndexOf(blockTimestamp))];
                    case 3:
                        _c = (_a = _b.apply(void 0, [_e.sent()]).to.deep).eq;
                        _d = [(0, utils_1.bigNumberify)(blockTimestamp)];
                        return [4 /*yield*/, pair.price0CumulativeLast()];
                    case 4:
                        _d = _d.concat([
                            _e.sent()
                        ]);
                        return [4 /*yield*/, pair.price1CumulativeLast()];
                    case 5:
                        _c.apply(_a, [_d.concat([
                                _e.sent()
                            ])]);
                        return [2 /*return*/];
                }
            });
        }); }).retries(2); // we may have slight differences between pair blockTimestamp and the expected timestamp
        // because the previous block timestamp may differ from the current block timestamp by 1 second
        it('gas for first update (allocates empty array)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tx, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, slidingWindowOracle.update(token0.address, token1.address, overrides)];
                    case 1:
                        tx = _a.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 2:
                        receipt = _a.sent();
                        (0, chai_1.expect)(receipt.gasUsed).to.eq('116816');
                        return [2 /*return*/];
                }
            });
        }); }).retries(2); // gas test inconsistent
        it('gas for second update in the same period (skips)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tx, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, slidingWindowOracle.update(token0.address, token1.address, overrides)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, slidingWindowOracle.update(token0.address, token1.address, overrides)];
                    case 2:
                        tx = _a.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 3:
                        receipt = _a.sent();
                        (0, chai_1.expect)(receipt.gasUsed).to.eq('25574');
                        return [2 /*return*/];
                }
            });
        }); }).retries(2); // gas test inconsistent
        it('gas for second update different period (no allocate, no skip)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tx, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, slidingWindowOracle.update(token0.address, token1.address, overrides)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, utilities_1.mineBlock)(provider, startTime + 3600)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, slidingWindowOracle.update(token0.address, token1.address, overrides)];
                    case 3:
                        tx = _a.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 4:
                        receipt = _a.sent();
                        (0, chai_1.expect)(receipt.gasUsed).to.eq('94703');
                        return [2 /*return*/];
                }
            });
        }); }).retries(2); // gas test inconsistent
        it('second update in one timeslot does not overwrite', function () { return __awaiter(void 0, void 0, void 0, function () {
            var before, after;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, slidingWindowOracle.update(token0.address, token1.address, overrides)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, slidingWindowOracle.pairObservations(pair.address, observationIndexOf(0))
                            // first hour still
                        ];
                    case 2:
                        before = _a.sent();
                        // first hour still
                        return [4 /*yield*/, (0, utilities_1.mineBlock)(provider, startTime + 1800)];
                    case 3:
                        // first hour still
                        _a.sent();
                        return [4 /*yield*/, slidingWindowOracle.update(token0.address, token1.address, overrides)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, slidingWindowOracle.pairObservations(pair.address, observationIndexOf(1800))];
                    case 5:
                        after = _a.sent();
                        (0, chai_1.expect)(observationIndexOf(1800)).to.eq(observationIndexOf(0));
                        (0, chai_1.expect)(before).to.deep.eq(after);
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails for invalid pair', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(slidingWindowOracle.update(weth.address, token1.address)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#consult', function () {
        var slidingWindowOracle;
        beforeEach('deploy oracle', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, deployOracle(defaultWindowSize, defaultGranularity)];
                case 1: return [2 /*return*/, (slidingWindowOracle = _a.sent())];
            }
        }); }); });
        // must come after setting time to 0 for correct cumulative price computations in the pair
        beforeEach('add default liquidity', function () { return addLiquidity(); });
        it('fails if previous bucket not set', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, slidingWindowOracle.update(token0.address, token1.address, overrides)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(slidingWindowOracle.consult(token0.address, 0, token1.address)).to.be.revertedWith('SlidingWindowOracle: MISSING_HISTORICAL_OBSERVATION')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails for invalid pair', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(slidingWindowOracle.consult(weth.address, 0, token1.address)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('happy path', function () {
            var blockTimestamp;
            var previousBlockTimestamp;
            var previousCumulativePrices;
            beforeEach('add some prices', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pair.getReserves()];
                        case 1:
                            previousBlockTimestamp = (_b.sent())[2];
                            return [4 /*yield*/, pair.price0CumulativeLast()];
                        case 2:
                            _a = [_b.sent()];
                            return [4 /*yield*/, pair.price1CumulativeLast()];
                        case 3:
                            previousCumulativePrices = _a.concat([_b.sent()]);
                            return [4 /*yield*/, slidingWindowOracle.update(token0.address, token1.address, overrides)];
                        case 4:
                            _b.sent();
                            blockTimestamp = previousBlockTimestamp + 23 * 3600;
                            return [4 /*yield*/, (0, utilities_1.mineBlock)(provider, blockTimestamp)];
                        case 5:
                            _b.sent();
                            return [4 /*yield*/, slidingWindowOracle.update(token0.address, token1.address, overrides)];
                        case 6:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('has cumulative price in previous bucket', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = chai_1.expect;
                            return [4 /*yield*/, slidingWindowOracle.pairObservations(pair.address, observationIndexOf(previousBlockTimestamp))];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.deep.eq([(0, utils_1.bigNumberify)(previousBlockTimestamp), previousCumulativePrices[0], previousCumulativePrices[1]]);
                            return [2 /*return*/];
                    }
                });
            }); }).retries(5); // test flaky because timestamps aren't mocked
            it('has cumulative price in current bucket', function () { return __awaiter(void 0, void 0, void 0, function () {
                var timeElapsed, prices, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            timeElapsed = blockTimestamp - previousBlockTimestamp;
                            prices = (0, utilities_1.encodePrice)(defaultToken0Amount, defaultToken1Amount);
                            _a = chai_1.expect;
                            return [4 /*yield*/, slidingWindowOracle.pairObservations(pair.address, observationIndexOf(blockTimestamp))];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.deep.eq([(0, utils_1.bigNumberify)(blockTimestamp), prices[0].mul(timeElapsed), prices[1].mul(timeElapsed)]);
                            return [2 /*return*/];
                    }
                });
            }); }).retries(5); // test flaky because timestamps aren't mocked
            it('provides the current ratio in consult token0', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = chai_1.expect;
                            return [4 /*yield*/, slidingWindowOracle.consult(token0.address, 100, token1.address)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq(200);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('provides the current ratio in consult token1', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = chai_1.expect;
                            return [4 /*yield*/, slidingWindowOracle.consult(token1.address, 100, token0.address)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq(50);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('price changes over period', function () {
            var hour = 3600;
            beforeEach('add some prices', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // starting price of 1:2, or token0 = 2token1, token1 = 0.5token0
                        return [4 /*yield*/, slidingWindowOracle.update(token0.address, token1.address, overrides)
                            // change the price at hour 3 to 1:1 and immediately update
                        ]; // hour 0, 1:2
                        case 1:
                            // starting price of 1:2, or token0 = 2token1, token1 = 0.5token0
                            _a.sent(); // hour 0, 1:2
                            // change the price at hour 3 to 1:1 and immediately update
                            return [4 /*yield*/, (0, utilities_1.mineBlock)(provider, startTime + 3 * hour)];
                        case 2:
                            // change the price at hour 3 to 1:1 and immediately update
                            _a.sent();
                            return [4 /*yield*/, addLiquidity(defaultToken0Amount, (0, utils_1.bigNumberify)(0))];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, slidingWindowOracle.update(token0.address, token1.address, overrides)
                                // change the ratios at hour 6:00 to 2:1, don't update right away
                            ];
                        case 4:
                            _a.sent();
                            // change the ratios at hour 6:00 to 2:1, don't update right away
                            return [4 /*yield*/, (0, utilities_1.mineBlock)(provider, startTime + 6 * hour)];
                        case 5:
                            // change the ratios at hour 6:00 to 2:1, don't update right away
                            _a.sent();
                            return [4 /*yield*/, token0.transfer(pair.address, defaultToken0Amount.mul(2))];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, pair.sync()
                                // update at hour 9:00 (price has been 2:1 for 3 hours, invokes counterfactual)
                            ];
                        case 7:
                            _a.sent();
                            // update at hour 9:00 (price has been 2:1 for 3 hours, invokes counterfactual)
                            return [4 /*yield*/, (0, utilities_1.mineBlock)(provider, startTime + 9 * hour)];
                        case 8:
                            // update at hour 9:00 (price has been 2:1 for 3 hours, invokes counterfactual)
                            _a.sent();
                            return [4 /*yield*/, slidingWindowOracle.update(token0.address, token1.address, overrides)
                                // move to hour 23:00 so we can check prices
                            ];
                        case 9:
                            _a.sent();
                            // move to hour 23:00 so we can check prices
                            return [4 /*yield*/, (0, utilities_1.mineBlock)(provider, startTime + 23 * hour)];
                        case 10:
                            // move to hour 23:00 so we can check prices
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('provides the correct ratio in consult token0', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            // at hour 23, price of token 0 spent 3 hours at 2, 3 hours at 1, 17 hours at 0.5 so price should
                            // be less than 1
                            _a = chai_1.expect;
                            return [4 /*yield*/, slidingWindowOracle.consult(token0.address, 100, token1.address)];
                        case 1:
                            // at hour 23, price of token 0 spent 3 hours at 2, 3 hours at 1, 17 hours at 0.5 so price should
                            // be less than 1
                            _a.apply(void 0, [_b.sent()]).to.eq(76);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('provides the correct ratio in consult token1', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            // price should be greater than 1
                            _a = chai_1.expect;
                            return [4 /*yield*/, slidingWindowOracle.consult(token1.address, 100, token0.address)];
                        case 1:
                            // price should be greater than 1
                            _a.apply(void 0, [_b.sent()]).to.eq(167);
                            return [2 /*return*/];
                    }
                });
            }); });
            // price has been 2:1 all of 23 hours
            describe('hour 32', function () {
                beforeEach('set hour 32', function () { return (0, utilities_1.mineBlock)(provider, startTime + 32 * hour); });
                it('provides the correct ratio in consult token0', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                // at hour 23, price of token 0 spent 3 hours at 2, 3 hours at 1, 17 hours at 0.5 so price should
                                // be less than 1
                                _a = chai_1.expect;
                                return [4 /*yield*/, slidingWindowOracle.consult(token0.address, 100, token1.address)];
                            case 1:
                                // at hour 23, price of token 0 spent 3 hours at 2, 3 hours at 1, 17 hours at 0.5 so price should
                                // be less than 1
                                _a.apply(void 0, [_b.sent()]).to.eq(50);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('provides the correct ratio in consult token1', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                // price should be greater than 1
                                _a = chai_1.expect;
                                return [4 /*yield*/, slidingWindowOracle.consult(token1.address, 100, token0.address)];
                            case 1:
                                // price should be greater than 1
                                _a.apply(void 0, [_b.sent()]).to.eq(200);
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    });
});
