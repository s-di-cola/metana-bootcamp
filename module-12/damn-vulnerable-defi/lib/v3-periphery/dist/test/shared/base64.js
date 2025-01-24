"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64Decode = exports.base64Encode = void 0;
function base64Encode(str) {
    return Buffer.from(str, 'utf8').toString('base64');
}
exports.base64Encode = base64Encode;
function base64Decode(str) {
    return Buffer.from(str, 'base64').toString('utf8');
}
exports.base64Decode = base64Decode;
