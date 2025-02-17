"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodePath = exports.encodePath = void 0;
const ethers_1 = require("ethers");
const ADDR_SIZE = 20;
const FEE_SIZE = 3;
const OFFSET = ADDR_SIZE + FEE_SIZE;
const DATA_SIZE = OFFSET + ADDR_SIZE;
function encodePath(path, fees) {
    if (path.length != fees.length + 1) {
        throw new Error('path/fee lengths do not match');
    }
    let encoded = '0x';
    for (let i = 0; i < fees.length; i++) {
        // 20 byte encoding of the address
        encoded += path[i].slice(2);
        // 3 byte encoding of the fee
        encoded += fees[i].toString(16).padStart(2 * FEE_SIZE, '0');
    }
    // encode the final token
    encoded += path[path.length - 1].slice(2);
    return encoded.toLowerCase();
}
exports.encodePath = encodePath;
function decodeOne(tokenFeeToken) {
    // reads the first 20 bytes for the token address
    const tokenABuf = tokenFeeToken.slice(0, ADDR_SIZE);
    const tokenA = ethers_1.utils.getAddress('0x' + tokenABuf.toString('hex'));
    // reads the next 2 bytes for the fee
    const feeBuf = tokenFeeToken.slice(ADDR_SIZE, OFFSET);
    const fee = feeBuf.readUIntBE(0, FEE_SIZE);
    // reads the next 20 bytes for the token address
    const tokenBBuf = tokenFeeToken.slice(OFFSET, DATA_SIZE);
    const tokenB = ethers_1.utils.getAddress('0x' + tokenBBuf.toString('hex'));
    return [[tokenA, tokenB], fee];
}
function decodePath(path) {
    let data = Buffer.from(path.slice(2), 'hex');
    let tokens = [];
    let fees = [];
    let i = 0;
    let finalToken = '';
    while (data.length >= DATA_SIZE) {
        const [[tokenA, tokenB], fee] = decodeOne(data);
        finalToken = tokenB;
        tokens = [...tokens, tokenA];
        fees = [...fees, fee];
        data = data.slice((i + 1) * OFFSET);
        i += 1;
    }
    tokens = [...tokens, finalToken];
    return [tokens, fees];
}
exports.decodePath = decodePath;
