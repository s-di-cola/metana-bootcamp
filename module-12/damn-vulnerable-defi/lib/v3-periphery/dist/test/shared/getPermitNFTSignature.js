"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
async function getPermitNFTSignature(wallet, positionManager, spender, tokenId, deadline = ethers_1.constants.MaxUint256, permitConfig) {
    var _a, _b, _c, _d;
    const [nonce, name, version, chainId] = await Promise.all([
        (_a = permitConfig === null || permitConfig === void 0 ? void 0 : permitConfig.nonce) !== null && _a !== void 0 ? _a : positionManager.positions(tokenId).then((p) => p.nonce),
        (_b = permitConfig === null || permitConfig === void 0 ? void 0 : permitConfig.name) !== null && _b !== void 0 ? _b : positionManager.name(),
        (_c = permitConfig === null || permitConfig === void 0 ? void 0 : permitConfig.version) !== null && _c !== void 0 ? _c : '1',
        (_d = permitConfig === null || permitConfig === void 0 ? void 0 : permitConfig.chainId) !== null && _d !== void 0 ? _d : wallet.getChainId(),
    ]);
    return (0, utils_1.splitSignature)(await wallet._signTypedData({
        name,
        version,
        chainId,
        verifyingContract: positionManager.address,
    }, {
        Permit: [
            {
                name: 'spender',
                type: 'address',
            },
            {
                name: 'tokenId',
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
        tokenId,
        nonce,
        deadline,
    }));
}
exports.default = getPermitNFTSignature;
