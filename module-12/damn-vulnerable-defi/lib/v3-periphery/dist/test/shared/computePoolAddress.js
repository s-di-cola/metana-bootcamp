"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computePoolAddress = exports.POOL_BYTECODE_HASH = void 0;
const UniswapV3Pool_json_1 = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json");
const ethers_1 = require("ethers");
exports.POOL_BYTECODE_HASH = ethers_1.utils.keccak256(UniswapV3Pool_json_1.bytecode);
function computePoolAddress(factoryAddress, [tokenA, tokenB], fee) {
    const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA];
    const constructorArgumentsEncoded = ethers_1.utils.defaultAbiCoder.encode(['address', 'address', 'uint24'], [token0, token1, fee]);
    const create2Inputs = [
        '0xff',
        factoryAddress,
        // salt
        ethers_1.utils.keccak256(constructorArgumentsEncoded),
        // init code hash
        exports.POOL_BYTECODE_HASH,
    ];
    const sanitizedInputs = `0x${create2Inputs.map((i) => i.slice(2)).join('')}`;
    return ethers_1.utils.getAddress(`0x${ethers_1.utils.keccak256(sanitizedInputs).slice(-40)}`);
}
exports.computePoolAddress = computePoolAddress;
