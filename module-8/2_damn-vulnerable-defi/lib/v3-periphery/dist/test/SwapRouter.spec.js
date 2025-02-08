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
const ticks_1 = require("./shared/ticks");
const computePoolAddress_1 = require("./shared/computePoolAddress");
describe('SwapRouter', function () {
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
        return {
            weth9,
            factory,
            router,
            tokens,
            nft,
        };
    };
    let factory;
    let weth9;
    let router;
    let nft;
    let tokens;
    let getBalances;
    let loadFixture;
    before('create fixture loader', async () => {
        ;
        [wallet, trader] = await hardhat_1.ethers.getSigners();
        loadFixture = hardhat_1.waffle.createFixtureLoader([wallet, trader]);
    });
    // helper for getting weth and token balances
    beforeEach('load fixture', async () => {
        ;
        ({ router, weth9, factory, tokens, nft } = await loadFixture(swapRouterFixture));
        getBalances = async (who) => {
            const balances = await Promise.all([
                weth9.balanceOf(who),
                tokens[0].balanceOf(who),
                tokens[1].balanceOf(who),
                tokens[2].balanceOf(who),
            ]);
            return {
                weth9: balances[0],
                token0: balances[1],
                token1: balances[2],
                token2: balances[3],
            };
        };
    });
    // ensure the swap router never ends up with a balance
    afterEach('load fixture', async () => {
        const balances = await getBalances(router.address);
        (0, expect_1.expect)(Object.values(balances).every((b) => b.eq(0))).to.be.eq(true);
        const balance = await hardhat_1.waffle.provider.getBalance(router.address);
        (0, expect_1.expect)(balance.eq(0)).to.be.eq(true);
    });
    it('bytecode size', async () => {
        (0, expect_1.expect)(((await router.provider.getCode(router.address)).length - 2) / 2).to.matchSnapshot();
    });
    describe('swaps', () => {
        const liquidity = 1000000;
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
                recipient: wallet.address,
                amount0Desired: 1000000,
                amount1Desired: 1000000,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 1,
            };
            return nft.mint(liquidityParams);
        }
        async function createPoolWETH9(tokenAddress) {
            await weth9.deposit({ value: liquidity });
            await weth9.approve(nft.address, ethers_1.constants.MaxUint256);
            return createPool(weth9.address, tokenAddress);
        }
        beforeEach('create 0-1 and 1-2 pools', async () => {
            await createPool(tokens[0].address, tokens[1].address);
            await createPool(tokens[1].address, tokens[2].address);
        });
        describe('#exactInput', () => {
            async function exactInput(tokens, amountIn = 3, amountOutMinimum = 1) {
                const inputIsWETH = weth9.address === tokens[0];
                const outputIsWETH9 = tokens[tokens.length - 1] === weth9.address;
                const value = inputIsWETH ? amountIn : 0;
                const params = {
                    path: (0, path_1.encodePath)(tokens, new Array(tokens.length - 1).fill(constants_1.FeeAmount.MEDIUM)),
                    recipient: outputIsWETH9 ? ethers_1.constants.AddressZero : trader.address,
                    deadline: 1,
                    amountIn,
                    amountOutMinimum,
                };
                const data = [router.interface.encodeFunctionData('exactInput', [params])];
                if (outputIsWETH9)
                    data.push(router.interface.encodeFunctionData('unwrapWETH9', [amountOutMinimum, trader.address]));
                // ensure that the swap fails if the limit is any tighter
                params.amountOutMinimum += 1;
                await (0, expect_1.expect)(router.connect(trader).exactInput(params, { value })).to.be.revertedWith('Too little received');
                params.amountOutMinimum -= 1;
                // optimized for the gas test
                return data.length === 1
                    ? router.connect(trader).exactInput(params, { value })
                    : router.connect(trader).multicall(data, { value });
            }
            describe('single-pool', () => {
                it('0 -> 1', async () => {
                    const pool = await factory.getPool(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM);
                    // get balances before
                    const poolBefore = await getBalances(pool);
                    const traderBefore = await getBalances(trader.address);
                    await exactInput(tokens.slice(0, 2).map((token) => token.address));
                    // get balances after
                    const poolAfter = await getBalances(pool);
                    const traderAfter = await getBalances(trader.address);
                    (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(3));
                    (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.add(1));
                    (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.add(3));
                    (0, expect_1.expect)(poolAfter.token1).to.be.eq(poolBefore.token1.sub(1));
                });
                it('1 -> 0', async () => {
                    const pool = await factory.getPool(tokens[1].address, tokens[0].address, constants_1.FeeAmount.MEDIUM);
                    // get balances before
                    const poolBefore = await getBalances(pool);
                    const traderBefore = await getBalances(trader.address);
                    await exactInput(tokens
                        .slice(0, 2)
                        .reverse()
                        .map((token) => token.address));
                    // get balances after
                    const poolAfter = await getBalances(pool);
                    const traderAfter = await getBalances(trader.address);
                    (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                    (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.sub(3));
                    (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.sub(1));
                    (0, expect_1.expect)(poolAfter.token1).to.be.eq(poolBefore.token1.add(3));
                });
            });
            describe('multi-pool', () => {
                it('0 -> 1 -> 2', async () => {
                    const traderBefore = await getBalances(trader.address);
                    await exactInput(tokens.map((token) => token.address), 5, 1);
                    const traderAfter = await getBalances(trader.address);
                    (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(5));
                    (0, expect_1.expect)(traderAfter.token2).to.be.eq(traderBefore.token2.add(1));
                });
                it('2 -> 1 -> 0', async () => {
                    const traderBefore = await getBalances(trader.address);
                    await exactInput(tokens.map((token) => token.address).reverse(), 5, 1);
                    const traderAfter = await getBalances(trader.address);
                    (0, expect_1.expect)(traderAfter.token2).to.be.eq(traderBefore.token2.sub(5));
                    (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                });
                it('events', async () => {
                    await (0, expect_1.expect)(exactInput(tokens.map((token) => token.address), 5, 1))
                        .to.emit(tokens[0], 'Transfer')
                        .withArgs(trader.address, (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM), 5)
                        .to.emit(tokens[1], 'Transfer')
                        .withArgs((0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM), router.address, 3)
                        .to.emit(tokens[1], 'Transfer')
                        .withArgs(router.address, (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[1].address, tokens[2].address], constants_1.FeeAmount.MEDIUM), 3)
                        .to.emit(tokens[2], 'Transfer')
                        .withArgs((0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[1].address, tokens[2].address], constants_1.FeeAmount.MEDIUM), trader.address, 1);
                });
            });
            describe('ETH input', () => {
                describe('WETH9', () => {
                    beforeEach(async () => {
                        await createPoolWETH9(tokens[0].address);
                    });
                    it('WETH9 -> 0', async () => {
                        const pool = await factory.getPool(weth9.address, tokens[0].address, constants_1.FeeAmount.MEDIUM);
                        // get balances before
                        const poolBefore = await getBalances(pool);
                        const traderBefore = await getBalances(trader.address);
                        await (0, expect_1.expect)(exactInput([weth9.address, tokens[0].address]))
                            .to.emit(weth9, 'Deposit')
                            .withArgs(router.address, 3);
                        // get balances after
                        const poolAfter = await getBalances(pool);
                        const traderAfter = await getBalances(trader.address);
                        (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                        (0, expect_1.expect)(poolAfter.weth9).to.be.eq(poolBefore.weth9.add(3));
                        (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.sub(1));
                    });
                    it('WETH9 -> 0 -> 1', async () => {
                        const traderBefore = await getBalances(trader.address);
                        await (0, expect_1.expect)(exactInput([weth9.address, tokens[0].address, tokens[1].address], 5))
                            .to.emit(weth9, 'Deposit')
                            .withArgs(router.address, 5);
                        const traderAfter = await getBalances(trader.address);
                        (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.add(1));
                    });
                });
            });
            describe('ETH output', () => {
                describe('WETH9', () => {
                    beforeEach(async () => {
                        await createPoolWETH9(tokens[0].address);
                        await createPoolWETH9(tokens[1].address);
                    });
                    it('0 -> WETH9', async () => {
                        const pool = await factory.getPool(tokens[0].address, weth9.address, constants_1.FeeAmount.MEDIUM);
                        // get balances before
                        const poolBefore = await getBalances(pool);
                        const traderBefore = await getBalances(trader.address);
                        await (0, expect_1.expect)(exactInput([tokens[0].address, weth9.address]))
                            .to.emit(weth9, 'Withdrawal')
                            .withArgs(router.address, 1);
                        // get balances after
                        const poolAfter = await getBalances(pool);
                        const traderAfter = await getBalances(trader.address);
                        (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(3));
                        (0, expect_1.expect)(poolAfter.weth9).to.be.eq(poolBefore.weth9.sub(1));
                        (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.add(3));
                    });
                    it('0 -> 1 -> WETH9', async () => {
                        // get balances before
                        const traderBefore = await getBalances(trader.address);
                        await (0, expect_1.expect)(exactInput([tokens[0].address, tokens[1].address, weth9.address], 5))
                            .to.emit(weth9, 'Withdrawal')
                            .withArgs(router.address, 1);
                        // get balances after
                        const traderAfter = await getBalances(trader.address);
                        (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(5));
                    });
                });
            });
        });
        describe('#exactInputSingle', () => {
            async function exactInputSingle(tokenIn, tokenOut, amountIn = 3, amountOutMinimum = 1, sqrtPriceLimitX96) {
                const inputIsWETH = weth9.address === tokenIn;
                const outputIsWETH9 = tokenOut === weth9.address;
                const value = inputIsWETH ? amountIn : 0;
                const params = {
                    tokenIn,
                    tokenOut,
                    fee: constants_1.FeeAmount.MEDIUM,
                    sqrtPriceLimitX96: (sqrtPriceLimitX96 !== null && sqrtPriceLimitX96 !== void 0 ? sqrtPriceLimitX96 : tokenIn.toLowerCase() < tokenOut.toLowerCase())
                        ? ethers_1.BigNumber.from('4295128740')
                        : ethers_1.BigNumber.from('1461446703485210103287273052203988822378723970341'),
                    recipient: outputIsWETH9 ? ethers_1.constants.AddressZero : trader.address,
                    deadline: 1,
                    amountIn,
                    amountOutMinimum,
                };
                const data = [router.interface.encodeFunctionData('exactInputSingle', [params])];
                if (outputIsWETH9)
                    data.push(router.interface.encodeFunctionData('unwrapWETH9', [amountOutMinimum, trader.address]));
                // ensure that the swap fails if the limit is any tighter
                params.amountOutMinimum += 1;
                await (0, expect_1.expect)(router.connect(trader).exactInputSingle(params, { value })).to.be.revertedWith('Too little received');
                params.amountOutMinimum -= 1;
                // optimized for the gas test
                return data.length === 1
                    ? router.connect(trader).exactInputSingle(params, { value })
                    : router.connect(trader).multicall(data, { value });
            }
            it('0 -> 1', async () => {
                const pool = await factory.getPool(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM);
                // get balances before
                const poolBefore = await getBalances(pool);
                const traderBefore = await getBalances(trader.address);
                await exactInputSingle(tokens[0].address, tokens[1].address);
                // get balances after
                const poolAfter = await getBalances(pool);
                const traderAfter = await getBalances(trader.address);
                (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(3));
                (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.add(1));
                (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.add(3));
                (0, expect_1.expect)(poolAfter.token1).to.be.eq(poolBefore.token1.sub(1));
            });
            it('1 -> 0', async () => {
                const pool = await factory.getPool(tokens[1].address, tokens[0].address, constants_1.FeeAmount.MEDIUM);
                // get balances before
                const poolBefore = await getBalances(pool);
                const traderBefore = await getBalances(trader.address);
                await exactInputSingle(tokens[1].address, tokens[0].address);
                // get balances after
                const poolAfter = await getBalances(pool);
                const traderAfter = await getBalances(trader.address);
                (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.sub(3));
                (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.sub(1));
                (0, expect_1.expect)(poolAfter.token1).to.be.eq(poolBefore.token1.add(3));
            });
            describe('ETH input', () => {
                describe('WETH9', () => {
                    beforeEach(async () => {
                        await createPoolWETH9(tokens[0].address);
                    });
                    it('WETH9 -> 0', async () => {
                        const pool = await factory.getPool(weth9.address, tokens[0].address, constants_1.FeeAmount.MEDIUM);
                        // get balances before
                        const poolBefore = await getBalances(pool);
                        const traderBefore = await getBalances(trader.address);
                        await (0, expect_1.expect)(exactInputSingle(weth9.address, tokens[0].address))
                            .to.emit(weth9, 'Deposit')
                            .withArgs(router.address, 3);
                        // get balances after
                        const poolAfter = await getBalances(pool);
                        const traderAfter = await getBalances(trader.address);
                        (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                        (0, expect_1.expect)(poolAfter.weth9).to.be.eq(poolBefore.weth9.add(3));
                        (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.sub(1));
                    });
                });
            });
            describe('ETH output', () => {
                describe('WETH9', () => {
                    beforeEach(async () => {
                        await createPoolWETH9(tokens[0].address);
                        await createPoolWETH9(tokens[1].address);
                    });
                    it('0 -> WETH9', async () => {
                        const pool = await factory.getPool(tokens[0].address, weth9.address, constants_1.FeeAmount.MEDIUM);
                        // get balances before
                        const poolBefore = await getBalances(pool);
                        const traderBefore = await getBalances(trader.address);
                        await (0, expect_1.expect)(exactInputSingle(tokens[0].address, weth9.address))
                            .to.emit(weth9, 'Withdrawal')
                            .withArgs(router.address, 1);
                        // get balances after
                        const poolAfter = await getBalances(pool);
                        const traderAfter = await getBalances(trader.address);
                        (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(3));
                        (0, expect_1.expect)(poolAfter.weth9).to.be.eq(poolBefore.weth9.sub(1));
                        (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.add(3));
                    });
                });
            });
        });
        describe('#exactOutput', () => {
            async function exactOutput(tokens, amountOut = 1, amountInMaximum = 3) {
                const inputIsWETH9 = tokens[0] === weth9.address;
                const outputIsWETH9 = tokens[tokens.length - 1] === weth9.address;
                const value = inputIsWETH9 ? amountInMaximum : 0;
                const params = {
                    path: (0, path_1.encodePath)(tokens.slice().reverse(), new Array(tokens.length - 1).fill(constants_1.FeeAmount.MEDIUM)),
                    recipient: outputIsWETH9 ? ethers_1.constants.AddressZero : trader.address,
                    deadline: 1,
                    amountOut,
                    amountInMaximum,
                };
                const data = [router.interface.encodeFunctionData('exactOutput', [params])];
                if (inputIsWETH9)
                    data.push(router.interface.encodeFunctionData('unwrapWETH9', [0, trader.address]));
                if (outputIsWETH9)
                    data.push(router.interface.encodeFunctionData('unwrapWETH9', [amountOut, trader.address]));
                // ensure that the swap fails if the limit is any tighter
                params.amountInMaximum -= 1;
                await (0, expect_1.expect)(router.connect(trader).exactOutput(params, { value })).to.be.revertedWith('Too much requested');
                params.amountInMaximum += 1;
                return router.connect(trader).multicall(data, { value });
            }
            describe('single-pool', () => {
                it('0 -> 1', async () => {
                    const pool = await factory.getPool(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM);
                    // get balances before
                    const poolBefore = await getBalances(pool);
                    const traderBefore = await getBalances(trader.address);
                    await exactOutput(tokens.slice(0, 2).map((token) => token.address));
                    // get balances after
                    const poolAfter = await getBalances(pool);
                    const traderAfter = await getBalances(trader.address);
                    (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(3));
                    (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.add(1));
                    (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.add(3));
                    (0, expect_1.expect)(poolAfter.token1).to.be.eq(poolBefore.token1.sub(1));
                });
                it('1 -> 0', async () => {
                    const pool = await factory.getPool(tokens[1].address, tokens[0].address, constants_1.FeeAmount.MEDIUM);
                    // get balances before
                    const poolBefore = await getBalances(pool);
                    const traderBefore = await getBalances(trader.address);
                    await exactOutput(tokens
                        .slice(0, 2)
                        .reverse()
                        .map((token) => token.address));
                    // get balances after
                    const poolAfter = await getBalances(pool);
                    const traderAfter = await getBalances(trader.address);
                    (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                    (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.sub(3));
                    (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.sub(1));
                    (0, expect_1.expect)(poolAfter.token1).to.be.eq(poolBefore.token1.add(3));
                });
            });
            describe('multi-pool', () => {
                it('0 -> 1 -> 2', async () => {
                    const traderBefore = await getBalances(trader.address);
                    await exactOutput(tokens.map((token) => token.address), 1, 5);
                    const traderAfter = await getBalances(trader.address);
                    (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(5));
                    (0, expect_1.expect)(traderAfter.token2).to.be.eq(traderBefore.token2.add(1));
                });
                it('2 -> 1 -> 0', async () => {
                    const traderBefore = await getBalances(trader.address);
                    await exactOutput(tokens.map((token) => token.address).reverse(), 1, 5);
                    const traderAfter = await getBalances(trader.address);
                    (0, expect_1.expect)(traderAfter.token2).to.be.eq(traderBefore.token2.sub(5));
                    (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                });
                it('events', async () => {
                    await (0, expect_1.expect)(exactOutput(tokens.map((token) => token.address), 1, 5))
                        .to.emit(tokens[2], 'Transfer')
                        .withArgs((0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[2].address, tokens[1].address], constants_1.FeeAmount.MEDIUM), trader.address, 1)
                        .to.emit(tokens[1], 'Transfer')
                        .withArgs((0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[1].address, tokens[0].address], constants_1.FeeAmount.MEDIUM), (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[2].address, tokens[1].address], constants_1.FeeAmount.MEDIUM), 3)
                        .to.emit(tokens[0], 'Transfer')
                        .withArgs(trader.address, (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[1].address, tokens[0].address], constants_1.FeeAmount.MEDIUM), 5);
                });
            });
            describe('ETH input', () => {
                describe('WETH9', () => {
                    beforeEach(async () => {
                        await createPoolWETH9(tokens[0].address);
                    });
                    it('WETH9 -> 0', async () => {
                        const pool = await factory.getPool(weth9.address, tokens[0].address, constants_1.FeeAmount.MEDIUM);
                        // get balances before
                        const poolBefore = await getBalances(pool);
                        const traderBefore = await getBalances(trader.address);
                        await (0, expect_1.expect)(exactOutput([weth9.address, tokens[0].address]))
                            .to.emit(weth9, 'Deposit')
                            .withArgs(router.address, 3);
                        // get balances after
                        const poolAfter = await getBalances(pool);
                        const traderAfter = await getBalances(trader.address);
                        (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                        (0, expect_1.expect)(poolAfter.weth9).to.be.eq(poolBefore.weth9.add(3));
                        (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.sub(1));
                    });
                    it('WETH9 -> 0 -> 1', async () => {
                        const traderBefore = await getBalances(trader.address);
                        await (0, expect_1.expect)(exactOutput([weth9.address, tokens[0].address, tokens[1].address], 1, 5))
                            .to.emit(weth9, 'Deposit')
                            .withArgs(router.address, 5);
                        const traderAfter = await getBalances(trader.address);
                        (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.add(1));
                    });
                });
            });
            describe('ETH output', () => {
                describe('WETH9', () => {
                    beforeEach(async () => {
                        await createPoolWETH9(tokens[0].address);
                        await createPoolWETH9(tokens[1].address);
                    });
                    it('0 -> WETH9', async () => {
                        const pool = await factory.getPool(tokens[0].address, weth9.address, constants_1.FeeAmount.MEDIUM);
                        // get balances before
                        const poolBefore = await getBalances(pool);
                        const traderBefore = await getBalances(trader.address);
                        await (0, expect_1.expect)(exactOutput([tokens[0].address, weth9.address]))
                            .to.emit(weth9, 'Withdrawal')
                            .withArgs(router.address, 1);
                        // get balances after
                        const poolAfter = await getBalances(pool);
                        const traderAfter = await getBalances(trader.address);
                        (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(3));
                        (0, expect_1.expect)(poolAfter.weth9).to.be.eq(poolBefore.weth9.sub(1));
                        (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.add(3));
                    });
                    it('0 -> 1 -> WETH9', async () => {
                        // get balances before
                        const traderBefore = await getBalances(trader.address);
                        await (0, expect_1.expect)(exactOutput([tokens[0].address, tokens[1].address, weth9.address], 1, 5))
                            .to.emit(weth9, 'Withdrawal')
                            .withArgs(router.address, 1);
                        // get balances after
                        const traderAfter = await getBalances(trader.address);
                        (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(5));
                    });
                });
            });
        });
        describe('#exactOutputSingle', () => {
            async function exactOutputSingle(tokenIn, tokenOut, amountOut = 1, amountInMaximum = 3, sqrtPriceLimitX96) {
                const inputIsWETH9 = tokenIn === weth9.address;
                const outputIsWETH9 = tokenOut === weth9.address;
                const value = inputIsWETH9 ? amountInMaximum : 0;
                const params = {
                    tokenIn,
                    tokenOut,
                    fee: constants_1.FeeAmount.MEDIUM,
                    recipient: outputIsWETH9 ? ethers_1.constants.AddressZero : trader.address,
                    deadline: 1,
                    amountOut,
                    amountInMaximum,
                    sqrtPriceLimitX96: (sqrtPriceLimitX96 !== null && sqrtPriceLimitX96 !== void 0 ? sqrtPriceLimitX96 : tokenIn.toLowerCase() < tokenOut.toLowerCase())
                        ? ethers_1.BigNumber.from('4295128740')
                        : ethers_1.BigNumber.from('1461446703485210103287273052203988822378723970341'),
                };
                const data = [router.interface.encodeFunctionData('exactOutputSingle', [params])];
                if (inputIsWETH9)
                    data.push(router.interface.encodeFunctionData('refundETH'));
                if (outputIsWETH9)
                    data.push(router.interface.encodeFunctionData('unwrapWETH9', [amountOut, trader.address]));
                // ensure that the swap fails if the limit is any tighter
                params.amountInMaximum -= 1;
                await (0, expect_1.expect)(router.connect(trader).exactOutputSingle(params, { value })).to.be.revertedWith('Too much requested');
                params.amountInMaximum += 1;
                return router.connect(trader).multicall(data, { value });
            }
            it('0 -> 1', async () => {
                const pool = await factory.getPool(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM);
                // get balances before
                const poolBefore = await getBalances(pool);
                const traderBefore = await getBalances(trader.address);
                await exactOutputSingle(tokens[0].address, tokens[1].address);
                // get balances after
                const poolAfter = await getBalances(pool);
                const traderAfter = await getBalances(trader.address);
                (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(3));
                (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.add(1));
                (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.add(3));
                (0, expect_1.expect)(poolAfter.token1).to.be.eq(poolBefore.token1.sub(1));
            });
            it('1 -> 0', async () => {
                const pool = await factory.getPool(tokens[1].address, tokens[0].address, constants_1.FeeAmount.MEDIUM);
                // get balances before
                const poolBefore = await getBalances(pool);
                const traderBefore = await getBalances(trader.address);
                await exactOutputSingle(tokens[1].address, tokens[0].address);
                // get balances after
                const poolAfter = await getBalances(pool);
                const traderAfter = await getBalances(trader.address);
                (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.sub(3));
                (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.sub(1));
                (0, expect_1.expect)(poolAfter.token1).to.be.eq(poolBefore.token1.add(3));
            });
            describe('ETH input', () => {
                describe('WETH9', () => {
                    beforeEach(async () => {
                        await createPoolWETH9(tokens[0].address);
                    });
                    it('WETH9 -> 0', async () => {
                        const pool = await factory.getPool(weth9.address, tokens[0].address, constants_1.FeeAmount.MEDIUM);
                        // get balances before
                        const poolBefore = await getBalances(pool);
                        const traderBefore = await getBalances(trader.address);
                        await (0, expect_1.expect)(exactOutputSingle(weth9.address, tokens[0].address))
                            .to.emit(weth9, 'Deposit')
                            .withArgs(router.address, 3);
                        // get balances after
                        const poolAfter = await getBalances(pool);
                        const traderAfter = await getBalances(trader.address);
                        (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                        (0, expect_1.expect)(poolAfter.weth9).to.be.eq(poolBefore.weth9.add(3));
                        (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.sub(1));
                    });
                });
            });
            describe('ETH output', () => {
                describe('WETH9', () => {
                    beforeEach(async () => {
                        await createPoolWETH9(tokens[0].address);
                        await createPoolWETH9(tokens[1].address);
                    });
                    it('0 -> WETH9', async () => {
                        const pool = await factory.getPool(tokens[0].address, weth9.address, constants_1.FeeAmount.MEDIUM);
                        // get balances before
                        const poolBefore = await getBalances(pool);
                        const traderBefore = await getBalances(trader.address);
                        await (0, expect_1.expect)(exactOutputSingle(tokens[0].address, weth9.address))
                            .to.emit(weth9, 'Withdrawal')
                            .withArgs(router.address, 1);
                        // get balances after
                        const poolAfter = await getBalances(pool);
                        const traderAfter = await getBalances(trader.address);
                        (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(3));
                        (0, expect_1.expect)(poolAfter.weth9).to.be.eq(poolBefore.weth9.sub(1));
                        (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.add(3));
                    });
                });
            });
        });
        describe('*WithFee', () => {
            const feeRecipient = '0xfEE0000000000000000000000000000000000000';
            it('#sweepTokenWithFee', async () => {
                const amountOutMinimum = 100;
                const params = {
                    path: (0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]),
                    recipient: router.address,
                    deadline: 1,
                    amountIn: 102,
                    amountOutMinimum,
                };
                const data = [
                    router.interface.encodeFunctionData('exactInput', [params]),
                    router.interface.encodeFunctionData('sweepTokenWithFee', [
                        tokens[1].address,
                        amountOutMinimum,
                        trader.address,
                        100,
                        feeRecipient,
                    ]),
                ];
                await router.connect(trader).multicall(data);
                const balance = await tokens[1].balanceOf(feeRecipient);
                (0, expect_1.expect)(balance.eq(1)).to.be.eq(true);
            });
            it('#unwrapWETH9WithFee', async () => {
                const startBalance = await hardhat_1.waffle.provider.getBalance(feeRecipient);
                await createPoolWETH9(tokens[0].address);
                const amountOutMinimum = 100;
                const params = {
                    path: (0, path_1.encodePath)([tokens[0].address, weth9.address], [constants_1.FeeAmount.MEDIUM]),
                    recipient: router.address,
                    deadline: 1,
                    amountIn: 102,
                    amountOutMinimum,
                };
                const data = [
                    router.interface.encodeFunctionData('exactInput', [params]),
                    router.interface.encodeFunctionData('unwrapWETH9WithFee', [
                        amountOutMinimum,
                        trader.address,
                        100,
                        feeRecipient,
                    ]),
                ];
                await router.connect(trader).multicall(data);
                const endBalance = await hardhat_1.waffle.provider.getBalance(feeRecipient);
                (0, expect_1.expect)(endBalance.sub(startBalance).eq(1)).to.be.eq(true);
            });
        });
    });
});
