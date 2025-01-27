"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolFixture = exports.TEST_POOL_START_TIME = void 0;
const ethers_1 = require("ethers");
const hardhat_1 = require("hardhat");
async function factoryFixture() {
    const factoryFactory = await hardhat_1.ethers.getContractFactory('UniswapV3Factory');
    const factory = (await factoryFactory.deploy());
    return { factory };
}
async function tokensFixture() {
    const tokenFactory = await hardhat_1.ethers.getContractFactory('TestERC20');
    const tokenA = (await tokenFactory.deploy(ethers_1.BigNumber.from(2).pow(255)));
    const tokenB = (await tokenFactory.deploy(ethers_1.BigNumber.from(2).pow(255)));
    const tokenC = (await tokenFactory.deploy(ethers_1.BigNumber.from(2).pow(255)));
    const [token0, token1, token2] = [tokenA, tokenB, tokenC].sort((tokenA, tokenB) => tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? -1 : 1);
    return { token0, token1, token2 };
}
// Monday, October 5, 2020 9:00:00 AM GMT-05:00
exports.TEST_POOL_START_TIME = 1601906400;
const poolFixture = async function () {
    const { factory } = await factoryFixture();
    const { token0, token1, token2 } = await tokensFixture();
    const MockTimeUniswapV3PoolDeployerFactory = await hardhat_1.ethers.getContractFactory('MockTimeUniswapV3PoolDeployer');
    const MockTimeUniswapV3PoolFactory = await hardhat_1.ethers.getContractFactory('MockTimeUniswapV3Pool');
    const calleeContractFactory = await hardhat_1.ethers.getContractFactory('TestUniswapV3Callee');
    const routerContractFactory = await hardhat_1.ethers.getContractFactory('TestUniswapV3Router');
    const swapTargetCallee = (await calleeContractFactory.deploy());
    const swapTargetRouter = (await routerContractFactory.deploy());
    return {
        token0,
        token1,
        token2,
        factory,
        swapTargetCallee,
        swapTargetRouter,
        createPool: async (fee, tickSpacing, firstToken = token0, secondToken = token1) => {
            var _a, _b;
            const mockTimePoolDeployer = (await MockTimeUniswapV3PoolDeployerFactory.deploy());
            const tx = await mockTimePoolDeployer.deploy(factory.address, firstToken.address, secondToken.address, fee, tickSpacing);
            const receipt = await tx.wait();
            const poolAddress = (_b = (_a = receipt.events) === null || _a === void 0 ? void 0 : _a[0].args) === null || _b === void 0 ? void 0 : _b.pool;
            return MockTimeUniswapV3PoolFactory.attach(poolAddress);
        },
    };
};
exports.poolFixture = poolFixture;
