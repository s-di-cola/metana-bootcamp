"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const completeFixture_1 = __importDefault(require("./shared/completeFixture"));
const constants_1 = require("./shared/constants");
const encodePriceSqrt_1 = require("./shared/encodePriceSqrt");
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
const expect_1 = require("./shared/expect");
const ticks_1 = require("./shared/ticks");
const computePoolAddress_1 = require("./shared/computePoolAddress");
describe('PairFlash test', () => {
    const provider = hardhat_1.waffle.provider;
    const wallets = hardhat_1.waffle.provider.getWallets();
    const wallet = wallets[0];
    let flash;
    let nft;
    let token0;
    let token1;
    let factory;
    let quoter;
    async function createPool(tokenAddressA, tokenAddressB, fee, price) {
        if (tokenAddressA.toLowerCase() > tokenAddressB.toLowerCase())
            [tokenAddressA, tokenAddressB] = [tokenAddressB, tokenAddressA];
        await nft.createAndInitializePoolIfNecessary(tokenAddressA, tokenAddressB, fee, price);
        const liquidityParams = {
            token0: tokenAddressA,
            token1: tokenAddressB,
            fee: fee,
            tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[fee]),
            tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[fee]),
            recipient: wallet.address,
            amount0Desired: 1000000,
            amount1Desired: 1000000,
            amount0Min: 0,
            amount1Min: 0,
            deadline: 1,
        };
        return nft.mint(liquidityParams);
    }
    const flashFixture = async () => {
        const { router, tokens, factory, weth9, nft } = await (0, completeFixture_1.default)(wallets, provider);
        const token0 = tokens[0];
        const token1 = tokens[1];
        const flashContractFactory = await hardhat_1.ethers.getContractFactory('PairFlash');
        const flash = (await flashContractFactory.deploy(router.address, factory.address, weth9.address));
        const quoterFactory = await hardhat_1.ethers.getContractFactory('Quoter');
        const quoter = (await quoterFactory.deploy(factory.address, weth9.address));
        return {
            token0,
            token1,
            flash,
            factory,
            weth9,
            nft,
            quoter,
            router,
        };
    };
    let loadFixture;
    before('create fixture loader', async () => {
        loadFixture = hardhat_1.waffle.createFixtureLoader(wallets);
    });
    beforeEach('load fixture', async () => {
        ;
        ({ factory, token0, token1, flash, nft, quoter } = await loadFixture(flashFixture));
        await token0.approve(nft.address, constants_1.MaxUint128);
        await token1.approve(nft.address, constants_1.MaxUint128);
        await createPool(token0.address, token1.address, constants_1.FeeAmount.LOW, (0, encodePriceSqrt_1.encodePriceSqrt)(5, 10));
        await createPool(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
        await createPool(token0.address, token1.address, constants_1.FeeAmount.HIGH, (0, encodePriceSqrt_1.encodePriceSqrt)(20, 10));
    });
    describe('flash', () => {
        it('test correct transfer events', async () => {
            //choose amountIn to test
            const amount0In = 1000;
            const amount1In = 1000;
            const fee0 = Math.ceil((amount0In * constants_1.FeeAmount.MEDIUM) / 1000000);
            const fee1 = Math.ceil((amount1In * constants_1.FeeAmount.MEDIUM) / 1000000);
            const flashParams = {
                token0: token0.address,
                token1: token1.address,
                fee1: constants_1.FeeAmount.MEDIUM,
                amount0: amount0In,
                amount1: amount1In,
                fee2: constants_1.FeeAmount.LOW,
                fee3: constants_1.FeeAmount.HIGH,
            };
            // pool1 is the borrow pool
            const pool1 = (0, computePoolAddress_1.computePoolAddress)(factory.address, [token0.address, token1.address], constants_1.FeeAmount.MEDIUM);
            const pool2 = (0, computePoolAddress_1.computePoolAddress)(factory.address, [token0.address, token1.address], constants_1.FeeAmount.LOW);
            const pool3 = (0, computePoolAddress_1.computePoolAddress)(factory.address, [token0.address, token1.address], constants_1.FeeAmount.HIGH);
            const expectedAmountOut0 = await quoter.callStatic.quoteExactInputSingle(token1.address, token0.address, constants_1.FeeAmount.LOW, amount1In, (0, encodePriceSqrt_1.encodePriceSqrt)(20, 10));
            const expectedAmountOut1 = await quoter.callStatic.quoteExactInputSingle(token0.address, token1.address, constants_1.FeeAmount.HIGH, amount0In, (0, encodePriceSqrt_1.encodePriceSqrt)(5, 10));
            await (0, expect_1.expect)(flash.initFlash(flashParams))
                .to.emit(token0, 'Transfer')
                .withArgs(pool1, flash.address, amount0In)
                .to.emit(token1, 'Transfer')
                .withArgs(pool1, flash.address, amount1In)
                .to.emit(token0, 'Transfer')
                .withArgs(pool2, flash.address, expectedAmountOut0)
                .to.emit(token1, 'Transfer')
                .withArgs(pool3, flash.address, expectedAmountOut1)
                .to.emit(token0, 'Transfer')
                .withArgs(flash.address, wallet.address, expectedAmountOut0.toNumber() - amount0In - fee0)
                .to.emit(token1, 'Transfer')
                .withArgs(flash.address, wallet.address, expectedAmountOut1.toNumber() - amount1In - fee1);
        });
        it('gas', async () => {
            const amount0In = 1000;
            const amount1In = 1000;
            const flashParams = {
                token0: token0.address,
                token1: token1.address,
                fee1: constants_1.FeeAmount.MEDIUM,
                amount0: amount0In,
                amount1: amount1In,
                fee2: constants_1.FeeAmount.LOW,
                fee3: constants_1.FeeAmount.HIGH,
            };
            await (0, snapshotGasCost_1.default)(flash.initFlash(flashParams));
        });
    });
});
