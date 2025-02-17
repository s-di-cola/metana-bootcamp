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
var expect_1 = require("./shared/expect");
var utilities_1 = require("./shared/utilities");
var MaxUint128 = ethers_1.BigNumber.from(2).pow(128).sub(1);
var constants = hardhat_1.ethers.constants;
describe('Tick', function () {
    var tickTest;
    beforeEach('deploy TickTest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var tickTestFactory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TickTest')];
                case 1:
                    tickTestFactory = _a.sent();
                    return [4 /*yield*/, tickTestFactory.deploy()];
                case 2:
                    tickTest = (_a.sent());
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#tickSpacingToMaxLiquidityPerTick', function () {
        it('returns the correct value for low fee', function () { return __awaiter(void 0, void 0, void 0, function () {
            var maxLiquidityPerTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tickTest.tickSpacingToMaxLiquidityPerTick(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.LOW])];
                    case 1:
                        maxLiquidityPerTick = _a.sent();
                        (0, expect_1.expect)(maxLiquidityPerTick).to.eq('1917569901783203986719870431555990'); // 110.8 bits
                        (0, expect_1.expect)(maxLiquidityPerTick).to.eq((0, utilities_1.getMaxLiquidityPerTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.LOW]));
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct value for medium fee', function () { return __awaiter(void 0, void 0, void 0, function () {
            var maxLiquidityPerTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tickTest.tickSpacingToMaxLiquidityPerTick(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM])];
                    case 1:
                        maxLiquidityPerTick = _a.sent();
                        (0, expect_1.expect)(maxLiquidityPerTick).to.eq('11505743598341114571880798222544994'); // 113.1 bits
                        (0, expect_1.expect)(maxLiquidityPerTick).to.eq((0, utilities_1.getMaxLiquidityPerTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]));
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct value for high fee', function () { return __awaiter(void 0, void 0, void 0, function () {
            var maxLiquidityPerTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tickTest.tickSpacingToMaxLiquidityPerTick(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.HIGH])];
                    case 1:
                        maxLiquidityPerTick = _a.sent();
                        (0, expect_1.expect)(maxLiquidityPerTick).to.eq('38350317471085141830651933667504588'); // 114.7 bits
                        (0, expect_1.expect)(maxLiquidityPerTick).to.eq((0, utilities_1.getMaxLiquidityPerTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.HIGH]));
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct value for entire range', function () { return __awaiter(void 0, void 0, void 0, function () {
            var maxLiquidityPerTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tickTest.tickSpacingToMaxLiquidityPerTick(887272)];
                    case 1:
                        maxLiquidityPerTick = _a.sent();
                        (0, expect_1.expect)(maxLiquidityPerTick).to.eq(MaxUint128.div(3)); // 126 bits
                        (0, expect_1.expect)(maxLiquidityPerTick).to.eq((0, utilities_1.getMaxLiquidityPerTick)(887272));
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct value for 2302', function () { return __awaiter(void 0, void 0, void 0, function () {
            var maxLiquidityPerTick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tickTest.tickSpacingToMaxLiquidityPerTick(2302)];
                    case 1:
                        maxLiquidityPerTick = _a.sent();
                        (0, expect_1.expect)(maxLiquidityPerTick).to.eq('441351967472034323558203122479595605'); // 118 bits
                        (0, expect_1.expect)(maxLiquidityPerTick).to.eq((0, utilities_1.getMaxLiquidityPerTick)(2302));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#getFeeGrowthInside', function () {
        it('returns all for two uninitialized ticks if tick is inside', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, feeGrowthInside0X128, feeGrowthInside1X128;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tickTest.getFeeGrowthInside(-2, 2, 0, 15, 15)];
                    case 1:
                        _a = _b.sent(), feeGrowthInside0X128 = _a.feeGrowthInside0X128, feeGrowthInside1X128 = _a.feeGrowthInside1X128;
                        (0, expect_1.expect)(feeGrowthInside0X128).to.eq(15);
                        (0, expect_1.expect)(feeGrowthInside1X128).to.eq(15);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns 0 for two uninitialized ticks if tick is above', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, feeGrowthInside0X128, feeGrowthInside1X128;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tickTest.getFeeGrowthInside(-2, 2, 4, 15, 15)];
                    case 1:
                        _a = _b.sent(), feeGrowthInside0X128 = _a.feeGrowthInside0X128, feeGrowthInside1X128 = _a.feeGrowthInside1X128;
                        (0, expect_1.expect)(feeGrowthInside0X128).to.eq(0);
                        (0, expect_1.expect)(feeGrowthInside1X128).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns 0 for two uninitialized ticks if tick is below', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, feeGrowthInside0X128, feeGrowthInside1X128;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tickTest.getFeeGrowthInside(-2, 2, -4, 15, 15)];
                    case 1:
                        _a = _b.sent(), feeGrowthInside0X128 = _a.feeGrowthInside0X128, feeGrowthInside1X128 = _a.feeGrowthInside1X128;
                        (0, expect_1.expect)(feeGrowthInside0X128).to.eq(0);
                        (0, expect_1.expect)(feeGrowthInside1X128).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('subtracts upper tick if below', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, feeGrowthInside0X128, feeGrowthInside1X128;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tickTest.setTick(2, {
                            feeGrowthOutside0X128: 2,
                            feeGrowthOutside1X128: 3,
                            liquidityGross: 0,
                            liquidityNet: 0,
                            secondsPerLiquidityOutsideX128: 0,
                            tickCumulativeOutside: 0,
                            secondsOutside: 0,
                            initialized: true,
                        })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, tickTest.getFeeGrowthInside(-2, 2, 0, 15, 15)];
                    case 2:
                        _a = _b.sent(), feeGrowthInside0X128 = _a.feeGrowthInside0X128, feeGrowthInside1X128 = _a.feeGrowthInside1X128;
                        (0, expect_1.expect)(feeGrowthInside0X128).to.eq(13);
                        (0, expect_1.expect)(feeGrowthInside1X128).to.eq(12);
                        return [2 /*return*/];
                }
            });
        }); });
        it('subtracts lower tick if above', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, feeGrowthInside0X128, feeGrowthInside1X128;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tickTest.setTick(-2, {
                            feeGrowthOutside0X128: 2,
                            feeGrowthOutside1X128: 3,
                            liquidityGross: 0,
                            liquidityNet: 0,
                            secondsPerLiquidityOutsideX128: 0,
                            tickCumulativeOutside: 0,
                            secondsOutside: 0,
                            initialized: true,
                        })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, tickTest.getFeeGrowthInside(-2, 2, 0, 15, 15)];
                    case 2:
                        _a = _b.sent(), feeGrowthInside0X128 = _a.feeGrowthInside0X128, feeGrowthInside1X128 = _a.feeGrowthInside1X128;
                        (0, expect_1.expect)(feeGrowthInside0X128).to.eq(13);
                        (0, expect_1.expect)(feeGrowthInside1X128).to.eq(12);
                        return [2 /*return*/];
                }
            });
        }); });
        it('subtracts upper and lower tick if inside', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, feeGrowthInside0X128, feeGrowthInside1X128;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tickTest.setTick(-2, {
                            feeGrowthOutside0X128: 2,
                            feeGrowthOutside1X128: 3,
                            liquidityGross: 0,
                            liquidityNet: 0,
                            secondsPerLiquidityOutsideX128: 0,
                            tickCumulativeOutside: 0,
                            secondsOutside: 0,
                            initialized: true,
                        })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, tickTest.setTick(2, {
                                feeGrowthOutside0X128: 4,
                                feeGrowthOutside1X128: 1,
                                liquidityGross: 0,
                                liquidityNet: 0,
                                secondsPerLiquidityOutsideX128: 0,
                                tickCumulativeOutside: 0,
                                secondsOutside: 0,
                                initialized: true,
                            })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, tickTest.getFeeGrowthInside(-2, 2, 0, 15, 15)];
                    case 3:
                        _a = _b.sent(), feeGrowthInside0X128 = _a.feeGrowthInside0X128, feeGrowthInside1X128 = _a.feeGrowthInside1X128;
                        (0, expect_1.expect)(feeGrowthInside0X128).to.eq(9);
                        (0, expect_1.expect)(feeGrowthInside1X128).to.eq(11);
                        return [2 /*return*/];
                }
            });
        }); });
        it('works correctly with overflow on inside tick', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, feeGrowthInside0X128, feeGrowthInside1X128;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tickTest.setTick(-2, {
                            feeGrowthOutside0X128: constants.MaxUint256.sub(3),
                            feeGrowthOutside1X128: constants.MaxUint256.sub(2),
                            liquidityGross: 0,
                            liquidityNet: 0,
                            secondsPerLiquidityOutsideX128: 0,
                            tickCumulativeOutside: 0,
                            secondsOutside: 0,
                            initialized: true,
                        })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, tickTest.setTick(2, {
                                feeGrowthOutside0X128: 3,
                                feeGrowthOutside1X128: 5,
                                liquidityGross: 0,
                                liquidityNet: 0,
                                secondsPerLiquidityOutsideX128: 0,
                                tickCumulativeOutside: 0,
                                secondsOutside: 0,
                                initialized: true,
                            })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, tickTest.getFeeGrowthInside(-2, 2, 0, 15, 15)];
                    case 3:
                        _a = _b.sent(), feeGrowthInside0X128 = _a.feeGrowthInside0X128, feeGrowthInside1X128 = _a.feeGrowthInside1X128;
                        (0, expect_1.expect)(feeGrowthInside0X128).to.eq(16);
                        (0, expect_1.expect)(feeGrowthInside1X128).to.eq(13);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#update', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            it('flips from zero to nonzero', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect_1.expect;
                            return [4 /*yield*/, tickTest.callStatic.update(0, 0, 1, 0, 0, 0, 0, 0, false, 3)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('does not flip from nonzero to greater nonzero', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, tickTest.update(0, 0, 1, 0, 0, 0, 0, 0, false, 3)];
                        case 1:
                            _b.sent();
                            _a = expect_1.expect;
                            return [4 /*yield*/, tickTest.callStatic.update(0, 0, 1, 0, 0, 0, 0, 0, false, 3)];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).to.eq(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('flips from nonzero to zero', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, tickTest.update(0, 0, 1, 0, 0, 0, 0, 0, false, 3)];
                        case 1:
                            _b.sent();
                            _a = expect_1.expect;
                            return [4 /*yield*/, tickTest.callStatic.update(0, 0, -1, 0, 0, 0, 0, 0, false, 3)];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).to.eq(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('does not flip from nonzero to lesser nonzero', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, tickTest.update(0, 0, 2, 0, 0, 0, 0, 0, false, 3)];
                        case 1:
                            _b.sent();
                            _a = expect_1.expect;
                            return [4 /*yield*/, tickTest.callStatic.update(0, 0, -1, 0, 0, 0, 0, 0, false, 3)];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).to.eq(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('does not flip from nonzero to lesser nonzero', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, tickTest.update(0, 0, 2, 0, 0, 0, 0, 0, false, 3)];
                        case 1:
                            _b.sent();
                            _a = expect_1.expect;
                            return [4 /*yield*/, tickTest.callStatic.update(0, 0, -1, 0, 0, 0, 0, 0, false, 3)];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).to.eq(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('reverts if total liquidity gross is greater than max', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, tickTest.update(0, 0, 2, 0, 0, 0, 0, 0, false, 3)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, tickTest.update(0, 0, 1, 0, 0, 0, 0, 0, true, 3)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, (0, expect_1.expect)(tickTest.update(0, 0, 1, 0, 0, 0, 0, 0, false, 3)).to.be.revertedWith('LO')];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('nets the liquidity based on upper flag', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, liquidityGross, liquidityNet;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, tickTest.update(0, 0, 2, 0, 0, 0, 0, 0, false, 10)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, tickTest.update(0, 0, 1, 0, 0, 0, 0, 0, true, 10)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, tickTest.update(0, 0, 3, 0, 0, 0, 0, 0, true, 10)];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, tickTest.update(0, 0, 1, 0, 0, 0, 0, 0, false, 10)];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, tickTest.ticks(0)];
                        case 5:
                            _a = _b.sent(), liquidityGross = _a.liquidityGross, liquidityNet = _a.liquidityNet;
                            (0, expect_1.expect)(liquidityGross).to.eq(2 + 1 + 3 + 1);
                            (0, expect_1.expect)(liquidityNet).to.eq(2 - 1 - 3 + 1);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('reverts on overflow liquidity gross', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, tickTest.update(0, 0, MaxUint128.div(2).sub(1), 0, 0, 0, 0, 0, false, MaxUint128)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, expect_1.expect)(tickTest.update(0, 0, MaxUint128.div(2).sub(1), 0, 0, 0, 0, 0, false, MaxUint128)).to.be.reverted];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('assumes all growth happens below ticks lte current tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, feeGrowthOutside0X128, feeGrowthOutside1X128, secondsOutside, secondsPerLiquidityOutsideX128, tickCumulativeOutside, initialized;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, tickTest.update(1, 1, 1, 1, 2, 3, 4, 5, false, MaxUint128)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, tickTest.ticks(1)];
                        case 2:
                            _a = _b.sent(), feeGrowthOutside0X128 = _a.feeGrowthOutside0X128, feeGrowthOutside1X128 = _a.feeGrowthOutside1X128, secondsOutside = _a.secondsOutside, secondsPerLiquidityOutsideX128 = _a.secondsPerLiquidityOutsideX128, tickCumulativeOutside = _a.tickCumulativeOutside, initialized = _a.initialized;
                            (0, expect_1.expect)(feeGrowthOutside0X128).to.eq(1);
                            (0, expect_1.expect)(feeGrowthOutside1X128).to.eq(2);
                            (0, expect_1.expect)(secondsPerLiquidityOutsideX128).to.eq(3);
                            (0, expect_1.expect)(tickCumulativeOutside).to.eq(4);
                            (0, expect_1.expect)(secondsOutside).to.eq(5);
                            (0, expect_1.expect)(initialized).to.eq(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('does not set any growth fields if tick is already initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, feeGrowthOutside0X128, feeGrowthOutside1X128, secondsOutside, secondsPerLiquidityOutsideX128, tickCumulativeOutside, initialized;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, tickTest.update(1, 1, 1, 1, 2, 3, 4, 5, false, MaxUint128)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, tickTest.update(1, 1, 1, 6, 7, 8, 9, 10, false, MaxUint128)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, tickTest.ticks(1)];
                        case 3:
                            _a = _b.sent(), feeGrowthOutside0X128 = _a.feeGrowthOutside0X128, feeGrowthOutside1X128 = _a.feeGrowthOutside1X128, secondsOutside = _a.secondsOutside, secondsPerLiquidityOutsideX128 = _a.secondsPerLiquidityOutsideX128, tickCumulativeOutside = _a.tickCumulativeOutside, initialized = _a.initialized;
                            (0, expect_1.expect)(feeGrowthOutside0X128).to.eq(1);
                            (0, expect_1.expect)(feeGrowthOutside1X128).to.eq(2);
                            (0, expect_1.expect)(secondsPerLiquidityOutsideX128).to.eq(3);
                            (0, expect_1.expect)(tickCumulativeOutside).to.eq(4);
                            (0, expect_1.expect)(secondsOutside).to.eq(5);
                            (0, expect_1.expect)(initialized).to.eq(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('does not set any growth fields for ticks gt current tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, feeGrowthOutside0X128, feeGrowthOutside1X128, secondsOutside, secondsPerLiquidityOutsideX128, tickCumulativeOutside, initialized;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, tickTest.update(2, 1, 1, 1, 2, 3, 4, 5, false, MaxUint128)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, tickTest.ticks(2)];
                        case 2:
                            _a = _b.sent(), feeGrowthOutside0X128 = _a.feeGrowthOutside0X128, feeGrowthOutside1X128 = _a.feeGrowthOutside1X128, secondsOutside = _a.secondsOutside, secondsPerLiquidityOutsideX128 = _a.secondsPerLiquidityOutsideX128, tickCumulativeOutside = _a.tickCumulativeOutside, initialized = _a.initialized;
                            (0, expect_1.expect)(feeGrowthOutside0X128).to.eq(0);
                            (0, expect_1.expect)(feeGrowthOutside1X128).to.eq(0);
                            (0, expect_1.expect)(secondsPerLiquidityOutsideX128).to.eq(0);
                            (0, expect_1.expect)(tickCumulativeOutside).to.eq(0);
                            (0, expect_1.expect)(secondsOutside).to.eq(0);
                            (0, expect_1.expect)(initialized).to.eq(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
    // this is skipped because the presence of the method causes slither to fail
    describe('#clear', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            it('deletes all the data in the tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, feeGrowthOutside0X128, feeGrowthOutside1X128, secondsOutside, secondsPerLiquidityOutsideX128, liquidityGross, tickCumulativeOutside, liquidityNet, initialized;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, tickTest.setTick(2, {
                                feeGrowthOutside0X128: 1,
                                feeGrowthOutside1X128: 2,
                                liquidityGross: 3,
                                liquidityNet: 4,
                                secondsPerLiquidityOutsideX128: 5,
                                tickCumulativeOutside: 6,
                                secondsOutside: 7,
                                initialized: true,
                            })];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, tickTest.clear(2)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, tickTest.ticks(2)];
                        case 3:
                            _a = _b.sent(), feeGrowthOutside0X128 = _a.feeGrowthOutside0X128, feeGrowthOutside1X128 = _a.feeGrowthOutside1X128, secondsOutside = _a.secondsOutside, secondsPerLiquidityOutsideX128 = _a.secondsPerLiquidityOutsideX128, liquidityGross = _a.liquidityGross, tickCumulativeOutside = _a.tickCumulativeOutside, liquidityNet = _a.liquidityNet, initialized = _a.initialized;
                            (0, expect_1.expect)(feeGrowthOutside0X128).to.eq(0);
                            (0, expect_1.expect)(feeGrowthOutside1X128).to.eq(0);
                            (0, expect_1.expect)(secondsOutside).to.eq(0);
                            (0, expect_1.expect)(secondsPerLiquidityOutsideX128).to.eq(0);
                            (0, expect_1.expect)(tickCumulativeOutside).to.eq(0);
                            (0, expect_1.expect)(liquidityGross).to.eq(0);
                            (0, expect_1.expect)(liquidityNet).to.eq(0);
                            (0, expect_1.expect)(initialized).to.eq(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
    describe('#cross', function () {
        it('flips the growth variables', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, feeGrowthOutside0X128, feeGrowthOutside1X128, secondsOutside, tickCumulativeOutside, secondsPerLiquidityOutsideX128;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tickTest.setTick(2, {
                            feeGrowthOutside0X128: 1,
                            feeGrowthOutside1X128: 2,
                            liquidityGross: 3,
                            liquidityNet: 4,
                            secondsPerLiquidityOutsideX128: 5,
                            tickCumulativeOutside: 6,
                            secondsOutside: 7,
                            initialized: true,
                        })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, tickTest.cross(2, 7, 9, 8, 15, 10)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, tickTest.ticks(2)];
                    case 3:
                        _a = _b.sent(), feeGrowthOutside0X128 = _a.feeGrowthOutside0X128, feeGrowthOutside1X128 = _a.feeGrowthOutside1X128, secondsOutside = _a.secondsOutside, tickCumulativeOutside = _a.tickCumulativeOutside, secondsPerLiquidityOutsideX128 = _a.secondsPerLiquidityOutsideX128;
                        (0, expect_1.expect)(feeGrowthOutside0X128).to.eq(6);
                        (0, expect_1.expect)(feeGrowthOutside1X128).to.eq(7);
                        (0, expect_1.expect)(secondsPerLiquidityOutsideX128).to.eq(3);
                        (0, expect_1.expect)(tickCumulativeOutside).to.eq(9);
                        (0, expect_1.expect)(secondsOutside).to.eq(3);
                        return [2 /*return*/];
                }
            });
        }); });
        it('two flips are no op', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, feeGrowthOutside0X128, feeGrowthOutside1X128, secondsOutside, tickCumulativeOutside, secondsPerLiquidityOutsideX128;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tickTest.setTick(2, {
                            feeGrowthOutside0X128: 1,
                            feeGrowthOutside1X128: 2,
                            liquidityGross: 3,
                            liquidityNet: 4,
                            secondsPerLiquidityOutsideX128: 5,
                            tickCumulativeOutside: 6,
                            secondsOutside: 7,
                            initialized: true,
                        })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, tickTest.cross(2, 7, 9, 8, 15, 10)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, tickTest.cross(2, 7, 9, 8, 15, 10)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, tickTest.ticks(2)];
                    case 4:
                        _a = _b.sent(), feeGrowthOutside0X128 = _a.feeGrowthOutside0X128, feeGrowthOutside1X128 = _a.feeGrowthOutside1X128, secondsOutside = _a.secondsOutside, tickCumulativeOutside = _a.tickCumulativeOutside, secondsPerLiquidityOutsideX128 = _a.secondsPerLiquidityOutsideX128;
                        (0, expect_1.expect)(feeGrowthOutside0X128).to.eq(1);
                        (0, expect_1.expect)(feeGrowthOutside1X128).to.eq(2);
                        (0, expect_1.expect)(secondsPerLiquidityOutsideX128).to.eq(5);
                        (0, expect_1.expect)(tickCumulativeOutside).to.eq(6);
                        (0, expect_1.expect)(secondsOutside).to.eq(7);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
