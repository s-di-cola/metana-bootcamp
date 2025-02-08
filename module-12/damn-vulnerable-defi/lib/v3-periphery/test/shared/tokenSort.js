"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareToken = compareToken;
exports.sortedTokens = sortedTokens;
function compareToken(a, b) {
    return a.address.toLowerCase() < b.address.toLowerCase() ? -1 : 1;
}
function sortedTokens(a, b) {
    return compareToken(a, b) < 0 ? [a, b] : [b, a];
}
