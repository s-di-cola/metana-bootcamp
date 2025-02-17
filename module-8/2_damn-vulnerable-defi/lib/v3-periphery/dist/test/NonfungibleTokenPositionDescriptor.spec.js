"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const hardhat_1 = require("hardhat");
const expect_1 = require("./shared/expect");
const completeFixture_1 = __importDefault(require("./shared/completeFixture"));
const encodePriceSqrt_1 = require("./shared/encodePriceSqrt");
const constants_1 = require("./shared/constants");
const ticks_1 = require("./shared/ticks");
const tokenSort_1 = require("./shared/tokenSort");
const extractJSONFromURI_1 = require("./shared/extractJSONFromURI");
const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const USDT = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const TBTC = '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa';
const WBTC = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';
describe('NonfungibleTokenPositionDescriptor', () => {
    let wallets;
    const nftPositionDescriptorCompleteFixture = async (wallets, provider) => {
        const { factory, nft, router, nftDescriptor } = await (0, completeFixture_1.default)(wallets, provider);
        const tokenFactory = await hardhat_1.ethers.getContractFactory('TestERC20');
        const tokens = [
            (await tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))), // do not use maxu256 to avoid overflowing
            (await tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))),
            (await tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))),
        ];
        tokens.sort((a, b) => (a.address.toLowerCase() < b.address.toLowerCase() ? -1 : 1));
        return {
            nftPositionDescriptor: nftDescriptor,
            tokens,
            nft,
        };
    };
    let nftPositionDescriptor;
    let tokens;
    let nft;
    let weth9;
    let loadFixture;
    before('create fixture loader', async () => {
        wallets = await hardhat_1.ethers.getSigners();
        loadFixture = hardhat_1.waffle.createFixtureLoader(wallets);
    });
    beforeEach('load fixture', async () => {
        ;
        ({ tokens, nft, nftPositionDescriptor } = await loadFixture(nftPositionDescriptorCompleteFixture));
        const tokenFactory = await hardhat_1.ethers.getContractFactory('TestERC20');
        weth9 = tokenFactory.attach(await nftPositionDescriptor.WETH9());
    });
    describe('#tokenRatioPriority', () => {
        it('returns -100 for WETH9', async () => {
            (0, expect_1.expect)(await nftPositionDescriptor.tokenRatioPriority(weth9.address, 1)).to.eq(-100);
        });
        it('returns 200 for USDC', async () => {
            (0, expect_1.expect)(await nftPositionDescriptor.tokenRatioPriority(USDC, 1)).to.eq(300);
        });
        it('returns 100 for DAI', async () => {
            (0, expect_1.expect)(await nftPositionDescriptor.tokenRatioPriority(DAI, 1)).to.eq(100);
        });
        it('returns  150 for USDT', async () => {
            (0, expect_1.expect)(await nftPositionDescriptor.tokenRatioPriority(USDT, 1)).to.eq(200);
        });
        it('returns -200 for TBTC', async () => {
            (0, expect_1.expect)(await nftPositionDescriptor.tokenRatioPriority(TBTC, 1)).to.eq(-200);
        });
        it('returns -250 for WBTC', async () => {
            (0, expect_1.expect)(await nftPositionDescriptor.tokenRatioPriority(WBTC, 1)).to.eq(-300);
        });
        it('returns 0 for any non-ratioPriority token', async () => {
            (0, expect_1.expect)(await nftPositionDescriptor.tokenRatioPriority(tokens[0].address, 1)).to.eq(0);
        });
    });
    describe('#flipRatio', () => {
        it('returns false if neither token has priority ordering', async () => {
            (0, expect_1.expect)(await nftPositionDescriptor.flipRatio(tokens[0].address, tokens[2].address, 1)).to.eq(false);
        });
        it('returns true if both tokens are numerators but token0 has a higher priority ordering', async () => {
            (0, expect_1.expect)(await nftPositionDescriptor.flipRatio(USDC, DAI, 1)).to.eq(true);
        });
        it('returns true if both tokens are denominators but token1 has lower priority ordering', async () => {
            (0, expect_1.expect)(await nftPositionDescriptor.flipRatio(weth9.address, WBTC, 1)).to.eq(true);
        });
        it('returns true if token0 is a numerator and token1 is a denominator', async () => {
            (0, expect_1.expect)(await nftPositionDescriptor.flipRatio(DAI, WBTC, 1)).to.eq(true);
        });
        it('returns false if token1 is a numerator and token0 is a denominator', async () => {
            (0, expect_1.expect)(await nftPositionDescriptor.flipRatio(WBTC, DAI, 1)).to.eq(false);
        });
    });
    describe('#tokenURI', () => {
        it('displays ETH as token symbol for WETH token', async () => {
            const [token0, token1] = (0, tokenSort_1.sortedTokens)(weth9, tokens[1]);
            await nft.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await weth9.approve(nft.address, 100);
            await tokens[1].approve(nft.address, 100);
            await nft.mint({
                token0: token0.address,
                token1: token1.address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                recipient: wallets[0].address,
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 1,
            });
            const metadata = (0, extractJSONFromURI_1.extractJSONFromURI)(await nft.tokenURI(1));
            (0, expect_1.expect)(metadata.name).to.match(/(\sETH\/TEST|TEST\/ETH)/);
            (0, expect_1.expect)(metadata.description).to.match(/(TEST-ETH|\sETH-TEST)/);
            (0, expect_1.expect)(metadata.description).to.match(/(\nETH\sAddress)/);
        });
        it('displays returned token symbols when neither token is WETH ', async () => {
            const [token0, token1] = (0, tokenSort_1.sortedTokens)(tokens[2], tokens[1]);
            await nft.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await tokens[1].approve(nft.address, 100);
            await tokens[2].approve(nft.address, 100);
            await nft.mint({
                token0: token0.address,
                token1: token1.address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                recipient: wallets[0].address,
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 1,
            });
            const metadata = (0, extractJSONFromURI_1.extractJSONFromURI)(await nft.tokenURI(1));
            (0, expect_1.expect)(metadata.name).to.match(/TEST\/TEST/);
            (0, expect_1.expect)(metadata.description).to.match(/TEST-TEST/);
        });
        it('can render a different label for native currencies', async () => {
            const [token0, token1] = (0, tokenSort_1.sortedTokens)(weth9, tokens[1]);
            await nft.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1));
            await weth9.approve(nft.address, 100);
            await tokens[1].approve(nft.address, 100);
            await nft.mint({
                token0: token0.address,
                token1: token1.address,
                fee: constants_1.FeeAmount.MEDIUM,
                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                recipient: wallets[0].address,
                amount0Desired: 100,
                amount1Desired: 100,
                amount0Min: 0,
                amount1Min: 0,
                deadline: 1,
            });
            const nftDescriptorLibraryFactory = await hardhat_1.ethers.getContractFactory('NFTDescriptor');
            const nftDescriptorLibrary = await nftDescriptorLibraryFactory.deploy();
            const positionDescriptorFactory = await hardhat_1.ethers.getContractFactory('NonfungibleTokenPositionDescriptor', {
                libraries: {
                    NFTDescriptor: nftDescriptorLibrary.address,
                },
            });
            const nftDescriptor = (await positionDescriptorFactory.deploy(weth9.address, 
            // 'FUNNYMONEY' as a bytes32 string
            '0x46554e4e594d4f4e455900000000000000000000000000000000000000000000'));
            const metadata = (0, extractJSONFromURI_1.extractJSONFromURI)(await nftDescriptor.tokenURI(nft.address, 1));
            (0, expect_1.expect)(metadata.name).to.match(/(\sFUNNYMONEY\/TEST|TEST\/FUNNYMONEY)/);
            (0, expect_1.expect)(metadata.description).to.match(/(TEST-FUNNYMONEY|\sFUNNYMONEY-TEST)/);
            (0, expect_1.expect)(metadata.description).to.match(/(\nFUNNYMONEY\sAddress)/);
        });
    });
});
