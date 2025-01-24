"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decimal_js_1 = __importDefault(require("decimal.js"));
const ethers_1 = require("ethers");
const hardhat_1 = require("hardhat");
const expect_1 = require("./shared/expect");
const fixtures_1 = require("./shared/fixtures");
const format_1 = require("./shared/format");
const utilities_1 = require("./shared/utilities");
const { constants: { MaxUint256 }, } = hardhat_1.ethers;
const createFixtureLoader = hardhat_1.waffle.createFixtureLoader;
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
describe('UniswapV3Pool arbitrage tests', () => {
    let wallet, arbitrageur;
    let loadFixture;
    before('create fixture loader', async () => {
        ;
        [wallet, arbitrageur] = await hardhat_1.ethers.getSigners();
        loadFixture = createFixtureLoader([wallet, arbitrageur]);
    });
    for (const feeProtocol of [0, 6]) {
        describe(`protocol fee = ${feeProtocol};`, () => {
            const startingPrice = (0, utilities_1.encodePriceSqrt)(1, 1);
            const startingTick = 0;
            const feeAmount = utilities_1.FeeAmount.MEDIUM;
            const tickSpacing = utilities_1.TICK_SPACINGS[feeAmount];
            const minTick = (0, utilities_1.getMinTick)(tickSpacing);
            const maxTick = (0, utilities_1.getMaxTick)(tickSpacing);
            for (const passiveLiquidity of [
                (0, utilities_1.expandTo18Decimals)(1).div(100),
                (0, utilities_1.expandTo18Decimals)(1),
                (0, utilities_1.expandTo18Decimals)(10),
                (0, utilities_1.expandTo18Decimals)(100),
            ]) {
                describe(`passive liquidity of ${(0, format_1.formatTokenAmount)(passiveLiquidity)}`, () => {
                    const arbTestFixture = async ([wallet, arbitrageur]) => {
                        const fix = await (0, fixtures_1.poolFixture)([wallet], hardhat_1.waffle.provider);
                        const pool = await fix.createPool(feeAmount, tickSpacing);
                        await fix.token0.transfer(arbitrageur.address, ethers_1.BigNumber.from(2).pow(254));
                        await fix.token1.transfer(arbitrageur.address, ethers_1.BigNumber.from(2).pow(254));
                        const { swapExact0For1, swapToHigherPrice, swapToLowerPrice, swapExact1For0, mint } = await (0, utilities_1.createPoolFunctions)({
                            swapTarget: fix.swapTargetCallee,
                            token0: fix.token0,
                            token1: fix.token1,
                            pool,
                        });
                        const testerFactory = await hardhat_1.ethers.getContractFactory('UniswapV3PoolSwapTest');
                        const tester = (await testerFactory.deploy());
                        const tickMathFactory = await hardhat_1.ethers.getContractFactory('TickMathTest');
                        const tickMath = (await tickMathFactory.deploy());
                        await fix.token0.approve(tester.address, MaxUint256);
                        await fix.token1.approve(tester.address, MaxUint256);
                        await pool.initialize(startingPrice);
                        if (feeProtocol != 0)
                            await pool.setFeeProtocol(feeProtocol, feeProtocol);
                        await mint(wallet.address, minTick, maxTick, passiveLiquidity);
                        (0, expect_1.expect)((await pool.slot0()).tick).to.eq(startingTick);
                        (0, expect_1.expect)((await pool.slot0()).sqrtPriceX96).to.eq(startingPrice);
                        return { pool, swapExact0For1, mint, swapToHigherPrice, swapToLowerPrice, swapExact1For0, tester, tickMath };
                    };
                    let swapExact0For1;
                    let swapToHigherPrice;
                    let swapToLowerPrice;
                    let swapExact1For0;
                    let pool;
                    let mint;
                    let tester;
                    let tickMath;
                    beforeEach('load the fixture', async () => {
                        ;
                        ({ swapExact0For1, pool, mint, swapToHigherPrice, swapToLowerPrice, swapExact1For0, tester, tickMath } =
                            await loadFixture(arbTestFixture));
                    });
                    async function simulateSwap(zeroForOne, amountSpecified, sqrtPriceLimitX96) {
                        const { amount0Delta, amount1Delta, nextSqrtRatio } = await tester.callStatic.getSwapResult(pool.address, zeroForOne, amountSpecified, sqrtPriceLimitX96 !== null && sqrtPriceLimitX96 !== void 0 ? sqrtPriceLimitX96 : (zeroForOne ? utilities_1.MIN_SQRT_RATIO.add(1) : utilities_1.MAX_SQRT_RATIO.sub(1)));
                        const executionPrice = zeroForOne
                            ? (0, utilities_1.encodePriceSqrt)(amount1Delta, amount0Delta.mul(-1))
                            : (0, utilities_1.encodePriceSqrt)(amount1Delta.mul(-1), amount0Delta);
                        return { executionPrice, nextSqrtRatio, amount0Delta, amount1Delta };
                    }
                    for (const { zeroForOne, assumedTruePriceAfterSwap, inputAmount, description } of [
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
                    ]) {
                        describe(description, () => {
                            function valueToken1(arbBalance0, arbBalance1) {
                                return assumedTruePriceAfterSwap
                                    .mul(assumedTruePriceAfterSwap)
                                    .mul(arbBalance0)
                                    .div(ethers_1.BigNumber.from(2).pow(192))
                                    .add(arbBalance1);
                            }
                            it('not sandwiched', async () => {
                                const { executionPrice, amount1Delta, amount0Delta } = await simulateSwap(zeroForOne, inputAmount);
                                zeroForOne
                                    ? await swapExact0For1(inputAmount, wallet.address)
                                    : await swapExact1For0(inputAmount, wallet.address);
                                (0, expect_1.expect)({
                                    executionPrice: (0, format_1.formatPrice)(executionPrice),
                                    amount0Delta: (0, format_1.formatTokenAmount)(amount0Delta),
                                    amount1Delta: (0, format_1.formatTokenAmount)(amount1Delta),
                                    priceAfter: (0, format_1.formatPrice)((await pool.slot0()).sqrtPriceX96),
                                }).to.matchSnapshot();
                            });
                            it('sandwiched with swap to execution price then mint max liquidity/target/burn max liquidity', async () => {
                                var _a;
                                const { executionPrice } = await simulateSwap(zeroForOne, inputAmount);
                                const firstTickAboveMarginalPrice = zeroForOne
                                    ? Math.ceil((await tickMath.getTickAtSqrtRatio(applySqrtRatioBipsHundredthsDelta(executionPrice, feeAmount))) / tickSpacing) * tickSpacing
                                    : Math.floor((await tickMath.getTickAtSqrtRatio(applySqrtRatioBipsHundredthsDelta(executionPrice, -feeAmount))) / tickSpacing) * tickSpacing;
                                const tickAfterFirstTickAboveMarginPrice = zeroForOne
                                    ? firstTickAboveMarginalPrice - tickSpacing
                                    : firstTickAboveMarginalPrice + tickSpacing;
                                const priceSwapStart = await tickMath.getSqrtRatioAtTick(firstTickAboveMarginalPrice);
                                let arbBalance0 = ethers_1.BigNumber.from(0);
                                let arbBalance1 = ethers_1.BigNumber.from(0);
                                // first frontrun to the first tick before the execution price
                                const { amount0Delta: frontrunDelta0, amount1Delta: frontrunDelta1, executionPrice: frontrunExecutionPrice, } = await simulateSwap(zeroForOne, MaxUint256.div(2), priceSwapStart);
                                arbBalance0 = arbBalance0.sub(frontrunDelta0);
                                arbBalance1 = arbBalance1.sub(frontrunDelta1);
                                zeroForOne
                                    ? await swapToLowerPrice(priceSwapStart, arbitrageur.address)
                                    : await swapToHigherPrice(priceSwapStart, arbitrageur.address);
                                const profitToken1AfterFrontRun = valueToken1(arbBalance0, arbBalance1);
                                const tickLower = zeroForOne ? tickAfterFirstTickAboveMarginPrice : firstTickAboveMarginalPrice;
                                const tickUpper = zeroForOne ? firstTickAboveMarginalPrice : tickAfterFirstTickAboveMarginPrice;
                                // deposit max liquidity at the tick
                                const mintReceipt = await (await mint(wallet.address, tickLower, tickUpper, (0, utilities_1.getMaxLiquidityPerTick)(tickSpacing))).wait();
                                // sub the mint costs
                                const { amount0: amount0Mint, amount1: amount1Mint } = pool.interface.decodeEventLog(pool.interface.events['Mint(address,address,int24,int24,uint128,uint256,uint256)'], (_a = mintReceipt.events) === null || _a === void 0 ? void 0 : _a[2].data);
                                arbBalance0 = arbBalance0.sub(amount0Mint);
                                arbBalance1 = arbBalance1.sub(amount1Mint);
                                // execute the user's swap
                                const { executionPrice: executionPriceAfterFrontrun } = await simulateSwap(zeroForOne, inputAmount);
                                zeroForOne
                                    ? await swapExact0For1(inputAmount, wallet.address)
                                    : await swapExact1For0(inputAmount, wallet.address);
                                // burn the arb's liquidity
                                const { amount0: amount0Burn, amount1: amount1Burn } = await pool.callStatic.burn(tickLower, tickUpper, (0, utilities_1.getMaxLiquidityPerTick)(tickSpacing));
                                await pool.burn(tickLower, tickUpper, (0, utilities_1.getMaxLiquidityPerTick)(tickSpacing));
                                arbBalance0 = arbBalance0.add(amount0Burn);
                                arbBalance1 = arbBalance1.add(amount1Burn);
                                // add the fees as well
                                const { amount0: amount0CollectAndBurn, amount1: amount1CollectAndBurn } = await pool.callStatic.collect(arbitrageur.address, tickLower, tickUpper, utilities_1.MaxUint128, utilities_1.MaxUint128);
                                const [amount0Collect, amount1Collect] = [
                                    amount0CollectAndBurn.sub(amount0Burn),
                                    amount1CollectAndBurn.sub(amount1Burn),
                                ];
                                arbBalance0 = arbBalance0.add(amount0Collect);
                                arbBalance1 = arbBalance1.add(amount1Collect);
                                const profitToken1AfterSandwich = valueToken1(arbBalance0, arbBalance1);
                                // backrun the swap to true price, i.e. swap to the marginal price = true price
                                const priceToSwapTo = zeroForOne
                                    ? applySqrtRatioBipsHundredthsDelta(assumedTruePriceAfterSwap, -feeAmount)
                                    : applySqrtRatioBipsHundredthsDelta(assumedTruePriceAfterSwap, feeAmount);
                                const { amount0Delta: backrunDelta0, amount1Delta: backrunDelta1, executionPrice: backrunExecutionPrice, } = await simulateSwap(!zeroForOne, MaxUint256.div(2), priceToSwapTo);
                                await swapToHigherPrice(priceToSwapTo, wallet.address);
                                arbBalance0 = arbBalance0.sub(backrunDelta0);
                                arbBalance1 = arbBalance1.sub(backrunDelta1);
                                (0, expect_1.expect)({
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
                                    },
                                    finalPrice: (0, format_1.formatPrice)((await pool.slot0()).sqrtPriceX96),
                                }).to.matchSnapshot();
                            });
                            it('backrun to true price after swap only', async () => {
                                let arbBalance0 = ethers_1.BigNumber.from(0);
                                let arbBalance1 = ethers_1.BigNumber.from(0);
                                zeroForOne
                                    ? await swapExact0For1(inputAmount, wallet.address)
                                    : await swapExact1For0(inputAmount, wallet.address);
                                // swap to the marginal price = true price
                                const priceToSwapTo = zeroForOne
                                    ? applySqrtRatioBipsHundredthsDelta(assumedTruePriceAfterSwap, -feeAmount)
                                    : applySqrtRatioBipsHundredthsDelta(assumedTruePriceAfterSwap, feeAmount);
                                const { amount0Delta: backrunDelta0, amount1Delta: backrunDelta1, executionPrice: backrunExecutionPrice, } = await simulateSwap(!zeroForOne, MaxUint256.div(2), priceToSwapTo);
                                zeroForOne
                                    ? await swapToHigherPrice(priceToSwapTo, wallet.address)
                                    : await swapToLowerPrice(priceToSwapTo, wallet.address);
                                arbBalance0 = arbBalance0.sub(backrunDelta0);
                                arbBalance1 = arbBalance1.sub(backrunDelta1);
                                (0, expect_1.expect)({
                                    arbBalanceDelta0: (0, format_1.formatTokenAmount)(arbBalance0),
                                    arbBalanceDelta1: (0, format_1.formatTokenAmount)(arbBalance1),
                                    profit: {
                                        final: (0, format_1.formatTokenAmount)(valueToken1(arbBalance0, arbBalance1)),
                                    },
                                    backrun: {
                                        executionPrice: (0, format_1.formatPrice)(backrunExecutionPrice),
                                        delta0: (0, format_1.formatTokenAmount)(backrunDelta0),
                                        delta1: (0, format_1.formatTokenAmount)(backrunDelta1),
                                    },
                                    finalPrice: (0, format_1.formatPrice)((await pool.slot0()).sqrtPriceX96),
                                }).to.matchSnapshot();
                            });
                        });
                    }
                });
            }
        });
    }
});
