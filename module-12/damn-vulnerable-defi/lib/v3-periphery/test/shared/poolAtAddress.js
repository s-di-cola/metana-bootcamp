"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = poolAtAddress;
var UniswapV3Pool_json_1 = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json");
var ethers_1 = require("ethers");
function poolAtAddress(address, wallet) {
    return new ethers_1.Contract(address, UniswapV3Pool_json_1.abi, wallet);
}
