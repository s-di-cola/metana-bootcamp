"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodePath = encodePath;
exports.decodePath = decodePath;
var ethers_1 = require("ethers");
var ADDR_SIZE = 20;
var FEE_SIZE = 3;
var OFFSET = ADDR_SIZE + FEE_SIZE;
var DATA_SIZE = OFFSET + ADDR_SIZE;
function encodePath(path, fees) {
    if (path.length != fees.length + 1) {
        throw new Error('path/fee lengths do not match');
    }
    var encoded = '0x';
    for (var i = 0; i < fees.length; i++) {
        // 20 byte encoding of the address
        encoded += path[i].slice(2);
        // 3 byte encoding of the fee
        encoded += fees[i].toString(16).padStart(2 * FEE_SIZE, '0');
    }
    // encode the final token
    encoded += path[path.length - 1].slice(2);
    return encoded.toLowerCase();
}
function decodeOne(tokenFeeToken) {
    // reads the first 20 bytes for the token address
    var tokenABuf = tokenFeeToken.slice(0, ADDR_SIZE);
    var tokenA = ethers_1.utils.getAddress('0x' + tokenABuf.toString('hex'));
    // reads the next 2 bytes for the fee
    var feeBuf = tokenFeeToken.slice(ADDR_SIZE, OFFSET);
    var fee = feeBuf.readUIntBE(0, FEE_SIZE);
    // reads the next 20 bytes for the token address
    var tokenBBuf = tokenFeeToken.slice(OFFSET, DATA_SIZE);
    var tokenB = ethers_1.utils.getAddress('0x' + tokenBBuf.toString('hex'));
    return [[tokenA, tokenB], fee];
}
function decodePath(path) {
    var data = Buffer.from(path.slice(2), 'hex');
    var tokens = [];
    var fees = [];
    var i = 0;
    var finalToken = '';
    while (data.length >= DATA_SIZE) {
        var _a = decodeOne(data), _b = _a[0], tokenA = _b[0], tokenB = _b[1], fee = _a[1];
        finalToken = tokenB;
        tokens = __spreadArray(__spreadArray([], tokens, true), [tokenA], false);
        fees = __spreadArray(__spreadArray([], fees, true), [fee], false);
        data = data.slice((i + 1) * OFFSET);
        i += 1;
    }
    tokens = __spreadArray(__spreadArray([], tokens, true), [finalToken], false);
    return [tokens, fees];
}
