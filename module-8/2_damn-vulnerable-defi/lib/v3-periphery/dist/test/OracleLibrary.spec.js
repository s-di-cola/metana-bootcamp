"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
const ethers_1 = require("ethers");
const expandTo18Decimals_1 = require("./shared/expandTo18Decimals");
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
describe('OracleLibrary', () => {
    let loadFixture;
    let tokens;
    let oracle;
    const BN0 = ethers_1.BigNumber.from(0);
    const oracleTestFixture = async () => {
        const tokenFactory = await hardhat_1.ethers.getContractFactory('TestERC20');
        const tokens = [
            (await tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))), // do not use maxu256 to avoid overflowing
            (await tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))),
            (await tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))),
        ];
        tokens.sort((a, b) => (a.address.toLowerCase() < b.address.toLowerCase() ? -1 : 1));
        const oracleFactory = await hardhat_1.ethers.getContractFactory('OracleTest');
        const oracle = await oracleFactory.deploy();
        return {
            tokens: tokens,
            oracle: oracle,
        };
    };
    before('create fixture loader', async () => {
        loadFixture = hardhat_1.waffle.createFixtureLoader(await hardhat_1.ethers.getSigners());
    });
    beforeEach('deploy fixture', async () => {
        const fixtures = await loadFixture(oracleTestFixture);
        tokens = fixtures['tokens'];
        oracle = fixtures['oracle'];
    });
    describe('#consult', () => {
        let mockObservableFactory;
        before('create mockObservableFactory', async () => {
            mockObservableFactory = await hardhat_1.ethers.getContractFactory('MockObservable');
        });
        it('reverts when period is 0', async () => {
            await (0, chai_1.expect)(oracle.consult(oracle.address, 0)).to.be.revertedWith('BP');
        });
        it('correct output when tick is 0', async () => {
            const period = 3;
            const secondsPerLiqCumulatives = [10, 20];
            const mockObservable = await observableWith({
                period,
                tickCumulatives: [12, 12],
                secondsPerLiqCumulatives,
            });
            const { arithmeticMeanTick, harmonicMeanLiquidity } = await oracle.consult(mockObservable.address, period);
            (0, chai_1.expect)(arithmeticMeanTick).to.equal(0);
            (0, chai_1.expect)(harmonicMeanLiquidity).to.equal(calculateHarmonicAvgLiq(period, secondsPerLiqCumulatives));
        });
        it('correct rounding for .5 negative tick', async () => {
            const period = 4;
            const secondsPerLiqCumulatives = [10, 15];
            const mockObservable = await observableWith({
                period,
                tickCumulatives: [-10, -12],
                secondsPerLiqCumulatives,
            });
            const { arithmeticMeanTick, harmonicMeanLiquidity } = await oracle.consult(mockObservable.address, period);
            // Always round to negative infinity
            // In this case, we need to subtract one because integer division rounds to 0
            (0, chai_1.expect)(arithmeticMeanTick).to.equal(-1);
            (0, chai_1.expect)(harmonicMeanLiquidity).to.equal(calculateHarmonicAvgLiq(period, secondsPerLiqCumulatives));
        });
        it('correct output for liquidity overflow', async () => {
            const period = 1;
            const secondsPerLiqCumulatives = [10, 11];
            const mockObservable = await observableWith({
                period,
                tickCumulatives: [12, 12],
                secondsPerLiqCumulatives,
            });
            const { arithmeticMeanTick, harmonicMeanLiquidity } = await oracle.consult(mockObservable.address, period);
            (0, chai_1.expect)(arithmeticMeanTick).to.equal(0);
            // Make sure liquidity doesn't overflow uint128
            (0, chai_1.expect)(harmonicMeanLiquidity).to.equal(ethers_1.BigNumber.from(2).pow(128).sub(1));
        });
        function calculateHarmonicAvgLiq(period, secondsPerLiqCumulatives) {
            const [secondsPerLiq0, secondsPerLiq1] = secondsPerLiqCumulatives.map(ethers_1.BigNumber.from);
            const delta = secondsPerLiq1.sub(secondsPerLiq0);
            const maxUint160 = ethers_1.BigNumber.from(2).pow(160).sub(1);
            return maxUint160.mul(period).div(delta.shl(32));
        }
        function observableWith({ period, tickCumulatives, secondsPerLiqCumulatives, }) {
            return mockObservableFactory.deploy([period, 0], tickCumulatives.map(ethers_1.BigNumber.from), secondsPerLiqCumulatives.map(ethers_1.BigNumber.from));
        }
    });
    describe('#getQuoteAtTick', () => {
        // sanity check
        it('token0: returns correct value when tick = 0', async () => {
            const quoteAmount = await oracle.getQuoteAtTick(BN0, (0, expandTo18Decimals_1.expandTo18Decimals)(1), tokens[0].address, tokens[1].address);
            (0, chai_1.expect)(quoteAmount).to.equal((0, expandTo18Decimals_1.expandTo18Decimals)(1));
        });
        // sanity check
        it('token1: returns correct value when tick = 0', async () => {
            const quoteAmount = await oracle.getQuoteAtTick(BN0, (0, expandTo18Decimals_1.expandTo18Decimals)(1), tokens[1].address, tokens[0].address);
            (0, chai_1.expect)(quoteAmount).to.equal((0, expandTo18Decimals_1.expandTo18Decimals)(1));
        });
        it('token0: returns correct value when at min tick | 0 < sqrtRatioX96 <= type(uint128).max', async () => {
            const quoteAmount = await oracle.getQuoteAtTick(ethers_1.BigNumber.from(-887272), ethers_1.BigNumber.from(2).pow(128).sub(1), tokens[0].address, tokens[1].address);
            (0, chai_1.expect)(quoteAmount).to.equal(ethers_1.BigNumber.from('1'));
        });
        it('token1: returns correct value when at min tick | 0 < sqrtRatioX96 <= type(uint128).max', async () => {
            const quoteAmount = await oracle.getQuoteAtTick(ethers_1.BigNumber.from(-887272), ethers_1.BigNumber.from(2).pow(128).sub(1), tokens[1].address, tokens[0].address);
            (0, chai_1.expect)(quoteAmount).to.equal(ethers_1.BigNumber.from('115783384738768196242144082653949453838306988932806144552194799290216044976282'));
        });
        it('token0: returns correct value when at max tick | sqrtRatioX96 > type(uint128).max', async () => {
            const quoteAmount = await oracle.getQuoteAtTick(ethers_1.BigNumber.from(887272), ethers_1.BigNumber.from(2).pow(128).sub(1), tokens[0].address, tokens[1].address);
            (0, chai_1.expect)(quoteAmount).to.equal(ethers_1.BigNumber.from('115783384785599357996676985412062652720342362943929506828539444553934033845703'));
        });
        it('token1: returns correct value when at max tick | sqrtRatioX96 > type(uint128).max', async () => {
            const quoteAmount = await oracle.getQuoteAtTick(ethers_1.BigNumber.from(887272), ethers_1.BigNumber.from(2).pow(128).sub(1), tokens[1].address, tokens[0].address);
            (0, chai_1.expect)(quoteAmount).to.equal(ethers_1.BigNumber.from('1'));
        });
        it('gas test', async () => {
            await (0, snapshotGasCost_1.default)(oracle.getGasCostOfGetQuoteAtTick(ethers_1.BigNumber.from(10), (0, expandTo18Decimals_1.expandTo18Decimals)(1), tokens[0].address, tokens[1].address));
        });
    });
    describe('#getOldestObservationSecondsAgo', () => {
        let mockObservationsFactory;
        // some empty tick values as this function does not use them
        const emptySPL = [0, 0, 0, 0];
        const emptyTickCumulatives = [0, 0, 0, 0];
        const emptyTick = 0;
        const emptyLiquidity = 0;
        // helper function to run each test case identically
        const runOldestObservationsTest = async (blockTimestamps, initializeds, observationCardinality, observationIndex) => {
            const mockObservations = await mockObservationsFactory.deploy(blockTimestamps, emptyTickCumulatives, emptySPL, initializeds, emptyTick, observationCardinality, observationIndex, false, emptyLiquidity);
            var result = await oracle.getOldestObservationSecondsAgo(mockObservations.address);
            //calculate seconds ago
            var secondsAgo;
            if (initializeds[(observationIndex + 1) % observationCardinality]) {
                secondsAgo = result['currentTimestamp'] - blockTimestamps[(observationIndex + 1) % observationCardinality];
            }
            else {
                secondsAgo = result['currentTimestamp'] - blockTimestamps[0];
            }
            if (secondsAgo < 0) {
                secondsAgo += 2 ** 32;
            }
            (0, chai_1.expect)(result['secondsAgo']).to.equal(secondsAgo);
        };
        before('create mockObservationsFactory', async () => {
            mockObservationsFactory = await hardhat_1.ethers.getContractFactory('MockObservations');
        });
        it('fetches the oldest timestamp from the slot after observationIndex', async () => {
            // set up test case
            const blockTimestamps = [2, 3, 1, 0];
            const initializeds = [true, true, true, false];
            const observationCardinality = 3;
            const observationIndex = 1;
            // run test
            await runOldestObservationsTest(blockTimestamps, initializeds, observationCardinality, observationIndex);
        });
        it('loops to fetches the oldest timestamp from index 0', async () => {
            // set up test case
            const blockTimestamps = [1, 2, 3, 0];
            const initializeds = [true, true, true, false];
            const observationCardinality = 3;
            const observationIndex = 2;
            // run test
            await runOldestObservationsTest(blockTimestamps, initializeds, observationCardinality, observationIndex);
        });
        it('fetches from index 0 if the next index is uninitialized', async () => {
            // set up test case
            const blockTimestamps = [1, 2, 0, 0];
            const initializeds = [true, true, false, false];
            const observationCardinality = 4;
            const observationIndex = 1;
            // run test
            await runOldestObservationsTest(blockTimestamps, initializeds, observationCardinality, observationIndex);
        });
        it('reverts if the pool is not initialized', async () => {
            const blockTimestamps = [0, 0, 0, 0];
            const initializeds = [false, false, false, false];
            const observationCardinality = 0;
            const observationIndex = 0;
            const mockObservations = await mockObservationsFactory.deploy(blockTimestamps, emptyTickCumulatives, emptySPL, initializeds, emptyTick, observationCardinality, observationIndex, false, emptyLiquidity);
            await (0, chai_1.expect)(oracle.getOldestObservationSecondsAgo(mockObservations.address)).to.be.revertedWith('NI');
        });
        it('fetches the correct timestamp when the timestamps overflow', async () => {
            // set up test case
            const maxUint32 = 2 ** 32 - 1;
            const blockTimestamps = [maxUint32, 3, maxUint32 - 2, 0];
            const initializeds = [true, true, true, false];
            const observationCardinality = 3;
            const observationIndex = 1;
            // run test
            await runOldestObservationsTest(blockTimestamps, initializeds, observationCardinality, observationIndex);
        });
    });
    describe('#getBlockStartingTickAndLiquidity', () => {
        let mockObservationsFactory;
        let mockObservations;
        let blockTimestamps;
        let tickCumulatives;
        let liquidityValues;
        let initializeds;
        let slot0Tick;
        let observationCardinality;
        let observationIndex;
        let lastObservationCurrentTimestamp;
        let liquidity;
        before('create mockObservationsFactory', async () => {
            mockObservationsFactory = await hardhat_1.ethers.getContractFactory('MockObservations');
        });
        const deployMockObservationsContract = async () => {
            mockObservations = await mockObservationsFactory.deploy(blockTimestamps, tickCumulatives, liquidityValues, initializeds, slot0Tick, observationCardinality, observationIndex, lastObservationCurrentTimestamp, liquidity);
        };
        it('reverts if the pool is not initialized', async () => {
            blockTimestamps = [0, 0, 0, 0];
            tickCumulatives = [0, 0, 0, 0];
            liquidityValues = [BN0, BN0, BN0, BN0];
            initializeds = [false, false, false, false];
            slot0Tick = 0;
            observationCardinality = 0;
            observationIndex = 0;
            lastObservationCurrentTimestamp = false;
            liquidity = 0;
            await deployMockObservationsContract();
            await (0, chai_1.expect)(oracle.getBlockStartingTickAndLiquidity(mockObservations.address)).to.be.revertedWith('NEO');
        });
        it('returns the tick and liquidity in storage if the latest observation was in a previous block', async () => {
            blockTimestamps = [1, 3, 4, 0];
            // 0
            // 8: 0 + (4*(3-1))
            // 13: 8 + (5*(4-3))
            tickCumulatives = [0, 8, 13, 0];
            // 0
            // (1): 0 + ((3-1)*2**128)/5000
            // (1) + ((4-3)*2**128)/7000
            liquidityValues = [
                BN0,
                ethers_1.BigNumber.from('136112946768375385385349842972707284'),
                ethers_1.BigNumber.from('184724713471366594451546215462959885'),
                BN0,
            ];
            initializeds = [true, true, true, false];
            observationCardinality = 3;
            observationIndex = 2;
            slot0Tick = 6;
            lastObservationCurrentTimestamp = false;
            liquidity = 10000;
            await deployMockObservationsContract();
            var result = await oracle.getBlockStartingTickAndLiquidity(mockObservations.address);
            (0, chai_1.expect)(result[0]).to.equal(slot0Tick);
            (0, chai_1.expect)(result[1]).to.equal(liquidity);
        });
        it('reverts if it needs 2 observations and doesnt have them', async () => {
            blockTimestamps = [1, 0, 0, 0];
            tickCumulatives = [8, 0, 0, 0];
            liquidityValues = [ethers_1.BigNumber.from('136112946768375385385349842972707284'), BN0, BN0, BN0];
            initializeds = [true, false, false, false];
            observationCardinality = 1;
            observationIndex = 0;
            slot0Tick = 4;
            lastObservationCurrentTimestamp = true;
            liquidity = 10000;
            await deployMockObservationsContract();
            await (0, chai_1.expect)(oracle.getBlockStartingTickAndLiquidity(mockObservations.address)).to.be.revertedWith('NEO');
        });
        it('reverts if the prior observation needed is not initialized', async () => {
            blockTimestamps = [1, 0, 0, 0];
            observationCardinality = 2;
            observationIndex = 0;
            liquidityValues = [ethers_1.BigNumber.from('136112946768375385385349842972707284'), BN0, BN0, BN0];
            initializeds = [true, false, false, false];
            tickCumulatives = [8, 0, 0, 0];
            slot0Tick = 4;
            lastObservationCurrentTimestamp = true;
            await deployMockObservationsContract();
            await (0, chai_1.expect)(oracle.getBlockStartingTickAndLiquidity(mockObservations.address)).to.be.revertedWith('ONI');
        });
        it('calculates the prior tick and liquidity from the prior observations', async () => {
            blockTimestamps = [9, 5, 8, 0];
            observationCardinality = 3;
            observationIndex = 0;
            initializeds = [true, true, true, false];
            // 99: 95 + (4*1)
            // 80: 72 + (4*2)
            // 95: 80 + (5*3)
            tickCumulatives = [99, 80, 95, 0];
            // prev: 784724713471366594451546215462959885
            // (3): (2) + (1*2**128)/13212
            // (1): prev + (2*2**128)/12345
            // (2): (1) + (3*2**128)/10238
            liquidityValues = [
                ethers_1.BigNumber.from('965320616647837491242414421221086683'),
                ethers_1.BigNumber.from('839853488995212437053956034406948254'),
                ethers_1.BigNumber.from('939565063595995342933046073701273770'),
                BN0,
            ];
            slot0Tick = 3;
            lastObservationCurrentTimestamp = true;
            await deployMockObservationsContract();
            var result = await oracle.getBlockStartingTickAndLiquidity(mockObservations.address);
            var actualStartingTick = (tickCumulatives[0] - tickCumulatives[2]) / (blockTimestamps[0] - blockTimestamps[2]);
            (0, chai_1.expect)(result[0]).to.equal(actualStartingTick);
            var actualStartingLiquidity = 13212; // see comments above
            (0, chai_1.expect)(result[1]).to.equal(actualStartingLiquidity);
        });
    });
    describe('#getWeightedArithmeticMeanTick', () => {
        it('single observation returns average tick', async () => {
            const observation = { tick: 10, weight: 10 };
            const oracleTick = await oracle.getWeightedArithmeticMeanTick([observation]);
            (0, chai_1.expect)(oracleTick).to.equal(10);
        });
        it('multiple observations with same weight result in average across tiers', async () => {
            const observation1 = { tick: 10, weight: 10 };
            const observation2 = { tick: 20, weight: 10 };
            const oracleTick = await oracle.getWeightedArithmeticMeanTick([observation1, observation2]);
            (0, chai_1.expect)(oracleTick).to.equal(15);
        });
        it('multiple observations with different weights are weighted correctly', async () => {
            const observation2 = { tick: 20, weight: 15 };
            const observation1 = { tick: 10, weight: 10 };
            const oracleTick = await oracle.getWeightedArithmeticMeanTick([observation1, observation2]);
            (0, chai_1.expect)(oracleTick).to.equal(16);
        });
        it('correct rounding for .5 negative tick', async () => {
            const observation1 = { tick: -10, weight: 10 };
            const observation2 = { tick: -11, weight: 10 };
            const oracleTick = await oracle.getWeightedArithmeticMeanTick([observation1, observation2]);
            (0, chai_1.expect)(oracleTick).to.equal(-11);
        });
    });
    describe('#getChainedPrice', () => {
        let ticks;
        it('fails with discrepant length', async () => {
            const tokenAddresses = [tokens[0].address, tokens[2].address];
            ticks = [5, 5];
            (0, chai_1.expect)(oracle.getChainedPrice(tokenAddresses, ticks)).to.be.revertedWith('DL');
        });
        it('add two positive ticks, sorted order', async () => {
            const tokenAddresses = [tokens[0].address, tokens[1].address, tokens[2].address];
            ticks = [5, 5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(10);
        });
        it('add one positive and one negative tick, sorted order', async () => {
            const tokenAddresses = [tokens[0].address, tokens[1].address, tokens[2].address];
            ticks = [5, -5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(0);
        });
        it('add one negative and one positive tick, sorted order', async () => {
            const tokenAddresses = [tokens[0].address, tokens[1].address, tokens[2].address];
            ticks = [-5, 5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(0);
        });
        it('add two negative ticks, sorted order', async () => {
            const tokenAddresses = [tokens[0].address, tokens[1].address, tokens[2].address];
            ticks = [-5, -5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(-10);
        });
        it('add two positive ticks, token0/token1 + token1/token0', async () => {
            const tokenAddresses = [tokens[0].address, tokens[2].address, tokens[1].address];
            ticks = [5, 5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(0);
        });
        it('add one positive tick and one negative tick, token0/token1 + token1/token0', async () => {
            const tokenAddresses = [tokens[0].address, tokens[2].address, tokens[1].address];
            ticks = [5, -5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(10);
        });
        it('add one negative tick and one positive tick, token0/token1 + token1/token0', async () => {
            const tokenAddresses = [tokens[0].address, tokens[2].address, tokens[1].address];
            ticks = [-5, 5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(-10);
        });
        it('add two negative ticks, token0/token1 + token1/token0', async () => {
            const tokenAddresses = [tokens[0].address, tokens[2].address, tokens[1].address];
            ticks = [-5, -5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(0);
        });
        it('add two positive ticks, token1/token0 + token0/token1', async () => {
            const tokenAddresses = [tokens[1].address, tokens[0].address, tokens[2].address];
            ticks = [5, 5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(0);
        });
        it('add one positive tick and one negative tick, token1/token0 + token0/token1', async () => {
            const tokenAddresses = [tokens[1].address, tokens[0].address, tokens[2].address];
            ticks = [5, -5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(-10);
        });
        it('add one negative tick and one positive tick, token1/token0 + token0/token1', async () => {
            const tokenAddresses = [tokens[1].address, tokens[0].address, tokens[2].address];
            ticks = [-5, 5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(10);
        });
        it('add two negative ticks, token1/token0 + token0/token1', async () => {
            const tokenAddresses = [tokens[1].address, tokens[0].address, tokens[2].address];
            ticks = [-5, -5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(0);
        });
        it('add two positive ticks, token0/token1 + token1/token0', async () => {
            const tokenAddresses = [tokens[1].address, tokens[2].address, tokens[0].address];
            ticks = [5, 5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(0);
        });
        it('add one positive tick and one negative tick, token0/token1 + token1/token0', async () => {
            const tokenAddresses = [tokens[1].address, tokens[2].address, tokens[0].address];
            ticks = [5, -5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(10);
        });
        it('add one negative tick and one positive tick, token0/token1 + token1/token0', async () => {
            const tokenAddresses = [tokens[1].address, tokens[2].address, tokens[0].address];
            ticks = [-5, 5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(-10);
        });
        it('add two negative ticks, token0/token1 + token1/token0', async () => {
            const tokenAddresses = [tokens[1].address, tokens[2].address, tokens[0].address];
            ticks = [-5, -5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(0);
        });
        it('add two positive ticks, token1/token0 + token0/token1', async () => {
            const tokenAddresses = [tokens[2].address, tokens[0].address, tokens[1].address];
            ticks = [5, 5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(0);
        });
        it('add one positive tick and one negative tick, token1/token0 + token0/token1', async () => {
            const tokenAddresses = [tokens[2].address, tokens[0].address, tokens[1].address];
            ticks = [5, -5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(-10);
        });
        it('add one negative tick and one positive tick, token1/token0 + token0/token1', async () => {
            const tokenAddresses = [tokens[2].address, tokens[0].address, tokens[1].address];
            ticks = [-5, 5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(10);
        });
        it('add two negative ticks, token1/token0 + token0/token1', async () => {
            const tokenAddresses = [tokens[2].address, tokens[0].address, tokens[1].address];
            ticks = [-5, -5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(0);
        });
        it('add two positive ticks, token1/token0 + token1/token0', async () => {
            const tokenAddresses = [tokens[2].address, tokens[1].address, tokens[0].address];
            ticks = [5, 5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(-10);
        });
        it('add one positive tick and one negative tick, token1/token0 + token1/token0', async () => {
            const tokenAddresses = [tokens[2].address, tokens[1].address, tokens[0].address];
            ticks = [5, -5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(0);
        });
        it('add one negative tick and one positive tick, token1/token0 + token1/token0', async () => {
            const tokenAddresses = [tokens[2].address, tokens[1].address, tokens[0].address];
            ticks = [-5, 5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(0);
        });
        it('add two negative ticks, token1/token0 + token1/token0', async () => {
            const tokenAddresses = [tokens[2].address, tokens[1].address, tokens[0].address];
            ticks = [-5, -5];
            const oracleTick = await oracle.getChainedPrice(tokenAddresses, ticks);
            (0, chai_1.expect)(oracleTick).to.equal(10);
        });
    });
});
