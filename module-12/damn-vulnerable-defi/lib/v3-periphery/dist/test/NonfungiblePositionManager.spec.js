"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IUniswapV3Pool_json_1 = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const ethers_1 = require("ethers");
const hardhat_1 = require("hardhat");
const completeFixture_1 = __importDefault(require("./shared/completeFixture"));
const computePoolAddress_1 = require("./shared/computePoolAddress");
const constants_1 = require("./shared/constants");
const encodePriceSqrt_1 = require("./shared/encodePriceSqrt");
const expandTo18Decimals_1 = require("./shared/expandTo18Decimals");
const expect_1 = require("./shared/expect");
const extractJSONFromURI_1 = require("./shared/extractJSONFromURI");
const getPermitNFTSignature_1 = __importDefault(require("./shared/getPermitNFTSignature"));
const path_1 = require("./shared/path");
const poolAtAddress_1 = __importDefault(require("./shared/poolAtAddress"));
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
const ticks_1 = require("./shared/ticks");
const tokenSort_1 = require("./shared/tokenSort");
describe('NonfungiblePositionManager', () => {
    let wallets;
    let wallet, other;
    const nftFixture = async (wallets, provider) => {
        const { weth9, factory, tokens, nft, router } = await (0, completeFixture_1.default)(wallets, provider);
        // approve & fund wallets
        for (const token of tokens) {
            await token.approve(nft.address, ethers_1.constants.MaxUint256);
            await token.connect(other).approve(nft.address, ethers_1.constants.MaxUint256);
            await token.transfer(other.address, (0, expandTo18Decimals_1.expandTo18Decimals)(1000000));
        }
        return {
            nft,
            factory,
            tokens,
            weth9,
            router,
        };
    };
    let factory;
    let nft;
    let tokens;
    let weth9;
    let router;
    let loadFixture;
    before('create fixture loader', async () => {
        wallets = await hardhat_1.ethers.getSigners();
        [wallet, other] = wallets;
        loadFixture = hardhat_1.waffle.createFixtureLoader(wallets);
    });
    beforeEach('load fixture', async () => {
        ;
        ({ nft, factory, tokens, weth9, router } = await loadFixture(nftFixture));
    });
    it('bytecode size', async () => {
        (0, expect_1.expect)(((await nft.provider.getCode(nft.address)).length - 2) / 2).to.matchSnapshot();
    });
    describe('#createAndInitializePoolIfNecessary', () => {
        it('creates the pool at the expected address', async () => {
            const expectedAddress = (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM);
            const code = await wallet.provider.getCode(expectedAddress);
            (0, expect_1.expect)(code).to.eq('0x');
            await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            const codeAfter = await wallet.provider.getCode(expectedAddress);
            (0, expect_1.expect)(codeAfter).to.not.eq('0x');
        });
        it('is payable', async () => {
            await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1), { value: 1 });
        });
        it('works if pool is created but not initialized', async () => {
            const expectedAddress = (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM);
            await factory.createPool(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM);
            const code = await wallet.provider.getCode(expectedAddress);
            (0, expect_1.expect)(code).to.not.eq('0x');
            await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(2, 1));
        });
        it('works if pool is created and initialized', async () => {
            const expectedAddress = (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM);
            await factory.createPool(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM);
            const pool = new hardhat_1.ethers.Contract(expectedAddress, IUniswapV3Pool_json_1.abi, wallet);
            await pool.initialize((0, encodePriceSqrt_1.encodePriceSqrt)(3, 1));
            const code = await wallet.provider.getCode(expectedAddress);
            (0, expect_1.expect)(code).to.not.eq('0x');
            await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(4, 1));
        });
        it('could theoretically use eth via multicall', async () => {
            const [token0, token1] = (0, tokenSort_1.sortedTokens)(weth9, tokens[0]);
            const createAndInitializePoolIfNecessaryData = nft.interface.encodeFunctionData('createAndInitializePoolIfNecessary', [token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1)]);
            await nft.multicall([createAndInitializePoolIfNecessaryData], { value: (0, expandTo18Decimals_1.expandTo18Decimals)(1) });
        });
        it('gas', async () => {
            await (0, snapshotGasCost_1.default)(nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1)));
        });
    });
    describe('#mint', () => {
        it('fails if pool does not exist', async () => {
            await (0, expect_1.expect)(nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                recipient: wallet.address,
                deadline: 1,
                fee: constants_1.FeeAmount.MEDIUM,
            })).to.be.reverted;
        });
        it('fails if cannot transfer', async () => {
            await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await tokens[0].approve(nft.address, 0);
            await (0, expect_1.expect)(nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                recipient: wallet.address,
                deadline: 1,
            })).to.be.revertedWith('STF');
        });
        it('creates a token', async () => {
            await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                fee: constants_1.FeeAmount.MEDIUM,
                recipient: other.address,
                amount0Desired: 15,
                amount1Desired: 15,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 10,
            });
            (0, expect_1.expect)(await nft.balanceOf(other.address)).to.eq(1);
            (0, expect_1.expect)(await nft.tokenOfOwnerByIndex(other.address, 0)).to.eq(1);
            const { fee, token0, token1, tickLower, tickUpper, liquidity, tokensOwed0, tokensOwed1, feeGrowthInside0LastX128, feeGrowthInside1LastX128, } = await nft.positions(1);
            (0, expect_1.expect)(token0).to.eq(tokens[0].address);
            (0, expect_1.expect)(token1).to.eq(tokens[1].address);
            (0, expect_1.expect)(fee).to.eq(constants_1.FeeAmount.MEDIUM);
            (0, expect_1.expect)(tickLower).to.eq((0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
            (0, expect_1.expect)(tickUpper).to.eq((0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
            (0, expect_1.expect)(liquidity).to.eq(15);
            (0, expect_1.expect)(tokensOwed0).to.eq(0);
            (0, expect_1.expect)(tokensOwed1).to.eq(0);
            (0, expect_1.expect)(feeGrowthInside0LastX128).to.eq(0);
            (0, expect_1.expect)(feeGrowthInside1LastX128).to.eq(0);
        });
        it('can use eth via multicall', async () => {
            const [token0, token1] = (0, tokenSort_1.sortedTokens)(weth9, tokens[0]);
            // remove any approval
            await weth9.approve(nft.address, 0);
            const createAndInitializeData = nft.interface.encodeFunctionData('createAndInitializePoolIfNecessary', [
                token0.address,
                token1.address,
                constants_1.FeeAmount.MEDIUM,
                (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1),
            ]);
            const mintData = nft.interface.encodeFunctionData('mint', [
                {
                    token0: token0.address,
                    token1: token1.address,
                    tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                    tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                    fee: constants_1.FeeAmount.MEDIUM,
                    recipient: other.address,
                    amount0Desired: 100,
                    amount1Desired: 100,
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: 1,
                },
            ]);
            const refundETHData = nft.interface.encodeFunctionData('refundETH');
            const balanceBefore = await wallet.getBalance();
            const tx = await nft.multicall([createAndInitializeData, mintData, refundETHData], {
                value: (0, expandTo18Decimals_1.expandTo18Decimals)(1),
            });
            const receipt = await tx.wait();
            const balanceAfter = await wallet.getBalance();
            (0, expect_1.expect)(balanceBefore).to.eq(balanceAfter.add(receipt.gasUsed.mul(tx.gasPrice || 0)).add(100));
        });
        it('emits an event');
        it('gas first mint for pool', async () => {
            await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await (0, snapshotGasCost_1.default)(nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                fee: constants_1.FeeAmount.MEDIUM,
                recipient: wallet.address,
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 10,
            }));
        });
        it('gas first mint for pool using eth with zero refund', async () => {
            const [token0, token1] = (0, tokenSort_1.sortedTokens)(weth9, tokens[0]);
            await nft.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await (0, snapshotGasCost_1.default)(nft.multicall([
                nft.interface.encodeFunctionData('mint', [
                    {
                        token0: token0.address,
                        token1: token1.address,
                        tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                        tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                        fee: constants_1.FeeAmount.MEDIUM,
                        recipient: wallet.address,
                        amount0Desired: 100,
                        amount1Desired: 100,
                        amount0Min: 0,
                        amount1Min: 0,
                        deadline: 10,
                    },
                ]),
                nft.interface.encodeFunctionData('refundETH'),
            ], { value: 100 }));
        });
        it('gas first mint for pool using eth with non-zero refund', async () => {
            const [token0, token1] = (0, tokenSort_1.sortedTokens)(weth9, tokens[0]);
            await nft.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await (0, snapshotGasCost_1.default)(nft.multicall([
                nft.interface.encodeFunctionData('mint', [
                    {
                        token0: token0.address,
                        token1: token1.address,
                        tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                        tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                        fee: constants_1.FeeAmount.MEDIUM,
                        recipient: wallet.address,
                        amount0Desired: 100,
                        amount1Desired: 100,
                        amount0Min: 0,
                        amount1Min: 0,
                        deadline: 10,
                    },
                ]),
                nft.interface.encodeFunctionData('refundETH'),
            ], { value: 1000 }));
        });
        it('gas mint on same ticks', async () => {
            await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                fee: constants_1.FeeAmount.MEDIUM,
                recipient: other.address,
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 10,
            });
            await (0, snapshotGasCost_1.default)(nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                fee: constants_1.FeeAmount.MEDIUM,
                recipient: wallet.address,
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 10,
            }));
        });
        it('gas mint for same pool, different ticks', async () => {
            await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                fee: constants_1.FeeAmount.MEDIUM,
                recipient: other.address,
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 10,
            });
            await (0, snapshotGasCost_1.default)(nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]) + constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM],
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]) - constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM],
                fee: constants_1.FeeAmount.MEDIUM,
                recipient: wallet.address,
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 10,
            }));
        });
    });
    describe('#increaseLiquidity', () => {
        const tokenId = 1;
        beforeEach('create a position', async () => {
            await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                fee: constants_1.FeeAmount.MEDIUM,
                recipient: other.address,
                amount0Desired: 1000,
                amount1Desired: 1000,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 1,
            });
        });
        it('increases position liquidity', async () => {
            await nft.increaseLiquidity({
                tokenId: tokenId,
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 1,
            });
            const { liquidity } = await nft.positions(tokenId);
            (0, expect_1.expect)(liquidity).to.eq(1100);
        });
        it('emits an event');
        it('can be paid with ETH', async () => {
            const [token0, token1] = (0, tokenSort_1.sortedTokens)(tokens[0], weth9);
            const tokenId = 1;
            await nft.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            const mintData = nft.interface.encodeFunctionData('mint', [
                {
                    token0: token0.address,
                    token1: token1.address,
                    fee: constants_1.FeeAmount.MEDIUM,
                    tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                    tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                    recipient: other.address,
                    amount0Desired: 100,
                    amount1Desired: 100,
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: 1,
                },
            ]);
            const refundETHData = nft.interface.encodeFunctionData('unwrapWETH9', [0, other.address]);
            await nft.multicall([mintData, refundETHData], { value: (0, expandTo18Decimals_1.expandTo18Decimals)(1) });
            const increaseLiquidityData = nft.interface.encodeFunctionData('increaseLiquidity', [
                {
                    tokenId: tokenId,
                    amount0Desired: 100,
                    amount1Desired: 100,
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: 1,
                },
            ]);
            await nft.multicall([increaseLiquidityData, refundETHData], { value: (0, expandTo18Decimals_1.expandTo18Decimals)(1) });
        });
        it('gas', async () => {
            await (0, snapshotGasCost_1.default)(nft.increaseLiquidity({
                tokenId: tokenId,
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 1,
            }));
        });
    });
    describe('#decreaseLiquidity', () => {
        const tokenId = 1;
        beforeEach('create a position', async () => {
            await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                fee: constants_1.FeeAmount.MEDIUM,
                recipient: other.address,
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 1,
            });
        });
        it('emits an event');
        it('fails if past deadline', async () => {
            await nft.setTime(2);
            await (0, expect_1.expect)(nft.connect(other).decreaseLiquidity({ tokenId, liquidity: 50, amount0Min: 0, amount1Min: 0, deadline: 1 })).to.be.revertedWith('Transaction too old');
        });
        it('cannot be called by other addresses', async () => {
            await (0, expect_1.expect)(nft.decreaseLiquidity({ tokenId, liquidity: 50, amount0Min: 0, amount1Min: 0, deadline: 1 })).to.be.revertedWith('Not approved');
        });
        it('decreases position liquidity', async () => {
            await nft.connect(other).decreaseLiquidity({ tokenId, liquidity: 25, amount0Min: 0, amount1Min: 0, deadline: 1 });
            const { liquidity } = await nft.positions(tokenId);
            (0, expect_1.expect)(liquidity).to.eq(75);
        });
        it('is payable', async () => {
            await nft
                .connect(other)
                .decreaseLiquidity({ tokenId, liquidity: 25, amount0Min: 0, amount1Min: 0, deadline: 1 }, { value: 1 });
        });
        it('accounts for tokens owed', async () => {
            await nft.connect(other).decreaseLiquidity({ tokenId, liquidity: 25, amount0Min: 0, amount1Min: 0, deadline: 1 });
            const { tokensOwed0, tokensOwed1 } = await nft.positions(tokenId);
            (0, expect_1.expect)(tokensOwed0).to.eq(24);
            (0, expect_1.expect)(tokensOwed1).to.eq(24);
        });
        it('can decrease for all the liquidity', async () => {
            await nft.connect(other).decreaseLiquidity({ tokenId, liquidity: 100, amount0Min: 0, amount1Min: 0, deadline: 1 });
            const { liquidity } = await nft.positions(tokenId);
            (0, expect_1.expect)(liquidity).to.eq(0);
        });
        it('cannot decrease for more than all the liquidity', async () => {
            await (0, expect_1.expect)(nft.connect(other).decreaseLiquidity({ tokenId, liquidity: 101, amount0Min: 0, amount1Min: 0, deadline: 1 })).to.be.reverted;
        });
        it('cannot decrease for more than the liquidity of the nft position', async () => {
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                fee: constants_1.FeeAmount.MEDIUM,
                recipient: other.address,
                amount0Desired: 200,
                amount1Desired: 200,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 1,
            });
            await (0, expect_1.expect)(nft.connect(other).decreaseLiquidity({ tokenId, liquidity: 101, amount0Min: 0, amount1Min: 0, deadline: 1 })).to.be.reverted;
        });
        it('gas partial decrease', async () => {
            await (0, snapshotGasCost_1.default)(nft.connect(other).decreaseLiquidity({ tokenId, liquidity: 50, amount0Min: 0, amount1Min: 0, deadline: 1 }));
        });
        it('gas complete decrease', async () => {
            await (0, snapshotGasCost_1.default)(nft.connect(other).decreaseLiquidity({ tokenId, liquidity: 100, amount0Min: 0, amount1Min: 0, deadline: 1 }));
        });
    });
    describe('#collect', () => {
        const tokenId = 1;
        beforeEach('create a position', async () => {
            await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                recipient: other.address,
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 1,
            });
        });
        it('emits an event');
        it('cannot be called by other addresses', async () => {
            await (0, expect_1.expect)(nft.collect({
                tokenId,
                recipient: wallet.address,
                amount0Max: constants_1.MaxUint128,
                amount1Max: constants_1.MaxUint128,
            })).to.be.revertedWith('Not approved');
        });
        it('cannot be called with 0 for both amounts', async () => {
            await (0, expect_1.expect)(nft.connect(other).collect({
                tokenId,
                recipient: wallet.address,
                amount0Max: 0,
                amount1Max: 0,
            })).to.be.reverted;
        });
        it('no op if no tokens are owed', async () => {
            await (0, expect_1.expect)(nft.connect(other).collect({
                tokenId,
                recipient: wallet.address,
                amount0Max: constants_1.MaxUint128,
                amount1Max: constants_1.MaxUint128,
            }))
                .to.not.emit(tokens[0], 'Transfer')
                .to.not.emit(tokens[1], 'Transfer');
        });
        it('transfers tokens owed from burn', async () => {
            await nft.connect(other).decreaseLiquidity({ tokenId, liquidity: 50, amount0Min: 0, amount1Min: 0, deadline: 1 });
            const poolAddress = (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM);
            await (0, expect_1.expect)(nft.connect(other).collect({
                tokenId,
                recipient: wallet.address,
                amount0Max: constants_1.MaxUint128,
                amount1Max: constants_1.MaxUint128,
            }))
                .to.emit(tokens[0], 'Transfer')
                .withArgs(poolAddress, wallet.address, 49)
                .to.emit(tokens[1], 'Transfer')
                .withArgs(poolAddress, wallet.address, 49);
        });
        it('gas transfers both', async () => {
            await nft.connect(other).decreaseLiquidity({ tokenId, liquidity: 50, amount0Min: 0, amount1Min: 0, deadline: 1 });
            await (0, snapshotGasCost_1.default)(nft.connect(other).collect({
                tokenId,
                recipient: wallet.address,
                amount0Max: constants_1.MaxUint128,
                amount1Max: constants_1.MaxUint128,
            }));
        });
        it('gas transfers token0 only', async () => {
            await nft.connect(other).decreaseLiquidity({ tokenId, liquidity: 50, amount0Min: 0, amount1Min: 0, deadline: 1 });
            await (0, snapshotGasCost_1.default)(nft.connect(other).collect({
                tokenId,
                recipient: wallet.address,
                amount0Max: constants_1.MaxUint128,
                amount1Max: 0,
            }));
        });
        it('gas transfers token1 only', async () => {
            await nft.connect(other).decreaseLiquidity({ tokenId, liquidity: 50, amount0Min: 0, amount1Min: 0, deadline: 1 });
            await (0, snapshotGasCost_1.default)(nft.connect(other).collect({
                tokenId,
                recipient: wallet.address,
                amount0Max: 0,
                amount1Max: constants_1.MaxUint128,
            }));
        });
    });
    describe('#burn', () => {
        const tokenId = 1;
        beforeEach('create a position', async () => {
            await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                recipient: other.address,
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 1,
            });
        });
        it('emits an event');
        it('cannot be called by other addresses', async () => {
            await (0, expect_1.expect)(nft.burn(tokenId)).to.be.revertedWith('Not approved');
        });
        it('cannot be called while there is still liquidity', async () => {
            await (0, expect_1.expect)(nft.connect(other).burn(tokenId)).to.be.revertedWith('Not cleared');
        });
        it('cannot be called while there is still partial liquidity', async () => {
            await nft.connect(other).decreaseLiquidity({ tokenId, liquidity: 50, amount0Min: 0, amount1Min: 0, deadline: 1 });
            await (0, expect_1.expect)(nft.connect(other).burn(tokenId)).to.be.revertedWith('Not cleared');
        });
        it('cannot be called while there is still tokens owed', async () => {
            await nft.connect(other).decreaseLiquidity({ tokenId, liquidity: 100, amount0Min: 0, amount1Min: 0, deadline: 1 });
            await (0, expect_1.expect)(nft.connect(other).burn(tokenId)).to.be.revertedWith('Not cleared');
        });
        it('deletes the token', async () => {
            await nft.connect(other).decreaseLiquidity({ tokenId, liquidity: 100, amount0Min: 0, amount1Min: 0, deadline: 1 });
            await nft.connect(other).collect({
                tokenId,
                recipient: wallet.address,
                amount0Max: constants_1.MaxUint128,
                amount1Max: constants_1.MaxUint128,
            });
            await nft.connect(other).burn(tokenId);
            await (0, expect_1.expect)(nft.positions(tokenId)).to.be.revertedWith('Invalid token ID');
        });
        it('gas', async () => {
            await nft.connect(other).decreaseLiquidity({ tokenId, liquidity: 100, amount0Min: 0, amount1Min: 0, deadline: 1 });
            await nft.connect(other).collect({
                tokenId,
                recipient: wallet.address,
                amount0Max: constants_1.MaxUint128,
                amount1Max: constants_1.MaxUint128,
            });
            await (0, snapshotGasCost_1.default)(nft.connect(other).burn(tokenId));
        });
    });
    describe('#transferFrom', () => {
        const tokenId = 1;
        beforeEach('create a position', async () => {
            await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                recipient: other.address,
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 1,
            });
        });
        it('can only be called by authorized or owner', async () => {
            await (0, expect_1.expect)(nft.transferFrom(other.address, wallet.address, tokenId)).to.be.revertedWith('ERC721: transfer caller is not owner nor approved');
        });
        it('changes the owner', async () => {
            await nft.connect(other).transferFrom(other.address, wallet.address, tokenId);
            (0, expect_1.expect)(await nft.ownerOf(tokenId)).to.eq(wallet.address);
        });
        it('removes existing approval', async () => {
            await nft.connect(other).approve(wallet.address, tokenId);
            (0, expect_1.expect)(await nft.getApproved(tokenId)).to.eq(wallet.address);
            await nft.transferFrom(other.address, wallet.address, tokenId);
            (0, expect_1.expect)(await nft.getApproved(tokenId)).to.eq(ethers_1.constants.AddressZero);
        });
        it('gas', async () => {
            await (0, snapshotGasCost_1.default)(nft.connect(other).transferFrom(other.address, wallet.address, tokenId));
        });
        it('gas comes from approved', async () => {
            await nft.connect(other).approve(wallet.address, tokenId);
            await (0, snapshotGasCost_1.default)(nft.transferFrom(other.address, wallet.address, tokenId));
        });
    });
    describe('#permit', () => {
        it('emits an event');
        describe('owned by eoa', () => {
            const tokenId = 1;
            beforeEach('create a position', async () => {
                await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
                await nft.mint({
                    token0: tokens[0].address,
                    token1: tokens[1].address,
                    fee: constants_1.FeeAmount.MEDIUM,
                    tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                    tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                    recipient: other.address,
                    amount0Desired: 100,
                    amount1Desired: 100,
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: 1,
                });
            });
            it('changes the operator of the position and increments the nonce', async () => {
                const { v, r, s } = await (0, getPermitNFTSignature_1.default)(other, nft, wallet.address, tokenId, 1);
                await nft.permit(wallet.address, tokenId, 1, v, r, s);
                (0, expect_1.expect)((await nft.positions(tokenId)).nonce).to.eq(1);
                (0, expect_1.expect)((await nft.positions(tokenId)).operator).to.eq(wallet.address);
            });
            it('cannot be called twice with the same signature', async () => {
                const { v, r, s } = await (0, getPermitNFTSignature_1.default)(other, nft, wallet.address, tokenId, 1);
                await nft.permit(wallet.address, tokenId, 1, v, r, s);
                await (0, expect_1.expect)(nft.permit(wallet.address, tokenId, 1, v, r, s)).to.be.reverted;
            });
            it('fails with invalid signature', async () => {
                const { v, r, s } = await (0, getPermitNFTSignature_1.default)(wallet, nft, wallet.address, tokenId, 1);
                await (0, expect_1.expect)(nft.permit(wallet.address, tokenId, 1, v + 3, r, s)).to.be.revertedWith('Invalid signature');
            });
            it('fails with signature not from owner', async () => {
                const { v, r, s } = await (0, getPermitNFTSignature_1.default)(wallet, nft, wallet.address, tokenId, 1);
                await (0, expect_1.expect)(nft.permit(wallet.address, tokenId, 1, v, r, s)).to.be.revertedWith('Unauthorized');
            });
            it('fails with expired signature', async () => {
                await nft.setTime(2);
                const { v, r, s } = await (0, getPermitNFTSignature_1.default)(other, nft, wallet.address, tokenId, 1);
                await (0, expect_1.expect)(nft.permit(wallet.address, tokenId, 1, v, r, s)).to.be.revertedWith('Permit expired');
            });
            it('gas', async () => {
                const { v, r, s } = await (0, getPermitNFTSignature_1.default)(other, nft, wallet.address, tokenId, 1);
                await (0, snapshotGasCost_1.default)(nft.permit(wallet.address, tokenId, 1, v, r, s));
            });
        });
        describe('owned by verifying contract', () => {
            const tokenId = 1;
            let testPositionNFTOwner;
            beforeEach('deploy test owner and create a position', async () => {
                testPositionNFTOwner = (await (await hardhat_1.ethers.getContractFactory('TestPositionNFTOwner')).deploy());
                await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
                await nft.mint({
                    token0: tokens[0].address,
                    token1: tokens[1].address,
                    fee: constants_1.FeeAmount.MEDIUM,
                    tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                    tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                    recipient: testPositionNFTOwner.address,
                    amount0Desired: 100,
                    amount1Desired: 100,
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: 1,
                });
            });
            it('changes the operator of the position and increments the nonce', async () => {
                const { v, r, s } = await (0, getPermitNFTSignature_1.default)(other, nft, wallet.address, tokenId, 1);
                await testPositionNFTOwner.setOwner(other.address);
                await nft.permit(wallet.address, tokenId, 1, v, r, s);
                (0, expect_1.expect)((await nft.positions(tokenId)).nonce).to.eq(1);
                (0, expect_1.expect)((await nft.positions(tokenId)).operator).to.eq(wallet.address);
            });
            it('fails if owner contract is owned by different address', async () => {
                const { v, r, s } = await (0, getPermitNFTSignature_1.default)(other, nft, wallet.address, tokenId, 1);
                await testPositionNFTOwner.setOwner(wallet.address);
                await (0, expect_1.expect)(nft.permit(wallet.address, tokenId, 1, v, r, s)).to.be.revertedWith('Unauthorized');
            });
            it('fails with signature not from owner', async () => {
                const { v, r, s } = await (0, getPermitNFTSignature_1.default)(wallet, nft, wallet.address, tokenId, 1);
                await testPositionNFTOwner.setOwner(other.address);
                await (0, expect_1.expect)(nft.permit(wallet.address, tokenId, 1, v, r, s)).to.be.revertedWith('Unauthorized');
            });
            it('fails with expired signature', async () => {
                await nft.setTime(2);
                const { v, r, s } = await (0, getPermitNFTSignature_1.default)(other, nft, wallet.address, tokenId, 1);
                await testPositionNFTOwner.setOwner(other.address);
                await (0, expect_1.expect)(nft.permit(wallet.address, tokenId, 1, v, r, s)).to.be.revertedWith('Permit expired');
            });
            it('gas', async () => {
                const { v, r, s } = await (0, getPermitNFTSignature_1.default)(other, nft, wallet.address, tokenId, 1);
                await testPositionNFTOwner.setOwner(other.address);
                await (0, snapshotGasCost_1.default)(nft.permit(wallet.address, tokenId, 1, v, r, s));
            });
        });
    });
    describe('multicall exit', () => {
        const tokenId = 1;
        beforeEach('create a position', async () => {
            await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                recipient: other.address,
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 1,
            });
        });
        async function exit({ nft, liquidity, tokenId, amount0Min, amount1Min, recipient, }) {
            const decreaseLiquidityData = nft.interface.encodeFunctionData('decreaseLiquidity', [
                { tokenId, liquidity, amount0Min, amount1Min, deadline: 1 },
            ]);
            const collectData = nft.interface.encodeFunctionData('collect', [
                {
                    tokenId,
                    recipient,
                    amount0Max: constants_1.MaxUint128,
                    amount1Max: constants_1.MaxUint128,
                },
            ]);
            const burnData = nft.interface.encodeFunctionData('burn', [tokenId]);
            return nft.multicall([decreaseLiquidityData, collectData, burnData]);
        }
        it('executes all the actions', async () => {
            const pool = (0, poolAtAddress_1.default)((0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM), wallet);
            await (0, expect_1.expect)(exit({
                nft: nft.connect(other),
                tokenId,
                liquidity: 100,
                amount0Min: 0,
                amount1Min: 0,
                recipient: wallet.address,
            }))
                .to.emit(pool, 'Burn')
                .to.emit(pool, 'Collect');
        });
        it('gas', async () => {
            await (0, snapshotGasCost_1.default)(exit({
                nft: nft.connect(other),
                tokenId,
                liquidity: 100,
                amount0Min: 0,
                amount1Min: 0,
                recipient: wallet.address,
            }));
        });
    });
    describe('#tokenURI', async () => {
        const tokenId = 1;
        beforeEach('create a position', async () => {
            await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                recipient: other.address,
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 1,
            });
        });
        it('reverts for invalid token id', async () => {
            await (0, expect_1.expect)(nft.tokenURI(tokenId + 1)).to.be.reverted;
        });
        it('returns a data URI with correct mime type', async () => {
            (0, expect_1.expect)(await nft.tokenURI(tokenId)).to.match(/data:application\/json;base64,.+/);
        });
        it('content is valid JSON and structure', async () => {
            const content = (0, extractJSONFromURI_1.extractJSONFromURI)(await nft.tokenURI(tokenId));
            (0, expect_1.expect)(content).to.haveOwnProperty('name').is.a('string');
            (0, expect_1.expect)(content).to.haveOwnProperty('description').is.a('string');
            (0, expect_1.expect)(content).to.haveOwnProperty('image').is.a('string');
        });
    });
    describe('fees accounting', () => {
        beforeEach('create two positions', async () => {
            await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            // nft 1 earns 25% of fees
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.FeeAmount.MEDIUM),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.FeeAmount.MEDIUM),
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 1,
                recipient: wallet.address,
            });
            // nft 2 earns 75% of fees
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.FeeAmount.MEDIUM),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.FeeAmount.MEDIUM),
                amount0Desired: 300,
                amount1Desired: 300,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 1,
                recipient: wallet.address,
            });
        });
        describe('10k of token0 fees collect', () => {
            beforeEach('swap for ~10k of fees', async () => {
                const swapAmount = 3333333;
                await tokens[0].approve(router.address, swapAmount);
                await router.exactInput({
                    recipient: wallet.address,
                    deadline: 1,
                    path: (0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]),
                    amountIn: swapAmount,
                    amountOutMinimum: 0,
                });
            });
            it('expected amounts', async () => {
                const { amount0: nft1Amount0, amount1: nft1Amount1 } = await nft.callStatic.collect({
                    tokenId: 1,
                    recipient: wallet.address,
                    amount0Max: constants_1.MaxUint128,
                    amount1Max: constants_1.MaxUint128,
                });
                const { amount0: nft2Amount0, amount1: nft2Amount1 } = await nft.callStatic.collect({
                    tokenId: 2,
                    recipient: wallet.address,
                    amount0Max: constants_1.MaxUint128,
                    amount1Max: constants_1.MaxUint128,
                });
                (0, expect_1.expect)(nft1Amount0).to.eq(2501);
                (0, expect_1.expect)(nft1Amount1).to.eq(0);
                (0, expect_1.expect)(nft2Amount0).to.eq(7503);
                (0, expect_1.expect)(nft2Amount1).to.eq(0);
            });
            it('actually collected', async () => {
                const poolAddress = (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM);
                await (0, expect_1.expect)(nft.collect({
                    tokenId: 1,
                    recipient: wallet.address,
                    amount0Max: constants_1.MaxUint128,
                    amount1Max: constants_1.MaxUint128,
                }))
                    .to.emit(tokens[0], 'Transfer')
                    .withArgs(poolAddress, wallet.address, 2501)
                    .to.not.emit(tokens[1], 'Transfer');
                await (0, expect_1.expect)(nft.collect({
                    tokenId: 2,
                    recipient: wallet.address,
                    amount0Max: constants_1.MaxUint128,
                    amount1Max: constants_1.MaxUint128,
                }))
                    .to.emit(tokens[0], 'Transfer')
                    .withArgs(poolAddress, wallet.address, 7503)
                    .to.not.emit(tokens[1], 'Transfer');
            });
        });
    });
    describe('#positions', async () => {
        it('gas', async () => {
            const positionsGasTestFactory = await hardhat_1.ethers.getContractFactory('NonfungiblePositionManagerPositionsGasTest');
            const positionsGasTest = (await positionsGasTestFactory.deploy(nft.address));
            await nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await nft.mint({
                token0: tokens[0].address,
                token1: tokens[1].address,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                fee: constants_1.FeeAmount.MEDIUM,
                recipient: other.address,
                amount0Desired: 15,
                amount1Desired: 15,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 10,
            });
            await (0, snapshotGasCost_1.default)(positionsGasTest.getGasCostOfPositions(1));
        });
    });
});
