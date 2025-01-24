"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decimal_js_1 = require("decimal.js");
const ethers_1 = require("ethers");
const hardhat_1 = require("hardhat");
const expect_1 = require("./shared/expect");
const fixtures_1 = require("./shared/fixtures");
const format_1 = require("./shared/format");
const utilities_1 = require("./shared/utilities");
decimal_js_1.Decimal.config({ toExpNeg: -500, toExpPos: 500 });
const createFixtureLoader = hardhat_1.waffle.createFixtureLoader;
const { constants } = hardhat_1.ethers;
function swapCaseToDescription(testCase) {
    const priceClause = (testCase === null || testCase === void 0 ? void 0 : testCase.sqrtPriceLimit) ? ` to price ${(0, format_1.formatPrice)(testCase.sqrtPriceLimit)}` : '';
    if ('exactOut' in testCase) {
        if (testCase.exactOut) {
            if (testCase.zeroForOne) {
                return `swap token0 for exactly ${(0, format_1.formatTokenAmount)(testCase.amount1)} token1${priceClause}`;
            }
            else {
                return `swap token1 for exactly ${(0, format_1.formatTokenAmount)(testCase.amount0)} token0${priceClause}`;
            }
        }
        else {
            if (testCase.zeroForOne) {
                return `swap exactly ${(0, format_1.formatTokenAmount)(testCase.amount0)} token0 for token1${priceClause}`;
            }
            else {
                return `swap exactly ${(0, format_1.formatTokenAmount)(testCase.amount1)} token1 for token0${priceClause}`;
            }
        }
    }
    else {
        if (testCase.zeroForOne) {
            return `swap token0 for token1${priceClause}`;
        }
        else {
            return `swap token1 for token0${priceClause}`;
        }
    }
}
// can't use address zero because the ERC20 token does not allow it
const SWAP_RECIPIENT_ADDRESS = constants.AddressZero.slice(0, -1) + '1';
const POSITION_PROCEEDS_OUTPUT_ADDRESS = constants.AddressZero.slice(0, -1) + '2';
async function executeSwap(pool, testCase, poolFunctions) {
    let swap;
    if ('exactOut' in testCase) {
        if (testCase.exactOut) {
            if (testCase.zeroForOne) {
                swap = await poolFunctions.swap0ForExact1(testCase.amount1, SWAP_RECIPIENT_ADDRESS, testCase.sqrtPriceLimit);
            }
            else {
                swap = await poolFunctions.swap1ForExact0(testCase.amount0, SWAP_RECIPIENT_ADDRESS, testCase.sqrtPriceLimit);
            }
        }
        else {
            if (testCase.zeroForOne) {
                swap = await poolFunctions.swapExact0For1(testCase.amount0, SWAP_RECIPIENT_ADDRESS, testCase.sqrtPriceLimit);
            }
            else {
                swap = await poolFunctions.swapExact1For0(testCase.amount1, SWAP_RECIPIENT_ADDRESS, testCase.sqrtPriceLimit);
            }
        }
    }
    else {
        if (testCase.zeroForOne) {
            swap = await poolFunctions.swapToLowerPrice(testCase.sqrtPriceLimit, SWAP_RECIPIENT_ADDRESS);
        }
        else {
            swap = await poolFunctions.swapToHigherPrice(testCase.sqrtPriceLimit, SWAP_RECIPIENT_ADDRESS);
        }
    }
    return swap;
}
const DEFAULT_POOL_SWAP_TESTS = [
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
const TEST_POOLS = [
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
describe('UniswapV3Pool swap tests', () => {
    let wallet, other;
    let loadFixture;
    before('create fixture loader', async () => {
        ;
        [wallet, other] = await hardhat_1.ethers.getSigners();
        loadFixture = createFixtureLoader([wallet]);
    });
    for (const poolCase of TEST_POOLS) {
        describe(poolCase.description, () => {
            var _a;
            const poolCaseFixture = async () => {
                const { createPool, token0, token1, swapTargetCallee: swapTarget, } = await (0, fixtures_1.poolFixture)([wallet], hardhat_1.waffle.provider);
                const pool = await createPool(poolCase.feeAmount, poolCase.tickSpacing);
                const poolFunctions = (0, utilities_1.createPoolFunctions)({ swapTarget, token0, token1, pool });
                await pool.initialize(poolCase.startingPrice);
                // mint all positions
                for (const position of poolCase.positions) {
                    await poolFunctions.mint(wallet.address, position.tickLower, position.tickUpper, position.liquidity);
                }
                const [poolBalance0, poolBalance1] = await Promise.all([
                    token0.balanceOf(pool.address),
                    token1.balanceOf(pool.address),
                ]);
                return { token0, token1, pool, poolFunctions, poolBalance0, poolBalance1, swapTarget };
            };
            let token0;
            let token1;
            let poolBalance0;
            let poolBalance1;
            let pool;
            let swapTarget;
            let poolFunctions;
            beforeEach('load fixture', async () => {
                ;
                ({ token0, token1, pool, poolFunctions, poolBalance0, poolBalance1, swapTarget } = await loadFixture(poolCaseFixture));
            });
            afterEach('check can burn positions', async () => {
                for (const { liquidity, tickUpper, tickLower } of poolCase.positions) {
                    await pool.burn(tickLower, tickUpper, liquidity);
                    await pool.collect(POSITION_PROCEEDS_OUTPUT_ADDRESS, tickLower, tickUpper, utilities_1.MaxUint128, utilities_1.MaxUint128);
                }
            });
            for (const testCase of (_a = poolCase.swapTests) !== null && _a !== void 0 ? _a : DEFAULT_POOL_SWAP_TESTS) {
                it(swapCaseToDescription(testCase), async () => {
                    const slot0 = await pool.slot0();
                    const tx = executeSwap(pool, testCase, poolFunctions);
                    try {
                        await tx;
                    }
                    catch (error) {
                        (0, expect_1.expect)({
                            swapError: error.message,
                            poolBalance0: poolBalance0.toString(),
                            poolBalance1: poolBalance1.toString(),
                            poolPriceBefore: (0, format_1.formatPrice)(slot0.sqrtPriceX96),
                            tickBefore: slot0.tick,
                        }).to.matchSnapshot('swap error');
                        return;
                    }
                    const [poolBalance0After, poolBalance1After, slot0After, liquidityAfter, feeGrowthGlobal0X128, feeGrowthGlobal1X128,] = await Promise.all([
                        token0.balanceOf(pool.address),
                        token1.balanceOf(pool.address),
                        pool.slot0(),
                        pool.liquidity(),
                        pool.feeGrowthGlobal0X128(),
                        pool.feeGrowthGlobal1X128(),
                    ]);
                    const poolBalance0Delta = poolBalance0After.sub(poolBalance0);
                    const poolBalance1Delta = poolBalance1After.sub(poolBalance1);
                    // check all the events were emitted corresponding to balance changes
                    if (poolBalance0Delta.eq(0))
                        await (0, expect_1.expect)(tx).to.not.emit(token0, 'Transfer');
                    else if (poolBalance0Delta.lt(0))
                        await (0, expect_1.expect)(tx)
                            .to.emit(token0, 'Transfer')
                            .withArgs(pool.address, SWAP_RECIPIENT_ADDRESS, poolBalance0Delta.mul(-1));
                    else
                        await (0, expect_1.expect)(tx).to.emit(token0, 'Transfer').withArgs(wallet.address, pool.address, poolBalance0Delta);
                    if (poolBalance1Delta.eq(0))
                        await (0, expect_1.expect)(tx).to.not.emit(token1, 'Transfer');
                    else if (poolBalance1Delta.lt(0))
                        await (0, expect_1.expect)(tx)
                            .to.emit(token1, 'Transfer')
                            .withArgs(pool.address, SWAP_RECIPIENT_ADDRESS, poolBalance1Delta.mul(-1));
                    else
                        await (0, expect_1.expect)(tx).to.emit(token1, 'Transfer').withArgs(wallet.address, pool.address, poolBalance1Delta);
                    // check that the swap event was emitted too
                    await (0, expect_1.expect)(tx)
                        .to.emit(pool, 'Swap')
                        .withArgs(swapTarget.address, SWAP_RECIPIENT_ADDRESS, poolBalance0Delta, poolBalance1Delta, slot0After.sqrtPriceX96, liquidityAfter, slot0After.tick);
                    const executionPrice = new decimal_js_1.Decimal(poolBalance1Delta.toString()).div(poolBalance0Delta.toString()).mul(-1);
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
                });
            }
        });
    }
});
