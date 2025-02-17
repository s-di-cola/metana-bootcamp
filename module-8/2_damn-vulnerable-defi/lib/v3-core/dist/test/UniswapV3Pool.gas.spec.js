"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const expect_1 = require("./shared/expect");
const fixtures_1 = require("./shared/fixtures");
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
const utilities_1 = require("./shared/utilities");
const createFixtureLoader = hardhat_1.waffle.createFixtureLoader;
describe('UniswapV3Pool gas tests', () => {
    let wallet, other;
    let loadFixture;
    before('create fixture loader', async () => {
        ;
        [wallet, other] = await hardhat_1.ethers.getSigners();
        loadFixture = createFixtureLoader([wallet, other]);
    });
    for (const feeProtocol of [0, 6]) {
        describe(feeProtocol > 0 ? 'fee is on' : 'fee is off', () => {
            const startingPrice = (0, utilities_1.encodePriceSqrt)(100001, 100000);
            const startingTick = 0;
            const feeAmount = utilities_1.FeeAmount.MEDIUM;
            const tickSpacing = utilities_1.TICK_SPACINGS[feeAmount];
            const minTick = (0, utilities_1.getMinTick)(tickSpacing);
            const maxTick = (0, utilities_1.getMaxTick)(tickSpacing);
            const gasTestFixture = async ([wallet]) => {
                const fix = await (0, fixtures_1.poolFixture)([wallet], hardhat_1.waffle.provider);
                const pool = await fix.createPool(feeAmount, tickSpacing);
                const { swapExact0For1, swapToHigherPrice, mint, swapToLowerPrice } = await (0, utilities_1.createPoolFunctions)({
                    swapTarget: fix.swapTargetCallee,
                    token0: fix.token0,
                    token1: fix.token1,
                    pool,
                });
                await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
                await pool.setFeeProtocol(feeProtocol, feeProtocol);
                await pool.increaseObservationCardinalityNext(4);
                await pool.advanceTime(1);
                await mint(wallet.address, minTick, maxTick, (0, utilities_1.expandTo18Decimals)(2));
                await swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address);
                await pool.advanceTime(1);
                await swapToHigherPrice(startingPrice, wallet.address);
                await pool.advanceTime(1);
                (0, expect_1.expect)((await pool.slot0()).tick).to.eq(startingTick);
                (0, expect_1.expect)((await pool.slot0()).sqrtPriceX96).to.eq(startingPrice);
                return { pool, swapExact0For1, mint, swapToHigherPrice, swapToLowerPrice };
            };
            let swapExact0For1;
            let swapToHigherPrice;
            let swapToLowerPrice;
            let pool;
            let mint;
            beforeEach('load the fixture', async () => {
                ;
                ({ swapExact0For1, pool, mint, swapToHigherPrice, swapToLowerPrice } = await loadFixture(gasTestFixture));
            });
            describe('#swapExact0For1', () => {
                it('first swap in block with no tick movement', async () => {
                    await (0, snapshotGasCost_1.default)(swapExact0For1(2000, wallet.address));
                    (0, expect_1.expect)((await pool.slot0()).sqrtPriceX96).to.not.eq(startingPrice);
                    (0, expect_1.expect)((await pool.slot0()).tick).to.eq(startingTick);
                });
                it('first swap in block moves tick, no initialized crossings', async () => {
                    await (0, snapshotGasCost_1.default)(swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(10000), wallet.address));
                    (0, expect_1.expect)((await pool.slot0()).tick).to.eq(startingTick - 1);
                });
                it('second swap in block with no tick movement', async () => {
                    await swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(10000), wallet.address);
                    (0, expect_1.expect)((await pool.slot0()).tick).to.eq(startingTick - 1);
                    await (0, snapshotGasCost_1.default)(swapExact0For1(2000, wallet.address));
                    (0, expect_1.expect)((await pool.slot0()).tick).to.eq(startingTick - 1);
                });
                it('second swap in block moves tick, no initialized crossings', async () => {
                    await swapExact0For1(1000, wallet.address);
                    (0, expect_1.expect)((await pool.slot0()).tick).to.eq(startingTick);
                    await (0, snapshotGasCost_1.default)(swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(10000), wallet.address));
                    (0, expect_1.expect)((await pool.slot0()).tick).to.eq(startingTick - 1);
                });
                it('first swap in block, large swap, no initialized crossings', async () => {
                    await (0, snapshotGasCost_1.default)(swapExact0For1((0, utilities_1.expandTo18Decimals)(10), wallet.address));
                    (0, expect_1.expect)((await pool.slot0()).tick).to.eq(-35787);
                });
                it('first swap in block, large swap crossing several initialized ticks', async () => {
                    await mint(wallet.address, startingTick - 3 * tickSpacing, startingTick - tickSpacing, (0, utilities_1.expandTo18Decimals)(1));
                    await mint(wallet.address, startingTick - 4 * tickSpacing, startingTick - 2 * tickSpacing, (0, utilities_1.expandTo18Decimals)(1));
                    (0, expect_1.expect)((await pool.slot0()).tick).to.eq(startingTick);
                    await (0, snapshotGasCost_1.default)(swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address));
                    (0, expect_1.expect)((await pool.slot0()).tick).to.be.lt(startingTick - 4 * tickSpacing); // we crossed the last tick
                });
                it('first swap in block, large swap crossing a single initialized tick', async () => {
                    await mint(wallet.address, minTick, startingTick - 2 * tickSpacing, (0, utilities_1.expandTo18Decimals)(1));
                    await (0, snapshotGasCost_1.default)(swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address));
                    (0, expect_1.expect)((await pool.slot0()).tick).to.be.lt(startingTick - 2 * tickSpacing); // we crossed the last tick
                });
                it('second swap in block, large swap crossing several initialized ticks', async () => {
                    await mint(wallet.address, startingTick - 3 * tickSpacing, startingTick - tickSpacing, (0, utilities_1.expandTo18Decimals)(1));
                    await mint(wallet.address, startingTick - 4 * tickSpacing, startingTick - 2 * tickSpacing, (0, utilities_1.expandTo18Decimals)(1));
                    await swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(10000), wallet.address);
                    await (0, snapshotGasCost_1.default)(swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address));
                    (0, expect_1.expect)((await pool.slot0()).tick).to.be.lt(startingTick - 4 * tickSpacing);
                });
                it('second swap in block, large swap crossing a single initialized tick', async () => {
                    await mint(wallet.address, minTick, startingTick - 2 * tickSpacing, (0, utilities_1.expandTo18Decimals)(1));
                    await swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(10000), wallet.address);
                    (0, expect_1.expect)((await pool.slot0()).tick).to.be.gt(startingTick - 2 * tickSpacing); // we didn't cross the initialized tick
                    await (0, snapshotGasCost_1.default)(swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address));
                    (0, expect_1.expect)((await pool.slot0()).tick).to.be.lt(startingTick - 2 * tickSpacing); // we crossed the last tick
                });
                it('large swap crossing several initialized ticks after some time passes', async () => {
                    await mint(wallet.address, startingTick - 3 * tickSpacing, startingTick - tickSpacing, (0, utilities_1.expandTo18Decimals)(1));
                    await mint(wallet.address, startingTick - 4 * tickSpacing, startingTick - 2 * tickSpacing, (0, utilities_1.expandTo18Decimals)(1));
                    await swapExact0For1(2, wallet.address);
                    await pool.advanceTime(1);
                    await (0, snapshotGasCost_1.default)(swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address));
                    (0, expect_1.expect)((await pool.slot0()).tick).to.be.lt(startingTick - 4 * tickSpacing);
                });
                it('large swap crossing several initialized ticks second time after some time passes', async () => {
                    await mint(wallet.address, startingTick - 3 * tickSpacing, startingTick - tickSpacing, (0, utilities_1.expandTo18Decimals)(1));
                    await mint(wallet.address, startingTick - 4 * tickSpacing, startingTick - 2 * tickSpacing, (0, utilities_1.expandTo18Decimals)(1));
                    await swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address);
                    await swapToHigherPrice(startingPrice, wallet.address);
                    await pool.advanceTime(1);
                    await (0, snapshotGasCost_1.default)(swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address));
                    (0, expect_1.expect)((await pool.slot0()).tick).to.be.lt(tickSpacing * -4);
                });
            });
            describe('#mint', () => {
                for (const { description, tickLower, tickUpper } of [
                    {
                        description: 'around current price',
                        tickLower: startingTick - tickSpacing,
                        tickUpper: startingTick + tickSpacing,
                    },
                    {
                        description: 'below current price',
                        tickLower: startingTick - 2 * tickSpacing,
                        tickUpper: startingTick - tickSpacing,
                    },
                    {
                        description: 'above current price',
                        tickLower: startingTick + tickSpacing,
                        tickUpper: startingTick + 2 * tickSpacing,
                    },
                ]) {
                    describe(description, () => {
                        it('new position mint first in range', async () => {
                            await (0, snapshotGasCost_1.default)(mint(wallet.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1)));
                        });
                        it('add to position existing', async () => {
                            await mint(wallet.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1));
                            await (0, snapshotGasCost_1.default)(mint(wallet.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1)));
                        });
                        it('second position in same range', async () => {
                            await mint(wallet.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1));
                            await (0, snapshotGasCost_1.default)(mint(other.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1)));
                        });
                        it('add to position after some time passes', async () => {
                            await mint(wallet.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1));
                            await pool.advanceTime(1);
                            await (0, snapshotGasCost_1.default)(mint(wallet.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1)));
                        });
                    });
                }
            });
            describe('#burn', () => {
                for (const { description, tickLower, tickUpper } of [
                    {
                        description: 'around current price',
                        tickLower: startingTick - tickSpacing,
                        tickUpper: startingTick + tickSpacing,
                    },
                    {
                        description: 'below current price',
                        tickLower: startingTick - 2 * tickSpacing,
                        tickUpper: startingTick - tickSpacing,
                    },
                    {
                        description: 'above current price',
                        tickLower: startingTick + tickSpacing,
                        tickUpper: startingTick + 2 * tickSpacing,
                    },
                ]) {
                    describe(description, () => {
                        const liquidityAmount = (0, utilities_1.expandTo18Decimals)(1);
                        beforeEach('mint a position', async () => {
                            await mint(wallet.address, tickLower, tickUpper, liquidityAmount);
                        });
                        it('burn when only position using ticks', async () => {
                            await (0, snapshotGasCost_1.default)(pool.burn(tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1)));
                        });
                        it('partial position burn', async () => {
                            await (0, snapshotGasCost_1.default)(pool.burn(tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1).div(2)));
                        });
                        it('entire position burn but other positions are using the ticks', async () => {
                            await mint(other.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1));
                            await (0, snapshotGasCost_1.default)(pool.burn(tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1)));
                        });
                        it('burn entire position after some time passes', async () => {
                            await pool.advanceTime(1);
                            await (0, snapshotGasCost_1.default)(pool.burn(tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1)));
                        });
                    });
                }
            });
            describe('#poke', () => {
                const tickLower = startingTick - tickSpacing;
                const tickUpper = startingTick + tickSpacing;
                it('best case', async () => {
                    await mint(wallet.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1));
                    await swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(100), wallet.address);
                    await pool.burn(tickLower, tickUpper, 0);
                    await swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(100), wallet.address);
                    await (0, snapshotGasCost_1.default)(pool.burn(tickLower, tickUpper, 0));
                });
            });
            describe('#collect', () => {
                const tickLower = startingTick - tickSpacing;
                const tickUpper = startingTick + tickSpacing;
                it('close to worst case', async () => {
                    await mint(wallet.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1));
                    await swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(100), wallet.address);
                    await pool.burn(tickLower, tickUpper, 0); // poke to accumulate fees
                    await (0, snapshotGasCost_1.default)(pool.collect(wallet.address, tickLower, tickUpper, utilities_1.MaxUint128, utilities_1.MaxUint128));
                });
            });
            describe('#increaseObservationCardinalityNext', () => {
                it('grow by 1 slot', async () => {
                    await (0, snapshotGasCost_1.default)(pool.increaseObservationCardinalityNext(5));
                });
                it('no op', async () => {
                    await (0, snapshotGasCost_1.default)(pool.increaseObservationCardinalityNext(3));
                });
            });
            describe('#snapshotCumulativesInside', () => {
                it('tick inside', async () => {
                    await (0, snapshotGasCost_1.default)(pool.estimateGas.snapshotCumulativesInside(minTick, maxTick));
                });
                it('tick above', async () => {
                    await swapToHigherPrice(utilities_1.MAX_SQRT_RATIO.sub(1), wallet.address);
                    await (0, snapshotGasCost_1.default)(pool.estimateGas.snapshotCumulativesInside(minTick, maxTick));
                });
                it('tick below', async () => {
                    await swapToLowerPrice(utilities_1.MIN_SQRT_RATIO.add(1), wallet.address);
                    await (0, snapshotGasCost_1.default)(pool.estimateGas.snapshotCumulativesInside(minTick, maxTick));
                });
            });
        });
    }
});
