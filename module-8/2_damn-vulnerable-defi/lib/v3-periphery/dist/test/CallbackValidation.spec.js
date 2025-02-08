"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const hardhat_1 = require("hardhat");
const completeFixture_1 = __importDefault(require("./shared/completeFixture"));
const expect_1 = require("./shared/expect");
const constants_1 = require("./shared/constants");
describe('CallbackValidation', () => {
    let nonpairAddr, wallets;
    const callbackValidationFixture = async (wallets, provider) => {
        const { factory } = await (0, completeFixture_1.default)(wallets, provider);
        const tokenFactory = await hardhat_1.ethers.getContractFactory('TestERC20');
        const callbackValidationFactory = await hardhat_1.ethers.getContractFactory('TestCallbackValidation');
        const tokens = [
            (await tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))), // do not use maxu256 to avoid overflowing
            (await tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))),
        ];
        const callbackValidation = (await callbackValidationFactory.deploy());
        return {
            tokens,
            callbackValidation,
            factory,
        };
    };
    let callbackValidation;
    let tokens;
    let factory;
    let loadFixture;
    before('create fixture loader', async () => {
        ;
        [nonpairAddr, ...wallets] = await hardhat_1.ethers.getSigners();
        loadFixture = hardhat_1.waffle.createFixtureLoader(wallets);
    });
    beforeEach('load fixture', async () => {
        ;
        ({ callbackValidation, tokens, factory } = await loadFixture(callbackValidationFixture));
    });
    it('reverts when called from an address other than the associated UniswapV3Pool', async () => {
        (0, expect_1.expect)(callbackValidation
            .connect(nonpairAddr)
            .verifyCallback(factory.address, tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM)).to.be.reverted;
    });
});
