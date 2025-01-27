"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermitSignature = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
async function getPermitSignature(wallet, token, spender, value = ethers_1.constants.MaxUint256, deadline = ethers_1.constants.MaxUint256, permitConfig) {
    var _a, _b, _c, _d;
    const [nonce, name, version, chainId] = await Promise.all([
        (_a = permitConfig === null || permitConfig === void 0 ? void 0 : permitConfig.nonce) !== null && _a !== void 0 ? _a : token.nonces(wallet.address),
        (_b = permitConfig === null || permitConfig === void 0 ? void 0 : permitConfig.name) !== null && _b !== void 0 ? _b : token.name(),
        (_c = permitConfig === null || permitConfig === void 0 ? void 0 : permitConfig.version) !== null && _c !== void 0 ? _c : '1',
        (_d = permitConfig === null || permitConfig === void 0 ? void 0 : permitConfig.chainId) !== null && _d !== void 0 ? _d : wallet.getChainId(),
    ]);
    return (0, utils_1.splitSignature)(await wallet._signTypedData({
        name,
        version,
        chainId,
        verifyingContract: token.address,
    }, {
        Permit: [
            {
                name: 'owner',
                type: 'address',
            },
            {
                name: 'spender',
                type: 'address',
            },
            {
                name: 'value',
                type: 'uint256',
            },
            {
                name: 'nonce',
                type: 'uint256',
            },
            {
                name: 'deadline',
                type: 'uint256',
            },
        ],
    }, {
        owner: wallet.address,
        spender,
        value,
        nonce,
        deadline,
    }));
}
exports.getPermitSignature = getPermitSignature;
