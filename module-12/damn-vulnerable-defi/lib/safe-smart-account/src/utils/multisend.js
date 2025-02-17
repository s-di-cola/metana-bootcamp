"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMultiSendSafeTx = exports.encodeMultiSend = void 0;
var ethers_1 = require("ethers");
var execution_1 = require("./execution");
var encodeMetaTransaction = function (tx) {
    var data = ethers_1.utils.arrayify(tx.data);
    var encoded = ethers_1.utils.solidityPack(["uint8", "address", "uint256", "uint256", "bytes"], [tx.operation, tx.to, tx.value, data.length, data]);
    return encoded.slice(2);
};
var encodeMultiSend = function (txs) {
    return "0x" + txs.map(function (tx) { return encodeMetaTransaction(tx); }).join("");
};
exports.encodeMultiSend = encodeMultiSend;
var buildMultiSendSafeTx = function (multiSend, txs, nonce, overrides) {
    return (0, execution_1.buildContractCall)(multiSend, "multiSend", [(0, exports.encodeMultiSend)(txs)], nonce, true, overrides);
};
exports.buildMultiSendSafeTx = buildMultiSendSafeTx;
