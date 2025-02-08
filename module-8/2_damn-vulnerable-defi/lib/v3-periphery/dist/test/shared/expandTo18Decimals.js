"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandTo18Decimals = void 0;
const ethers_1 = require("ethers");
function expandTo18Decimals(n) {
    return ethers_1.BigNumber.from(n).mul(ethers_1.BigNumber.from(10).pow(18));
}
exports.expandTo18Decimals = expandTo18Decimals;
