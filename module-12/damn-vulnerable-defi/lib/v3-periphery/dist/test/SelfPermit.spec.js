"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const hardhat_1 = require("hardhat");
const chai_1 = require("chai");
const permit_1 = require("./shared/permit");
describe('SelfPermit', () => {
    let wallet;
    let other;
    const fixture = async (wallets, provider) => {
        const tokenFactory = await hardhat_1.ethers.getContractFactory('TestERC20PermitAllowed');
        const token = (await tokenFactory.deploy(0));
        const selfPermitTestFactory = await hardhat_1.ethers.getContractFactory('SelfPermitTest');
        const selfPermitTest = (await selfPermitTestFactory.deploy());
        return {
            token,
            selfPermitTest,
        };
    };
    let token;
    let selfPermitTest;
    let loadFixture;
    before('create fixture loader', async () => {
        const wallets = await hardhat_1.ethers.getSigners();
        [wallet, other] = wallets;
        loadFixture = hardhat_1.waffle.createFixtureLoader(wallets);
    });
    beforeEach('load fixture', async () => {
        ;
        ({ token, selfPermitTest } = await loadFixture(fixture));
    });
    it('#permit', async () => {
        const value = 123;
        const { v, r, s } = await (0, permit_1.getPermitSignature)(wallet, token, other.address, value);
        (0, chai_1.expect)(await token.allowance(wallet.address, other.address)).to.be.eq(0);
        await token['permit(address,address,uint256,uint256,uint8,bytes32,bytes32)'](wallet.address, other.address, value, ethers_1.constants.MaxUint256, v, r, s);
        (0, chai_1.expect)(await token.allowance(wallet.address, other.address)).to.be.eq(value);
    });
    describe('#selfPermit', () => {
        const value = 456;
        it('works', async () => {
            const { v, r, s } = await (0, permit_1.getPermitSignature)(wallet, token, selfPermitTest.address, value);
            (0, chai_1.expect)(await token.allowance(wallet.address, selfPermitTest.address)).to.be.eq(0);
            await selfPermitTest.selfPermit(token.address, value, ethers_1.constants.MaxUint256, v, r, s);
            (0, chai_1.expect)(await token.allowance(wallet.address, selfPermitTest.address)).to.be.eq(value);
        });
        it('fails if permit is submitted externally', async () => {
            const { v, r, s } = await (0, permit_1.getPermitSignature)(wallet, token, selfPermitTest.address, value);
            (0, chai_1.expect)(await token.allowance(wallet.address, selfPermitTest.address)).to.be.eq(0);
            await token['permit(address,address,uint256,uint256,uint8,bytes32,bytes32)'](wallet.address, selfPermitTest.address, value, ethers_1.constants.MaxUint256, v, r, s);
            (0, chai_1.expect)(await token.allowance(wallet.address, selfPermitTest.address)).to.be.eq(value);
            await (0, chai_1.expect)(selfPermitTest.selfPermit(token.address, value, ethers_1.constants.MaxUint256, v, r, s)).to.be.revertedWith('ERC20Permit: invalid signature');
        });
    });
    describe('#selfPermitIfNecessary', () => {
        const value = 789;
        it('works', async () => {
            const { v, r, s } = await (0, permit_1.getPermitSignature)(wallet, token, selfPermitTest.address, value);
            (0, chai_1.expect)(await token.allowance(wallet.address, selfPermitTest.address)).to.be.eq(0);
            await selfPermitTest.selfPermitIfNecessary(token.address, value, ethers_1.constants.MaxUint256, v, r, s);
            (0, chai_1.expect)(await token.allowance(wallet.address, selfPermitTest.address)).to.be.eq(value);
        });
        it('does not fail if permit is submitted externally', async () => {
            const { v, r, s } = await (0, permit_1.getPermitSignature)(wallet, token, selfPermitTest.address, value);
            (0, chai_1.expect)(await token.allowance(wallet.address, selfPermitTest.address)).to.be.eq(0);
            await token['permit(address,address,uint256,uint256,uint8,bytes32,bytes32)'](wallet.address, selfPermitTest.address, value, ethers_1.constants.MaxUint256, v, r, s);
            (0, chai_1.expect)(await token.allowance(wallet.address, selfPermitTest.address)).to.be.eq(value);
            await selfPermitTest.selfPermitIfNecessary(token.address, value, ethers_1.constants.MaxUint256, v, r, s);
        });
    });
    describe('#selfPermitAllowed', () => {
        it('works', async () => {
            const { v, r, s } = await (0, permit_1.getPermitSignature)(wallet, token, selfPermitTest.address, ethers_1.constants.MaxUint256);
            (0, chai_1.expect)(await token.allowance(wallet.address, selfPermitTest.address)).to.be.eq(0);
            await (0, chai_1.expect)(selfPermitTest.selfPermitAllowed(token.address, 0, ethers_1.constants.MaxUint256, v, r, s))
                .to.emit(token, 'Approval')
                .withArgs(wallet.address, selfPermitTest.address, ethers_1.constants.MaxUint256);
            (0, chai_1.expect)(await token.allowance(wallet.address, selfPermitTest.address)).to.be.eq(ethers_1.constants.MaxUint256);
        });
        it('fails if permit is submitted externally', async () => {
            const { v, r, s } = await (0, permit_1.getPermitSignature)(wallet, token, selfPermitTest.address, ethers_1.constants.MaxUint256);
            (0, chai_1.expect)(await token.allowance(wallet.address, selfPermitTest.address)).to.be.eq(0);
            await token['permit(address,address,uint256,uint256,bool,uint8,bytes32,bytes32)'](wallet.address, selfPermitTest.address, 0, ethers_1.constants.MaxUint256, true, v, r, s);
            (0, chai_1.expect)(await token.allowance(wallet.address, selfPermitTest.address)).to.be.eq(ethers_1.constants.MaxUint256);
            await (0, chai_1.expect)(selfPermitTest.selfPermitAllowed(token.address, 0, ethers_1.constants.MaxUint256, v, r, s)).to.be.revertedWith('TestERC20PermitAllowed::permit: wrong nonce');
        });
    });
    describe('#selfPermitAllowedIfNecessary', () => {
        it('works', async () => {
            const { v, r, s } = await (0, permit_1.getPermitSignature)(wallet, token, selfPermitTest.address, ethers_1.constants.MaxUint256);
            (0, chai_1.expect)(await token.allowance(wallet.address, selfPermitTest.address)).to.eq(0);
            await (0, chai_1.expect)(selfPermitTest.selfPermitAllowedIfNecessary(token.address, 0, ethers_1.constants.MaxUint256, v, r, s))
                .to.emit(token, 'Approval')
                .withArgs(wallet.address, selfPermitTest.address, ethers_1.constants.MaxUint256);
            (0, chai_1.expect)(await token.allowance(wallet.address, selfPermitTest.address)).to.eq(ethers_1.constants.MaxUint256);
        });
        it('skips if already max approved', async () => {
            const { v, r, s } = await (0, permit_1.getPermitSignature)(wallet, token, selfPermitTest.address, ethers_1.constants.MaxUint256);
            (0, chai_1.expect)(await token.allowance(wallet.address, selfPermitTest.address)).to.be.eq(0);
            await token.approve(selfPermitTest.address, ethers_1.constants.MaxUint256);
            await (0, chai_1.expect)(selfPermitTest.selfPermitAllowedIfNecessary(token.address, 0, ethers_1.constants.MaxUint256, v, r, s)).to.not.emit(token, 'Approval');
            (0, chai_1.expect)(await token.allowance(wallet.address, selfPermitTest.address)).to.eq(ethers_1.constants.MaxUint256);
        });
        it('does not fail if permit is submitted externally', async () => {
            const { v, r, s } = await (0, permit_1.getPermitSignature)(wallet, token, selfPermitTest.address, ethers_1.constants.MaxUint256);
            (0, chai_1.expect)(await token.allowance(wallet.address, selfPermitTest.address)).to.be.eq(0);
            await token['permit(address,address,uint256,uint256,bool,uint8,bytes32,bytes32)'](wallet.address, selfPermitTest.address, 0, ethers_1.constants.MaxUint256, true, v, r, s);
            (0, chai_1.expect)(await token.allowance(wallet.address, selfPermitTest.address)).to.be.eq(ethers_1.constants.MaxUint256);
            await selfPermitTest.selfPermitAllowedIfNecessary(token.address, 0, ethers_1.constants.MaxUint256, v, r, s);
        });
    });
});
