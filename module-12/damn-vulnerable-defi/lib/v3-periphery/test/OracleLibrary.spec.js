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
var expandTo18Decimals_1 = require("./shared/expandTo18Decimals");
var snapshotGasCost_1 = require("./shared/snapshotGasCost");
describe('OracleLibrary', function () {
    var loadFixture;
    var tokens;
    var oracle;
    var BN0 = ethers_1.BigNumber.from(0);
    var oracleTestFixture = function () { return __awaiter(void 0, void 0, void 0, function () {
        var tokenFactory, tokens, _a, oracleFactory, oracle;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TestERC20')];
                case 1:
                    tokenFactory = _b.sent();
                    return [4 /*yield*/, tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))];
                case 2:
                    _a = [
                        (_b.sent())
                    ];
                    return [4 /*yield*/, tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))];
                case 3:
                    _a = _a.concat([
                        (_b.sent())
                    ]);
                    return [4 /*yield*/, tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))];
                case 4:
                    tokens = _a.concat([
                        (_b.sent())
                    ]);
                    tokens.sort(function (a, b) { return (a.address.toLowerCase() < b.address.toLowerCase() ? -1 : 1); });
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('OracleTest')];
                case 5:
                    oracleFactory = _b.sent();
                    return [4 /*yield*/, oracleFactory.deploy()];
                case 6:
                    oracle = _b.sent();
                    return [2 /*return*/, {
                            tokens: tokens,
                            oracle: oracle,
                        }];
            }
        });
    }); };
    before('create fixture loader', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = hardhat_1.waffle).createFixtureLoader;
                    return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    loadFixture = _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach('deploy fixture', function () { return __awaiter(void 0, void 0, void 0, function () {
        var fixtures;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadFixture(oracleTestFixture)];
                case 1:
                    fixtures = _a.sent();
                    tokens = fixtures['tokens'];
                    oracle = fixtures['oracle'];
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#consult', function () {
        var mockObservableFactory;
        before('create mockObservableFactory', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('MockObservable')];
                    case 1:
                        mockObservableFactory = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('reverts when period is 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(oracle.consult(oracle.address, 0)).to.be.revertedWith('BP')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('correct output when tick is 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var period, secondsPerLiqCumulatives, mockObservable, _a, arithmeticMeanTick, harmonicMeanLiquidity;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        period = 3;
                        secondsPerLiqCumulatives = [10, 20];
                        return [4 /*yield*/, observableWith({
                                period: period,
                                tickCumulatives: [12, 12],
                                secondsPerLiqCumulatives: secondsPerLiqCumulatives,
                            })];
                    case 1:
                        mockObservable = _b.sent();
                        return [4 /*yield*/, oracle.consult(mockObservable.address, period)];
                    case 2:
                        _a = _b.sent(), arithmeticMeanTick = _a.arithmeticMeanTick, harmonicMeanLiquidity = _a.harmonicMeanLiquidity;
                        (0, chai_1.expect)(arithmeticMeanTick).to.equal(0);
                        (0, chai_1.expect)(harmonicMeanLiquidity).to.equal(calculateHarmonicAvgLiq(period, secondsPerLiqCumulatives));
                        return [2 /*return*/];
                }
            });
        }); });
        it('correct rounding for .5 negative tick', function () { return __awaiter(void 0, void 0, void 0, function () {
            var period, secondsPerLiqCumulatives, mockObservable, _a, arithmeticMeanTick, harmonicMeanLiquidity;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        period = 4;
                        secondsPerLiqCumulatives = [10, 15];
                        return [4 /*yield*/, observableWith({
                                period: period,
                                tickCumulatives: [-10, -12],
                                secondsPerLiqCumulatives: secondsPerLiqCumulatives,
                            })];
                    case 1:
                        mockObservable = _b.sent();
                        return [4 /*yield*/, oracle.consult(mockObservable.address, period)
                            // Always round to negative infinity
                            // In this case, we need to subtract one because integer division rounds to 0
                        ];
                    case 2:
                        _a = _b.sent(), arithmeticMeanTick = _a.arithmeticMeanTick, harmonicMeanLiquidity = _a.harmonicMeanLiquidity;
                        // Always round to negative infinity
                        // In this case, we need to subtract one because integer division rounds to 0
                        (0, chai_1.expect)(arithmeticMeanTick).to.equal(-1);
                        (0, chai_1.expect)(harmonicMeanLiquidity).to.equal(calculateHarmonicAvgLiq(period, secondsPerLiqCumulatives));
                        return [2 /*return*/];
                }
            });
        }); });
        it('correct output for liquidity overflow', function () { return __awaiter(void 0, void 0, void 0, function () {
            var period, secondsPerLiqCumulatives, mockObservable, _a, arithmeticMeanTick, harmonicMeanLiquidity;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        period = 1;
                        secondsPerLiqCumulatives = [10, 11];
                        return [4 /*yield*/, observableWith({
                                period: period,
                                tickCumulatives: [12, 12],
                                secondsPerLiqCumulatives: secondsPerLiqCumulatives,
                            })];
                    case 1:
                        mockObservable = _b.sent();
                        return [4 /*yield*/, oracle.consult(mockObservable.address, period)];
                    case 2:
                        _a = _b.sent(), arithmeticMeanTick = _a.arithmeticMeanTick, harmonicMeanLiquidity = _a.harmonicMeanLiquidity;
                        (0, chai_1.expect)(arithmeticMeanTick).to.equal(0);
                        // Make sure liquidity doesn't overflow uint128
                        (0, chai_1.expect)(harmonicMeanLiquidity).to.equal(ethers_1.BigNumber.from(2).pow(128).sub(1));
                        return [2 /*return*/];
                }
            });
        }); });
        function calculateHarmonicAvgLiq(period, secondsPerLiqCumulatives) {
            var _a = secondsPerLiqCumulatives.map(ethers_1.BigNumber.from), secondsPerLiq0 = _a[0], secondsPerLiq1 = _a[1];
            var delta = secondsPerLiq1.sub(secondsPerLiq0);
            var maxUint160 = ethers_1.BigNumber.from(2).pow(160).sub(1);
            return maxUint160.mul(period).div(delta.shl(32));
        }
        function observableWith(_a) {
            var period = _a.period, tickCumulatives = _a.tickCumulatives, secondsPerLiqCumulatives = _a.secondsPerLiqCumulatives;
            return mockObservableFactory.deploy([period, 0], tickCumulatives.map(ethers_1.BigNumber.from), secondsPerLiqCumulatives.map(ethers_1.BigNumber.from));
        }
    });
    describe('#getQuoteAtTick', function () {
        // sanity check
        it('token0: returns correct value when tick = 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var quoteAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, oracle.getQuoteAtTick(BN0, (0, expandTo18Decimals_1.expandTo18Decimals)(1), tokens[0].address, tokens[1].address)];
                    case 1:
                        quoteAmount = _a.sent();
                        (0, chai_1.expect)(quoteAmount).to.equal((0, expandTo18Decimals_1.expandTo18Decimals)(1));
                        return [2 /*return*/];
                }
            });
        }); });
        // sanity check
        it('token1: returns correct value when tick = 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var quoteAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, oracle.getQuoteAtTick(BN0, (0, expandTo18Decimals_1.expandTo18Decimals)(1), tokens[1].address, tokens[0].address)];
                    case 1:
                        quoteAmount = _a.sent();
                        (0, chai_1.expect)(quoteAmount).to.equal((0, expandTo18Decimals_1.expandTo18Decimals)(1));
                        return [2 /*return*/];
                }
            });
        }); });
        it('token0: returns correct value when at min tick | 0 < sqrtRatioX96 <= type(uint128).max', function () { return __awaiter(void 0, void 0, void 0, function () {
            var quoteAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, oracle.getQuoteAtTick(ethers_1.BigNumber.from(-887272), ethers_1.BigNumber.from(2).pow(128).sub(1), tokens[0].address, tokens[1].address)];
                    case 1:
                        quoteAmount = _a.sent();
                        (0, chai_1.expect)(quoteAmount).to.equal(ethers_1.BigNumber.from('1'));
                        return [2 /*return*/];
                }
            });
        }); });
        it('token1: returns correct value when at min tick | 0 < sqrtRatioX96 <= type(uint128).max', function () { return __awaiter(void 0, void 0, void 0, function () {
            var quoteAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, oracle.getQuoteAtTick(ethers_1.BigNumber.from(-887272), ethers_1.BigNumber.from(2).pow(128).sub(1), tokens[1].address, tokens[0].address)];
                    case 1:
                        quoteAmount = _a.sent();
                        (0, chai_1.expect)(quoteAmount).to.equal(ethers_1.BigNumber.from('115783384738768196242144082653949453838306988932806144552194799290216044976282'));
                        return [2 /*return*/];
                }
            });
        }); });
        it('token0: returns correct value when at max tick | sqrtRatioX96 > type(uint128).max', function () { return __awaiter(void 0, void 0, void 0, function () {
            var quoteAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, oracle.getQuoteAtTick(ethers_1.BigNumber.from(887272), ethers_1.BigNumber.from(2).pow(128).sub(1), tokens[0].address, tokens[1].address)];
                    case 1:
                        quoteAmount = _a.sent();
                        (0, chai_1.expect)(quoteAmount).to.equal(ethers_1.BigNumber.from('115783384785599357996676985412062652720342362943929506828539444553934033845703'));
                        return [2 /*return*/];
                }
            });
        }); });
        it('token1: returns correct value when at max tick | sqrtRatioX96 > type(uint128).max', function () { return __awaiter(void 0, void 0, void 0, function () {
            var quoteAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, oracle.getQuoteAtTick(ethers_1.BigNumber.from(887272), ethers_1.BigNumber.from(2).pow(128).sub(1), tokens[1].address, tokens[0].address)];
                    case 1:
                        quoteAmount = _a.sent();
                        (0, chai_1.expect)(quoteAmount).to.equal(ethers_1.BigNumber.from('1'));
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas test', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(oracle.getGasCostOfGetQuoteAtTick(ethers_1.BigNumber.from(10), (0, expandTo18Decimals_1.expandTo18Decimals)(1), tokens[0].address, tokens[1].address))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#getOldestObservationSecondsAgo', function () {
        var mockObservationsFactory;
        // some empty tick values as this function does not use them
        var emptySPL = [0, 0, 0, 0];
        var emptyTickCumulatives = [0, 0, 0, 0];
        var emptyTick = 0;
        var emptyLiquidity = 0;
        // helper function to run each test case identically
        var runOldestObservationsTest = function (blockTimestamps, initializeds, observationCardinality, observationIndex) { return __awaiter(void 0, void 0, void 0, function () {
            var mockObservations, result, secondsAgo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mockObservationsFactory.deploy(blockTimestamps, emptyTickCumulatives, emptySPL, initializeds, emptyTick, observationCardinality, observationIndex, false, emptyLiquidity)];
                    case 1:
                        mockObservations = _a.sent();
                        return [4 /*yield*/, oracle.getOldestObservationSecondsAgo(mockObservations.address)
                            //calculate seconds ago
                        ];
                    case 2:
                        result = _a.sent();
                        if (initializeds[(observationIndex + 1) % observationCardinality]) {
                            secondsAgo = result['currentTimestamp'] - blockTimestamps[(observationIndex + 1) % observationCardinality];
                        }
                        else {
                            secondsAgo = result['currentTimestamp'] - blockTimestamps[0];
                        }
                        if (secondsAgo < 0) {
                            secondsAgo += Math.pow(2, 32);
                        }
                        (0, chai_1.expect)(result['secondsAgo']).to.equal(secondsAgo);
                        return [2 /*return*/];
                }
            });
        }); };
        before('create mockObservationsFactory', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('MockObservations')];
                    case 1:
                        mockObservationsFactory = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fetches the oldest timestamp from the slot after observationIndex', function () { return __awaiter(void 0, void 0, void 0, function () {
            var blockTimestamps, initializeds, observationCardinality, observationIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blockTimestamps = [2, 3, 1, 0];
                        initializeds = [true, true, true, false];
                        observationCardinality = 3;
                        observationIndex = 1;
                        // run test
                        return [4 /*yield*/, runOldestObservationsTest(blockTimestamps, initializeds, observationCardinality, observationIndex)];
                    case 1:
                        // run test
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('loops to fetches the oldest timestamp from index 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var blockTimestamps, initializeds, observationCardinality, observationIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blockTimestamps = [1, 2, 3, 0];
                        initializeds = [true, true, true, false];
                        observationCardinality = 3;
                        observationIndex = 2;
                        // run test
                        return [4 /*yield*/, runOldestObservationsTest(blockTimestamps, initializeds, observationCardinality, observationIndex)];
                    case 1:
                        // run test
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fetches from index 0 if the next index is uninitialized', function () { return __awaiter(void 0, void 0, void 0, function () {
            var blockTimestamps, initializeds, observationCardinality, observationIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blockTimestamps = [1, 2, 0, 0];
                        initializeds = [true, true, false, false];
                        observationCardinality = 4;
                        observationIndex = 1;
                        // run test
                        return [4 /*yield*/, runOldestObservationsTest(blockTimestamps, initializeds, observationCardinality, observationIndex)];
                    case 1:
                        // run test
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('reverts if the pool is not initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
            var blockTimestamps, initializeds, observationCardinality, observationIndex, mockObservations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blockTimestamps = [0, 0, 0, 0];
                        initializeds = [false, false, false, false];
                        observationCardinality = 0;
                        observationIndex = 0;
                        return [4 /*yield*/, mockObservationsFactory.deploy(blockTimestamps, emptyTickCumulatives, emptySPL, initializeds, emptyTick, observationCardinality, observationIndex, false, emptyLiquidity)];
                    case 1:
                        mockObservations = _a.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(oracle.getOldestObservationSecondsAgo(mockObservations.address)).to.be.revertedWith('NI')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fetches the correct timestamp when the timestamps overflow', function () { return __awaiter(void 0, void 0, void 0, function () {
            var maxUint32, blockTimestamps, initializeds, observationCardinality, observationIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        maxUint32 = Math.pow(2, 32) - 1;
                        blockTimestamps = [maxUint32, 3, maxUint32 - 2, 0];
                        initializeds = [true, true, true, false];
                        observationCardinality = 3;
                        observationIndex = 1;
                        // run test
                        return [4 /*yield*/, runOldestObservationsTest(blockTimestamps, initializeds, observationCardinality, observationIndex)];
                    case 1:
                        // run test
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#getBlockStartingTickAndLiquidity', function () {
        var mockObservationsFactory;
        var mockObservations;
        var blockTimestamps;
        var tickCumulatives;
        var liquidityValues;
        var initializeds;
        var slot0Tick;
        var observationCardinality;
        var observationIndex;
        var lastObservationCurrentTimestamp;
        var liquidity;
        before('create mockObservationsFactory', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('MockObservations')];
                    case 1:
                        mockObservationsFactory = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        var deployMockObservationsContract = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mockObservationsFactory.deploy(blockTimestamps, tickCumulatives, liquidityValues, initializeds, slot0Tick, observationCardinality, observationIndex, lastObservationCurrentTimestamp, liquidity)];
                    case 1:
                        mockObservations = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        it('reverts if the pool is not initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blockTimestamps = [0, 0, 0, 0];
                        tickCumulatives = [0, 0, 0, 0];
                        liquidityValues = [BN0, BN0, BN0, BN0];
                        initializeds = [false, false, false, false];
                        slot0Tick = 0;
                        observationCardinality = 0;
                        observationIndex = 0;
                        lastObservationCurrentTimestamp = false;
                        liquidity = 0;
                        return [4 /*yield*/, deployMockObservationsContract()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(oracle.getBlockStartingTickAndLiquidity(mockObservations.address)).to.be.revertedWith('NEO')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the tick and liquidity in storage if the latest observation was in a previous block', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blockTimestamps = [1, 3, 4, 0];
                        // 0
                        // 8: 0 + (4*(3-1))
                        // 13: 8 + (5*(4-3))
                        tickCumulatives = [0, 8, 13, 0];
                        // 0
                        // (1): 0 + ((3-1)*2**128)/5000
                        // (1) + ((4-3)*2**128)/7000
                        liquidityValues = [
                            BN0,
                            ethers_1.BigNumber.from('136112946768375385385349842972707284'),
                            ethers_1.BigNumber.from('184724713471366594451546215462959885'),
                            BN0,
                        ];
                        initializeds = [true, true, true, false];
                        observationCardinality = 3;
                        observationIndex = 2;
                        slot0Tick = 6;
                        lastObservationCurrentTimestamp = false;
                        liquidity = 10000;
                        return [4 /*yield*/, deployMockObservationsContract()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, oracle.getBlockStartingTickAndLiquidity(mockObservations.address)];
                    case 2:
                        result = _a.sent();
                        (0, chai_1.expect)(result[0]).to.equal(slot0Tick);
                        (0, chai_1.expect)(result[1]).to.equal(liquidity);
                        return [2 /*return*/];
                }
            });
        }); });
        it('reverts if it needs 2 observations and doesnt have them', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blockTimestamps = [1, 0, 0, 0];
                        tickCumulatives = [8, 0, 0, 0];
                        liquidityValues = [ethers_1.BigNumber.from('136112946768375385385349842972707284'), BN0, BN0, BN0];
                        initializeds = [true, false, false, false];
                        observationCardinality = 1;
                        observationIndex = 0;
                        slot0Tick = 4;
                        lastObservationCurrentTimestamp = true;
                        liquidity = 10000;
                        return [4 /*yield*/, deployMockObservationsContract()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(oracle.getBlockStartingTickAndLiquidity(mockObservations.address)).to.be.revertedWith('NEO')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('reverts if the prior observation needed is not initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blockTimestamps = [1, 0, 0, 0];
                        observationCardinality = 2;
                        observationIndex = 0;
                        liquidityValues = [ethers_1.BigNumber.from('136112946768375385385349842972707284'), BN0, BN0, BN0];
                        initializeds = [true, false, false, false];
                        tickCumulatives = [8, 0, 0, 0];
                        slot0Tick = 4;
                        lastObservationCurrentTimestamp = true;
                        return [4 /*yield*/, deployMockObservationsContract()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(oracle.getBlockStartingTickAndLiquidity(mockObservations.address)).to.be.revertedWith('ONI')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('calculates the prior tick and liquidity from the prior observations', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, actualStartingTick, actualStartingLiquidity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blockTimestamps = [9, 5, 8, 0];
                        observationCardinality = 3;
                        observationIndex = 0;
                        initializeds = [true, true, true, false];
                        // 99: 95 + (4*1)
                        // 80: 72 + (4*2)
                        // 95: 80 + (5*3)
                        tickCumulatives = [99, 80, 95, 0];
                        // prev: 784724713471366594451546215462959885
                        // (3): (2) + (1*2**128)/13212
                        // (1): prev + (2*2**128)/12345
                        // (2): (1) + (3*2**128)/10238
                        liquidityValues = [
                            ethers_1.BigNumber.from('965320616647837491242414421221086683'),
                            ethers_1.BigNumber.from('839853488995212437053956034406948254'),
                            ethers_1.BigNumber.from('939565063595995342933046073701273770'),
                            BN0,
                        ];
                        slot0Tick = 3;
                        lastObservationCurrentTimestamp = true;
                        return [4 /*yield*/, deployMockObservationsContract()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, oracle.getBlockStartingTickAndLiquidity(mockObservations.address)];
                    case 2:
                        result = _a.sent();
                        actualStartingTick = (tickCumulatives[0] - tickCumulatives[2]) / (blockTimestamps[0] - blockTimestamps[2]);
                        (0, chai_1.expect)(result[0]).to.equal(actualStartingTick);
                        actualStartingLiquidity = 13212 // see comments above
                        ;
                        (0, chai_1.expect)(result[1]).to.equal(actualStartingLiquidity);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#getWeightedArithmeticMeanTick', function () {
        it('single observation returns average tick', function () { return __awaiter(void 0, void 0, void 0, function () {
            var observation, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        observation = { tick: 10, weight: 10 };
                        return [4 /*yield*/, oracle.getWeightedArithmeticMeanTick([observation])];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(10);
                        return [2 /*return*/];
                }
            });
        }); });
        it('multiple observations with same weight result in average across tiers', function () { return __awaiter(void 0, void 0, void 0, function () {
            var observation1, observation2, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        observation1 = { tick: 10, weight: 10 };
                        observation2 = { tick: 20, weight: 10 };
                        return [4 /*yield*/, oracle.getWeightedArithmeticMeanTick([observation1, observation2])];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(15);
                        return [2 /*return*/];
                }
            });
        }); });
        it('multiple observations with different weights are weighted correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var observation2, observation1, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        observation2 = { tick: 20, weight: 15 };
                        observation1 = { tick: 10, weight: 10 };
                        return [4 /*yield*/, oracle.getWeightedArithmeticMeanTick([observation1, observation2])];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(16);
                        return [2 /*return*/];
                }
            });
        }); });
        it('correct rounding for .5 negative tick', function () { return __awaiter(void 0, void 0, void 0, function () {
            var observation1, observation2, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        observation1 = { tick: -10, weight: 10 };
                        observation2 = { tick: -11, weight: 10 };
                        return [4 /*yield*/, oracle.getWeightedArithmeticMeanTick([observation1, observation2])];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(-11);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#getChainedPrice', function () {
        var ticks;
        it('fails with discrepant length', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses;
            return __generator(this, function (_a) {
                tokenAddresses = [tokens[0].address, tokens[2].address];
                ticks = [5, 5];
                (0, chai_1.expect)(oracle.getChainedPrice(tokenAddresses, ticks)).to.be.revertedWith('DL');
                return [2 /*return*/];
            });
        }); });
        it('add two positive ticks, sorted order', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[0].address, tokens[1].address, tokens[2].address];
                        ticks = [5, 5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(10);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add one positive and one negative tick, sorted order', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[0].address, tokens[1].address, tokens[2].address];
                        ticks = [5, -5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add one negative and one positive tick, sorted order', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[0].address, tokens[1].address, tokens[2].address];
                        ticks = [-5, 5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add two negative ticks, sorted order', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[0].address, tokens[1].address, tokens[2].address];
                        ticks = [-5, -5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(-10);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add two positive ticks, token0/token1 + token1/token0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[0].address, tokens[2].address, tokens[1].address];
                        ticks = [5, 5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add one positive tick and one negative tick, token0/token1 + token1/token0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[0].address, tokens[2].address, tokens[1].address];
                        ticks = [5, -5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(10);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add one negative tick and one positive tick, token0/token1 + token1/token0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[0].address, tokens[2].address, tokens[1].address];
                        ticks = [-5, 5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(-10);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add two negative ticks, token0/token1 + token1/token0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[0].address, tokens[2].address, tokens[1].address];
                        ticks = [-5, -5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add two positive ticks, token1/token0 + token0/token1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[1].address, tokens[0].address, tokens[2].address];
                        ticks = [5, 5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add one positive tick and one negative tick, token1/token0 + token0/token1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[1].address, tokens[0].address, tokens[2].address];
                        ticks = [5, -5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(-10);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add one negative tick and one positive tick, token1/token0 + token0/token1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[1].address, tokens[0].address, tokens[2].address];
                        ticks = [-5, 5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(10);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add two negative ticks, token1/token0 + token0/token1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[1].address, tokens[0].address, tokens[2].address];
                        ticks = [-5, -5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add two positive ticks, token0/token1 + token1/token0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[1].address, tokens[2].address, tokens[0].address];
                        ticks = [5, 5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add one positive tick and one negative tick, token0/token1 + token1/token0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[1].address, tokens[2].address, tokens[0].address];
                        ticks = [5, -5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(10);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add one negative tick and one positive tick, token0/token1 + token1/token0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[1].address, tokens[2].address, tokens[0].address];
                        ticks = [-5, 5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(-10);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add two negative ticks, token0/token1 + token1/token0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[1].address, tokens[2].address, tokens[0].address];
                        ticks = [-5, -5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add two positive ticks, token1/token0 + token0/token1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[2].address, tokens[0].address, tokens[1].address];
                        ticks = [5, 5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add one positive tick and one negative tick, token1/token0 + token0/token1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[2].address, tokens[0].address, tokens[1].address];
                        ticks = [5, -5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(-10);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add one negative tick and one positive tick, token1/token0 + token0/token1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[2].address, tokens[0].address, tokens[1].address];
                        ticks = [-5, 5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(10);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add two negative ticks, token1/token0 + token0/token1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[2].address, tokens[0].address, tokens[1].address];
                        ticks = [-5, -5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add two positive ticks, token1/token0 + token1/token0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[2].address, tokens[1].address, tokens[0].address];
                        ticks = [5, 5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(-10);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add one positive tick and one negative tick, token1/token0 + token1/token0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[2].address, tokens[1].address, tokens[0].address];
                        ticks = [5, -5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add one negative tick and one positive tick, token1/token0 + token1/token0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[2].address, tokens[1].address, tokens[0].address];
                        ticks = [-5, 5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('add two negative ticks, token1/token0 + token1/token0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenAddresses, oracleTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenAddresses = [tokens[2].address, tokens[1].address, tokens[0].address];
                        ticks = [-5, -5];
                        return [4 /*yield*/, oracle.getChainedPrice(tokenAddresses, ticks)];
                    case 1:
                        oracleTick = _a.sent();
                        (0, chai_1.expect)(oracleTick).to.equal(10);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
