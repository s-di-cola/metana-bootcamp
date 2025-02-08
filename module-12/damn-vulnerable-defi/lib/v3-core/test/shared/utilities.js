"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TICK_SPACINGS = exports.FeeAmount = exports.MAX_SQRT_RATIO = exports.MIN_SQRT_RATIO = exports.getMaxLiquidityPerTick = exports.getMaxTick = exports.getMinTick = exports.MaxUint128 = void 0;
exports.expandTo18Decimals = expandTo18Decimals;
exports.getCreate2Address = getCreate2Address;
exports.encodePriceSqrt = encodePriceSqrt;
exports.getPositionKey = getPositionKey;
exports.createPoolFunctions = createPoolFunctions;
exports.createMultiPoolFunctions = createMultiPoolFunctions;
var bignumber_js_1 = require("bignumber.js");
var ethers_1 = require("ethers");
exports.MaxUint128 = ethers_1.BigNumber.from(2).pow(128).sub(1);
var getMinTick = function (tickSpacing) { return Math.ceil(-887272 / tickSpacing) * tickSpacing; };
exports.getMinTick = getMinTick;
var getMaxTick = function (tickSpacing) { return Math.floor(887272 / tickSpacing) * tickSpacing; };
exports.getMaxTick = getMaxTick;
var getMaxLiquidityPerTick = function (tickSpacing) {
    return ethers_1.BigNumber.from(2)
        .pow(128)
        .sub(1)
        .div(((0, exports.getMaxTick)(tickSpacing) - (0, exports.getMinTick)(tickSpacing)) / tickSpacing + 1);
};
exports.getMaxLiquidityPerTick = getMaxLiquidityPerTick;
exports.MIN_SQRT_RATIO = ethers_1.BigNumber.from('4295128739');
exports.MAX_SQRT_RATIO = ethers_1.BigNumber.from('1461446703485210103287273052203988822378723970342');
var FeeAmount;
(function (FeeAmount) {
    FeeAmount[FeeAmount["LOW"] = 500] = "LOW";
    FeeAmount[FeeAmount["MEDIUM"] = 3000] = "MEDIUM";
    FeeAmount[FeeAmount["HIGH"] = 10000] = "HIGH";
})(FeeAmount || (exports.FeeAmount = FeeAmount = {}));
exports.TICK_SPACINGS = (_a = {},
    _a[FeeAmount.LOW] = 10,
    _a[FeeAmount.MEDIUM] = 60,
    _a[FeeAmount.HIGH] = 200,
    _a);
function expandTo18Decimals(n) {
    return ethers_1.BigNumber.from(n).mul(ethers_1.BigNumber.from(10).pow(18));
}
function getCreate2Address(factoryAddress, _a, fee, bytecode) {
    var tokenA = _a[0], tokenB = _a[1];
    var _b = tokenA.toLowerCase() < tokenB.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA], token0 = _b[0], token1 = _b[1];
    var constructorArgumentsEncoded = ethers_1.utils.defaultAbiCoder.encode(['address', 'address', 'uint24'], [token0, token1, fee]);
    var create2Inputs = [
        '0xff',
        factoryAddress,
        // salt
        ethers_1.utils.keccak256(constructorArgumentsEncoded),
        // init code. bytecode + constructor arguments
        ethers_1.utils.keccak256(bytecode),
    ];
    var sanitizedInputs = "0x".concat(create2Inputs.map(function (i) { return i.slice(2); }).join(''));
    return ethers_1.utils.getAddress("0x".concat(ethers_1.utils.keccak256(sanitizedInputs).slice(-40)));
}
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
function getPositionKey(address, lowerTick, upperTick) {
    return ethers_1.utils.keccak256(ethers_1.utils.solidityPack(['address', 'int24', 'int24'], [address, lowerTick, upperTick]));
}
function createPoolFunctions(_a) {
    var _this = this;
    var swapTarget = _a.swapTarget, token0 = _a.token0, token1 = _a.token1, pool = _a.pool;
    function swapToSqrtPrice(inputToken, targetPrice, to) {
        return __awaiter(this, void 0, void 0, function () {
            var method, toAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = inputToken === token0 ? swapTarget.swapToLowerSqrtPrice : swapTarget.swapToHigherSqrtPrice;
                        return [4 /*yield*/, inputToken.approve(swapTarget.address, ethers_1.constants.MaxUint256)];
                    case 1:
                        _a.sent();
                        toAddress = typeof to === 'string' ? to : to.address;
                        return [2 /*return*/, method(pool.address, targetPrice, toAddress)];
                }
            });
        });
    }
    function swap(inputToken_1, _a, to_1, sqrtPriceLimitX96_1) {
        return __awaiter(this, arguments, void 0, function (inputToken, _b, to, sqrtPriceLimitX96) {
            var exactInput, method, toAddress;
            var amountIn = _b[0], amountOut = _b[1];
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        exactInput = amountOut === 0;
                        method = inputToken === token0
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
                        return [4 /*yield*/, inputToken.approve(swapTarget.address, ethers_1.constants.MaxUint256)];
                    case 1:
                        _c.sent();
                        toAddress = typeof to === 'string' ? to : to.address;
                        return [2 /*return*/, method(pool.address, exactInput ? amountIn : amountOut, toAddress, sqrtPriceLimitX96)];
                }
            });
        });
    }
    var swapToLowerPrice = function (sqrtPriceX96, to) {
        return swapToSqrtPrice(token0, sqrtPriceX96, to);
    };
    var swapToHigherPrice = function (sqrtPriceX96, to) {
        return swapToSqrtPrice(token1, sqrtPriceX96, to);
    };
    var swapExact0For1 = function (amount, to, sqrtPriceLimitX96) {
        return swap(token0, [amount, 0], to, sqrtPriceLimitX96);
    };
    var swap0ForExact1 = function (amount, to, sqrtPriceLimitX96) {
        return swap(token0, [0, amount], to, sqrtPriceLimitX96);
    };
    var swapExact1For0 = function (amount, to, sqrtPriceLimitX96) {
        return swap(token1, [amount, 0], to, sqrtPriceLimitX96);
    };
    var swap1ForExact0 = function (amount, to, sqrtPriceLimitX96) {
        return swap(token1, [0, amount], to, sqrtPriceLimitX96);
    };
    var mint = function (recipient, tickLower, tickUpper, liquidity) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, token0.approve(swapTarget.address, ethers_1.constants.MaxUint256)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, token1.approve(swapTarget.address, ethers_1.constants.MaxUint256)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, swapTarget.mint(pool.address, recipient, tickLower, tickUpper, liquidity)];
            }
        });
    }); };
    var flash = function (amount0, amount1, to, pay0, pay1) { return __awaiter(_this, void 0, void 0, function () {
        var fee;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pool.fee()];
                case 1:
                    fee = _a.sent();
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
                    return [2 /*return*/, swapTarget.flash(pool.address, typeof to === 'string' ? to : to.address, amount0, amount1, pay0, pay1)];
            }
        });
    }); };
    return {
        swapToLowerPrice: swapToLowerPrice,
        swapToHigherPrice: swapToHigherPrice,
        swapExact0For1: swapExact0For1,
        swap0ForExact1: swap0ForExact1,
        swapExact1For0: swapExact1For0,
        swap1ForExact0: swap1ForExact0,
        mint: mint,
        flash: flash,
    };
}
function createMultiPoolFunctions(_a) {
    var inputToken = _a.inputToken, swapTarget = _a.swapTarget, poolInput = _a.poolInput, poolOutput = _a.poolOutput;
    function swapForExact0Multi(amountOut, to) {
        return __awaiter(this, void 0, void 0, function () {
            var method, toAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = swapTarget.swapForExact0Multi;
                        return [4 /*yield*/, inputToken.approve(swapTarget.address, ethers_1.constants.MaxUint256)];
                    case 1:
                        _a.sent();
                        toAddress = typeof to === 'string' ? to : to.address;
                        return [2 /*return*/, method(toAddress, poolInput.address, poolOutput.address, amountOut)];
                }
            });
        });
    }
    function swapForExact1Multi(amountOut, to) {
        return __awaiter(this, void 0, void 0, function () {
            var method, toAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = swapTarget.swapForExact1Multi;
                        return [4 /*yield*/, inputToken.approve(swapTarget.address, ethers_1.constants.MaxUint256)];
                    case 1:
                        _a.sent();
                        toAddress = typeof to === 'string' ? to : to.address;
                        return [2 /*return*/, method(toAddress, poolInput.address, poolOutput.address, amountOut)];
                }
            });
        });
    }
    return {
        swapForExact0Multi: swapForExact0Multi,
        swapForExact1Multi: swapForExact1Multi,
    };
}
