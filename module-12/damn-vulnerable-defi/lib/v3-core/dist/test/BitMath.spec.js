"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expect_1 = require("./shared/expect");
const hardhat_1 = require("hardhat");
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
const { BigNumber } = hardhat_1.ethers;
describe('BitMath', () => {
    let bitMath;
    const fixture = async () => {
        const factory = await hardhat_1.ethers.getContractFactory('BitMathTest');
        return (await factory.deploy());
    };
    beforeEach('deploy BitMathTest', async () => {
        bitMath = await hardhat_1.waffle.loadFixture(fixture);
    });
    describe('#mostSignificantBit', () => {
        it('0', async () => {
            await (0, expect_1.expect)(bitMath.mostSignificantBit(0)).to.be.reverted;
        });
        it('1', async () => {
            (0, expect_1.expect)(await bitMath.mostSignificantBit(1)).to.eq(0);
        });
        it('2', async () => {
            (0, expect_1.expect)(await bitMath.mostSignificantBit(2)).to.eq(1);
        });
        it('all powers of 2', async () => {
            const results = await Promise.all([...Array(255)].map((_, i) => bitMath.mostSignificantBit(BigNumber.from(2).pow(i))));
            (0, expect_1.expect)(results).to.deep.eq([...Array(255)].map((_, i) => i));
        });
        it('uint256(-1)', async () => {
            (0, expect_1.expect)(await bitMath.mostSignificantBit(BigNumber.from(2).pow(256).sub(1))).to.eq(255);
        });
        it('gas cost of smaller number', async () => {
            await (0, snapshotGasCost_1.default)(bitMath.getGasCostOfMostSignificantBit(BigNumber.from(3568)));
        });
        it('gas cost of max uint128', async () => {
            await (0, snapshotGasCost_1.default)(bitMath.getGasCostOfMostSignificantBit(BigNumber.from(2).pow(128).sub(1)));
        });
        it('gas cost of max uint256', async () => {
            await (0, snapshotGasCost_1.default)(bitMath.getGasCostOfMostSignificantBit(BigNumber.from(2).pow(256).sub(1)));
        });
    });
    describe('#leastSignificantBit', () => {
        it('0', async () => {
            await (0, expect_1.expect)(bitMath.leastSignificantBit(0)).to.be.reverted;
        });
        it('1', async () => {
            (0, expect_1.expect)(await bitMath.leastSignificantBit(1)).to.eq(0);
        });
        it('2', async () => {
            (0, expect_1.expect)(await bitMath.leastSignificantBit(2)).to.eq(1);
        });
        it('all powers of 2', async () => {
            const results = await Promise.all([...Array(255)].map((_, i) => bitMath.leastSignificantBit(BigNumber.from(2).pow(i))));
            (0, expect_1.expect)(results).to.deep.eq([...Array(255)].map((_, i) => i));
        });
        it('uint256(-1)', async () => {
            (0, expect_1.expect)(await bitMath.leastSignificantBit(BigNumber.from(2).pow(256).sub(1))).to.eq(0);
        });
        it('gas cost of smaller number', async () => {
            await (0, snapshotGasCost_1.default)(bitMath.getGasCostOfLeastSignificantBit(BigNumber.from(3568)));
        });
        it('gas cost of max uint128', async () => {
            await (0, snapshotGasCost_1.default)(bitMath.getGasCostOfLeastSignificantBit(BigNumber.from(2).pow(128).sub(1)));
        });
        it('gas cost of max uint256', async () => {
            await (0, snapshotGasCost_1.default)(bitMath.getGasCostOfLeastSignificantBit(BigNumber.from(2).pow(256).sub(1)));
        });
    });
});
