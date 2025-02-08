"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const hardhat_1 = require("hardhat");
const completeFixture_1 = __importDefault(require("./shared/completeFixture"));
const constants_1 = require("./shared/constants");
const encodePriceSqrt_1 = require("./shared/encodePriceSqrt");
const expandTo18Decimals_1 = require("./shared/expandTo18Decimals");
const expect_1 = require("./shared/expect");
const path_1 = require("./shared/path");
const quoter_1 = require("./shared/quoter");
describe('Quoter', () => {
    let wallet;
    let trader;
    const swapRouterFixture = async (wallets, provider) => {
        const { weth9, factory, router, tokens, nft } = await (0, completeFixture_1.default)(wallets, provider);
        // approve & fund wallets
        for (const token of tokens) {
            await token.approve(router.address, ethers_1.constants.MaxUint256);
            await token.approve(nft.address, ethers_1.constants.MaxUint256);
            await token.connect(trader).approve(router.address, ethers_1.constants.MaxUint256);
            await token.transfer(trader.address, (0, expandTo18Decimals_1.expandTo18Decimals)(1000000));
        }
        const quoterFactory = await hardhat_1.ethers.getContractFactory('Quoter');
        quoter = (await quoterFactory.deploy(factory.address, weth9.address));
        return {
            tokens,
            nft,
            quoter,
        };
    };
    let nft;
    let tokens;
    let quoter;
    let loadFixture;
    before('create fixture loader', async () => {
        const wallets = await hardhat_1.ethers.getSigners();
        [wallet, trader] = wallets;
        loadFixture = hardhat_1.waffle.createFixtureLoader(wallets);
    });
    // helper for getting weth and token balances
    beforeEach('load fixture', async () => {
        ;
        ({ tokens, nft, quoter } = await loadFixture(swapRouterFixture));
    });
    describe('quotes', () => {
        beforeEach(async () => {
            await (0, quoter_1.createPool)(nft, wallet, tokens[0].address, tokens[1].address);
            await (0, quoter_1.createPool)(nft, wallet, tokens[1].address, tokens[2].address);
        });
        describe('#quoteExactInput', () => {
            it('0 -> 1', async () => {
                const quote = await quoter.callStatic.quoteExactInput((0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]), 3);
                (0, expect_1.expect)(quote).to.eq(1);
            });
            it('1 -> 0', async () => {
                const quote = await quoter.callStatic.quoteExactInput((0, path_1.encodePath)([tokens[1].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]), 3);
                (0, expect_1.expect)(quote).to.eq(1);
            });
            it('0 -> 1 -> 2', async () => {
                const quote = await quoter.callStatic.quoteExactInput((0, path_1.encodePath)(tokens.map((token) => token.address), [constants_1.FeeAmount.MEDIUM, constants_1.FeeAmount.MEDIUM]), 5);
                (0, expect_1.expect)(quote).to.eq(1);
            });
            it('2 -> 1 -> 0', async () => {
                const quote = await quoter.callStatic.quoteExactInput((0, path_1.encodePath)(tokens.map((token) => token.address).reverse(), [constants_1.FeeAmount.MEDIUM, constants_1.FeeAmount.MEDIUM]), 5);
                (0, expect_1.expect)(quote).to.eq(1);
            });
        });
        describe('#quoteExactInputSingle', () => {
            it('0 -> 1', async () => {
                const quote = await quoter.callStatic.quoteExactInputSingle(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, constants_1.MaxUint128, 
                // -2%
                (0, encodePriceSqrt_1.encodePriceSqrt)(100, 102));
                (0, expect_1.expect)(quote).to.eq(9852);
            });
            it('1 -> 0', async () => {
                const quote = await quoter.callStatic.quoteExactInputSingle(tokens[1].address, tokens[0].address, constants_1.FeeAmount.MEDIUM, constants_1.MaxUint128, 
                // +2%
                (0, encodePriceSqrt_1.encodePriceSqrt)(102, 100));
                (0, expect_1.expect)(quote).to.eq(9852);
            });
        });
        describe('#quoteExactOutput', () => {
            it('0 -> 1', async () => {
                const quote = await quoter.callStatic.quoteExactOutput((0, path_1.encodePath)([tokens[1].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]), 1);
                (0, expect_1.expect)(quote).to.eq(3);
            });
            it('1 -> 0', async () => {
                const quote = await quoter.callStatic.quoteExactOutput((0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]), 1);
                (0, expect_1.expect)(quote).to.eq(3);
            });
            it('0 -> 1 -> 2', async () => {
                const quote = await quoter.callStatic.quoteExactOutput((0, path_1.encodePath)(tokens.map((token) => token.address).reverse(), [constants_1.FeeAmount.MEDIUM, constants_1.FeeAmount.MEDIUM]), 1);
                (0, expect_1.expect)(quote).to.eq(5);
            });
            it('2 -> 1 -> 0', async () => {
                const quote = await quoter.callStatic.quoteExactOutput((0, path_1.encodePath)(tokens.map((token) => token.address), [constants_1.FeeAmount.MEDIUM, constants_1.FeeAmount.MEDIUM]), 1);
                (0, expect_1.expect)(quote).to.eq(5);
            });
        });
        describe('#quoteExactOutputSingle', () => {
            it('0 -> 1', async () => {
                const quote = await quoter.callStatic.quoteExactOutputSingle(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, constants_1.MaxUint128, (0, encodePriceSqrt_1.encodePriceSqrt)(100, 102));
                (0, expect_1.expect)(quote).to.eq(9981);
            });
            it('1 -> 0', async () => {
                const quote = await quoter.callStatic.quoteExactOutputSingle(tokens[1].address, tokens[0].address, constants_1.FeeAmount.MEDIUM, constants_1.MaxUint128, (0, encodePriceSqrt_1.encodePriceSqrt)(102, 100));
                (0, expect_1.expect)(quote).to.eq(9981);
            });
        });
    });
});
