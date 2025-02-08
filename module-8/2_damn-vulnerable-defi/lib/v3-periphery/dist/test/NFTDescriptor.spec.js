"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const encodePriceSqrt_1 = require("./shared/encodePriceSqrt");
const hardhat_1 = require("hardhat");
const expect_1 = require("./shared/expect");
const constants_1 = require("./shared/constants");
const snapshotGasCost_1 = __importDefault(require("./shared/snapshotGasCost"));
const formatSqrtRatioX96_1 = require("./shared/formatSqrtRatioX96");
const ticks_1 = require("./shared/ticks");
const crypto_1 = require("crypto");
const extractJSONFromURI_1 = require("./shared/extractJSONFromURI");
const fs_1 = __importDefault(require("fs"));
const is_svg_1 = __importDefault(require("is-svg"));
const TEN = ethers_1.BigNumber.from(10);
const LOWEST_SQRT_RATIO = 4310618292;
const HIGHEST_SQRT_RATIO = ethers_1.BigNumber.from(33849).mul(TEN.pow(34));
describe('NFTDescriptor', () => {
    let wallets;
    const nftDescriptorFixture = async () => {
        const nftDescriptorLibraryFactory = await hardhat_1.ethers.getContractFactory('NFTDescriptor');
        const nftDescriptorLibrary = await nftDescriptorLibraryFactory.deploy();
        const tokenFactory = await hardhat_1.ethers.getContractFactory('TestERC20Metadata');
        const NFTDescriptorFactory = await hardhat_1.ethers.getContractFactory('NFTDescriptorTest', {
            libraries: {
                NFTDescriptor: nftDescriptorLibrary.address,
            },
        });
        const nftDescriptor = (await NFTDescriptorFactory.deploy());
        const TestERC20Metadata = tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2), 'Test ERC20', 'TEST1');
        const tokens = [
            (await tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2), 'Test ERC20', 'TEST1')), // do not use maxu256 to avoid overflowing
            (await tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2), 'Test ERC20', 'TEST2')),
            (await tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2), 'Test ERC20', 'TEST3')),
            (await tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2), 'Test ERC20', 'TEST4')),
        ];
        tokens.sort((a, b) => (a.address.toLowerCase() < b.address.toLowerCase() ? -1 : 1));
        return {
            nftDescriptor,
            tokens,
        };
    };
    let nftDescriptor;
    let tokens;
    let loadFixture;
    before('create fixture loader', async () => {
        wallets = await hardhat_1.ethers.getSigners();
        ({ nftDescriptor, tokens } = await nftDescriptorFixture());
    });
    // beforeEach('load fixture', async () => {
    //   // ;({ nftDescriptor, tokens } = await loadFixture(nftDescriptorFixture))
    //   ;({ nftDescriptor, tokens } = await nftDescriptorFixture())
    //   })
    describe('#constructTokenURI', () => {
        let tokenId;
        let baseTokenAddress;
        let quoteTokenAddress;
        let baseTokenSymbol;
        let quoteTokenSymbol;
        let baseTokenDecimals;
        let quoteTokenDecimals;
        let flipRatio;
        let tickLower;
        let tickUpper;
        let tickCurrent;
        let tickSpacing;
        let fee;
        let poolAddress;
        beforeEach(async () => {
            tokenId = 123;
            baseTokenAddress = tokens[0].address;
            quoteTokenAddress = tokens[1].address;
            baseTokenSymbol = await tokens[0].symbol();
            quoteTokenSymbol = await tokens[1].symbol();
            baseTokenDecimals = await tokens[0].decimals();
            quoteTokenDecimals = await tokens[1].decimals();
            flipRatio = false;
            tickLower = (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]);
            tickUpper = (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]);
            tickCurrent = 0;
            tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM];
            fee = 3000;
            poolAddress = `0x${'b'.repeat(40)}`;
        });
        it('returns the valid JSON string with min and max ticks', async () => {
            const json = (0, extractJSONFromURI_1.extractJSONFromURI)(await nftDescriptor.constructTokenURI({
                tokenId,
                baseTokenAddress,
                quoteTokenAddress,
                baseTokenSymbol,
                quoteTokenSymbol,
                baseTokenDecimals,
                quoteTokenDecimals,
                flipRatio,
                tickLower,
                tickUpper,
                tickCurrent,
                tickSpacing,
                fee,
                poolAddress,
            }));
            const tokenUri = constructTokenMetadata(tokenId, quoteTokenAddress, baseTokenAddress, poolAddress, quoteTokenSymbol, baseTokenSymbol, flipRatio, tickLower, tickUpper, tickCurrent, '0.3%', 'MIN<>MAX');
            (0, expect_1.expect)(json.description).to.equal(tokenUri.description);
            (0, expect_1.expect)(json.name).to.equal(tokenUri.name);
        });
        it('returns the valid JSON string with mid ticks', async () => {
            tickLower = -10;
            tickUpper = 10;
            tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM];
            fee = 3000;
            const json = (0, extractJSONFromURI_1.extractJSONFromURI)(await nftDescriptor.constructTokenURI({
                tokenId,
                baseTokenAddress,
                quoteTokenAddress,
                baseTokenSymbol,
                quoteTokenSymbol,
                baseTokenDecimals,
                quoteTokenDecimals,
                flipRatio,
                tickLower,
                tickUpper,
                tickCurrent,
                tickSpacing,
                fee,
                poolAddress,
            }));
            const tokenMetadata = constructTokenMetadata(tokenId, quoteTokenAddress, baseTokenAddress, poolAddress, quoteTokenSymbol, baseTokenSymbol, flipRatio, tickLower, tickUpper, tickCurrent, '0.3%', '0.99900<>1.0010');
            (0, expect_1.expect)(json.description).to.equal(tokenMetadata.description);
            (0, expect_1.expect)(json.name).to.equal(tokenMetadata.name);
        });
        it('returns valid JSON when token symbols contain quotes', async () => {
            quoteTokenSymbol = '"TES"T1"';
            const json = (0, extractJSONFromURI_1.extractJSONFromURI)(await nftDescriptor.constructTokenURI({
                tokenId,
                baseTokenAddress,
                quoteTokenAddress,
                baseTokenSymbol,
                quoteTokenSymbol,
                baseTokenDecimals,
                quoteTokenDecimals,
                flipRatio,
                tickLower,
                tickUpper,
                tickCurrent,
                tickSpacing,
                fee,
                poolAddress,
            }));
            const tokenMetadata = constructTokenMetadata(tokenId, quoteTokenAddress, baseTokenAddress, poolAddress, quoteTokenSymbol, baseTokenSymbol, flipRatio, tickLower, tickUpper, tickCurrent, '0.3%', 'MIN<>MAX');
            (0, expect_1.expect)(json.description).to.equal(tokenMetadata.description);
            (0, expect_1.expect)(json.name).to.equal(tokenMetadata.name);
        });
        describe('when the token ratio is flipped', () => {
            it('returns the valid JSON for mid ticks', async () => {
                flipRatio = true;
                tickLower = -10;
                tickUpper = 10;
                const json = (0, extractJSONFromURI_1.extractJSONFromURI)(await nftDescriptor.constructTokenURI({
                    tokenId,
                    baseTokenAddress,
                    quoteTokenAddress,
                    baseTokenSymbol,
                    quoteTokenSymbol,
                    baseTokenDecimals,
                    quoteTokenDecimals,
                    flipRatio,
                    tickLower,
                    tickUpper,
                    tickCurrent,
                    tickSpacing,
                    fee,
                    poolAddress,
                }));
                const tokenMetadata = constructTokenMetadata(tokenId, quoteTokenAddress, baseTokenAddress, poolAddress, quoteTokenSymbol, baseTokenSymbol, flipRatio, tickLower, tickUpper, tickCurrent, '0.3%', '0.99900<>1.0010');
                (0, expect_1.expect)(json.description).to.equal(tokenMetadata.description);
                (0, expect_1.expect)(json.name).to.equal(tokenMetadata.name);
            });
            it('returns the valid JSON for min/max ticks', async () => {
                flipRatio = true;
                const json = (0, extractJSONFromURI_1.extractJSONFromURI)(await nftDescriptor.constructTokenURI({
                    tokenId,
                    baseTokenAddress,
                    quoteTokenAddress,
                    baseTokenSymbol,
                    quoteTokenSymbol,
                    baseTokenDecimals,
                    quoteTokenDecimals,
                    flipRatio,
                    tickLower,
                    tickUpper,
                    tickCurrent,
                    tickSpacing,
                    fee,
                    poolAddress,
                }));
                const tokenMetadata = constructTokenMetadata(tokenId, quoteTokenAddress, baseTokenAddress, poolAddress, quoteTokenSymbol, baseTokenSymbol, flipRatio, tickLower, tickUpper, tickCurrent, '0.3%', 'MIN<>MAX');
                (0, expect_1.expect)(json.description).to.equal(tokenMetadata.description);
                (0, expect_1.expect)(json.name).to.equal(tokenMetadata.name);
            });
        });
        it('gas', async () => {
            await (0, snapshotGasCost_1.default)(nftDescriptor.getGasCostOfConstructTokenURI({
                tokenId,
                baseTokenAddress,
                quoteTokenAddress,
                baseTokenSymbol,
                quoteTokenSymbol,
                baseTokenDecimals,
                quoteTokenDecimals,
                flipRatio,
                tickLower,
                tickUpper,
                tickCurrent,
                tickSpacing,
                fee,
                poolAddress,
            }));
        });
        it('snapshot matches', async () => {
            // get snapshot with super rare special sparkle
            tokenId = 1;
            poolAddress = `0x${'b'.repeat(40)}`;
            // get a snapshot with svg fade
            tickCurrent = -1;
            tickLower = 0;
            tickUpper = 1000;
            tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.LOW];
            fee = constants_1.FeeAmount.LOW;
            quoteTokenAddress = '0xabcdeabcdefabcdefabcdefabcdefabcdefabcdf';
            baseTokenAddress = '0x1234567890123456789123456789012345678901';
            quoteTokenSymbol = 'UNI';
            baseTokenSymbol = 'WETH';
            (0, expect_1.expect)(await nftDescriptor.constructTokenURI({
                tokenId,
                quoteTokenAddress,
                baseTokenAddress,
                quoteTokenSymbol,
                baseTokenSymbol,
                baseTokenDecimals,
                quoteTokenDecimals,
                flipRatio,
                tickLower,
                tickUpper,
                tickCurrent,
                tickSpacing,
                fee,
                poolAddress,
            })).toMatchSnapshot();
        });
    });
    describe('#addressToString', () => {
        it('returns the correct string for a given address', async () => {
            let addressStr = await nftDescriptor.addressToString(`0x${'1234abcdef'.repeat(4)}`);
            (0, expect_1.expect)(addressStr).to.eq('0x1234abcdef1234abcdef1234abcdef1234abcdef');
            addressStr = await nftDescriptor.addressToString(`0x${'1'.repeat(40)}`);
            (0, expect_1.expect)(addressStr).to.eq(`0x${'1'.repeat(40)}`);
        });
    });
    describe('#tickToDecimalString', () => {
        let tickSpacing;
        let minTick;
        let maxTick;
        describe('when tickspacing is 10', () => {
            before(() => {
                tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.LOW];
                minTick = (0, ticks_1.getMinTick)(tickSpacing);
                maxTick = (0, ticks_1.getMaxTick)(tickSpacing);
            });
            it('returns MIN on lowest tick', async () => {
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(minTick, tickSpacing, 18, 18, false)).to.equal('MIN');
            });
            it('returns MAX on the highest tick', async () => {
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(maxTick, tickSpacing, 18, 18, false)).to.equal('MAX');
            });
            it('returns the correct decimal string when the tick is in range', async () => {
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(1, tickSpacing, 18, 18, false)).to.equal('1.0001');
            });
            it('returns the correct decimal string when tick is mintick for different tickspace', async () => {
                const otherMinTick = (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH]);
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(otherMinTick, tickSpacing, 18, 18, false)).to.equal('0.0000000000000000000000000000000000000029387');
            });
        });
        describe('when tickspacing is 60', () => {
            before(() => {
                tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM];
                minTick = (0, ticks_1.getMinTick)(tickSpacing);
                maxTick = (0, ticks_1.getMaxTick)(tickSpacing);
            });
            it('returns MIN on lowest tick', async () => {
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(minTick, tickSpacing, 18, 18, false)).to.equal('MIN');
            });
            it('returns MAX on the highest tick', async () => {
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(maxTick, tickSpacing, 18, 18, false)).to.equal('MAX');
            });
            it('returns the correct decimal string when the tick is in range', async () => {
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(-1, tickSpacing, 18, 18, false)).to.equal('0.99990');
            });
            it('returns the correct decimal string when tick is mintick for different tickspace', async () => {
                const otherMinTick = (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH]);
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(otherMinTick, tickSpacing, 18, 18, false)).to.equal('0.0000000000000000000000000000000000000029387');
            });
        });
        describe('when tickspacing is 200', () => {
            before(() => {
                tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH];
                minTick = (0, ticks_1.getMinTick)(tickSpacing);
                maxTick = (0, ticks_1.getMaxTick)(tickSpacing);
            });
            it('returns MIN on lowest tick', async () => {
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(minTick, tickSpacing, 18, 18, false)).to.equal('MIN');
            });
            it('returns MAX on the highest tick', async () => {
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(maxTick, tickSpacing, 18, 18, false)).to.equal('MAX');
            });
            it('returns the correct decimal string when the tick is in range', async () => {
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(0, tickSpacing, 18, 18, false)).to.equal('1.0000');
            });
            it('returns the correct decimal string when tick is mintick for different tickspace', async () => {
                const otherMinTick = (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]);
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(otherMinTick, tickSpacing, 18, 18, false)).to.equal('0.0000000000000000000000000000000000000029387');
            });
        });
        describe('when token ratio is flipped', () => {
            it('returns the inverse of default ratio for medium sized numbers', async () => {
                const tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH];
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(10, tickSpacing, 18, 18, false)).to.eq('1.0010');
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(10, tickSpacing, 18, 18, true)).to.eq('0.99900');
            });
            it('returns the inverse of default ratio for large numbers', async () => {
                const tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH];
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(487272, tickSpacing, 18, 18, false)).to.eq('1448400000000000000000');
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(487272, tickSpacing, 18, 18, true)).to.eq('0.00000000000000000000069041');
            });
            it('returns the inverse of default ratio for small numbers', async () => {
                const tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH];
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(-387272, tickSpacing, 18, 18, false)).to.eq('0.000000000000000015200');
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(-387272, tickSpacing, 18, 18, true)).to.eq('65791000000000000');
            });
            it('returns the correct string with differing token decimals', async () => {
                const tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH];
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(1000, tickSpacing, 18, 18, true)).to.eq('0.90484');
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(1000, tickSpacing, 18, 10, true)).to.eq('90484000');
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(1000, tickSpacing, 10, 18, true)).to.eq('0.0000000090484');
            });
            it('returns MIN for highest tick', async () => {
                const tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH];
                const lowestTick = (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH]);
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(lowestTick, tickSpacing, 18, 18, true)).to.eq('MAX');
            });
            it('returns MAX for lowest tick', async () => {
                const tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH];
                const highestTick = (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH]);
                (0, expect_1.expect)(await nftDescriptor.tickToDecimalString(highestTick, tickSpacing, 18, 18, true)).to.eq('MIN');
            });
        });
    });
    describe('#fixedPointToDecimalString', () => {
        describe('returns the correct string for', () => {
            it('the highest possible price', async () => {
                const ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(33849, 1 / 10 ** 34);
                (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)).to.eq('338490000000000000000000000000000000000');
            });
            it('large numbers', async () => {
                let ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(25811, 1 / 10 ** 11);
                (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)).to.eq('2581100000000000');
                ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(17662, 1 / 10 ** 5);
                (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)).to.eq('1766200000');
            });
            it('exactly 5 sigfig whole number', async () => {
                const ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(42026, 1);
                (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)).to.eq('42026');
            });
            it('when the decimal is at index 4', async () => {
                const ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(12087, 10);
                (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)).to.eq('1208.7');
            });
            it('when the decimal is at index 3', async () => {
                const ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(12087, 100);
                (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)).to.eq('120.87');
            });
            it('when the decimal is at index 2', async () => {
                const ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(12087, 1000);
                (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)).to.eq('12.087');
            });
            it('when the decimal is at index 1', async () => {
                const ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(12345, 10000);
                const bla = await nftDescriptor.fixedPointToDecimalString(ratio, 18, 18);
                (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)).to.eq('1.2345');
            });
            it('when sigfigs have trailing 0s after the decimal', async () => {
                const ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1);
                (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)).to.eq('1.0000');
            });
            it('when there are exactly 5 numbers after the decimal', async () => {
                const ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(12345, 100000);
                (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)).to.eq('0.12345');
            });
            it('very small numbers', async () => {
                let ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(38741, 10 ** 20);
                (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)).to.eq('0.00000000000000038741');
                ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(88498, 10 ** 35);
                (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)).to.eq('0.00000000000000000000000000000088498');
            });
            it('smallest number', async () => {
                const ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(39000, 10 ** 43);
                (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)).to.eq('0.0000000000000000000000000000000000000029387');
            });
        });
        describe('when tokens have different decimal precision', () => {
            describe('when baseToken has more precision decimals than quoteToken', () => {
                it('returns the correct string when the decimal difference is even', async () => {
                    (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString((0, encodePriceSqrt_1.encodePriceSqrt)(1, 1), 18, 16)).to.eq('100.00');
                });
                it('returns the correct string when the decimal difference is odd', async () => {
                    const tenRatio = (0, encodePriceSqrt_1.encodePriceSqrt)(10, 1);
                    (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString(tenRatio, 18, 17)).to.eq('100.00');
                });
                it('does not account for higher token0 precision if difference is more than 18', async () => {
                    (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString((0, encodePriceSqrt_1.encodePriceSqrt)(1, 1), 24, 5)).to.eq('1.0000');
                });
            });
            describe('when quoteToken has more precision decimals than baseToken', () => {
                it('returns the correct string when the decimal difference is even', async () => {
                    (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString((0, encodePriceSqrt_1.encodePriceSqrt)(1, 1), 10, 18)).to.eq('0.000000010000');
                });
                it('returns the correct string when the decimal difference is odd', async () => {
                    (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString((0, encodePriceSqrt_1.encodePriceSqrt)(1, 1), 7, 18)).to.eq('0.000000000010000');
                });
                // TODO: provide compatibility token prices that breach minimum price due to token decimal differences
                it.skip('returns the correct string when the decimal difference brings ratio below the minimum', async () => {
                    const lowRatio = (0, encodePriceSqrt_1.encodePriceSqrt)(88498, 10 ** 35);
                    (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString(lowRatio, 10, 20)).to.eq('0.000000000000000000000000000000000000000088498');
                });
                it('does not account for higher token1 precision if difference is more than 18', async () => {
                    (0, expect_1.expect)(await nftDescriptor.fixedPointToDecimalString((0, encodePriceSqrt_1.encodePriceSqrt)(1, 1), 24, 5)).to.eq('1.0000');
                });
            });
            it('some fuzz', async () => {
                const random = (min, max) => {
                    return Math.floor(min + ((Math.random() * 100) % (max + 1 - min)));
                };
                const inputs = [];
                let i = 0;
                while (i <= 20) {
                    const ratio = ethers_1.BigNumber.from(`0x${(0, crypto_1.randomBytes)(random(7, 20)).toString('hex')}`);
                    const decimals0 = random(3, 21);
                    const decimals1 = random(3, 21);
                    const decimalDiff = Math.abs(decimals0 - decimals1);
                    // TODO: Address edgecase out of bounds prices due to decimal differences
                    if (ratio.div(TEN.pow(decimalDiff)).gt(LOWEST_SQRT_RATIO) &&
                        ratio.mul(TEN.pow(decimalDiff)).lt(HIGHEST_SQRT_RATIO)) {
                        inputs.push([ratio, decimals0, decimals1]);
                        i++;
                    }
                }
                for (let i in inputs) {
                    let ratio;
                    let decimals0;
                    let decimals1;
                    [ratio, decimals0, decimals1] = inputs[i];
                    let result = await nftDescriptor.fixedPointToDecimalString(ratio, decimals0, decimals1);
                    (0, expect_1.expect)((0, formatSqrtRatioX96_1.formatSqrtRatioX96)(ratio, decimals0, decimals1)).to.eq(result);
                }
            }).timeout(300000);
        });
    });
    describe('#feeToPercentString', () => {
        it('returns the correct fee for 0', async () => {
            (0, expect_1.expect)(await nftDescriptor.feeToPercentString(0)).to.eq('0%');
        });
        it('returns the correct fee for 1', async () => {
            (0, expect_1.expect)(await nftDescriptor.feeToPercentString(1)).to.eq('0.0001%');
        });
        it('returns the correct fee for 30', async () => {
            (0, expect_1.expect)(await nftDescriptor.feeToPercentString(30)).to.eq('0.003%');
        });
        it('returns the correct fee for 33', async () => {
            (0, expect_1.expect)(await nftDescriptor.feeToPercentString(33)).to.eq('0.0033%');
        });
        it('returns the correct fee for 500', async () => {
            (0, expect_1.expect)(await nftDescriptor.feeToPercentString(500)).to.eq('0.05%');
        });
        it('returns the correct fee for 2500', async () => {
            (0, expect_1.expect)(await nftDescriptor.feeToPercentString(2500)).to.eq('0.25%');
        });
        it('returns the correct fee for 3000', async () => {
            (0, expect_1.expect)(await nftDescriptor.feeToPercentString(3000)).to.eq('0.3%');
        });
        it('returns the correct fee for 10000', async () => {
            (0, expect_1.expect)(await nftDescriptor.feeToPercentString(10000)).to.eq('1%');
        });
        it('returns the correct fee for 17000', async () => {
            (0, expect_1.expect)(await nftDescriptor.feeToPercentString(17000)).to.eq('1.7%');
        });
        it('returns the correct fee for 100000', async () => {
            (0, expect_1.expect)(await nftDescriptor.feeToPercentString(100000)).to.eq('10%');
        });
        it('returns the correct fee for 150000', async () => {
            (0, expect_1.expect)(await nftDescriptor.feeToPercentString(150000)).to.eq('15%');
        });
        it('returns the correct fee for 102000', async () => {
            (0, expect_1.expect)(await nftDescriptor.feeToPercentString(102000)).to.eq('10.2%');
        });
        it('returns the correct fee for 10000000', async () => {
            (0, expect_1.expect)(await nftDescriptor.feeToPercentString(1000000)).to.eq('100%');
        });
        it('returns the correct fee for 1005000', async () => {
            (0, expect_1.expect)(await nftDescriptor.feeToPercentString(1005000)).to.eq('100.5%');
        });
        it('returns the correct fee for 10000000', async () => {
            (0, expect_1.expect)(await nftDescriptor.feeToPercentString(10000000)).to.eq('1000%');
        });
        it('returns the correct fee for 12300000', async () => {
            (0, expect_1.expect)(await nftDescriptor.feeToPercentString(12300000)).to.eq('1230%');
        });
    });
    describe('#tokenToColorHex', () => {
        function tokenToColorHex(tokenAddress, startIndex) {
            return `${tokenAddress.slice(startIndex, startIndex + 6).toLowerCase()}`;
        }
        it('returns the correct hash for the first 3 bytes of the token address', async () => {
            (0, expect_1.expect)(await nftDescriptor.tokenToColorHex(tokens[0].address, 136)).to.eq(tokenToColorHex(tokens[0].address, 2));
            (0, expect_1.expect)(await nftDescriptor.tokenToColorHex(tokens[1].address, 136)).to.eq(tokenToColorHex(tokens[1].address, 2));
        });
        it('returns the correct hash for the last 3 bytes of the address', async () => {
            (0, expect_1.expect)(await nftDescriptor.tokenToColorHex(tokens[0].address, 0)).to.eq(tokenToColorHex(tokens[0].address, 36));
            (0, expect_1.expect)(await nftDescriptor.tokenToColorHex(tokens[1].address, 0)).to.eq(tokenToColorHex(tokens[1].address, 36));
        });
    });
    describe('#rangeLocation', () => {
        it('returns the correct coordinates when range midpoint under -125_000', async () => {
            const coords = await nftDescriptor.rangeLocation(-887272, -887100);
            (0, expect_1.expect)(coords[0]).to.eq('8');
            (0, expect_1.expect)(coords[1]).to.eq('7');
        });
        it('returns the correct coordinates when range midpoint is between -125_000 and -75_000', async () => {
            const coords = await nftDescriptor.rangeLocation(-100000, -90000);
            (0, expect_1.expect)(coords[0]).to.eq('8');
            (0, expect_1.expect)(coords[1]).to.eq('10.5');
        });
        it('returns the correct coordinates when range midpoint is between -75_000 and -25_000', async () => {
            const coords = await nftDescriptor.rangeLocation(-50000, -20000);
            (0, expect_1.expect)(coords[0]).to.eq('8');
            (0, expect_1.expect)(coords[1]).to.eq('14.25');
        });
        it('returns the correct coordinates when range midpoint is between -25_000 and -5_000', async () => {
            const coords = await nftDescriptor.rangeLocation(-10000, -5000);
            (0, expect_1.expect)(coords[0]).to.eq('10');
            (0, expect_1.expect)(coords[1]).to.eq('18');
        });
        it('returns the correct coordinates when range midpoint is between -5_000 and 0', async () => {
            const coords = await nftDescriptor.rangeLocation(-5000, -4000);
            (0, expect_1.expect)(coords[0]).to.eq('11');
            (0, expect_1.expect)(coords[1]).to.eq('21');
        });
        it('returns the correct coordinates when range midpoint is between 0 and 5_000', async () => {
            const coords = await nftDescriptor.rangeLocation(4000, 5000);
            (0, expect_1.expect)(coords[0]).to.eq('13');
            (0, expect_1.expect)(coords[1]).to.eq('23');
        });
        it('returns the correct coordinates when range midpoint is between 5_000 and 25_000', async () => {
            const coords = await nftDescriptor.rangeLocation(10000, 15000);
            (0, expect_1.expect)(coords[0]).to.eq('15');
            (0, expect_1.expect)(coords[1]).to.eq('25');
        });
        it('returns the correct coordinates when range midpoint is between 25_000 and 75_000', async () => {
            const coords = await nftDescriptor.rangeLocation(25000, 50000);
            (0, expect_1.expect)(coords[0]).to.eq('18');
            (0, expect_1.expect)(coords[1]).to.eq('26');
        });
        it('returns the correct coordinates when range midpoint is between 75_000 and 125_000', async () => {
            const coords = await nftDescriptor.rangeLocation(100000, 125000);
            (0, expect_1.expect)(coords[0]).to.eq('21');
            (0, expect_1.expect)(coords[1]).to.eq('27');
        });
        it('returns the correct coordinates when range midpoint is above 125_000', async () => {
            const coords = await nftDescriptor.rangeLocation(200000, 100000);
            (0, expect_1.expect)(coords[0]).to.eq('24');
            (0, expect_1.expect)(coords[1]).to.eq('27');
        });
        it('math does not overflow on max value', async () => {
            const coords = await nftDescriptor.rangeLocation(887272, 887272);
            (0, expect_1.expect)(coords[0]).to.eq('24');
            (0, expect_1.expect)(coords[1]).to.eq('27');
        });
    });
    describe('#svgImage', () => {
        let tokenId;
        let baseTokenAddress;
        let quoteTokenAddress;
        let baseTokenSymbol;
        let quoteTokenSymbol;
        let baseTokenDecimals;
        let quoteTokenDecimals;
        let flipRatio;
        let tickLower;
        let tickUpper;
        let tickCurrent;
        let tickSpacing;
        let fee;
        let poolAddress;
        beforeEach(async () => {
            tokenId = 123;
            quoteTokenAddress = '0x1234567890123456789123456789012345678901';
            baseTokenAddress = '0xabcdeabcdefabcdefabcdefabcdefabcdefabcdf';
            quoteTokenSymbol = 'UNI';
            baseTokenSymbol = 'WETH';
            tickLower = -1000;
            tickUpper = 2000;
            tickCurrent = 40;
            fee = 500;
            baseTokenDecimals = await tokens[0].decimals();
            quoteTokenDecimals = await tokens[1].decimals();
            flipRatio = false;
            tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM];
            poolAddress = `0x${'b'.repeat(40)}`;
        });
        it('matches the current snapshot', async () => {
            const svg = await nftDescriptor.generateSVGImage({
                tokenId,
                baseTokenAddress,
                quoteTokenAddress,
                baseTokenSymbol,
                quoteTokenSymbol,
                baseTokenDecimals,
                quoteTokenDecimals,
                flipRatio,
                tickLower,
                tickUpper,
                tickCurrent,
                tickSpacing,
                fee,
                poolAddress,
            });
            (0, expect_1.expect)(svg).toMatchSnapshot();
            fs_1.default.writeFileSync('./test/__snapshots__/NFTDescriptor.svg', svg);
        });
        it('returns a valid SVG', async () => {
            const svg = await nftDescriptor.generateSVGImage({
                tokenId,
                baseTokenAddress,
                quoteTokenAddress,
                baseTokenSymbol,
                quoteTokenSymbol,
                baseTokenDecimals,
                quoteTokenDecimals,
                flipRatio,
                tickLower,
                tickUpper,
                tickCurrent,
                tickSpacing,
                fee,
                poolAddress,
            });
            (0, expect_1.expect)((0, is_svg_1.default)(svg)).to.eq(true);
        });
    });
    describe('#isRare', () => {
        it('returns true sometimes', async () => {
            (0, expect_1.expect)(await nftDescriptor.isRare(1, `0x${'b'.repeat(40)}`)).to.eq(true);
        });
        it('returns false sometimes', async () => {
            (0, expect_1.expect)(await nftDescriptor.isRare(2, `0x${'b'.repeat(40)}`)).to.eq(false);
        });
    });
    function constructTokenMetadata(tokenId, quoteTokenAddress, baseTokenAddress, poolAddress, quoteTokenSymbol, baseTokenSymbol, flipRatio, tickLower, tickUpper, tickCurrent, feeTier, prices) {
        quoteTokenSymbol = quoteTokenSymbol.replace(/"/gi, '"');
        baseTokenSymbol = baseTokenSymbol.replace(/"/gi, '"');
        return {
            name: `Uniswap - ${feeTier} - ${quoteTokenSymbol}/${baseTokenSymbol} - ${prices}`,
            description: `This NFT represents a liquidity position in a Uniswap V3 ${quoteTokenSymbol}-${baseTokenSymbol} pool. The owner of this NFT can modify or redeem the position.\n\
\nPool Address: ${poolAddress}\n${quoteTokenSymbol} Address: ${quoteTokenAddress.toLowerCase()}\n${baseTokenSymbol} Address: ${baseTokenAddress.toLowerCase()}\n\
Fee Tier: ${feeTier}\nToken ID: ${tokenId}\n\n⚠️ DISCLAIMER: Due diligence is imperative when assessing this NFT. Make sure token addresses match the expected tokens, as \
token symbols may be imitated.`,
        };
    }
});
