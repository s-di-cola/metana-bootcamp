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
var hardhat_1 = require("hardhat");
var ethers_1 = require("ethers");
var checkObservationEquals_1 = require("./shared/checkObservationEquals");
var expect_1 = require("./shared/expect");
var fixtures_1 = require("./shared/fixtures");
var utilities_1 = require("./shared/utilities");
var createFixtureLoader = hardhat_1.waffle.createFixtureLoader;
describe('UniswapV3Pool', function () {
    var wallet, other;
    var token0;
    var token1;
    var token2;
    var factory;
    var pool;
    var swapTarget;
    var swapToLowerPrice;
    var swapToHigherPrice;
    var swapExact0For1;
    var swap0ForExact1;
    var swapExact1For0;
    var swap1ForExact0;
    var feeAmount;
    var tickSpacing;
    var minTick;
    var maxTick;
    var mint;
    var flash;
    var loadFixture;
    var createPool;
    before('create fixture loader', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ;
                    return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    _a = _b.sent(), wallet = _a[0], other = _a[1];
                    loadFixture = createFixtureLoader([wallet, other]);
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach('deploy fixture', function () { return __awaiter(void 0, void 0, void 0, function () {
        var oldCreatePool;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ;
                    return [4 /*yield*/, loadFixture(fixtures_1.poolFixture)];
                case 1:
                    (_a = _b.sent(), token0 = _a.token0, token1 = _a.token1, token2 = _a.token2, factory = _a.factory, createPool = _a.createPool, swapTarget = _a.swapTargetCallee);
                    oldCreatePool = createPool;
                    createPool = function (_feeAmount, _tickSpacing) { return __awaiter(void 0, void 0, void 0, function () {
                        var pool;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, oldCreatePool(_feeAmount, _tickSpacing)];
                                case 1:
                                    pool = _b.sent();
                                    (_a = (0, utilities_1.createPoolFunctions)({
                                        token0: token0,
                                        token1: token1,
                                        swapTarget: swapTarget,
                                        pool: pool,
                                    }), swapToLowerPrice = _a.swapToLowerPrice, swapToHigherPrice = _a.swapToHigherPrice, swapExact0For1 = _a.swapExact0For1, swap0ForExact1 = _a.swap0ForExact1, swapExact1For0 = _a.swapExact1For0, swap1ForExact0 = _a.swap1ForExact0, mint = _a.mint, flash = _a.flash);
                                    minTick = (0, utilities_1.getMinTick)(_tickSpacing);
                                    maxTick = (0, utilities_1.getMaxTick)(_tickSpacing);
                                    feeAmount = _feeAmount;
                                    tickSpacing = _tickSpacing;
                                    return [2 /*return*/, pool];
                            }
                        });
                    }); };
                    return [4 /*yield*/, createPool(utilities_1.FeeAmount.MEDIUM, utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM])];
                case 2:
                    // default to the 30 bips pool
                    pool = _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('constructor initializes immutables', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = expect_1.expect;
                    return [4 /*yield*/, pool.factory()];
                case 1:
                    _a.apply(void 0, [_e.sent()]).to.eq(factory.address);
                    _b = expect_1.expect;
                    return [4 /*yield*/, pool.token0()];
                case 2:
                    _b.apply(void 0, [_e.sent()]).to.eq(token0.address);
                    _c = expect_1.expect;
                    return [4 /*yield*/, pool.token1()];
                case 3:
                    _c.apply(void 0, [_e.sent()]).to.eq(token1.address);
                    _d = expect_1.expect;
                    return [4 /*yield*/, pool.maxLiquidityPerTick()];
                case 4:
                    _d.apply(void 0, [_e.sent()]).to.eq((0, utilities_1.getMaxLiquidityPerTick)(tickSpacing));
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#initialize', function () {
        it('fails if already initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))).to.be.reverted];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if starting price is too low', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(pool.initialize(1)).to.be.revertedWith('R')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(pool.initialize(utilities_1.MIN_SQRT_RATIO.sub(1))).to.be.revertedWith('R')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if starting price is too high', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(pool.initialize(utilities_1.MAX_SQRT_RATIO)).to.be.revertedWith('R')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(pool.initialize(ethers_1.BigNumber.from(2).pow(160).sub(1))).to.be.revertedWith('R')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('can be initialized at MIN_SQRT_RATIO', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pool.initialize(utilities_1.MIN_SQRT_RATIO)];
                    case 1:
                        _b.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, pool.slot0()];
                    case 2:
                        _a.apply(void 0, [(_b.sent()).tick]).to.eq((0, utilities_1.getMinTick)(1));
                        return [2 /*return*/];
                }
            });
        }); });
        it('can be initialized at MAX_SQRT_RATIO - 1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pool.initialize(utilities_1.MAX_SQRT_RATIO.sub(1))];
                    case 1:
                        _b.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, pool.slot0()];
                    case 2:
                        _a.apply(void 0, [(_b.sent()).tick]).to.eq((0, utilities_1.getMaxTick)(1) - 1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('sets initial variables', function () { return __awaiter(void 0, void 0, void 0, function () {
            var price, _a, sqrtPriceX96, observationIndex, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        price = (0, utilities_1.encodePriceSqrt)(1, 2);
                        return [4 /*yield*/, pool.initialize(price)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, pool.slot0()];
                    case 2:
                        _a = _c.sent(), sqrtPriceX96 = _a.sqrtPriceX96, observationIndex = _a.observationIndex;
                        (0, expect_1.expect)(sqrtPriceX96).to.eq(price);
                        (0, expect_1.expect)(observationIndex).to.eq(0);
                        _b = expect_1.expect;
                        return [4 /*yield*/, pool.slot0()];
                    case 3:
                        _b.apply(void 0, [(_c.sent()).tick]).to.eq(-6932);
                        return [2 /*return*/];
                }
            });
        }); });
        it('initializes the first observations slot', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _b.sent();
                        _a = checkObservationEquals_1.default;
                        return [4 /*yield*/, pool.observations(0)];
                    case 2:
                        _a.apply(void 0, [_b.sent(), {
                                secondsPerLiquidityCumulativeX128: 0,
                                initialized: true,
                                blockTimestamp: fixtures_1.TEST_POOL_START_TIME,
                                tickCumulative: 0,
                            }]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('emits a Initialized event with the input tick', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sqrtPriceX96;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sqrtPriceX96 = (0, utilities_1.encodePriceSqrt)(1, 2);
                        return [4 /*yield*/, (0, expect_1.expect)(pool.initialize(sqrtPriceX96)).to.emit(pool, 'Initialize').withArgs(sqrtPriceX96, -6932)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#increaseObservationCardinalityNext', function () {
        it('can only be called after initialize', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(pool.increaseObservationCardinalityNext(2)).to.be.revertedWith('LOK')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('emits an event including both old and new', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(pool.increaseObservationCardinalityNext(2))
                                .to.emit(pool, 'IncreaseObservationCardinalityNext')
                                .withArgs(1, 2)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('does not emit an event for no op call', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, pool.increaseObservationCardinalityNext(3)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(pool.increaseObservationCardinalityNext(2)).to.not.emit(pool, 'IncreaseObservationCardinalityNext')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('does not change cardinality next if less than current', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, pool.increaseObservationCardinalityNext(3)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, pool.increaseObservationCardinalityNext(2)];
                    case 3:
                        _b.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, pool.slot0()];
                    case 4:
                        _a.apply(void 0, [(_b.sent()).observationCardinalityNext]).to.eq(3);
                        return [2 /*return*/];
                }
            });
        }); });
        it('increases cardinality and cardinality next first time', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, observationCardinality, observationCardinalityNext;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, pool.increaseObservationCardinalityNext(2)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, pool.slot0()];
                    case 3:
                        _a = _b.sent(), observationCardinality = _a.observationCardinality, observationCardinalityNext = _a.observationCardinalityNext;
                        (0, expect_1.expect)(observationCardinality).to.eq(1);
                        (0, expect_1.expect)(observationCardinalityNext).to.eq(2);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#mint', function () {
        it('fails if not initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, -tickSpacing, tickSpacing, 1)).to.be.revertedWith('LOK')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('after initialization', function () {
            beforeEach('initialize the pool at price of 10:1', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 10))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, mint(wallet.address, minTick, maxTick, 3161)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('failure cases', function () {
                it('fails if tickLower greater than tickUpper', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // should be TLU but...hardhat
                            return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, 1, 0, 1)).to.be.reverted];
                            case 1:
                                // should be TLU but...hardhat
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('fails if tickLower less than min tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // should be TLM but...hardhat
                            return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, -887273, 0, 1)).to.be.reverted];
                            case 1:
                                // should be TLM but...hardhat
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('fails if tickUpper greater than max tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // should be TUM but...hardhat
                            return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, 0, 887273, 1)).to.be.reverted];
                            case 1:
                                // should be TUM but...hardhat
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('fails if amount exceeds the max', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var maxLiquidityGross;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.maxLiquidityPerTick()];
                            case 1:
                                maxLiquidityGross = _a.sent();
                                return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, maxLiquidityGross.add(1))).to
                                        .be.reverted];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, maxLiquidityGross)).to.not.be
                                        .reverted];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('fails if total amount at tick exceeds the max', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var maxLiquidityGross;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // these should fail with 'LO' but hardhat is bugged
                            return [4 /*yield*/, mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, 1000)];
                            case 1:
                                // these should fail with 'LO' but hardhat is bugged
                                _a.sent();
                                return [4 /*yield*/, pool.maxLiquidityPerTick()];
                            case 2:
                                maxLiquidityGross = _a.sent();
                                return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, maxLiquidityGross.sub(1000).add(1))).to.be.reverted];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, minTick + tickSpacing * 2, maxTick - tickSpacing, maxLiquidityGross.sub(1000).add(1))).to.be.reverted];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing * 2, maxLiquidityGross.sub(1000).add(1))).to.be.reverted];
                            case 5:
                                _a.sent();
                                return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, maxLiquidityGross.sub(1000)))
                                        .to.not.be.reverted];
                            case 6:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('fails if amount is 0', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, 0)).to.be.reverted];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('success cases', function () {
                it('initial balances', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _a = expect_1.expect;
                                return [4 /*yield*/, token0.balanceOf(pool.address)];
                            case 1:
                                _a.apply(void 0, [_c.sent()]).to.eq(9996);
                                _b = expect_1.expect;
                                return [4 /*yield*/, token1.balanceOf(pool.address)];
                            case 2:
                                _b.apply(void 0, [_c.sent()]).to.eq(1000);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('initial tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 1:
                                _a.apply(void 0, [(_b.sent()).tick]).to.eq(-23028);
                                return [2 /*return*/];
                        }
                    });
                }); });
                describe('above current price', function () {
                    it('transfers token0 only', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, -22980, 0, 10000))
                                        .to.emit(token0, 'Transfer')
                                        .withArgs(wallet.address, pool.address, 21549)
                                        .to.not.emit(token1, 'Transfer')];
                                case 1:
                                    _c.sent();
                                    _a = expect_1.expect;
                                    return [4 /*yield*/, token0.balanceOf(pool.address)];
                                case 2:
                                    _a.apply(void 0, [_c.sent()]).to.eq(9996 + 21549);
                                    _b = expect_1.expect;
                                    return [4 /*yield*/, token1.balanceOf(pool.address)];
                                case 3:
                                    _b.apply(void 0, [_c.sent()]).to.eq(1000);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('max tick with max leverage', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, mint(wallet.address, maxTick - tickSpacing, maxTick, ethers_1.BigNumber.from(2).pow(102))];
                                case 1:
                                    _c.sent();
                                    _a = expect_1.expect;
                                    return [4 /*yield*/, token0.balanceOf(pool.address)];
                                case 2:
                                    _a.apply(void 0, [_c.sent()]).to.eq(9996 + 828011525);
                                    _b = expect_1.expect;
                                    return [4 /*yield*/, token1.balanceOf(pool.address)];
                                case 3:
                                    _b.apply(void 0, [_c.sent()]).to.eq(1000);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('works for max tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, -22980, maxTick, 10000))
                                        .to.emit(token0, 'Transfer')
                                        .withArgs(wallet.address, pool.address, 31549)];
                                case 1:
                                    _c.sent();
                                    _a = expect_1.expect;
                                    return [4 /*yield*/, token0.balanceOf(pool.address)];
                                case 2:
                                    _a.apply(void 0, [_c.sent()]).to.eq(9996 + 31549);
                                    _b = expect_1.expect;
                                    return [4 /*yield*/, token1.balanceOf(pool.address)];
                                case 3:
                                    _b.apply(void 0, [_c.sent()]).to.eq(1000);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('removing works', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, amount0, amount1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, mint(wallet.address, -240, 0, 10000)];
                                case 1:
                                    _b.sent();
                                    return [4 /*yield*/, pool.burn(-240, 0, 10000)];
                                case 2:
                                    _b.sent();
                                    return [4 /*yield*/, pool.callStatic.collect(wallet.address, -240, 0, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                                case 3:
                                    _a = _b.sent(), amount0 = _a.amount0, amount1 = _a.amount1;
                                    (0, expect_1.expect)(amount0, 'amount0').to.eq(120);
                                    (0, expect_1.expect)(amount1, 'amount1').to.eq(0);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('adds liquidity to liquidityGross', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                        return __generator(this, function (_o) {
                            switch (_o.label) {
                                case 0: return [4 /*yield*/, mint(wallet.address, -240, 0, 100)];
                                case 1:
                                    _o.sent();
                                    _a = expect_1.expect;
                                    return [4 /*yield*/, pool.ticks(-240)];
                                case 2:
                                    _a.apply(void 0, [(_o.sent()).liquidityGross]).to.eq(100);
                                    _b = expect_1.expect;
                                    return [4 /*yield*/, pool.ticks(0)];
                                case 3:
                                    _b.apply(void 0, [(_o.sent()).liquidityGross]).to.eq(100);
                                    _c = expect_1.expect;
                                    return [4 /*yield*/, pool.ticks(tickSpacing)];
                                case 4:
                                    _c.apply(void 0, [(_o.sent()).liquidityGross]).to.eq(0);
                                    _d = expect_1.expect;
                                    return [4 /*yield*/, pool.ticks(tickSpacing * 2)];
                                case 5:
                                    _d.apply(void 0, [(_o.sent()).liquidityGross]).to.eq(0);
                                    return [4 /*yield*/, mint(wallet.address, -240, tickSpacing, 150)];
                                case 6:
                                    _o.sent();
                                    _e = expect_1.expect;
                                    return [4 /*yield*/, pool.ticks(-240)];
                                case 7:
                                    _e.apply(void 0, [(_o.sent()).liquidityGross]).to.eq(250);
                                    _f = expect_1.expect;
                                    return [4 /*yield*/, pool.ticks(0)];
                                case 8:
                                    _f.apply(void 0, [(_o.sent()).liquidityGross]).to.eq(100);
                                    _g = expect_1.expect;
                                    return [4 /*yield*/, pool.ticks(tickSpacing)];
                                case 9:
                                    _g.apply(void 0, [(_o.sent()).liquidityGross]).to.eq(150);
                                    _h = expect_1.expect;
                                    return [4 /*yield*/, pool.ticks(tickSpacing * 2)];
                                case 10:
                                    _h.apply(void 0, [(_o.sent()).liquidityGross]).to.eq(0);
                                    return [4 /*yield*/, mint(wallet.address, 0, tickSpacing * 2, 60)];
                                case 11:
                                    _o.sent();
                                    _j = expect_1.expect;
                                    return [4 /*yield*/, pool.ticks(-240)];
                                case 12:
                                    _j.apply(void 0, [(_o.sent()).liquidityGross]).to.eq(250);
                                    _k = expect_1.expect;
                                    return [4 /*yield*/, pool.ticks(0)];
                                case 13:
                                    _k.apply(void 0, [(_o.sent()).liquidityGross]).to.eq(160);
                                    _l = expect_1.expect;
                                    return [4 /*yield*/, pool.ticks(tickSpacing)];
                                case 14:
                                    _l.apply(void 0, [(_o.sent()).liquidityGross]).to.eq(150);
                                    _m = expect_1.expect;
                                    return [4 /*yield*/, pool.ticks(tickSpacing * 2)];
                                case 15:
                                    _m.apply(void 0, [(_o.sent()).liquidityGross]).to.eq(60);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('removes liquidity from liquidityGross', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, mint(wallet.address, -240, 0, 100)];
                                case 1:
                                    _c.sent();
                                    return [4 /*yield*/, mint(wallet.address, -240, 0, 40)];
                                case 2:
                                    _c.sent();
                                    return [4 /*yield*/, pool.burn(-240, 0, 90)];
                                case 3:
                                    _c.sent();
                                    _a = expect_1.expect;
                                    return [4 /*yield*/, pool.ticks(-240)];
                                case 4:
                                    _a.apply(void 0, [(_c.sent()).liquidityGross]).to.eq(50);
                                    _b = expect_1.expect;
                                    return [4 /*yield*/, pool.ticks(0)];
                                case 5:
                                    _b.apply(void 0, [(_c.sent()).liquidityGross]).to.eq(50);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('clears tick lower if last position is removed', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, liquidityGross, feeGrowthOutside0X128, feeGrowthOutside1X128;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, mint(wallet.address, -240, 0, 100)];
                                case 1:
                                    _b.sent();
                                    return [4 /*yield*/, pool.burn(-240, 0, 100)];
                                case 2:
                                    _b.sent();
                                    return [4 /*yield*/, pool.ticks(-240)];
                                case 3:
                                    _a = _b.sent(), liquidityGross = _a.liquidityGross, feeGrowthOutside0X128 = _a.feeGrowthOutside0X128, feeGrowthOutside1X128 = _a.feeGrowthOutside1X128;
                                    (0, expect_1.expect)(liquidityGross).to.eq(0);
                                    (0, expect_1.expect)(feeGrowthOutside0X128).to.eq(0);
                                    (0, expect_1.expect)(feeGrowthOutside1X128).to.eq(0);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('clears tick upper if last position is removed', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, liquidityGross, feeGrowthOutside0X128, feeGrowthOutside1X128;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, mint(wallet.address, -240, 0, 100)];
                                case 1:
                                    _b.sent();
                                    return [4 /*yield*/, pool.burn(-240, 0, 100)];
                                case 2:
                                    _b.sent();
                                    return [4 /*yield*/, pool.ticks(0)];
                                case 3:
                                    _a = _b.sent(), liquidityGross = _a.liquidityGross, feeGrowthOutside0X128 = _a.feeGrowthOutside0X128, feeGrowthOutside1X128 = _a.feeGrowthOutside1X128;
                                    (0, expect_1.expect)(liquidityGross).to.eq(0);
                                    (0, expect_1.expect)(feeGrowthOutside0X128).to.eq(0);
                                    (0, expect_1.expect)(feeGrowthOutside1X128).to.eq(0);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('only clears the tick that is not used at all', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, liquidityGross, feeGrowthOutside0X128, feeGrowthOutside1X128;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, mint(wallet.address, -240, 0, 100)];
                                case 1:
                                    _c.sent();
                                    return [4 /*yield*/, mint(wallet.address, -tickSpacing, 0, 250)];
                                case 2:
                                    _c.sent();
                                    return [4 /*yield*/, pool.burn(-240, 0, 100)];
                                case 3:
                                    _c.sent();
                                    return [4 /*yield*/, pool.ticks(-240)];
                                case 4:
                                    _a = _c.sent(), liquidityGross = _a.liquidityGross, feeGrowthOutside0X128 = _a.feeGrowthOutside0X128, feeGrowthOutside1X128 = _a.feeGrowthOutside1X128;
                                    (0, expect_1.expect)(liquidityGross).to.eq(0);
                                    (0, expect_1.expect)(feeGrowthOutside0X128).to.eq(0);
                                    (0, expect_1.expect)(feeGrowthOutside1X128).to.eq(0);
                                    return [4 /*yield*/, pool.ticks(-tickSpacing)];
                                case 5:
                                    (_b = _c.sent(), liquidityGross = _b.liquidityGross, feeGrowthOutside0X128 = _b.feeGrowthOutside0X128, feeGrowthOutside1X128 = _b.feeGrowthOutside1X128);
                                    (0, expect_1.expect)(liquidityGross).to.eq(250);
                                    (0, expect_1.expect)(feeGrowthOutside0X128).to.eq(0);
                                    (0, expect_1.expect)(feeGrowthOutside1X128).to.eq(0);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('does not write an observation', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _a = checkObservationEquals_1.default;
                                    return [4 /*yield*/, pool.observations(0)];
                                case 1:
                                    _a.apply(void 0, [_c.sent(), {
                                            tickCumulative: 0,
                                            blockTimestamp: fixtures_1.TEST_POOL_START_TIME,
                                            initialized: true,
                                            secondsPerLiquidityCumulativeX128: 0,
                                        }]);
                                    return [4 /*yield*/, pool.advanceTime(1)];
                                case 2:
                                    _c.sent();
                                    return [4 /*yield*/, mint(wallet.address, -240, 0, 100)];
                                case 3:
                                    _c.sent();
                                    _b = checkObservationEquals_1.default;
                                    return [4 /*yield*/, pool.observations(0)];
                                case 4:
                                    _b.apply(void 0, [_c.sent(), {
                                            tickCumulative: 0,
                                            blockTimestamp: fixtures_1.TEST_POOL_START_TIME,
                                            initialized: true,
                                            secondsPerLiquidityCumulativeX128: 0,
                                        }]);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                describe('including current price', function () {
                    it('price within range: transfers current price of both tokens', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, 100))
                                        .to.emit(token0, 'Transfer')
                                        .withArgs(wallet.address, pool.address, 317)
                                        .to.emit(token1, 'Transfer')
                                        .withArgs(wallet.address, pool.address, 32)];
                                case 1:
                                    _c.sent();
                                    _a = expect_1.expect;
                                    return [4 /*yield*/, token0.balanceOf(pool.address)];
                                case 2:
                                    _a.apply(void 0, [_c.sent()]).to.eq(9996 + 317);
                                    _b = expect_1.expect;
                                    return [4 /*yield*/, token1.balanceOf(pool.address)];
                                case 3:
                                    _b.apply(void 0, [_c.sent()]).to.eq(1000 + 32);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('initializes lower tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var liquidityGross;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, 100)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, pool.ticks(minTick + tickSpacing)];
                                case 2:
                                    liquidityGross = (_a.sent()).liquidityGross;
                                    (0, expect_1.expect)(liquidityGross).to.eq(100);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('initializes upper tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var liquidityGross;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, 100)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, pool.ticks(maxTick - tickSpacing)];
                                case 2:
                                    liquidityGross = (_a.sent()).liquidityGross;
                                    (0, expect_1.expect)(liquidityGross).to.eq(100);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('works for min/max tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, minTick, maxTick, 10000))
                                        .to.emit(token0, 'Transfer')
                                        .withArgs(wallet.address, pool.address, 31623)
                                        .to.emit(token1, 'Transfer')
                                        .withArgs(wallet.address, pool.address, 3163)];
                                case 1:
                                    _c.sent();
                                    _a = expect_1.expect;
                                    return [4 /*yield*/, token0.balanceOf(pool.address)];
                                case 2:
                                    _a.apply(void 0, [_c.sent()]).to.eq(9996 + 31623);
                                    _b = expect_1.expect;
                                    return [4 /*yield*/, token1.balanceOf(pool.address)];
                                case 3:
                                    _b.apply(void 0, [_c.sent()]).to.eq(1000 + 3163);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('removing works', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, amount0, amount1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, 100)];
                                case 1:
                                    _b.sent();
                                    return [4 /*yield*/, pool.burn(minTick + tickSpacing, maxTick - tickSpacing, 100)];
                                case 2:
                                    _b.sent();
                                    return [4 /*yield*/, pool.callStatic.collect(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                                case 3:
                                    _a = _b.sent(), amount0 = _a.amount0, amount1 = _a.amount1;
                                    (0, expect_1.expect)(amount0, 'amount0').to.eq(316);
                                    (0, expect_1.expect)(amount1, 'amount1').to.eq(31);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('writes an observation', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _a = checkObservationEquals_1.default;
                                    return [4 /*yield*/, pool.observations(0)];
                                case 1:
                                    _a.apply(void 0, [_c.sent(), {
                                            tickCumulative: 0,
                                            blockTimestamp: fixtures_1.TEST_POOL_START_TIME,
                                            initialized: true,
                                            secondsPerLiquidityCumulativeX128: 0,
                                        }]);
                                    return [4 /*yield*/, pool.advanceTime(1)];
                                case 2:
                                    _c.sent();
                                    return [4 /*yield*/, mint(wallet.address, minTick, maxTick, 100)];
                                case 3:
                                    _c.sent();
                                    _b = checkObservationEquals_1.default;
                                    return [4 /*yield*/, pool.observations(0)];
                                case 4:
                                    _b.apply(void 0, [_c.sent(), {
                                            tickCumulative: -23028,
                                            blockTimestamp: fixtures_1.TEST_POOL_START_TIME + 1,
                                            initialized: true,
                                            secondsPerLiquidityCumulativeX128: '107650226801941937191829992860413859',
                                        }]);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                describe('below current price', function () {
                    it('transfers token1 only', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, -46080, -23040, 10000))
                                        .to.emit(token1, 'Transfer')
                                        .withArgs(wallet.address, pool.address, 2162)
                                        .to.not.emit(token0, 'Transfer')];
                                case 1:
                                    _c.sent();
                                    _a = expect_1.expect;
                                    return [4 /*yield*/, token0.balanceOf(pool.address)];
                                case 2:
                                    _a.apply(void 0, [_c.sent()]).to.eq(9996);
                                    _b = expect_1.expect;
                                    return [4 /*yield*/, token1.balanceOf(pool.address)];
                                case 3:
                                    _b.apply(void 0, [_c.sent()]).to.eq(1000 + 2162);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('min tick with max leverage', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, mint(wallet.address, minTick, minTick + tickSpacing, ethers_1.BigNumber.from(2).pow(102))];
                                case 1:
                                    _c.sent();
                                    _a = expect_1.expect;
                                    return [4 /*yield*/, token0.balanceOf(pool.address)];
                                case 2:
                                    _a.apply(void 0, [_c.sent()]).to.eq(9996);
                                    _b = expect_1.expect;
                                    return [4 /*yield*/, token1.balanceOf(pool.address)];
                                case 3:
                                    _b.apply(void 0, [_c.sent()]).to.eq(1000 + 828011520);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('works for min tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, minTick, -23040, 10000))
                                        .to.emit(token1, 'Transfer')
                                        .withArgs(wallet.address, pool.address, 3161)];
                                case 1:
                                    _c.sent();
                                    _a = expect_1.expect;
                                    return [4 /*yield*/, token0.balanceOf(pool.address)];
                                case 2:
                                    _a.apply(void 0, [_c.sent()]).to.eq(9996);
                                    _b = expect_1.expect;
                                    return [4 /*yield*/, token1.balanceOf(pool.address)];
                                case 3:
                                    _b.apply(void 0, [_c.sent()]).to.eq(1000 + 3161);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('removing works', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, amount0, amount1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, mint(wallet.address, -46080, -46020, 10000)];
                                case 1:
                                    _b.sent();
                                    return [4 /*yield*/, pool.burn(-46080, -46020, 10000)];
                                case 2:
                                    _b.sent();
                                    return [4 /*yield*/, pool.callStatic.collect(wallet.address, -46080, -46020, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                                case 3:
                                    _a = _b.sent(), amount0 = _a.amount0, amount1 = _a.amount1;
                                    (0, expect_1.expect)(amount0, 'amount0').to.eq(0);
                                    (0, expect_1.expect)(amount1, 'amount1').to.eq(3);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('does not write an observation', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _a = checkObservationEquals_1.default;
                                    return [4 /*yield*/, pool.observations(0)];
                                case 1:
                                    _a.apply(void 0, [_c.sent(), {
                                            tickCumulative: 0,
                                            blockTimestamp: fixtures_1.TEST_POOL_START_TIME,
                                            initialized: true,
                                            secondsPerLiquidityCumulativeX128: 0,
                                        }]);
                                    return [4 /*yield*/, pool.advanceTime(1)];
                                case 2:
                                    _c.sent();
                                    return [4 /*yield*/, mint(wallet.address, -46080, -23040, 100)];
                                case 3:
                                    _c.sent();
                                    _b = checkObservationEquals_1.default;
                                    return [4 /*yield*/, pool.observations(0)];
                                case 4:
                                    _b.apply(void 0, [_c.sent(), {
                                            tickCumulative: 0,
                                            blockTimestamp: fixtures_1.TEST_POOL_START_TIME,
                                            initialized: true,
                                            secondsPerLiquidityCumulativeX128: 0,
                                        }]);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
            });
            it('protocol fees accumulate as expected during swap', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, token0ProtocolFees, token1ProtocolFees;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pool.setFeeProtocol(6, 6)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, (0, utilities_1.expandTo18Decimals)(1))];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(10), wallet.address)];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, swapExact1For0((0, utilities_1.expandTo18Decimals)(1).div(100), wallet.address)];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, pool.protocolFees()];
                        case 5:
                            _a = _b.sent(), token0ProtocolFees = _a.token0, token1ProtocolFees = _a.token1;
                            (0, expect_1.expect)(token0ProtocolFees).to.eq('50000000000000');
                            (0, expect_1.expect)(token1ProtocolFees).to.eq('5000000000000');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('positions are protected before protocol fee is turned on', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, token0ProtocolFees, token1ProtocolFees;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, (0, utilities_1.expandTo18Decimals)(1))];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(10), wallet.address)];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, swapExact1For0((0, utilities_1.expandTo18Decimals)(1).div(100), wallet.address)];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, pool.protocolFees()];
                        case 4:
                            _a = _c.sent(), token0ProtocolFees = _a.token0, token1ProtocolFees = _a.token1;
                            (0, expect_1.expect)(token0ProtocolFees).to.eq(0);
                            (0, expect_1.expect)(token1ProtocolFees).to.eq(0);
                            return [4 /*yield*/, pool.setFeeProtocol(6, 6)];
                        case 5:
                            _c.sent();
                            return [4 /*yield*/, pool.protocolFees()];
                        case 6:
                            (_b = _c.sent(), token0ProtocolFees = _b.token0, token1ProtocolFees = _b.token1);
                            (0, expect_1.expect)(token0ProtocolFees).to.eq(0);
                            (0, expect_1.expect)(token1ProtocolFees).to.eq(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('poke is not allowed on uninitialized position', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, liquidity, feeGrowthInside0LastX128, feeGrowthInside1LastX128, tokensOwed1, tokensOwed0;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, mint(other.address, minTick + tickSpacing, maxTick - tickSpacing, (0, utilities_1.expandTo18Decimals)(1))];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(10), wallet.address)];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, swapExact1For0((0, utilities_1.expandTo18Decimals)(1).div(100), wallet.address)
                                // missing revert reason due to hardhat
                            ];
                        case 3:
                            _c.sent();
                            // missing revert reason due to hardhat
                            return [4 /*yield*/, (0, expect_1.expect)(pool.burn(minTick + tickSpacing, maxTick - tickSpacing, 0)).to.be.reverted];
                        case 4:
                            // missing revert reason due to hardhat
                            _c.sent();
                            return [4 /*yield*/, mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, 1)];
                        case 5:
                            _c.sent();
                            return [4 /*yield*/, pool.positions((0, utilities_1.getPositionKey)(wallet.address, minTick + tickSpacing, maxTick - tickSpacing))];
                        case 6:
                            _a = _c.sent(), liquidity = _a.liquidity, feeGrowthInside0LastX128 = _a.feeGrowthInside0LastX128, feeGrowthInside1LastX128 = _a.feeGrowthInside1LastX128, tokensOwed1 = _a.tokensOwed1, tokensOwed0 = _a.tokensOwed0;
                            (0, expect_1.expect)(liquidity).to.eq(1);
                            (0, expect_1.expect)(feeGrowthInside0LastX128).to.eq('102084710076281216349243831104605583');
                            (0, expect_1.expect)(feeGrowthInside1LastX128).to.eq('10208471007628121634924383110460558');
                            (0, expect_1.expect)(tokensOwed0, 'tokens owed 0 before').to.eq(0);
                            (0, expect_1.expect)(tokensOwed1, 'tokens owed 1 before').to.eq(0);
                            return [4 /*yield*/, pool.burn(minTick + tickSpacing, maxTick - tickSpacing, 1)];
                        case 7:
                            _c.sent();
                            return [4 /*yield*/, pool.positions((0, utilities_1.getPositionKey)(wallet.address, minTick + tickSpacing, maxTick - tickSpacing))];
                        case 8:
                            (_b = _c.sent(), liquidity = _b.liquidity, feeGrowthInside0LastX128 = _b.feeGrowthInside0LastX128, feeGrowthInside1LastX128 = _b.feeGrowthInside1LastX128, tokensOwed1 = _b.tokensOwed1, tokensOwed0 = _b.tokensOwed0);
                            (0, expect_1.expect)(liquidity).to.eq(0);
                            (0, expect_1.expect)(feeGrowthInside0LastX128).to.eq('102084710076281216349243831104605583');
                            (0, expect_1.expect)(feeGrowthInside1LastX128).to.eq('10208471007628121634924383110460558');
                            (0, expect_1.expect)(tokensOwed0, 'tokens owed 0 after').to.eq(3);
                            (0, expect_1.expect)(tokensOwed1, 'tokens owed 1 after').to.eq(0);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('#burn', function () {
        beforeEach('initialize at zero tick', function () { return initializeAtZeroTick(pool); });
        function checkTickIsClear(tick) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, liquidityGross, feeGrowthOutside0X128, feeGrowthOutside1X128, liquidityNet;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pool.ticks(tick)];
                        case 1:
                            _a = _b.sent(), liquidityGross = _a.liquidityGross, feeGrowthOutside0X128 = _a.feeGrowthOutside0X128, feeGrowthOutside1X128 = _a.feeGrowthOutside1X128, liquidityNet = _a.liquidityNet;
                            (0, expect_1.expect)(liquidityGross).to.eq(0);
                            (0, expect_1.expect)(feeGrowthOutside0X128).to.eq(0);
                            (0, expect_1.expect)(feeGrowthOutside1X128).to.eq(0);
                            (0, expect_1.expect)(liquidityNet).to.eq(0);
                            return [2 /*return*/];
                    }
                });
            });
        }
        function checkTickIsNotClear(tick) {
            return __awaiter(this, void 0, void 0, function () {
                var liquidityGross;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pool.ticks(tick)];
                        case 1:
                            liquidityGross = (_a.sent()).liquidityGross;
                            (0, expect_1.expect)(liquidityGross).to.not.eq(0);
                            return [2 /*return*/];
                    }
                });
            });
        }
        it('does not clear the position fee growth snapshot if no more liquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, liquidity, tokensOwed0, tokensOwed1, feeGrowthInside0LastX128, feeGrowthInside1LastX128;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: 
                    // some activity that would make the ticks non-zero
                    return [4 /*yield*/, pool.advanceTime(10)];
                    case 1:
                        // some activity that would make the ticks non-zero
                        _b.sent();
                        return [4 /*yield*/, mint(other.address, minTick, maxTick, (0, utilities_1.expandTo18Decimals)(1))];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, swapExact1For0((0, utilities_1.expandTo18Decimals)(1), wallet.address)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, pool.connect(other).burn(minTick, maxTick, (0, utilities_1.expandTo18Decimals)(1))];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, pool.positions((0, utilities_1.getPositionKey)(other.address, minTick, maxTick))];
                    case 6:
                        _a = _b.sent(), liquidity = _a.liquidity, tokensOwed0 = _a.tokensOwed0, tokensOwed1 = _a.tokensOwed1, feeGrowthInside0LastX128 = _a.feeGrowthInside0LastX128, feeGrowthInside1LastX128 = _a.feeGrowthInside1LastX128;
                        (0, expect_1.expect)(liquidity).to.eq(0);
                        (0, expect_1.expect)(tokensOwed0).to.not.eq(0);
                        (0, expect_1.expect)(tokensOwed1).to.not.eq(0);
                        (0, expect_1.expect)(feeGrowthInside0LastX128).to.eq('340282366920938463463374607431768211');
                        (0, expect_1.expect)(feeGrowthInside1LastX128).to.eq('340282366920938576890830247744589365');
                        return [2 /*return*/];
                }
            });
        }); });
        it('clears the tick if its the last position using it', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tickLower, tickUpper;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tickLower = minTick + tickSpacing;
                        tickUpper = maxTick - tickSpacing;
                        // some activity that would make the ticks non-zero
                        return [4 /*yield*/, pool.advanceTime(10)];
                    case 1:
                        // some activity that would make the ticks non-zero
                        _a.sent();
                        return [4 /*yield*/, mint(wallet.address, tickLower, tickUpper, 1)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, pool.burn(tickLower, tickUpper, 1)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, checkTickIsClear(tickLower)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, checkTickIsClear(tickUpper)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('clears only the lower tick if upper is still used', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tickLower, tickUpper;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tickLower = minTick + tickSpacing;
                        tickUpper = maxTick - tickSpacing;
                        // some activity that would make the ticks non-zero
                        return [4 /*yield*/, pool.advanceTime(10)];
                    case 1:
                        // some activity that would make the ticks non-zero
                        _a.sent();
                        return [4 /*yield*/, mint(wallet.address, tickLower, tickUpper, 1)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, mint(wallet.address, tickLower + tickSpacing, tickUpper, 1)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, pool.burn(tickLower, tickUpper, 1)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, checkTickIsClear(tickLower)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, checkTickIsNotClear(tickUpper)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('clears only the upper tick if lower is still used', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tickLower, tickUpper;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tickLower = minTick + tickSpacing;
                        tickUpper = maxTick - tickSpacing;
                        // some activity that would make the ticks non-zero
                        return [4 /*yield*/, pool.advanceTime(10)];
                    case 1:
                        // some activity that would make the ticks non-zero
                        _a.sent();
                        return [4 /*yield*/, mint(wallet.address, tickLower, tickUpper, 1)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, mint(wallet.address, tickLower, tickUpper - tickSpacing, 1)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, pool.burn(tickLower, tickUpper, 1)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, checkTickIsNotClear(tickLower)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, checkTickIsClear(tickUpper)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // the combined amount of liquidity that the pool is initialized with (including the 1 minimum liquidity that is burned)
    var initializeLiquidityAmount = (0, utilities_1.expandTo18Decimals)(2);
    function initializeAtZeroTick(pool) {
        return __awaiter(this, void 0, void 0, function () {
            var tickSpacing, _a, min, max;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, pool.tickSpacing()];
                    case 2:
                        tickSpacing = _b.sent();
                        _a = [(0, utilities_1.getMinTick)(tickSpacing), (0, utilities_1.getMaxTick)(tickSpacing)], min = _a[0], max = _a[1];
                        return [4 /*yield*/, mint(wallet.address, min, max, initializeLiquidityAmount)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    describe('#observe', function () {
        beforeEach(function () { return initializeAtZeroTick(pool); });
        // zero tick
        it('current tick accumulator increases by tick over time', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tickCumulative;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pool.observe([0])];
                    case 1:
                        tickCumulative = (_a.sent()).tickCumulatives[0];
                        (0, expect_1.expect)(tickCumulative).to.eq(0);
                        return [4 /*yield*/, pool.advanceTime(10)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, pool.observe([0])];
                    case 3:
                        (tickCumulative = (_a.sent()).tickCumulatives[0]);
                        (0, expect_1.expect)(tickCumulative).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('current tick accumulator after single swap', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tickCumulative;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // moves to tick -1
                    return [4 /*yield*/, swapExact0For1(1000, wallet.address)];
                    case 1:
                        // moves to tick -1
                        _a.sent();
                        return [4 /*yield*/, pool.advanceTime(4)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, pool.observe([0])];
                    case 3:
                        tickCumulative = (_a.sent()).tickCumulatives[0];
                        (0, expect_1.expect)(tickCumulative).to.eq(-4);
                        return [2 /*return*/];
                }
            });
        }); });
        it('current tick accumulator after two swaps', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b, tickCumulative;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(2), wallet.address)];
                    case 1:
                        _c.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, pool.slot0()];
                    case 2:
                        _a.apply(void 0, [(_c.sent()).tick]).to.eq(-4452);
                        return [4 /*yield*/, pool.advanceTime(4)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, swapExact1For0((0, utilities_1.expandTo18Decimals)(1).div(4), wallet.address)];
                    case 4:
                        _c.sent();
                        _b = expect_1.expect;
                        return [4 /*yield*/, pool.slot0()];
                    case 5:
                        _b.apply(void 0, [(_c.sent()).tick]).to.eq(-1558);
                        return [4 /*yield*/, pool.advanceTime(6)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, pool.observe([0])
                            // -4452*4 + -1558*6
                        ];
                    case 7:
                        tickCumulative = (_c.sent()).tickCumulatives[0];
                        // -4452*4 + -1558*6
                        (0, expect_1.expect)(tickCumulative).to.eq(-27156);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('miscellaneous mint tests', function () {
        beforeEach('initialize at zero tick', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createPool(utilities_1.FeeAmount.LOW, utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.LOW])];
                    case 1:
                        pool = _a.sent();
                        return [4 /*yield*/, initializeAtZeroTick(pool)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('mint to the right of the current price', function () { return __awaiter(void 0, void 0, void 0, function () {
            var liquidityDelta, lowerTick, upperTick, liquidityBefore, b0, b1, liquidityAfter, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        liquidityDelta = 1000;
                        lowerTick = tickSpacing;
                        upperTick = tickSpacing * 2;
                        return [4 /*yield*/, pool.liquidity()];
                    case 1:
                        liquidityBefore = _c.sent();
                        return [4 /*yield*/, token0.balanceOf(pool.address)];
                    case 2:
                        b0 = _c.sent();
                        return [4 /*yield*/, token1.balanceOf(pool.address)];
                    case 3:
                        b1 = _c.sent();
                        return [4 /*yield*/, mint(wallet.address, lowerTick, upperTick, liquidityDelta)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, pool.liquidity()];
                    case 5:
                        liquidityAfter = _c.sent();
                        (0, expect_1.expect)(liquidityAfter).to.be.gte(liquidityBefore);
                        _a = expect_1.expect;
                        return [4 /*yield*/, token0.balanceOf(pool.address)];
                    case 6:
                        _a.apply(void 0, [(_c.sent()).sub(b0)]).to.eq(1);
                        _b = expect_1.expect;
                        return [4 /*yield*/, token1.balanceOf(pool.address)];
                    case 7:
                        _b.apply(void 0, [(_c.sent()).sub(b1)]).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('mint to the left of the current price', function () { return __awaiter(void 0, void 0, void 0, function () {
            var liquidityDelta, lowerTick, upperTick, liquidityBefore, b0, b1, liquidityAfter, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        liquidityDelta = 1000;
                        lowerTick = -tickSpacing * 2;
                        upperTick = -tickSpacing;
                        return [4 /*yield*/, pool.liquidity()];
                    case 1:
                        liquidityBefore = _c.sent();
                        return [4 /*yield*/, token0.balanceOf(pool.address)];
                    case 2:
                        b0 = _c.sent();
                        return [4 /*yield*/, token1.balanceOf(pool.address)];
                    case 3:
                        b1 = _c.sent();
                        return [4 /*yield*/, mint(wallet.address, lowerTick, upperTick, liquidityDelta)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, pool.liquidity()];
                    case 5:
                        liquidityAfter = _c.sent();
                        (0, expect_1.expect)(liquidityAfter).to.be.gte(liquidityBefore);
                        _a = expect_1.expect;
                        return [4 /*yield*/, token0.balanceOf(pool.address)];
                    case 6:
                        _a.apply(void 0, [(_c.sent()).sub(b0)]).to.eq(0);
                        _b = expect_1.expect;
                        return [4 /*yield*/, token1.balanceOf(pool.address)];
                    case 7:
                        _b.apply(void 0, [(_c.sent()).sub(b1)]).to.eq(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('mint within the current price', function () { return __awaiter(void 0, void 0, void 0, function () {
            var liquidityDelta, lowerTick, upperTick, liquidityBefore, b0, b1, liquidityAfter, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        liquidityDelta = 1000;
                        lowerTick = -tickSpacing;
                        upperTick = tickSpacing;
                        return [4 /*yield*/, pool.liquidity()];
                    case 1:
                        liquidityBefore = _c.sent();
                        return [4 /*yield*/, token0.balanceOf(pool.address)];
                    case 2:
                        b0 = _c.sent();
                        return [4 /*yield*/, token1.balanceOf(pool.address)];
                    case 3:
                        b1 = _c.sent();
                        return [4 /*yield*/, mint(wallet.address, lowerTick, upperTick, liquidityDelta)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, pool.liquidity()];
                    case 5:
                        liquidityAfter = _c.sent();
                        (0, expect_1.expect)(liquidityAfter).to.be.gte(liquidityBefore);
                        _a = expect_1.expect;
                        return [4 /*yield*/, token0.balanceOf(pool.address)];
                    case 6:
                        _a.apply(void 0, [(_c.sent()).sub(b0)]).to.eq(1);
                        _b = expect_1.expect;
                        return [4 /*yield*/, token1.balanceOf(pool.address)];
                    case 7:
                        _b.apply(void 0, [(_c.sent()).sub(b1)]).to.eq(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('cannot remove more than the entire position', function () { return __awaiter(void 0, void 0, void 0, function () {
            var lowerTick, upperTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lowerTick = -tickSpacing;
                        upperTick = tickSpacing;
                        return [4 /*yield*/, mint(wallet.address, lowerTick, upperTick, (0, utilities_1.expandTo18Decimals)(1000))
                            // should be 'LS', hardhat is bugged
                        ];
                    case 1:
                        _a.sent();
                        // should be 'LS', hardhat is bugged
                        return [4 /*yield*/, (0, expect_1.expect)(pool.burn(lowerTick, upperTick, (0, utilities_1.expandTo18Decimals)(1001))).to.be.reverted];
                    case 2:
                        // should be 'LS', hardhat is bugged
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('collect fees within the current price after swap', function () { return __awaiter(void 0, void 0, void 0, function () {
            var liquidityDelta, lowerTick, upperTick, liquidityBefore, amount0In, liquidityAfter, token0BalanceBeforePool, token1BalanceBeforePool, token0BalanceBeforeWallet, token1BalanceBeforeWallet, _a, fees0, fees1, token0BalanceAfterWallet, token1BalanceAfterWallet, token0BalanceAfterPool, token1BalanceAfterPool;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        liquidityDelta = (0, utilities_1.expandTo18Decimals)(100);
                        lowerTick = -tickSpacing * 100;
                        upperTick = tickSpacing * 100;
                        return [4 /*yield*/, mint(wallet.address, lowerTick, upperTick, liquidityDelta)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, pool.liquidity()];
                    case 2:
                        liquidityBefore = _b.sent();
                        amount0In = (0, utilities_1.expandTo18Decimals)(1);
                        return [4 /*yield*/, swapExact0For1(amount0In, wallet.address)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, pool.liquidity()];
                    case 4:
                        liquidityAfter = _b.sent();
                        (0, expect_1.expect)(liquidityAfter, 'k increases').to.be.gte(liquidityBefore);
                        return [4 /*yield*/, token0.balanceOf(pool.address)];
                    case 5:
                        token0BalanceBeforePool = _b.sent();
                        return [4 /*yield*/, token1.balanceOf(pool.address)];
                    case 6:
                        token1BalanceBeforePool = _b.sent();
                        return [4 /*yield*/, token0.balanceOf(wallet.address)];
                    case 7:
                        token0BalanceBeforeWallet = _b.sent();
                        return [4 /*yield*/, token1.balanceOf(wallet.address)];
                    case 8:
                        token1BalanceBeforeWallet = _b.sent();
                        return [4 /*yield*/, pool.burn(lowerTick, upperTick, 0)];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, pool.collect(wallet.address, lowerTick, upperTick, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, pool.burn(lowerTick, upperTick, 0)];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, pool.callStatic.collect(wallet.address, lowerTick, upperTick, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                    case 12:
                        _a = _b.sent(), fees0 = _a.amount0, fees1 = _a.amount1;
                        (0, expect_1.expect)(fees0).to.be.eq(0);
                        (0, expect_1.expect)(fees1).to.be.eq(0);
                        return [4 /*yield*/, token0.balanceOf(wallet.address)];
                    case 13:
                        token0BalanceAfterWallet = _b.sent();
                        return [4 /*yield*/, token1.balanceOf(wallet.address)];
                    case 14:
                        token1BalanceAfterWallet = _b.sent();
                        return [4 /*yield*/, token0.balanceOf(pool.address)];
                    case 15:
                        token0BalanceAfterPool = _b.sent();
                        return [4 /*yield*/, token1.balanceOf(pool.address)];
                    case 16:
                        token1BalanceAfterPool = _b.sent();
                        (0, expect_1.expect)(token0BalanceAfterWallet).to.be.gt(token0BalanceBeforeWallet);
                        (0, expect_1.expect)(token1BalanceAfterWallet).to.be.eq(token1BalanceBeforeWallet);
                        (0, expect_1.expect)(token0BalanceAfterPool).to.be.lt(token0BalanceBeforePool);
                        (0, expect_1.expect)(token1BalanceAfterPool).to.be.eq(token1BalanceBeforePool);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('post-initialize at medium fee', function () {
        describe('k (implicit)', function () {
            it('returns 0 before initialization', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect_1.expect;
                            return [4 /*yield*/, pool.liquidity()];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('post initialized', function () {
                beforeEach(function () { return initializeAtZeroTick(pool); });
                it('returns initial liquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.liquidity()];
                            case 1:
                                _a.apply(void 0, [_b.sent()]).to.eq((0, utilities_1.expandTo18Decimals)(2));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('returns in supply in range', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, mint(wallet.address, -tickSpacing, tickSpacing, (0, utilities_1.expandTo18Decimals)(3))];
                            case 1:
                                _b.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.liquidity()];
                            case 2:
                                _a.apply(void 0, [_b.sent()]).to.eq((0, utilities_1.expandTo18Decimals)(5));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('excludes supply at tick above current tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, mint(wallet.address, tickSpacing, tickSpacing * 2, (0, utilities_1.expandTo18Decimals)(3))];
                            case 1:
                                _b.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.liquidity()];
                            case 2:
                                _a.apply(void 0, [_b.sent()]).to.eq((0, utilities_1.expandTo18Decimals)(2));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('excludes supply at tick below current tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, mint(wallet.address, -tickSpacing * 2, -tickSpacing, (0, utilities_1.expandTo18Decimals)(3))];
                            case 1:
                                _b.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.liquidity()];
                            case 2:
                                _a.apply(void 0, [_b.sent()]).to.eq((0, utilities_1.expandTo18Decimals)(2));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('updates correctly when exiting range', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var kBefore, liquidityDelta, lowerTick, upperTick, kAfter, tick, kAfterSwap;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.liquidity()];
                            case 1:
                                kBefore = _a.sent();
                                (0, expect_1.expect)(kBefore).to.be.eq((0, utilities_1.expandTo18Decimals)(2));
                                liquidityDelta = (0, utilities_1.expandTo18Decimals)(1);
                                lowerTick = 0;
                                upperTick = tickSpacing;
                                return [4 /*yield*/, mint(wallet.address, lowerTick, upperTick, liquidityDelta)
                                    // ensure virtual supply has increased appropriately
                                ];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, pool.liquidity()];
                            case 3:
                                kAfter = _a.sent();
                                (0, expect_1.expect)(kAfter).to.be.eq((0, utilities_1.expandTo18Decimals)(3));
                                // swap toward the left (just enough for the tick transition function to trigger)
                                return [4 /*yield*/, swapExact0For1(1, wallet.address)];
                            case 4:
                                // swap toward the left (just enough for the tick transition function to trigger)
                                _a.sent();
                                return [4 /*yield*/, pool.slot0()];
                            case 5:
                                tick = (_a.sent()).tick;
                                (0, expect_1.expect)(tick).to.be.eq(-1);
                                return [4 /*yield*/, pool.liquidity()];
                            case 6:
                                kAfterSwap = _a.sent();
                                (0, expect_1.expect)(kAfterSwap).to.be.eq((0, utilities_1.expandTo18Decimals)(2));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('updates correctly when entering range', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var kBefore, liquidityDelta, lowerTick, upperTick, kAfter, tick, kAfterSwap;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.liquidity()];
                            case 1:
                                kBefore = _a.sent();
                                (0, expect_1.expect)(kBefore).to.be.eq((0, utilities_1.expandTo18Decimals)(2));
                                liquidityDelta = (0, utilities_1.expandTo18Decimals)(1);
                                lowerTick = -tickSpacing;
                                upperTick = 0;
                                return [4 /*yield*/, mint(wallet.address, lowerTick, upperTick, liquidityDelta)
                                    // ensure virtual supply hasn't changed
                                ];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, pool.liquidity()];
                            case 3:
                                kAfter = _a.sent();
                                (0, expect_1.expect)(kAfter).to.be.eq(kBefore);
                                // swap toward the left (just enough for the tick transition function to trigger)
                                return [4 /*yield*/, swapExact0For1(1, wallet.address)];
                            case 4:
                                // swap toward the left (just enough for the tick transition function to trigger)
                                _a.sent();
                                return [4 /*yield*/, pool.slot0()];
                            case 5:
                                tick = (_a.sent()).tick;
                                (0, expect_1.expect)(tick).to.be.eq(-1);
                                return [4 /*yield*/, pool.liquidity()];
                            case 6:
                                kAfterSwap = _a.sent();
                                (0, expect_1.expect)(kAfterSwap).to.be.eq((0, utilities_1.expandTo18Decimals)(3));
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    });
    describe('limit orders', function () {
        beforeEach('initialize at tick 0', function () { return initializeAtZeroTick(pool); });
        it('limit selling 0 for 1 at tick 0 thru 1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, 0, 120, (0, utilities_1.expandTo18Decimals)(1)))
                            .to.emit(token0, 'Transfer')
                            .withArgs(wallet.address, pool.address, '5981737760509663')
                        // somebody takes the limit order
                    ];
                    case 1:
                        _b.sent();
                        // somebody takes the limit order
                        return [4 /*yield*/, swapExact1For0((0, utilities_1.expandTo18Decimals)(2), other.address)];
                    case 2:
                        // somebody takes the limit order
                        _b.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(pool.burn(0, 120, (0, utilities_1.expandTo18Decimals)(1)))
                                .to.emit(pool, 'Burn')
                                .withArgs(wallet.address, 0, 120, (0, utilities_1.expandTo18Decimals)(1), 0, '6017734268818165')
                                .to.not.emit(token0, 'Transfer')
                                .to.not.emit(token1, 'Transfer')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(pool.collect(wallet.address, 0, 120, utilities_1.MaxUint128, utilities_1.MaxUint128))
                                .to.emit(token1, 'Transfer')
                                .withArgs(pool.address, wallet.address, ethers_1.BigNumber.from('6017734268818165').add('18107525382602')) // roughly 0.3% despite other liquidity
                                .to.not.emit(token0, 'Transfer')];
                    case 4:
                        _b.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, pool.slot0()];
                    case 5:
                        _a.apply(void 0, [(_b.sent()).tick]).to.be.gte(120);
                        return [2 /*return*/];
                }
            });
        }); });
        it('limit selling 1 for 0 at tick 0 thru -1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, -120, 0, (0, utilities_1.expandTo18Decimals)(1)))
                            .to.emit(token1, 'Transfer')
                            .withArgs(wallet.address, pool.address, '5981737760509663')
                        // somebody takes the limit order
                    ];
                    case 1:
                        _b.sent();
                        // somebody takes the limit order
                        return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(2), other.address)];
                    case 2:
                        // somebody takes the limit order
                        _b.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(pool.burn(-120, 0, (0, utilities_1.expandTo18Decimals)(1)))
                                .to.emit(pool, 'Burn')
                                .withArgs(wallet.address, -120, 0, (0, utilities_1.expandTo18Decimals)(1), '6017734268818165', 0)
                                .to.not.emit(token0, 'Transfer')
                                .to.not.emit(token1, 'Transfer')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(pool.collect(wallet.address, -120, 0, utilities_1.MaxUint128, utilities_1.MaxUint128))
                                .to.emit(token0, 'Transfer')
                                .withArgs(pool.address, wallet.address, ethers_1.BigNumber.from('6017734268818165').add('18107525382602'))]; // roughly 0.3% despite other liquidity
                    case 4:
                        _b.sent(); // roughly 0.3% despite other liquidity
                        _a = expect_1.expect;
                        return [4 /*yield*/, pool.slot0()];
                    case 5:
                        _a.apply(void 0, [(_b.sent()).tick]).to.be.lt(-120);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('fee is on', function () {
            beforeEach(function () { return pool.setFeeProtocol(6, 6); });
            it('limit selling 0 for 1 at tick 0 thru 1', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, 0, 120, (0, utilities_1.expandTo18Decimals)(1)))
                                .to.emit(token0, 'Transfer')
                                .withArgs(wallet.address, pool.address, '5981737760509663')
                            // somebody takes the limit order
                        ];
                        case 1:
                            _b.sent();
                            // somebody takes the limit order
                            return [4 /*yield*/, swapExact1For0((0, utilities_1.expandTo18Decimals)(2), other.address)];
                        case 2:
                            // somebody takes the limit order
                            _b.sent();
                            return [4 /*yield*/, (0, expect_1.expect)(pool.burn(0, 120, (0, utilities_1.expandTo18Decimals)(1)))
                                    .to.emit(pool, 'Burn')
                                    .withArgs(wallet.address, 0, 120, (0, utilities_1.expandTo18Decimals)(1), 0, '6017734268818165')
                                    .to.not.emit(token0, 'Transfer')
                                    .to.not.emit(token1, 'Transfer')];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, (0, expect_1.expect)(pool.collect(wallet.address, 0, 120, utilities_1.MaxUint128, utilities_1.MaxUint128))
                                    .to.emit(token1, 'Transfer')
                                    .withArgs(pool.address, wallet.address, ethers_1.BigNumber.from('6017734268818165').add('15089604485501')) // roughly 0.25% despite other liquidity
                                    .to.not.emit(token0, 'Transfer')];
                        case 4:
                            _b.sent();
                            _a = expect_1.expect;
                            return [4 /*yield*/, pool.slot0()];
                        case 5:
                            _a.apply(void 0, [(_b.sent()).tick]).to.be.gte(120);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('limit selling 1 for 0 at tick 0 thru -1', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, -120, 0, (0, utilities_1.expandTo18Decimals)(1)))
                                .to.emit(token1, 'Transfer')
                                .withArgs(wallet.address, pool.address, '5981737760509663')
                            // somebody takes the limit order
                        ];
                        case 1:
                            _b.sent();
                            // somebody takes the limit order
                            return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(2), other.address)];
                        case 2:
                            // somebody takes the limit order
                            _b.sent();
                            return [4 /*yield*/, (0, expect_1.expect)(pool.burn(-120, 0, (0, utilities_1.expandTo18Decimals)(1)))
                                    .to.emit(pool, 'Burn')
                                    .withArgs(wallet.address, -120, 0, (0, utilities_1.expandTo18Decimals)(1), '6017734268818165', 0)
                                    .to.not.emit(token0, 'Transfer')
                                    .to.not.emit(token1, 'Transfer')];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, (0, expect_1.expect)(pool.collect(wallet.address, -120, 0, utilities_1.MaxUint128, utilities_1.MaxUint128))
                                    .to.emit(token0, 'Transfer')
                                    .withArgs(pool.address, wallet.address, ethers_1.BigNumber.from('6017734268818165').add('15089604485501'))]; // roughly 0.25% despite other liquidity
                        case 4:
                            _b.sent(); // roughly 0.25% despite other liquidity
                            _a = expect_1.expect;
                            return [4 /*yield*/, pool.slot0()];
                        case 5:
                            _a.apply(void 0, [(_b.sent()).tick]).to.be.lt(-120);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('#collect', function () {
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createPool(utilities_1.FeeAmount.LOW, utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.LOW])];
                    case 1:
                        pool = _a.sent();
                        return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('works with multiple LPs', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokensOwed0Position0, tokensOwed0Position1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mint(wallet.address, minTick, maxTick, (0, utilities_1.expandTo18Decimals)(1))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, (0, utilities_1.expandTo18Decimals)(2))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address)
                            // poke positions
                        ];
                    case 3:
                        _a.sent();
                        // poke positions
                        return [4 /*yield*/, pool.burn(minTick, maxTick, 0)];
                    case 4:
                        // poke positions
                        _a.sent();
                        return [4 /*yield*/, pool.burn(minTick + tickSpacing, maxTick - tickSpacing, 0)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, pool.positions((0, utilities_1.getPositionKey)(wallet.address, minTick, maxTick))];
                    case 6:
                        tokensOwed0Position0 = (_a.sent()).tokensOwed0;
                        return [4 /*yield*/, pool.positions((0, utilities_1.getPositionKey)(wallet.address, minTick + tickSpacing, maxTick - tickSpacing))];
                    case 7:
                        tokensOwed0Position1 = (_a.sent()).tokensOwed0;
                        (0, expect_1.expect)(tokensOwed0Position0).to.be.eq('166666666666667');
                        (0, expect_1.expect)(tokensOwed0Position1).to.be.eq('333333333333334');
                        return [2 /*return*/];
                }
            });
        }); });
        describe('works across large increases', function () {
            beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, mint(wallet.address, minTick, maxTick, (0, utilities_1.expandTo18Decimals)(1))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            // type(uint128).max * 2**128 / 1e18
            // https://www.wolframalpha.com/input/?i=%282**128+-+1%29+*+2**128+%2F+1e18
            var magicNumber = ethers_1.BigNumber.from('115792089237316195423570985008687907852929702298719625575994');
            it('works just before the cap binds', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, tokensOwed0, tokensOwed1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pool.setFeeGrowthGlobal0X128(magicNumber)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, pool.burn(minTick, maxTick, 0)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, pool.positions((0, utilities_1.getPositionKey)(wallet.address, minTick, maxTick))];
                        case 3:
                            _a = _b.sent(), tokensOwed0 = _a.tokensOwed0, tokensOwed1 = _a.tokensOwed1;
                            (0, expect_1.expect)(tokensOwed0).to.be.eq(utilities_1.MaxUint128.sub(1));
                            (0, expect_1.expect)(tokensOwed1).to.be.eq(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('works just after the cap binds', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, tokensOwed0, tokensOwed1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pool.setFeeGrowthGlobal0X128(magicNumber.add(1))];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, pool.burn(minTick, maxTick, 0)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, pool.positions((0, utilities_1.getPositionKey)(wallet.address, minTick, maxTick))];
                        case 3:
                            _a = _b.sent(), tokensOwed0 = _a.tokensOwed0, tokensOwed1 = _a.tokensOwed1;
                            (0, expect_1.expect)(tokensOwed0).to.be.eq(utilities_1.MaxUint128);
                            (0, expect_1.expect)(tokensOwed1).to.be.eq(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('works well after the cap binds', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, tokensOwed0, tokensOwed1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pool.setFeeGrowthGlobal0X128(ethers_1.constants.MaxUint256)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, pool.burn(minTick, maxTick, 0)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, pool.positions((0, utilities_1.getPositionKey)(wallet.address, minTick, maxTick))];
                        case 3:
                            _a = _b.sent(), tokensOwed0 = _a.tokensOwed0, tokensOwed1 = _a.tokensOwed1;
                            (0, expect_1.expect)(tokensOwed0).to.be.eq(utilities_1.MaxUint128);
                            (0, expect_1.expect)(tokensOwed1).to.be.eq(0);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('works across overflow boundaries', function () {
            beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pool.setFeeGrowthGlobal0X128(ethers_1.constants.MaxUint256)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, pool.setFeeGrowthGlobal1X128(ethers_1.constants.MaxUint256)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, mint(wallet.address, minTick, maxTick, (0, utilities_1.expandTo18Decimals)(10))];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('token0', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, amount0, amount1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, pool.burn(minTick, maxTick, 0)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, pool.callStatic.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                        case 3:
                            _a = _b.sent(), amount0 = _a.amount0, amount1 = _a.amount1;
                            (0, expect_1.expect)(amount0).to.be.eq('499999999999999');
                            (0, expect_1.expect)(amount1).to.be.eq(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('token1', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, amount0, amount1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, swapExact1For0((0, utilities_1.expandTo18Decimals)(1), wallet.address)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, pool.burn(minTick, maxTick, 0)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, pool.callStatic.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                        case 3:
                            _a = _b.sent(), amount0 = _a.amount0, amount1 = _a.amount1;
                            (0, expect_1.expect)(amount0).to.be.eq(0);
                            (0, expect_1.expect)(amount1).to.be.eq('499999999999999');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('token0 and token1', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, amount0, amount1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, swapExact1For0((0, utilities_1.expandTo18Decimals)(1), wallet.address)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, pool.burn(minTick, maxTick, 0)];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, pool.callStatic.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                        case 4:
                            _a = _b.sent(), amount0 = _a.amount0, amount1 = _a.amount1;
                            (0, expect_1.expect)(amount0).to.be.eq('499999999999999');
                            (0, expect_1.expect)(amount1).to.be.eq('500000000000000');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('#feeProtocol', function () {
        var liquidityAmount = (0, utilities_1.expandTo18Decimals)(1000);
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createPool(utilities_1.FeeAmount.LOW, utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.LOW])];
                    case 1:
                        pool = _a.sent();
                        return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, mint(wallet.address, minTick, maxTick, liquidityAmount)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('is initially set to 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, pool.slot0()];
                    case 1:
                        _a.apply(void 0, [(_b.sent()).feeProtocol]).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('can be changed by the owner', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pool.setFeeProtocol(6, 6)];
                    case 1:
                        _b.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, pool.slot0()];
                    case 2:
                        _a.apply(void 0, [(_b.sent()).feeProtocol]).to.eq(102);
                        return [2 /*return*/];
                }
            });
        }); });
        it('cannot be changed out of bounds', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(pool.setFeeProtocol(3, 3)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(pool.setFeeProtocol(11, 11)).to.be.reverted];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('cannot be changed by addresses that are not owner', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(pool.connect(other).setFeeProtocol(6, 6)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        function swapAndGetFeesOwed(_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var _c, fees0, fees1;
                var amount = _b.amount, zeroForOne = _b.zeroForOne, poke = _b.poke;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, (zeroForOne ? swapExact0For1(amount, wallet.address) : swapExact1For0(amount, wallet.address))];
                        case 1:
                            _d.sent();
                            if (!poke) return [3 /*break*/, 3];
                            return [4 /*yield*/, pool.burn(minTick, maxTick, 0)];
                        case 2:
                            _d.sent();
                            _d.label = 3;
                        case 3: return [4 /*yield*/, pool.callStatic.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                        case 4:
                            _c = _d.sent(), fees0 = _c.amount0, fees1 = _c.amount1;
                            (0, expect_1.expect)(fees0, 'fees owed in token0 are greater than 0').to.be.gte(0);
                            (0, expect_1.expect)(fees1, 'fees owed in token1 are greater than 0').to.be.gte(0);
                            return [2 /*return*/, { token0Fees: fees0, token1Fees: fees1 }];
                    }
                });
            });
        }
        it('position owner gets full fees when protocol fee is off', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0Fees, token1Fees;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, swapAndGetFeesOwed({
                            amount: (0, utilities_1.expandTo18Decimals)(1),
                            zeroForOne: true,
                            poke: true,
                        })
                        // 6 bips * 1e18
                    ];
                    case 1:
                        _a = _b.sent(), token0Fees = _a.token0Fees, token1Fees = _a.token1Fees;
                        // 6 bips * 1e18
                        (0, expect_1.expect)(token0Fees).to.eq('499999999999999');
                        (0, expect_1.expect)(token1Fees).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('swap fees accumulate as expected (0 for 1)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var token0Fees, token1Fees;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, swapAndGetFeesOwed({
                            amount: (0, utilities_1.expandTo18Decimals)(1),
                            zeroForOne: true,
                            poke: true,
                        })];
                    case 1:
                        (_a = _d.sent(), token0Fees = _a.token0Fees, token1Fees = _a.token1Fees);
                        (0, expect_1.expect)(token0Fees).to.eq('499999999999999');
                        (0, expect_1.expect)(token1Fees).to.eq(0);
                        return [4 /*yield*/, swapAndGetFeesOwed({
                                amount: (0, utilities_1.expandTo18Decimals)(1),
                                zeroForOne: true,
                                poke: true,
                            })];
                    case 2:
                        (_b = _d.sent(), token0Fees = _b.token0Fees, token1Fees = _b.token1Fees);
                        (0, expect_1.expect)(token0Fees).to.eq('999999999999998');
                        (0, expect_1.expect)(token1Fees).to.eq(0);
                        return [4 /*yield*/, swapAndGetFeesOwed({
                                amount: (0, utilities_1.expandTo18Decimals)(1),
                                zeroForOne: true,
                                poke: true,
                            })];
                    case 3:
                        (_c = _d.sent(), token0Fees = _c.token0Fees, token1Fees = _c.token1Fees);
                        (0, expect_1.expect)(token0Fees).to.eq('1499999999999997');
                        (0, expect_1.expect)(token1Fees).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('swap fees accumulate as expected (1 for 0)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var token0Fees, token1Fees;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, swapAndGetFeesOwed({
                            amount: (0, utilities_1.expandTo18Decimals)(1),
                            zeroForOne: false,
                            poke: true,
                        })];
                    case 1:
                        (_a = _d.sent(), token0Fees = _a.token0Fees, token1Fees = _a.token1Fees);
                        (0, expect_1.expect)(token0Fees).to.eq(0);
                        (0, expect_1.expect)(token1Fees).to.eq('499999999999999');
                        return [4 /*yield*/, swapAndGetFeesOwed({
                                amount: (0, utilities_1.expandTo18Decimals)(1),
                                zeroForOne: false,
                                poke: true,
                            })];
                    case 2:
                        (_b = _d.sent(), token0Fees = _b.token0Fees, token1Fees = _b.token1Fees);
                        (0, expect_1.expect)(token0Fees).to.eq(0);
                        (0, expect_1.expect)(token1Fees).to.eq('999999999999998');
                        return [4 /*yield*/, swapAndGetFeesOwed({
                                amount: (0, utilities_1.expandTo18Decimals)(1),
                                zeroForOne: false,
                                poke: true,
                            })];
                    case 3:
                        (_c = _d.sent(), token0Fees = _c.token0Fees, token1Fees = _c.token1Fees);
                        (0, expect_1.expect)(token0Fees).to.eq(0);
                        (0, expect_1.expect)(token1Fees).to.eq('1499999999999997');
                        return [2 /*return*/];
                }
            });
        }); });
        it('position owner gets partial fees when protocol fee is on', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0Fees, token1Fees;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pool.setFeeProtocol(6, 6)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, swapAndGetFeesOwed({
                                amount: (0, utilities_1.expandTo18Decimals)(1),
                                zeroForOne: true,
                                poke: true,
                            })];
                    case 2:
                        _a = _b.sent(), token0Fees = _a.token0Fees, token1Fees = _a.token1Fees;
                        (0, expect_1.expect)(token0Fees).to.be.eq('416666666666666');
                        (0, expect_1.expect)(token1Fees).to.be.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('#collectProtocol', function () {
            it('returns 0 if no fees', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, amount0, amount1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pool.setFeeProtocol(6, 6)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, pool.callStatic.collectProtocol(wallet.address, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                        case 2:
                            _a = _b.sent(), amount0 = _a.amount0, amount1 = _a.amount1;
                            (0, expect_1.expect)(amount0).to.be.eq(0);
                            (0, expect_1.expect)(amount1).to.be.eq(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('can collect fees', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pool.setFeeProtocol(6, 6)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, swapAndGetFeesOwed({
                                    amount: (0, utilities_1.expandTo18Decimals)(1),
                                    zeroForOne: true,
                                    poke: true,
                                })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, (0, expect_1.expect)(pool.collectProtocol(other.address, utilities_1.MaxUint128, utilities_1.MaxUint128))
                                    .to.emit(token0, 'Transfer')
                                    .withArgs(pool.address, other.address, '83333333333332')];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('fees collected can differ between token0 and token1', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pool.setFeeProtocol(8, 5)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, swapAndGetFeesOwed({
                                    amount: (0, utilities_1.expandTo18Decimals)(1),
                                    zeroForOne: true,
                                    poke: false,
                                })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, swapAndGetFeesOwed({
                                    amount: (0, utilities_1.expandTo18Decimals)(1),
                                    zeroForOne: false,
                                    poke: false,
                                })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, expect_1.expect)(pool.collectProtocol(other.address, utilities_1.MaxUint128, utilities_1.MaxUint128))
                                    .to.emit(token0, 'Transfer')
                                    // more token0 fees because it's 1/5th the swap fees
                                    .withArgs(pool.address, other.address, '62499999999999')
                                    .to.emit(token1, 'Transfer')
                                    // less token1 fees because it's 1/8th the swap fees
                                    .withArgs(pool.address, other.address, '99999999999998')];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it('fees collected by lp after two swaps should be double one swap', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0Fees, token1Fees;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, swapAndGetFeesOwed({
                            amount: (0, utilities_1.expandTo18Decimals)(1),
                            zeroForOne: true,
                            poke: true,
                        })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, swapAndGetFeesOwed({
                                amount: (0, utilities_1.expandTo18Decimals)(1),
                                zeroForOne: true,
                                poke: true,
                            })
                            // 6 bips * 2e18
                        ];
                    case 2:
                        _a = _b.sent(), token0Fees = _a.token0Fees, token1Fees = _a.token1Fees;
                        // 6 bips * 2e18
                        (0, expect_1.expect)(token0Fees).to.eq('999999999999998');
                        (0, expect_1.expect)(token1Fees).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('fees collected after two swaps with fee turned on in middle are fees from last swap (not confiscatory)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0Fees, token1Fees;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, swapAndGetFeesOwed({
                            amount: (0, utilities_1.expandTo18Decimals)(1),
                            zeroForOne: true,
                            poke: false,
                        })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, pool.setFeeProtocol(6, 6)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, swapAndGetFeesOwed({
                                amount: (0, utilities_1.expandTo18Decimals)(1),
                                zeroForOne: true,
                                poke: true,
                            })];
                    case 3:
                        _a = _b.sent(), token0Fees = _a.token0Fees, token1Fees = _a.token1Fees;
                        (0, expect_1.expect)(token0Fees).to.eq('916666666666666');
                        (0, expect_1.expect)(token1Fees).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('fees collected by lp after two swaps with intermediate withdrawal', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0Fees, token1Fees, _b, token0FeesNext, token1FeesNext, _c, token0ProtocolFees, token1ProtocolFees;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, pool.setFeeProtocol(6, 6)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, swapAndGetFeesOwed({
                                amount: (0, utilities_1.expandTo18Decimals)(1),
                                zeroForOne: true,
                                poke: true,
                            })];
                    case 2:
                        _a = _e.sent(), token0Fees = _a.token0Fees, token1Fees = _a.token1Fees;
                        (0, expect_1.expect)(token0Fees).to.eq('416666666666666');
                        (0, expect_1.expect)(token1Fees).to.eq(0);
                        // collect the fees
                        return [4 /*yield*/, pool.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                    case 3:
                        // collect the fees
                        _e.sent();
                        return [4 /*yield*/, swapAndGetFeesOwed({
                                amount: (0, utilities_1.expandTo18Decimals)(1),
                                zeroForOne: true,
                                poke: false,
                            })];
                    case 4:
                        _b = _e.sent(), token0FeesNext = _b.token0Fees, token1FeesNext = _b.token1Fees;
                        (0, expect_1.expect)(token0FeesNext).to.eq(0);
                        (0, expect_1.expect)(token1FeesNext).to.eq(0);
                        return [4 /*yield*/, pool.protocolFees()];
                    case 5:
                        _c = _e.sent(), token0ProtocolFees = _c.token0, token1ProtocolFees = _c.token1;
                        (0, expect_1.expect)(token0ProtocolFees).to.eq('166666666666666');
                        (0, expect_1.expect)(token1ProtocolFees).to.eq(0);
                        return [4 /*yield*/, pool.burn(minTick, maxTick, 0)]; // poke to update fees
                    case 6:
                        _e.sent(); // poke to update fees
                        return [4 /*yield*/, (0, expect_1.expect)(pool.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128))
                                .to.emit(token0, 'Transfer')
                                .withArgs(pool.address, wallet.address, '416666666666666')];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, pool.protocolFees()];
                    case 8:
                        (_d = _e.sent(), token0ProtocolFees = _d.token0, token1ProtocolFees = _d.token1);
                        (0, expect_1.expect)(token0ProtocolFees).to.eq('166666666666666');
                        (0, expect_1.expect)(token1ProtocolFees).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#tickSpacing', function () {
        describe('tickSpacing = 12', function () {
            beforeEach('deploy pool', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, createPool(utilities_1.FeeAmount.MEDIUM, 12)];
                        case 1:
                            pool = _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('post initialize', function () {
                beforeEach('initialize pool', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('mint can only be called for multiples of 12', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, -6, 0, 1)).to.be.reverted];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, expect_1.expect)(mint(wallet.address, 0, 6, 1)).to.be.reverted];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('mint can be called with multiples of 12', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, mint(wallet.address, 12, 24, 1)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, mint(wallet.address, -144, -120, 1)];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('swapping across gaps works in 1 for 0 direction', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var liquidityAmount, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                liquidityAmount = (0, utilities_1.expandTo18Decimals)(1).div(4);
                                return [4 /*yield*/, mint(wallet.address, 120000, 121200, liquidityAmount)];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, swapExact1For0((0, utilities_1.expandTo18Decimals)(1), wallet.address)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, (0, expect_1.expect)(pool.burn(120000, 121200, liquidityAmount))
                                        .to.emit(pool, 'Burn')
                                        .withArgs(wallet.address, 120000, 121200, liquidityAmount, '30027458295511', '996999999999999999')
                                        .to.not.emit(token0, 'Transfer')
                                        .to.not.emit(token1, 'Transfer')];
                            case 3:
                                _b.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 4:
                                _a.apply(void 0, [(_b.sent()).tick]).to.eq(120196);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('swapping across gaps works in 0 for 1 direction', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var liquidityAmount, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                liquidityAmount = (0, utilities_1.expandTo18Decimals)(1).div(4);
                                return [4 /*yield*/, mint(wallet.address, -121200, -120000, liquidityAmount)];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, (0, expect_1.expect)(pool.burn(-121200, -120000, liquidityAmount))
                                        .to.emit(pool, 'Burn')
                                        .withArgs(wallet.address, -121200, -120000, liquidityAmount, '996999999999999999', '30027458295511')
                                        .to.not.emit(token0, 'Transfer')
                                        .to.not.emit(token1, 'Transfer')];
                            case 3:
                                _b.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 4:
                                _a.apply(void 0, [(_b.sent()).tick]).to.eq(-120197);
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    });
    // https://github.com/Uniswap/uniswap-v3-core/issues/214
    it('tick transition cannot run twice if zero for one swap ends at fractional price just below tick', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sqrtTickMath, swapMath, p0, _a, _b, liquidity, _c, _d, _e, feeAmount_1, amountIn, amountOut, sqrtQ, _f, tick, sqrtPriceX96, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, createPool(utilities_1.FeeAmount.MEDIUM, 1)];
                case 1:
                    pool = _h.sent();
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TickMathTest')];
                case 2: return [4 /*yield*/, (_h.sent()).deploy()];
                case 3:
                    sqrtTickMath = (_h.sent());
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('SwapMathTest')];
                case 4: return [4 /*yield*/, (_h.sent()).deploy()];
                case 5:
                    swapMath = (_h.sent());
                    return [4 /*yield*/, sqrtTickMath.getSqrtRatioAtTick(-24081)];
                case 6:
                    p0 = (_h.sent()).add(1);
                    // initialize at a price of ~0.3 token1/token0
                    // meaning if you swap in 2 token0, you should end up getting 0 token1
                    return [4 /*yield*/, pool.initialize(p0)];
                case 7:
                    // initialize at a price of ~0.3 token1/token0
                    // meaning if you swap in 2 token0, you should end up getting 0 token1
                    _h.sent();
                    _a = expect_1.expect;
                    return [4 /*yield*/, pool.liquidity()];
                case 8:
                    _a.apply(void 0, [_h.sent(), 'current pool liquidity is 1']).to.eq(0);
                    _b = expect_1.expect;
                    return [4 /*yield*/, pool.slot0()];
                case 9:
                    _b.apply(void 0, [(_h.sent()).tick, 'pool tick is -24081']).to.eq(-24081);
                    liquidity = (0, utilities_1.expandTo18Decimals)(1000);
                    return [4 /*yield*/, mint(wallet.address, -24082, -24080, liquidity)];
                case 10:
                    _h.sent();
                    _c = expect_1.expect;
                    return [4 /*yield*/, pool.liquidity()];
                case 11:
                    _c.apply(void 0, [_h.sent(), 'current pool liquidity is now liquidity + 1']).to.eq(liquidity);
                    return [4 /*yield*/, mint(wallet.address, -24082, -24081, liquidity)];
                case 12:
                    _h.sent();
                    _d = expect_1.expect;
                    return [4 /*yield*/, pool.liquidity()];
                case 13:
                    _d.apply(void 0, [_h.sent(), 'current pool liquidity is still liquidity + 1']).to.eq(liquidity);
                    return [4 /*yield*/, swapMath.computeSwapStep(p0, p0.sub(1), liquidity, 3, utilities_1.FeeAmount.MEDIUM)];
                case 14:
                    _e = _h.sent(), feeAmount_1 = _e.feeAmount, amountIn = _e.amountIn, amountOut = _e.amountOut, sqrtQ = _e.sqrtQ;
                    (0, expect_1.expect)(sqrtQ, 'price moves').to.eq(p0.sub(1));
                    (0, expect_1.expect)(feeAmount_1, 'fee amount is 1').to.eq(1);
                    (0, expect_1.expect)(amountIn, 'amount in is 1').to.eq(1);
                    (0, expect_1.expect)(amountOut, 'zero amount out').to.eq(0);
                    // swap 2 amount in, should get 0 amount out
                    return [4 /*yield*/, (0, expect_1.expect)(swapExact0For1(3, wallet.address))
                            .to.emit(token0, 'Transfer')
                            .withArgs(wallet.address, pool.address, 3)
                            .to.not.emit(token1, 'Transfer')];
                case 15:
                    // swap 2 amount in, should get 0 amount out
                    _h.sent();
                    return [4 /*yield*/, pool.slot0()];
                case 16:
                    _f = _h.sent(), tick = _f.tick, sqrtPriceX96 = _f.sqrtPriceX96;
                    (0, expect_1.expect)(tick, 'pool is at the next tick').to.eq(-24082);
                    (0, expect_1.expect)(sqrtPriceX96, 'pool price is still on the p0 boundary').to.eq(p0.sub(1));
                    _g = expect_1.expect;
                    return [4 /*yield*/, pool.liquidity()];
                case 17:
                    _g.apply(void 0, [_h.sent(), 'pool has run tick transition and liquidity changed']).to.eq(liquidity.mul(2));
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#flash', function () {
        it('fails if not initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(100, 200, other.address)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(flash(100, 0, other.address)).to.be.reverted];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(flash(0, 200, other.address)).to.be.reverted];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if no liquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(flash(100, 200, other.address)).to.be.revertedWith('L')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(flash(100, 0, other.address)).to.be.revertedWith('L')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(flash(0, 200, other.address)).to.be.revertedWith('L')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('after liquidity added', function () {
            var balance0;
            var balance1;
            beforeEach('add some tokens', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, initializeAtZeroTick(pool)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, Promise.all([token0.balanceOf(pool.address), token1.balanceOf(pool.address)])];
                        case 2:
                            _a = _b.sent(), balance0 = _a[0], balance1 = _a[1];
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('fee off', function () {
                it('emits an event', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(1001, 2001, other.address))
                                    .to.emit(pool, 'Flash')
                                    .withArgs(swapTarget.address, other.address, 1001, 2001, 4, 7)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('transfers the amount0 to the recipient', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(100, 200, other.address))
                                    .to.emit(token0, 'Transfer')
                                    .withArgs(pool.address, other.address, 100)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('transfers the amount1 to the recipient', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(100, 200, other.address))
                                    .to.emit(token1, 'Transfer')
                                    .withArgs(pool.address, other.address, 200)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('can flash only token0', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(101, 0, other.address))
                                    .to.emit(token0, 'Transfer')
                                    .withArgs(pool.address, other.address, 101)
                                    .to.not.emit(token1, 'Transfer')];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('can flash only token1', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(0, 102, other.address))
                                    .to.emit(token1, 'Transfer')
                                    .withArgs(pool.address, other.address, 102)
                                    .to.not.emit(token0, 'Transfer')];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('can flash entire token balance', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(balance0, balance1, other.address))
                                    .to.emit(token0, 'Transfer')
                                    .withArgs(pool.address, other.address, balance0)
                                    .to.emit(token1, 'Transfer')
                                    .withArgs(pool.address, other.address, balance1)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('no-op if both amounts are 0', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(0, 0, other.address)).to.not.emit(token0, 'Transfer').to.not.emit(token1, 'Transfer')];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('fails if flash amount is greater than token balance', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(balance0.add(1), balance1, other.address)).to.be.reverted];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, expect_1.expect)(flash(balance0, balance1.add(1), other.address)).to.be.reverted];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('calls the flash callback on the sender with correct fee amounts', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(1001, 2002, other.address)).to.emit(swapTarget, 'FlashCallback').withArgs(4, 7)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('increases the fee growth by the expected amount', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, flash(1001, 2002, other.address)];
                            case 1:
                                _c.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.feeGrowthGlobal0X128()];
                            case 2:
                                _a.apply(void 0, [_c.sent()]).to.eq(ethers_1.BigNumber.from(4).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                                _b = expect_1.expect;
                                return [4 /*yield*/, pool.feeGrowthGlobal1X128()];
                            case 3:
                                _b.apply(void 0, [_c.sent()]).to.eq(ethers_1.BigNumber.from(7).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('fails if original balance not returned in either token', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(1000, 0, other.address, 999, 0)).to.be.reverted];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, expect_1.expect)(flash(0, 1000, other.address, 0, 999)).to.be.reverted];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('fails if underpays either token', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(1000, 0, other.address, 1002, 0)).to.be.reverted];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, expect_1.expect)(flash(0, 1000, other.address, 0, 1002)).to.be.reverted];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('allows donating token0', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(0, 0, ethers_1.constants.AddressZero, 567, 0))
                                    .to.emit(token0, 'Transfer')
                                    .withArgs(wallet.address, pool.address, 567)
                                    .to.not.emit(token1, 'Transfer')];
                            case 1:
                                _b.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.feeGrowthGlobal0X128()];
                            case 2:
                                _a.apply(void 0, [_b.sent()]).to.eq(ethers_1.BigNumber.from(567).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('allows donating token1', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(0, 0, ethers_1.constants.AddressZero, 0, 678))
                                    .to.emit(token1, 'Transfer')
                                    .withArgs(wallet.address, pool.address, 678)
                                    .to.not.emit(token0, 'Transfer')];
                            case 1:
                                _b.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.feeGrowthGlobal1X128()];
                            case 2:
                                _a.apply(void 0, [_b.sent()]).to.eq(ethers_1.BigNumber.from(678).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('allows donating token0 and token1 together', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(0, 0, ethers_1.constants.AddressZero, 789, 1234))
                                    .to.emit(token0, 'Transfer')
                                    .withArgs(wallet.address, pool.address, 789)
                                    .to.emit(token1, 'Transfer')
                                    .withArgs(wallet.address, pool.address, 1234)];
                            case 1:
                                _c.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.feeGrowthGlobal0X128()];
                            case 2:
                                _a.apply(void 0, [_c.sent()]).to.eq(ethers_1.BigNumber.from(789).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                                _b = expect_1.expect;
                                return [4 /*yield*/, pool.feeGrowthGlobal1X128()];
                            case 3:
                                _b.apply(void 0, [_c.sent()]).to.eq(ethers_1.BigNumber.from(1234).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('fee on', function () {
                beforeEach('turn protocol fee on', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.setFeeProtocol(6, 6)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('emits an event', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(1001, 2001, other.address))
                                    .to.emit(pool, 'Flash')
                                    .withArgs(swapTarget.address, other.address, 1001, 2001, 4, 7)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('increases the fee growth by the expected amount', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, token0ProtocolFees, token1ProtocolFees, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, flash(2002, 4004, other.address)];
                            case 1:
                                _d.sent();
                                return [4 /*yield*/, pool.protocolFees()];
                            case 2:
                                _a = _d.sent(), token0ProtocolFees = _a.token0, token1ProtocolFees = _a.token1;
                                (0, expect_1.expect)(token0ProtocolFees).to.eq(1);
                                (0, expect_1.expect)(token1ProtocolFees).to.eq(2);
                                _b = expect_1.expect;
                                return [4 /*yield*/, pool.feeGrowthGlobal0X128()];
                            case 3:
                                _b.apply(void 0, [_d.sent()]).to.eq(ethers_1.BigNumber.from(6).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                                _c = expect_1.expect;
                                return [4 /*yield*/, pool.feeGrowthGlobal1X128()];
                            case 4:
                                _c.apply(void 0, [_d.sent()]).to.eq(ethers_1.BigNumber.from(11).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('allows donating token0', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token0ProtocolFees, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(0, 0, ethers_1.constants.AddressZero, 567, 0))
                                    .to.emit(token0, 'Transfer')
                                    .withArgs(wallet.address, pool.address, 567)
                                    .to.not.emit(token1, 'Transfer')];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, pool.protocolFees()];
                            case 2:
                                token0ProtocolFees = (_b.sent()).token0;
                                (0, expect_1.expect)(token0ProtocolFees).to.eq(94);
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.feeGrowthGlobal0X128()];
                            case 3:
                                _a.apply(void 0, [_b.sent()]).to.eq(ethers_1.BigNumber.from(473).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('allows donating token1', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token1ProtocolFees, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(0, 0, ethers_1.constants.AddressZero, 0, 678))
                                    .to.emit(token1, 'Transfer')
                                    .withArgs(wallet.address, pool.address, 678)
                                    .to.not.emit(token0, 'Transfer')];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, pool.protocolFees()];
                            case 2:
                                token1ProtocolFees = (_b.sent()).token1;
                                (0, expect_1.expect)(token1ProtocolFees).to.eq(113);
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.feeGrowthGlobal1X128()];
                            case 3:
                                _a.apply(void 0, [_b.sent()]).to.eq(ethers_1.BigNumber.from(565).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('allows donating token0 and token1 together', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, token0ProtocolFees, token1ProtocolFees, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(flash(0, 0, ethers_1.constants.AddressZero, 789, 1234))
                                    .to.emit(token0, 'Transfer')
                                    .withArgs(wallet.address, pool.address, 789)
                                    .to.emit(token1, 'Transfer')
                                    .withArgs(wallet.address, pool.address, 1234)];
                            case 1:
                                _d.sent();
                                return [4 /*yield*/, pool.protocolFees()];
                            case 2:
                                _a = _d.sent(), token0ProtocolFees = _a.token0, token1ProtocolFees = _a.token1;
                                (0, expect_1.expect)(token0ProtocolFees).to.eq(131);
                                (0, expect_1.expect)(token1ProtocolFees).to.eq(205);
                                _b = expect_1.expect;
                                return [4 /*yield*/, pool.feeGrowthGlobal0X128()];
                            case 3:
                                _b.apply(void 0, [_d.sent()]).to.eq(ethers_1.BigNumber.from(658).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                                _c = expect_1.expect;
                                return [4 /*yield*/, pool.feeGrowthGlobal1X128()];
                            case 4:
                                _c.apply(void 0, [_d.sent()]).to.eq(ethers_1.BigNumber.from(1029).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    });
    describe('#increaseObservationCardinalityNext', function () {
        it('cannot be called before initialization', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(pool.increaseObservationCardinalityNext(2)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('after initialization', function () {
            beforeEach('initialize the pool', function () { return pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1)); });
            it('oracle starting state after initialization', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, observationCardinality, observationIndex, observationCardinalityNext, _b, secondsPerLiquidityCumulativeX128, tickCumulative, initialized, blockTimestamp;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, pool.slot0()];
                        case 1:
                            _a = _c.sent(), observationCardinality = _a.observationCardinality, observationIndex = _a.observationIndex, observationCardinalityNext = _a.observationCardinalityNext;
                            (0, expect_1.expect)(observationCardinality).to.eq(1);
                            (0, expect_1.expect)(observationIndex).to.eq(0);
                            (0, expect_1.expect)(observationCardinalityNext).to.eq(1);
                            return [4 /*yield*/, pool.observations(0)];
                        case 2:
                            _b = _c.sent(), secondsPerLiquidityCumulativeX128 = _b.secondsPerLiquidityCumulativeX128, tickCumulative = _b.tickCumulative, initialized = _b.initialized, blockTimestamp = _b.blockTimestamp;
                            (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(0);
                            (0, expect_1.expect)(tickCumulative).to.eq(0);
                            (0, expect_1.expect)(initialized).to.eq(true);
                            (0, expect_1.expect)(blockTimestamp).to.eq(fixtures_1.TEST_POOL_START_TIME);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('increases observation cardinality next', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, observationCardinality, observationIndex, observationCardinalityNext;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pool.increaseObservationCardinalityNext(2)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, pool.slot0()];
                        case 2:
                            _a = _b.sent(), observationCardinality = _a.observationCardinality, observationIndex = _a.observationIndex, observationCardinalityNext = _a.observationCardinalityNext;
                            (0, expect_1.expect)(observationCardinality).to.eq(1);
                            (0, expect_1.expect)(observationIndex).to.eq(0);
                            (0, expect_1.expect)(observationCardinalityNext).to.eq(2);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('is no op if target is already exceeded', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, observationCardinality, observationIndex, observationCardinalityNext;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pool.increaseObservationCardinalityNext(5)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, pool.increaseObservationCardinalityNext(3)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, pool.slot0()];
                        case 3:
                            _a = _b.sent(), observationCardinality = _a.observationCardinality, observationIndex = _a.observationIndex, observationCardinalityNext = _a.observationCardinalityNext;
                            (0, expect_1.expect)(observationCardinality).to.eq(1);
                            (0, expect_1.expect)(observationIndex).to.eq(0);
                            (0, expect_1.expect)(observationCardinalityNext).to.eq(5);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('#setFeeProtocol', function () {
        beforeEach('initialize the pool', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('can only be called by factory owner', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(pool.connect(other).setFeeProtocol(5, 5)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if fee is lt 4 or gt 10', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(pool.setFeeProtocol(3, 3)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(pool.setFeeProtocol(6, 3)).to.be.reverted];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(pool.setFeeProtocol(3, 6)).to.be.reverted];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(pool.setFeeProtocol(11, 11)).to.be.reverted];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(pool.setFeeProtocol(6, 11)).to.be.reverted];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(pool.setFeeProtocol(11, 6)).to.be.reverted];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds for fee of 4', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pool.setFeeProtocol(4, 4)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds for fee of 10', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pool.setFeeProtocol(10, 10)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('sets protocol fee', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pool.setFeeProtocol(7, 7)];
                    case 1:
                        _b.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, pool.slot0()];
                    case 2:
                        _a.apply(void 0, [(_b.sent()).feeProtocol]).to.eq(119);
                        return [2 /*return*/];
                }
            });
        }); });
        it('can change protocol fee', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pool.setFeeProtocol(7, 7)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, pool.setFeeProtocol(5, 8)];
                    case 2:
                        _b.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, pool.slot0()];
                    case 3:
                        _a.apply(void 0, [(_b.sent()).feeProtocol]).to.eq(133);
                        return [2 /*return*/];
                }
            });
        }); });
        it('can turn off protocol fee', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pool.setFeeProtocol(4, 4)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, pool.setFeeProtocol(0, 0)];
                    case 2:
                        _b.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, pool.slot0()];
                    case 3:
                        _a.apply(void 0, [(_b.sent()).feeProtocol]).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('emits an event when turned on', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(pool.setFeeProtocol(7, 7)).to.be.emit(pool, 'SetFeeProtocol').withArgs(0, 0, 7, 7)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('emits an event when turned off', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pool.setFeeProtocol(7, 5)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(pool.setFeeProtocol(0, 0)).to.be.emit(pool, 'SetFeeProtocol').withArgs(7, 5, 0, 0)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('emits an event when changed', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pool.setFeeProtocol(4, 10)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(pool.setFeeProtocol(6, 8)).to.be.emit(pool, 'SetFeeProtocol').withArgs(4, 10, 6, 8)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('emits an event when unchanged', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pool.setFeeProtocol(5, 9)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(pool.setFeeProtocol(5, 9)).to.be.emit(pool, 'SetFeeProtocol').withArgs(5, 9, 5, 9)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#lock', function () {
        beforeEach('initialize the pool', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, mint(wallet.address, minTick, maxTick, (0, utilities_1.expandTo18Decimals)(1))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('cannot reenter from swap callback', function () { return __awaiter(void 0, void 0, void 0, function () {
            var reentrant;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TestUniswapV3ReentrantCallee')];
                    case 1: return [4 /*yield*/, (_a.sent()).deploy()];
                    case 2:
                        reentrant = (_a.sent());
                        // the tests happen in solidity
                        return [4 /*yield*/, (0, expect_1.expect)(reentrant.swapToReenter(pool.address)).to.be.revertedWith('Unable to reenter')];
                    case 3:
                        // the tests happen in solidity
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#snapshotCumulativesInside', function () {
        var tickLower = -utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM];
        var tickUpper = utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM];
        var tickSpacing = utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM];
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, mint(wallet.address, tickLower, tickUpper, 10)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws if ticks are in reverse order', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(pool.snapshotCumulativesInside(tickUpper, tickLower)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws if ticks are the same', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(pool.snapshotCumulativesInside(tickUpper, tickUpper)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws if tick lower is too low', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(pool.snapshotCumulativesInside((0, utilities_1.getMinTick)(tickSpacing) - 1, tickUpper)).be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws if tick upper is too high', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(pool.snapshotCumulativesInside(tickLower, (0, utilities_1.getMaxTick)(tickSpacing) + 1)).be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws if tick lower is not initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(pool.snapshotCumulativesInside(tickLower - tickSpacing, tickUpper)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws if tick upper is not initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(pool.snapshotCumulativesInside(tickLower, tickUpper + tickSpacing)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('is zero immediately after initialize', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, secondsPerLiquidityInsideX128, tickCumulativeInside, secondsInside;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pool.snapshotCumulativesInside(tickLower, tickUpper)];
                    case 1:
                        _a = _b.sent(), secondsPerLiquidityInsideX128 = _a.secondsPerLiquidityInsideX128, tickCumulativeInside = _a.tickCumulativeInside, secondsInside = _a.secondsInside;
                        (0, expect_1.expect)(secondsPerLiquidityInsideX128).to.eq(0);
                        (0, expect_1.expect)(tickCumulativeInside).to.eq(0);
                        (0, expect_1.expect)(secondsInside).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('increases by expected amount when time elapses in the range', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, secondsPerLiquidityInsideX128, tickCumulativeInside, secondsInside;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pool.advanceTime(5)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, pool.snapshotCumulativesInside(tickLower, tickUpper)];
                    case 2:
                        _a = _b.sent(), secondsPerLiquidityInsideX128 = _a.secondsPerLiquidityInsideX128, tickCumulativeInside = _a.tickCumulativeInside, secondsInside = _a.secondsInside;
                        (0, expect_1.expect)(secondsPerLiquidityInsideX128).to.eq(ethers_1.BigNumber.from(5).shl(128).div(10));
                        (0, expect_1.expect)(tickCumulativeInside, 'tickCumulativeInside').to.eq(0);
                        (0, expect_1.expect)(secondsInside).to.eq(5);
                        return [2 /*return*/];
                }
            });
        }); });
        it('does not account for time increase above range', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, secondsPerLiquidityInsideX128, tickCumulativeInside, secondsInside;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pool.advanceTime(5)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, swapToHigherPrice((0, utilities_1.encodePriceSqrt)(2, 1), wallet.address)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, pool.advanceTime(7)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, pool.snapshotCumulativesInside(tickLower, tickUpper)];
                    case 4:
                        _a = _b.sent(), secondsPerLiquidityInsideX128 = _a.secondsPerLiquidityInsideX128, tickCumulativeInside = _a.tickCumulativeInside, secondsInside = _a.secondsInside;
                        (0, expect_1.expect)(secondsPerLiquidityInsideX128).to.eq(ethers_1.BigNumber.from(5).shl(128).div(10));
                        (0, expect_1.expect)(tickCumulativeInside, 'tickCumulativeInside').to.eq(0);
                        (0, expect_1.expect)(secondsInside).to.eq(5);
                        return [2 /*return*/];
                }
            });
        }); });
        it('does not account for time increase below range', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, secondsPerLiquidityInsideX128, tickCumulativeInside, secondsInside;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pool.advanceTime(5)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, swapToLowerPrice((0, utilities_1.encodePriceSqrt)(1, 2), wallet.address)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, pool.advanceTime(7)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, pool.snapshotCumulativesInside(tickLower, tickUpper)];
                    case 4:
                        _a = _b.sent(), secondsPerLiquidityInsideX128 = _a.secondsPerLiquidityInsideX128, tickCumulativeInside = _a.tickCumulativeInside, secondsInside = _a.secondsInside;
                        (0, expect_1.expect)(secondsPerLiquidityInsideX128).to.eq(ethers_1.BigNumber.from(5).shl(128).div(10));
                        // tick is 0 for 5 seconds, then not in range
                        (0, expect_1.expect)(tickCumulativeInside, 'tickCumulativeInside').to.eq(0);
                        (0, expect_1.expect)(secondsInside).to.eq(5);
                        return [2 /*return*/];
                }
            });
        }); });
        it('time increase below range is not counted', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, secondsPerLiquidityInsideX128, tickCumulativeInside, secondsInside;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, swapToLowerPrice((0, utilities_1.encodePriceSqrt)(1, 2), wallet.address)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, pool.advanceTime(5)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, swapToHigherPrice((0, utilities_1.encodePriceSqrt)(1, 1), wallet.address)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, pool.advanceTime(7)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, pool.snapshotCumulativesInside(tickLower, tickUpper)];
                    case 5:
                        _a = _b.sent(), secondsPerLiquidityInsideX128 = _a.secondsPerLiquidityInsideX128, tickCumulativeInside = _a.tickCumulativeInside, secondsInside = _a.secondsInside;
                        (0, expect_1.expect)(secondsPerLiquidityInsideX128).to.eq(ethers_1.BigNumber.from(7).shl(128).div(10));
                        // tick is not in range then tick is 0 for 7 seconds
                        (0, expect_1.expect)(tickCumulativeInside, 'tickCumulativeInside').to.eq(0);
                        (0, expect_1.expect)(secondsInside).to.eq(7);
                        return [2 /*return*/];
                }
            });
        }); });
        it('time increase above range is not counted', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, secondsPerLiquidityInsideX128, tickCumulativeInside, secondsInside, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, swapToHigherPrice((0, utilities_1.encodePriceSqrt)(2, 1), wallet.address)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, pool.advanceTime(5)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, swapToLowerPrice((0, utilities_1.encodePriceSqrt)(1, 1), wallet.address)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, pool.advanceTime(7)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, pool.snapshotCumulativesInside(tickLower, tickUpper)];
                    case 5:
                        _a = _c.sent(), secondsPerLiquidityInsideX128 = _a.secondsPerLiquidityInsideX128, tickCumulativeInside = _a.tickCumulativeInside, secondsInside = _a.secondsInside;
                        (0, expect_1.expect)(secondsPerLiquidityInsideX128).to.eq(ethers_1.BigNumber.from(7).shl(128).div(10));
                        _b = expect_1.expect;
                        return [4 /*yield*/, pool.slot0()];
                    case 6:
                        _b.apply(void 0, [(_c.sent()).tick]).to.eq(-1); // justify the -7 tick cumulative inside value
                        (0, expect_1.expect)(tickCumulativeInside, 'tickCumulativeInside').to.eq(-7);
                        (0, expect_1.expect)(secondsInside).to.eq(7);
                        return [2 /*return*/];
                }
            });
        }); });
        it('positions minted after time spent', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, secondsPerLiquidityInsideX128, tickCumulativeInside, secondsInside;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pool.advanceTime(5)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, mint(wallet.address, tickUpper, (0, utilities_1.getMaxTick)(tickSpacing), 15)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, swapToHigherPrice((0, utilities_1.encodePriceSqrt)(2, 1), wallet.address)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, pool.advanceTime(8)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, pool.snapshotCumulativesInside(tickUpper, (0, utilities_1.getMaxTick)(tickSpacing))];
                    case 5:
                        _a = _b.sent(), secondsPerLiquidityInsideX128 = _a.secondsPerLiquidityInsideX128, tickCumulativeInside = _a.tickCumulativeInside, secondsInside = _a.secondsInside;
                        (0, expect_1.expect)(secondsPerLiquidityInsideX128).to.eq(ethers_1.BigNumber.from(8).shl(128).div(15));
                        // the tick of 2/1 is 6931
                        // 8 seconds * 6931 = 55448
                        (0, expect_1.expect)(tickCumulativeInside, 'tickCumulativeInside').to.eq(55448);
                        (0, expect_1.expect)(secondsInside).to.eq(8);
                        return [2 /*return*/];
                }
            });
        }); });
        it('overlapping liquidity is aggregated', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, secondsPerLiquidityInsideX128, tickCumulativeInside, secondsInside;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, mint(wallet.address, tickLower, (0, utilities_1.getMaxTick)(tickSpacing), 15)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, pool.advanceTime(5)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, swapToHigherPrice((0, utilities_1.encodePriceSqrt)(2, 1), wallet.address)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, pool.advanceTime(8)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, pool.snapshotCumulativesInside(tickLower, tickUpper)];
                    case 5:
                        _a = _b.sent(), secondsPerLiquidityInsideX128 = _a.secondsPerLiquidityInsideX128, tickCumulativeInside = _a.tickCumulativeInside, secondsInside = _a.secondsInside;
                        (0, expect_1.expect)(secondsPerLiquidityInsideX128).to.eq(ethers_1.BigNumber.from(5).shl(128).div(25));
                        (0, expect_1.expect)(tickCumulativeInside, 'tickCumulativeInside').to.eq(0);
                        (0, expect_1.expect)(secondsInside).to.eq(5);
                        return [2 /*return*/];
                }
            });
        }); });
        it('relative behavior of snapshots', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, secondsPerLiquidityInsideX128Start, tickCumulativeInsideStart, secondsInsideStart, _b, secondsPerLiquidityInsideX128, tickCumulativeInside, secondsInside, expectedDiffSecondsPerLiquidity;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, pool.advanceTime(5)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, mint(wallet.address, (0, utilities_1.getMinTick)(tickSpacing), tickLower, 15)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, pool.snapshotCumulativesInside((0, utilities_1.getMinTick)(tickSpacing), tickLower)];
                    case 3:
                        _a = _c.sent(), secondsPerLiquidityInsideX128Start = _a.secondsPerLiquidityInsideX128, tickCumulativeInsideStart = _a.tickCumulativeInside, secondsInsideStart = _a.secondsInside;
                        return [4 /*yield*/, pool.advanceTime(8)
                            // 13 seconds in starting range, then 3 seconds in newly minted range
                        ];
                    case 4:
                        _c.sent();
                        // 13 seconds in starting range, then 3 seconds in newly minted range
                        return [4 /*yield*/, swapToLowerPrice((0, utilities_1.encodePriceSqrt)(1, 2), wallet.address)];
                    case 5:
                        // 13 seconds in starting range, then 3 seconds in newly minted range
                        _c.sent();
                        return [4 /*yield*/, pool.advanceTime(3)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, pool.snapshotCumulativesInside((0, utilities_1.getMinTick)(tickSpacing), tickLower)];
                    case 7:
                        _b = _c.sent(), secondsPerLiquidityInsideX128 = _b.secondsPerLiquidityInsideX128, tickCumulativeInside = _b.tickCumulativeInside, secondsInside = _b.secondsInside;
                        expectedDiffSecondsPerLiquidity = ethers_1.BigNumber.from(3).shl(128).div(15);
                        (0, expect_1.expect)(secondsPerLiquidityInsideX128.sub(secondsPerLiquidityInsideX128Start)).to.eq(expectedDiffSecondsPerLiquidity);
                        (0, expect_1.expect)(secondsPerLiquidityInsideX128).to.not.eq(expectedDiffSecondsPerLiquidity);
                        // the tick is the one corresponding to the price of 1/2, or log base 1.0001 of 0.5
                        // this is -6932, and 3 seconds have passed, so the cumulative computed from the diff equals 6932 * 3
                        (0, expect_1.expect)(tickCumulativeInside.sub(tickCumulativeInsideStart), 'tickCumulativeInside').to.eq(-20796);
                        (0, expect_1.expect)(secondsInside - secondsInsideStart).to.eq(3);
                        (0, expect_1.expect)(secondsInside).to.not.eq(3);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('fees overflow scenarios', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            it('up to max uint 128', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, feeGrowthGlobal0X128, feeGrowthGlobal1X128, _b, amount0, amount1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, mint(wallet.address, minTick, maxTick, 1)];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, flash(0, 0, wallet.address, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, Promise.all([
                                    pool.feeGrowthGlobal0X128(),
                                    pool.feeGrowthGlobal1X128(),
                                ])
                                // all 1s in first 128 bits
                            ];
                        case 4:
                            _a = _c.sent(), feeGrowthGlobal0X128 = _a[0], feeGrowthGlobal1X128 = _a[1];
                            // all 1s in first 128 bits
                            (0, expect_1.expect)(feeGrowthGlobal0X128).to.eq(utilities_1.MaxUint128.shl(128));
                            (0, expect_1.expect)(feeGrowthGlobal1X128).to.eq(utilities_1.MaxUint128.shl(128));
                            return [4 /*yield*/, pool.burn(minTick, maxTick, 0)];
                        case 5:
                            _c.sent();
                            return [4 /*yield*/, pool.callStatic.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                        case 6:
                            _b = _c.sent(), amount0 = _b.amount0, amount1 = _b.amount1;
                            (0, expect_1.expect)(amount0).to.eq(utilities_1.MaxUint128);
                            (0, expect_1.expect)(amount1).to.eq(utilities_1.MaxUint128);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('overflow max uint 128', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, feeGrowthGlobal0X128, feeGrowthGlobal1X128, _b, amount0, amount1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, mint(wallet.address, minTick, maxTick, 1)];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, flash(0, 0, wallet.address, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, flash(0, 0, wallet.address, 1, 1)];
                        case 4:
                            _c.sent();
                            return [4 /*yield*/, Promise.all([
                                    pool.feeGrowthGlobal0X128(),
                                    pool.feeGrowthGlobal1X128(),
                                ])
                                // all 1s in first 128 bits
                            ];
                        case 5:
                            _a = _c.sent(), feeGrowthGlobal0X128 = _a[0], feeGrowthGlobal1X128 = _a[1];
                            // all 1s in first 128 bits
                            (0, expect_1.expect)(feeGrowthGlobal0X128).to.eq(0);
                            (0, expect_1.expect)(feeGrowthGlobal1X128).to.eq(0);
                            return [4 /*yield*/, pool.burn(minTick, maxTick, 0)];
                        case 6:
                            _c.sent();
                            return [4 /*yield*/, pool.callStatic.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128)
                                // fees burned
                            ];
                        case 7:
                            _b = _c.sent(), amount0 = _b.amount0, amount1 = _b.amount1;
                            // fees burned
                            (0, expect_1.expect)(amount0).to.eq(0);
                            (0, expect_1.expect)(amount1).to.eq(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('overflow max uint 128 after poke burns fees owed to 0', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, amount0, amount1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, mint(wallet.address, minTick, maxTick, 1)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, flash(0, 0, wallet.address, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, pool.burn(minTick, maxTick, 0)];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, flash(0, 0, wallet.address, 1, 1)];
                        case 5:
                            _b.sent();
                            return [4 /*yield*/, pool.burn(minTick, maxTick, 0)];
                        case 6:
                            _b.sent();
                            return [4 /*yield*/, pool.callStatic.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128)
                                // fees burned
                            ];
                        case 7:
                            _a = _b.sent(), amount0 = _a.amount0, amount1 = _a.amount1;
                            // fees burned
                            (0, expect_1.expect)(amount0).to.eq(0);
                            (0, expect_1.expect)(amount1).to.eq(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('two positions at the same snapshot', function () { return __awaiter(void 0, void 0, void 0, function () {
                var feeGrowthGlobal0X128, amount0;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, mint(wallet.address, minTick, maxTick, 1)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, mint(other.address, minTick, maxTick, 1)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, flash(0, 0, wallet.address, utilities_1.MaxUint128, 0)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, flash(0, 0, wallet.address, utilities_1.MaxUint128, 0)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, pool.feeGrowthGlobal0X128()];
                        case 6:
                            feeGrowthGlobal0X128 = _a.sent();
                            (0, expect_1.expect)(feeGrowthGlobal0X128).to.eq(utilities_1.MaxUint128.shl(128));
                            return [4 /*yield*/, flash(0, 0, wallet.address, 2, 0)];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, pool.burn(minTick, maxTick, 0)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, pool.connect(other).burn(minTick, maxTick, 0)];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, pool.callStatic.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                        case 10:
                            amount0 = (_a.sent()).amount0;
                            (0, expect_1.expect)(amount0, 'amount0 of wallet').to.eq(0);
                            return [4 /*yield*/, pool
                                    .connect(other)
                                    .callStatic.collect(other.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                        case 11:
                            (amount0 = (_a.sent()).amount0);
                            (0, expect_1.expect)(amount0, 'amount0 of other').to.eq(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('two positions 1 wei of fees apart overflows exactly once', function () { return __awaiter(void 0, void 0, void 0, function () {
                var feeGrowthGlobal0X128, amount0;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, mint(wallet.address, minTick, maxTick, 1)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, flash(0, 0, wallet.address, 1, 0)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, mint(other.address, minTick, maxTick, 1)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, flash(0, 0, wallet.address, utilities_1.MaxUint128, 0)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, flash(0, 0, wallet.address, utilities_1.MaxUint128, 0)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, pool.feeGrowthGlobal0X128()];
                        case 7:
                            feeGrowthGlobal0X128 = _a.sent();
                            (0, expect_1.expect)(feeGrowthGlobal0X128).to.eq(0);
                            return [4 /*yield*/, flash(0, 0, wallet.address, 2, 0)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, pool.burn(minTick, maxTick, 0)];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, pool.connect(other).burn(minTick, maxTick, 0)];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, pool.callStatic.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                        case 11:
                            amount0 = (_a.sent()).amount0;
                            (0, expect_1.expect)(amount0, 'amount0 of wallet').to.eq(1);
                            return [4 /*yield*/, pool
                                    .connect(other)
                                    .callStatic.collect(other.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                        case 12:
                            (amount0 = (_a.sent()).amount0);
                            (0, expect_1.expect)(amount0, 'amount0 of other').to.eq(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
    describe('swap underpayment tests', function () {
        var underpay;
        beforeEach('deploy swap test', function () { return __awaiter(void 0, void 0, void 0, function () {
            var underpayFactory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TestUniswapV3SwapPay')];
                    case 1:
                        underpayFactory = _a.sent();
                        return [4 /*yield*/, underpayFactory.deploy()];
                    case 2:
                        underpay = (_a.sent());
                        return [4 /*yield*/, token0.approve(underpay.address, ethers_1.constants.MaxUint256)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, token1.approve(underpay.address, ethers_1.constants.MaxUint256)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, mint(wallet.address, minTick, maxTick, (0, utilities_1.expandTo18Decimals)(1))];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('underpay zero for one and exact in', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, true, utilities_1.MIN_SQRT_RATIO.add(1), 1000, 1, 0)).to.be.revertedWith('IIA')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('pay in the wrong token zero for one and exact in', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, true, utilities_1.MIN_SQRT_RATIO.add(1), 1000, 0, 2000)).to.be.revertedWith('IIA')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('overpay zero for one and exact in', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, true, utilities_1.MIN_SQRT_RATIO.add(1), 1000, 2000, 0)).to.not.be.revertedWith('IIA')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('underpay zero for one and exact out', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, true, utilities_1.MIN_SQRT_RATIO.add(1), -1000, 1, 0)).to.be.revertedWith('IIA')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('pay in the wrong token zero for one and exact out', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, true, utilities_1.MIN_SQRT_RATIO.add(1), -1000, 0, 2000)).to.be.revertedWith('IIA')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('overpay zero for one and exact out', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, true, utilities_1.MIN_SQRT_RATIO.add(1), -1000, 2000, 0)).to.not.be.revertedWith('IIA')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('underpay one for zero and exact in', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, false, utilities_1.MAX_SQRT_RATIO.sub(1), 1000, 0, 1)).to.be.revertedWith('IIA')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('pay in the wrong token one for zero and exact in', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, false, utilities_1.MAX_SQRT_RATIO.sub(1), 1000, 2000, 0)).to.be.revertedWith('IIA')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('overpay one for zero and exact in', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, false, utilities_1.MAX_SQRT_RATIO.sub(1), 1000, 0, 2000)).to.not.be.revertedWith('IIA')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('underpay one for zero and exact out', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, false, utilities_1.MAX_SQRT_RATIO.sub(1), -1000, 0, 1)).to.be.revertedWith('IIA')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('pay in the wrong token one for zero and exact out', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, false, utilities_1.MAX_SQRT_RATIO.sub(1), -1000, 2000, 0)).to.be.revertedWith('IIA')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('overpay one for zero and exact out', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, false, utilities_1.MAX_SQRT_RATIO.sub(1), -1000, 0, 2000)).to.not.be.revertedWith('IIA')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
