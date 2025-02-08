"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeContractUnderTest = void 0;
var safeContractUnderTest = function () {
    return !process.env.SAFE_CONTRACT_UNDER_TEST ? "Safe" : process.env.SAFE_CONTRACT_UNDER_TEST;
};
exports.safeContractUnderTest = safeContractUnderTest;
