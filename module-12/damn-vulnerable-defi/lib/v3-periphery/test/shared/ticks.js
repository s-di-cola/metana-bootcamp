"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaxLiquidityPerTick = exports.getMaxTick = exports.getMinTick = void 0;
var ethers_1 = require("ethers");
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
