"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSqrtRatioX96 = void 0;
const ethers_1 = require("ethers");
const decimal_js_1 = __importDefault(require("decimal.js"));
const TWO = ethers_1.BigNumber.from(2);
const TEN = ethers_1.BigNumber.from(10);
const FIVE_SIG_FIGS_POW = new decimal_js_1.default(10).pow(5);
function formatSqrtRatioX96(sqrtRatioX96, decimalsToken0 = 18, decimalsToken1 = 18) {
    decimal_js_1.default.set({ toExpPos: 9999999, toExpNeg: -9999999 });
    let ratioNum = ((parseInt(sqrtRatioX96.toString()) / 2 ** 96) ** 2).toPrecision(5);
    let ratio = new decimal_js_1.default(ratioNum.toString());
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
exports.formatSqrtRatioX96 = formatSqrtRatioX96;
