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
decimal_js_1.Decimal.config({ toExpNeg: -500, toExpPos: 500 });
var createFixtureLoader = hardhat_1.waffle.createFixtureLoader;
var constants = hardhat_1.ethers.constants;
function swapCaseToDescription(testCase) {
    var priceClause = (testCase === null || testCase === void 0 ? void 0 : testCase.sqrtPriceLimit) ? " to price ".concat((0, format_1.formatPrice)(testCase.sqrtPriceLimit)) : '';
    if ('exactOut' in testCase) {
        if (testCase.exactOut) {
            if (testCase.zeroForOne) {
                return "swap token0 for exactly ".concat((0, format_1.formatTokenAmount)(testCase.amount1), " token1").concat(priceClause);
            }
            else {
                return "swap token1 for exactly ".concat((0, format_1.formatTokenAmount)(testCase.amount0), " token0").concat(priceClause);
            }
        }
        else {
            if (testCase.zeroForOne) {
                return "swap exactly ".concat((0, format_1.formatTokenAmount)(testCase.amount0), " token0 for token1").concat(priceClause);
            }
            else {
                return "swap exactly ".concat((0, format_1.formatTokenAmount)(testCase.amount1), " token1 for token0").concat(priceClause);
            }
        }
    }
    else {
        if (testCase.zeroForOne) {
            return "swap token0 for token1".concat(priceClause);
        }
        else {
            return "swap token1 for token0".concat(priceClause);
        }
    }
}
// can't use address zero because the ERC20 token does not allow it
var SWAP_RECIPIENT_ADDRESS = constants.AddressZero.slice(0, -1) + '1';
var POSITION_PROCEEDS_OUTPUT_ADDRESS = constants.AddressZero.slice(0, -1) + '2';
function executeSwap(pool, testCase, poolFunctions) {
    return __awaiter(this, void 0, void 0, function () {
        var swap;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!('exactOut' in testCase)) return [3 /*break*/, 10];
                    if (!testCase.exactOut) return [3 /*break*/, 5];
                    if (!testCase.zeroForOne) return [3 /*break*/, 2];
                    return [4 /*yield*/, poolFunctions.swap0ForExact1(testCase.amount1, SWAP_RECIPIENT_ADDRESS, testCase.sqrtPriceLimit)];
                case 1:
                    swap = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, poolFunctions.swap1ForExact0(testCase.amount0, SWAP_RECIPIENT_ADDRESS, testCase.sqrtPriceLimit)];
                case 3:
                    swap = _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 9];
                case 5:
                    if (!testCase.zeroForOne) return [3 /*break*/, 7];
                    return [4 /*yield*/, poolFunctions.swapExact0For1(testCase.amount0, SWAP_RECIPIENT_ADDRESS, testCase.sqrtPriceLimit)];
                case 6:
                    swap = _a.sent();
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, poolFunctions.swapExact1For0(testCase.amount1, SWAP_RECIPIENT_ADDRESS, testCase.sqrtPriceLimit)];
                case 8:
                    swap = _a.sent();
                    _a.label = 9;
                case 9: return [3 /*break*/, 14];
                case 10:
                    if (!testCase.zeroForOne) return [3 /*break*/, 12];
                    return [4 /*yield*/, poolFunctions.swapToLowerPrice(testCase.sqrtPriceLimit, SWAP_RECIPIENT_ADDRESS)];
                case 11:
                    swap = _a.sent();
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, poolFunctions.swapToHigherPrice(testCase.sqrtPriceLimit, SWAP_RECIPIENT_ADDRESS)];
                case 13:
                    swap = _a.sent();
                    _a.label = 14;
                case 14: return [2 /*return*/, swap];
            }
        });
    });
}
var DEFAULT_POOL_SWAP_TESTS = [
    // swap large amounts in/out
    {
        zeroForOne: true,
        exactOut: false,
        amount0: (0, utilities_1.expandTo18Decimals)(1),
    },
    {
        zeroForOne: false,
        exactOut: false,
        amount1: (0, utilities_1.expandTo18Decimals)(1),
    },
    {
        zeroForOne: true,
        exactOut: true,
        amount1: (0, utilities_1.expandTo18Decimals)(1),
    },
    {
        zeroForOne: false,
        exactOut: true,
        amount0: (0, utilities_1.expandTo18Decimals)(1),
    },
    // swap large amounts in/out with a price limit
    {
        zeroForOne: true,
        exactOut: false,
        amount0: (0, utilities_1.expandTo18Decimals)(1),
        sqrtPriceLimit: (0, utilities_1.encodePriceSqrt)(50, 100),
    },
    {
        zeroForOne: false,
        exactOut: false,
        amount1: (0, utilities_1.expandTo18Decimals)(1),
        sqrtPriceLimit: (0, utilities_1.encodePriceSqrt)(200, 100),
    },
    {
        zeroForOne: true,
        exactOut: true,
        amount1: (0, utilities_1.expandTo18Decimals)(1),
        sqrtPriceLimit: (0, utilities_1.encodePriceSqrt)(50, 100),
    },
    {
        zeroForOne: false,
        exactOut: true,
        amount0: (0, utilities_1.expandTo18Decimals)(1),
        sqrtPriceLimit: (0, utilities_1.encodePriceSqrt)(200, 100),
    },
    // swap small amounts in/out
    {
        zeroForOne: true,
        exactOut: false,
        amount0: 1000,
    },
    {
        zeroForOne: false,
        exactOut: false,
        amount1: 1000,
    },
    {
        zeroForOne: true,
        exactOut: true,
        amount1: 1000,
    },
    {
        zeroForOne: false,
        exactOut: true,
        amount0: 1000,
    },
    // swap arbitrary input to price
    {
        sqrtPriceLimit: (0, utilities_1.encodePriceSqrt)(5, 2),
        zeroForOne: false,
    },
    {
        sqrtPriceLimit: (0, utilities_1.encodePriceSqrt)(2, 5),
        zeroForOne: true,
    },
    {
        sqrtPriceLimit: (0, utilities_1.encodePriceSqrt)(5, 2),
        zeroForOne: true,
    },
    {
        sqrtPriceLimit: (0, utilities_1.encodePriceSqrt)(2, 5),
        zeroForOne: false,
    },
];
var TEST_POOLS = [
    {
        description: 'low fee, 1:1 price, 2e18 max range liquidity',
        feeAmount: utilities_1.FeeAmount.LOW,
        tickSpacing: utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.LOW],
        startingPrice: (0, utilities_1.encodePriceSqrt)(1, 1),
        positions: [
            {
                tickLower: (0, utilities_1.getMinTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.LOW]),
                tickUpper: (0, utilities_1.getMaxTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.LOW]),
                liquidity: (0, utilities_1.expandTo18Decimals)(2),
            },
        ],
    },
    {
        description: 'medium fee, 1:1 price, 2e18 max range liquidity',
        feeAmount: utilities_1.FeeAmount.MEDIUM,
        tickSpacing: utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM],
        startingPrice: (0, utilities_1.encodePriceSqrt)(1, 1),
        positions: [
            {
                tickLower: (0, utilities_1.getMinTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                tickUpper: (0, utilities_1.getMaxTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                liquidity: (0, utilities_1.expandTo18Decimals)(2),
            },
        ],
    },
    {
        description: 'high fee, 1:1 price, 2e18 max range liquidity',
        feeAmount: utilities_1.FeeAmount.HIGH,
        tickSpacing: utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.HIGH],
        startingPrice: (0, utilities_1.encodePriceSqrt)(1, 1),
        positions: [
            {
                tickLower: (0, utilities_1.getMinTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.HIGH]),
                tickUpper: (0, utilities_1.getMaxTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.HIGH]),
                liquidity: (0, utilities_1.expandTo18Decimals)(2),
            },
        ],
    },
    {
        description: 'medium fee, 10:1 price, 2e18 max range liquidity',
        feeAmount: utilities_1.FeeAmount.MEDIUM,
        tickSpacing: utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM],
        startingPrice: (0, utilities_1.encodePriceSqrt)(10, 1),
        positions: [
            {
                tickLower: (0, utilities_1.getMinTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                tickUpper: (0, utilities_1.getMaxTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                liquidity: (0, utilities_1.expandTo18Decimals)(2),
            },
        ],
    },
    {
        description: 'medium fee, 1:10 price, 2e18 max range liquidity',
        feeAmount: utilities_1.FeeAmount.MEDIUM,
        tickSpacing: utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM],
        startingPrice: (0, utilities_1.encodePriceSqrt)(1, 10),
        positions: [
            {
                tickLower: (0, utilities_1.getMinTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                tickUpper: (0, utilities_1.getMaxTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                liquidity: (0, utilities_1.expandTo18Decimals)(2),
            },
        ],
    },
    {
        description: 'medium fee, 1:1 price, 0 liquidity, all liquidity around current price',
        feeAmount: utilities_1.FeeAmount.MEDIUM,
        tickSpacing: utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM],
        startingPrice: (0, utilities_1.encodePriceSqrt)(1, 1),
        positions: [
            {
                tickLower: (0, utilities_1.getMinTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                tickUpper: -utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM],
                liquidity: (0, utilities_1.expandTo18Decimals)(2),
            },
            {
                tickLower: utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM],
                tickUpper: (0, utilities_1.getMaxTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                liquidity: (0, utilities_1.expandTo18Decimals)(2),
            },
        ],
    },
    {
        description: 'medium fee, 1:1 price, additional liquidity around current price',
        feeAmount: utilities_1.FeeAmount.MEDIUM,
        tickSpacing: utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM],
        startingPrice: (0, utilities_1.encodePriceSqrt)(1, 1),
        positions: [
            {
                tickLower: (0, utilities_1.getMinTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                tickUpper: (0, utilities_1.getMaxTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                liquidity: (0, utilities_1.expandTo18Decimals)(2),
            },
            {
                tickLower: (0, utilities_1.getMinTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                tickUpper: -utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM],
                liquidity: (0, utilities_1.expandTo18Decimals)(2),
            },
            {
                tickLower: utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM],
                tickUpper: (0, utilities_1.getMaxTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                liquidity: (0, utilities_1.expandTo18Decimals)(2),
            },
        ],
    },
    {
        description: 'low fee, large liquidity around current price (stable swap)',
        feeAmount: utilities_1.FeeAmount.LOW,
        tickSpacing: utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.LOW],
        startingPrice: (0, utilities_1.encodePriceSqrt)(1, 1),
        positions: [
            {
                tickLower: -utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.LOW],
                tickUpper: utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.LOW],
                liquidity: (0, utilities_1.expandTo18Decimals)(2),
            },
        ],
    },
    {
        description: 'medium fee, token0 liquidity only',
        feeAmount: utilities_1.FeeAmount.MEDIUM,
        tickSpacing: utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM],
        startingPrice: (0, utilities_1.encodePriceSqrt)(1, 1),
        positions: [
            {
                tickLower: 0,
                tickUpper: 2000 * utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM],
                liquidity: (0, utilities_1.expandTo18Decimals)(2),
            },
        ],
    },
    {
        description: 'medium fee, token1 liquidity only',
        feeAmount: utilities_1.FeeAmount.MEDIUM,
        tickSpacing: utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM],
        startingPrice: (0, utilities_1.encodePriceSqrt)(1, 1),
        positions: [
            {
                tickLower: -2000 * utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM],
                tickUpper: 0,
                liquidity: (0, utilities_1.expandTo18Decimals)(2),
            },
        ],
    },
    {
        description: 'close to max price',
        feeAmount: utilities_1.FeeAmount.MEDIUM,
        tickSpacing: utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM],
        startingPrice: (0, utilities_1.encodePriceSqrt)(ethers_1.BigNumber.from(2).pow(127), 1),
        positions: [
            {
                tickLower: (0, utilities_1.getMinTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                tickUpper: (0, utilities_1.getMaxTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                liquidity: (0, utilities_1.expandTo18Decimals)(2),
            },
        ],
    },
    {
        description: 'close to min price',
        feeAmount: utilities_1.FeeAmount.MEDIUM,
        tickSpacing: utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM],
        startingPrice: (0, utilities_1.encodePriceSqrt)(1, ethers_1.BigNumber.from(2).pow(127)),
        positions: [
            {
                tickLower: (0, utilities_1.getMinTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                tickUpper: (0, utilities_1.getMaxTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                liquidity: (0, utilities_1.expandTo18Decimals)(2),
            },
        ],
    },
    {
        description: 'max full range liquidity at 1:1 price with default fee',
        feeAmount: utilities_1.FeeAmount.MEDIUM,
        tickSpacing: utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM],
        startingPrice: (0, utilities_1.encodePriceSqrt)(1, 1),
        positions: [
            {
                tickLower: (0, utilities_1.getMinTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                tickUpper: (0, utilities_1.getMaxTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                liquidity: (0, utilities_1.getMaxLiquidityPerTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
            },
        ],
    },
    {
        description: 'initialized at the max ratio',
        feeAmount: utilities_1.FeeAmount.MEDIUM,
        tickSpacing: utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM],
        startingPrice: utilities_1.MAX_SQRT_RATIO.sub(1),
        positions: [
            {
                tickLower: (0, utilities_1.getMinTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                tickUpper: (0, utilities_1.getMaxTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                liquidity: (0, utilities_1.expandTo18Decimals)(2),
            },
        ],
    },
    {
        description: 'initialized at the min ratio',
        feeAmount: utilities_1.FeeAmount.MEDIUM,
        tickSpacing: utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM],
        startingPrice: utilities_1.MIN_SQRT_RATIO,
        positions: [
            {
                tickLower: (0, utilities_1.getMinTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                tickUpper: (0, utilities_1.getMaxTick)(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]),
                liquidity: (0, utilities_1.expandTo18Decimals)(2),
            },
        ],
    },
];
describe('UniswapV3Pool swap tests', function () {
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
                    loadFixture = createFixtureLoader([wallet]);
                    return [2 /*return*/];
            }
        });
    }); });
    var _loop_1 = function (poolCase) {
        describe(poolCase.description, function () {
            var _a;
            var poolCaseFixture = function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, createPool, token0, token1, swapTarget, pool, poolFunctions, _i, _b, position, _c, poolBalance0, poolBalance1;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, (0, fixtures_1.poolFixture)([wallet], hardhat_1.waffle.provider)];
                        case 1:
                            _a = _d.sent(), createPool = _a.createPool, token0 = _a.token0, token1 = _a.token1, swapTarget = _a.swapTargetCallee;
                            return [4 /*yield*/, createPool(poolCase.feeAmount, poolCase.tickSpacing)];
                        case 2:
                            pool = _d.sent();
                            poolFunctions = (0, utilities_1.createPoolFunctions)({ swapTarget: swapTarget, token0: token0, token1: token1, pool: pool });
                            return [4 /*yield*/, pool.initialize(poolCase.startingPrice)
                                // mint all positions
                            ];
                        case 3:
                            _d.sent();
                            _i = 0, _b = poolCase.positions;
                            _d.label = 4;
                        case 4:
                            if (!(_i < _b.length)) return [3 /*break*/, 7];
                            position = _b[_i];
                            return [4 /*yield*/, poolFunctions.mint(wallet.address, position.tickLower, position.tickUpper, position.liquidity)];
                        case 5:
                            _d.sent();
                            _d.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 4];
                        case 7: return [4 /*yield*/, Promise.all([
                                token0.balanceOf(pool.address),
                                token1.balanceOf(pool.address),
                            ])];
                        case 8:
                            _c = _d.sent(), poolBalance0 = _c[0], poolBalance1 = _c[1];
                            return [2 /*return*/, { token0: token0, token1: token1, pool: pool, poolFunctions: poolFunctions, poolBalance0: poolBalance0, poolBalance1: poolBalance1, swapTarget: swapTarget }];
                    }
                });
            }); };
            var token0;
            var token1;
            var poolBalance0;
            var poolBalance1;
            var pool;
            var swapTarget;
            var poolFunctions;
            beforeEach('load fixture', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            ;
                            return [4 /*yield*/, loadFixture(poolCaseFixture)];
                        case 1:
                            (_a = _b.sent(), token0 = _a.token0, token1 = _a.token1, pool = _a.pool, poolFunctions = _a.poolFunctions, poolBalance0 = _a.poolBalance0, poolBalance1 = _a.poolBalance1, swapTarget = _a.swapTarget);
                            return [2 /*return*/];
                    }
                });
            }); });
            afterEach('check can burn positions', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _i, _a, _b, liquidity, tickUpper, tickLower;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _i = 0, _a = poolCase.positions;
                            _c.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 5];
                            _b = _a[_i], liquidity = _b.liquidity, tickUpper = _b.tickUpper, tickLower = _b.tickLower;
                            return [4 /*yield*/, pool.burn(tickLower, tickUpper, liquidity)];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, pool.collect(POSITION_PROCEEDS_OUTPUT_ADDRESS, tickLower, tickUpper, utilities_1.MaxUint128, utilities_1.MaxUint128)];
                        case 3:
                            _c.sent();
                            _c.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 1];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            var _loop_2 = function (testCase) {
                it(swapCaseToDescription(testCase), function () { return __awaiter(void 0, void 0, void 0, function () {
                    var slot0, tx, error_1, _a, poolBalance0After, poolBalance1After, slot0After, liquidityAfter, feeGrowthGlobal0X128, feeGrowthGlobal1X128, poolBalance0Delta, poolBalance1Delta, executionPrice;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, pool.slot0()];
                            case 1:
                                slot0 = _b.sent();
                                tx = executeSwap(pool, testCase, poolFunctions);
                                _b.label = 2;
                            case 2:
                                _b.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, tx];
                            case 3:
                                _b.sent();
                                return [3 /*break*/, 5];
                            case 4:
                                error_1 = _b.sent();
                                (0, expect_1.expect)({
                                    swapError: error_1.message,
                                    poolBalance0: poolBalance0.toString(),
                                    poolBalance1: poolBalance1.toString(),
                                    poolPriceBefore: (0, format_1.formatPrice)(slot0.sqrtPriceX96),
                                    tickBefore: slot0.tick,
                                }).to.matchSnapshot('swap error');
                                return [2 /*return*/];
                            case 5: return [4 /*yield*/, Promise.all([
                                    token0.balanceOf(pool.address),
                                    token1.balanceOf(pool.address),
                                    pool.slot0(),
                                    pool.liquidity(),
                                    pool.feeGrowthGlobal0X128(),
                                    pool.feeGrowthGlobal1X128(),
                                ])];
                            case 6:
                                _a = _b.sent(), poolBalance0After = _a[0], poolBalance1After = _a[1], slot0After = _a[2], liquidityAfter = _a[3], feeGrowthGlobal0X128 = _a[4], feeGrowthGlobal1X128 = _a[5];
                                poolBalance0Delta = poolBalance0After.sub(poolBalance0);
                                poolBalance1Delta = poolBalance1After.sub(poolBalance1);
                                if (!poolBalance0Delta.eq(0)) return [3 /*break*/, 8];
                                return [4 /*yield*/, (0, expect_1.expect)(tx).to.not.emit(token0, 'Transfer')];
                            case 7:
                                _b.sent();
                                return [3 /*break*/, 12];
                            case 8:
                                if (!poolBalance0Delta.lt(0)) return [3 /*break*/, 10];
                                return [4 /*yield*/, (0, expect_1.expect)(tx)
                                        .to.emit(token0, 'Transfer')
                                        .withArgs(pool.address, SWAP_RECIPIENT_ADDRESS, poolBalance0Delta.mul(-1))];
                            case 9:
                                _b.sent();
                                return [3 /*break*/, 12];
                            case 10: return [4 /*yield*/, (0, expect_1.expect)(tx).to.emit(token0, 'Transfer').withArgs(wallet.address, pool.address, poolBalance0Delta)];
                            case 11:
                                _b.sent();
                                _b.label = 12;
                            case 12:
                                if (!poolBalance1Delta.eq(0)) return [3 /*break*/, 14];
                                return [4 /*yield*/, (0, expect_1.expect)(tx).to.not.emit(token1, 'Transfer')];
                            case 13:
                                _b.sent();
                                return [3 /*break*/, 18];
                            case 14:
                                if (!poolBalance1Delta.lt(0)) return [3 /*break*/, 16];
                                return [4 /*yield*/, (0, expect_1.expect)(tx)
                                        .to.emit(token1, 'Transfer')
                                        .withArgs(pool.address, SWAP_RECIPIENT_ADDRESS, poolBalance1Delta.mul(-1))];
                            case 15:
                                _b.sent();
                                return [3 /*break*/, 18];
                            case 16: return [4 /*yield*/, (0, expect_1.expect)(tx).to.emit(token1, 'Transfer').withArgs(wallet.address, pool.address, poolBalance1Delta)
                                // check that the swap event was emitted too
                            ];
                            case 17:
                                _b.sent();
                                _b.label = 18;
                            case 18: 
                            // check that the swap event was emitted too
                            return [4 /*yield*/, (0, expect_1.expect)(tx)
                                    .to.emit(pool, 'Swap')
                                    .withArgs(swapTarget.address, SWAP_RECIPIENT_ADDRESS, poolBalance0Delta, poolBalance1Delta, slot0After.sqrtPriceX96, liquidityAfter, slot0After.tick)];
                            case 19:
                                // check that the swap event was emitted too
                                _b.sent();
                                executionPrice = new decimal_js_1.Decimal(poolBalance1Delta.toString()).div(poolBalance0Delta.toString()).mul(-1);
                                (0, expect_1.expect)({
                                    amount0Before: poolBalance0.toString(),
                                    amount1Before: poolBalance1.toString(),
                                    amount0Delta: poolBalance0Delta.toString(),
                                    amount1Delta: poolBalance1Delta.toString(),
                                    feeGrowthGlobal0X128Delta: feeGrowthGlobal0X128.toString(),
                                    feeGrowthGlobal1X128Delta: feeGrowthGlobal1X128.toString(),
                                    tickBefore: slot0.tick,
                                    poolPriceBefore: (0, format_1.formatPrice)(slot0.sqrtPriceX96),
                                    tickAfter: slot0After.tick,
                                    poolPriceAfter: (0, format_1.formatPrice)(slot0After.sqrtPriceX96),
                                    executionPrice: executionPrice.toPrecision(5),
                                }).to.matchSnapshot('balances');
                                return [2 /*return*/];
                        }
                    });
                }); });
            };
            for (var _i = 0, _b = (_a = poolCase.swapTests) !== null && _a !== void 0 ? _a : DEFAULT_POOL_SWAP_TESTS; _i < _b.length; _i++) {
                var testCase = _b[_i];
                _loop_2(testCase);
            }
        });
    };
    for (var _i = 0, TEST_POOLS_1 = TEST_POOLS; _i < TEST_POOLS_1.length; _i++) {
        var poolCase = TEST_POOLS_1[_i];
        _loop_1(poolCase);
    }
});
