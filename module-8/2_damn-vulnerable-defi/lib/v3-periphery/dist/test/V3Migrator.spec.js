"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const hardhat_1 = require("hardhat");
const completeFixture_1 = __importDefault(require("./shared/completeFixture"));
const externalFixtures_1 = require("./shared/externalFixtures");
const UniswapV2Pair_json_1 = require("@uniswap/v2-core/build/UniswapV2Pair.json");
const chai_1 = require("chai");
const constants_1 = require("./shared/constants");
const encodePriceSqrt_1 = require("./shared/encodePriceSqrt");
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
const tokenSort_1 = require("./shared/tokenSort");
const ticks_1 = require("./shared/ticks");
describe('V3Migrator', () => {
    let wallet;
    const migratorFixture = async (wallets, provider) => {
        const { factory, tokens, nft, weth9 } = await (0, completeFixture_1.default)(wallets, provider);
        const { factory: factoryV2 } = await (0, externalFixtures_1.v2FactoryFixture)(wallets, provider);
        const token = tokens[0];
        await token.approve(factoryV2.address, ethers_1.constants.MaxUint256);
        await weth9.deposit({ value: 10000 });
        await weth9.approve(nft.address, ethers_1.constants.MaxUint256);
        // deploy the migrator
        const migrator = (await (await hardhat_1.ethers.getContractFactory('V3Migrator')).deploy(factory.address, weth9.address, nft.address));
        return {
            factoryV2,
            factoryV3: factory,
            token,
            weth9,
            nft,
            migrator,
        };
    };
    let factoryV2;
    let factoryV3;
    let token;
    let weth9;
    let nft;
    let migrator;
    let pair;
    let loadFixture;
    const expectedLiquidity = 10000 - 1000;
    before('create fixture loader', async () => {
        const wallets = await hardhat_1.ethers.getSigners();
        wallet = wallets[0];
        loadFixture = hardhat_1.waffle.createFixtureLoader(wallets);
    });
    beforeEach('load fixture', async () => {
        ;
        ({ factoryV2, factoryV3, token, weth9, nft, migrator } = await loadFixture(migratorFixture));
    });
    beforeEach('add V2 liquidity', async () => {
        await factoryV2.createPair(token.address, weth9.address);
        const pairAddress = await factoryV2.getPair(token.address, weth9.address);
        pair = new hardhat_1.ethers.Contract(pairAddress, UniswapV2Pair_json_1.abi, wallet);
        await token.transfer(pair.address, 10000);
        await weth9.transfer(pair.address, 10000);
        await pair.mint(wallet.address);
        (0, chai_1.expect)(await pair.balanceOf(wallet.address)).to.be.eq(expectedLiquidity);
    });
    afterEach('ensure allowances are cleared', async () => {
        const allowanceToken = await token.allowance(migrator.address, nft.address);
        const allowanceWETH9 = await weth9.allowance(migrator.address, nft.address);
        (0, chai_1.expect)(allowanceToken).to.be.eq(0);
        (0, chai_1.expect)(allowanceWETH9).to.be.eq(0);
    });
    afterEach('ensure balances are cleared', async () => {
        const balanceToken = await token.balanceOf(migrator.address);
        const balanceWETH9 = await weth9.balanceOf(migrator.address);
        (0, chai_1.expect)(balanceToken).to.be.eq(0);
        (0, chai_1.expect)(balanceWETH9).to.be.eq(0);
    });
    afterEach('ensure eth balance is cleared', async () => {
        const balanceETH = await hardhat_1.ethers.provider.getBalance(migrator.address);
        (0, chai_1.expect)(balanceETH).to.be.eq(0);
    });
    describe('#migrate', () => {
        let tokenLower;
        beforeEach(() => {
            tokenLower = token.address.toLowerCase() < weth9.address.toLowerCase();
        });
        it('fails if v3 pool is not initialized', async () => {
            await pair.approve(migrator.address, expectedLiquidity);
            await (0, chai_1.expect)(migrator.migrate({
                pair: pair.address,
                liquidityToMigrate: expectedLiquidity,
                percentageToMigrate: 100,
                token0: tokenLower ? token.address : weth9.address,
                token1: tokenLower ? weth9.address : token.address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: -1,
                tickUpper: 1,
                amount0Min: 9000,
                amount1Min: 9000,
                recipient: wallet.address,
                deadline: 1,
                refundAsETH: false,
            })).to.be.reverted;
        });
        it('works once v3 pool is initialized', async () => {
            const [token0, token1] = (0, tokenSort_1.sortedTokens)(weth9, token);
            await migrator.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await pair.approve(migrator.address, expectedLiquidity);
            await migrator.migrate({
                pair: pair.address,
                liquidityToMigrate: expectedLiquidity,
                percentageToMigrate: 100,
                token0: tokenLower ? token.address : weth9.address,
                token1: tokenLower ? weth9.address : token.address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.FeeAmount.MEDIUM),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.FeeAmount.MEDIUM),
                amount0Min: 9000,
                amount1Min: 9000,
                recipient: wallet.address,
                deadline: 1,
                refundAsETH: false,
            });
            const position = await nft.positions(1);
            (0, chai_1.expect)(position.liquidity).to.be.eq(9000);
            const poolAddress = await factoryV3.getPool(token.address, weth9.address, constants_1.FeeAmount.MEDIUM);
            (0, chai_1.expect)(await token.balanceOf(poolAddress)).to.be.eq(9000);
            (0, chai_1.expect)(await weth9.balanceOf(poolAddress)).to.be.eq(9000);
        });
        it('works for partial', async () => {
            const [token0, token1] = (0, tokenSort_1.sortedTokens)(weth9, token);
            await migrator.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            const tokenBalanceBefore = await token.balanceOf(wallet.address);
            const weth9BalanceBefore = await weth9.balanceOf(wallet.address);
            await pair.approve(migrator.address, expectedLiquidity);
            await migrator.migrate({
                pair: pair.address,
                liquidityToMigrate: expectedLiquidity,
                percentageToMigrate: 50,
                token0: tokenLower ? token.address : weth9.address,
                token1: tokenLower ? weth9.address : token.address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.FeeAmount.MEDIUM),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.FeeAmount.MEDIUM),
                amount0Min: 4500,
                amount1Min: 4500,
                recipient: wallet.address,
                deadline: 1,
                refundAsETH: false,
            });
            const tokenBalanceAfter = await token.balanceOf(wallet.address);
            const weth9BalanceAfter = await weth9.balanceOf(wallet.address);
            (0, chai_1.expect)(tokenBalanceAfter.sub(tokenBalanceBefore)).to.be.eq(4500);
            (0, chai_1.expect)(weth9BalanceAfter.sub(weth9BalanceBefore)).to.be.eq(4500);
            const position = await nft.positions(1);
            (0, chai_1.expect)(position.liquidity).to.be.eq(4500);
            const poolAddress = await factoryV3.getPool(token.address, weth9.address, constants_1.FeeAmount.MEDIUM);
            (0, chai_1.expect)(await token.balanceOf(poolAddress)).to.be.eq(4500);
            (0, chai_1.expect)(await weth9.balanceOf(poolAddress)).to.be.eq(4500);
        });
        it('double the price', async () => {
            const [token0, token1] = (0, tokenSort_1.sortedTokens)(weth9, token);
            await migrator.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(2, 1));
            const tokenBalanceBefore = await token.balanceOf(wallet.address);
            const weth9BalanceBefore = await weth9.balanceOf(wallet.address);
            await pair.approve(migrator.address, expectedLiquidity);
            await migrator.migrate({
                pair: pair.address,
                liquidityToMigrate: expectedLiquidity,
                percentageToMigrate: 100,
                token0: tokenLower ? token.address : weth9.address,
                token1: tokenLower ? weth9.address : token.address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.FeeAmount.MEDIUM),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.FeeAmount.MEDIUM),
                amount0Min: 4500,
                amount1Min: 8999,
                recipient: wallet.address,
                deadline: 1,
                refundAsETH: false,
            });
            const tokenBalanceAfter = await token.balanceOf(wallet.address);
            const weth9BalanceAfter = await weth9.balanceOf(wallet.address);
            const position = await nft.positions(1);
            (0, chai_1.expect)(position.liquidity).to.be.eq(6363);
            const poolAddress = await factoryV3.getPool(token.address, weth9.address, constants_1.FeeAmount.MEDIUM);
            if (token.address.toLowerCase() < weth9.address.toLowerCase()) {
                (0, chai_1.expect)(await token.balanceOf(poolAddress)).to.be.eq(4500);
                (0, chai_1.expect)(tokenBalanceAfter.sub(tokenBalanceBefore)).to.be.eq(4500);
                (0, chai_1.expect)(await weth9.balanceOf(poolAddress)).to.be.eq(8999);
                (0, chai_1.expect)(weth9BalanceAfter.sub(weth9BalanceBefore)).to.be.eq(1);
            }
            else {
                (0, chai_1.expect)(await token.balanceOf(poolAddress)).to.be.eq(8999);
                (0, chai_1.expect)(tokenBalanceAfter.sub(tokenBalanceBefore)).to.be.eq(1);
                (0, chai_1.expect)(await weth9.balanceOf(poolAddress)).to.be.eq(4500);
                (0, chai_1.expect)(weth9BalanceAfter.sub(weth9BalanceBefore)).to.be.eq(4500);
            }
        });
        it('half the price', async () => {
            const [token0, token1] = (0, tokenSort_1.sortedTokens)(weth9, token);
            await migrator.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 2));
            const tokenBalanceBefore = await token.balanceOf(wallet.address);
            const weth9BalanceBefore = await weth9.balanceOf(wallet.address);
            await pair.approve(migrator.address, expectedLiquidity);
            await migrator.migrate({
                pair: pair.address,
                liquidityToMigrate: expectedLiquidity,
                percentageToMigrate: 100,
                token0: tokenLower ? token.address : weth9.address,
                token1: tokenLower ? weth9.address : token.address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.FeeAmount.MEDIUM),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.FeeAmount.MEDIUM),
                amount0Min: 8999,
                amount1Min: 4500,
                recipient: wallet.address,
                deadline: 1,
                refundAsETH: false,
            });
            const tokenBalanceAfter = await token.balanceOf(wallet.address);
            const weth9BalanceAfter = await weth9.balanceOf(wallet.address);
            const position = await nft.positions(1);
            (0, chai_1.expect)(position.liquidity).to.be.eq(6363);
            const poolAddress = await factoryV3.getPool(token.address, weth9.address, constants_1.FeeAmount.MEDIUM);
            if (token.address.toLowerCase() < weth9.address.toLowerCase()) {
                (0, chai_1.expect)(await token.balanceOf(poolAddress)).to.be.eq(8999);
                (0, chai_1.expect)(tokenBalanceAfter.sub(tokenBalanceBefore)).to.be.eq(1);
                (0, chai_1.expect)(await weth9.balanceOf(poolAddress)).to.be.eq(4500);
                (0, chai_1.expect)(weth9BalanceAfter.sub(weth9BalanceBefore)).to.be.eq(4500);
            }
            else {
                (0, chai_1.expect)(await token.balanceOf(poolAddress)).to.be.eq(4500);
                (0, chai_1.expect)(tokenBalanceAfter.sub(tokenBalanceBefore)).to.be.eq(4500);
                (0, chai_1.expect)(await weth9.balanceOf(poolAddress)).to.be.eq(8999);
                (0, chai_1.expect)(weth9BalanceAfter.sub(weth9BalanceBefore)).to.be.eq(1);
            }
        });
        it('double the price - as ETH', async () => {
            const [token0, token1] = (0, tokenSort_1.sortedTokens)(weth9, token);
            await migrator.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(2, 1));
            const tokenBalanceBefore = await token.balanceOf(wallet.address);
            await pair.approve(migrator.address, expectedLiquidity);
            await (0, chai_1.expect)(migrator.migrate({
                pair: pair.address,
                liquidityToMigrate: expectedLiquidity,
                percentageToMigrate: 100,
                token0: tokenLower ? token.address : weth9.address,
                token1: tokenLower ? weth9.address : token.address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.FeeAmount.MEDIUM),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.FeeAmount.MEDIUM),
                amount0Min: 4500,
                amount1Min: 8999,
                recipient: wallet.address,
                deadline: 1,
                refundAsETH: true,
            }))
                .to.emit(weth9, 'Withdrawal')
                .withArgs(migrator.address, tokenLower ? 1 : 4500);
            const tokenBalanceAfter = await token.balanceOf(wallet.address);
            const position = await nft.positions(1);
            (0, chai_1.expect)(position.liquidity).to.be.eq(6363);
            const poolAddress = await factoryV3.getPool(token.address, weth9.address, constants_1.FeeAmount.MEDIUM);
            if (tokenLower) {
                (0, chai_1.expect)(await token.balanceOf(poolAddress)).to.be.eq(4500);
                (0, chai_1.expect)(tokenBalanceAfter.sub(tokenBalanceBefore)).to.be.eq(4500);
                (0, chai_1.expect)(await weth9.balanceOf(poolAddress)).to.be.eq(8999);
            }
            else {
                (0, chai_1.expect)(await token.balanceOf(poolAddress)).to.be.eq(8999);
                (0, chai_1.expect)(tokenBalanceAfter.sub(tokenBalanceBefore)).to.be.eq(1);
                (0, chai_1.expect)(await weth9.balanceOf(poolAddress)).to.be.eq(4500);
            }
        });
        it('half the price - as ETH', async () => {
            const [token0, token1] = (0, tokenSort_1.sortedTokens)(weth9, token);
            await migrator.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 2));
            const tokenBalanceBefore = await token.balanceOf(wallet.address);
            await pair.approve(migrator.address, expectedLiquidity);
            await (0, chai_1.expect)(migrator.migrate({
                pair: pair.address,
                liquidityToMigrate: expectedLiquidity,
                percentageToMigrate: 100,
                token0: tokenLower ? token.address : weth9.address,
                token1: tokenLower ? weth9.address : token.address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.FeeAmount.MEDIUM),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.FeeAmount.MEDIUM),
                amount0Min: 8999,
                amount1Min: 4500,
                recipient: wallet.address,
                deadline: 1,
                refundAsETH: true,
            }))
                .to.emit(weth9, 'Withdrawal')
                .withArgs(migrator.address, tokenLower ? 4500 : 1);
            const tokenBalanceAfter = await token.balanceOf(wallet.address);
            const position = await nft.positions(1);
            (0, chai_1.expect)(position.liquidity).to.be.eq(6363);
            const poolAddress = await factoryV3.getPool(token.address, weth9.address, constants_1.FeeAmount.MEDIUM);
            if (tokenLower) {
                (0, chai_1.expect)(await token.balanceOf(poolAddress)).to.be.eq(8999);
                (0, chai_1.expect)(tokenBalanceAfter.sub(tokenBalanceBefore)).to.be.eq(1);
                (0, chai_1.expect)(await weth9.balanceOf(poolAddress)).to.be.eq(4500);
            }
            else {
                (0, chai_1.expect)(await token.balanceOf(poolAddress)).to.be.eq(4500);
                (0, chai_1.expect)(tokenBalanceAfter.sub(tokenBalanceBefore)).to.be.eq(4500);
                (0, chai_1.expect)(await weth9.balanceOf(poolAddress)).to.be.eq(8999);
            }
        });
        it('gas', async () => {
            const [token0, token1] = (0, tokenSort_1.sortedTokens)(weth9, token);
            await migrator.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await pair.approve(migrator.address, expectedLiquidity);
            await (0, snapshotGasCost_1.default)(migrator.migrate({
                pair: pair.address,
                liquidityToMigrate: expectedLiquidity,
                percentageToMigrate: 100,
                token0: tokenLower ? token.address : weth9.address,
                token1: tokenLower ? weth9.address : token.address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.FeeAmount.MEDIUM),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.FeeAmount.MEDIUM),
                amount0Min: 9000,
                amount1Min: 9000,
                recipient: wallet.address,
                deadline: 1,
                refundAsETH: false,
            }));
        });
    });
});
