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
var hardhat_1 = require("hardhat");
var expect_1 = require("./shared/expect");
var completeFixture_1 = require("./shared/completeFixture");
var encodePriceSqrt_1 = require("./shared/encodePriceSqrt");
var constants_1 = require("./shared/constants");
var ticks_1 = require("./shared/ticks");
var tokenSort_1 = require("./shared/tokenSort");
var extractJSONFromURI_1 = require("./shared/extractJSONFromURI");
var DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
var USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
var USDT = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
var TBTC = '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa';
var WBTC = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';
describe('NonfungibleTokenPositionDescriptor', function () {
    var wallets;
    var nftPositionDescriptorCompleteFixture = function (wallets, provider) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, factory, nft, router, nftDescriptor, tokenFactory, tokens, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, completeFixture_1.default)(wallets, provider)];
                case 1:
                    _a = _c.sent(), factory = _a.factory, nft = _a.nft, router = _a.router, nftDescriptor = _a.nftDescriptor;
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TestERC20')];
                case 2:
                    tokenFactory = _c.sent();
                    return [4 /*yield*/, tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))];
                case 3:
                    _b = [
                        (_c.sent())
                    ];
                    return [4 /*yield*/, tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))];
                case 4:
                    _b = _b.concat([
                        (_c.sent())
                    ]);
                    return [4 /*yield*/, tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))];
                case 5:
                    tokens = _b.concat([
                        (_c.sent())
                    ]);
                    tokens.sort(function (a, b) { return (a.address.toLowerCase() < b.address.toLowerCase() ? -1 : 1); });
                    return [2 /*return*/, {
                            nftPositionDescriptor: nftDescriptor,
                            tokens: tokens,
                            nft: nft,
                        }];
            }
        });
    }); };
    var nftPositionDescriptor;
    var tokens;
    var nft;
    var weth9;
    var loadFixture;
    before('create fixture loader', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    wallets = _a.sent();
                    loadFixture = hardhat_1.waffle.createFixtureLoader(wallets);
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach('load fixture', function () { return __awaiter(void 0, void 0, void 0, function () {
        var tokenFactory, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    ;
                    return [4 /*yield*/, loadFixture(nftPositionDescriptorCompleteFixture)];
                case 1:
                    (_c = _d.sent(), tokens = _c.tokens, nft = _c.nft, nftPositionDescriptor = _c.nftPositionDescriptor);
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TestERC20')];
                case 2:
                    tokenFactory = _d.sent();
                    _b = (_a = tokenFactory).attach;
                    return [4 /*yield*/, nftPositionDescriptor.WETH9()];
                case 3:
                    weth9 = _b.apply(_a, [_d.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#tokenRatioPriority', function () {
        it('returns -100 for WETH9', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftPositionDescriptor.tokenRatioPriority(weth9.address, 1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(-100);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns 200 for USDC', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftPositionDescriptor.tokenRatioPriority(USDC, 1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(300);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns 100 for DAI', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftPositionDescriptor.tokenRatioPriority(DAI, 1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(100);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns  150 for USDT', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftPositionDescriptor.tokenRatioPriority(USDT, 1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(200);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns -200 for TBTC', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftPositionDescriptor.tokenRatioPriority(TBTC, 1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(-200);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns -250 for WBTC', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftPositionDescriptor.tokenRatioPriority(WBTC, 1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(-300);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns 0 for any non-ratioPriority token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftPositionDescriptor.tokenRatioPriority(tokens[0].address, 1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#flipRatio', function () {
        it('returns false if neither token has priority ordering', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftPositionDescriptor.flipRatio(tokens[0].address, tokens[2].address, 1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns true if both tokens are numerators but token0 has a higher priority ordering', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftPositionDescriptor.flipRatio(USDC, DAI, 1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns true if both tokens are denominators but token1 has lower priority ordering', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftPositionDescriptor.flipRatio(weth9.address, WBTC, 1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns true if token0 is a numerator and token1 is a denominator', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftPositionDescriptor.flipRatio(DAI, WBTC, 1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns false if token1 is a numerator and token0 is a denominator', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, nftPositionDescriptor.flipRatio(WBTC, DAI, 1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#tokenURI', function () {
        it('displays ETH as token symbol for WETH token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0, token1, metadata, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = (0, tokenSort_1.sortedTokens)(weth9, tokens[1]), token0 = _a[0], token1 = _a[1];
                        return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, weth9.approve(nft.address, 100)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, tokens[1].approve(nft.address, 100)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, nft.mint({
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
                            })];
                    case 4:
                        _c.sent();
                        _b = extractJSONFromURI_1.extractJSONFromURI;
                        return [4 /*yield*/, nft.tokenURI(1)];
                    case 5:
                        metadata = _b.apply(void 0, [_c.sent()]);
                        (0, expect_1.expect)(metadata.name).to.match(/(\sETH\/TEST|TEST\/ETH)/);
                        (0, expect_1.expect)(metadata.description).to.match(/(TEST-ETH|\sETH-TEST)/);
                        (0, expect_1.expect)(metadata.description).to.match(/(\nETH\sAddress)/);
                        return [2 /*return*/];
                }
            });
        }); });
        it('displays returned token symbols when neither token is WETH ', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0, token1, metadata, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = (0, tokenSort_1.sortedTokens)(tokens[2], tokens[1]), token0 = _a[0], token1 = _a[1];
                        return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, tokens[1].approve(nft.address, 100)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, tokens[2].approve(nft.address, 100)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, nft.mint({
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
                            })];
                    case 4:
                        _c.sent();
                        _b = extractJSONFromURI_1.extractJSONFromURI;
                        return [4 /*yield*/, nft.tokenURI(1)];
                    case 5:
                        metadata = _b.apply(void 0, [_c.sent()]);
                        (0, expect_1.expect)(metadata.name).to.match(/TEST\/TEST/);
                        (0, expect_1.expect)(metadata.description).to.match(/TEST-TEST/);
                        return [2 /*return*/];
                }
            });
        }); });
        it('can render a different label for native currencies', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0, token1, nftDescriptorLibraryFactory, nftDescriptorLibrary, positionDescriptorFactory, nftDescriptor, metadata, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = (0, tokenSort_1.sortedTokens)(weth9, tokens[1]), token0 = _a[0], token1 = _a[1];
                        return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, weth9.approve(nft.address, 100)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, tokens[1].approve(nft.address, 100)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, nft.mint({
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
                            })];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, hardhat_1.ethers.getContractFactory('NFTDescriptor')];
                    case 5:
                        nftDescriptorLibraryFactory = _c.sent();
                        return [4 /*yield*/, nftDescriptorLibraryFactory.deploy()];
                    case 6:
                        nftDescriptorLibrary = _c.sent();
                        return [4 /*yield*/, hardhat_1.ethers.getContractFactory('NonfungibleTokenPositionDescriptor', {
                                libraries: {
                                    NFTDescriptor: nftDescriptorLibrary.address,
                                },
                            })];
                    case 7:
                        positionDescriptorFactory = _c.sent();
                        return [4 /*yield*/, positionDescriptorFactory.deploy(weth9.address, 
                            // 'FUNNYMONEY' as a bytes32 string
                            '0x46554e4e594d4f4e455900000000000000000000000000000000000000000000')];
                    case 8:
                        nftDescriptor = (_c.sent());
                        _b = extractJSONFromURI_1.extractJSONFromURI;
                        return [4 /*yield*/, nftDescriptor.tokenURI(nft.address, 1)];
                    case 9:
                        metadata = _b.apply(void 0, [_c.sent()]);
                        (0, expect_1.expect)(metadata.name).to.match(/(\sFUNNYMONEY\/TEST|TEST\/FUNNYMONEY)/);
                        (0, expect_1.expect)(metadata.description).to.match(/(TEST-FUNNYMONEY|\sFUNNYMONEY-TEST)/);
                        (0, expect_1.expect)(metadata.description).to.match(/(\nFUNNYMONEY\sAddress)/);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
