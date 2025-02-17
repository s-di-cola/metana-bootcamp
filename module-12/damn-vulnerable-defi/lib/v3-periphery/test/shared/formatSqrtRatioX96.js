"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSqrtRatioX96 = formatSqrtRatioX96;
var ethers_1 = require("ethers");
var decimal_js_1 = require("decimal.js");
var TWO = ethers_1.BigNumber.from(2);
var TEN = ethers_1.BigNumber.from(10);
var FIVE_SIG_FIGS_POW = new decimal_js_1.default(10).pow(5);
function formatSqrtRatioX96(sqrtRatioX96, decimalsToken0, decimalsToken1) {
    if (decimalsToken0 === void 0) { decimalsToken0 = 18; }
    if (decimalsToken1 === void 0) { decimalsToken1 = 18; }
    decimal_js_1.default.set({ toExpPos: 9999999, toExpNeg: -9999999 });
    var ratioNum = (Math.pow((parseInt(sqrtRatioX96.toString()) / Math.pow(2, 96)), 2)).toPrecision(5);
    var ratio = new decimal_js_1.default(ratioNum.toString());
    // adjust for decimals
    if (decimalsToken1 < decimalsToken0) {
        ratio = ratio.mul(TEN.pow(decimalsToken0 - decimalsToken1).toString());
    }
    else if (decimalsToken0 < decimalsToken1) {
        ratio = ratio.div(TEN.pow(decimalsToken1 - decimalsToken0).toString());
    }
    if (ratio.lessThan(FIVE_SIG_FIGS_POW)) {
        return ratio.toPrecision(5);
    }
    return ratio.toString();
}
