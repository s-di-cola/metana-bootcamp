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
var decimal_js_1 = require("decimal.js");
var ethers_1 = require("ethers");
var hardhat_1 = require("hardhat");
var expect_1 = require("./shared/expect");
var fixtures_1 = require("./shared/fixtures");
var format_1 = require("./shared/format");
var utilities_1 = require("./shared/utilities");
var MaxUint256 = hardhat_1.ethers.constants.MaxUint256;
var createFixtureLoader = hardhat_1.waffle.createFixtureLoader;
decimal_js_1.default.config({ toExpNeg: -500, toExpPos: 500 });
function applySqrtRatioBipsHundredthsDelta(sqrtRatio, bipsHundredths) {
    return ethers_1.BigNumber.from(new decimal_js_1.default(sqrtRatio
        .mul(sqrtRatio)
        .mul(1e6 + bipsHundredths)
        .div(1e6)
        .toString())
        .sqrt()
        .floor()
        .toString());
}
describe('UniswapV3Pool arbitrage tests', function () {
    var wallet, arbitrageur;
    var loadFixture;
    before('create fixture loader', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ;
                    return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    _a = _b.sent(), wallet = _a[0], arbitrageur = _a[1];
                    loadFixture = createFixtureLoader([wallet, arbitrageur]);
                    return [2 /*return*/];
            }
        });
    }); });
    var _loop_1 = function (feeProtocol) {
        describe("protocol fee = ".concat(feeProtocol, ";"), function () {
            var startingPrice = (0, utilities_1.encodePriceSqrt)(1, 1);
            var startingTick = 0;
            var feeAmount = utilities_1.FeeAmount.MEDIUM;
            var tickSpacing = utilities_1.TICK_SPACINGS[feeAmount];
            var minTick = (0, utilities_1.getMinTick)(tickSpacing);
            var maxTick = (0, utilities_1.getMaxTick)(tickSpacing);
            var _loop_2 = function (passiveLiquidity) {
                describe("passive liquidity of ".concat((0, format_1.formatTokenAmount)(passiveLiquidity)), function () {
                    var arbTestFixture = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var fix, pool, _c, swapExact0For1, swapToHigherPrice, swapToLowerPrice, swapExact1For0, mint, testerFactory, tester, tickMathFactory, tickMath, _d, _e;
                        var wallet = _b[0], arbitrageur = _b[1];
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0: return [4 /*yield*/, (0, fixtures_1.poolFixture)([wallet], hardhat_1.waffle.provider)];
                                case 1:
                                    fix = _f.sent();
                                    return [4 /*yield*/, fix.createPool(feeAmount, tickSpacing)];
                                case 2:
                                    pool = _f.sent();
                                    return [4 /*yield*/, fix.token0.transfer(arbitrageur.address, ethers_1.BigNumber.from(2).pow(254))];
                                case 3:
                                    _f.sent();
                                    return [4 /*yield*/, fix.token1.transfer(arbitrageur.address, ethers_1.BigNumber.from(2).pow(254))];
                                case 4:
                                    _f.sent();
                                    return [4 /*yield*/, (0, utilities_1.createPoolFunctions)({
                                            swapTarget: fix.swapTargetCallee,
                                            token0: fix.token0,
                                            token1: fix.token1,
                                            pool: pool,
                                        })];
                                case 5:
                                    _c = _f.sent(), swapExact0For1 = _c.swapExact0For1, swapToHigherPrice = _c.swapToHigherPrice, swapToLowerPrice = _c.swapToLowerPrice, swapExact1For0 = _c.swapExact1For0, mint = _c.mint;
                                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('UniswapV3PoolSwapTest')];
                                case 6:
                                    testerFactory = _f.sent();
                                    return [4 /*yield*/, testerFactory.deploy()];
                                case 7:
                                    tester = (_f.sent());
                                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TickMathTest')];
                                case 8:
                                    tickMathFactory = _f.sent();
                                    return [4 /*yield*/, tickMathFactory.deploy()];
                                case 9:
                                    tickMath = (_f.sent());
                                    return [4 /*yield*/, fix.token0.approve(tester.address, MaxUint256)];
                                case 10:
                                    _f.sent();
                                    return [4 /*yield*/, fix.token1.approve(tester.address, MaxUint256)];
                                case 11:
                                    _f.sent();
                                    return [4 /*yield*/, pool.initialize(startingPrice)];
                                case 12:
                                    _f.sent();
                                    if (!(feeProtocol != 0)) return [3 /*break*/, 14];
                                    return [4 /*yield*/, pool.setFeeProtocol(feeProtocol, feeProtocol)];
                                case 13:
                                    _f.sent();
                                    _f.label = 14;
                                case 14: return [4 /*yield*/, mint(wallet.address, minTick, maxTick, passiveLiquidity)];
                                case 15:
                                    _f.sent();
                                    _d = expect_1.expect;
                                    return [4 /*yield*/, pool.slot0()];
                                case 16:
                                    _d.apply(void 0, [(_f.sent()).tick]).to.eq(startingTick);
                                    _e = expect_1.expect;
                                    return [4 /*yield*/, pool.slot0()];
                                case 17:
                                    _e.apply(void 0, [(_f.sent()).sqrtPriceX96]).to.eq(startingPrice);
                                    return [2 /*return*/, { pool: pool, swapExact0For1: swapExact0For1, mint: mint, swapToHigherPrice: swapToHigherPrice, swapToLowerPrice: swapToLowerPrice, swapExact1For0: swapExact1For0, tester: tester, tickMath: tickMath }];
                            }
                        });
                    }); };
                    var swapExact0For1;
                    var swapToHigherPrice;
                    var swapToLowerPrice;
                    var swapExact1For0;
                    var pool;
                    var mint;
                    var tester;
                    var tickMath;
                    beforeEach('load the fixture', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    ;
                                    return [4 /*yield*/, loadFixture(arbTestFixture)];
                                case 1:
                                    (_a = _b.sent(), swapExact0For1 = _a.swapExact0For1, pool = _a.pool, mint = _a.mint, swapToHigherPrice = _a.swapToHigherPrice, swapToLowerPrice = _a.swapToLowerPrice, swapExact1For0 = _a.swapExact1For0, tester = _a.tester, tickMath = _a.tickMath);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    function simulateSwap(zeroForOne, amountSpecified, sqrtPriceLimitX96) {
                        return __awaiter(this, void 0, void 0, function () {
                            var _a, amount0Delta, amount1Delta, nextSqrtRatio, executionPrice;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, tester.callStatic.getSwapResult(pool.address, zeroForOne, amountSpecified, sqrtPriceLimitX96 !== null && sqrtPriceLimitX96 !== void 0 ? sqrtPriceLimitX96 : (zeroForOne ? utilities_1.MIN_SQRT_RATIO.add(1) : utilities_1.MAX_SQRT_RATIO.sub(1)))];
                                    case 1:
                                        _a = _b.sent(), amount0Delta = _a.amount0Delta, amount1Delta = _a.amount1Delta, nextSqrtRatio = _a.nextSqrtRatio;
                                        executionPrice = zeroForOne
                                            ? (0, utilities_1.encodePriceSqrt)(amount1Delta, amount0Delta.mul(-1))
                                            : (0, utilities_1.encodePriceSqrt)(amount1Delta.mul(-1), amount0Delta);
                                        return [2 /*return*/, { executionPrice: executionPrice, nextSqrtRatio: nextSqrtRatio, amount0Delta: amount0Delta, amount1Delta: amount1Delta }];
                                }
                            });
                        });
                    }
                    var _loop_3 = function (zeroForOne, assumedTruePriceAfterSwap, inputAmount, description) {
                        describe(description, function () {
                            function valueToken1(arbBalance0, arbBalance1) {
                                return assumedTruePriceAfterSwap
                                    .mul(assumedTruePriceAfterSwap)
                                    .mul(arbBalance0)
                                    .div(ethers_1.BigNumber.from(2).pow(192))
                                    .add(arbBalance1);
                            }
                            it('not sandwiched', function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a, executionPrice, amount1Delta, amount0Delta, _b, _c, _d;
                                var _e;
                                return __generator(this, function (_f) {
                                    switch (_f.label) {
                                        case 0: return [4 /*yield*/, simulateSwap(zeroForOne, inputAmount)];
                                        case 1:
                                            _a = _f.sent(), executionPrice = _a.executionPrice, amount1Delta = _a.amount1Delta, amount0Delta = _a.amount0Delta;
                                            if (!zeroForOne) return [3 /*break*/, 3];
                                            return [4 /*yield*/, swapExact0For1(inputAmount, wallet.address)];
                                        case 2:
                                            _b = _f.sent();
                                            return [3 /*break*/, 5];
                                        case 3: return [4 /*yield*/, swapExact1For0(inputAmount, wallet.address)];
                                        case 4:
                                            _b = _f.sent();
                                            _f.label = 5;
                                        case 5:
                                            _b;
                                            _c = expect_1.expect;
                                            _e = {
                                                executionPrice: (0, format_1.formatPrice)(executionPrice),
                                                amount0Delta: (0, format_1.formatTokenAmount)(amount0Delta),
                                                amount1Delta: (0, format_1.formatTokenAmount)(amount1Delta)
                                            };
                                            _d = format_1.formatPrice;
                                            return [4 /*yield*/, pool.slot0()];
                                        case 6:
                                            _c.apply(void 0, [(_e.priceAfter = _d.apply(void 0, [(_f.sent()).sqrtPriceX96]),
                                                    _e)]).to.matchSnapshot();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            it('sandwiched with swap to execution price then mint max liquidity/target/burn max liquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
                                var executionPrice, firstTickAboveMarginalPrice, _a, _b, _c, _d, _e, tickAfterFirstTickAboveMarginPrice, priceSwapStart, arbBalance0, arbBalance1, _f, frontrunDelta0, frontrunDelta1, frontrunExecutionPrice, _g, profitToken1AfterFrontRun, tickLower, tickUpper, mintReceipt, _h, amount0Mint, amount1Mint, executionPriceAfterFrontrun, _j, _k, amount0Burn, amount1Burn, _l, amount0CollectAndBurn, amount1CollectAndBurn, _m, amount0Collect, amount1Collect, profitToken1AfterSandwich, priceToSwapTo, _o, backrunDelta0, backrunDelta1, backrunExecutionPrice, _p, _q;
                                var _r;
                                var _s;
                                return __generator(this, function (_t) {
                                    switch (_t.label) {
                                        case 0: return [4 /*yield*/, simulateSwap(zeroForOne, inputAmount)];
                                        case 1:
                                            executionPrice = (_t.sent()).executionPrice;
                                            if (!zeroForOne) return [3 /*break*/, 3];
                                            _c = (_b = Math).ceil;
                                            return [4 /*yield*/, tickMath.getTickAtSqrtRatio(applySqrtRatioBipsHundredthsDelta(executionPrice, feeAmount))];
                                        case 2:
                                            _a = _c.apply(_b, [(_t.sent()) / tickSpacing]) * tickSpacing;
                                            return [3 /*break*/, 5];
                                        case 3:
                                            _e = (_d = Math).floor;
                                            return [4 /*yield*/, tickMath.getTickAtSqrtRatio(applySqrtRatioBipsHundredthsDelta(executionPrice, -feeAmount))];
                                        case 4:
                                            _a = _e.apply(_d, [(_t.sent()) / tickSpacing]) * tickSpacing;
                                            _t.label = 5;
                                        case 5:
                                            firstTickAboveMarginalPrice = _a;
                                            tickAfterFirstTickAboveMarginPrice = zeroForOne
                                                ? firstTickAboveMarginalPrice - tickSpacing
                                                : firstTickAboveMarginalPrice + tickSpacing;
                                            return [4 /*yield*/, tickMath.getSqrtRatioAtTick(firstTickAboveMarginalPrice)];
                                        case 6:
                                            priceSwapStart = _t.sent();
                                            arbBalance0 = ethers_1.BigNumber.from(0);
                                            arbBalance1 = ethers_1.BigNumber.from(0);
                                            return [4 /*yield*/, simulateSwap(zeroForOne, MaxUint256.div(2), priceSwapStart)];
                                        case 7:
                                            _f = _t.sent(), frontrunDelta0 = _f.amount0Delta, frontrunDelta1 = _f.amount1Delta, frontrunExecutionPrice = _f.executionPrice;
                                            arbBalance0 = arbBalance0.sub(frontrunDelta0);
                                            arbBalance1 = arbBalance1.sub(frontrunDelta1);
                                            if (!zeroForOne) return [3 /*break*/, 9];
                                            return [4 /*yield*/, swapToLowerPrice(priceSwapStart, arbitrageur.address)];
                                        case 8:
                                            _g = _t.sent();
                                            return [3 /*break*/, 11];
                                        case 9: return [4 /*yield*/, swapToHigherPrice(priceSwapStart, arbitrageur.address)];
                                        case 10:
                                            _g = _t.sent();
                                            _t.label = 11;
                                        case 11:
                                            _g;
                                            profitToken1AfterFrontRun = valueToken1(arbBalance0, arbBalance1);
                                            tickLower = zeroForOne ? tickAfterFirstTickAboveMarginPrice : firstTickAboveMarginalPrice;
                                            tickUpper = zeroForOne ? firstTickAboveMarginalPrice : tickAfterFirstTickAboveMarginPrice;
                                            return [4 /*yield*/, mint(wallet.address, tickLower, tickUpper, (0, utilities_1.getMaxLiquidityPerTick)(tickSpacing))];
                                        case 12: return [4 /*yield*/, (_t.sent()).wait()
                                            // sub the mint costs
                                        ];
                                        case 13:
                                            mintReceipt = _t.sent();
                                            _h = pool.interface.decodeEventLog(pool.interface.events['Mint(address,address,int24,int24,uint128,uint256,uint256)'], (_s = mintReceipt.events) === null || _s === void 0 ? void 0 : _s[2].data), amount0Mint = _h.amount0, amount1Mint = _h.amount1;
                                            arbBalance0 = arbBalance0.sub(amount0Mint);
                                            arbBalance1 = arbBalance1.sub(amount1Mint);
                                            return [4 /*yield*/, simulateSwap(zeroForOne, inputAmount)];
                                        case 14:
                                            executionPriceAfterFrontrun = (_t.sent()).executionPrice;
                                            if (!zeroForOne) return [3 /*break*/, 16];
                                            return [4 /*yield*/, swapExact0For1(inputAmount, wallet.address)];
                                        case 15:
                                            _j = _t.sent();
                                            return [3 /*break*/, 18];
                                        case 16: return [4 /*yield*/, swapExact1For0(inputAmount, wallet.address)
                                            // burn the arb's liquidity
                                        ];
                                        case 17:
                                            _j = _t.sent();
                                            _t.label = 18;
                                        case 18:
                                            _j;
                                            return [4 /*yield*/, pool.callStatic.burn(tickLower, tickUpper, (0, utilities_1.getMaxLiquidityPerTick)(tickSpacing))];
                                        case 19:
                                            _k = _t.sent(), amount0Burn = _k.amount0, amount1Burn = _k.amount1;
                                            return [4 /*yield*/, pool.burn(tickLower, tickUpper, (0, utilities_1.getMaxLiquidityPerTick)(tickSpacing))];
                                        case 20:
                                            _t.sent();
                                            arbBalance0 = arbBalance0.add(amount0Burn);
                                            arbBalance1 = arbBalance1.add(amount1Burn);
                                            return [4 /*yield*/, pool.callStatic.collect(arbitrageur.address, tickLower, tickUpper, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                                        case 21:
                                            _l = _t.sent(), amount0CollectAndBurn = _l.amount0, amount1CollectAndBurn = _l.amount1;
                                            _m = [
                                                amount0CollectAndBurn.sub(amount0Burn),
                                                amount1CollectAndBurn.sub(amount1Burn),
                                            ], amount0Collect = _m[0], amount1Collect = _m[1];
                                            arbBalance0 = arbBalance0.add(amount0Collect);
                                            arbBalance1 = arbBalance1.add(amount1Collect);
                                            profitToken1AfterSandwich = valueToken1(arbBalance0, arbBalance1);
                                            priceToSwapTo = zeroForOne
                                                ? applySqrtRatioBipsHundredthsDelta(assumedTruePriceAfterSwap, -feeAmount)
                                                : applySqrtRatioBipsHundredthsDelta(assumedTruePriceAfterSwap, feeAmount);
                                            return [4 /*yield*/, simulateSwap(!zeroForOne, MaxUint256.div(2), priceToSwapTo)];
                                        case 22:
                                            _o = _t.sent(), backrunDelta0 = _o.amount0Delta, backrunDelta1 = _o.amount1Delta, backrunExecutionPrice = _o.executionPrice;
                                            return [4 /*yield*/, swapToHigherPrice(priceToSwapTo, wallet.address)];
                                        case 23:
                                            _t.sent();
                                            arbBalance0 = arbBalance0.sub(backrunDelta0);
                                            arbBalance1 = arbBalance1.sub(backrunDelta1);
                                            _p = expect_1.expect;
                                            _r = {
                                                sandwichedPrice: (0, format_1.formatPrice)(executionPriceAfterFrontrun),
                                                arbBalanceDelta0: (0, format_1.formatTokenAmount)(arbBalance0),
                                                arbBalanceDelta1: (0, format_1.formatTokenAmount)(arbBalance1),
                                                profit: {
                                                    final: (0, format_1.formatTokenAmount)(valueToken1(arbBalance0, arbBalance1)),
                                                    afterFrontrun: (0, format_1.formatTokenAmount)(profitToken1AfterFrontRun),
                                                    afterSandwich: (0, format_1.formatTokenAmount)(profitToken1AfterSandwich),
                                                },
                                                backrun: {
                                                    executionPrice: (0, format_1.formatPrice)(backrunExecutionPrice),
                                                    delta0: (0, format_1.formatTokenAmount)(backrunDelta0),
                                                    delta1: (0, format_1.formatTokenAmount)(backrunDelta1),
                                                },
                                                frontrun: {
                                                    executionPrice: (0, format_1.formatPrice)(frontrunExecutionPrice),
                                                    delta0: (0, format_1.formatTokenAmount)(frontrunDelta0),
                                                    delta1: (0, format_1.formatTokenAmount)(frontrunDelta1),
                                                },
                                                collect: {
                                                    amount0: (0, format_1.formatTokenAmount)(amount0Collect),
                                                    amount1: (0, format_1.formatTokenAmount)(amount1Collect),
                                                },
                                                burn: {
                                                    amount0: (0, format_1.formatTokenAmount)(amount0Burn),
                                                    amount1: (0, format_1.formatTokenAmount)(amount1Burn),
                                                },
                                                mint: {
                                                    amount0: (0, format_1.formatTokenAmount)(amount0Mint),
                                                    amount1: (0, format_1.formatTokenAmount)(amount1Mint),
                                                }
                                            };
                                            _q = format_1.formatPrice;
                                            return [4 /*yield*/, pool.slot0()];
                                        case 24:
                                            _p.apply(void 0, [(_r.finalPrice = _q.apply(void 0, [(_t.sent()).sqrtPriceX96]),
                                                    _r)]).to.matchSnapshot();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            it('backrun to true price after swap only', function () { return __awaiter(void 0, void 0, void 0, function () {
                                var arbBalance0, arbBalance1, _a, priceToSwapTo, _b, backrunDelta0, backrunDelta1, backrunExecutionPrice, _c, _d, _e;
                                var _f;
                                return __generator(this, function (_g) {
                                    switch (_g.label) {
                                        case 0:
                                            arbBalance0 = ethers_1.BigNumber.from(0);
                                            arbBalance1 = ethers_1.BigNumber.from(0);
                                            if (!zeroForOne) return [3 /*break*/, 2];
                                            return [4 /*yield*/, swapExact0For1(inputAmount, wallet.address)];
                                        case 1:
                                            _a = _g.sent();
                                            return [3 /*break*/, 4];
                                        case 2: return [4 /*yield*/, swapExact1For0(inputAmount, wallet.address)
                                            // swap to the marginal price = true price
                                        ];
                                        case 3:
                                            _a = _g.sent();
                                            _g.label = 4;
                                        case 4:
                                            _a;
                                            priceToSwapTo = zeroForOne
                                                ? applySqrtRatioBipsHundredthsDelta(assumedTruePriceAfterSwap, -feeAmount)
                                                : applySqrtRatioBipsHundredthsDelta(assumedTruePriceAfterSwap, feeAmount);
                                            return [4 /*yield*/, simulateSwap(!zeroForOne, MaxUint256.div(2), priceToSwapTo)];
                                        case 5:
                                            _b = _g.sent(), backrunDelta0 = _b.amount0Delta, backrunDelta1 = _b.amount1Delta, backrunExecutionPrice = _b.executionPrice;
                                            if (!zeroForOne) return [3 /*break*/, 7];
                                            return [4 /*yield*/, swapToHigherPrice(priceToSwapTo, wallet.address)];
                                        case 6:
                                            _c = _g.sent();
                                            return [3 /*break*/, 9];
                                        case 7: return [4 /*yield*/, swapToLowerPrice(priceToSwapTo, wallet.address)];
                                        case 8:
                                            _c = _g.sent();
                                            _g.label = 9;
                                        case 9:
                                            _c;
                                            arbBalance0 = arbBalance0.sub(backrunDelta0);
                                            arbBalance1 = arbBalance1.sub(backrunDelta1);
                                            _d = expect_1.expect;
                                            _f = {
                                                arbBalanceDelta0: (0, format_1.formatTokenAmount)(arbBalance0),
                                                arbBalanceDelta1: (0, format_1.formatTokenAmount)(arbBalance1),
                                                profit: {
                                                    final: (0, format_1.formatTokenAmount)(valueToken1(arbBalance0, arbBalance1)),
                                                },
                                                backrun: {
                                                    executionPrice: (0, format_1.formatPrice)(backrunExecutionPrice),
                                                    delta0: (0, format_1.formatTokenAmount)(backrunDelta0),
                                                    delta1: (0, format_1.formatTokenAmount)(backrunDelta1),
                                                }
                                            };
                                            _e = format_1.formatPrice;
                                            return [4 /*yield*/, pool.slot0()];
                                        case 10:
                                            _d.apply(void 0, [(_f.finalPrice = _e.apply(void 0, [(_g.sent()).sqrtPriceX96]),
                                                    _f)]).to.matchSnapshot();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        });
                    };
                    for (var _i = 0, _a = [
                        {
                            description: 'exact input of 10e18 token0 with starting price of 1.0 and true price of 0.98',
                            zeroForOne: true,
                            inputAmount: (0, utilities_1.expandTo18Decimals)(10),
                            assumedTruePriceAfterSwap: (0, utilities_1.encodePriceSqrt)(98, 100),
                        },
                        {
                            description: 'exact input of 10e18 token0 with starting price of 1.0 and true price of 1.01',
                            zeroForOne: true,
                            inputAmount: (0, utilities_1.expandTo18Decimals)(10),
                            assumedTruePriceAfterSwap: (0, utilities_1.encodePriceSqrt)(101, 100),
                        },
                    ]; _i < _a.length; _i++) {
                        var _b = _a[_i], zeroForOne = _b.zeroForOne, assumedTruePriceAfterSwap = _b.assumedTruePriceAfterSwap, inputAmount = _b.inputAmount, description = _b.description;
                        _loop_3(zeroForOne, assumedTruePriceAfterSwap, inputAmount, description);
                    }
                });
            };
            for (var _i = 0, _a = [
                (0, utilities_1.expandTo18Decimals)(1).div(100),
                (0, utilities_1.expandTo18Decimals)(1),
                (0, utilities_1.expandTo18Decimals)(10),
                (0, utilities_1.expandTo18Decimals)(100),
            ]; _i < _a.length; _i++) {
                var passiveLiquidity = _a[_i];
                _loop_2(passiveLiquidity);
            }
        });
    };
    for (var _i = 0, _a = [0, 6]; _i < _a.length; _i++) {
        var feeProtocol = _a[_i];
        _loop_1(feeProtocol);
    }
});
