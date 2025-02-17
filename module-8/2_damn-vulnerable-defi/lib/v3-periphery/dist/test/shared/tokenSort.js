"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortedTokens = exports.compareToken = void 0;
function compareToken(a, b) {
    return a.address.toLowerCase() < b.address.toLowerCase() ? -1 : 1;
}
exports.compareToken = compareToken;
function sortedTokens(a, b) {
    return compareToken(a, b) < 0 ? [a, b] : [b, a];
}
exports.sortedTokens = sortedTokens;
