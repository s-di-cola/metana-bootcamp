"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const expect_1 = require("./shared/expect");
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
const utilities_1 = require("./shared/utilities");
const { constants } = hardhat_1.ethers;
const TEST_ADDRESSES = [
    '0x1000000000000000000000000000000000000000',
    '0x2000000000000000000000000000000000000000',
];
const createFixtureLoader = hardhat_1.waffle.createFixtureLoader;
describe('UniswapV3Factory', () => {
    let wallet, other;
    let factory;
    let poolBytecode;
    const fixture = async () => {
        const factoryFactory = await hardhat_1.ethers.getContractFactory('UniswapV3Factory');
        return (await factoryFactory.deploy());
    };
    let loadFixture;
    before('create fixture loader', async () => {
        ;
        [wallet, other] = await hardhat_1.ethers.getSigners();
        loadFixture = createFixtureLoader([wallet, other]);
    });
    before('load pool bytecode', async () => {
        poolBytecode = (await hardhat_1.ethers.getContractFactory('UniswapV3Pool')).bytecode;
    });
    beforeEach('deploy factory', async () => {
        factory = await loadFixture(fixture);
    });
    it('owner is deployer', async () => {
        (0, expect_1.expect)(await factory.owner()).to.eq(wallet.address);
    });
    it('factory bytecode size', async () => {
        (0, expect_1.expect)(((await hardhat_1.waffle.provider.getCode(factory.address)).length - 2) / 2).to.matchSnapshot();
    });
    it('pool bytecode size', async () => {
        await factory.createPool(TEST_ADDRESSES[0], TEST_ADDRESSES[1], utilities_1.FeeAmount.MEDIUM);
        const poolAddress = (0, utilities_1.getCreate2Address)(factory.address, TEST_ADDRESSES, utilities_1.FeeAmount.MEDIUM, poolBytecode);
        (0, expect_1.expect)(((await hardhat_1.waffle.provider.getCode(poolAddress)).length - 2) / 2).to.matchSnapshot();
    });
    it('initial enabled fee amounts', async () => {
        (0, expect_1.expect)(await factory.feeAmountTickSpacing(utilities_1.FeeAmount.LOW)).to.eq(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.LOW]);
        (0, expect_1.expect)(await factory.feeAmountTickSpacing(utilities_1.FeeAmount.MEDIUM)).to.eq(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.MEDIUM]);
        (0, expect_1.expect)(await factory.feeAmountTickSpacing(utilities_1.FeeAmount.HIGH)).to.eq(utilities_1.TICK_SPACINGS[utilities_1.FeeAmount.HIGH]);
    });
    async function createAndCheckPool(tokens, feeAmount, tickSpacing = utilities_1.TICK_SPACINGS[feeAmount]) {
        const create2Address = (0, utilities_1.getCreate2Address)(factory.address, tokens, feeAmount, poolBytecode);
        const create = factory.createPool(tokens[0], tokens[1], feeAmount);
        await (0, expect_1.expect)(create)
            .to.emit(factory, 'PoolCreated')
            .withArgs(TEST_ADDRESSES[0], TEST_ADDRESSES[1], feeAmount, tickSpacing, create2Address);
        await (0, expect_1.expect)(factory.createPool(tokens[0], tokens[1], feeAmount)).to.be.reverted;
        await (0, expect_1.expect)(factory.createPool(tokens[1], tokens[0], feeAmount)).to.be.reverted;
        (0, expect_1.expect)(await factory.getPool(tokens[0], tokens[1], feeAmount), 'getPool in order').to.eq(create2Address);
        (0, expect_1.expect)(await factory.getPool(tokens[1], tokens[0], feeAmount), 'getPool in reverse').to.eq(create2Address);
        const poolContractFactory = await hardhat_1.ethers.getContractFactory('UniswapV3Pool');
        const pool = poolContractFactory.attach(create2Address);
        (0, expect_1.expect)(await pool.factory(), 'pool factory address').to.eq(factory.address);
        (0, expect_1.expect)(await pool.token0(), 'pool token0').to.eq(TEST_ADDRESSES[0]);
        (0, expect_1.expect)(await pool.token1(), 'pool token1').to.eq(TEST_ADDRESSES[1]);
        (0, expect_1.expect)(await pool.fee(), 'pool fee').to.eq(feeAmount);
        (0, expect_1.expect)(await pool.tickSpacing(), 'pool tick spacing').to.eq(tickSpacing);
    }
    describe('#createPool', () => {
        it('succeeds for low fee pool', async () => {
            await createAndCheckPool(TEST_ADDRESSES, utilities_1.FeeAmount.LOW);
        });
        it('succeeds for medium fee pool', async () => {
            await createAndCheckPool(TEST_ADDRESSES, utilities_1.FeeAmount.MEDIUM);
        });
        it('succeeds for high fee pool', async () => {
            await createAndCheckPool(TEST_ADDRESSES, utilities_1.FeeAmount.HIGH);
        });
        it('succeeds if tokens are passed in reverse', async () => {
            await createAndCheckPool([TEST_ADDRESSES[1], TEST_ADDRESSES[0]], utilities_1.FeeAmount.MEDIUM);
        });
        it('fails if token a == token b', async () => {
            await (0, expect_1.expect)(factory.createPool(TEST_ADDRESSES[0], TEST_ADDRESSES[0], utilities_1.FeeAmount.LOW)).to.be.reverted;
        });
        it('fails if token a is 0 or token b is 0', async () => {
            await (0, expect_1.expect)(factory.createPool(TEST_ADDRESSES[0], constants.AddressZero, utilities_1.FeeAmount.LOW)).to.be.reverted;
            await (0, expect_1.expect)(factory.createPool(constants.AddressZero, TEST_ADDRESSES[0], utilities_1.FeeAmount.LOW)).to.be.reverted;
            await (0, expect_1.expect)(factory.createPool(constants.AddressZero, constants.AddressZero, utilities_1.FeeAmount.LOW)).to.be.revertedWith('');
        });
        it('fails if fee amount is not enabled', async () => {
            await (0, expect_1.expect)(factory.createPool(TEST_ADDRESSES[0], TEST_ADDRESSES[1], 250)).to.be.reverted;
        });
        it('gas', async () => {
            await (0, snapshotGasCost_1.default)(factory.createPool(TEST_ADDRESSES[0], TEST_ADDRESSES[1], utilities_1.FeeAmount.MEDIUM));
        });
    });
    describe('#setOwner', () => {
        it('fails if caller is not owner', async () => {
            await (0, expect_1.expect)(factory.connect(other).setOwner(wallet.address)).to.be.reverted;
        });
        it('updates owner', async () => {
            await factory.setOwner(other.address);
            (0, expect_1.expect)(await factory.owner()).to.eq(other.address);
        });
        it('emits event', async () => {
            await (0, expect_1.expect)(factory.setOwner(other.address))
                .to.emit(factory, 'OwnerChanged')
                .withArgs(wallet.address, other.address);
        });
        it('cannot be called by original owner', async () => {
            await factory.setOwner(other.address);
            await (0, expect_1.expect)(factory.setOwner(wallet.address)).to.be.reverted;
        });
    });
    describe('#enableFeeAmount', () => {
        it('fails if caller is not owner', async () => {
            await (0, expect_1.expect)(factory.connect(other).enableFeeAmount(100, 2)).to.be.reverted;
        });
        it('fails if fee is too great', async () => {
            await (0, expect_1.expect)(factory.enableFeeAmount(1000000, 10)).to.be.reverted;
        });
        it('fails if tick spacing is too small', async () => {
            await (0, expect_1.expect)(factory.enableFeeAmount(500, 0)).to.be.reverted;
        });
        it('fails if tick spacing is too large', async () => {
            await (0, expect_1.expect)(factory.enableFeeAmount(500, 16834)).to.be.reverted;
        });
        it('fails if already initialized', async () => {
            await factory.enableFeeAmount(100, 5);
            await (0, expect_1.expect)(factory.enableFeeAmount(100, 10)).to.be.reverted;
        });
        it('sets the fee amount in the mapping', async () => {
            await factory.enableFeeAmount(100, 5);
            (0, expect_1.expect)(await factory.feeAmountTickSpacing(100)).to.eq(5);
        });
        it('emits an event', async () => {
            await (0, expect_1.expect)(factory.enableFeeAmount(100, 5)).to.emit(factory, 'FeeAmountEnabled').withArgs(100, 5);
        });
        it('enables pool creation', async () => {
            await factory.enableFeeAmount(250, 15);
            await createAndCheckPool([TEST_ADDRESSES[0], TEST_ADDRESSES[1]], 250, 15);
        });
    });
});
