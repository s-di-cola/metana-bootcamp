"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoolWithZeroTickInitialized = exports.createPoolWithMultiplePositions = exports.createPool = void 0;
const constants_1 = require("./constants");
const encodePriceSqrt_1 = require("./encodePriceSqrt");
const ticks_1 = require("./ticks");
async function createPool(nft, wallet, tokenAddressA, tokenAddressB) {
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
exports.createPool = createPool;
async function createPoolWithMultiplePositions(nft, wallet, tokenAddressA, tokenAddressB) {
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
    await nft.mint(liquidityParams);
    const liquidityParams2 = {
        token0: tokenAddressA,
        token1: tokenAddressB,
        fee: constants_1.FeeAmount.MEDIUM,
        tickLower: -60,
        tickUpper: 60,
        recipient: wallet.address,
        amount0Desired: 100,
        amount1Desired: 100,
        amount0Min: 0,
        amount1Min: 0,
        deadline: 1,
    };
    await nft.mint(liquidityParams2);
    const liquidityParams3 = {
        token0: tokenAddressA,
        token1: tokenAddressB,
        fee: constants_1.FeeAmount.MEDIUM,
        tickLower: -120,
        tickUpper: 120,
        recipient: wallet.address,
        amount0Desired: 100,
        amount1Desired: 100,
        amount0Min: 0,
        amount1Min: 0,
        deadline: 1,
    };
    return nft.mint(liquidityParams3);
}
exports.createPoolWithMultiplePositions = createPoolWithMultiplePositions;
async function createPoolWithZeroTickInitialized(nft, wallet, tokenAddressA, tokenAddressB) {
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
    await nft.mint(liquidityParams);
    const liquidityParams2 = {
        token0: tokenAddressA,
        token1: tokenAddressB,
        fee: constants_1.FeeAmount.MEDIUM,
        tickLower: 0,
        tickUpper: 60,
        recipient: wallet.address,
        amount0Desired: 100,
        amount1Desired: 100,
        amount0Min: 0,
        amount1Min: 0,
        deadline: 1,
    };
    await nft.mint(liquidityParams2);
    const liquidityParams3 = {
        token0: tokenAddressA,
        token1: tokenAddressB,
        fee: constants_1.FeeAmount.MEDIUM,
        tickLower: -120,
        tickUpper: 0,
        recipient: wallet.address,
        amount0Desired: 100,
        amount1Desired: 100,
        amount0Min: 0,
        amount1Min: 0,
        deadline: 1,
    };
    return nft.mint(liquidityParams3);
}
exports.createPoolWithZeroTickInitialized = createPoolWithZeroTickInitialized;
