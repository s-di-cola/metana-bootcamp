"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const expect_1 = require("./shared/expect");
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
describe('NoDelegateCall', () => {
    let wallet, other;
    let loadFixture;
    before('create fixture loader', async () => {
        ;
        [wallet, other] = await hardhat_1.ethers.getSigners();
        loadFixture = hardhat_1.waffle.createFixtureLoader([wallet, other]);
    });
    const noDelegateCallFixture = async () => {
        const noDelegateCallTestFactory = await hardhat_1.ethers.getContractFactory('NoDelegateCallTest');
        const noDelegateCallTest = (await noDelegateCallTestFactory.deploy());
        const minimalProxyFactory = new hardhat_1.ethers.ContractFactory(noDelegateCallTestFactory.interface, `3d602d80600a3d3981f3363d3d373d3d3d363d73${noDelegateCallTest.address.slice(2)}5af43d82803e903d91602b57fd5bf3`, wallet);
        const proxy = (await minimalProxyFactory.deploy());
        return { noDelegateCallTest, proxy };
    };
    let base;
    let proxy;
    beforeEach('deploy test contracts', async () => {
        ;
        ({ noDelegateCallTest: base, proxy } = await loadFixture(noDelegateCallFixture));
    });
    it('runtime overhead', async () => {
        await (0, snapshotGasCost_1.default)((await base.getGasCostOfCannotBeDelegateCalled()).sub(await base.getGasCostOfCanBeDelegateCalled()));
    });
    it('proxy can call the method without the modifier', async () => {
        await proxy.canBeDelegateCalled();
    });
    it('proxy cannot call the method with the modifier', async () => {
        await (0, expect_1.expect)(proxy.cannotBeDelegateCalled()).to.be.reverted;
    });
    it('can call the method that calls into a private method with the modifier', async () => {
        await base.callsIntoNoDelegateCallFunction();
    });
    it('proxy cannot call the method that calls a private method with the modifier', async () => {
        await (0, expect_1.expect)(proxy.callsIntoNoDelegateCallFunction()).to.be.reverted;
    });
});
