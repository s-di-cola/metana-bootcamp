"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const hardhat_1 = require("hardhat");
const completeFixture_1 = __importDefault(require("./shared/completeFixture"));
const constants_1 = require("./shared/constants");
const encodePriceSqrt_1 = require("./shared/encodePriceSqrt");
const expect_1 = require("./shared/expect");
const ticks_1 = require("./shared/ticks");
const computePoolAddress_1 = require("./shared/computePoolAddress");
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
describe('TickLens', () => {
    let wallets;
    const nftFixture = async (wallets, provider) => {
        const { factory, tokens, nft } = await (0, completeFixture_1.default)(wallets, provider);
        for (const token of tokens) {
            await token.approve(nft.address, ethers_1.constants.MaxUint256);
        }
        return {
            factory,
            nft,
            tokens,
        };
    };
    let factory;
    let nft;
    let tokens;
    let poolAddress;
    let tickLens;
    let loadFixture;
    before('create fixture loader', async () => {
        wallets = await hardhat_1.ethers.getSigners();
        loadFixture = hardhat_1.waffle.createFixtureLoader(wallets);
    });
    beforeEach('load fixture', async () => {
        ;
        ({ factory, tokens, nft } = await loadFixture(nftFixture));
    });
    describe('#getPopulatedTicksInWord', () => {
        const fullRangeLiquidity = 1000000;
        async function createPool(tokenAddressA, tokenAddressB) {
            if (tokenAddressA.toLowerCase() > tokenAddressB.toLowerCase())
                [tokenAddressA, tokenAddressB] = [tokenAddressB, tokenAddressA];
            await nft.createAndInitializePoolIfNecessary(tokenAddressA, tokenAddressB, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            const liquidityParams = {
                token0: tokenAddressA,
                token1: tokenAddressB,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                recipient: wallets[0].address,
                amount0Desired: 1000000,
                amount1Desired: 1000000,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 1,
            };
            return nft.mint(liquidityParams);
        }
        async function mint(tickLower, tickUpper, amountBothDesired) {
            const mintParams = {
                token0: tokens[0].address,
                token1: tokens[1].address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower,
                tickUpper,
                amount0Desired: amountBothDesired,
                amount1Desired: amountBothDesired,
                amount0Min: 0,
                amount1Min: 0,
                recipient: wallets[0].address,
                deadline: 1,
            };
            const { liquidity } = await nft.callStatic.mint(mintParams);
            await nft.mint(mintParams);
            return liquidity.toNumber();
        }
        beforeEach(async () => {
            await createPool(tokens[0].address, tokens[1].address);
            poolAddress = (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM);
        });
        beforeEach(async () => {
            const lensFactory = await hardhat_1.ethers.getContractFactory('TickLensTest');
            tickLens = (await lensFactory.deploy());
        });
        function getTickBitmapIndex(tick, tickSpacing) {
            const intermediate = ethers_1.BigNumber.from(tick).div(tickSpacing);
            // see https://docs.soliditylang.org/en/v0.7.6/types.html#shifts
            return intermediate.lt(0) ? intermediate.add(1).div(ethers_1.BigNumber.from(2).pow(8)).sub(1) : intermediate.shr(8);
        }
        it('works for min/max', async () => {
            const [min] = await tickLens.getPopulatedTicksInWord(poolAddress, getTickBitmapIndex((0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]), constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
            const [max] = await tickLens.getPopulatedTicksInWord(poolAddress, getTickBitmapIndex((0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]), constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
            (0, expect_1.expect)(min.tick).to.be.eq((0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
            (0, expect_1.expect)(min.liquidityNet).to.be.eq(fullRangeLiquidity);
            (0, expect_1.expect)(min.liquidityGross).to.be.eq(fullRangeLiquidity);
            (0, expect_1.expect)(max.tick).to.be.eq((0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
            (0, expect_1.expect)(max.liquidityNet).to.be.eq(fullRangeLiquidity * -1);
            (0, expect_1.expect)(min.liquidityGross).to.be.eq(fullRangeLiquidity);
        });
        it('works for min/max and -2/-1/0/1', async () => {
            const minus = -constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM];
            const plus = -minus;
            const liquidity0 = await mint(minus * 2, minus, 2);
            const liquidity1 = await mint(minus * 2, 0, 3);
            const liquidity2 = await mint(minus * 2, plus, 5);
            const liquidity3 = await mint(minus, 0, 7);
            const liquidity4 = await mint(minus, plus, 11);
            const liquidity5 = await mint(0, plus, 13);
            const [min] = await tickLens.getPopulatedTicksInWord(poolAddress, getTickBitmapIndex((0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]), constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
            const [negativeOne, negativeTwo] = await tickLens.getPopulatedTicksInWord(poolAddress, getTickBitmapIndex(minus, constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
            const [one, zero] = await tickLens.getPopulatedTicksInWord(poolAddress, getTickBitmapIndex(plus, constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
            const [max] = await tickLens.getPopulatedTicksInWord(poolAddress, getTickBitmapIndex((0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]), constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
            (0, expect_1.expect)(min.tick).to.be.eq((0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
            (0, expect_1.expect)(min.liquidityNet).to.be.eq(fullRangeLiquidity);
            (0, expect_1.expect)(min.liquidityGross).to.be.eq(fullRangeLiquidity);
            (0, expect_1.expect)(negativeTwo.tick).to.be.eq(minus * 2);
            (0, expect_1.expect)(negativeTwo.liquidityNet).to.be.eq(liquidity0 + liquidity1 + liquidity2);
            (0, expect_1.expect)(negativeTwo.liquidityGross).to.be.eq(liquidity0 + liquidity1 + liquidity2);
            (0, expect_1.expect)(negativeOne.tick).to.be.eq(minus);
            (0, expect_1.expect)(negativeOne.liquidityNet).to.be.eq(liquidity3 + liquidity4 - liquidity0);
            (0, expect_1.expect)(negativeOne.liquidityGross).to.be.eq(liquidity3 + liquidity4 + liquidity0);
            (0, expect_1.expect)(zero.tick).to.be.eq(0);
            (0, expect_1.expect)(zero.liquidityNet).to.be.eq(liquidity5 - liquidity1 - liquidity3);
            (0, expect_1.expect)(zero.liquidityGross).to.be.eq(liquidity5 + liquidity1 + liquidity3);
            (0, expect_1.expect)(one.tick).to.be.eq(plus);
            (0, expect_1.expect)(one.liquidityNet).to.be.eq(-liquidity2 - liquidity4 - liquidity5);
            (0, expect_1.expect)(one.liquidityGross).to.be.eq(liquidity2 + liquidity4 + liquidity5);
            (0, expect_1.expect)(max.tick).to.be.eq((0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
            (0, expect_1.expect)(max.liquidityNet).to.be.eq(fullRangeLiquidity * -1);
            (0, expect_1.expect)(max.liquidityGross).to.be.eq(fullRangeLiquidity);
        });
        it('gas for single populated tick', async () => {
            await (0, snapshotGasCost_1.default)(tickLens.getGasCostOfGetPopulatedTicksInWord(poolAddress, getTickBitmapIndex((0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]), constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM])));
        });
        it('fully populated ticks', async () => {
            // fully populate a word
            for (let i = 0; i < 128; i++) {
                await mint(i * constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM], (255 - i) * constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM], 100);
            }
            const ticks = await tickLens.getPopulatedTicksInWord(poolAddress, getTickBitmapIndex(0, constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
            (0, expect_1.expect)(ticks.length).to.be.eq(256);
            await (0, snapshotGasCost_1.default)(tickLens.getGasCostOfGetPopulatedTicksInWord(poolAddress, getTickBitmapIndex(0, constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM])));
        }).timeout(300000);
    });
});
