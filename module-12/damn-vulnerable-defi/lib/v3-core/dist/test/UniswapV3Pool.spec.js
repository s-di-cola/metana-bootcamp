"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const ethers_1 = require("ethers");
const checkObservationEquals_1 = __importDefault(require("./shared/checkObservationEquals"));
const expect_1 = require("./shared/expect");
const fixtures_1 = require("./shared/fixtures");
const utilities_1 = require("./shared/utilities");
const createFixtureLoader = hardhat_1.waffle.createFixtureLoader;
describe('UniswapV3Pool', () => {
    let wallet, other;
    let token0;
    let token1;
    let token2;
    let factory;
    let pool;
    let swapTarget;
    let swapToLowerPrice;
    let swapToHigherPrice;
    let swapExact0For1;
    let swap0ForExact1;
    let swapExact1For0;
    let swap1ForExact0;
    let feeAmount;
    let tickSpacing;
    let minTick;
    let maxTick;
    let mint;
    let flash;
    let loadFixture;
    let createPool;
    before('create fixture loader', async () => {
        ;
        [wallet, other] = await hardhat_1.ethers.getSigners();
        loadFixture = createFixtureLoader([wallet, other]);
    });
    beforeEach('deploy fixture', async () => {
        ;
        ({ token0, token1, token2, factory, createPool, swapTargetCallee: swapTarget } = await loadFixture(fixtures_1.poolFixture));
        const oldCreatePool = createPool;
        createPool = async (_feeAmount, _tickSpacing) => {
            const pool = await oldCreatePool(_feeAmount, _tickSpacing);
            ({
                swapToLowerPrice,
                swapToHigherPrice,
                swapExact0For1,
                swap0ForExact1,
                swapExact1For0,
                swap1ForExact0,
                mint,
                flash,
            } = (0, utilities_1.createPoolFunctions)({
                token0,
                token1,
                swapTarget,
                pool,
            }));
            minTick = (0, utilities_1.getMinTick)(_tickSpacing);
            maxTick = (0, utilities_1.getMaxTick)(_tickSpacing);
            feeAmount = _feeAmount;
            tickSpacing = _tickSpacing;
            return pool;
        };
        // default to the 30 bips pool
        pool = await createPool(utilities_1.FeeAmount.MEDIUM, utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]);
    });
    it('constructor initializes immutables', async () => {
        (0, expect_1.expect)(await pool.factory()).to.eq(factory.address);
        (0, expect_1.expect)(await pool.token0()).to.eq(token0.address);
        (0, expect_1.expect)(await pool.token1()).to.eq(token1.address);
        (0, expect_1.expect)(await pool.maxLiquidityPerTick()).to.eq((0, utilities_1.getMaxLiquidityPerTick)(tickSpacing));
    });
    describe('#initialize', () => {
        it('fails if already initialized', async () => {
            await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
            await (0, expect_1.expect)(pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))).to.be.reverted;
        });
        it('fails if starting price is too low', async () => {
            await (0, expect_1.expect)(pool.initialize(1)).to.be.revertedWith('R');
            await (0, expect_1.expect)(pool.initialize(utilities_1.MIN_SQRT_RATIO.sub(1))).to.be.revertedWith('R');
        });
        it('fails if starting price is too high', async () => {
            await (0, expect_1.expect)(pool.initialize(utilities_1.MAX_SQRT_RATIO)).to.be.revertedWith('R');
            await (0, expect_1.expect)(pool.initialize(ethers_1.BigNumber.from(2).pow(160).sub(1))).to.be.revertedWith('R');
        });
        it('can be initialized at MIN_SQRT_RATIO', async () => {
            await pool.initialize(utilities_1.MIN_SQRT_RATIO);
            (0, expect_1.expect)((await pool.slot0()).tick).to.eq((0, utilities_1.getMinTick)(1));
        });
        it('can be initialized at MAX_SQRT_RATIO - 1', async () => {
            await pool.initialize(utilities_1.MAX_SQRT_RATIO.sub(1));
            (0, expect_1.expect)((await pool.slot0()).tick).to.eq((0, utilities_1.getMaxTick)(1) - 1);
        });
        it('sets initial variables', async () => {
            const price = (0, utilities_1.encodePriceSqrt)(1, 2);
            await pool.initialize(price);
            const { sqrtPriceX96, observationIndex } = await pool.slot0();
            (0, expect_1.expect)(sqrtPriceX96).to.eq(price);
            (0, expect_1.expect)(observationIndex).to.eq(0);
            (0, expect_1.expect)((await pool.slot0()).tick).to.eq(-6932);
        });
        it('initializes the first observations slot', async () => {
            await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
            (0, checkObservationEquals_1.default)(await pool.observations(0), {
                secondsPerLiquidityCumulativeX128: 0,
                initialized: true,
                blockTimestamp: fixtures_1.TEST_POOL_START_TIME,
                tickCumulative: 0,
            });
        });
        it('emits a Initialized event with the input tick', async () => {
            const sqrtPriceX96 = (0, utilities_1.encodePriceSqrt)(1, 2);
            await (0, expect_1.expect)(pool.initialize(sqrtPriceX96)).to.emit(pool, 'Initialize').withArgs(sqrtPriceX96, -6932);
        });
    });
    describe('#increaseObservationCardinalityNext', () => {
        it('can only be called after initialize', async () => {
            await (0, expect_1.expect)(pool.increaseObservationCardinalityNext(2)).to.be.revertedWith('LOK');
        });
        it('emits an event including both old and new', async () => {
            await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
            await (0, expect_1.expect)(pool.increaseObservationCardinalityNext(2))
                .to.emit(pool, 'IncreaseObservationCardinalityNext')
                .withArgs(1, 2);
        });
        it('does not emit an event for no op call', async () => {
            await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
            await pool.increaseObservationCardinalityNext(3);
            await (0, expect_1.expect)(pool.increaseObservationCardinalityNext(2)).to.not.emit(pool, 'IncreaseObservationCardinalityNext');
        });
        it('does not change cardinality next if less than current', async () => {
            await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
            await pool.increaseObservationCardinalityNext(3);
            await pool.increaseObservationCardinalityNext(2);
            (0, expect_1.expect)((await pool.slot0()).observationCardinalityNext).to.eq(3);
        });
        it('increases cardinality and cardinality next first time', async () => {
            await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
            await pool.increaseObservationCardinalityNext(2);
            const { observationCardinality, observationCardinalityNext } = await pool.slot0();
            (0, expect_1.expect)(observationCardinality).to.eq(1);
            (0, expect_1.expect)(observationCardinalityNext).to.eq(2);
        });
    });
    describe('#mint', () => {
        it('fails if not initialized', async () => {
            await (0, expect_1.expect)(mint(wallet.address, -tickSpacing, tickSpacing, 1)).to.be.revertedWith('LOK');
        });
        describe('after initialization', () => {
            beforeEach('initialize the pool at price of 10:1', async () => {
                await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 10));
                await mint(wallet.address, minTick, maxTick, 3161);
            });
            describe('failure cases', () => {
                it('fails if tickLower greater than tickUpper', async () => {
                    // should be TLU but...hardhat
                    await (0, expect_1.expect)(mint(wallet.address, 1, 0, 1)).to.be.reverted;
                });
                it('fails if tickLower less than min tick', async () => {
                    // should be TLM but...hardhat
                    await (0, expect_1.expect)(mint(wallet.address, -887273, 0, 1)).to.be.reverted;
                });
                it('fails if tickUpper greater than max tick', async () => {
                    // should be TUM but...hardhat
                    await (0, expect_1.expect)(mint(wallet.address, 0, 887273, 1)).to.be.reverted;
                });
                it('fails if amount exceeds the max', async () => {
                    // these should fail with 'LO' but hardhat is bugged
                    const maxLiquidityGross = await pool.maxLiquidityPerTick();
                    await (0, expect_1.expect)(mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, maxLiquidityGross.add(1))).to
                        .be.reverted;
                    await (0, expect_1.expect)(mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, maxLiquidityGross)).to.not.be
                        .reverted;
                });
                it('fails if total amount at tick exceeds the max', async () => {
                    // these should fail with 'LO' but hardhat is bugged
                    await mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, 1000);
                    const maxLiquidityGross = await pool.maxLiquidityPerTick();
                    await (0, expect_1.expect)(mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, maxLiquidityGross.sub(1000).add(1))).to.be.reverted;
                    await (0, expect_1.expect)(mint(wallet.address, minTick + tickSpacing * 2, maxTick - tickSpacing, maxLiquidityGross.sub(1000).add(1))).to.be.reverted;
                    await (0, expect_1.expect)(mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing * 2, maxLiquidityGross.sub(1000).add(1))).to.be.reverted;
                    await (0, expect_1.expect)(mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, maxLiquidityGross.sub(1000)))
                        .to.not.be.reverted;
                });
                it('fails if amount is 0', async () => {
                    await (0, expect_1.expect)(mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, 0)).to.be.reverted;
                });
            });
            describe('success cases', () => {
                it('initial balances', async () => {
                    (0, expect_1.expect)(await token0.balanceOf(pool.address)).to.eq(9996);
                    (0, expect_1.expect)(await token1.balanceOf(pool.address)).to.eq(1000);
                });
                it('initial tick', async () => {
                    (0, expect_1.expect)((await pool.slot0()).tick).to.eq(-23028);
                });
                describe('above current price', () => {
                    it('transfers token0 only', async () => {
                        await (0, expect_1.expect)(mint(wallet.address, -22980, 0, 10000))
                            .to.emit(token0, 'Transfer')
                            .withArgs(wallet.address, pool.address, 21549)
                            .to.not.emit(token1, 'Transfer');
                        (0, expect_1.expect)(await token0.balanceOf(pool.address)).to.eq(9996 + 21549);
                        (0, expect_1.expect)(await token1.balanceOf(pool.address)).to.eq(1000);
                    });
                    it('max tick with max leverage', async () => {
                        await mint(wallet.address, maxTick - tickSpacing, maxTick, ethers_1.BigNumber.from(2).pow(102));
                        (0, expect_1.expect)(await token0.balanceOf(pool.address)).to.eq(9996 + 828011525);
                        (0, expect_1.expect)(await token1.balanceOf(pool.address)).to.eq(1000);
                    });
                    it('works for max tick', async () => {
                        await (0, expect_1.expect)(mint(wallet.address, -22980, maxTick, 10000))
                            .to.emit(token0, 'Transfer')
                            .withArgs(wallet.address, pool.address, 31549);
                        (0, expect_1.expect)(await token0.balanceOf(pool.address)).to.eq(9996 + 31549);
                        (0, expect_1.expect)(await token1.balanceOf(pool.address)).to.eq(1000);
                    });
                    it('removing works', async () => {
                        await mint(wallet.address, -240, 0, 10000);
                        await pool.burn(-240, 0, 10000);
                        const { amount0, amount1 } = await pool.callStatic.collect(wallet.address, -240, 0, utilities_1.MaxUint128, utilities_1.MaxUint128);
                        (0, expect_1.expect)(amount0, 'amount0').to.eq(120);
                        (0, expect_1.expect)(amount1, 'amount1').to.eq(0);
                    });
                    it('adds liquidity to liquidityGross', async () => {
                        await mint(wallet.address, -240, 0, 100);
                        (0, expect_1.expect)((await pool.ticks(-240)).liquidityGross).to.eq(100);
                        (0, expect_1.expect)((await pool.ticks(0)).liquidityGross).to.eq(100);
                        (0, expect_1.expect)((await pool.ticks(tickSpacing)).liquidityGross).to.eq(0);
                        (0, expect_1.expect)((await pool.ticks(tickSpacing * 2)).liquidityGross).to.eq(0);
                        await mint(wallet.address, -240, tickSpacing, 150);
                        (0, expect_1.expect)((await pool.ticks(-240)).liquidityGross).to.eq(250);
                        (0, expect_1.expect)((await pool.ticks(0)).liquidityGross).to.eq(100);
                        (0, expect_1.expect)((await pool.ticks(tickSpacing)).liquidityGross).to.eq(150);
                        (0, expect_1.expect)((await pool.ticks(tickSpacing * 2)).liquidityGross).to.eq(0);
                        await mint(wallet.address, 0, tickSpacing * 2, 60);
                        (0, expect_1.expect)((await pool.ticks(-240)).liquidityGross).to.eq(250);
                        (0, expect_1.expect)((await pool.ticks(0)).liquidityGross).to.eq(160);
                        (0, expect_1.expect)((await pool.ticks(tickSpacing)).liquidityGross).to.eq(150);
                        (0, expect_1.expect)((await pool.ticks(tickSpacing * 2)).liquidityGross).to.eq(60);
                    });
                    it('removes liquidity from liquidityGross', async () => {
                        await mint(wallet.address, -240, 0, 100);
                        await mint(wallet.address, -240, 0, 40);
                        await pool.burn(-240, 0, 90);
                        (0, expect_1.expect)((await pool.ticks(-240)).liquidityGross).to.eq(50);
                        (0, expect_1.expect)((await pool.ticks(0)).liquidityGross).to.eq(50);
                    });
                    it('clears tick lower if last position is removed', async () => {
                        await mint(wallet.address, -240, 0, 100);
                        await pool.burn(-240, 0, 100);
                        const { liquidityGross, feeGrowthOutside0X128, feeGrowthOutside1X128 } = await pool.ticks(-240);
                        (0, expect_1.expect)(liquidityGross).to.eq(0);
                        (0, expect_1.expect)(feeGrowthOutside0X128).to.eq(0);
                        (0, expect_1.expect)(feeGrowthOutside1X128).to.eq(0);
                    });
                    it('clears tick upper if last position is removed', async () => {
                        await mint(wallet.address, -240, 0, 100);
                        await pool.burn(-240, 0, 100);
                        const { liquidityGross, feeGrowthOutside0X128, feeGrowthOutside1X128 } = await pool.ticks(0);
                        (0, expect_1.expect)(liquidityGross).to.eq(0);
                        (0, expect_1.expect)(feeGrowthOutside0X128).to.eq(0);
                        (0, expect_1.expect)(feeGrowthOutside1X128).to.eq(0);
                    });
                    it('only clears the tick that is not used at all', async () => {
                        await mint(wallet.address, -240, 0, 100);
                        await mint(wallet.address, -tickSpacing, 0, 250);
                        await pool.burn(-240, 0, 100);
                        let { liquidityGross, feeGrowthOutside0X128, feeGrowthOutside1X128 } = await pool.ticks(-240);
                        (0, expect_1.expect)(liquidityGross).to.eq(0);
                        (0, expect_1.expect)(feeGrowthOutside0X128).to.eq(0);
                        (0, expect_1.expect)(feeGrowthOutside1X128).to.eq(0);
                        ({ liquidityGross, feeGrowthOutside0X128, feeGrowthOutside1X128 } = await pool.ticks(-tickSpacing));
                        (0, expect_1.expect)(liquidityGross).to.eq(250);
                        (0, expect_1.expect)(feeGrowthOutside0X128).to.eq(0);
                        (0, expect_1.expect)(feeGrowthOutside1X128).to.eq(0);
                    });
                    it('does not write an observation', async () => {
                        (0, checkObservationEquals_1.default)(await pool.observations(0), {
                            tickCumulative: 0,
                            blockTimestamp: fixtures_1.TEST_POOL_START_TIME,
                            initialized: true,
                            secondsPerLiquidityCumulativeX128: 0,
                        });
                        await pool.advanceTime(1);
                        await mint(wallet.address, -240, 0, 100);
                        (0, checkObservationEquals_1.default)(await pool.observations(0), {
                            tickCumulative: 0,
                            blockTimestamp: fixtures_1.TEST_POOL_START_TIME,
                            initialized: true,
                            secondsPerLiquidityCumulativeX128: 0,
                        });
                    });
                });
                describe('including current price', () => {
                    it('price within range: transfers current price of both tokens', async () => {
                        await (0, expect_1.expect)(mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, 100))
                            .to.emit(token0, 'Transfer')
                            .withArgs(wallet.address, pool.address, 317)
                            .to.emit(token1, 'Transfer')
                            .withArgs(wallet.address, pool.address, 32);
                        (0, expect_1.expect)(await token0.balanceOf(pool.address)).to.eq(9996 + 317);
                        (0, expect_1.expect)(await token1.balanceOf(pool.address)).to.eq(1000 + 32);
                    });
                    it('initializes lower tick', async () => {
                        await mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, 100);
                        const { liquidityGross } = await pool.ticks(minTick + tickSpacing);
                        (0, expect_1.expect)(liquidityGross).to.eq(100);
                    });
                    it('initializes upper tick', async () => {
                        await mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, 100);
                        const { liquidityGross } = await pool.ticks(maxTick - tickSpacing);
                        (0, expect_1.expect)(liquidityGross).to.eq(100);
                    });
                    it('works for min/max tick', async () => {
                        await (0, expect_1.expect)(mint(wallet.address, minTick, maxTick, 10000))
                            .to.emit(token0, 'Transfer')
                            .withArgs(wallet.address, pool.address, 31623)
                            .to.emit(token1, 'Transfer')
                            .withArgs(wallet.address, pool.address, 3163);
                        (0, expect_1.expect)(await token0.balanceOf(pool.address)).to.eq(9996 + 31623);
                        (0, expect_1.expect)(await token1.balanceOf(pool.address)).to.eq(1000 + 3163);
                    });
                    it('removing works', async () => {
                        await mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, 100);
                        await pool.burn(minTick + tickSpacing, maxTick - tickSpacing, 100);
                        const { amount0, amount1 } = await pool.callStatic.collect(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, utilities_1.MaxUint128, utilities_1.MaxUint128);
                        (0, expect_1.expect)(amount0, 'amount0').to.eq(316);
                        (0, expect_1.expect)(amount1, 'amount1').to.eq(31);
                    });
                    it('writes an observation', async () => {
                        (0, checkObservationEquals_1.default)(await pool.observations(0), {
                            tickCumulative: 0,
                            blockTimestamp: fixtures_1.TEST_POOL_START_TIME,
                            initialized: true,
                            secondsPerLiquidityCumulativeX128: 0,
                        });
                        await pool.advanceTime(1);
                        await mint(wallet.address, minTick, maxTick, 100);
                        (0, checkObservationEquals_1.default)(await pool.observations(0), {
                            tickCumulative: -23028,
                            blockTimestamp: fixtures_1.TEST_POOL_START_TIME + 1,
                            initialized: true,
                            secondsPerLiquidityCumulativeX128: '107650226801941937191829992860413859',
                        });
                    });
                });
                describe('below current price', () => {
                    it('transfers token1 only', async () => {
                        await (0, expect_1.expect)(mint(wallet.address, -46080, -23040, 10000))
                            .to.emit(token1, 'Transfer')
                            .withArgs(wallet.address, pool.address, 2162)
                            .to.not.emit(token0, 'Transfer');
                        (0, expect_1.expect)(await token0.balanceOf(pool.address)).to.eq(9996);
                        (0, expect_1.expect)(await token1.balanceOf(pool.address)).to.eq(1000 + 2162);
                    });
                    it('min tick with max leverage', async () => {
                        await mint(wallet.address, minTick, minTick + tickSpacing, ethers_1.BigNumber.from(2).pow(102));
                        (0, expect_1.expect)(await token0.balanceOf(pool.address)).to.eq(9996);
                        (0, expect_1.expect)(await token1.balanceOf(pool.address)).to.eq(1000 + 828011520);
                    });
                    it('works for min tick', async () => {
                        await (0, expect_1.expect)(mint(wallet.address, minTick, -23040, 10000))
                            .to.emit(token1, 'Transfer')
                            .withArgs(wallet.address, pool.address, 3161);
                        (0, expect_1.expect)(await token0.balanceOf(pool.address)).to.eq(9996);
                        (0, expect_1.expect)(await token1.balanceOf(pool.address)).to.eq(1000 + 3161);
                    });
                    it('removing works', async () => {
                        await mint(wallet.address, -46080, -46020, 10000);
                        await pool.burn(-46080, -46020, 10000);
                        const { amount0, amount1 } = await pool.callStatic.collect(wallet.address, -46080, -46020, utilities_1.MaxUint128, utilities_1.MaxUint128);
                        (0, expect_1.expect)(amount0, 'amount0').to.eq(0);
                        (0, expect_1.expect)(amount1, 'amount1').to.eq(3);
                    });
                    it('does not write an observation', async () => {
                        (0, checkObservationEquals_1.default)(await pool.observations(0), {
                            tickCumulative: 0,
                            blockTimestamp: fixtures_1.TEST_POOL_START_TIME,
                            initialized: true,
                            secondsPerLiquidityCumulativeX128: 0,
                        });
                        await pool.advanceTime(1);
                        await mint(wallet.address, -46080, -23040, 100);
                        (0, checkObservationEquals_1.default)(await pool.observations(0), {
                            tickCumulative: 0,
                            blockTimestamp: fixtures_1.TEST_POOL_START_TIME,
                            initialized: true,
                            secondsPerLiquidityCumulativeX128: 0,
                        });
                    });
                });
            });
            it('protocol fees accumulate as expected during swap', async () => {
                await pool.setFeeProtocol(6, 6);
                await mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, (0, utilities_1.expandTo18Decimals)(1));
                await swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(10), wallet.address);
                await swapExact1For0((0, utilities_1.expandTo18Decimals)(1).div(100), wallet.address);
                let { token0: token0ProtocolFees, token1: token1ProtocolFees } = await pool.protocolFees();
                (0, expect_1.expect)(token0ProtocolFees).to.eq('50000000000000');
                (0, expect_1.expect)(token1ProtocolFees).to.eq('5000000000000');
            });
            it('positions are protected before protocol fee is turned on', async () => {
                await mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, (0, utilities_1.expandTo18Decimals)(1));
                await swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(10), wallet.address);
                await swapExact1For0((0, utilities_1.expandTo18Decimals)(1).div(100), wallet.address);
                let { token0: token0ProtocolFees, token1: token1ProtocolFees } = await pool.protocolFees();
                (0, expect_1.expect)(token0ProtocolFees).to.eq(0);
                (0, expect_1.expect)(token1ProtocolFees).to.eq(0);
                await pool.setFeeProtocol(6, 6);
                ({ token0: token0ProtocolFees, token1: token1ProtocolFees } = await pool.protocolFees());
                (0, expect_1.expect)(token0ProtocolFees).to.eq(0);
                (0, expect_1.expect)(token1ProtocolFees).to.eq(0);
            });
            it('poke is not allowed on uninitialized position', async () => {
                await mint(other.address, minTick + tickSpacing, maxTick - tickSpacing, (0, utilities_1.expandTo18Decimals)(1));
                await swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(10), wallet.address);
                await swapExact1For0((0, utilities_1.expandTo18Decimals)(1).div(100), wallet.address);
                // missing revert reason due to hardhat
                await (0, expect_1.expect)(pool.burn(minTick + tickSpacing, maxTick - tickSpacing, 0)).to.be.reverted;
                await mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, 1);
                let { liquidity, feeGrowthInside0LastX128, feeGrowthInside1LastX128, tokensOwed1, tokensOwed0 } = await pool.positions((0, utilities_1.getPositionKey)(wallet.address, minTick + tickSpacing, maxTick - tickSpacing));
                (0, expect_1.expect)(liquidity).to.eq(1);
                (0, expect_1.expect)(feeGrowthInside0LastX128).to.eq('102084710076281216349243831104605583');
                (0, expect_1.expect)(feeGrowthInside1LastX128).to.eq('10208471007628121634924383110460558');
                (0, expect_1.expect)(tokensOwed0, 'tokens owed 0 before').to.eq(0);
                (0, expect_1.expect)(tokensOwed1, 'tokens owed 1 before').to.eq(0);
                await pool.burn(minTick + tickSpacing, maxTick - tickSpacing, 1);
                ({ liquidity, feeGrowthInside0LastX128, feeGrowthInside1LastX128, tokensOwed1, tokensOwed0 } =
                    await pool.positions((0, utilities_1.getPositionKey)(wallet.address, minTick + tickSpacing, maxTick - tickSpacing)));
                (0, expect_1.expect)(liquidity).to.eq(0);
                (0, expect_1.expect)(feeGrowthInside0LastX128).to.eq('102084710076281216349243831104605583');
                (0, expect_1.expect)(feeGrowthInside1LastX128).to.eq('10208471007628121634924383110460558');
                (0, expect_1.expect)(tokensOwed0, 'tokens owed 0 after').to.eq(3);
                (0, expect_1.expect)(tokensOwed1, 'tokens owed 1 after').to.eq(0);
            });
        });
    });
    describe('#burn', () => {
        beforeEach('initialize at zero tick', () => initializeAtZeroTick(pool));
        async function checkTickIsClear(tick) {
            const { liquidityGross, feeGrowthOutside0X128, feeGrowthOutside1X128, liquidityNet } = await pool.ticks(tick);
            (0, expect_1.expect)(liquidityGross).to.eq(0);
            (0, expect_1.expect)(feeGrowthOutside0X128).to.eq(0);
            (0, expect_1.expect)(feeGrowthOutside1X128).to.eq(0);
            (0, expect_1.expect)(liquidityNet).to.eq(0);
        }
        async function checkTickIsNotClear(tick) {
            const { liquidityGross } = await pool.ticks(tick);
            (0, expect_1.expect)(liquidityGross).to.not.eq(0);
        }
        it('does not clear the position fee growth snapshot if no more liquidity', async () => {
            // some activity that would make the ticks non-zero
            await pool.advanceTime(10);
            await mint(other.address, minTick, maxTick, (0, utilities_1.expandTo18Decimals)(1));
            await swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address);
            await swapExact1For0((0, utilities_1.expandTo18Decimals)(1), wallet.address);
            await pool.connect(other).burn(minTick, maxTick, (0, utilities_1.expandTo18Decimals)(1));
            const { liquidity, tokensOwed0, tokensOwed1, feeGrowthInside0LastX128, feeGrowthInside1LastX128 } = await pool.positions((0, utilities_1.getPositionKey)(other.address, minTick, maxTick));
            (0, expect_1.expect)(liquidity).to.eq(0);
            (0, expect_1.expect)(tokensOwed0).to.not.eq(0);
            (0, expect_1.expect)(tokensOwed1).to.not.eq(0);
            (0, expect_1.expect)(feeGrowthInside0LastX128).to.eq('340282366920938463463374607431768211');
            (0, expect_1.expect)(feeGrowthInside1LastX128).to.eq('340282366920938576890830247744589365');
        });
        it('clears the tick if its the last position using it', async () => {
            const tickLower = minTick + tickSpacing;
            const tickUpper = maxTick - tickSpacing;
            // some activity that would make the ticks non-zero
            await pool.advanceTime(10);
            await mint(wallet.address, tickLower, tickUpper, 1);
            await swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address);
            await pool.burn(tickLower, tickUpper, 1);
            await checkTickIsClear(tickLower);
            await checkTickIsClear(tickUpper);
        });
        it('clears only the lower tick if upper is still used', async () => {
            const tickLower = minTick + tickSpacing;
            const tickUpper = maxTick - tickSpacing;
            // some activity that would make the ticks non-zero
            await pool.advanceTime(10);
            await mint(wallet.address, tickLower, tickUpper, 1);
            await mint(wallet.address, tickLower + tickSpacing, tickUpper, 1);
            await swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address);
            await pool.burn(tickLower, tickUpper, 1);
            await checkTickIsClear(tickLower);
            await checkTickIsNotClear(tickUpper);
        });
        it('clears only the upper tick if lower is still used', async () => {
            const tickLower = minTick + tickSpacing;
            const tickUpper = maxTick - tickSpacing;
            // some activity that would make the ticks non-zero
            await pool.advanceTime(10);
            await mint(wallet.address, tickLower, tickUpper, 1);
            await mint(wallet.address, tickLower, tickUpper - tickSpacing, 1);
            await swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address);
            await pool.burn(tickLower, tickUpper, 1);
            await checkTickIsNotClear(tickLower);
            await checkTickIsClear(tickUpper);
        });
    });
    // the combined amount of liquidity that the pool is initialized with (including the 1 minimum liquidity that is burned)
    const initializeLiquidityAmount = (0, utilities_1.expandTo18Decimals)(2);
    async function initializeAtZeroTick(pool) {
        await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
        const tickSpacing = await pool.tickSpacing();
        const [min, max] = [(0, utilities_1.getMinTick)(tickSpacing), (0, utilities_1.getMaxTick)(tickSpacing)];
        await mint(wallet.address, min, max, initializeLiquidityAmount);
    }
    describe('#observe', () => {
        beforeEach(() => initializeAtZeroTick(pool));
        // zero tick
        it('current tick accumulator increases by tick over time', async () => {
            let { tickCumulatives: [tickCumulative], } = await pool.observe([0]);
            (0, expect_1.expect)(tickCumulative).to.eq(0);
            await pool.advanceTime(10);
            ({
                tickCumulatives: [tickCumulative],
            } = await pool.observe([0]));
            (0, expect_1.expect)(tickCumulative).to.eq(0);
        });
        it('current tick accumulator after single swap', async () => {
            // moves to tick -1
            await swapExact0For1(1000, wallet.address);
            await pool.advanceTime(4);
            let { tickCumulatives: [tickCumulative], } = await pool.observe([0]);
            (0, expect_1.expect)(tickCumulative).to.eq(-4);
        });
        it('current tick accumulator after two swaps', async () => {
            await swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(2), wallet.address);
            (0, expect_1.expect)((await pool.slot0()).tick).to.eq(-4452);
            await pool.advanceTime(4);
            await swapExact1For0((0, utilities_1.expandTo18Decimals)(1).div(4), wallet.address);
            (0, expect_1.expect)((await pool.slot0()).tick).to.eq(-1558);
            await pool.advanceTime(6);
            let { tickCumulatives: [tickCumulative], } = await pool.observe([0]);
            // -4452*4 + -1558*6
            (0, expect_1.expect)(tickCumulative).to.eq(-27156);
        });
    });
    describe('miscellaneous mint tests', () => {
        beforeEach('initialize at zero tick', async () => {
            pool = await createPool(utilities_1.FeeAmount.LOW, utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.LOW]);
            await initializeAtZeroTick(pool);
        });
        it('mint to the right of the current price', async () => {
            const liquidityDelta = 1000;
            const lowerTick = tickSpacing;
            const upperTick = tickSpacing * 2;
            const liquidityBefore = await pool.liquidity();
            const b0 = await token0.balanceOf(pool.address);
            const b1 = await token1.balanceOf(pool.address);
            await mint(wallet.address, lowerTick, upperTick, liquidityDelta);
            const liquidityAfter = await pool.liquidity();
            (0, expect_1.expect)(liquidityAfter).to.be.gte(liquidityBefore);
            (0, expect_1.expect)((await token0.balanceOf(pool.address)).sub(b0)).to.eq(1);
            (0, expect_1.expect)((await token1.balanceOf(pool.address)).sub(b1)).to.eq(0);
        });
        it('mint to the left of the current price', async () => {
            const liquidityDelta = 1000;
            const lowerTick = -tickSpacing * 2;
            const upperTick = -tickSpacing;
            const liquidityBefore = await pool.liquidity();
            const b0 = await token0.balanceOf(pool.address);
            const b1 = await token1.balanceOf(pool.address);
            await mint(wallet.address, lowerTick, upperTick, liquidityDelta);
            const liquidityAfter = await pool.liquidity();
            (0, expect_1.expect)(liquidityAfter).to.be.gte(liquidityBefore);
            (0, expect_1.expect)((await token0.balanceOf(pool.address)).sub(b0)).to.eq(0);
            (0, expect_1.expect)((await token1.balanceOf(pool.address)).sub(b1)).to.eq(1);
        });
        it('mint within the current price', async () => {
            const liquidityDelta = 1000;
            const lowerTick = -tickSpacing;
            const upperTick = tickSpacing;
            const liquidityBefore = await pool.liquidity();
            const b0 = await token0.balanceOf(pool.address);
            const b1 = await token1.balanceOf(pool.address);
            await mint(wallet.address, lowerTick, upperTick, liquidityDelta);
            const liquidityAfter = await pool.liquidity();
            (0, expect_1.expect)(liquidityAfter).to.be.gte(liquidityBefore);
            (0, expect_1.expect)((await token0.balanceOf(pool.address)).sub(b0)).to.eq(1);
            (0, expect_1.expect)((await token1.balanceOf(pool.address)).sub(b1)).to.eq(1);
        });
        it('cannot remove more than the entire position', async () => {
            const lowerTick = -tickSpacing;
            const upperTick = tickSpacing;
            await mint(wallet.address, lowerTick, upperTick, (0, utilities_1.expandTo18Decimals)(1000));
            // should be 'LS', hardhat is bugged
            await (0, expect_1.expect)(pool.burn(lowerTick, upperTick, (0, utilities_1.expandTo18Decimals)(1001))).to.be.reverted;
        });
        it('collect fees within the current price after swap', async () => {
            const liquidityDelta = (0, utilities_1.expandTo18Decimals)(100);
            const lowerTick = -tickSpacing * 100;
            const upperTick = tickSpacing * 100;
            await mint(wallet.address, lowerTick, upperTick, liquidityDelta);
            const liquidityBefore = await pool.liquidity();
            const amount0In = (0, utilities_1.expandTo18Decimals)(1);
            await swapExact0For1(amount0In, wallet.address);
            const liquidityAfter = await pool.liquidity();
            (0, expect_1.expect)(liquidityAfter, 'k increases').to.be.gte(liquidityBefore);
            const token0BalanceBeforePool = await token0.balanceOf(pool.address);
            const token1BalanceBeforePool = await token1.balanceOf(pool.address);
            const token0BalanceBeforeWallet = await token0.balanceOf(wallet.address);
            const token1BalanceBeforeWallet = await token1.balanceOf(wallet.address);
            await pool.burn(lowerTick, upperTick, 0);
            await pool.collect(wallet.address, lowerTick, upperTick, utilities_1.MaxUint128, utilities_1.MaxUint128);
            await pool.burn(lowerTick, upperTick, 0);
            const { amount0: fees0, amount1: fees1 } = await pool.callStatic.collect(wallet.address, lowerTick, upperTick, utilities_1.MaxUint128, utilities_1.MaxUint128);
            (0, expect_1.expect)(fees0).to.be.eq(0);
            (0, expect_1.expect)(fees1).to.be.eq(0);
            const token0BalanceAfterWallet = await token0.balanceOf(wallet.address);
            const token1BalanceAfterWallet = await token1.balanceOf(wallet.address);
            const token0BalanceAfterPool = await token0.balanceOf(pool.address);
            const token1BalanceAfterPool = await token1.balanceOf(pool.address);
            (0, expect_1.expect)(token0BalanceAfterWallet).to.be.gt(token0BalanceBeforeWallet);
            (0, expect_1.expect)(token1BalanceAfterWallet).to.be.eq(token1BalanceBeforeWallet);
            (0, expect_1.expect)(token0BalanceAfterPool).to.be.lt(token0BalanceBeforePool);
            (0, expect_1.expect)(token1BalanceAfterPool).to.be.eq(token1BalanceBeforePool);
        });
    });
    describe('post-initialize at medium fee', () => {
        describe('k (implicit)', () => {
            it('returns 0 before initialization', async () => {
                (0, expect_1.expect)(await pool.liquidity()).to.eq(0);
            });
            describe('post initialized', () => {
                beforeEach(() => initializeAtZeroTick(pool));
                it('returns initial liquidity', async () => {
                    (0, expect_1.expect)(await pool.liquidity()).to.eq((0, utilities_1.expandTo18Decimals)(2));
                });
                it('returns in supply in range', async () => {
                    await mint(wallet.address, -tickSpacing, tickSpacing, (0, utilities_1.expandTo18Decimals)(3));
                    (0, expect_1.expect)(await pool.liquidity()).to.eq((0, utilities_1.expandTo18Decimals)(5));
                });
                it('excludes supply at tick above current tick', async () => {
                    await mint(wallet.address, tickSpacing, tickSpacing * 2, (0, utilities_1.expandTo18Decimals)(3));
                    (0, expect_1.expect)(await pool.liquidity()).to.eq((0, utilities_1.expandTo18Decimals)(2));
                });
                it('excludes supply at tick below current tick', async () => {
                    await mint(wallet.address, -tickSpacing * 2, -tickSpacing, (0, utilities_1.expandTo18Decimals)(3));
                    (0, expect_1.expect)(await pool.liquidity()).to.eq((0, utilities_1.expandTo18Decimals)(2));
                });
                it('updates correctly when exiting range', async () => {
                    const kBefore = await pool.liquidity();
                    (0, expect_1.expect)(kBefore).to.be.eq((0, utilities_1.expandTo18Decimals)(2));
                    // add liquidity at and above current tick
                    const liquidityDelta = (0, utilities_1.expandTo18Decimals)(1);
                    const lowerTick = 0;
                    const upperTick = tickSpacing;
                    await mint(wallet.address, lowerTick, upperTick, liquidityDelta);
                    // ensure virtual supply has increased appropriately
                    const kAfter = await pool.liquidity();
                    (0, expect_1.expect)(kAfter).to.be.eq((0, utilities_1.expandTo18Decimals)(3));
                    // swap toward the left (just enough for the tick transition function to trigger)
                    await swapExact0For1(1, wallet.address);
                    const { tick } = await pool.slot0();
                    (0, expect_1.expect)(tick).to.be.eq(-1);
                    const kAfterSwap = await pool.liquidity();
                    (0, expect_1.expect)(kAfterSwap).to.be.eq((0, utilities_1.expandTo18Decimals)(2));
                });
                it('updates correctly when entering range', async () => {
                    const kBefore = await pool.liquidity();
                    (0, expect_1.expect)(kBefore).to.be.eq((0, utilities_1.expandTo18Decimals)(2));
                    // add liquidity below the current tick
                    const liquidityDelta = (0, utilities_1.expandTo18Decimals)(1);
                    const lowerTick = -tickSpacing;
                    const upperTick = 0;
                    await mint(wallet.address, lowerTick, upperTick, liquidityDelta);
                    // ensure virtual supply hasn't changed
                    const kAfter = await pool.liquidity();
                    (0, expect_1.expect)(kAfter).to.be.eq(kBefore);
                    // swap toward the left (just enough for the tick transition function to trigger)
                    await swapExact0For1(1, wallet.address);
                    const { tick } = await pool.slot0();
                    (0, expect_1.expect)(tick).to.be.eq(-1);
                    const kAfterSwap = await pool.liquidity();
                    (0, expect_1.expect)(kAfterSwap).to.be.eq((0, utilities_1.expandTo18Decimals)(3));
                });
            });
        });
    });
    describe('limit orders', () => {
        beforeEach('initialize at tick 0', () => initializeAtZeroTick(pool));
        it('limit selling 0 for 1 at tick 0 thru 1', async () => {
            await (0, expect_1.expect)(mint(wallet.address, 0, 120, (0, utilities_1.expandTo18Decimals)(1)))
                .to.emit(token0, 'Transfer')
                .withArgs(wallet.address, pool.address, '5981737760509663');
            // somebody takes the limit order
            await swapExact1For0((0, utilities_1.expandTo18Decimals)(2), other.address);
            await (0, expect_1.expect)(pool.burn(0, 120, (0, utilities_1.expandTo18Decimals)(1)))
                .to.emit(pool, 'Burn')
                .withArgs(wallet.address, 0, 120, (0, utilities_1.expandTo18Decimals)(1), 0, '6017734268818165')
                .to.not.emit(token0, 'Transfer')
                .to.not.emit(token1, 'Transfer');
            await (0, expect_1.expect)(pool.collect(wallet.address, 0, 120, utilities_1.MaxUint128, utilities_1.MaxUint128))
                .to.emit(token1, 'Transfer')
                .withArgs(pool.address, wallet.address, ethers_1.BigNumber.from('6017734268818165').add('18107525382602')) // roughly 0.3% despite other liquidity
                .to.not.emit(token0, 'Transfer');
            (0, expect_1.expect)((await pool.slot0()).tick).to.be.gte(120);
        });
        it('limit selling 1 for 0 at tick 0 thru -1', async () => {
            await (0, expect_1.expect)(mint(wallet.address, -120, 0, (0, utilities_1.expandTo18Decimals)(1)))
                .to.emit(token1, 'Transfer')
                .withArgs(wallet.address, pool.address, '5981737760509663');
            // somebody takes the limit order
            await swapExact0For1((0, utilities_1.expandTo18Decimals)(2), other.address);
            await (0, expect_1.expect)(pool.burn(-120, 0, (0, utilities_1.expandTo18Decimals)(1)))
                .to.emit(pool, 'Burn')
                .withArgs(wallet.address, -120, 0, (0, utilities_1.expandTo18Decimals)(1), '6017734268818165', 0)
                .to.not.emit(token0, 'Transfer')
                .to.not.emit(token1, 'Transfer');
            await (0, expect_1.expect)(pool.collect(wallet.address, -120, 0, utilities_1.MaxUint128, utilities_1.MaxUint128))
                .to.emit(token0, 'Transfer')
                .withArgs(pool.address, wallet.address, ethers_1.BigNumber.from('6017734268818165').add('18107525382602')); // roughly 0.3% despite other liquidity
            (0, expect_1.expect)((await pool.slot0()).tick).to.be.lt(-120);
        });
        describe('fee is on', () => {
            beforeEach(() => pool.setFeeProtocol(6, 6));
            it('limit selling 0 for 1 at tick 0 thru 1', async () => {
                await (0, expect_1.expect)(mint(wallet.address, 0, 120, (0, utilities_1.expandTo18Decimals)(1)))
                    .to.emit(token0, 'Transfer')
                    .withArgs(wallet.address, pool.address, '5981737760509663');
                // somebody takes the limit order
                await swapExact1For0((0, utilities_1.expandTo18Decimals)(2), other.address);
                await (0, expect_1.expect)(pool.burn(0, 120, (0, utilities_1.expandTo18Decimals)(1)))
                    .to.emit(pool, 'Burn')
                    .withArgs(wallet.address, 0, 120, (0, utilities_1.expandTo18Decimals)(1), 0, '6017734268818165')
                    .to.not.emit(token0, 'Transfer')
                    .to.not.emit(token1, 'Transfer');
                await (0, expect_1.expect)(pool.collect(wallet.address, 0, 120, utilities_1.MaxUint128, utilities_1.MaxUint128))
                    .to.emit(token1, 'Transfer')
                    .withArgs(pool.address, wallet.address, ethers_1.BigNumber.from('6017734268818165').add('15089604485501')) // roughly 0.25% despite other liquidity
                    .to.not.emit(token0, 'Transfer');
                (0, expect_1.expect)((await pool.slot0()).tick).to.be.gte(120);
            });
            it('limit selling 1 for 0 at tick 0 thru -1', async () => {
                await (0, expect_1.expect)(mint(wallet.address, -120, 0, (0, utilities_1.expandTo18Decimals)(1)))
                    .to.emit(token1, 'Transfer')
                    .withArgs(wallet.address, pool.address, '5981737760509663');
                // somebody takes the limit order
                await swapExact0For1((0, utilities_1.expandTo18Decimals)(2), other.address);
                await (0, expect_1.expect)(pool.burn(-120, 0, (0, utilities_1.expandTo18Decimals)(1)))
                    .to.emit(pool, 'Burn')
                    .withArgs(wallet.address, -120, 0, (0, utilities_1.expandTo18Decimals)(1), '6017734268818165', 0)
                    .to.not.emit(token0, 'Transfer')
                    .to.not.emit(token1, 'Transfer');
                await (0, expect_1.expect)(pool.collect(wallet.address, -120, 0, utilities_1.MaxUint128, utilities_1.MaxUint128))
                    .to.emit(token0, 'Transfer')
                    .withArgs(pool.address, wallet.address, ethers_1.BigNumber.from('6017734268818165').add('15089604485501')); // roughly 0.25% despite other liquidity
                (0, expect_1.expect)((await pool.slot0()).tick).to.be.lt(-120);
            });
        });
    });
    describe('#collect', () => {
        beforeEach(async () => {
            pool = await createPool(utilities_1.FeeAmount.LOW, utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.LOW]);
            await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
        });
        it('works with multiple LPs', async () => {
            await mint(wallet.address, minTick, maxTick, (0, utilities_1.expandTo18Decimals)(1));
            await mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, (0, utilities_1.expandTo18Decimals)(2));
            await swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address);
            // poke positions
            await pool.burn(minTick, maxTick, 0);
            await pool.burn(minTick + tickSpacing, maxTick - tickSpacing, 0);
            const { tokensOwed0: tokensOwed0Position0 } = await pool.positions((0, utilities_1.getPositionKey)(wallet.address, minTick, maxTick));
            const { tokensOwed0: tokensOwed0Position1 } = await pool.positions((0, utilities_1.getPositionKey)(wallet.address, minTick + tickSpacing, maxTick - tickSpacing));
            (0, expect_1.expect)(tokensOwed0Position0).to.be.eq('166666666666667');
            (0, expect_1.expect)(tokensOwed0Position1).to.be.eq('333333333333334');
        });
        describe('works across large increases', () => {
            beforeEach(async () => {
                await mint(wallet.address, minTick, maxTick, (0, utilities_1.expandTo18Decimals)(1));
            });
            // type(uint128).max * 2**128 / 1e18
            // https://www.wolframalpha.com/input/?i=%282**128+-+1%29+*+2**128+%2F+1e18
            const magicNumber = ethers_1.BigNumber.from('115792089237316195423570985008687907852929702298719625575994');
            it('works just before the cap binds', async () => {
                await pool.setFeeGrowthGlobal0X128(magicNumber);
                await pool.burn(minTick, maxTick, 0);
                const { tokensOwed0, tokensOwed1 } = await pool.positions((0, utilities_1.getPositionKey)(wallet.address, minTick, maxTick));
                (0, expect_1.expect)(tokensOwed0).to.be.eq(utilities_1.MaxUint128.sub(1));
                (0, expect_1.expect)(tokensOwed1).to.be.eq(0);
            });
            it('works just after the cap binds', async () => {
                await pool.setFeeGrowthGlobal0X128(magicNumber.add(1));
                await pool.burn(minTick, maxTick, 0);
                const { tokensOwed0, tokensOwed1 } = await pool.positions((0, utilities_1.getPositionKey)(wallet.address, minTick, maxTick));
                (0, expect_1.expect)(tokensOwed0).to.be.eq(utilities_1.MaxUint128);
                (0, expect_1.expect)(tokensOwed1).to.be.eq(0);
            });
            it('works well after the cap binds', async () => {
                await pool.setFeeGrowthGlobal0X128(ethers_1.constants.MaxUint256);
                await pool.burn(minTick, maxTick, 0);
                const { tokensOwed0, tokensOwed1 } = await pool.positions((0, utilities_1.getPositionKey)(wallet.address, minTick, maxTick));
                (0, expect_1.expect)(tokensOwed0).to.be.eq(utilities_1.MaxUint128);
                (0, expect_1.expect)(tokensOwed1).to.be.eq(0);
            });
        });
        describe('works across overflow boundaries', () => {
            beforeEach(async () => {
                await pool.setFeeGrowthGlobal0X128(ethers_1.constants.MaxUint256);
                await pool.setFeeGrowthGlobal1X128(ethers_1.constants.MaxUint256);
                await mint(wallet.address, minTick, maxTick, (0, utilities_1.expandTo18Decimals)(10));
            });
            it('token0', async () => {
                await swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address);
                await pool.burn(minTick, maxTick, 0);
                const { amount0, amount1 } = await pool.callStatic.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128);
                (0, expect_1.expect)(amount0).to.be.eq('499999999999999');
                (0, expect_1.expect)(amount1).to.be.eq(0);
            });
            it('token1', async () => {
                await swapExact1For0((0, utilities_1.expandTo18Decimals)(1), wallet.address);
                await pool.burn(minTick, maxTick, 0);
                const { amount0, amount1 } = await pool.callStatic.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128);
                (0, expect_1.expect)(amount0).to.be.eq(0);
                (0, expect_1.expect)(amount1).to.be.eq('499999999999999');
            });
            it('token0 and token1', async () => {
                await swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address);
                await swapExact1For0((0, utilities_1.expandTo18Decimals)(1), wallet.address);
                await pool.burn(minTick, maxTick, 0);
                const { amount0, amount1 } = await pool.callStatic.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128);
                (0, expect_1.expect)(amount0).to.be.eq('499999999999999');
                (0, expect_1.expect)(amount1).to.be.eq('500000000000000');
            });
        });
    });
    describe('#feeProtocol', () => {
        const liquidityAmount = (0, utilities_1.expandTo18Decimals)(1000);
        beforeEach(async () => {
            pool = await createPool(utilities_1.FeeAmount.LOW, utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.LOW]);
            await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
            await mint(wallet.address, minTick, maxTick, liquidityAmount);
        });
        it('is initially set to 0', async () => {
            (0, expect_1.expect)((await pool.slot0()).feeProtocol).to.eq(0);
        });
        it('can be changed by the owner', async () => {
            await pool.setFeeProtocol(6, 6);
            (0, expect_1.expect)((await pool.slot0()).feeProtocol).to.eq(102);
        });
        it('cannot be changed out of bounds', async () => {
            await (0, expect_1.expect)(pool.setFeeProtocol(3, 3)).to.be.reverted;
            await (0, expect_1.expect)(pool.setFeeProtocol(11, 11)).to.be.reverted;
        });
        it('cannot be changed by addresses that are not owner', async () => {
            await (0, expect_1.expect)(pool.connect(other).setFeeProtocol(6, 6)).to.be.reverted;
        });
        async function swapAndGetFeesOwed({ amount, zeroForOne, poke, }) {
            await (zeroForOne ? swapExact0For1(amount, wallet.address) : swapExact1For0(amount, wallet.address));
            if (poke)
                await pool.burn(minTick, maxTick, 0);
            const { amount0: fees0, amount1: fees1 } = await pool.callStatic.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128);
            (0, expect_1.expect)(fees0, 'fees owed in token0 are greater than 0').to.be.gte(0);
            (0, expect_1.expect)(fees1, 'fees owed in token1 are greater than 0').to.be.gte(0);
            return { token0Fees: fees0, token1Fees: fees1 };
        }
        it('position owner gets full fees when protocol fee is off', async () => {
            const { token0Fees, token1Fees } = await swapAndGetFeesOwed({
                amount: (0, utilities_1.expandTo18Decimals)(1),
                zeroForOne: true,
                poke: true,
            });
            // 6 bips * 1e18
            (0, expect_1.expect)(token0Fees).to.eq('499999999999999');
            (0, expect_1.expect)(token1Fees).to.eq(0);
        });
        it('swap fees accumulate as expected (0 for 1)', async () => {
            let token0Fees;
            let token1Fees;
            ({ token0Fees, token1Fees } = await swapAndGetFeesOwed({
                amount: (0, utilities_1.expandTo18Decimals)(1),
                zeroForOne: true,
                poke: true,
            }));
            (0, expect_1.expect)(token0Fees).to.eq('499999999999999');
            (0, expect_1.expect)(token1Fees).to.eq(0);
            ({ token0Fees, token1Fees } = await swapAndGetFeesOwed({
                amount: (0, utilities_1.expandTo18Decimals)(1),
                zeroForOne: true,
                poke: true,
            }));
            (0, expect_1.expect)(token0Fees).to.eq('999999999999998');
            (0, expect_1.expect)(token1Fees).to.eq(0);
            ({ token0Fees, token1Fees } = await swapAndGetFeesOwed({
                amount: (0, utilities_1.expandTo18Decimals)(1),
                zeroForOne: true,
                poke: true,
            }));
            (0, expect_1.expect)(token0Fees).to.eq('1499999999999997');
            (0, expect_1.expect)(token1Fees).to.eq(0);
        });
        it('swap fees accumulate as expected (1 for 0)', async () => {
            let token0Fees;
            let token1Fees;
            ({ token0Fees, token1Fees } = await swapAndGetFeesOwed({
                amount: (0, utilities_1.expandTo18Decimals)(1),
                zeroForOne: false,
                poke: true,
            }));
            (0, expect_1.expect)(token0Fees).to.eq(0);
            (0, expect_1.expect)(token1Fees).to.eq('499999999999999');
            ({ token0Fees, token1Fees } = await swapAndGetFeesOwed({
                amount: (0, utilities_1.expandTo18Decimals)(1),
                zeroForOne: false,
                poke: true,
            }));
            (0, expect_1.expect)(token0Fees).to.eq(0);
            (0, expect_1.expect)(token1Fees).to.eq('999999999999998');
            ({ token0Fees, token1Fees } = await swapAndGetFeesOwed({
                amount: (0, utilities_1.expandTo18Decimals)(1),
                zeroForOne: false,
                poke: true,
            }));
            (0, expect_1.expect)(token0Fees).to.eq(0);
            (0, expect_1.expect)(token1Fees).to.eq('1499999999999997');
        });
        it('position owner gets partial fees when protocol fee is on', async () => {
            await pool.setFeeProtocol(6, 6);
            const { token0Fees, token1Fees } = await swapAndGetFeesOwed({
                amount: (0, utilities_1.expandTo18Decimals)(1),
                zeroForOne: true,
                poke: true,
            });
            (0, expect_1.expect)(token0Fees).to.be.eq('416666666666666');
            (0, expect_1.expect)(token1Fees).to.be.eq(0);
        });
        describe('#collectProtocol', () => {
            it('returns 0 if no fees', async () => {
                await pool.setFeeProtocol(6, 6);
                const { amount0, amount1 } = await pool.callStatic.collectProtocol(wallet.address, utilities_1.MaxUint128, utilities_1.MaxUint128);
                (0, expect_1.expect)(amount0).to.be.eq(0);
                (0, expect_1.expect)(amount1).to.be.eq(0);
            });
            it('can collect fees', async () => {
                await pool.setFeeProtocol(6, 6);
                await swapAndGetFeesOwed({
                    amount: (0, utilities_1.expandTo18Decimals)(1),
                    zeroForOne: true,
                    poke: true,
                });
                await (0, expect_1.expect)(pool.collectProtocol(other.address, utilities_1.MaxUint128, utilities_1.MaxUint128))
                    .to.emit(token0, 'Transfer')
                    .withArgs(pool.address, other.address, '83333333333332');
            });
            it('fees collected can differ between token0 and token1', async () => {
                await pool.setFeeProtocol(8, 5);
                await swapAndGetFeesOwed({
                    amount: (0, utilities_1.expandTo18Decimals)(1),
                    zeroForOne: true,
                    poke: false,
                });
                await swapAndGetFeesOwed({
                    amount: (0, utilities_1.expandTo18Decimals)(1),
                    zeroForOne: false,
                    poke: false,
                });
                await (0, expect_1.expect)(pool.collectProtocol(other.address, utilities_1.MaxUint128, utilities_1.MaxUint128))
                    .to.emit(token0, 'Transfer')
                    // more token0 fees because it's 1/5th the swap fees
                    .withArgs(pool.address, other.address, '62499999999999')
                    .to.emit(token1, 'Transfer')
                    // less token1 fees because it's 1/8th the swap fees
                    .withArgs(pool.address, other.address, '99999999999998');
            });
        });
        it('fees collected by lp after two swaps should be double one swap', async () => {
            await swapAndGetFeesOwed({
                amount: (0, utilities_1.expandTo18Decimals)(1),
                zeroForOne: true,
                poke: true,
            });
            const { token0Fees, token1Fees } = await swapAndGetFeesOwed({
                amount: (0, utilities_1.expandTo18Decimals)(1),
                zeroForOne: true,
                poke: true,
            });
            // 6 bips * 2e18
            (0, expect_1.expect)(token0Fees).to.eq('999999999999998');
            (0, expect_1.expect)(token1Fees).to.eq(0);
        });
        it('fees collected after two swaps with fee turned on in middle are fees from last swap (not confiscatory)', async () => {
            await swapAndGetFeesOwed({
                amount: (0, utilities_1.expandTo18Decimals)(1),
                zeroForOne: true,
                poke: false,
            });
            await pool.setFeeProtocol(6, 6);
            const { token0Fees, token1Fees } = await swapAndGetFeesOwed({
                amount: (0, utilities_1.expandTo18Decimals)(1),
                zeroForOne: true,
                poke: true,
            });
            (0, expect_1.expect)(token0Fees).to.eq('916666666666666');
            (0, expect_1.expect)(token1Fees).to.eq(0);
        });
        it('fees collected by lp after two swaps with intermediate withdrawal', async () => {
            await pool.setFeeProtocol(6, 6);
            const { token0Fees, token1Fees } = await swapAndGetFeesOwed({
                amount: (0, utilities_1.expandTo18Decimals)(1),
                zeroForOne: true,
                poke: true,
            });
            (0, expect_1.expect)(token0Fees).to.eq('416666666666666');
            (0, expect_1.expect)(token1Fees).to.eq(0);
            // collect the fees
            await pool.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128);
            const { token0Fees: token0FeesNext, token1Fees: token1FeesNext } = await swapAndGetFeesOwed({
                amount: (0, utilities_1.expandTo18Decimals)(1),
                zeroForOne: true,
                poke: false,
            });
            (0, expect_1.expect)(token0FeesNext).to.eq(0);
            (0, expect_1.expect)(token1FeesNext).to.eq(0);
            let { token0: token0ProtocolFees, token1: token1ProtocolFees } = await pool.protocolFees();
            (0, expect_1.expect)(token0ProtocolFees).to.eq('166666666666666');
            (0, expect_1.expect)(token1ProtocolFees).to.eq(0);
            await pool.burn(minTick, maxTick, 0); // poke to update fees
            await (0, expect_1.expect)(pool.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128))
                .to.emit(token0, 'Transfer')
                .withArgs(pool.address, wallet.address, '416666666666666');
            ({ token0: token0ProtocolFees, token1: token1ProtocolFees } = await pool.protocolFees());
            (0, expect_1.expect)(token0ProtocolFees).to.eq('166666666666666');
            (0, expect_1.expect)(token1ProtocolFees).to.eq(0);
        });
    });
    describe('#tickSpacing', () => {
        describe('tickSpacing = 12', () => {
            beforeEach('deploy pool', async () => {
                pool = await createPool(utilities_1.FeeAmount.MEDIUM, 12);
            });
            describe('post initialize', () => {
                beforeEach('initialize pool', async () => {
                    await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
                });
                it('mint can only be called for multiples of 12', async () => {
                    await (0, expect_1.expect)(mint(wallet.address, -6, 0, 1)).to.be.reverted;
                    await (0, expect_1.expect)(mint(wallet.address, 0, 6, 1)).to.be.reverted;
                });
                it('mint can be called with multiples of 12', async () => {
                    await mint(wallet.address, 12, 24, 1);
                    await mint(wallet.address, -144, -120, 1);
                });
                it('swapping across gaps works in 1 for 0 direction', async () => {
                    const liquidityAmount = (0, utilities_1.expandTo18Decimals)(1).div(4);
                    await mint(wallet.address, 120000, 121200, liquidityAmount);
                    await swapExact1For0((0, utilities_1.expandTo18Decimals)(1), wallet.address);
                    await (0, expect_1.expect)(pool.burn(120000, 121200, liquidityAmount))
                        .to.emit(pool, 'Burn')
                        .withArgs(wallet.address, 120000, 121200, liquidityAmount, '30027458295511', '996999999999999999')
                        .to.not.emit(token0, 'Transfer')
                        .to.not.emit(token1, 'Transfer');
                    (0, expect_1.expect)((await pool.slot0()).tick).to.eq(120196);
                });
                it('swapping across gaps works in 0 for 1 direction', async () => {
                    const liquidityAmount = (0, utilities_1.expandTo18Decimals)(1).div(4);
                    await mint(wallet.address, -121200, -120000, liquidityAmount);
                    await swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address);
                    await (0, expect_1.expect)(pool.burn(-121200, -120000, liquidityAmount))
                        .to.emit(pool, 'Burn')
                        .withArgs(wallet.address, -121200, -120000, liquidityAmount, '996999999999999999', '30027458295511')
                        .to.not.emit(token0, 'Transfer')
                        .to.not.emit(token1, 'Transfer');
                    (0, expect_1.expect)((await pool.slot0()).tick).to.eq(-120197);
                });
            });
        });
    });
    // https://github.com/Uniswap/uniswap-v3-core/issues/214
    it('tick transition cannot run twice if zero for one swap ends at fractional price just below tick', async () => {
        pool = await createPool(utilities_1.FeeAmount.MEDIUM, 1);
        const sqrtTickMath = (await (await hardhat_1.ethers.getContractFactory('TickMathTest')).deploy());
        const swapMath = (await (await hardhat_1.ethers.getContractFactory('SwapMathTest')).deploy());
        const p0 = (await sqrtTickMath.getSqrtRatioAtTick(-24081)).add(1);
        // initialize at a price of ~0.3 token1/token0
        // meaning if you swap in 2 token0, you should end up getting 0 token1
        await pool.initialize(p0);
        (0, expect_1.expect)(await pool.liquidity(), 'current pool liquidity is 1').to.eq(0);
        (0, expect_1.expect)((await pool.slot0()).tick, 'pool tick is -24081').to.eq(-24081);
        // add a bunch of liquidity around current price
        const liquidity = (0, utilities_1.expandTo18Decimals)(1000);
        await mint(wallet.address, -24082, -24080, liquidity);
        (0, expect_1.expect)(await pool.liquidity(), 'current pool liquidity is now liquidity + 1').to.eq(liquidity);
        await mint(wallet.address, -24082, -24081, liquidity);
        (0, expect_1.expect)(await pool.liquidity(), 'current pool liquidity is still liquidity + 1').to.eq(liquidity);
        // check the math works out to moving the price down 1, sending no amount out, and having some amount remaining
        {
            const { feeAmount, amountIn, amountOut, sqrtQ } = await swapMath.computeSwapStep(p0, p0.sub(1), liquidity, 3, utilities_1.FeeAmount.MEDIUM);
            (0, expect_1.expect)(sqrtQ, 'price moves').to.eq(p0.sub(1));
            (0, expect_1.expect)(feeAmount, 'fee amount is 1').to.eq(1);
            (0, expect_1.expect)(amountIn, 'amount in is 1').to.eq(1);
            (0, expect_1.expect)(amountOut, 'zero amount out').to.eq(0);
        }
        // swap 2 amount in, should get 0 amount out
        await (0, expect_1.expect)(swapExact0For1(3, wallet.address))
            .to.emit(token0, 'Transfer')
            .withArgs(wallet.address, pool.address, 3)
            .to.not.emit(token1, 'Transfer');
        const { tick, sqrtPriceX96 } = await pool.slot0();
        (0, expect_1.expect)(tick, 'pool is at the next tick').to.eq(-24082);
        (0, expect_1.expect)(sqrtPriceX96, 'pool price is still on the p0 boundary').to.eq(p0.sub(1));
        (0, expect_1.expect)(await pool.liquidity(), 'pool has run tick transition and liquidity changed').to.eq(liquidity.mul(2));
    });
    describe('#flash', () => {
        it('fails if not initialized', async () => {
            await (0, expect_1.expect)(flash(100, 200, other.address)).to.be.reverted;
            await (0, expect_1.expect)(flash(100, 0, other.address)).to.be.reverted;
            await (0, expect_1.expect)(flash(0, 200, other.address)).to.be.reverted;
        });
        it('fails if no liquidity', async () => {
            await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
            await (0, expect_1.expect)(flash(100, 200, other.address)).to.be.revertedWith('L');
            await (0, expect_1.expect)(flash(100, 0, other.address)).to.be.revertedWith('L');
            await (0, expect_1.expect)(flash(0, 200, other.address)).to.be.revertedWith('L');
        });
        describe('after liquidity added', () => {
            let balance0;
            let balance1;
            beforeEach('add some tokens', async () => {
                await initializeAtZeroTick(pool);
                [balance0, balance1] = await Promise.all([token0.balanceOf(pool.address), token1.balanceOf(pool.address)]);
            });
            describe('fee off', () => {
                it('emits an event', async () => {
                    await (0, expect_1.expect)(flash(1001, 2001, other.address))
                        .to.emit(pool, 'Flash')
                        .withArgs(swapTarget.address, other.address, 1001, 2001, 4, 7);
                });
                it('transfers the amount0 to the recipient', async () => {
                    await (0, expect_1.expect)(flash(100, 200, other.address))
                        .to.emit(token0, 'Transfer')
                        .withArgs(pool.address, other.address, 100);
                });
                it('transfers the amount1 to the recipient', async () => {
                    await (0, expect_1.expect)(flash(100, 200, other.address))
                        .to.emit(token1, 'Transfer')
                        .withArgs(pool.address, other.address, 200);
                });
                it('can flash only token0', async () => {
                    await (0, expect_1.expect)(flash(101, 0, other.address))
                        .to.emit(token0, 'Transfer')
                        .withArgs(pool.address, other.address, 101)
                        .to.not.emit(token1, 'Transfer');
                });
                it('can flash only token1', async () => {
                    await (0, expect_1.expect)(flash(0, 102, other.address))
                        .to.emit(token1, 'Transfer')
                        .withArgs(pool.address, other.address, 102)
                        .to.not.emit(token0, 'Transfer');
                });
                it('can flash entire token balance', async () => {
                    await (0, expect_1.expect)(flash(balance0, balance1, other.address))
                        .to.emit(token0, 'Transfer')
                        .withArgs(pool.address, other.address, balance0)
                        .to.emit(token1, 'Transfer')
                        .withArgs(pool.address, other.address, balance1);
                });
                it('no-op if both amounts are 0', async () => {
                    await (0, expect_1.expect)(flash(0, 0, other.address)).to.not.emit(token0, 'Transfer').to.not.emit(token1, 'Transfer');
                });
                it('fails if flash amount is greater than token balance', async () => {
                    await (0, expect_1.expect)(flash(balance0.add(1), balance1, other.address)).to.be.reverted;
                    await (0, expect_1.expect)(flash(balance0, balance1.add(1), other.address)).to.be.reverted;
                });
                it('calls the flash callback on the sender with correct fee amounts', async () => {
                    await (0, expect_1.expect)(flash(1001, 2002, other.address)).to.emit(swapTarget, 'FlashCallback').withArgs(4, 7);
                });
                it('increases the fee growth by the expected amount', async () => {
                    await flash(1001, 2002, other.address);
                    (0, expect_1.expect)(await pool.feeGrowthGlobal0X128()).to.eq(ethers_1.BigNumber.from(4).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                    (0, expect_1.expect)(await pool.feeGrowthGlobal1X128()).to.eq(ethers_1.BigNumber.from(7).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                });
                it('fails if original balance not returned in either token', async () => {
                    await (0, expect_1.expect)(flash(1000, 0, other.address, 999, 0)).to.be.reverted;
                    await (0, expect_1.expect)(flash(0, 1000, other.address, 0, 999)).to.be.reverted;
                });
                it('fails if underpays either token', async () => {
                    await (0, expect_1.expect)(flash(1000, 0, other.address, 1002, 0)).to.be.reverted;
                    await (0, expect_1.expect)(flash(0, 1000, other.address, 0, 1002)).to.be.reverted;
                });
                it('allows donating token0', async () => {
                    await (0, expect_1.expect)(flash(0, 0, ethers_1.constants.AddressZero, 567, 0))
                        .to.emit(token0, 'Transfer')
                        .withArgs(wallet.address, pool.address, 567)
                        .to.not.emit(token1, 'Transfer');
                    (0, expect_1.expect)(await pool.feeGrowthGlobal0X128()).to.eq(ethers_1.BigNumber.from(567).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                });
                it('allows donating token1', async () => {
                    await (0, expect_1.expect)(flash(0, 0, ethers_1.constants.AddressZero, 0, 678))
                        .to.emit(token1, 'Transfer')
                        .withArgs(wallet.address, pool.address, 678)
                        .to.not.emit(token0, 'Transfer');
                    (0, expect_1.expect)(await pool.feeGrowthGlobal1X128()).to.eq(ethers_1.BigNumber.from(678).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                });
                it('allows donating token0 and token1 together', async () => {
                    await (0, expect_1.expect)(flash(0, 0, ethers_1.constants.AddressZero, 789, 1234))
                        .to.emit(token0, 'Transfer')
                        .withArgs(wallet.address, pool.address, 789)
                        .to.emit(token1, 'Transfer')
                        .withArgs(wallet.address, pool.address, 1234);
                    (0, expect_1.expect)(await pool.feeGrowthGlobal0X128()).to.eq(ethers_1.BigNumber.from(789).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                    (0, expect_1.expect)(await pool.feeGrowthGlobal1X128()).to.eq(ethers_1.BigNumber.from(1234).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                });
            });
            describe('fee on', () => {
                beforeEach('turn protocol fee on', async () => {
                    await pool.setFeeProtocol(6, 6);
                });
                it('emits an event', async () => {
                    await (0, expect_1.expect)(flash(1001, 2001, other.address))
                        .to.emit(pool, 'Flash')
                        .withArgs(swapTarget.address, other.address, 1001, 2001, 4, 7);
                });
                it('increases the fee growth by the expected amount', async () => {
                    await flash(2002, 4004, other.address);
                    const { token0: token0ProtocolFees, token1: token1ProtocolFees } = await pool.protocolFees();
                    (0, expect_1.expect)(token0ProtocolFees).to.eq(1);
                    (0, expect_1.expect)(token1ProtocolFees).to.eq(2);
                    (0, expect_1.expect)(await pool.feeGrowthGlobal0X128()).to.eq(ethers_1.BigNumber.from(6).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                    (0, expect_1.expect)(await pool.feeGrowthGlobal1X128()).to.eq(ethers_1.BigNumber.from(11).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                });
                it('allows donating token0', async () => {
                    await (0, expect_1.expect)(flash(0, 0, ethers_1.constants.AddressZero, 567, 0))
                        .to.emit(token0, 'Transfer')
                        .withArgs(wallet.address, pool.address, 567)
                        .to.not.emit(token1, 'Transfer');
                    const { token0: token0ProtocolFees } = await pool.protocolFees();
                    (0, expect_1.expect)(token0ProtocolFees).to.eq(94);
                    (0, expect_1.expect)(await pool.feeGrowthGlobal0X128()).to.eq(ethers_1.BigNumber.from(473).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                });
                it('allows donating token1', async () => {
                    await (0, expect_1.expect)(flash(0, 0, ethers_1.constants.AddressZero, 0, 678))
                        .to.emit(token1, 'Transfer')
                        .withArgs(wallet.address, pool.address, 678)
                        .to.not.emit(token0, 'Transfer');
                    const { token1: token1ProtocolFees } = await pool.protocolFees();
                    (0, expect_1.expect)(token1ProtocolFees).to.eq(113);
                    (0, expect_1.expect)(await pool.feeGrowthGlobal1X128()).to.eq(ethers_1.BigNumber.from(565).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                });
                it('allows donating token0 and token1 together', async () => {
                    await (0, expect_1.expect)(flash(0, 0, ethers_1.constants.AddressZero, 789, 1234))
                        .to.emit(token0, 'Transfer')
                        .withArgs(wallet.address, pool.address, 789)
                        .to.emit(token1, 'Transfer')
                        .withArgs(wallet.address, pool.address, 1234);
                    const { token0: token0ProtocolFees, token1: token1ProtocolFees } = await pool.protocolFees();
                    (0, expect_1.expect)(token0ProtocolFees).to.eq(131);
                    (0, expect_1.expect)(token1ProtocolFees).to.eq(205);
                    (0, expect_1.expect)(await pool.feeGrowthGlobal0X128()).to.eq(ethers_1.BigNumber.from(658).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                    (0, expect_1.expect)(await pool.feeGrowthGlobal1X128()).to.eq(ethers_1.BigNumber.from(1029).mul(ethers_1.BigNumber.from(2).pow(128)).div((0, utilities_1.expandTo18Decimals)(2)));
                });
            });
        });
    });
    describe('#increaseObservationCardinalityNext', () => {
        it('cannot be called before initialization', async () => {
            await (0, expect_1.expect)(pool.increaseObservationCardinalityNext(2)).to.be.reverted;
        });
        describe('after initialization', () => {
            beforeEach('initialize the pool', () => pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1)));
            it('oracle starting state after initialization', async () => {
                const { observationCardinality, observationIndex, observationCardinalityNext } = await pool.slot0();
                (0, expect_1.expect)(observationCardinality).to.eq(1);
                (0, expect_1.expect)(observationIndex).to.eq(0);
                (0, expect_1.expect)(observationCardinalityNext).to.eq(1);
                const { secondsPerLiquidityCumulativeX128, tickCumulative, initialized, blockTimestamp } = await pool.observations(0);
                (0, expect_1.expect)(secondsPerLiquidityCumulativeX128).to.eq(0);
                (0, expect_1.expect)(tickCumulative).to.eq(0);
                (0, expect_1.expect)(initialized).to.eq(true);
                (0, expect_1.expect)(blockTimestamp).to.eq(fixtures_1.TEST_POOL_START_TIME);
            });
            it('increases observation cardinality next', async () => {
                await pool.increaseObservationCardinalityNext(2);
                const { observationCardinality, observationIndex, observationCardinalityNext } = await pool.slot0();
                (0, expect_1.expect)(observationCardinality).to.eq(1);
                (0, expect_1.expect)(observationIndex).to.eq(0);
                (0, expect_1.expect)(observationCardinalityNext).to.eq(2);
            });
            it('is no op if target is already exceeded', async () => {
                await pool.increaseObservationCardinalityNext(5);
                await pool.increaseObservationCardinalityNext(3);
                const { observationCardinality, observationIndex, observationCardinalityNext } = await pool.slot0();
                (0, expect_1.expect)(observationCardinality).to.eq(1);
                (0, expect_1.expect)(observationIndex).to.eq(0);
                (0, expect_1.expect)(observationCardinalityNext).to.eq(5);
            });
        });
    });
    describe('#setFeeProtocol', () => {
        beforeEach('initialize the pool', async () => {
            await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
        });
        it('can only be called by factory owner', async () => {
            await (0, expect_1.expect)(pool.connect(other).setFeeProtocol(5, 5)).to.be.reverted;
        });
        it('fails if fee is lt 4 or gt 10', async () => {
            await (0, expect_1.expect)(pool.setFeeProtocol(3, 3)).to.be.reverted;
            await (0, expect_1.expect)(pool.setFeeProtocol(6, 3)).to.be.reverted;
            await (0, expect_1.expect)(pool.setFeeProtocol(3, 6)).to.be.reverted;
            await (0, expect_1.expect)(pool.setFeeProtocol(11, 11)).to.be.reverted;
            await (0, expect_1.expect)(pool.setFeeProtocol(6, 11)).to.be.reverted;
            await (0, expect_1.expect)(pool.setFeeProtocol(11, 6)).to.be.reverted;
        });
        it('succeeds for fee of 4', async () => {
            await pool.setFeeProtocol(4, 4);
        });
        it('succeeds for fee of 10', async () => {
            await pool.setFeeProtocol(10, 10);
        });
        it('sets protocol fee', async () => {
            await pool.setFeeProtocol(7, 7);
            (0, expect_1.expect)((await pool.slot0()).feeProtocol).to.eq(119);
        });
        it('can change protocol fee', async () => {
            await pool.setFeeProtocol(7, 7);
            await pool.setFeeProtocol(5, 8);
            (0, expect_1.expect)((await pool.slot0()).feeProtocol).to.eq(133);
        });
        it('can turn off protocol fee', async () => {
            await pool.setFeeProtocol(4, 4);
            await pool.setFeeProtocol(0, 0);
            (0, expect_1.expect)((await pool.slot0()).feeProtocol).to.eq(0);
        });
        it('emits an event when turned on', async () => {
            await (0, expect_1.expect)(pool.setFeeProtocol(7, 7)).to.be.emit(pool, 'SetFeeProtocol').withArgs(0, 0, 7, 7);
        });
        it('emits an event when turned off', async () => {
            await pool.setFeeProtocol(7, 5);
            await (0, expect_1.expect)(pool.setFeeProtocol(0, 0)).to.be.emit(pool, 'SetFeeProtocol').withArgs(7, 5, 0, 0);
        });
        it('emits an event when changed', async () => {
            await pool.setFeeProtocol(4, 10);
            await (0, expect_1.expect)(pool.setFeeProtocol(6, 8)).to.be.emit(pool, 'SetFeeProtocol').withArgs(4, 10, 6, 8);
        });
        it('emits an event when unchanged', async () => {
            await pool.setFeeProtocol(5, 9);
            await (0, expect_1.expect)(pool.setFeeProtocol(5, 9)).to.be.emit(pool, 'SetFeeProtocol').withArgs(5, 9, 5, 9);
        });
    });
    describe('#lock', () => {
        beforeEach('initialize the pool', async () => {
            await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
            await mint(wallet.address, minTick, maxTick, (0, utilities_1.expandTo18Decimals)(1));
        });
        it('cannot reenter from swap callback', async () => {
            const reentrant = (await (await hardhat_1.ethers.getContractFactory('TestUniswapV3ReentrantCallee')).deploy());
            // the tests happen in solidity
            await (0, expect_1.expect)(reentrant.swapToReenter(pool.address)).to.be.revertedWith('Unable to reenter');
        });
    });
    describe('#snapshotCumulativesInside', () => {
        const tickLower = -utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM];
        const tickUpper = utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM];
        const tickSpacing = utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM];
        beforeEach(async () => {
            await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
            await mint(wallet.address, tickLower, tickUpper, 10);
        });
        it('throws if ticks are in reverse order', async () => {
            await (0, expect_1.expect)(pool.snapshotCumulativesInside(tickUpper, tickLower)).to.be.reverted;
        });
        it('throws if ticks are the same', async () => {
            await (0, expect_1.expect)(pool.snapshotCumulativesInside(tickUpper, tickUpper)).to.be.reverted;
        });
        it('throws if tick lower is too low', async () => {
            await (0, expect_1.expect)(pool.snapshotCumulativesInside((0, utilities_1.getMinTick)(tickSpacing) - 1, tickUpper)).be.reverted;
        });
        it('throws if tick upper is too high', async () => {
            await (0, expect_1.expect)(pool.snapshotCumulativesInside(tickLower, (0, utilities_1.getMaxTick)(tickSpacing) + 1)).be.reverted;
        });
        it('throws if tick lower is not initialized', async () => {
            await (0, expect_1.expect)(pool.snapshotCumulativesInside(tickLower - tickSpacing, tickUpper)).to.be.reverted;
        });
        it('throws if tick upper is not initialized', async () => {
            await (0, expect_1.expect)(pool.snapshotCumulativesInside(tickLower, tickUpper + tickSpacing)).to.be.reverted;
        });
        it('is zero immediately after initialize', async () => {
            const { secondsPerLiquidityInsideX128, tickCumulativeInside, secondsInside } = await pool.snapshotCumulativesInside(tickLower, tickUpper);
            (0, expect_1.expect)(secondsPerLiquidityInsideX128).to.eq(0);
            (0, expect_1.expect)(tickCumulativeInside).to.eq(0);
            (0, expect_1.expect)(secondsInside).to.eq(0);
        });
        it('increases by expected amount when time elapses in the range', async () => {
            await pool.advanceTime(5);
            const { secondsPerLiquidityInsideX128, tickCumulativeInside, secondsInside } = await pool.snapshotCumulativesInside(tickLower, tickUpper);
            (0, expect_1.expect)(secondsPerLiquidityInsideX128).to.eq(ethers_1.BigNumber.from(5).shl(128).div(10));
            (0, expect_1.expect)(tickCumulativeInside, 'tickCumulativeInside').to.eq(0);
            (0, expect_1.expect)(secondsInside).to.eq(5);
        });
        it('does not account for time increase above range', async () => {
            await pool.advanceTime(5);
            await swapToHigherPrice((0, utilities_1.encodePriceSqrt)(2, 1), wallet.address);
            await pool.advanceTime(7);
            const { secondsPerLiquidityInsideX128, tickCumulativeInside, secondsInside } = await pool.snapshotCumulativesInside(tickLower, tickUpper);
            (0, expect_1.expect)(secondsPerLiquidityInsideX128).to.eq(ethers_1.BigNumber.from(5).shl(128).div(10));
            (0, expect_1.expect)(tickCumulativeInside, 'tickCumulativeInside').to.eq(0);
            (0, expect_1.expect)(secondsInside).to.eq(5);
        });
        it('does not account for time increase below range', async () => {
            await pool.advanceTime(5);
            await swapToLowerPrice((0, utilities_1.encodePriceSqrt)(1, 2), wallet.address);
            await pool.advanceTime(7);
            const { secondsPerLiquidityInsideX128, tickCumulativeInside, secondsInside } = await pool.snapshotCumulativesInside(tickLower, tickUpper);
            (0, expect_1.expect)(secondsPerLiquidityInsideX128).to.eq(ethers_1.BigNumber.from(5).shl(128).div(10));
            // tick is 0 for 5 seconds, then not in range
            (0, expect_1.expect)(tickCumulativeInside, 'tickCumulativeInside').to.eq(0);
            (0, expect_1.expect)(secondsInside).to.eq(5);
        });
        it('time increase below range is not counted', async () => {
            await swapToLowerPrice((0, utilities_1.encodePriceSqrt)(1, 2), wallet.address);
            await pool.advanceTime(5);
            await swapToHigherPrice((0, utilities_1.encodePriceSqrt)(1, 1), wallet.address);
            await pool.advanceTime(7);
            const { secondsPerLiquidityInsideX128, tickCumulativeInside, secondsInside } = await pool.snapshotCumulativesInside(tickLower, tickUpper);
            (0, expect_1.expect)(secondsPerLiquidityInsideX128).to.eq(ethers_1.BigNumber.from(7).shl(128).div(10));
            // tick is not in range then tick is 0 for 7 seconds
            (0, expect_1.expect)(tickCumulativeInside, 'tickCumulativeInside').to.eq(0);
            (0, expect_1.expect)(secondsInside).to.eq(7);
        });
        it('time increase above range is not counted', async () => {
            await swapToHigherPrice((0, utilities_1.encodePriceSqrt)(2, 1), wallet.address);
            await pool.advanceTime(5);
            await swapToLowerPrice((0, utilities_1.encodePriceSqrt)(1, 1), wallet.address);
            await pool.advanceTime(7);
            const { secondsPerLiquidityInsideX128, tickCumulativeInside, secondsInside } = await pool.snapshotCumulativesInside(tickLower, tickUpper);
            (0, expect_1.expect)(secondsPerLiquidityInsideX128).to.eq(ethers_1.BigNumber.from(7).shl(128).div(10));
            (0, expect_1.expect)((await pool.slot0()).tick).to.eq(-1); // justify the -7 tick cumulative inside value
            (0, expect_1.expect)(tickCumulativeInside, 'tickCumulativeInside').to.eq(-7);
            (0, expect_1.expect)(secondsInside).to.eq(7);
        });
        it('positions minted after time spent', async () => {
            await pool.advanceTime(5);
            await mint(wallet.address, tickUpper, (0, utilities_1.getMaxTick)(tickSpacing), 15);
            await swapToHigherPrice((0, utilities_1.encodePriceSqrt)(2, 1), wallet.address);
            await pool.advanceTime(8);
            const { secondsPerLiquidityInsideX128, tickCumulativeInside, secondsInside } = await pool.snapshotCumulativesInside(tickUpper, (0, utilities_1.getMaxTick)(tickSpacing));
            (0, expect_1.expect)(secondsPerLiquidityInsideX128).to.eq(ethers_1.BigNumber.from(8).shl(128).div(15));
            // the tick of 2/1 is 6931
            // 8 seconds * 6931 = 55448
            (0, expect_1.expect)(tickCumulativeInside, 'tickCumulativeInside').to.eq(55448);
            (0, expect_1.expect)(secondsInside).to.eq(8);
        });
        it('overlapping liquidity is aggregated', async () => {
            await mint(wallet.address, tickLower, (0, utilities_1.getMaxTick)(tickSpacing), 15);
            await pool.advanceTime(5);
            await swapToHigherPrice((0, utilities_1.encodePriceSqrt)(2, 1), wallet.address);
            await pool.advanceTime(8);
            const { secondsPerLiquidityInsideX128, tickCumulativeInside, secondsInside } = await pool.snapshotCumulativesInside(tickLower, tickUpper);
            (0, expect_1.expect)(secondsPerLiquidityInsideX128).to.eq(ethers_1.BigNumber.from(5).shl(128).div(25));
            (0, expect_1.expect)(tickCumulativeInside, 'tickCumulativeInside').to.eq(0);
            (0, expect_1.expect)(secondsInside).to.eq(5);
        });
        it('relative behavior of snapshots', async () => {
            await pool.advanceTime(5);
            await mint(wallet.address, (0, utilities_1.getMinTick)(tickSpacing), tickLower, 15);
            const { secondsPerLiquidityInsideX128: secondsPerLiquidityInsideX128Start, tickCumulativeInside: tickCumulativeInsideStart, secondsInside: secondsInsideStart, } = await pool.snapshotCumulativesInside((0, utilities_1.getMinTick)(tickSpacing), tickLower);
            await pool.advanceTime(8);
            // 13 seconds in starting range, then 3 seconds in newly minted range
            await swapToLowerPrice((0, utilities_1.encodePriceSqrt)(1, 2), wallet.address);
            await pool.advanceTime(3);
            const { secondsPerLiquidityInsideX128, tickCumulativeInside, secondsInside } = await pool.snapshotCumulativesInside((0, utilities_1.getMinTick)(tickSpacing), tickLower);
            const expectedDiffSecondsPerLiquidity = ethers_1.BigNumber.from(3).shl(128).div(15);
            (0, expect_1.expect)(secondsPerLiquidityInsideX128.sub(secondsPerLiquidityInsideX128Start)).to.eq(expectedDiffSecondsPerLiquidity);
            (0, expect_1.expect)(secondsPerLiquidityInsideX128).to.not.eq(expectedDiffSecondsPerLiquidity);
            // the tick is the one corresponding to the price of 1/2, or log base 1.0001 of 0.5
            // this is -6932, and 3 seconds have passed, so the cumulative computed from the diff equals 6932 * 3
            (0, expect_1.expect)(tickCumulativeInside.sub(tickCumulativeInsideStart), 'tickCumulativeInside').to.eq(-20796);
            (0, expect_1.expect)(secondsInside - secondsInsideStart).to.eq(3);
            (0, expect_1.expect)(secondsInside).to.not.eq(3);
        });
    });
    describe('fees overflow scenarios', async () => {
        it('up to max uint 128', async () => {
            await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
            await mint(wallet.address, minTick, maxTick, 1);
            await flash(0, 0, wallet.address, utilities_1.MaxUint128, utilities_1.MaxUint128);
            const [feeGrowthGlobal0X128, feeGrowthGlobal1X128] = await Promise.all([
                pool.feeGrowthGlobal0X128(),
                pool.feeGrowthGlobal1X128(),
            ]);
            // all 1s in first 128 bits
            (0, expect_1.expect)(feeGrowthGlobal0X128).to.eq(utilities_1.MaxUint128.shl(128));
            (0, expect_1.expect)(feeGrowthGlobal1X128).to.eq(utilities_1.MaxUint128.shl(128));
            await pool.burn(minTick, maxTick, 0);
            const { amount0, amount1 } = await pool.callStatic.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128);
            (0, expect_1.expect)(amount0).to.eq(utilities_1.MaxUint128);
            (0, expect_1.expect)(amount1).to.eq(utilities_1.MaxUint128);
        });
        it('overflow max uint 128', async () => {
            await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
            await mint(wallet.address, minTick, maxTick, 1);
            await flash(0, 0, wallet.address, utilities_1.MaxUint128, utilities_1.MaxUint128);
            await flash(0, 0, wallet.address, 1, 1);
            const [feeGrowthGlobal0X128, feeGrowthGlobal1X128] = await Promise.all([
                pool.feeGrowthGlobal0X128(),
                pool.feeGrowthGlobal1X128(),
            ]);
            // all 1s in first 128 bits
            (0, expect_1.expect)(feeGrowthGlobal0X128).to.eq(0);
            (0, expect_1.expect)(feeGrowthGlobal1X128).to.eq(0);
            await pool.burn(minTick, maxTick, 0);
            const { amount0, amount1 } = await pool.callStatic.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128);
            // fees burned
            (0, expect_1.expect)(amount0).to.eq(0);
            (0, expect_1.expect)(amount1).to.eq(0);
        });
        it('overflow max uint 128 after poke burns fees owed to 0', async () => {
            await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
            await mint(wallet.address, minTick, maxTick, 1);
            await flash(0, 0, wallet.address, utilities_1.MaxUint128, utilities_1.MaxUint128);
            await pool.burn(minTick, maxTick, 0);
            await flash(0, 0, wallet.address, 1, 1);
            await pool.burn(minTick, maxTick, 0);
            const { amount0, amount1 } = await pool.callStatic.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128);
            // fees burned
            (0, expect_1.expect)(amount0).to.eq(0);
            (0, expect_1.expect)(amount1).to.eq(0);
        });
        it('two positions at the same snapshot', async () => {
            await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
            await mint(wallet.address, minTick, maxTick, 1);
            await mint(other.address, minTick, maxTick, 1);
            await flash(0, 0, wallet.address, utilities_1.MaxUint128, 0);
            await flash(0, 0, wallet.address, utilities_1.MaxUint128, 0);
            const feeGrowthGlobal0X128 = await pool.feeGrowthGlobal0X128();
            (0, expect_1.expect)(feeGrowthGlobal0X128).to.eq(utilities_1.MaxUint128.shl(128));
            await flash(0, 0, wallet.address, 2, 0);
            await pool.burn(minTick, maxTick, 0);
            await pool.connect(other).burn(minTick, maxTick, 0);
            let { amount0 } = await pool.callStatic.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128);
            (0, expect_1.expect)(amount0, 'amount0 of wallet').to.eq(0);
            ({ amount0 } = await pool
                .connect(other)
                .callStatic.collect(other.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128));
            (0, expect_1.expect)(amount0, 'amount0 of other').to.eq(0);
        });
        it('two positions 1 wei of fees apart overflows exactly once', async () => {
            await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
            await mint(wallet.address, minTick, maxTick, 1);
            await flash(0, 0, wallet.address, 1, 0);
            await mint(other.address, minTick, maxTick, 1);
            await flash(0, 0, wallet.address, utilities_1.MaxUint128, 0);
            await flash(0, 0, wallet.address, utilities_1.MaxUint128, 0);
            const feeGrowthGlobal0X128 = await pool.feeGrowthGlobal0X128();
            (0, expect_1.expect)(feeGrowthGlobal0X128).to.eq(0);
            await flash(0, 0, wallet.address, 2, 0);
            await pool.burn(minTick, maxTick, 0);
            await pool.connect(other).burn(minTick, maxTick, 0);
            let { amount0 } = await pool.callStatic.collect(wallet.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128);
            (0, expect_1.expect)(amount0, 'amount0 of wallet').to.eq(1);
            ({ amount0 } = await pool
                .connect(other)
                .callStatic.collect(other.address, minTick, maxTick, utilities_1.MaxUint128, utilities_1.MaxUint128));
            (0, expect_1.expect)(amount0, 'amount0 of other').to.eq(0);
        });
    });
    describe('swap underpayment tests', () => {
        let underpay;
        beforeEach('deploy swap test', async () => {
            const underpayFactory = await hardhat_1.ethers.getContractFactory('TestUniswapV3SwapPay');
            underpay = (await underpayFactory.deploy());
            await token0.approve(underpay.address, ethers_1.constants.MaxUint256);
            await token1.approve(underpay.address, ethers_1.constants.MaxUint256);
            await pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
            await mint(wallet.address, minTick, maxTick, (0, utilities_1.expandTo18Decimals)(1));
        });
        it('underpay zero for one and exact in', async () => {
            await (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, true, utilities_1.MIN_SQRT_RATIO.add(1), 1000, 1, 0)).to.be.revertedWith('IIA');
        });
        it('pay in the wrong token zero for one and exact in', async () => {
            await (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, true, utilities_1.MIN_SQRT_RATIO.add(1), 1000, 0, 2000)).to.be.revertedWith('IIA');
        });
        it('overpay zero for one and exact in', async () => {
            await (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, true, utilities_1.MIN_SQRT_RATIO.add(1), 1000, 2000, 0)).to.not.be.revertedWith('IIA');
        });
        it('underpay zero for one and exact out', async () => {
            await (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, true, utilities_1.MIN_SQRT_RATIO.add(1), -1000, 1, 0)).to.be.revertedWith('IIA');
        });
        it('pay in the wrong token zero for one and exact out', async () => {
            await (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, true, utilities_1.MIN_SQRT_RATIO.add(1), -1000, 0, 2000)).to.be.revertedWith('IIA');
        });
        it('overpay zero for one and exact out', async () => {
            await (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, true, utilities_1.MIN_SQRT_RATIO.add(1), -1000, 2000, 0)).to.not.be.revertedWith('IIA');
        });
        it('underpay one for zero and exact in', async () => {
            await (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, false, utilities_1.MAX_SQRT_RATIO.sub(1), 1000, 0, 1)).to.be.revertedWith('IIA');
        });
        it('pay in the wrong token one for zero and exact in', async () => {
            await (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, false, utilities_1.MAX_SQRT_RATIO.sub(1), 1000, 2000, 0)).to.be.revertedWith('IIA');
        });
        it('overpay one for zero and exact in', async () => {
            await (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, false, utilities_1.MAX_SQRT_RATIO.sub(1), 1000, 0, 2000)).to.not.be.revertedWith('IIA');
        });
        it('underpay one for zero and exact out', async () => {
            await (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, false, utilities_1.MAX_SQRT_RATIO.sub(1), -1000, 0, 1)).to.be.revertedWith('IIA');
        });
        it('pay in the wrong token one for zero and exact out', async () => {
            await (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, false, utilities_1.MAX_SQRT_RATIO.sub(1), -1000, 2000, 0)).to.be.revertedWith('IIA');
        });
        it('overpay one for zero and exact out', async () => {
            await (0, expect_1.expect)(underpay.swap(pool.address, wallet.address, false, utilities_1.MAX_SQRT_RATIO.sub(1), -1000, 0, 2000)).to.not.be.revertedWith('IIA');
        });
    });
});
