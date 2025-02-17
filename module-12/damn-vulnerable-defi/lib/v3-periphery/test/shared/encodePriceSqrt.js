"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodePriceSqrt = encodePriceSqrt;
var bignumber_js_1 = require("bignumber.js");
var ethers_1 = require("ethers");
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
