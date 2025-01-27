"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expect_1 = require("./expect");
const ethers_1 = require("ethers");
async function snapshotGasCost(x) {
    const resolved = await x;
    if ('deployTransaction' in resolved) {
        const receipt = await resolved.deployTransaction.wait();
        (0, expect_1.expect)(receipt.gasUsed.toNumber()).toMatchSnapshot();
    }
    else if ('wait' in resolved) {
        const waited = await resolved.wait();
        (0, expect_1.expect)(waited.gasUsed.toNumber()).toMatchSnapshot();
    }
    else if (ethers_1.BigNumber.isBigNumber(resolved)) {
        (0, expect_1.expect)(resolved.toNumber()).toMatchSnapshot();
    }
}
exports.default = snapshotGasCost;
