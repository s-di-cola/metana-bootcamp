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
var completeFixture_1 = require("./shared/completeFixture");
var constants_1 = require("./shared/constants");
var encodePriceSqrt_1 = require("./shared/encodePriceSqrt");
var expect_1 = require("./shared/expect");
var ticks_1 = require("./shared/ticks");
var computePoolAddress_1 = require("./shared/computePoolAddress");
var snapshotGasCost_1 = require("./shared/snapshotGasCost");
describe('TickLens', function () {
    var wallets;
    var nftFixture = function (wallets, provider) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, factory, tokens, nft, _i, tokens_1, token;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, completeFixture_1.default)(wallets, provider)];
                case 1:
                    _a = _b.sent(), factory = _a.factory, tokens = _a.tokens, nft = _a.nft;
                    _i = 0, tokens_1 = tokens;
                    _b.label = 2;
                case 2:
                    if (!(_i < tokens_1.length)) return [3 /*break*/, 5];
                    token = tokens_1[_i];
                    return [4 /*yield*/, token.approve(nft.address, ethers_1.constants.MaxUint256)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, {
                        factory: factory,
                        nft: nft,
                        tokens: tokens,
                    }];
            }
        });
    }); };
    var factory;
    var nft;
    var tokens;
    var poolAddress;
    var tickLens;
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
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ;
                    return [4 /*yield*/, loadFixture(nftFixture)];
                case 1:
                    (_a = _b.sent(), factory = _a.factory, tokens = _a.tokens, nft = _a.nft);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#getPopulatedTicksInWord', function () {
        var fullRangeLiquidity = 1000000;
        function createPool(tokenAddressA, tokenAddressB) {
            return __awaiter(this, void 0, void 0, function () {
                var liquidityParams;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (tokenAddressA.toLowerCase() > tokenAddressB.toLowerCase())
                                _a = [tokenAddressB, tokenAddressA], tokenAddressA = _a[0], tokenAddressB = _a[1];
                            return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokenAddressA, tokenAddressB, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                        case 1:
                            _b.sent();
                            liquidityParams = {
                                token0: tokenAddressA,
                                token1: tokenAddressB,
                                fee: constants_1.FeeAmount.MEDIUM,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                recipient: wallets[0].address,
                                amount0Desired: 1000000,
                                amount1Desired: 1000000,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 1,
                            };
                            return [2 /*return*/, nft.mint(liquidityParams)];
                    }
                });
            });
        }
        function mint(tickLower, tickUpper, amountBothDesired) {
            return __awaiter(this, void 0, void 0, function () {
                var mintParams, liquidity;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mintParams = {
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                fee: constants_1.FeeAmount.MEDIUM,
                                tickLower: tickLower,
                                tickUpper: tickUpper,
                                amount0Desired: amountBothDesired,
                                amount1Desired: amountBothDesired,
                                amount0Min: 0,
                                amount1Min: 0,
                                recipient: wallets[0].address,
                                deadline: 1,
                            };
                            return [4 /*yield*/, nft.callStatic.mint(mintParams)];
                        case 1:
                            liquidity = (_a.sent()).liquidity;
                            return [4 /*yield*/, nft.mint(mintParams)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, liquidity.toNumber()];
                    }
                });
            });
        }
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createPool(tokens[0].address, tokens[1].address)];
                    case 1:
                        _a.sent();
                        poolAddress = (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM);
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            var lensFactory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TickLensTest')];
                    case 1:
                        lensFactory = _a.sent();
                        return [4 /*yield*/, lensFactory.deploy()];
                    case 2:
                        tickLens = (_a.sent());
                        return [2 /*return*/];
                }
            });
        }); });
        function getTickBitmapIndex(tick, tickSpacing) {
            var intermediate = ethers_1.BigNumber.from(tick).div(tickSpacing);
            // see https://docs.soliditylang.org/en/v0.7.6/types.html#shifts
            return intermediate.lt(0) ? intermediate.add(1).div(ethers_1.BigNumber.from(2).pow(8)).sub(1) : intermediate.shr(8);
        }
        it('works for min/max', function () { return __awaiter(void 0, void 0, void 0, function () {
            var min, max;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tickLens.getPopulatedTicksInWord(poolAddress, getTickBitmapIndex((0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]), constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]))];
                    case 1:
                        min = (_a.sent())[0];
                        return [4 /*yield*/, tickLens.getPopulatedTicksInWord(poolAddress, getTickBitmapIndex((0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]), constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]))];
                    case 2:
                        max = (_a.sent())[0];
                        (0, expect_1.expect)(min.tick).to.be.eq((0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
                        (0, expect_1.expect)(min.liquidityNet).to.be.eq(fullRangeLiquidity);
                        (0, expect_1.expect)(min.liquidityGross).to.be.eq(fullRangeLiquidity);
                        (0, expect_1.expect)(max.tick).to.be.eq((0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
                        (0, expect_1.expect)(max.liquidityNet).to.be.eq(fullRangeLiquidity * -1);
                        (0, expect_1.expect)(min.liquidityGross).to.be.eq(fullRangeLiquidity);
                        return [2 /*return*/];
                }
            });
        }); });
        it('works for min/max and -2/-1/0/1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var minus, plus, liquidity0, liquidity1, liquidity2, liquidity3, liquidity4, liquidity5, min, _a, negativeOne, negativeTwo, _b, one, zero, max;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        minus = -constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM];
                        plus = -minus;
                        return [4 /*yield*/, mint(minus * 2, minus, 2)];
                    case 1:
                        liquidity0 = _c.sent();
                        return [4 /*yield*/, mint(minus * 2, 0, 3)];
                    case 2:
                        liquidity1 = _c.sent();
                        return [4 /*yield*/, mint(minus * 2, plus, 5)];
                    case 3:
                        liquidity2 = _c.sent();
                        return [4 /*yield*/, mint(minus, 0, 7)];
                    case 4:
                        liquidity3 = _c.sent();
                        return [4 /*yield*/, mint(minus, plus, 11)];
                    case 5:
                        liquidity4 = _c.sent();
                        return [4 /*yield*/, mint(0, plus, 13)];
                    case 6:
                        liquidity5 = _c.sent();
                        return [4 /*yield*/, tickLens.getPopulatedTicksInWord(poolAddress, getTickBitmapIndex((0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]), constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]))];
                    case 7:
                        min = (_c.sent())[0];
                        return [4 /*yield*/, tickLens.getPopulatedTicksInWord(poolAddress, getTickBitmapIndex(minus, constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]))];
                    case 8:
                        _a = _c.sent(), negativeOne = _a[0], negativeTwo = _a[1];
                        return [4 /*yield*/, tickLens.getPopulatedTicksInWord(poolAddress, getTickBitmapIndex(plus, constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]))];
                    case 9:
                        _b = _c.sent(), one = _b[0], zero = _b[1];
                        return [4 /*yield*/, tickLens.getPopulatedTicksInWord(poolAddress, getTickBitmapIndex((0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]), constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]))];
                    case 10:
                        max = (_c.sent())[0];
                        (0, expect_1.expect)(min.tick).to.be.eq((0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
                        (0, expect_1.expect)(min.liquidityNet).to.be.eq(fullRangeLiquidity);
                        (0, expect_1.expect)(min.liquidityGross).to.be.eq(fullRangeLiquidity);
                        (0, expect_1.expect)(negativeTwo.tick).to.be.eq(minus * 2);
                        (0, expect_1.expect)(negativeTwo.liquidityNet).to.be.eq(liquidity0 + liquidity1 + liquidity2);
                        (0, expect_1.expect)(negativeTwo.liquidityGross).to.be.eq(liquidity0 + liquidity1 + liquidity2);
                        (0, expect_1.expect)(negativeOne.tick).to.be.eq(minus);
                        (0, expect_1.expect)(negativeOne.liquidityNet).to.be.eq(liquidity3 + liquidity4 - liquidity0);
                        (0, expect_1.expect)(negativeOne.liquidityGross).to.be.eq(liquidity3 + liquidity4 + liquidity0);
                        (0, expect_1.expect)(zero.tick).to.be.eq(0);
                        (0, expect_1.expect)(zero.liquidityNet).to.be.eq(liquidity5 - liquidity1 - liquidity3);
                        (0, expect_1.expect)(zero.liquidityGross).to.be.eq(liquidity5 + liquidity1 + liquidity3);
                        (0, expect_1.expect)(one.tick).to.be.eq(plus);
                        (0, expect_1.expect)(one.liquidityNet).to.be.eq(-liquidity2 - liquidity4 - liquidity5);
                        (0, expect_1.expect)(one.liquidityGross).to.be.eq(liquidity2 + liquidity4 + liquidity5);
                        (0, expect_1.expect)(max.tick).to.be.eq((0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
                        (0, expect_1.expect)(max.liquidityNet).to.be.eq(fullRangeLiquidity * -1);
                        (0, expect_1.expect)(max.liquidityGross).to.be.eq(fullRangeLiquidity);
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas for single populated tick', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(tickLens.getGasCostOfGetPopulatedTicksInWord(poolAddress, getTickBitmapIndex((0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]), constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM])))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fully populated ticks', function () { return __awaiter(void 0, void 0, void 0, function () {
            var i, ticks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < 128)) return [3 /*break*/, 4];
                        return [4 /*yield*/, mint(i * constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM], (255 - i) * constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM], 100)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, tickLens.getPopulatedTicksInWord(poolAddress, getTickBitmapIndex(0, constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]))];
                    case 5:
                        ticks = _a.sent();
                        (0, expect_1.expect)(ticks.length).to.be.eq(256);
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(tickLens.getGasCostOfGetPopulatedTicksInWord(poolAddress, getTickBitmapIndex(0, constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM])))];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }).timeout(300000);
    });
});
