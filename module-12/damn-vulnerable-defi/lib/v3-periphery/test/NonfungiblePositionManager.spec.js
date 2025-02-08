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
var IUniswapV3Pool_json_1 = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
var ethers_1 = require("ethers");
var hardhat_1 = require("hardhat");
var completeFixture_1 = require("./shared/completeFixture");
var computePoolAddress_1 = require("./shared/computePoolAddress");
var constants_1 = require("./shared/constants");
var encodePriceSqrt_1 = require("./shared/encodePriceSqrt");
var expandTo18Decimals_1 = require("./shared/expandTo18Decimals");
var expect_1 = require("./shared/expect");
var extractJSONFromURI_1 = require("./shared/extractJSONFromURI");
var getPermitNFTSignature_1 = require("./shared/getPermitNFTSignature");
var path_1 = require("./shared/path");
var poolAtAddress_1 = require("./shared/poolAtAddress");
var snapshotGasCost_1 = require("./shared/snapshotGasCost");
var ticks_1 = require("./shared/ticks");
var tokenSort_1 = require("./shared/tokenSort");
describe('NonfungiblePositionManager', function () {
    var wallets;
    var wallet, other;
    var nftFixture = function (wallets, provider) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, weth9, factory, tokens, nft, router, _i, tokens_1, token;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, completeFixture_1.default)(wallets, provider)
                    // approve & fund wallets
                ];
                case 1:
                    _a = _b.sent(), weth9 = _a.weth9, factory = _a.factory, tokens = _a.tokens, nft = _a.nft, router = _a.router;
                    _i = 0, tokens_1 = tokens;
                    _b.label = 2;
                case 2:
                    if (!(_i < tokens_1.length)) return [3 /*break*/, 7];
                    token = tokens_1[_i];
                    return [4 /*yield*/, token.approve(nft.address, ethers_1.constants.MaxUint256)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, token.connect(other).approve(nft.address, ethers_1.constants.MaxUint256)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, token.transfer(other.address, (0, expandTo18Decimals_1.expandTo18Decimals)(1000000))];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/, {
                        nft: nft,
                        factory: factory,
                        tokens: tokens,
                        weth9: weth9,
                        router: router,
                    }];
            }
        });
    }); };
    var factory;
    var nft;
    var tokens;
    var weth9;
    var router;
    var loadFixture;
    before('create fixture loader', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    wallets = _a.sent();
                    wallet = wallets[0], other = wallets[1];
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
                    (_a = _b.sent(), nft = _a.nft, factory = _a.factory, tokens = _a.tokens, weth9 = _a.weth9, router = _a.router);
                    return [2 /*return*/];
            }
        });
    }); });
    it('bytecode size', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect_1.expect;
                    return [4 /*yield*/, nft.provider.getCode(nft.address)];
                case 1:
                    _a.apply(void 0, [((_b.sent()).length - 2) / 2]).to.matchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#createAndInitializePoolIfNecessary', function () {
        it('creates the pool at the expected address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedAddress, code, codeAfter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedAddress = (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM);
                        return [4 /*yield*/, wallet.provider.getCode(expectedAddress)];
                    case 1:
                        code = _a.sent();
                        (0, expect_1.expect)(code).to.eq('0x');
                        return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, wallet.provider.getCode(expectedAddress)];
                    case 3:
                        codeAfter = _a.sent();
                        (0, expect_1.expect)(codeAfter).to.not.eq('0x');
                        return [2 /*return*/];
                }
            });
        }); });
        it('is payable', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1), { value: 1 })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('works if pool is created but not initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedAddress, code;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedAddress = (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM);
                        return [4 /*yield*/, factory.createPool(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, wallet.provider.getCode(expectedAddress)];
                    case 2:
                        code = _a.sent();
                        (0, expect_1.expect)(code).to.not.eq('0x');
                        return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(2, 1))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('works if pool is created and initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedAddress, pool, code;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedAddress = (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM);
                        return [4 /*yield*/, factory.createPool(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM)];
                    case 1:
                        _a.sent();
                        pool = new hardhat_1.ethers.Contract(expectedAddress, IUniswapV3Pool_json_1.abi, wallet);
                        return [4 /*yield*/, pool.initialize((0, encodePriceSqrt_1.encodePriceSqrt)(3, 1))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, wallet.provider.getCode(expectedAddress)];
                    case 3:
                        code = _a.sent();
                        (0, expect_1.expect)(code).to.not.eq('0x');
                        return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(4, 1))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('could theoretically use eth via multicall', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0, token1, createAndInitializePoolIfNecessaryData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = (0, tokenSort_1.sortedTokens)(weth9, tokens[0]), token0 = _a[0], token1 = _a[1];
                        createAndInitializePoolIfNecessaryData = nft.interface.encodeFunctionData('createAndInitializePoolIfNecessary', [token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1)]);
                        return [4 /*yield*/, nft.multicall([createAndInitializePoolIfNecessaryData], { value: (0, expandTo18Decimals_1.expandTo18Decimals)(1) })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1)))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#mint', function () {
        it('fails if pool does not exist', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(nft.mint({
                            token0: tokens[0].address,
                            token1: tokens[1].address,
                            tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                            tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                            amount0Desired: 100,
                            amount1Desired: 100,
                            amount0Min: 0,
                            amount1Min: 0,
                            recipient: wallet.address,
                            deadline: 1,
                            fee: constants_1.FeeAmount.MEDIUM,
                        })).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if cannot transfer', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tokens[0].approve(nft.address, 0)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                fee: constants_1.FeeAmount.MEDIUM,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                amount0Desired: 100,
                                amount1Desired: 100,
                                amount0Min: 0,
                                amount1Min: 0,
                                recipient: wallet.address,
                                deadline: 1,
                            })).to.be.revertedWith('STF')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('creates a token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b, _c, fee, token0, token1, tickLower, tickUpper, liquidity, tokensOwed0, tokensOwed1, feeGrowthInside0LastX128, feeGrowthInside1LastX128;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                fee: constants_1.FeeAmount.MEDIUM,
                                recipient: other.address,
                                amount0Desired: 15,
                                amount1Desired: 15,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 10,
                            })];
                    case 2:
                        _d.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, nft.balanceOf(other.address)];
                    case 3:
                        _a.apply(void 0, [_d.sent()]).to.eq(1);
                        _b = expect_1.expect;
                        return [4 /*yield*/, nft.tokenOfOwnerByIndex(other.address, 0)];
                    case 4:
                        _b.apply(void 0, [_d.sent()]).to.eq(1);
                        return [4 /*yield*/, nft.positions(1)];
                    case 5:
                        _c = _d.sent(), fee = _c.fee, token0 = _c.token0, token1 = _c.token1, tickLower = _c.tickLower, tickUpper = _c.tickUpper, liquidity = _c.liquidity, tokensOwed0 = _c.tokensOwed0, tokensOwed1 = _c.tokensOwed1, feeGrowthInside0LastX128 = _c.feeGrowthInside0LastX128, feeGrowthInside1LastX128 = _c.feeGrowthInside1LastX128;
                        (0, expect_1.expect)(token0).to.eq(tokens[0].address);
                        (0, expect_1.expect)(token1).to.eq(tokens[1].address);
                        (0, expect_1.expect)(fee).to.eq(constants_1.FeeAmount.MEDIUM);
                        (0, expect_1.expect)(tickLower).to.eq((0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
                        (0, expect_1.expect)(tickUpper).to.eq((0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]));
                        (0, expect_1.expect)(liquidity).to.eq(15);
                        (0, expect_1.expect)(tokensOwed0).to.eq(0);
                        (0, expect_1.expect)(tokensOwed1).to.eq(0);
                        (0, expect_1.expect)(feeGrowthInside0LastX128).to.eq(0);
                        (0, expect_1.expect)(feeGrowthInside1LastX128).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('can use eth via multicall', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0, token1, createAndInitializeData, mintData, refundETHData, balanceBefore, tx, receipt, balanceAfter;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = (0, tokenSort_1.sortedTokens)(weth9, tokens[0]), token0 = _a[0], token1 = _a[1];
                        // remove any approval
                        return [4 /*yield*/, weth9.approve(nft.address, 0)];
                    case 1:
                        // remove any approval
                        _b.sent();
                        createAndInitializeData = nft.interface.encodeFunctionData('createAndInitializePoolIfNecessary', [
                            token0.address,
                            token1.address,
                            constants_1.FeeAmount.MEDIUM,
                            (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1),
                        ]);
                        mintData = nft.interface.encodeFunctionData('mint', [
                            {
                                token0: token0.address,
                                token1: token1.address,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                fee: constants_1.FeeAmount.MEDIUM,
                                recipient: other.address,
                                amount0Desired: 100,
                                amount1Desired: 100,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 1,
                            },
                        ]);
                        refundETHData = nft.interface.encodeFunctionData('refundETH');
                        return [4 /*yield*/, wallet.getBalance()];
                    case 2:
                        balanceBefore = _b.sent();
                        return [4 /*yield*/, nft.multicall([createAndInitializeData, mintData, refundETHData], {
                                value: (0, expandTo18Decimals_1.expandTo18Decimals)(1),
                            })];
                    case 3:
                        tx = _b.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 4:
                        receipt = _b.sent();
                        return [4 /*yield*/, wallet.getBalance()];
                    case 5:
                        balanceAfter = _b.sent();
                        (0, expect_1.expect)(balanceBefore).to.eq(balanceAfter.add(receipt.gasUsed.mul(tx.gasPrice || 0)).add(100));
                        return [2 /*return*/];
                }
            });
        }); });
        it('emits an event');
        it('gas first mint for pool', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                fee: constants_1.FeeAmount.MEDIUM,
                                recipient: wallet.address,
                                amount0Desired: 100,
                                amount1Desired: 100,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 10,
                            }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas first mint for pool using eth with zero refund', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0, token1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = (0, tokenSort_1.sortedTokens)(weth9, tokens[0]), token0 = _a[0], token1 = _a[1];
                        return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(nft.multicall([
                                nft.interface.encodeFunctionData('mint', [
                                    {
                                        token0: token0.address,
                                        token1: token1.address,
                                        tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                        tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                        fee: constants_1.FeeAmount.MEDIUM,
                                        recipient: wallet.address,
                                        amount0Desired: 100,
                                        amount1Desired: 100,
                                        amount0Min: 0,
                                        amount1Min: 0,
                                        deadline: 10,
                                    },
                                ]),
                                nft.interface.encodeFunctionData('refundETH'),
                            ], { value: 100 }))];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas first mint for pool using eth with non-zero refund', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0, token1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = (0, tokenSort_1.sortedTokens)(weth9, tokens[0]), token0 = _a[0], token1 = _a[1];
                        return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(nft.multicall([
                                nft.interface.encodeFunctionData('mint', [
                                    {
                                        token0: token0.address,
                                        token1: token1.address,
                                        tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                        tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                        fee: constants_1.FeeAmount.MEDIUM,
                                        recipient: wallet.address,
                                        amount0Desired: 100,
                                        amount1Desired: 100,
                                        amount0Min: 0,
                                        amount1Min: 0,
                                        deadline: 10,
                                    },
                                ]),
                                nft.interface.encodeFunctionData('refundETH'),
                            ], { value: 1000 }))];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas mint on same ticks', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                fee: constants_1.FeeAmount.MEDIUM,
                                recipient: other.address,
                                amount0Desired: 100,
                                amount1Desired: 100,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 10,
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                fee: constants_1.FeeAmount.MEDIUM,
                                recipient: wallet.address,
                                amount0Desired: 100,
                                amount1Desired: 100,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 10,
                            }))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas mint for same pool, different ticks', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                fee: constants_1.FeeAmount.MEDIUM,
                                recipient: other.address,
                                amount0Desired: 100,
                                amount1Desired: 100,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 10,
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]) + constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM],
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]) - constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM],
                                fee: constants_1.FeeAmount.MEDIUM,
                                recipient: wallet.address,
                                amount0Desired: 100,
                                amount1Desired: 100,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 10,
                            }))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#increaseLiquidity', function () {
        var tokenId = 1;
        beforeEach('create a position', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                fee: constants_1.FeeAmount.MEDIUM,
                                recipient: other.address,
                                amount0Desired: 1000,
                                amount1Desired: 1000,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 1,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('increases position liquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
            var liquidity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.increaseLiquidity({
                            tokenId: tokenId,
                            amount0Desired: 100,
                            amount1Desired: 100,
                            amount0Min: 0,
                            amount1Min: 0,
                            deadline: 1,
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, nft.positions(tokenId)];
                    case 2:
                        liquidity = (_a.sent()).liquidity;
                        (0, expect_1.expect)(liquidity).to.eq(1100);
                        return [2 /*return*/];
                }
            });
        }); });
        it('emits an event');
        it('can be paid with ETH', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0, token1, tokenId, mintData, refundETHData, increaseLiquidityData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = (0, tokenSort_1.sortedTokens)(tokens[0], weth9), token0 = _a[0], token1 = _a[1];
                        tokenId = 1;
                        return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _b.sent();
                        mintData = nft.interface.encodeFunctionData('mint', [
                            {
                                token0: token0.address,
                                token1: token1.address,
                                fee: constants_1.FeeAmount.MEDIUM,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                recipient: other.address,
                                amount0Desired: 100,
                                amount1Desired: 100,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 1,
                            },
                        ]);
                        refundETHData = nft.interface.encodeFunctionData('unwrapWETH9', [0, other.address]);
                        return [4 /*yield*/, nft.multicall([mintData, refundETHData], { value: (0, expandTo18Decimals_1.expandTo18Decimals)(1) })];
                    case 2:
                        _b.sent();
                        increaseLiquidityData = nft.interface.encodeFunctionData('increaseLiquidity', [
                            {
                                tokenId: tokenId,
                                amount0Desired: 100,
                                amount1Desired: 100,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 1,
                            },
                        ]);
                        return [4 /*yield*/, nft.multicall([increaseLiquidityData, refundETHData], { value: (0, expandTo18Decimals_1.expandTo18Decimals)(1) })];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(nft.increaseLiquidity({
                            tokenId: tokenId,
                            amount0Desired: 100,
                            amount1Desired: 100,
                            amount0Min: 0,
                            amount1Min: 0,
                            deadline: 1,
                        }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#decreaseLiquidity', function () {
        var tokenId = 1;
        beforeEach('create a position', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                fee: constants_1.FeeAmount.MEDIUM,
                                recipient: other.address,
                                amount0Desired: 100,
                                amount1Desired: 100,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 1,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('emits an event');
        it('fails if past deadline', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.setTime(2)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(nft.connect(other).decreaseLiquidity({ tokenId: tokenId, liquidity: 50, amount0Min: 0, amount1Min: 0, deadline: 1 })).to.be.revertedWith('Transaction too old')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('cannot be called by other addresses', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(nft.decreaseLiquidity({ tokenId: tokenId, liquidity: 50, amount0Min: 0, amount1Min: 0, deadline: 1 })).to.be.revertedWith('Not approved')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('decreases position liquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
            var liquidity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.connect(other).decreaseLiquidity({ tokenId: tokenId, liquidity: 25, amount0Min: 0, amount1Min: 0, deadline: 1 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, nft.positions(tokenId)];
                    case 2:
                        liquidity = (_a.sent()).liquidity;
                        (0, expect_1.expect)(liquidity).to.eq(75);
                        return [2 /*return*/];
                }
            });
        }); });
        it('is payable', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft
                            .connect(other)
                            .decreaseLiquidity({ tokenId: tokenId, liquidity: 25, amount0Min: 0, amount1Min: 0, deadline: 1 }, { value: 1 })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('accounts for tokens owed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, tokensOwed0, tokensOwed1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, nft.connect(other).decreaseLiquidity({ tokenId: tokenId, liquidity: 25, amount0Min: 0, amount1Min: 0, deadline: 1 })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, nft.positions(tokenId)];
                    case 2:
                        _a = _b.sent(), tokensOwed0 = _a.tokensOwed0, tokensOwed1 = _a.tokensOwed1;
                        (0, expect_1.expect)(tokensOwed0).to.eq(24);
                        (0, expect_1.expect)(tokensOwed1).to.eq(24);
                        return [2 /*return*/];
                }
            });
        }); });
        it('can decrease for all the liquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
            var liquidity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.connect(other).decreaseLiquidity({ tokenId: tokenId, liquidity: 100, amount0Min: 0, amount1Min: 0, deadline: 1 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, nft.positions(tokenId)];
                    case 2:
                        liquidity = (_a.sent()).liquidity;
                        (0, expect_1.expect)(liquidity).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('cannot decrease for more than all the liquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(nft.connect(other).decreaseLiquidity({ tokenId: tokenId, liquidity: 101, amount0Min: 0, amount1Min: 0, deadline: 1 })).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('cannot decrease for more than the liquidity of the nft position', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.mint({
                            token0: tokens[0].address,
                            token1: tokens[1].address,
                            tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                            tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                            fee: constants_1.FeeAmount.MEDIUM,
                            recipient: other.address,
                            amount0Desired: 200,
                            amount1Desired: 200,
                            amount0Min: 0,
                            amount1Min: 0,
                            deadline: 1,
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(nft.connect(other).decreaseLiquidity({ tokenId: tokenId, liquidity: 101, amount0Min: 0, amount1Min: 0, deadline: 1 })).to.be.reverted];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas partial decrease', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(nft.connect(other).decreaseLiquidity({ tokenId: tokenId, liquidity: 50, amount0Min: 0, amount1Min: 0, deadline: 1 }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas complete decrease', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(nft.connect(other).decreaseLiquidity({ tokenId: tokenId, liquidity: 100, amount0Min: 0, amount1Min: 0, deadline: 1 }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#collect', function () {
        var tokenId = 1;
        beforeEach('create a position', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                fee: constants_1.FeeAmount.MEDIUM,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                recipient: other.address,
                                amount0Desired: 100,
                                amount1Desired: 100,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 1,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('emits an event');
        it('cannot be called by other addresses', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(nft.collect({
                            tokenId: tokenId,
                            recipient: wallet.address,
                            amount0Max: constants_1.MaxUint128,
                            amount1Max: constants_1.MaxUint128,
                        })).to.be.revertedWith('Not approved')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('cannot be called with 0 for both amounts', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(nft.connect(other).collect({
                            tokenId: tokenId,
                            recipient: wallet.address,
                            amount0Max: 0,
                            amount1Max: 0,
                        })).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('no op if no tokens are owed', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(nft.connect(other).collect({
                            tokenId: tokenId,
                            recipient: wallet.address,
                            amount0Max: constants_1.MaxUint128,
                            amount1Max: constants_1.MaxUint128,
                        }))
                            .to.not.emit(tokens[0], 'Transfer')
                            .to.not.emit(tokens[1], 'Transfer')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('transfers tokens owed from burn', function () { return __awaiter(void 0, void 0, void 0, function () {
            var poolAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.connect(other).decreaseLiquidity({ tokenId: tokenId, liquidity: 50, amount0Min: 0, amount1Min: 0, deadline: 1 })];
                    case 1:
                        _a.sent();
                        poolAddress = (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM);
                        return [4 /*yield*/, (0, expect_1.expect)(nft.connect(other).collect({
                                tokenId: tokenId,
                                recipient: wallet.address,
                                amount0Max: constants_1.MaxUint128,
                                amount1Max: constants_1.MaxUint128,
                            }))
                                .to.emit(tokens[0], 'Transfer')
                                .withArgs(poolAddress, wallet.address, 49)
                                .to.emit(tokens[1], 'Transfer')
                                .withArgs(poolAddress, wallet.address, 49)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas transfers both', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.connect(other).decreaseLiquidity({ tokenId: tokenId, liquidity: 50, amount0Min: 0, amount1Min: 0, deadline: 1 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(nft.connect(other).collect({
                                tokenId: tokenId,
                                recipient: wallet.address,
                                amount0Max: constants_1.MaxUint128,
                                amount1Max: constants_1.MaxUint128,
                            }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas transfers token0 only', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.connect(other).decreaseLiquidity({ tokenId: tokenId, liquidity: 50, amount0Min: 0, amount1Min: 0, deadline: 1 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(nft.connect(other).collect({
                                tokenId: tokenId,
                                recipient: wallet.address,
                                amount0Max: constants_1.MaxUint128,
                                amount1Max: 0,
                            }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas transfers token1 only', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.connect(other).decreaseLiquidity({ tokenId: tokenId, liquidity: 50, amount0Min: 0, amount1Min: 0, deadline: 1 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(nft.connect(other).collect({
                                tokenId: tokenId,
                                recipient: wallet.address,
                                amount0Max: 0,
                                amount1Max: constants_1.MaxUint128,
                            }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#burn', function () {
        var tokenId = 1;
        beforeEach('create a position', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                fee: constants_1.FeeAmount.MEDIUM,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                recipient: other.address,
                                amount0Desired: 100,
                                amount1Desired: 100,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 1,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('emits an event');
        it('cannot be called by other addresses', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(nft.burn(tokenId)).to.be.revertedWith('Not approved')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('cannot be called while there is still liquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(nft.connect(other).burn(tokenId)).to.be.revertedWith('Not cleared')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('cannot be called while there is still partial liquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.connect(other).decreaseLiquidity({ tokenId: tokenId, liquidity: 50, amount0Min: 0, amount1Min: 0, deadline: 1 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(nft.connect(other).burn(tokenId)).to.be.revertedWith('Not cleared')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('cannot be called while there is still tokens owed', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.connect(other).decreaseLiquidity({ tokenId: tokenId, liquidity: 100, amount0Min: 0, amount1Min: 0, deadline: 1 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(nft.connect(other).burn(tokenId)).to.be.revertedWith('Not cleared')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('deletes the token', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.connect(other).decreaseLiquidity({ tokenId: tokenId, liquidity: 100, amount0Min: 0, amount1Min: 0, deadline: 1 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, nft.connect(other).collect({
                                tokenId: tokenId,
                                recipient: wallet.address,
                                amount0Max: constants_1.MaxUint128,
                                amount1Max: constants_1.MaxUint128,
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, nft.connect(other).burn(tokenId)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(nft.positions(tokenId)).to.be.revertedWith('Invalid token ID')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.connect(other).decreaseLiquidity({ tokenId: tokenId, liquidity: 100, amount0Min: 0, amount1Min: 0, deadline: 1 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, nft.connect(other).collect({
                                tokenId: tokenId,
                                recipient: wallet.address,
                                amount0Max: constants_1.MaxUint128,
                                amount1Max: constants_1.MaxUint128,
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(nft.connect(other).burn(tokenId))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#transferFrom', function () {
        var tokenId = 1;
        beforeEach('create a position', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                fee: constants_1.FeeAmount.MEDIUM,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                recipient: other.address,
                                amount0Desired: 100,
                                amount1Desired: 100,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 1,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('can only be called by authorized or owner', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(nft.transferFrom(other.address, wallet.address, tokenId)).to.be.revertedWith('ERC721: transfer caller is not owner nor approved')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('changes the owner', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, nft.connect(other).transferFrom(other.address, wallet.address, tokenId)];
                    case 1:
                        _b.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, nft.ownerOf(tokenId)];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).to.eq(wallet.address);
                        return [2 /*return*/];
                }
            });
        }); });
        it('removes existing approval', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, nft.connect(other).approve(wallet.address, tokenId)];
                    case 1:
                        _c.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, nft.getApproved(tokenId)];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).to.eq(wallet.address);
                        return [4 /*yield*/, nft.transferFrom(other.address, wallet.address, tokenId)];
                    case 3:
                        _c.sent();
                        _b = expect_1.expect;
                        return [4 /*yield*/, nft.getApproved(tokenId)];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).to.eq(ethers_1.constants.AddressZero);
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(nft.connect(other).transferFrom(other.address, wallet.address, tokenId))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas comes from approved', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.connect(other).approve(wallet.address, tokenId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(nft.transferFrom(other.address, wallet.address, tokenId))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#permit', function () {
        it('emits an event');
        describe('owned by eoa', function () {
            var tokenId = 1;
            beforeEach('create a position', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, nft.mint({
                                    token0: tokens[0].address,
                                    token1: tokens[1].address,
                                    fee: constants_1.FeeAmount.MEDIUM,
                                    tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                    tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                    recipient: other.address,
                                    amount0Desired: 100,
                                    amount1Desired: 100,
                                    amount0Min: 0,
                                    amount1Min: 0,
                                    deadline: 1,
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('changes the operator of the position and increments the nonce', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, v, r, s, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, (0, getPermitNFTSignature_1.default)(other, nft, wallet.address, tokenId, 1)];
                        case 1:
                            _a = _d.sent(), v = _a.v, r = _a.r, s = _a.s;
                            return [4 /*yield*/, nft.permit(wallet.address, tokenId, 1, v, r, s)];
                        case 2:
                            _d.sent();
                            _b = expect_1.expect;
                            return [4 /*yield*/, nft.positions(tokenId)];
                        case 3:
                            _b.apply(void 0, [(_d.sent()).nonce]).to.eq(1);
                            _c = expect_1.expect;
                            return [4 /*yield*/, nft.positions(tokenId)];
                        case 4:
                            _c.apply(void 0, [(_d.sent()).operator]).to.eq(wallet.address);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('cannot be called twice with the same signature', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, v, r, s;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, getPermitNFTSignature_1.default)(other, nft, wallet.address, tokenId, 1)];
                        case 1:
                            _a = _b.sent(), v = _a.v, r = _a.r, s = _a.s;
                            return [4 /*yield*/, nft.permit(wallet.address, tokenId, 1, v, r, s)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, (0, expect_1.expect)(nft.permit(wallet.address, tokenId, 1, v, r, s)).to.be.reverted];
                        case 3:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('fails with invalid signature', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, v, r, s;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, getPermitNFTSignature_1.default)(wallet, nft, wallet.address, tokenId, 1)];
                        case 1:
                            _a = _b.sent(), v = _a.v, r = _a.r, s = _a.s;
                            return [4 /*yield*/, (0, expect_1.expect)(nft.permit(wallet.address, tokenId, 1, v + 3, r, s)).to.be.revertedWith('Invalid signature')];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('fails with signature not from owner', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, v, r, s;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, getPermitNFTSignature_1.default)(wallet, nft, wallet.address, tokenId, 1)];
                        case 1:
                            _a = _b.sent(), v = _a.v, r = _a.r, s = _a.s;
                            return [4 /*yield*/, (0, expect_1.expect)(nft.permit(wallet.address, tokenId, 1, v, r, s)).to.be.revertedWith('Unauthorized')];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('fails with expired signature', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, v, r, s;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, nft.setTime(2)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, (0, getPermitNFTSignature_1.default)(other, nft, wallet.address, tokenId, 1)];
                        case 2:
                            _a = _b.sent(), v = _a.v, r = _a.r, s = _a.s;
                            return [4 /*yield*/, (0, expect_1.expect)(nft.permit(wallet.address, tokenId, 1, v, r, s)).to.be.revertedWith('Permit expired')];
                        case 3:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, v, r, s;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, getPermitNFTSignature_1.default)(other, nft, wallet.address, tokenId, 1)];
                        case 1:
                            _a = _b.sent(), v = _a.v, r = _a.r, s = _a.s;
                            return [4 /*yield*/, (0, snapshotGasCost_1.default)(nft.permit(wallet.address, tokenId, 1, v, r, s))];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('owned by verifying contract', function () {
            var tokenId = 1;
            var testPositionNFTOwner;
            beforeEach('deploy test owner and create a position', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TestPositionNFTOwner')];
                        case 1: return [4 /*yield*/, (_a.sent()).deploy()];
                        case 2:
                            testPositionNFTOwner = (_a.sent());
                            return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, nft.mint({
                                    token0: tokens[0].address,
                                    token1: tokens[1].address,
                                    fee: constants_1.FeeAmount.MEDIUM,
                                    tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                    tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                    recipient: testPositionNFTOwner.address,
                                    amount0Desired: 100,
                                    amount1Desired: 100,
                                    amount0Min: 0,
                                    amount1Min: 0,
                                    deadline: 1,
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('changes the operator of the position and increments the nonce', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, v, r, s, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, (0, getPermitNFTSignature_1.default)(other, nft, wallet.address, tokenId, 1)];
                        case 1:
                            _a = _d.sent(), v = _a.v, r = _a.r, s = _a.s;
                            return [4 /*yield*/, testPositionNFTOwner.setOwner(other.address)];
                        case 2:
                            _d.sent();
                            return [4 /*yield*/, nft.permit(wallet.address, tokenId, 1, v, r, s)];
                        case 3:
                            _d.sent();
                            _b = expect_1.expect;
                            return [4 /*yield*/, nft.positions(tokenId)];
                        case 4:
                            _b.apply(void 0, [(_d.sent()).nonce]).to.eq(1);
                            _c = expect_1.expect;
                            return [4 /*yield*/, nft.positions(tokenId)];
                        case 5:
                            _c.apply(void 0, [(_d.sent()).operator]).to.eq(wallet.address);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('fails if owner contract is owned by different address', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, v, r, s;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, getPermitNFTSignature_1.default)(other, nft, wallet.address, tokenId, 1)];
                        case 1:
                            _a = _b.sent(), v = _a.v, r = _a.r, s = _a.s;
                            return [4 /*yield*/, testPositionNFTOwner.setOwner(wallet.address)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, (0, expect_1.expect)(nft.permit(wallet.address, tokenId, 1, v, r, s)).to.be.revertedWith('Unauthorized')];
                        case 3:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('fails with signature not from owner', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, v, r, s;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, getPermitNFTSignature_1.default)(wallet, nft, wallet.address, tokenId, 1)];
                        case 1:
                            _a = _b.sent(), v = _a.v, r = _a.r, s = _a.s;
                            return [4 /*yield*/, testPositionNFTOwner.setOwner(other.address)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, (0, expect_1.expect)(nft.permit(wallet.address, tokenId, 1, v, r, s)).to.be.revertedWith('Unauthorized')];
                        case 3:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('fails with expired signature', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, v, r, s;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, nft.setTime(2)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, (0, getPermitNFTSignature_1.default)(other, nft, wallet.address, tokenId, 1)];
                        case 2:
                            _a = _b.sent(), v = _a.v, r = _a.r, s = _a.s;
                            return [4 /*yield*/, testPositionNFTOwner.setOwner(other.address)];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, (0, expect_1.expect)(nft.permit(wallet.address, tokenId, 1, v, r, s)).to.be.revertedWith('Permit expired')];
                        case 4:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, v, r, s;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, getPermitNFTSignature_1.default)(other, nft, wallet.address, tokenId, 1)];
                        case 1:
                            _a = _b.sent(), v = _a.v, r = _a.r, s = _a.s;
                            return [4 /*yield*/, testPositionNFTOwner.setOwner(other.address)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, (0, snapshotGasCost_1.default)(nft.permit(wallet.address, tokenId, 1, v, r, s))];
                        case 3:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('multicall exit', function () {
        var tokenId = 1;
        beforeEach('create a position', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                fee: constants_1.FeeAmount.MEDIUM,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                recipient: other.address,
                                amount0Desired: 100,
                                amount1Desired: 100,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 1,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        function exit(_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var decreaseLiquidityData, collectData, burnData;
                var nft = _b.nft, liquidity = _b.liquidity, tokenId = _b.tokenId, amount0Min = _b.amount0Min, amount1Min = _b.amount1Min, recipient = _b.recipient;
                return __generator(this, function (_c) {
                    decreaseLiquidityData = nft.interface.encodeFunctionData('decreaseLiquidity', [
                        { tokenId: tokenId, liquidity: liquidity, amount0Min: amount0Min, amount1Min: amount1Min, deadline: 1 },
                    ]);
                    collectData = nft.interface.encodeFunctionData('collect', [
                        {
                            tokenId: tokenId,
                            recipient: recipient,
                            amount0Max: constants_1.MaxUint128,
                            amount1Max: constants_1.MaxUint128,
                        },
                    ]);
                    burnData = nft.interface.encodeFunctionData('burn', [tokenId]);
                    return [2 /*return*/, nft.multicall([decreaseLiquidityData, collectData, burnData])];
                });
            });
        }
        it('executes all the actions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var pool;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pool = (0, poolAtAddress_1.default)((0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM), wallet);
                        return [4 /*yield*/, (0, expect_1.expect)(exit({
                                nft: nft.connect(other),
                                tokenId: tokenId,
                                liquidity: 100,
                                amount0Min: 0,
                                amount1Min: 0,
                                recipient: wallet.address,
                            }))
                                .to.emit(pool, 'Burn')
                                .to.emit(pool, 'Collect')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(exit({
                            nft: nft.connect(other),
                            tokenId: tokenId,
                            liquidity: 100,
                            amount0Min: 0,
                            amount1Min: 0,
                            recipient: wallet.address,
                        }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#tokenURI', function () { return __awaiter(void 0, void 0, void 0, function () {
        var tokenId;
        return __generator(this, function (_a) {
            tokenId = 1;
            beforeEach('create a position', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, nft.mint({
                                    token0: tokens[0].address,
                                    token1: tokens[1].address,
                                    fee: constants_1.FeeAmount.MEDIUM,
                                    tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                    tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                    recipient: other.address,
                                    amount0Desired: 100,
                                    amount1Desired: 100,
                                    amount0Min: 0,
                                    amount1Min: 0,
                                    deadline: 1,
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('reverts for invalid token id', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, expect_1.expect)(nft.tokenURI(tokenId + 1)).to.be.reverted];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns a data URI with correct mime type', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect_1.expect;
                            return [4 /*yield*/, nft.tokenURI(tokenId)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.match(/data:application\/json;base64,.+/);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('content is valid JSON and structure', function () { return __awaiter(void 0, void 0, void 0, function () {
                var content, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = extractJSONFromURI_1.extractJSONFromURI;
                            return [4 /*yield*/, nft.tokenURI(tokenId)];
                        case 1:
                            content = _a.apply(void 0, [_b.sent()]);
                            (0, expect_1.expect)(content).to.haveOwnProperty('name').is.a('string');
                            (0, expect_1.expect)(content).to.haveOwnProperty('description').is.a('string');
                            (0, expect_1.expect)(content).to.haveOwnProperty('image').is.a('string');
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
    describe('fees accounting', function () {
        beforeEach('create two positions', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))
                        // nft 1 earns 25% of fees
                    ];
                    case 1:
                        _a.sent();
                        // nft 1 earns 25% of fees
                        return [4 /*yield*/, nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                fee: constants_1.FeeAmount.MEDIUM,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.FeeAmount.MEDIUM),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.FeeAmount.MEDIUM),
                                amount0Desired: 100,
                                amount1Desired: 100,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 1,
                                recipient: wallet.address,
                            })
                            // nft 2 earns 75% of fees
                        ];
                    case 2:
                        // nft 1 earns 25% of fees
                        _a.sent();
                        // nft 2 earns 75% of fees
                        return [4 /*yield*/, nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                fee: constants_1.FeeAmount.MEDIUM,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.FeeAmount.MEDIUM),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.FeeAmount.MEDIUM),
                                amount0Desired: 300,
                                amount1Desired: 300,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 1,
                                recipient: wallet.address,
                            })];
                    case 3:
                        // nft 2 earns 75% of fees
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('10k of token0 fees collect', function () {
            beforeEach('swap for ~10k of fees', function () { return __awaiter(void 0, void 0, void 0, function () {
                var swapAmount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            swapAmount = 3333333;
                            return [4 /*yield*/, tokens[0].approve(router.address, swapAmount)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, router.exactInput({
                                    recipient: wallet.address,
                                    deadline: 1,
                                    path: (0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]),
                                    amountIn: swapAmount,
                                    amountOutMinimum: 0,
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('expected amounts', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, nft1Amount0, nft1Amount1, _b, nft2Amount0, nft2Amount1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, nft.callStatic.collect({
                                tokenId: 1,
                                recipient: wallet.address,
                                amount0Max: constants_1.MaxUint128,
                                amount1Max: constants_1.MaxUint128,
                            })];
                        case 1:
                            _a = _c.sent(), nft1Amount0 = _a.amount0, nft1Amount1 = _a.amount1;
                            return [4 /*yield*/, nft.callStatic.collect({
                                    tokenId: 2,
                                    recipient: wallet.address,
                                    amount0Max: constants_1.MaxUint128,
                                    amount1Max: constants_1.MaxUint128,
                                })];
                        case 2:
                            _b = _c.sent(), nft2Amount0 = _b.amount0, nft2Amount1 = _b.amount1;
                            (0, expect_1.expect)(nft1Amount0).to.eq(2501);
                            (0, expect_1.expect)(nft1Amount1).to.eq(0);
                            (0, expect_1.expect)(nft2Amount0).to.eq(7503);
                            (0, expect_1.expect)(nft2Amount1).to.eq(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('actually collected', function () { return __awaiter(void 0, void 0, void 0, function () {
                var poolAddress;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            poolAddress = (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM);
                            return [4 /*yield*/, (0, expect_1.expect)(nft.collect({
                                    tokenId: 1,
                                    recipient: wallet.address,
                                    amount0Max: constants_1.MaxUint128,
                                    amount1Max: constants_1.MaxUint128,
                                }))
                                    .to.emit(tokens[0], 'Transfer')
                                    .withArgs(poolAddress, wallet.address, 2501)
                                    .to.not.emit(tokens[1], 'Transfer')];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, expect_1.expect)(nft.collect({
                                    tokenId: 2,
                                    recipient: wallet.address,
                                    amount0Max: constants_1.MaxUint128,
                                    amount1Max: constants_1.MaxUint128,
                                }))
                                    .to.emit(tokens[0], 'Transfer')
                                    .withArgs(poolAddress, wallet.address, 7503)
                                    .to.not.emit(tokens[1], 'Transfer')];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('#positions', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
                var positionsGasTestFactory, positionsGasTest;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('NonfungiblePositionManagerPositionsGasTest')];
                        case 1:
                            positionsGasTestFactory = _a.sent();
                            return [4 /*yield*/, positionsGasTestFactory.deploy(nft.address)];
                        case 2:
                            positionsGasTest = (_a.sent());
                            return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, nft.mint({
                                    token0: tokens[0].address,
                                    token1: tokens[1].address,
                                    tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                    tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                    fee: constants_1.FeeAmount.MEDIUM,
                                    recipient: other.address,
                                    amount0Desired: 15,
                                    amount1Desired: 15,
                                    amount0Min: 0,
                                    amount1Min: 0,
                                    deadline: 10,
                                })];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, (0, snapshotGasCost_1.default)(positionsGasTest.getGasCostOfPositions(1))];
                        case 5:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
});
