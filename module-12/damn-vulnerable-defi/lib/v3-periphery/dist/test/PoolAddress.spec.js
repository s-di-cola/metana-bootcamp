"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const hardhat_1 = require("hardhat");
const computePoolAddress_1 = require("./shared/computePoolAddress");
const expect_1 = require("./shared/expect");
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
describe('PoolAddress', () => {
    let poolAddress;
    const poolAddressTestFixture = async () => {
        const poolAddressTestFactory = await hardhat_1.ethers.getContractFactory('PoolAddressTest');
        return (await poolAddressTestFactory.deploy());
    };
    let loadFixture;
    before('create fixture loader', async () => {
        loadFixture = hardhat_1.waffle.createFixtureLoader(await hardhat_1.ethers.getSigners());
    });
    beforeEach('deploy PoolAddressTest', async () => {
        poolAddress = await loadFixture(poolAddressTestFixture);
    });
    describe('#POOL_INIT_CODE_HASH', () => {
        it('equals the hash of the pool bytecode', async () => {
            (0, expect_1.expect)(await poolAddress.POOL_INIT_CODE_HASH()).to.eq(computePoolAddress_1.POOL_BYTECODE_HASH);
        });
    });
    describe('#computeAddress', () => {
        it('all arguments equal zero', async () => {
            await (0, expect_1.expect)(poolAddress.computeAddress(ethers_1.constants.AddressZero, ethers_1.constants.AddressZero, ethers_1.constants.AddressZero, 0))
                .to.be.reverted;
        });
        it('matches example from core repo', async () => {
            (0, expect_1.expect)(await poolAddress.computeAddress('0x5FbDB2315678afecb367f032d93F642f64180aa3', '0x1000000000000000000000000000000000000000', '0x2000000000000000000000000000000000000000', 250)).to.matchSnapshot();
        });
        it('token argument order cannot be in reverse', async () => {
            await (0, expect_1.expect)(poolAddress.computeAddress('0x5FbDB2315678afecb367f032d93F642f64180aa3', '0x2000000000000000000000000000000000000000', '0x1000000000000000000000000000000000000000', 3000)).to.be.reverted;
        });
        it('gas cost', async () => {
            await (0, snapshotGasCost_1.default)(poolAddress.getGasCostOfComputeAddress('0x5FbDB2315678afecb367f032d93F642f64180aa3', '0x1000000000000000000000000000000000000000', '0x2000000000000000000000000000000000000000', 3000));
        });
    });
});
