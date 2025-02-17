"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const expect_1 = require("./shared/expect");
const fixtures_1 = require("./shared/fixtures");
const utilities_1 = require("./shared/utilities");
const feeAmount = utilities_1.FeeAmount.MEDIUM;
const tickSpacing = utilities_1.TICK_SPACINGS[feeAmount];
const createFixtureLoader = hardhat_1.waffle.createFixtureLoader;
describe('UniswapV3Pool', () => {
    let wallet, other;
    let token0;
    let token1;
    let token2;
    let factory;
    let pool0;
    let pool1;
    let pool0Functions;
    let pool1Functions;
    let minTick;
    let maxTick;
    let swapTargetCallee;
    let swapTargetRouter;
    let loadFixture;
    let createPool;
    before('create fixture loader', async () => {
        ;
        [wallet, other] = await hardhat_1.ethers.getSigners();
        loadFixture = createFixtureLoader([wallet, other]);
    });
    beforeEach('deploy first fixture', async () => {
        ;
        ({ token0, token1, token2, factory, createPool, swapTargetCallee, swapTargetRouter } = await loadFixture(fixtures_1.poolFixture));
        const createPoolWrapped = async (amount, spacing, firstToken, secondToken) => {
            const pool = await createPool(amount, spacing, firstToken, secondToken);
            const poolFunctions = (0, utilities_1.createPoolFunctions)({
                swapTarget: swapTargetCallee,
                token0: firstToken,
                token1: secondToken,
                pool,
            });
            minTick = (0, utilities_1.getMinTick)(spacing);
            maxTick = (0, utilities_1.getMaxTick)(spacing);
            return [pool, poolFunctions];
        };
        [pool0, pool0Functions] = await createPoolWrapped(feeAmount, tickSpacing, token0, token1);
        [pool1, pool1Functions] = await createPoolWrapped(feeAmount, tickSpacing, token1, token2);
    });
    it('constructor initializes immutables', async () => {
        (0, expect_1.expect)(await pool0.factory()).to.eq(factory.address);
        (0, expect_1.expect)(await pool0.token0()).to.eq(token0.address);
        (0, expect_1.expect)(await pool0.token1()).to.eq(token1.address);
        (0, expect_1.expect)(await pool1.factory()).to.eq(factory.address);
        (0, expect_1.expect)(await pool1.token0()).to.eq(token1.address);
        (0, expect_1.expect)(await pool1.token1()).to.eq(token2.address);
    });
    describe('multi-swaps', () => {
        let inputToken;
        let outputToken;
        beforeEach('initialize both pools', async () => {
            inputToken = token0;
            outputToken = token2;
            await pool0.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
            await pool1.initialize((0, utilities_1.encodePriceSqrt)(1, 1));
            await pool0Functions.mint(wallet.address, minTick, maxTick, (0, utilities_1.expandTo18Decimals)(1));
            await pool1Functions.mint(wallet.address, minTick, maxTick, (0, utilities_1.expandTo18Decimals)(1));
        });
        it('multi-swap', async () => {
            const token0OfPoolOutput = await pool1.token0();
            const ForExact0 = outputToken.address === token0OfPoolOutput;
            const { swapForExact0Multi, swapForExact1Multi } = (0, utilities_1.createMultiPoolFunctions)({
                inputToken: token0,
                swapTarget: swapTargetRouter,
                poolInput: pool0,
                poolOutput: pool1,
            });
            const method = ForExact0 ? swapForExact0Multi : swapForExact1Multi;
            await (0, expect_1.expect)(method(100, wallet.address))
                .to.emit(outputToken, 'Transfer')
                .withArgs(pool1.address, wallet.address, 100)
                .to.emit(token1, 'Transfer')
                .withArgs(pool0.address, pool1.address, 102)
                .to.emit(inputToken, 'Transfer')
                .withArgs(wallet.address, pool0.address, 104);
        });
    });
});
