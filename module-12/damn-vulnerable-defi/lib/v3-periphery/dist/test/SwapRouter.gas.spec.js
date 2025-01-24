"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IUniswapV3Pool_json_1 = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const ethers_1 = require("ethers");
const hardhat_1 = require("hardhat");
const completeFixture_1 = __importDefault(require("./shared/completeFixture"));
const constants_1 = require("./shared/constants");
const encodePriceSqrt_1 = require("./shared/encodePriceSqrt");
const expandTo18Decimals_1 = require("./shared/expandTo18Decimals");
const expect_1 = require("./shared/expect");
const path_1 = require("./shared/path");
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
const ticks_1 = require("./shared/ticks");
describe('SwapRouter gas tests', function () {
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
        const liquidity = 1000000;
        async function createPool(tokenAddressA, tokenAddressB) {
            if (tokenAddressA.toLowerCase() > tokenAddressB.toLowerCase())
                [tokenAddressA, tokenAddressB] = [tokenAddressB, tokenAddressA];
            await nft.createAndInitializePoolIfNecessary(tokenAddressA, tokenAddressB, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(100005, 100000) // we don't want to cross any ticks
            );
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
            await weth9.deposit({ value: liquidity * 2 });
            await weth9.approve(nft.address, ethers_1.constants.MaxUint256);
            return createPool(weth9.address, tokenAddress);
        }
        // create pools
        await createPool(tokens[0].address, tokens[1].address);
        await createPool(tokens[1].address, tokens[2].address);
        await createPoolWETH9(tokens[0].address);
        const poolAddresses = await Promise.all([
            factory.getPool(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM),
            factory.getPool(tokens[1].address, tokens[2].address, constants_1.FeeAmount.MEDIUM),
            factory.getPool(weth9.address, tokens[0].address, constants_1.FeeAmount.MEDIUM),
        ]);
        const pools = poolAddresses.map((poolAddress) => new hardhat_1.ethers.Contract(poolAddress, IUniswapV3Pool_json_1.abi, wallet));
        return {
            weth9,
            router,
            tokens,
            pools,
        };
    };
    let weth9;
    let router;
    let tokens;
    let pools;
    let loadFixture;
    before('create fixture loader', async () => {
        const wallets = await hardhat_1.ethers.getSigners();
        [wallet, trader] = wallets;
        loadFixture = hardhat_1.waffle.createFixtureLoader(wallets);
    });
    beforeEach('load fixture', async () => {
        ;
        ({ router, weth9, tokens, pools } = await loadFixture(swapRouterFixture));
    });
    async function exactInput(tokens, amountIn = 2, amountOutMinimum = 1) {
        const inputIsWETH = weth9.address === tokens[0];
        const outputIsWETH9 = tokens[tokens.length - 1] === weth9.address;
        const value = inputIsWETH ? amountIn : 0;
        const params = {
            path: (0, path_1.encodePath)(tokens, new Array(tokens.length - 1).fill(constants_1.FeeAmount.MEDIUM)),
            recipient: outputIsWETH9 ? ethers_1.constants.AddressZero : trader.address,
            deadline: 1,
            amountIn,
            amountOutMinimum: outputIsWETH9 ? 0 : amountOutMinimum, // save on calldata,
        };
        const data = [router.interface.encodeFunctionData('exactInput', [params])];
        if (outputIsWETH9)
            data.push(router.interface.encodeFunctionData('unwrapWETH9', [amountOutMinimum, trader.address]));
        // optimized for the gas test
        return data.length === 1
            ? router.connect(trader).exactInput(params, { value })
            : router.connect(trader).multicall(data, { value });
    }
    async function exactInputSingle(tokenIn, tokenOut, amountIn = 3, amountOutMinimum = 1, sqrtPriceLimitX96) {
        const inputIsWETH = weth9.address === tokenIn;
        const outputIsWETH9 = tokenOut === weth9.address;
        const value = inputIsWETH ? amountIn : 0;
        const params = {
            tokenIn,
            tokenOut,
            fee: constants_1.FeeAmount.MEDIUM,
            sqrtPriceLimitX96: sqrtPriceLimitX96 !== null && sqrtPriceLimitX96 !== void 0 ? sqrtPriceLimitX96 : 0,
            recipient: outputIsWETH9 ? ethers_1.constants.AddressZero : trader.address,
            deadline: 1,
            amountIn,
            amountOutMinimum: outputIsWETH9 ? 0 : amountOutMinimum, // save on calldata
        };
        const data = [router.interface.encodeFunctionData('exactInputSingle', [params])];
        if (outputIsWETH9)
            data.push(router.interface.encodeFunctionData('unwrapWETH9', [amountOutMinimum, trader.address]));
        // optimized for the gas test
        return data.length === 1
            ? router.connect(trader).exactInputSingle(params, { value })
            : router.connect(trader).multicall(data, { value });
    }
    async function exactOutput(tokens) {
        const amountInMaximum = 10; // we don't care
        const amountOut = 1;
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
            data.push(router.interface.encodeFunctionData('refundETH'));
        if (outputIsWETH9)
            data.push(router.interface.encodeFunctionData('unwrapWETH9', [amountOut, trader.address]));
        return router.connect(trader).multicall(data, { value });
    }
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
            sqrtPriceLimitX96: sqrtPriceLimitX96 !== null && sqrtPriceLimitX96 !== void 0 ? sqrtPriceLimitX96 : 0,
        };
        const data = [router.interface.encodeFunctionData('exactOutputSingle', [params])];
        if (inputIsWETH9)
            data.push(router.interface.encodeFunctionData('unwrapWETH9', [0, trader.address]));
        if (outputIsWETH9)
            data.push(router.interface.encodeFunctionData('unwrapWETH9', [amountOut, trader.address]));
        return router.connect(trader).multicall(data, { value });
    }
    // TODO should really throw this in the fixture
    beforeEach('intialize feeGrowthGlobals', async () => {
        await exactInput([tokens[0].address, tokens[1].address], 1, 0);
        await exactInput([tokens[1].address, tokens[0].address], 1, 0);
        await exactInput([tokens[1].address, tokens[2].address], 1, 0);
        await exactInput([tokens[2].address, tokens[1].address], 1, 0);
        await exactInput([tokens[0].address, weth9.address], 1, 0);
        await exactInput([weth9.address, tokens[0].address], 1, 0);
    });
    beforeEach('ensure feeGrowthGlobals are >0', async () => {
        const slots = await Promise.all(pools.map((pool) => Promise.all([
            pool.feeGrowthGlobal0X128().then((f) => f.toString()),
            pool.feeGrowthGlobal1X128().then((f) => f.toString()),
        ])));
        (0, expect_1.expect)(slots).to.deep.eq([
            ['340290874192793283295456993856614', '340290874192793283295456993856614'],
            ['340290874192793283295456993856614', '340290874192793283295456993856614'],
            ['340290874192793283295456993856614', '340290874192793283295456993856614'],
        ]);
    });
    beforeEach('ensure ticks are 0 before', async () => {
        const slots = await Promise.all(pools.map((pool) => pool.slot0().then(({ tick }) => tick)));
        (0, expect_1.expect)(slots).to.deep.eq([0, 0, 0]);
    });
    afterEach('ensure ticks are 0 after', async () => {
        const slots = await Promise.all(pools.map((pool) => pool.slot0().then(({ tick }) => tick)));
        (0, expect_1.expect)(slots).to.deep.eq([0, 0, 0]);
    });
    describe('#exactInput', () => {
        it('0 -> 1', async () => {
            await (0, snapshotGasCost_1.default)(exactInput(tokens.slice(0, 2).map((token) => token.address)));
        });
        it('0 -> 1 minimal', async () => {
            const calleeFactory = await hardhat_1.ethers.getContractFactory('TestUniswapV3Callee');
            const callee = await calleeFactory.deploy();
            await tokens[0].connect(trader).approve(callee.address, ethers_1.constants.MaxUint256);
            await (0, snapshotGasCost_1.default)(callee.connect(trader).swapExact0For1(pools[0].address, 2, trader.address, '4295128740'));
        });
        it('0 -> 1 -> 2', async () => {
            await (0, snapshotGasCost_1.default)(exactInput(tokens.map((token) => token.address), 3));
        });
        it('WETH9 -> 0', async () => {
            await (0, snapshotGasCost_1.default)(exactInput([weth9.address, tokens[0].address], weth9.address.toLowerCase() < tokens[0].address.toLowerCase() ? 2 : 3));
        });
        it('0 -> WETH9', async () => {
            await (0, snapshotGasCost_1.default)(exactInput([tokens[0].address, weth9.address], tokens[0].address.toLowerCase() < weth9.address.toLowerCase() ? 2 : 3));
        });
        it('2 trades (via router)', async () => {
            await weth9.connect(trader).deposit({ value: 3 });
            await weth9.connect(trader).approve(router.address, ethers_1.constants.MaxUint256);
            const swap0 = {
                path: (0, path_1.encodePath)([weth9.address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]),
                recipient: ethers_1.constants.AddressZero,
                deadline: 1,
                amountIn: 3,
                amountOutMinimum: 0, // save on calldata
            };
            const swap1 = {
                path: (0, path_1.encodePath)([tokens[1].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]),
                recipient: ethers_1.constants.AddressZero,
                deadline: 1,
                amountIn: 3,
                amountOutMinimum: 0, // save on calldata
            };
            const data = [
                router.interface.encodeFunctionData('exactInput', [swap0]),
                router.interface.encodeFunctionData('exactInput', [swap1]),
                router.interface.encodeFunctionData('sweepToken', [tokens[0].address, 2, trader.address]),
            ];
            await (0, snapshotGasCost_1.default)(router.connect(trader).multicall(data));
        });
        it('3 trades (directly to sender)', async () => {
            await weth9.connect(trader).deposit({ value: 3 });
            await weth9.connect(trader).approve(router.address, ethers_1.constants.MaxUint256);
            const swap0 = {
                path: (0, path_1.encodePath)([weth9.address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]),
                recipient: trader.address,
                deadline: 1,
                amountIn: 3,
                amountOutMinimum: 1,
            };
            const swap1 = {
                path: (0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]),
                recipient: trader.address,
                deadline: 1,
                amountIn: 3,
                amountOutMinimum: 1,
            };
            const swap2 = {
                path: (0, path_1.encodePath)([tokens[1].address, tokens[2].address], [constants_1.FeeAmount.MEDIUM]),
                recipient: trader.address,
                deadline: 1,
                amountIn: 3,
                amountOutMinimum: 1,
            };
            const data = [
                router.interface.encodeFunctionData('exactInput', [swap0]),
                router.interface.encodeFunctionData('exactInput', [swap1]),
                router.interface.encodeFunctionData('exactInput', [swap2]),
            ];
            await (0, snapshotGasCost_1.default)(router.connect(trader).multicall(data));
        });
    });
    it('3 trades (directly to sender)', async () => {
        await weth9.connect(trader).deposit({ value: 3 });
        await weth9.connect(trader).approve(router.address, ethers_1.constants.MaxUint256);
        const swap0 = {
            path: (0, path_1.encodePath)([weth9.address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]),
            recipient: trader.address,
            deadline: 1,
            amountIn: 3,
            amountOutMinimum: 1,
        };
        const swap1 = {
            path: (0, path_1.encodePath)([tokens[1].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]),
            recipient: trader.address,
            deadline: 1,
            amountIn: 3,
            amountOutMinimum: 1,
        };
        const data = [
            router.interface.encodeFunctionData('exactInput', [swap0]),
            router.interface.encodeFunctionData('exactInput', [swap1]),
        ];
        await (0, snapshotGasCost_1.default)(router.connect(trader).multicall(data));
    });
    describe('#exactInputSingle', () => {
        it('0 -> 1', async () => {
            await (0, snapshotGasCost_1.default)(exactInputSingle(tokens[0].address, tokens[1].address));
        });
        it('WETH9 -> 0', async () => {
            await (0, snapshotGasCost_1.default)(exactInputSingle(weth9.address, tokens[0].address, weth9.address.toLowerCase() < tokens[0].address.toLowerCase() ? 2 : 3));
        });
        it('0 -> WETH9', async () => {
            await (0, snapshotGasCost_1.default)(exactInputSingle(tokens[0].address, weth9.address, tokens[0].address.toLowerCase() < weth9.address.toLowerCase() ? 2 : 3));
        });
    });
    describe('#exactOutput', () => {
        it('0 -> 1', async () => {
            await (0, snapshotGasCost_1.default)(exactOutput(tokens.slice(0, 2).map((token) => token.address)));
        });
        it('0 -> 1 -> 2', async () => {
            await (0, snapshotGasCost_1.default)(exactOutput(tokens.map((token) => token.address)));
        });
        it('WETH9 -> 0', async () => {
            await (0, snapshotGasCost_1.default)(exactOutput([weth9.address, tokens[0].address]));
        });
        it('0 -> WETH9', async () => {
            await (0, snapshotGasCost_1.default)(exactOutput([tokens[0].address, weth9.address]));
        });
    });
    describe('#exactOutputSingle', () => {
        it('0 -> 1', async () => {
            await (0, snapshotGasCost_1.default)(exactOutputSingle(tokens[0].address, tokens[1].address));
        });
        it('WETH9 -> 0', async () => {
            await (0, snapshotGasCost_1.default)(exactOutputSingle(weth9.address, tokens[0].address));
        });
        it('0 -> WETH9', async () => {
            await (0, snapshotGasCost_1.default)(exactOutputSingle(tokens[0].address, weth9.address));
        });
    });
});
