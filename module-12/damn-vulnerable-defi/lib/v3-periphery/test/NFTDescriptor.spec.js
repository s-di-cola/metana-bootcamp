"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var encodePriceSqrt_1 = require("./shared/encodePriceSqrt");
var hardhat_1 = require("hardhat");
var expect_1 = require("./shared/expect");
var constants_1 = require("./shared/constants");
var snapshotGasCost_1 = require("./shared/snapshotGasCost");
var formatSqrtRatioX96_1 = require("./shared/formatSqrtRatioX96");
var ticks_1 = require("./shared/ticks");
var crypto_1 = require("crypto");
var extractJSONFromURI_1 = require("./shared/extractJSONFromURI");
var fs_1 = require("fs");
var is_svg_1 = require("is-svg");
var TEN = ethers_1.BigNumber.from(10);
var LOWEST_SQRT_RATIO = 4310618292;
var HIGHEST_SQRT_RATIO = ethers_1.BigNumber.from(33849).mul(TEN.pow(34));
describe('NFTDescriptor', function () {
    var wallets;
    var nftDescriptorFixture = function () { return __awaiter(void 0, void 0, void 0, function () {
        var nftDescriptorLibraryFactory, nftDescriptorLibrary, tokenFactory, NFTDescriptorFactory, nftDescriptor, TestERC20Metadata, tokens, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('NFTDescriptor')];
                case 1:
                    nftDescriptorLibraryFactory = _b.sent();
                    return [4 /*yield*/, nftDescriptorLibraryFactory.deploy()];
                case 2:
                    nftDescriptorLibrary = _b.sent();
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TestERC20Metadata')];
                case 3:
                    tokenFactory = _b.sent();
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('NFTDescriptorTest', {
                            libraries: {
                                NFTDescriptor: nftDescriptorLibrary.address,
                            },
                        })];
                case 4:
                    NFTDescriptorFactory = _b.sent();
                    return [4 /*yield*/, NFTDescriptorFactory.deploy()];
                case 5:
                    nftDescriptor = (_b.sent());
                    TestERC20Metadata = tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2), 'Test ERC20', 'TEST1');
                    return [4 /*yield*/, tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2), 'Test ERC20', 'TEST1')];
                case 6:
                    _a = [
                        (_b.sent())
                    ];
                    return [4 /*yield*/, tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2), 'Test ERC20', 'TEST2')];
                case 7:
                    _a = _a.concat([
                        (_b.sent())
                    ]);
                    return [4 /*yield*/, tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2), 'Test ERC20', 'TEST3')];
                case 8:
                    _a = _a.concat([
                        (_b.sent())
                    ]);
                    return [4 /*yield*/, tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2), 'Test ERC20', 'TEST4')];
                case 9:
                    tokens = _a.concat([
                        (_b.sent())
                    ]);
                    tokens.sort(function (a, b) { return (a.address.toLowerCase() < b.address.toLowerCase() ? -1 : 1); });
                    return [2 /*return*/, {
                            nftDescriptor: nftDescriptor,
                            tokens: tokens,
                        }];
            }
        });
    }); };
    var nftDescriptor;
    var tokens;
    var loadFixture;
    before('create fixture loader', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getSigners()
                    // loadFixture = waffle.createFixtureLoader(wallets)
                ];
                case 1:
                    wallets = _b.sent();
                    return [4 /*yield*/, nftDescriptorFixture()];
                case 2:
                    (_a = _b.sent(), nftDescriptor = _a.nftDescriptor, tokens = _a.tokens);
                    return [2 /*return*/];
            }
        });
    }); });
    // beforeEach('load fixture', async () => {
    //   // ;({ nftDescriptor, tokens } = await loadFixture(nftDescriptorFixture))
    //   ;({ nftDescriptor, tokens } = await nftDescriptorFixture())
    //   })
    describe('#constructTokenURI', function () {
        var tokenId;
        var baseTokenAddress;
        var quoteTokenAddress;
        var baseTokenSymbol;
        var quoteTokenSymbol;
        var baseTokenDecimals;
        var quoteTokenDecimals;
        var flipRatio;
        var tickLower;
        var tickUpper;
        var tickCurrent;
        var tickSpacing;
        var fee;
        var poolAddress;
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenId = 123;
                        baseTokenAddress = tokens[0].address;
                        quoteTokenAddress = tokens[1].address;
                        return [4 /*yield*/, tokens[0].symbol()];
                    case 1:
                        baseTokenSymbol = _a.sent();
                        return [4 /*yield*/, tokens[1].symbol()];
                    case 2:
                        quoteTokenSymbol = _a.sent();
                        return [4 /*yield*/, tokens[0].decimals()];
                    case 3:
                        baseTokenDecimals = _a.sent();
                        return [4 /*yield*/, tokens[1].decimals()];
                    case 4:
                        quoteTokenDecimals = _a.sent();
                        flipRatio = false;
                        tickLower = (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]);
                        tickUpper = (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]);
                        tickCurrent = 0;
                        tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM];
                        fee = 3000;
                        poolAddress = "0x".concat('b'.repeat(40));
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the valid JSON string with min and max ticks', function () { return __awaiter(void 0, void 0, void 0, function () {
            var json, _a, tokenUri;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = extractJSONFromURI_1.extractJSONFromURI;
                        return [4 /*yield*/, nftDescriptor.constructTokenURI({
                                tokenId: tokenId,
                                baseTokenAddress: baseTokenAddress,
                                quoteTokenAddress: quoteTokenAddress,
                                baseTokenSymbol: baseTokenSymbol,
                                quoteTokenSymbol: quoteTokenSymbol,
                                baseTokenDecimals: baseTokenDecimals,
                                quoteTokenDecimals: quoteTokenDecimals,
                                flipRatio: flipRatio,
                                tickLower: tickLower,
                                tickUpper: tickUpper,
                                tickCurrent: tickCurrent,
                                tickSpacing: tickSpacing,
                                fee: fee,
                                poolAddress: poolAddress,
                            })];
                    case 1:
                        json = _a.apply(void 0, [_b.sent()]);
                        tokenUri = constructTokenMetadata(tokenId, quoteTokenAddress, baseTokenAddress, poolAddress, quoteTokenSymbol, baseTokenSymbol, flipRatio, tickLower, tickUpper, tickCurrent, '0.3%', 'MIN<>MAX');
                        (0, expect_1.expect)(json.description).to.equal(tokenUri.description);
                        (0, expect_1.expect)(json.name).to.equal(tokenUri.name);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the valid JSON string with mid ticks', function () { return __awaiter(void 0, void 0, void 0, function () {
            var json, _a, tokenMetadata;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tickLower = -10;
                        tickUpper = 10;
                        tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM];
                        fee = 3000;
                        _a = extractJSONFromURI_1.extractJSONFromURI;
                        return [4 /*yield*/, nftDescriptor.constructTokenURI({
                                tokenId: tokenId,
                                baseTokenAddress: baseTokenAddress,
                                quoteTokenAddress: quoteTokenAddress,
                                baseTokenSymbol: baseTokenSymbol,
                                quoteTokenSymbol: quoteTokenSymbol,
                                baseTokenDecimals: baseTokenDecimals,
                                quoteTokenDecimals: quoteTokenDecimals,
                                flipRatio: flipRatio,
                                tickLower: tickLower,
                                tickUpper: tickUpper,
                                tickCurrent: tickCurrent,
                                tickSpacing: tickSpacing,
                                fee: fee,
                                poolAddress: poolAddress,
                            })];
                    case 1:
                        json = _a.apply(void 0, [_b.sent()]);
                        tokenMetadata = constructTokenMetadata(tokenId, quoteTokenAddress, baseTokenAddress, poolAddress, quoteTokenSymbol, baseTokenSymbol, flipRatio, tickLower, tickUpper, tickCurrent, '0.3%', '0.99900<>1.0010');
                        (0, expect_1.expect)(json.description).to.equal(tokenMetadata.description);
                        (0, expect_1.expect)(json.name).to.equal(tokenMetadata.name);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns valid JSON when token symbols contain quotes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var json, _a, tokenMetadata;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        quoteTokenSymbol = '"TES"T1"';
                        _a = extractJSONFromURI_1.extractJSONFromURI;
                        return [4 /*yield*/, nftDescriptor.constructTokenURI({
                                tokenId: tokenId,
                                baseTokenAddress: baseTokenAddress,
                                quoteTokenAddress: quoteTokenAddress,
                                baseTokenSymbol: baseTokenSymbol,
                                quoteTokenSymbol: quoteTokenSymbol,
                                baseTokenDecimals: baseTokenDecimals,
                                quoteTokenDecimals: quoteTokenDecimals,
                                flipRatio: flipRatio,
                                tickLower: tickLower,
                                tickUpper: tickUpper,
                                tickCurrent: tickCurrent,
                                tickSpacing: tickSpacing,
                                fee: fee,
                                poolAddress: poolAddress,
                            })];
                    case 1:
                        json = _a.apply(void 0, [_b.sent()]);
                        tokenMetadata = constructTokenMetadata(tokenId, quoteTokenAddress, baseTokenAddress, poolAddress, quoteTokenSymbol, baseTokenSymbol, flipRatio, tickLower, tickUpper, tickCurrent, '0.3%', 'MIN<>MAX');
                        (0, expect_1.expect)(json.description).to.equal(tokenMetadata.description);
                        (0, expect_1.expect)(json.name).to.equal(tokenMetadata.name);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('when the token ratio is flipped', function () {
            it('returns the valid JSON for mid ticks', function () { return __awaiter(void 0, void 0, void 0, function () {
                var json, _a, tokenMetadata;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            flipRatio = true;
                            tickLower = -10;
                            tickUpper = 10;
                            _a = extractJSONFromURI_1.extractJSONFromURI;
                            return [4 /*yield*/, nftDescriptor.constructTokenURI({
                                    tokenId: tokenId,
                                    baseTokenAddress: baseTokenAddress,
                                    quoteTokenAddress: quoteTokenAddress,
                                    baseTokenSymbol: baseTokenSymbol,
                                    quoteTokenSymbol: quoteTokenSymbol,
                                    baseTokenDecimals: baseTokenDecimals,
                                    quoteTokenDecimals: quoteTokenDecimals,
                                    flipRatio: flipRatio,
                                    tickLower: tickLower,
                                    tickUpper: tickUpper,
                                    tickCurrent: tickCurrent,
                                    tickSpacing: tickSpacing,
                                    fee: fee,
                                    poolAddress: poolAddress,
                                })];
                        case 1:
                            json = _a.apply(void 0, [_b.sent()]);
                            tokenMetadata = constructTokenMetadata(tokenId, quoteTokenAddress, baseTokenAddress, poolAddress, quoteTokenSymbol, baseTokenSymbol, flipRatio, tickLower, tickUpper, tickCurrent, '0.3%', '0.99900<>1.0010');
                            (0, expect_1.expect)(json.description).to.equal(tokenMetadata.description);
                            (0, expect_1.expect)(json.name).to.equal(tokenMetadata.name);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns the valid JSON for min/max ticks', function () { return __awaiter(void 0, void 0, void 0, function () {
                var json, _a, tokenMetadata;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            flipRatio = true;
                            _a = extractJSONFromURI_1.extractJSONFromURI;
                            return [4 /*yield*/, nftDescriptor.constructTokenURI({
                                    tokenId: tokenId,
                                    baseTokenAddress: baseTokenAddress,
                                    quoteTokenAddress: quoteTokenAddress,
                                    baseTokenSymbol: baseTokenSymbol,
                                    quoteTokenSymbol: quoteTokenSymbol,
                                    baseTokenDecimals: baseTokenDecimals,
                                    quoteTokenDecimals: quoteTokenDecimals,
                                    flipRatio: flipRatio,
                                    tickLower: tickLower,
                                    tickUpper: tickUpper,
                                    tickCurrent: tickCurrent,
                                    tickSpacing: tickSpacing,
                                    fee: fee,
                                    poolAddress: poolAddress,
                                })];
                        case 1:
                            json = _a.apply(void 0, [_b.sent()]);
                            tokenMetadata = constructTokenMetadata(tokenId, quoteTokenAddress, baseTokenAddress, poolAddress, quoteTokenSymbol, baseTokenSymbol, flipRatio, tickLower, tickUpper, tickCurrent, '0.3%', 'MIN<>MAX');
                            (0, expect_1.expect)(json.description).to.equal(tokenMetadata.description);
                            (0, expect_1.expect)(json.name).to.equal(tokenMetadata.name);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(nftDescriptor.getGasCostOfConstructTokenURI({
                            tokenId: tokenId,
                            baseTokenAddress: baseTokenAddress,
                            quoteTokenAddress: quoteTokenAddress,
                            baseTokenSymbol: baseTokenSymbol,
                            quoteTokenSymbol: quoteTokenSymbol,
                            baseTokenDecimals: baseTokenDecimals,
                            quoteTokenDecimals: quoteTokenDecimals,
                            flipRatio: flipRatio,
                            tickLower: tickLower,
                            tickUpper: tickUpper,
                            tickCurrent: tickCurrent,
                            tickSpacing: tickSpacing,
                            fee: fee,
                            poolAddress: poolAddress,
                        }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('snapshot matches', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // get snapshot with super rare special sparkle
                        tokenId = 1;
                        poolAddress = "0x".concat('b'.repeat(40));
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
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.constructTokenURI({
                                tokenId: tokenId,
                                quoteTokenAddress: quoteTokenAddress,
                                baseTokenAddress: baseTokenAddress,
                                quoteTokenSymbol: quoteTokenSymbol,
                                baseTokenSymbol: baseTokenSymbol,
                                baseTokenDecimals: baseTokenDecimals,
                                quoteTokenDecimals: quoteTokenDecimals,
                                flipRatio: flipRatio,
                                tickLower: tickLower,
                                tickUpper: tickUpper,
                                tickCurrent: tickCurrent,
                                tickSpacing: tickSpacing,
                                fee: fee,
                                poolAddress: poolAddress,
                            })];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toMatchSnapshot();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#addressToString', function () {
        it('returns the correct string for a given address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var addressStr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nftDescriptor.addressToString("0x".concat('1234abcdef'.repeat(4)))];
                    case 1:
                        addressStr = _a.sent();
                        (0, expect_1.expect)(addressStr).to.eq('0x1234abcdef1234abcdef1234abcdef1234abcdef');
                        return [4 /*yield*/, nftDescriptor.addressToString("0x".concat('1'.repeat(40)))];
                    case 2:
                        addressStr = _a.sent();
                        (0, expect_1.expect)(addressStr).to.eq("0x".concat('1'.repeat(40)));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#tickToDecimalString', function () {
        var tickSpacing;
        var minTick;
        var maxTick;
        describe('when tickspacing is 10', function () {
            before(function () {
                tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.LOW];
                minTick = (0, ticks_1.getMinTick)(tickSpacing);
                maxTick = (0, ticks_1.getMaxTick)(tickSpacing);
            });
            it('returns MIN on lowest tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(minTick, tickSpacing, 18, 18, false)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.equal('MIN');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns MAX on the highest tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(maxTick, tickSpacing, 18, 18, false)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.equal('MAX');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns the correct decimal string when the tick is in range', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(1, tickSpacing, 18, 18, false)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.equal('1.0001');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns the correct decimal string when tick is mintick for different tickspace', function () { return __awaiter(void 0, void 0, void 0, function () {
                var otherMinTick, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            otherMinTick = (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH]);
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(otherMinTick, tickSpacing, 18, 18, false)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.equal('0.0000000000000000000000000000000000000029387');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when tickspacing is 60', function () {
            before(function () {
                tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM];
                minTick = (0, ticks_1.getMinTick)(tickSpacing);
                maxTick = (0, ticks_1.getMaxTick)(tickSpacing);
            });
            it('returns MIN on lowest tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(minTick, tickSpacing, 18, 18, false)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.equal('MIN');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns MAX on the highest tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(maxTick, tickSpacing, 18, 18, false)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.equal('MAX');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns the correct decimal string when the tick is in range', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(-1, tickSpacing, 18, 18, false)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.equal('0.99990');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns the correct decimal string when tick is mintick for different tickspace', function () { return __awaiter(void 0, void 0, void 0, function () {
                var otherMinTick, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            otherMinTick = (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH]);
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(otherMinTick, tickSpacing, 18, 18, false)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.equal('0.0000000000000000000000000000000000000029387');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when tickspacing is 200', function () {
            before(function () {
                tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH];
                minTick = (0, ticks_1.getMinTick)(tickSpacing);
                maxTick = (0, ticks_1.getMaxTick)(tickSpacing);
            });
            it('returns MIN on lowest tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(minTick, tickSpacing, 18, 18, false)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.equal('MIN');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns MAX on the highest tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(maxTick, tickSpacing, 18, 18, false)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.equal('MAX');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns the correct decimal string when the tick is in range', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(0, tickSpacing, 18, 18, false)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.equal('1.0000');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns the correct decimal string when tick is mintick for different tickspace', function () { return __awaiter(void 0, void 0, void 0, function () {
                var otherMinTick, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            otherMinTick = (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]);
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(otherMinTick, tickSpacing, 18, 18, false)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.equal('0.0000000000000000000000000000000000000029387');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when token ratio is flipped', function () {
            it('returns the inverse of default ratio for medium sized numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
                var tickSpacing, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH];
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(10, tickSpacing, 18, 18, false)];
                        case 1:
                            _a.apply(void 0, [_c.sent()]).to.eq('1.0010');
                            _b = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(10, tickSpacing, 18, 18, true)];
                        case 2:
                            _b.apply(void 0, [_c.sent()]).to.eq('0.99900');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns the inverse of default ratio for large numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
                var tickSpacing, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH];
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(487272, tickSpacing, 18, 18, false)];
                        case 1:
                            _a.apply(void 0, [_c.sent()]).to.eq('1448400000000000000000');
                            _b = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(487272, tickSpacing, 18, 18, true)];
                        case 2:
                            _b.apply(void 0, [_c.sent()]).to.eq('0.00000000000000000000069041');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns the inverse of default ratio for small numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
                var tickSpacing, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH];
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(-387272, tickSpacing, 18, 18, false)];
                        case 1:
                            _a.apply(void 0, [_c.sent()]).to.eq('0.000000000000000015200');
                            _b = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(-387272, tickSpacing, 18, 18, true)];
                        case 2:
                            _b.apply(void 0, [_c.sent()]).to.eq('65791000000000000');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns the correct string with differing token decimals', function () { return __awaiter(void 0, void 0, void 0, function () {
                var tickSpacing, _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH];
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(1000, tickSpacing, 18, 18, true)];
                        case 1:
                            _a.apply(void 0, [_d.sent()]).to.eq('0.90484');
                            _b = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(1000, tickSpacing, 18, 10, true)];
                        case 2:
                            _b.apply(void 0, [_d.sent()]).to.eq('90484000');
                            _c = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(1000, tickSpacing, 10, 18, true)];
                        case 3:
                            _c.apply(void 0, [_d.sent()]).to.eq('0.0000000090484');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns MIN for highest tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                var tickSpacing, lowestTick, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH];
                            lowestTick = (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH]);
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(lowestTick, tickSpacing, 18, 18, true)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq('MAX');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns MAX for lowest tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                var tickSpacing, highestTick, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH];
                            highestTick = (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.HIGH]);
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.tickToDecimalString(highestTick, tickSpacing, 18, 18, true)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq('MIN');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('#fixedPointToDecimalString', function () {
        describe('returns the correct string for', function () {
            it('the highest possible price', function () { return __awaiter(void 0, void 0, void 0, function () {
                var ratio, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(33849, 1 / Math.pow(10, 34));
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq('338490000000000000000000000000000000000');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('large numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
                var ratio, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(25811, 1 / Math.pow(10, 11));
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)];
                        case 1:
                            _a.apply(void 0, [_c.sent()]).to.eq('2581100000000000');
                            ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(17662, 1 / Math.pow(10, 5));
                            _b = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)];
                        case 2:
                            _b.apply(void 0, [_c.sent()]).to.eq('1766200000');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('exactly 5 sigfig whole number', function () { return __awaiter(void 0, void 0, void 0, function () {
                var ratio, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(42026, 1);
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq('42026');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('when the decimal is at index 4', function () { return __awaiter(void 0, void 0, void 0, function () {
                var ratio, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(12087, 10);
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq('1208.7');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('when the decimal is at index 3', function () { return __awaiter(void 0, void 0, void 0, function () {
                var ratio, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(12087, 100);
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq('120.87');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('when the decimal is at index 2', function () { return __awaiter(void 0, void 0, void 0, function () {
                var ratio, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(12087, 1000);
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq('12.087');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('when the decimal is at index 1', function () { return __awaiter(void 0, void 0, void 0, function () {
                var ratio, bla, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(12345, 10000);
                            return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)];
                        case 1:
                            bla = _b.sent();
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).to.eq('1.2345');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('when sigfigs have trailing 0s after the decimal', function () { return __awaiter(void 0, void 0, void 0, function () {
                var ratio, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1);
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq('1.0000');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('when there are exactly 5 numbers after the decimal', function () { return __awaiter(void 0, void 0, void 0, function () {
                var ratio, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(12345, 100000);
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq('0.12345');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('very small numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
                var ratio, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(38741, Math.pow(10, 20));
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)];
                        case 1:
                            _a.apply(void 0, [_c.sent()]).to.eq('0.00000000000000038741');
                            ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(88498, Math.pow(10, 35));
                            _b = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)];
                        case 2:
                            _b.apply(void 0, [_c.sent()]).to.eq('0.00000000000000000000000000000088498');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('smallest number', function () { return __awaiter(void 0, void 0, void 0, function () {
                var ratio, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            ratio = (0, encodePriceSqrt_1.encodePriceSqrt)(39000, Math.pow(10, 43));
                            _a = expect_1.expect;
                            return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString(ratio, 18, 18)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq('0.0000000000000000000000000000000000000029387');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when tokens have different decimal precision', function () {
            describe('when baseToken has more precision decimals than quoteToken', function () {
                it('returns the correct string when the decimal difference is even', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = expect_1.expect;
                                return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString((0, encodePriceSqrt_1.encodePriceSqrt)(1, 1), 18, 16)];
                            case 1:
                                _a.apply(void 0, [_b.sent()]).to.eq('100.00');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('returns the correct string when the decimal difference is odd', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tenRatio, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                tenRatio = (0, encodePriceSqrt_1.encodePriceSqrt)(10, 1);
                                _a = expect_1.expect;
                                return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString(tenRatio, 18, 17)];
                            case 1:
                                _a.apply(void 0, [_b.sent()]).to.eq('100.00');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('does not account for higher token0 precision if difference is more than 18', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = expect_1.expect;
                                return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString((0, encodePriceSqrt_1.encodePriceSqrt)(1, 1), 24, 5)];
                            case 1:
                                _a.apply(void 0, [_b.sent()]).to.eq('1.0000');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('when quoteToken has more precision decimals than baseToken', function () {
                it('returns the correct string when the decimal difference is even', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = expect_1.expect;
                                return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString((0, encodePriceSqrt_1.encodePriceSqrt)(1, 1), 10, 18)];
                            case 1:
                                _a.apply(void 0, [_b.sent()]).to.eq('0.000000010000');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('returns the correct string when the decimal difference is odd', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = expect_1.expect;
                                return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString((0, encodePriceSqrt_1.encodePriceSqrt)(1, 1), 7, 18)];
                            case 1:
                                _a.apply(void 0, [_b.sent()]).to.eq('0.000000000010000');
                                return [2 /*return*/];
                        }
                    });
                }); });
                // TODO: provide compatibility token prices that breach minimum price due to token decimal differences
                it.skip('returns the correct string when the decimal difference brings ratio below the minimum', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var lowRatio, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                lowRatio = (0, encodePriceSqrt_1.encodePriceSqrt)(88498, Math.pow(10, 35));
                                _a = expect_1.expect;
                                return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString(lowRatio, 10, 20)];
                            case 1:
                                _a.apply(void 0, [_b.sent()]).to.eq('0.000000000000000000000000000000000000000088498');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('does not account for higher token1 precision if difference is more than 18', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = expect_1.expect;
                                return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString((0, encodePriceSqrt_1.encodePriceSqrt)(1, 1), 24, 5)];
                            case 1:
                                _a.apply(void 0, [_b.sent()]).to.eq('1.0000');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            it('some fuzz', function () { return __awaiter(void 0, void 0, void 0, function () {
                var random, inputs, i, ratio, decimals0, decimals1, decimalDiff, _a, _b, _c, _i, i_1, ratio, decimals0, decimals1, result;
                var _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            random = function (min, max) {
                                return Math.floor(min + ((Math.random() * 100) % (max + 1 - min)));
                            };
                            inputs = [];
                            i = 0;
                            while (i <= 20) {
                                ratio = ethers_1.BigNumber.from("0x".concat((0, crypto_1.randomBytes)(random(7, 20)).toString('hex')));
                                decimals0 = random(3, 21);
                                decimals1 = random(3, 21);
                                decimalDiff = Math.abs(decimals0 - decimals1);
                                // TODO: Address edgecase out of bounds prices due to decimal differences
                                if (ratio.div(TEN.pow(decimalDiff)).gt(LOWEST_SQRT_RATIO) &&
                                    ratio.mul(TEN.pow(decimalDiff)).lt(HIGHEST_SQRT_RATIO)) {
                                    inputs.push([ratio, decimals0, decimals1]);
                                    i++;
                                }
                            }
                            _a = inputs;
                            _b = [];
                            for (_c in _a)
                                _b.push(_c);
                            _i = 0;
                            _e.label = 1;
                        case 1:
                            if (!(_i < _b.length)) return [3 /*break*/, 4];
                            _c = _b[_i];
                            if (!(_c in _a)) return [3 /*break*/, 3];
                            i_1 = _c;
                            ratio = void 0;
                            decimals0 = void 0;
                            decimals1 = void 0;
                            _d = inputs[i_1], ratio = _d[0], decimals0 = _d[1], decimals1 = _d[2];
                            return [4 /*yield*/, nftDescriptor.fixedPointToDecimalString(ratio, decimals0, decimals1)];
                        case 2:
                            result = _e.sent();
                            (0, expect_1.expect)((0, formatSqrtRatioX96_1.formatSqrtRatioX96)(ratio, decimals0, decimals1)).to.eq(result);
                            _e.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            }); }).timeout(300000);
        });
    });
    describe('#feeToPercentString', function () {
        it('returns the correct fee for 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.feeToPercentString(0)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('0%');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct fee for 1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.feeToPercentString(1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('0.0001%');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct fee for 30', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.feeToPercentString(30)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('0.003%');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct fee for 33', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.feeToPercentString(33)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('0.0033%');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct fee for 500', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.feeToPercentString(500)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('0.05%');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct fee for 2500', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.feeToPercentString(2500)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('0.25%');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct fee for 3000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.feeToPercentString(3000)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('0.3%');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct fee for 10000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.feeToPercentString(10000)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('1%');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct fee for 17000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.feeToPercentString(17000)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('1.7%');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct fee for 100000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.feeToPercentString(100000)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('10%');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct fee for 150000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.feeToPercentString(150000)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('15%');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct fee for 102000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.feeToPercentString(102000)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('10.2%');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct fee for 10000000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.feeToPercentString(1000000)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('100%');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct fee for 1005000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.feeToPercentString(1005000)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('100.5%');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct fee for 10000000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.feeToPercentString(10000000)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('1000%');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct fee for 12300000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.feeToPercentString(12300000)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('1230%');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#tokenToColorHex', function () {
        function tokenToColorHex(tokenAddress, startIndex) {
            return "".concat(tokenAddress.slice(startIndex, startIndex + 6).toLowerCase());
        }
        it('returns the correct hash for the first 3 bytes of the token address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.tokenToColorHex(tokens[0].address, 136)];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).to.eq(tokenToColorHex(tokens[0].address, 2));
                        _b = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.tokenToColorHex(tokens[1].address, 136)];
                    case 2:
                        _b.apply(void 0, [_c.sent()]).to.eq(tokenToColorHex(tokens[1].address, 2));
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct hash for the last 3 bytes of the address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.tokenToColorHex(tokens[0].address, 0)];
                    case 1:
                        _a.apply(void 0, [_c.sent()]).to.eq(tokenToColorHex(tokens[0].address, 36));
                        _b = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.tokenToColorHex(tokens[1].address, 0)];
                    case 2:
                        _b.apply(void 0, [_c.sent()]).to.eq(tokenToColorHex(tokens[1].address, 36));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#rangeLocation', function () {
        it('returns the correct coordinates when range midpoint under -125_000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var coords;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nftDescriptor.rangeLocation(-887272, -887100)];
                    case 1:
                        coords = _a.sent();
                        (0, expect_1.expect)(coords[0]).to.eq('8');
                        (0, expect_1.expect)(coords[1]).to.eq('7');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct coordinates when range midpoint is between -125_000 and -75_000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var coords;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nftDescriptor.rangeLocation(-100000, -90000)];
                    case 1:
                        coords = _a.sent();
                        (0, expect_1.expect)(coords[0]).to.eq('8');
                        (0, expect_1.expect)(coords[1]).to.eq('10.5');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct coordinates when range midpoint is between -75_000 and -25_000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var coords;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nftDescriptor.rangeLocation(-50000, -20000)];
                    case 1:
                        coords = _a.sent();
                        (0, expect_1.expect)(coords[0]).to.eq('8');
                        (0, expect_1.expect)(coords[1]).to.eq('14.25');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct coordinates when range midpoint is between -25_000 and -5_000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var coords;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nftDescriptor.rangeLocation(-10000, -5000)];
                    case 1:
                        coords = _a.sent();
                        (0, expect_1.expect)(coords[0]).to.eq('10');
                        (0, expect_1.expect)(coords[1]).to.eq('18');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct coordinates when range midpoint is between -5_000 and 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var coords;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nftDescriptor.rangeLocation(-5000, -4000)];
                    case 1:
                        coords = _a.sent();
                        (0, expect_1.expect)(coords[0]).to.eq('11');
                        (0, expect_1.expect)(coords[1]).to.eq('21');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct coordinates when range midpoint is between 0 and 5_000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var coords;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nftDescriptor.rangeLocation(4000, 5000)];
                    case 1:
                        coords = _a.sent();
                        (0, expect_1.expect)(coords[0]).to.eq('13');
                        (0, expect_1.expect)(coords[1]).to.eq('23');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct coordinates when range midpoint is between 5_000 and 25_000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var coords;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nftDescriptor.rangeLocation(10000, 15000)];
                    case 1:
                        coords = _a.sent();
                        (0, expect_1.expect)(coords[0]).to.eq('15');
                        (0, expect_1.expect)(coords[1]).to.eq('25');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct coordinates when range midpoint is between 25_000 and 75_000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var coords;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nftDescriptor.rangeLocation(25000, 50000)];
                    case 1:
                        coords = _a.sent();
                        (0, expect_1.expect)(coords[0]).to.eq('18');
                        (0, expect_1.expect)(coords[1]).to.eq('26');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct coordinates when range midpoint is between 75_000 and 125_000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var coords;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nftDescriptor.rangeLocation(100000, 125000)];
                    case 1:
                        coords = _a.sent();
                        (0, expect_1.expect)(coords[0]).to.eq('21');
                        (0, expect_1.expect)(coords[1]).to.eq('27');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the correct coordinates when range midpoint is above 125_000', function () { return __awaiter(void 0, void 0, void 0, function () {
            var coords;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nftDescriptor.rangeLocation(200000, 100000)];
                    case 1:
                        coords = _a.sent();
                        (0, expect_1.expect)(coords[0]).to.eq('24');
                        (0, expect_1.expect)(coords[1]).to.eq('27');
                        return [2 /*return*/];
                }
            });
        }); });
        it('math does not overflow on max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var coords;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nftDescriptor.rangeLocation(887272, 887272)];
                    case 1:
                        coords = _a.sent();
                        (0, expect_1.expect)(coords[0]).to.eq('24');
                        (0, expect_1.expect)(coords[1]).to.eq('27');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#svgImage', function () {
        var tokenId;
        var baseTokenAddress;
        var quoteTokenAddress;
        var baseTokenSymbol;
        var quoteTokenSymbol;
        var baseTokenDecimals;
        var quoteTokenDecimals;
        var flipRatio;
        var tickLower;
        var tickUpper;
        var tickCurrent;
        var tickSpacing;
        var fee;
        var poolAddress;
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenId = 123;
                        quoteTokenAddress = '0x1234567890123456789123456789012345678901';
                        baseTokenAddress = '0xabcdeabcdefabcdefabcdefabcdefabcdefabcdf';
                        quoteTokenSymbol = 'UNI';
                        baseTokenSymbol = 'WETH';
                        tickLower = -1000;
                        tickUpper = 2000;
                        tickCurrent = 40;
                        fee = 500;
                        return [4 /*yield*/, tokens[0].decimals()];
                    case 1:
                        baseTokenDecimals = _a.sent();
                        return [4 /*yield*/, tokens[1].decimals()];
                    case 2:
                        quoteTokenDecimals = _a.sent();
                        flipRatio = false;
                        tickSpacing = constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM];
                        poolAddress = "0x".concat('b'.repeat(40));
                        return [2 /*return*/];
                }
            });
        }); });
        it('matches the current snapshot', function () { return __awaiter(void 0, void 0, void 0, function () {
            var svg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nftDescriptor.generateSVGImage({
                            tokenId: tokenId,
                            baseTokenAddress: baseTokenAddress,
                            quoteTokenAddress: quoteTokenAddress,
                            baseTokenSymbol: baseTokenSymbol,
                            quoteTokenSymbol: quoteTokenSymbol,
                            baseTokenDecimals: baseTokenDecimals,
                            quoteTokenDecimals: quoteTokenDecimals,
                            flipRatio: flipRatio,
                            tickLower: tickLower,
                            tickUpper: tickUpper,
                            tickCurrent: tickCurrent,
                            tickSpacing: tickSpacing,
                            fee: fee,
                            poolAddress: poolAddress,
                        })];
                    case 1:
                        svg = _a.sent();
                        (0, expect_1.expect)(svg).toMatchSnapshot();
                        fs_1.default.writeFileSync('./test/__snapshots__/NFTDescriptor.svg', svg);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns a valid SVG', function () { return __awaiter(void 0, void 0, void 0, function () {
            var svg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nftDescriptor.generateSVGImage({
                            tokenId: tokenId,
                            baseTokenAddress: baseTokenAddress,
                            quoteTokenAddress: quoteTokenAddress,
                            baseTokenSymbol: baseTokenSymbol,
                            quoteTokenSymbol: quoteTokenSymbol,
                            baseTokenDecimals: baseTokenDecimals,
                            quoteTokenDecimals: quoteTokenDecimals,
                            flipRatio: flipRatio,
                            tickLower: tickLower,
                            tickUpper: tickUpper,
                            tickCurrent: tickCurrent,
                            tickSpacing: tickSpacing,
                            fee: fee,
                            poolAddress: poolAddress,
                        })];
                    case 1:
                        svg = _a.sent();
                        (0, expect_1.expect)((0, is_svg_1.default)(svg)).to.eq(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#isRare', function () {
        it('returns true sometimes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.isRare(1, "0x".concat('b'.repeat(40)))];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns false sometimes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftDescriptor.isRare(2, "0x".concat('b'.repeat(40)))];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    function constructTokenMetadata(tokenId, quoteTokenAddress, baseTokenAddress, poolAddress, quoteTokenSymbol, baseTokenSymbol, flipRatio, tickLower, tickUpper, tickCurrent, feeTier, prices) {
        quoteTokenSymbol = quoteTokenSymbol.replace(/"/gi, '"');
        baseTokenSymbol = baseTokenSymbol.replace(/"/gi, '"');
        return {
            name: "Uniswap - ".concat(feeTier, " - ").concat(quoteTokenSymbol, "/").concat(baseTokenSymbol, " - ").concat(prices),
            description: "This NFT represents a liquidity position in a Uniswap V3 ".concat(quoteTokenSymbol, "-").concat(baseTokenSymbol, " pool. The owner of this NFT can modify or redeem the position.\n\nPool Address: ").concat(poolAddress, "\n").concat(quoteTokenSymbol, " Address: ").concat(quoteTokenAddress.toLowerCase(), "\n").concat(baseTokenSymbol, " Address: ").concat(baseTokenAddress.toLowerCase(), "\nFee Tier: ").concat(feeTier, "\nToken ID: ").concat(tokenId, "\n\n\u26A0\uFE0F DISCLAIMER: Due diligence is imperative when assessing this NFT. Make sure token addresses match the expected tokens, as token symbols may be imitated."),
        };
    }
});
