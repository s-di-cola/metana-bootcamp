"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const expect_1 = require("./shared/expect");
const externalFixtures_1 = require("./shared/externalFixtures");
describe('PeripheryImmutableState', () => {
    const nonfungiblePositionManagerFixture = async (wallets, provider) => {
        const { weth9, factory } = await (0, externalFixtures_1.v3RouterFixture)(wallets, provider);
        const stateFactory = await hardhat_1.ethers.getContractFactory('PeripheryImmutableStateTest');
        const state = (await stateFactory.deploy(factory.address, weth9.address));
        return {
            weth9,
            factory,
            state,
        };
    };
    let factory;
    let weth9;
    let state;
    let loadFixture;
    before('create fixture loader', async () => {
        loadFixture = hardhat_1.waffle.createFixtureLoader(await hardhat_1.ethers.getSigners());
    });
    beforeEach('load fixture', async () => {
        ;
        ({ state, weth9, factory } = await loadFixture(nonfungiblePositionManagerFixture));
    });
    it('bytecode size', async () => {
        (0, expect_1.expect)(((await state.provider.getCode(state.address)).length - 2) / 2).to.matchSnapshot();
    });
    describe('#WETH9', () => {
        it('points to WETH9', async () => {
            (0, expect_1.expect)(await state.WETH9()).to.eq(weth9.address);
        });
    });
    describe('#factory', () => {
        it('points to v3 core factory', async () => {
            (0, expect_1.expect)(await state.factory()).to.eq(factory.address);
        });
    });
});
