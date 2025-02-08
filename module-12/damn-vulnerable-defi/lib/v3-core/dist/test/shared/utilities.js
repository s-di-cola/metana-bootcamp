"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMultiPoolFunctions = exports.createPoolFunctions = exports.getPositionKey = exports.encodePriceSqrt = exports.getCreate2Address = exports.expandTo18Decimals = exports.TICK_SPACINGS = exports.FeeAmount = exports.MAX_SQRT_RATIO = exports.MIN_SQRT_RATIO = exports.getMaxLiquidityPerTick = exports.getMaxTick = exports.getMinTick = exports.MaxUint128 = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ethers_1 = require("ethers");
exports.MaxUint128 = ethers_1.BigNumber.from(2).pow(128).sub(1);
const getMinTick = (tickSpacing) => Math.ceil(-887272 / tickSpacing) * tickSpacing;
exports.getMinTick = getMinTick;
const getMaxTick = (tickSpacing) => Math.floor(887272 / tickSpacing) * tickSpacing;
exports.getMaxTick = getMaxTick;
const getMaxLiquidityPerTick = (tickSpacing) => ethers_1.BigNumber.from(2)
    .pow(128)
    .sub(1)
    .div(((0, exports.getMaxTick)(tickSpacing) - (0, exports.getMinTick)(tickSpacing)) / tickSpacing + 1);
exports.getMaxLiquidityPerTick = getMaxLiquidityPerTick;
exports.MIN_SQRT_RATIO = ethers_1.BigNumber.from('4295128739');
exports.MAX_SQRT_RATIO = ethers_1.BigNumber.from('1461446703485210103287273052203988822378723970342');
var FeeAmount;
(function (FeeAmount) {
    FeeAmount[FeeAmount["LOW"] = 500] = "LOW";
    FeeAmount[FeeAmount["MEDIUM"] = 3000] = "MEDIUM";
    FeeAmount[FeeAmount["HIGH"] = 10000] = "HIGH";
})(FeeAmount || (exports.FeeAmount = FeeAmount = {}));
exports.TICK_SPACINGS = {
    [FeeAmount.LOW]: 10,
    [FeeAmount.MEDIUM]: 60,
    [FeeAmount.HIGH]: 200,
};
function expandTo18Decimals(n) {
    return ethers_1.BigNumber.from(n).mul(ethers_1.BigNumber.from(10).pow(18));
}
exports.expandTo18Decimals = expandTo18Decimals;
function getCreate2Address(factoryAddress, [tokenA, tokenB], fee, bytecode) {
    const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA];
    const constructorArgumentsEncoded = ethers_1.utils.defaultAbiCoder.encode(['address', 'address', 'uint24'], [token0, token1, fee]);
    const create2Inputs = [
        '0xff',
        factoryAddress,
        // salt
        ethers_1.utils.keccak256(constructorArgumentsEncoded),
        // init code. bytecode + constructor arguments
        ethers_1.utils.keccak256(bytecode),
    ];
    const sanitizedInputs = `0x${create2Inputs.map((i) => i.slice(2)).join('')}`;
    return ethers_1.utils.getAddress(`0x${ethers_1.utils.keccak256(sanitizedInputs).slice(-40)}`);
}
exports.getCreate2Address = getCreate2Address;
bignumber_js_1.default.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });
// returns the sqrt price as a 64x96
function encodePriceSqrt(reserve1, reserve0) {
    return ethers_1.BigNumber.from(new bignumber_js_1.default(reserve1.toString())
        .div(reserve0.toString())
        .sqrt()
        .multipliedBy(new bignumber_js_1.default(2).pow(96))
        .integerValue(3)
        .toString());
}
exports.encodePriceSqrt = encodePriceSqrt;
function getPositionKey(address, lowerTick, upperTick) {
    return ethers_1.utils.keccak256(ethers_1.utils.solidityPack(['address', 'int24', 'int24'], [address, lowerTick, upperTick]));
}
exports.getPositionKey = getPositionKey;
function createPoolFunctions({ swapTarget, token0, token1, pool, }) {
    async function swapToSqrtPrice(inputToken, targetPrice, to) {
        const method = inputToken === token0 ? swapTarget.swapToLowerSqrtPrice : swapTarget.swapToHigherSqrtPrice;
        await inputToken.approve(swapTarget.address, ethers_1.constants.MaxUint256);
        const toAddress = typeof to === 'string' ? to : to.address;
        return method(pool.address, targetPrice, toAddress);
    }
    async function swap(inputToken, [amountIn, amountOut], to, sqrtPriceLimitX96) {
        const exactInput = amountOut === 0;
        const method = inputToken === token0
            ? exactInput
                ? swapTarget.swapExact0For1
                : swapTarget.swap0ForExact1
            : exactInput
                ? swapTarget.swapExact1For0
                : swapTarget.swap1ForExact0;
        if (typeof sqrtPriceLimitX96 === 'undefined') {
            if (inputToken === token0) {
                sqrtPriceLimitX96 = exports.MIN_SQRT_RATIO.add(1);
            }
            else {
                sqrtPriceLimitX96 = exports.MAX_SQRT_RATIO.sub(1);
            }
        }
        await inputToken.approve(swapTarget.address, ethers_1.constants.MaxUint256);
        const toAddress = typeof to === 'string' ? to : to.address;
        return method(pool.address, exactInput ? amountIn : amountOut, toAddress, sqrtPriceLimitX96);
    }
    const swapToLowerPrice = (sqrtPriceX96, to) => {
        return swapToSqrtPrice(token0, sqrtPriceX96, to);
    };
    const swapToHigherPrice = (sqrtPriceX96, to) => {
        return swapToSqrtPrice(token1, sqrtPriceX96, to);
    };
    const swapExact0For1 = (amount, to, sqrtPriceLimitX96) => {
        return swap(token0, [amount, 0], to, sqrtPriceLimitX96);
    };
    const swap0ForExact1 = (amount, to, sqrtPriceLimitX96) => {
        return swap(token0, [0, amount], to, sqrtPriceLimitX96);
    };
    const swapExact1For0 = (amount, to, sqrtPriceLimitX96) => {
        return swap(token1, [amount, 0], to, sqrtPriceLimitX96);
    };
    const swap1ForExact0 = (amount, to, sqrtPriceLimitX96) => {
        return swap(token1, [0, amount], to, sqrtPriceLimitX96);
    };
    const mint = async (recipient, tickLower, tickUpper, liquidity) => {
        await token0.approve(swapTarget.address, ethers_1.constants.MaxUint256);
        await token1.approve(swapTarget.address, ethers_1.constants.MaxUint256);
        return swapTarget.mint(pool.address, recipient, tickLower, tickUpper, liquidity);
    };
    const flash = async (amount0, amount1, to, pay0, pay1) => {
        const fee = await pool.fee();
        if (typeof pay0 === 'undefined') {
            pay0 = ethers_1.BigNumber.from(amount0)
                .mul(fee)
                .add(1e6 - 1)
                .div(1e6)
                .add(amount0);
        }
        if (typeof pay1 === 'undefined') {
            pay1 = ethers_1.BigNumber.from(amount1)
                .mul(fee)
                .add(1e6 - 1)
                .div(1e6)
                .add(amount1);
        }
        return swapTarget.flash(pool.address, typeof to === 'string' ? to : to.address, amount0, amount1, pay0, pay1);
    };
    return {
        swapToLowerPrice,
        swapToHigherPrice,
        swapExact0For1,
        swap0ForExact1,
        swapExact1For0,
        swap1ForExact0,
        mint,
        flash,
    };
}
exports.createPoolFunctions = createPoolFunctions;
function createMultiPoolFunctions({ inputToken, swapTarget, poolInput, poolOutput, }) {
    async function swapForExact0Multi(amountOut, to) {
        const method = swapTarget.swapForExact0Multi;
        await inputToken.approve(swapTarget.address, ethers_1.constants.MaxUint256);
        const toAddress = typeof to === 'string' ? to : to.address;
        return method(toAddress, poolInput.address, poolOutput.address, amountOut);
    }
    async function swapForExact1Multi(amountOut, to) {
        const method = swapTarget.swapForExact1Multi;
        await inputToken.approve(swapTarget.address, ethers_1.constants.MaxUint256);
        const toAddress = typeof to === 'string' ? to : to.address;
        return method(toAddress, poolInput.address, poolOutput.address, amountOut);
    }
    return {
        swapForExact0Multi,
        swapForExact1Multi,
    };
}
exports.createMultiPoolFunctions = createMultiPoolFunctions;
