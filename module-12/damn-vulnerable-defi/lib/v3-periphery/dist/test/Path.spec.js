"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const constants_1 = require("./shared/constants");
const expect_1 = require("./shared/expect");
const path_1 = require("./shared/path");
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
describe('Path', () => {
    let path;
    let tokenAddresses = [
        '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
        '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
        '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    ];
    let fees = [constants_1.FeeAmount.MEDIUM, constants_1.FeeAmount.MEDIUM];
    const pathTestFixture = async () => {
        const pathTestFactory = await hardhat_1.ethers.getContractFactory('PathTest');
        return (await pathTestFactory.deploy());
    };
    let loadFixture;
    before('create fixture loader', async () => {
        loadFixture = hardhat_1.waffle.createFixtureLoader(await hardhat_1.ethers.getSigners());
    });
    beforeEach('deploy PathTest', async () => {
        path = await loadFixture(pathTestFixture);
    });
    it('js encoding works as expected', async () => {
        let expectedPath = '0x' +
            tokenAddresses
                .slice(0, 2)
                .map((tokenAddress) => tokenAddress.slice(2).toLowerCase())
                .join('000bb8');
        (0, expect_1.expect)((0, path_1.encodePath)(tokenAddresses.slice(0, 2), fees.slice(0, 1))).to.eq(expectedPath);
        expectedPath = '0x' + tokenAddresses.map((tokenAddress) => tokenAddress.slice(2).toLowerCase()).join('000bb8');
        (0, expect_1.expect)((0, path_1.encodePath)(tokenAddresses, fees)).to.eq(expectedPath);
    });
    it('js decoding works as expected', async () => {
        const encodedPath = (0, path_1.encodePath)(tokenAddresses, fees);
        const [decodedTokens, decodedFees] = (0, path_1.decodePath)(encodedPath);
        (0, expect_1.expect)(decodedTokens).to.deep.eq(tokenAddresses);
        (0, expect_1.expect)(decodedFees).to.deep.eq(fees);
    });
    describe('#hasMultiplePools / #decodeFirstPool / #skipToken / #getFirstPool', () => {
        const encodedPath = (0, path_1.encodePath)(tokenAddresses, fees);
        it('works on first pool', async () => {
            (0, expect_1.expect)(await path.hasMultiplePools(encodedPath)).to.be.true;
            const firstPool = await path.decodeFirstPool(encodedPath);
            (0, expect_1.expect)(firstPool.tokenA).to.be.eq(tokenAddresses[0]);
            (0, expect_1.expect)(firstPool.tokenB).to.be.eq(tokenAddresses[1]);
            (0, expect_1.expect)(firstPool.fee).to.be.eq(constants_1.FeeAmount.MEDIUM);
            (0, expect_1.expect)(await path.decodeFirstPool(await path.getFirstPool(encodedPath))).to.deep.eq(firstPool);
        });
        const offset = 20 + 3;
        it('skips 1 item', async () => {
            const skipped = await path.skipToken(encodedPath);
            (0, expect_1.expect)(skipped).to.be.eq('0x' + encodedPath.slice(2 + offset * 2));
            (0, expect_1.expect)(await path.hasMultiplePools(skipped)).to.be.false;
            const { tokenA, tokenB, fee: decodedFee } = await path.decodeFirstPool(skipped);
            (0, expect_1.expect)(tokenA).to.be.eq(tokenAddresses[1]);
            (0, expect_1.expect)(tokenB).to.be.eq(tokenAddresses[2]);
            (0, expect_1.expect)(decodedFee).to.be.eq(constants_1.FeeAmount.MEDIUM);
        });
    });
    it('gas cost', async () => {
        await (0, snapshotGasCost_1.default)(path.getGasCostOfDecodeFirstPool((0, path_1.encodePath)([tokenAddresses[0], tokenAddresses[1]], [constants_1.FeeAmount.MEDIUM])));
    });
});
