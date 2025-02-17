"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64Encode = base64Encode;
exports.base64Decode = base64Decode;
function base64Encode(str) {
    return Buffer.from(str, 'utf8').toString('base64');
}
function base64Decode(str) {
    return Buffer.from(str, 'base64').toString('utf8');
}
