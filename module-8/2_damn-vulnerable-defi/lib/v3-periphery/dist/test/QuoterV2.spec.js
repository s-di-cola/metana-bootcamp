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
const expandTo18Decimals_1 = require("./shared/expandTo18Decimals");
const expect_1 = require("./shared/expect");
const path_1 = require("./shared/path");
const quoter_1 = require("./shared/quoter");
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
describe('QuoterV2', function () {
    this.timeout(40000);
    let wallet;
    let trader;
    const swapRouterFixture = async (wallets, provider) => {
        const { weth9, factory, router, tokens, nft } = await (0, completeFixture_1.default)(wallets, provider);
        // approve & fund wallets
        for (const token of tokens) {
            await token.approve(router.address, ethers_1.constants.MaxUint256);
            await token.approve(nft.address, ethers_1.constants.MaxUint256);
            await token.connect(trader).approve(router.address, ethers_1.constants.MaxUint256);
            await token.transfer(trader.address, (0, expandTo18Decimals_1.expandTo18Decimals)(1000000));
        }
        const quoterFactory = await hardhat_1.ethers.getContractFactory('QuoterV2');
        quoter = (await quoterFactory.deploy(factory.address, weth9.address));
        return {
            tokens,
            nft,
            quoter,
        };
    };
    let nft;
    let tokens;
    let quoter;
    let loadFixture;
    before('create fixture loader', async () => {
        const wallets = await hardhat_1.ethers.getSigners();
        [wallet, trader] = wallets;
        loadFixture = hardhat_1.waffle.createFixtureLoader(wallets);
    });
    // helper for getting weth and token balances
    beforeEach('load fixture', async () => {
        ;
        ({ tokens, nft, quoter } = await loadFixture(swapRouterFixture));
    });
    describe('quotes', () => {
        beforeEach(async () => {
            await (0, quoter_1.createPool)(nft, wallet, tokens[0].address, tokens[1].address);
            await (0, quoter_1.createPool)(nft, wallet, tokens[1].address, tokens[2].address);
            await (0, quoter_1.createPoolWithMultiplePositions)(nft, wallet, tokens[0].address, tokens[2].address);
        });
        describe('#quoteExactInput', () => {
            it('0 -> 2 cross 2 tick', async () => {
                const { amountOut, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactInput((0, path_1.encodePath)([tokens[0].address, tokens[2].address], [constants_1.FeeAmount.MEDIUM]), 10000);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('78461846509168490764501028180');
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(2);
                (0, expect_1.expect)(amountOut).to.eq(9871);
            });
            it('0 -> 2 cross 2 tick where after is initialized', async () => {
                // The swap amount is set such that the active tick after the swap is -120.
                // -120 is an initialized tick for this pool. We check that we don't count it.
                const { amountOut, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactInput((0, path_1.encodePath)([tokens[0].address, tokens[2].address], [constants_1.FeeAmount.MEDIUM]), 6200);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('78757224507315167622282810783');
                (0, expect_1.expect)(initializedTicksCrossedList.length).to.eq(1);
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(1);
                (0, expect_1.expect)(amountOut).to.eq(6143);
            });
            it('0 -> 2 cross 1 tick', async () => {
                const { amountOut, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactInput((0, path_1.encodePath)([tokens[0].address, tokens[2].address], [constants_1.FeeAmount.MEDIUM]), 4000);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('78926452400586371254602774705');
                (0, expect_1.expect)(amountOut).to.eq(3971);
            });
            it('0 -> 2 cross 0 tick, starting tick not initialized', async () => {
                // Tick before 0, tick after -1.
                const { amountOut, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactInput((0, path_1.encodePath)([tokens[0].address, tokens[2].address], [constants_1.FeeAmount.MEDIUM]), 10);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(0);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('79227483487511329217250071027');
                (0, expect_1.expect)(amountOut).to.eq(8);
            });
            it('0 -> 2 cross 0 tick, starting tick initialized', async () => {
                // Tick before 0, tick after -1. Tick 0 initialized.
                await (0, quoter_1.createPoolWithZeroTickInitialized)(nft, wallet, tokens[0].address, tokens[2].address);
                const { amountOut, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactInput((0, path_1.encodePath)([tokens[0].address, tokens[2].address], [constants_1.FeeAmount.MEDIUM]), 10);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('79227817515327498931091950511');
                (0, expect_1.expect)(amountOut).to.eq(8);
            });
            it('2 -> 0 cross 2', async () => {
                const { amountOut, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactInput((0, path_1.encodePath)([tokens[2].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]), 10000);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(2);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('80001962924147897865541384515');
                (0, expect_1.expect)(initializedTicksCrossedList.length).to.eq(1);
                (0, expect_1.expect)(amountOut).to.eq(9871);
            });
            it('2 -> 0 cross 2 where tick after is initialized', async () => {
                // The swap amount is set such that the active tick after the swap is 120.
                // 120 is an initialized tick for this pool. We check we don't count it.
                const { amountOut, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactInput((0, path_1.encodePath)([tokens[2].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]), 6250);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(2);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('79705728824507063507279123685');
                (0, expect_1.expect)(initializedTicksCrossedList.length).to.eq(1);
                (0, expect_1.expect)(amountOut).to.eq(6190);
            });
            it('2 -> 0 cross 0 tick, starting tick initialized', async () => {
                // Tick 0 initialized. Tick after = 1
                await (0, quoter_1.createPoolWithZeroTickInitialized)(nft, wallet, tokens[0].address, tokens[2].address);
                const { amountOut, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactInput((0, path_1.encodePath)([tokens[2].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]), 200);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(0);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('79235729830182478001034429156');
                (0, expect_1.expect)(initializedTicksCrossedList.length).to.eq(1);
                (0, expect_1.expect)(amountOut).to.eq(198);
            });
            it('2 -> 0 cross 0 tick, starting tick not initialized', async () => {
                // Tick 0 initialized. Tick after = 1
                const { amountOut, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactInput((0, path_1.encodePath)([tokens[2].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]), 103);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(0);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('79235858216754624215638319723');
                (0, expect_1.expect)(initializedTicksCrossedList.length).to.eq(1);
                (0, expect_1.expect)(amountOut).to.eq(101);
            });
            it('2 -> 1', async () => {
                const { amountOut, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactInput((0, path_1.encodePath)([tokens[2].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]), 10000);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('80018067294531553039351583520');
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(0);
                (0, expect_1.expect)(amountOut).to.eq(9871);
            });
            it('0 -> 2 -> 1', async () => {
                const { amountOut, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactInput((0, path_1.encodePath)([tokens[0].address, tokens[2].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM, constants_1.FeeAmount.MEDIUM]), 10000);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(2);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('78461846509168490764501028180');
                (0, expect_1.expect)(sqrtPriceX96AfterList[1]).to.eq('80007846861567212939802016351');
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(2);
                (0, expect_1.expect)(initializedTicksCrossedList[1]).to.eq(0);
                (0, expect_1.expect)(amountOut).to.eq(9745);
            });
        });
        describe('#quoteExactInputSingle', () => {
            it('0 -> 2', async () => {
                const { amountOut: quote, sqrtPriceX96After, initializedTicksCrossed, gasEstimate, } = await quoter.callStatic.quoteExactInputSingle({
                    tokenIn: tokens[0].address,
                    tokenOut: tokens[2].address,
                    fee: constants_1.FeeAmount.MEDIUM,
                    amountIn: 10000,
                    // -2%
                    sqrtPriceLimitX96: (0, encodePriceSqrt_1.encodePriceSqrt)(100, 102),
                });
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(initializedTicksCrossed).to.eq(2);
                (0, expect_1.expect)(quote).to.eq(9871);
                (0, expect_1.expect)(sqrtPriceX96After).to.eq('78461846509168490764501028180');
            });
            it('2 -> 0', async () => {
                const { amountOut: quote, sqrtPriceX96After, initializedTicksCrossed, gasEstimate, } = await quoter.callStatic.quoteExactInputSingle({
                    tokenIn: tokens[2].address,
                    tokenOut: tokens[0].address,
                    fee: constants_1.FeeAmount.MEDIUM,
                    amountIn: 10000,
                    // +2%
                    sqrtPriceLimitX96: (0, encodePriceSqrt_1.encodePriceSqrt)(102, 100),
                });
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(initializedTicksCrossed).to.eq(2);
                (0, expect_1.expect)(quote).to.eq(9871);
                (0, expect_1.expect)(sqrtPriceX96After).to.eq('80001962924147897865541384515');
            });
        });
        describe('#quoteExactOutput', () => {
            it('0 -> 2 cross 2 tick', async () => {
                const { amountIn, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactOutput((0, path_1.encodePath)([tokens[2].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]), 15000);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(initializedTicksCrossedList.length).to.eq(1);
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(2);
                (0, expect_1.expect)(amountIn).to.eq(15273);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('78055527257643669242286029831');
            });
            it('0 -> 2 cross 2 where tick after is initialized', async () => {
                // The swap amount is set such that the active tick after the swap is -120.
                // -120 is an initialized tick for this pool. We check that we count it.
                const { amountIn, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactOutput((0, path_1.encodePath)([tokens[2].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]), 6143);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('78757225449310403327341205211');
                (0, expect_1.expect)(initializedTicksCrossedList.length).to.eq(1);
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(1);
                (0, expect_1.expect)(amountIn).to.eq(6200);
            });
            it('0 -> 2 cross 1 tick', async () => {
                const { amountIn, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactOutput((0, path_1.encodePath)([tokens[2].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]), 4000);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(initializedTicksCrossedList.length).to.eq(1);
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(1);
                (0, expect_1.expect)(amountIn).to.eq(4029);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('78924219757724709840818372098');
            });
            it('0 -> 2 cross 0 tick starting tick initialized', async () => {
                // Tick before 0, tick after 1. Tick 0 initialized.
                await (0, quoter_1.createPoolWithZeroTickInitialized)(nft, wallet, tokens[0].address, tokens[2].address);
                const { amountIn, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactOutput((0, path_1.encodePath)([tokens[2].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]), 100);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(initializedTicksCrossedList.length).to.eq(1);
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(1);
                (0, expect_1.expect)(amountIn).to.eq(102);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('79224329176051641448521403903');
            });
            it('0 -> 2 cross 0 tick starting tick not initialized', async () => {
                const { amountIn, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactOutput((0, path_1.encodePath)([tokens[2].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]), 10);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(initializedTicksCrossedList.length).to.eq(1);
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(0);
                (0, expect_1.expect)(amountIn).to.eq(12);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('79227408033628034983534698435');
            });
            it('2 -> 0 cross 2 ticks', async () => {
                const { amountIn, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactOutput((0, path_1.encodePath)([tokens[0].address, tokens[2].address], [constants_1.FeeAmount.MEDIUM]), 15000);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(initializedTicksCrossedList.length).to.eq(1);
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(2);
                (0, expect_1.expect)(amountIn).to.eq(15273);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('80418414376567919517220409857');
            });
            it('2 -> 0 cross 2 where tick after is initialized', async () => {
                // The swap amount is set such that the active tick after the swap is 120.
                // 120 is an initialized tick for this pool. We check that we don't count it.
                const { amountIn, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactOutput((0, path_1.encodePath)([tokens[0].address, tokens[2].address], [constants_1.FeeAmount.MEDIUM]), 6223);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(2);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('79708304437530892332449657932');
                (0, expect_1.expect)(initializedTicksCrossedList.length).to.eq(1);
                (0, expect_1.expect)(amountIn).to.eq(6283);
            });
            it('2 -> 0 cross 1 tick', async () => {
                const { amountIn, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactOutput((0, path_1.encodePath)([tokens[0].address, tokens[2].address], [constants_1.FeeAmount.MEDIUM]), 6000);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('79690640184021170956740081887');
                (0, expect_1.expect)(initializedTicksCrossedList.length).to.eq(1);
                (0, expect_1.expect)(amountIn).to.eq(6055);
            });
            it('2 -> 1', async () => {
                const { amountIn, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactOutput((0, path_1.encodePath)([tokens[1].address, tokens[2].address], [constants_1.FeeAmount.MEDIUM]), 9871);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(1);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('80018020393569259756601362385');
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(0);
                (0, expect_1.expect)(amountIn).to.eq(10000);
            });
            it('0 -> 2 -> 1', async () => {
                const { amountIn, sqrtPriceX96AfterList, initializedTicksCrossedList, gasEstimate } = await quoter.callStatic.quoteExactOutput((0, path_1.encodePath)([tokens[0].address, tokens[2].address, tokens[1].address].reverse(), [
                    constants_1.FeeAmount.MEDIUM,
                    constants_1.FeeAmount.MEDIUM,
                ]), 9745);
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(sqrtPriceX96AfterList.length).to.eq(2);
                (0, expect_1.expect)(sqrtPriceX96AfterList[0]).to.eq('80007838904387594703933785072');
                (0, expect_1.expect)(sqrtPriceX96AfterList[1]).to.eq('78461888503179331029803316753');
                (0, expect_1.expect)(initializedTicksCrossedList[0]).to.eq(0);
                (0, expect_1.expect)(initializedTicksCrossedList[1]).to.eq(2);
                (0, expect_1.expect)(amountIn).to.eq(10000);
            });
        });
        describe('#quoteExactOutputSingle', () => {
            it('0 -> 1', async () => {
                const { amountIn, sqrtPriceX96After, initializedTicksCrossed, gasEstimate } = await quoter.callStatic.quoteExactOutputSingle({
                    tokenIn: tokens[0].address,
                    tokenOut: tokens[1].address,
                    fee: constants_1.FeeAmount.MEDIUM,
                    amount: constants_1.MaxUint128,
                    sqrtPriceLimitX96: (0, encodePriceSqrt_1.encodePriceSqrt)(100, 102),
                });
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(amountIn).to.eq(9981);
                (0, expect_1.expect)(initializedTicksCrossed).to.eq(0);
                (0, expect_1.expect)(sqrtPriceX96After).to.eq('78447570448055484695608110440');
            });
            it('1 -> 0', async () => {
                const { amountIn, sqrtPriceX96After, initializedTicksCrossed, gasEstimate } = await quoter.callStatic.quoteExactOutputSingle({
                    tokenIn: tokens[1].address,
                    tokenOut: tokens[0].address,
                    fee: constants_1.FeeAmount.MEDIUM,
                    amount: constants_1.MaxUint128,
                    sqrtPriceLimitX96: (0, encodePriceSqrt_1.encodePriceSqrt)(102, 100),
                });
                await (0, snapshotGasCost_1.default)(gasEstimate);
                (0, expect_1.expect)(amountIn).to.eq(9981);
                (0, expect_1.expect)(initializedTicksCrossed).to.eq(0);
                (0, expect_1.expect)(sqrtPriceX96After).to.eq('80016521857016594389520272648');
            });
        });
    });
});
