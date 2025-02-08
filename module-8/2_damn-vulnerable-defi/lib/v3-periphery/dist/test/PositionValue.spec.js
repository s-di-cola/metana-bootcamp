"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const ethers_1 = require("ethers");
const constants_1 = require("./shared/constants");
const ticks_1 = require("./shared/ticks");
const encodePriceSqrt_1 = require("./shared/encodePriceSqrt");
const expandTo18Decimals_1 = require("./shared/expandTo18Decimals");
const path_1 = require("./shared/path");
const computePoolAddress_1 = require("./shared/computePoolAddress");
const completeFixture_1 = __importDefault(require("./shared/completeFixture"));
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
const expect_1 = require("./shared/expect");
const IUniswapV3Pool_json_1 = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
describe('PositionValue', async () => {
    const [...wallets] = hardhat_1.waffle.provider.getWallets();
    const positionValueCompleteFixture = async (wallets, provider) => {
        const { nft, router, tokens, factory } = await (0, completeFixture_1.default)(wallets, provider);
        const positionValueFactory = await hardhat_1.ethers.getContractFactory('PositionValueTest');
        const positionValue = (await positionValueFactory.deploy());
        for (const token of tokens) {
            await token.approve(nft.address, ethers_1.constants.MaxUint256);
            await token.connect(wallets[0]).approve(nft.address, ethers_1.constants.MaxUint256);
            await token.transfer(wallets[0].address, (0, expandTo18Decimals_1.expandTo18Decimals)(1000000));
        }
        return {
            positionValue,
            tokens,
            nft,
            router,
            factory,
        };
    };
    let pool;
    let tokens;
    let positionValue;
    let nft;
    let router;
    let factory;
    let amountDesired;
    let loadFixture;
    before('create fixture loader', async () => {
        loadFixture = hardhat_1.waffle.createFixtureLoader(wallets);
    });
    beforeEach(async () => {
        ;
        ({ positionValue, tokens, nft, router, factory } = await loadFixture(positionValueCompleteFixture));
        await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
        const poolAddress = (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM);
        pool = new hardhat_1.ethers.Contract(poolAddress, IUniswapV3Pool_json_1.abi, wallets[0]);
    });
    describe('#total', () => {
        let tokenId;
        let sqrtRatioX96;
        beforeEach(async () => {
            amountDesired = (0, expandTo18Decimals_1.expandTo18Decimals)(100000);
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                fee: constants_1.FeeAmount.MEDIUM,
                recipient: wallets[0].address,
                amount0Desired: amountDesired,
                amount1Desired: amountDesired,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 10,
            });
            const swapAmount = (0, expandTo18Decimals_1.expandTo18Decimals)(1000);
            await tokens[0].approve(router.address, swapAmount);
            await tokens[1].approve(router.address, swapAmount);
            // accmuluate token0 fees
            await router.exactInput({
                recipient: wallets[0].address,
                deadline: 1,
                path: (0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]),
                amountIn: swapAmount,
                amountOutMinimum: 0,
            });
            // accmuluate token1 fees
            await router.exactInput({
                recipient: wallets[0].address,
                deadline: 1,
                path: (0, path_1.encodePath)([tokens[1].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]),
                amountIn: swapAmount,
                amountOutMinimum: 0,
            });
            sqrtRatioX96 = (await pool.slot0()).sqrtPriceX96;
        });
        it('returns the correct amount', async () => {
            const principal = await positionValue.principal(nft.address, 1, sqrtRatioX96);
            const fees = await positionValue.fees(nft.address, 1);
            const total = await positionValue.total(nft.address, 1, sqrtRatioX96);
            (0, expect_1.expect)(total[0]).to.equal(principal[0].add(fees[0]));
            (0, expect_1.expect)(total[1]).to.equal(principal[1].add(fees[1]));
        });
        it('gas', async () => {
            await (0, snapshotGasCost_1.default)(positionValue.totalGas(nft.address, 1, sqrtRatioX96));
        });
    });
    describe('#principal', () => {
        let sqrtRatioX96;
        beforeEach(async () => {
            amountDesired = (0, expandTo18Decimals_1.expandTo18Decimals)(100000);
            sqrtRatioX96 = (await pool.slot0()).sqrtPriceX96;
        });
        it('returns the correct values when price is in the middle of the range', async () => {
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                fee: constants_1.FeeAmount.MEDIUM,
                recipient: wallets[0].address,
                amount0Desired: amountDesired,
                amount1Desired: amountDesired,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 10,
            });
            const principal = await positionValue.principal(nft.address, 1, sqrtRatioX96);
            (0, expect_1.expect)(principal.amount0).to.equal('99999999999999999999999');
            (0, expect_1.expect)(principal.amount1).to.equal('99999999999999999999999');
        });
        it('returns the correct values when range is below current price', async () => {
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: -60,
                fee: constants_1.FeeAmount.MEDIUM,
                recipient: wallets[0].address,
                amount0Desired: amountDesired,
                amount1Desired: amountDesired,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 10,
            });
            const principal = await positionValue.principal(nft.address, 1, sqrtRatioX96);
            (0, expect_1.expect)(principal.amount0).to.equal('0');
            (0, expect_1.expect)(principal.amount1).to.equal('99999999999999999999999');
        });
        it('returns the correct values when range is below current price', async () => {
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: 60,
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                fee: constants_1.FeeAmount.MEDIUM,
                recipient: wallets[0].address,
                amount0Desired: amountDesired,
                amount1Desired: amountDesired,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 10,
            });
            const principal = await positionValue.principal(nft.address, 1, sqrtRatioX96);
            (0, expect_1.expect)(principal.amount0).to.equal('99999999999999999999999');
            (0, expect_1.expect)(principal.amount1).to.equal('0');
        });
        it('returns the correct values when range is skewed above price', async () => {
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: -6000,
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                fee: constants_1.FeeAmount.MEDIUM,
                recipient: wallets[0].address,
                amount0Desired: amountDesired,
                amount1Desired: amountDesired,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 10,
            });
            const principal = await positionValue.principal(nft.address, 1, sqrtRatioX96);
            (0, expect_1.expect)(principal.amount0).to.equal('99999999999999999999999');
            (0, expect_1.expect)(principal.amount1).to.equal('25917066770240321655335');
        });
        it('returns the correct values when range is skewed below price', async () => {
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: 6000,
                fee: constants_1.FeeAmount.MEDIUM,
                recipient: wallets[0].address,
                amount0Desired: amountDesired,
                amount1Desired: amountDesired,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 10,
            });
            const principal = await positionValue.principal(nft.address, 1, sqrtRatioX96);
            (0, expect_1.expect)(principal.amount0).to.equal('25917066770240321655335');
            (0, expect_1.expect)(principal.amount1).to.equal('99999999999999999999999');
        });
        it('gas', async () => {
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                fee: constants_1.FeeAmount.MEDIUM,
                recipient: wallets[0].address,
                amount0Desired: amountDesired,
                amount1Desired: amountDesired,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 10,
            });
            await (0, snapshotGasCost_1.default)(positionValue.principalGas(nft.address, 1, sqrtRatioX96));
        });
    });
    describe('#fees', () => {
        let tokenId;
        beforeEach(async () => {
            amountDesired = (0, expandTo18Decimals_1.expandTo18Decimals)(100000);
            tokenId = 2;
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                fee: constants_1.FeeAmount.MEDIUM,
                recipient: wallets[0].address,
                amount0Desired: amountDesired,
                amount1Desired: amountDesired,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 10,
            });
        });
        describe('when price is within the position range', () => {
            beforeEach(async () => {
                await nft.mint({
                    token0: tokens[0].address,
                    token1: tokens[1].address,
                    tickLower: constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM] * -1000,
                    tickUpper: constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM] * 1000,
                    fee: constants_1.FeeAmount.MEDIUM,
                    recipient: wallets[0].address,
                    amount0Desired: amountDesired,
                    amount1Desired: amountDesired,
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: 10,
                });
                const swapAmount = (0, expandTo18Decimals_1.expandTo18Decimals)(1000);
                await tokens[0].approve(router.address, swapAmount);
                await tokens[1].approve(router.address, swapAmount);
                // accmuluate token0 fees
                await router.exactInput({
                    recipient: wallets[0].address,
                    deadline: 1,
                    path: (0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]),
                    amountIn: swapAmount,
                    amountOutMinimum: 0,
                });
                // accmuluate token1 fees
                await router.exactInput({
                    recipient: wallets[0].address,
                    deadline: 1,
                    path: (0, path_1.encodePath)([tokens[1].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]),
                    amountIn: swapAmount,
                    amountOutMinimum: 0,
                });
            });
            it('return the correct amount of fees', async () => {
                const feesFromCollect = await nft.callStatic.collect({
                    tokenId,
                    recipient: wallets[0].address,
                    amount0Max: constants_1.MaxUint128,
                    amount1Max: constants_1.MaxUint128,
                });
                const feeAmounts = await positionValue.fees(nft.address, tokenId);
                (0, expect_1.expect)(feeAmounts[0]).to.equal(feesFromCollect[0]);
                (0, expect_1.expect)(feeAmounts[1]).to.equal(feesFromCollect[1]);
            });
            it('returns the correct amount of fees if tokensOwed fields are greater than 0', async () => {
                await nft.increaseLiquidity({
                    tokenId: tokenId,
                    amount0Desired: 100,
                    amount1Desired: 100,
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: 1,
                });
                const swapAmount = (0, expandTo18Decimals_1.expandTo18Decimals)(1000);
                await tokens[0].approve(router.address, swapAmount);
                // accmuluate more token0 fees after clearing initial amount
                await router.exactInput({
                    recipient: wallets[0].address,
                    deadline: 1,
                    path: (0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]),
                    amountIn: swapAmount,
                    amountOutMinimum: 0,
                });
                const feesFromCollect = await nft.callStatic.collect({
                    tokenId,
                    recipient: wallets[0].address,
                    amount0Max: constants_1.MaxUint128,
                    amount1Max: constants_1.MaxUint128,
                });
                const feeAmounts = await positionValue.fees(nft.address, tokenId);
                (0, expect_1.expect)(feeAmounts[0]).to.equal(feesFromCollect[0]);
                (0, expect_1.expect)(feeAmounts[1]).to.equal(feesFromCollect[1]);
            });
            it('gas', async () => {
                await (0, snapshotGasCost_1.default)(positionValue.feesGas(nft.address, tokenId));
            });
        });
        describe('when price is below the position range', async () => {
            beforeEach(async () => {
                await nft.mint({
                    token0: tokens[0].address,
                    token1: tokens[1].address,
                    tickLower: constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM] * -10,
                    tickUpper: constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM] * 10,
                    fee: constants_1.FeeAmount.MEDIUM,
                    recipient: wallets[0].address,
                    amount0Desired: (0, expandTo18Decimals_1.expandTo18Decimals)(10000),
                    amount1Desired: (0, expandTo18Decimals_1.expandTo18Decimals)(10000),
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: 10,
                });
                await tokens[0].approve(router.address, ethers_1.constants.MaxUint256);
                await tokens[1].approve(router.address, ethers_1.constants.MaxUint256);
                // accumulate token1 fees
                await router.exactInput({
                    recipient: wallets[0].address,
                    deadline: 1,
                    path: (0, path_1.encodePath)([tokens[1].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]),
                    amountIn: (0, expandTo18Decimals_1.expandTo18Decimals)(1000),
                    amountOutMinimum: 0,
                });
                // accumulate token0 fees and push price below tickLower
                await router.exactInput({
                    recipient: wallets[0].address,
                    deadline: 1,
                    path: (0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]),
                    amountIn: (0, expandTo18Decimals_1.expandTo18Decimals)(50000),
                    amountOutMinimum: 0,
                });
            });
            it('returns the correct amount of fees', async () => {
                const feesFromCollect = await nft.callStatic.collect({
                    tokenId,
                    recipient: wallets[0].address,
                    amount0Max: constants_1.MaxUint128,
                    amount1Max: constants_1.MaxUint128,
                });
                const feeAmounts = await positionValue.fees(nft.address, tokenId);
                (0, expect_1.expect)(feeAmounts[0]).to.equal(feesFromCollect[0]);
                (0, expect_1.expect)(feeAmounts[1]).to.equal(feesFromCollect[1]);
            });
            it('gas', async () => {
                await (0, snapshotGasCost_1.default)(positionValue.feesGas(nft.address, tokenId));
            });
        });
        describe('when price is above the position range', async () => {
            beforeEach(async () => {
                await nft.mint({
                    token0: tokens[0].address,
                    token1: tokens[1].address,
                    tickLower: constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM] * -10,
                    tickUpper: constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM] * 10,
                    fee: constants_1.FeeAmount.MEDIUM,
                    recipient: wallets[0].address,
                    amount0Desired: (0, expandTo18Decimals_1.expandTo18Decimals)(10000),
                    amount1Desired: (0, expandTo18Decimals_1.expandTo18Decimals)(10000),
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: 10,
                });
                await tokens[0].approve(router.address, ethers_1.constants.MaxUint256);
                await tokens[1].approve(router.address, ethers_1.constants.MaxUint256);
                // accumulate token0 fees
                await router.exactInput({
                    recipient: wallets[0].address,
                    deadline: 1,
                    path: (0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]),
                    amountIn: (0, expandTo18Decimals_1.expandTo18Decimals)(1000),
                    amountOutMinimum: 0,
                });
                // accumulate token1 fees and push price above tickUpper
                await router.exactInput({
                    recipient: wallets[0].address,
                    deadline: 1,
                    path: (0, path_1.encodePath)([tokens[1].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]),
                    amountIn: (0, expandTo18Decimals_1.expandTo18Decimals)(50000),
                    amountOutMinimum: 0,
                });
            });
            it('returns the correct amount of fees', async () => {
                const feesFromCollect = await nft.callStatic.collect({
                    tokenId,
                    recipient: wallets[0].address,
                    amount0Max: constants_1.MaxUint128,
                    amount1Max: constants_1.MaxUint128,
                });
                const feeAmounts = await positionValue.fees(nft.address, tokenId);
                (0, expect_1.expect)(feeAmounts[0]).to.equal(feesFromCollect[0]);
                (0, expect_1.expect)(feeAmounts[1]).to.equal(feesFromCollect[1]);
            });
            it('gas', async () => {
                await (0, snapshotGasCost_1.default)(positionValue.feesGas(nft.address, tokenId));
            });
        });
    });
});
