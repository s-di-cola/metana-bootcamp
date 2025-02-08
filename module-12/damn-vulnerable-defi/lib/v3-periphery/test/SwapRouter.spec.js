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
var expandTo18Decimals_1 = require("./shared/expandTo18Decimals");
var expect_1 = require("./shared/expect");
var path_1 = require("./shared/path");
var ticks_1 = require("./shared/ticks");
var computePoolAddress_1 = require("./shared/computePoolAddress");
describe('SwapRouter', function () {
    var _this = this;
    this.timeout(40000);
    var wallet;
    var trader;
    var swapRouterFixture = function (wallets, provider) { return __awaiter(_this, void 0, void 0, function () {
        var _a, weth9, factory, router, tokens, nft, _i, tokens_1, token;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, completeFixture_1.default)(wallets, provider)
                    // approve & fund wallets
                ];
                case 1:
                    _a = _b.sent(), weth9 = _a.weth9, factory = _a.factory, router = _a.router, tokens = _a.tokens, nft = _a.nft;
                    _i = 0, tokens_1 = tokens;
                    _b.label = 2;
                case 2:
                    if (!(_i < tokens_1.length)) return [3 /*break*/, 8];
                    token = tokens_1[_i];
                    return [4 /*yield*/, token.approve(router.address, ethers_1.constants.MaxUint256)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, token.approve(nft.address, ethers_1.constants.MaxUint256)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, token.connect(trader).approve(router.address, ethers_1.constants.MaxUint256)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, token.transfer(trader.address, (0, expandTo18Decimals_1.expandTo18Decimals)(1000000))];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8: return [2 /*return*/, {
                        weth9: weth9,
                        factory: factory,
                        router: router,
                        tokens: tokens,
                        nft: nft,
                    }];
            }
        });
    }); };
    var factory;
    var weth9;
    var router;
    var nft;
    var tokens;
    var getBalances;
    var loadFixture;
    before('create fixture loader', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ;
                    return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    _a = _b.sent(), wallet = _a[0], trader = _a[1];
                    loadFixture = hardhat_1.waffle.createFixtureLoader([wallet, trader]);
                    return [2 /*return*/];
            }
        });
    }); });
    // helper for getting weth and token balances
    beforeEach('load fixture', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ;
                    return [4 /*yield*/, loadFixture(swapRouterFixture)];
                case 1:
                    (_a = _b.sent(), router = _a.router, weth9 = _a.weth9, factory = _a.factory, tokens = _a.tokens, nft = _a.nft);
                    getBalances = function (who) { return __awaiter(_this, void 0, void 0, function () {
                        var balances;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Promise.all([
                                        weth9.balanceOf(who),
                                        tokens[0].balanceOf(who),
                                        tokens[1].balanceOf(who),
                                        tokens[2].balanceOf(who),
                                    ])];
                                case 1:
                                    balances = _a.sent();
                                    return [2 /*return*/, {
                                            weth9: balances[0],
                                            token0: balances[1],
                                            token1: balances[2],
                                            token2: balances[3],
                                        }];
                            }
                        });
                    }); };
                    return [2 /*return*/];
            }
        });
    }); });
    // ensure the swap router never ends up with a balance
    afterEach('load fixture', function () { return __awaiter(_this, void 0, void 0, function () {
        var balances, balance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getBalances(router.address)];
                case 1:
                    balances = _a.sent();
                    (0, expect_1.expect)(Object.values(balances).every(function (b) { return b.eq(0); })).to.be.eq(true);
                    return [4 /*yield*/, hardhat_1.waffle.provider.getBalance(router.address)];
                case 2:
                    balance = _a.sent();
                    (0, expect_1.expect)(balance.eq(0)).to.be.eq(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it('bytecode size', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect_1.expect;
                    return [4 /*yield*/, router.provider.getCode(router.address)];
                case 1:
                    _a.apply(void 0, [((_b.sent()).length - 2) / 2]).to.matchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('swaps', function () {
        var liquidity = 1000000;
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
                                recipient: wallet.address,
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
        function createPoolWETH9(tokenAddress) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, weth9.deposit({ value: liquidity })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, weth9.approve(nft.address, ethers_1.constants.MaxUint256)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, createPool(weth9.address, tokenAddress)];
                    }
                });
            });
        }
        beforeEach('create 0-1 and 1-2 pools', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createPool(tokens[0].address, tokens[1].address)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, createPool(tokens[1].address, tokens[2].address)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('#exactInput', function () {
            function exactInput(tokens_2) {
                return __awaiter(this, arguments, void 0, function (tokens, amountIn, amountOutMinimum) {
                    var inputIsWETH, outputIsWETH9, value, params, data;
                    if (amountIn === void 0) { amountIn = 3; }
                    if (amountOutMinimum === void 0) { amountOutMinimum = 1; }
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                inputIsWETH = weth9.address === tokens[0];
                                outputIsWETH9 = tokens[tokens.length - 1] === weth9.address;
                                value = inputIsWETH ? amountIn : 0;
                                params = {
                                    path: (0, path_1.encodePath)(tokens, new Array(tokens.length - 1).fill(constants_1.FeeAmount.MEDIUM)),
                                    recipient: outputIsWETH9 ? ethers_1.constants.AddressZero : trader.address,
                                    deadline: 1,
                                    amountIn: amountIn,
                                    amountOutMinimum: amountOutMinimum,
                                };
                                data = [router.interface.encodeFunctionData('exactInput', [params])];
                                if (outputIsWETH9)
                                    data.push(router.interface.encodeFunctionData('unwrapWETH9', [amountOutMinimum, trader.address]));
                                // ensure that the swap fails if the limit is any tighter
                                params.amountOutMinimum += 1;
                                return [4 /*yield*/, (0, expect_1.expect)(router.connect(trader).exactInput(params, { value: value })).to.be.revertedWith('Too little received')];
                            case 1:
                                _a.sent();
                                params.amountOutMinimum -= 1;
                                // optimized for the gas test
                                return [2 /*return*/, data.length === 1
                                        ? router.connect(trader).exactInput(params, { value: value })
                                        : router.connect(trader).multicall(data, { value: value })];
                        }
                    });
                });
            }
            describe('single-pool', function () {
                it('0 -> 1', function () { return __awaiter(_this, void 0, void 0, function () {
                    var pool, poolBefore, traderBefore, poolAfter, traderAfter;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, factory.getPool(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM)
                                // get balances before
                            ];
                            case 1:
                                pool = _a.sent();
                                return [4 /*yield*/, getBalances(pool)];
                            case 2:
                                poolBefore = _a.sent();
                                return [4 /*yield*/, getBalances(trader.address)];
                            case 3:
                                traderBefore = _a.sent();
                                return [4 /*yield*/, exactInput(tokens.slice(0, 2).map(function (token) { return token.address; }))
                                    // get balances after
                                ];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, getBalances(pool)];
                            case 5:
                                poolAfter = _a.sent();
                                return [4 /*yield*/, getBalances(trader.address)];
                            case 6:
                                traderAfter = _a.sent();
                                (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(3));
                                (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.add(1));
                                (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.add(3));
                                (0, expect_1.expect)(poolAfter.token1).to.be.eq(poolBefore.token1.sub(1));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('1 -> 0', function () { return __awaiter(_this, void 0, void 0, function () {
                    var pool, poolBefore, traderBefore, poolAfter, traderAfter;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, factory.getPool(tokens[1].address, tokens[0].address, constants_1.FeeAmount.MEDIUM)
                                // get balances before
                            ];
                            case 1:
                                pool = _a.sent();
                                return [4 /*yield*/, getBalances(pool)];
                            case 2:
                                poolBefore = _a.sent();
                                return [4 /*yield*/, getBalances(trader.address)];
                            case 3:
                                traderBefore = _a.sent();
                                return [4 /*yield*/, exactInput(tokens
                                        .slice(0, 2)
                                        .reverse()
                                        .map(function (token) { return token.address; }))
                                    // get balances after
                                ];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, getBalances(pool)];
                            case 5:
                                poolAfter = _a.sent();
                                return [4 /*yield*/, getBalances(trader.address)];
                            case 6:
                                traderAfter = _a.sent();
                                (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                                (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.sub(3));
                                (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.sub(1));
                                (0, expect_1.expect)(poolAfter.token1).to.be.eq(poolBefore.token1.add(3));
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('multi-pool', function () {
                it('0 -> 1 -> 2', function () { return __awaiter(_this, void 0, void 0, function () {
                    var traderBefore, traderAfter;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getBalances(trader.address)];
                            case 1:
                                traderBefore = _a.sent();
                                return [4 /*yield*/, exactInput(tokens.map(function (token) { return token.address; }), 5, 1)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, getBalances(trader.address)];
                            case 3:
                                traderAfter = _a.sent();
                                (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(5));
                                (0, expect_1.expect)(traderAfter.token2).to.be.eq(traderBefore.token2.add(1));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('2 -> 1 -> 0', function () { return __awaiter(_this, void 0, void 0, function () {
                    var traderBefore, traderAfter;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getBalances(trader.address)];
                            case 1:
                                traderBefore = _a.sent();
                                return [4 /*yield*/, exactInput(tokens.map(function (token) { return token.address; }).reverse(), 5, 1)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, getBalances(trader.address)];
                            case 3:
                                traderAfter = _a.sent();
                                (0, expect_1.expect)(traderAfter.token2).to.be.eq(traderBefore.token2.sub(5));
                                (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('events', function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(exactInput(tokens.map(function (token) { return token.address; }), 5, 1))
                                    .to.emit(tokens[0], 'Transfer')
                                    .withArgs(trader.address, (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM), 5)
                                    .to.emit(tokens[1], 'Transfer')
                                    .withArgs((0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM), router.address, 3)
                                    .to.emit(tokens[1], 'Transfer')
                                    .withArgs(router.address, (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[1].address, tokens[2].address], constants_1.FeeAmount.MEDIUM), 3)
                                    .to.emit(tokens[2], 'Transfer')
                                    .withArgs((0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[1].address, tokens[2].address], constants_1.FeeAmount.MEDIUM), trader.address, 1)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('ETH input', function () {
                describe('WETH9', function () {
                    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, createPoolWETH9(tokens[0].address)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('WETH9 -> 0', function () { return __awaiter(_this, void 0, void 0, function () {
                        var pool, poolBefore, traderBefore, poolAfter, traderAfter;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, factory.getPool(weth9.address, tokens[0].address, constants_1.FeeAmount.MEDIUM)
                                    // get balances before
                                ];
                                case 1:
                                    pool = _a.sent();
                                    return [4 /*yield*/, getBalances(pool)];
                                case 2:
                                    poolBefore = _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 3:
                                    traderBefore = _a.sent();
                                    return [4 /*yield*/, (0, expect_1.expect)(exactInput([weth9.address, tokens[0].address]))
                                            .to.emit(weth9, 'Deposit')
                                            .withArgs(router.address, 3)
                                        // get balances after
                                    ];
                                case 4:
                                    _a.sent();
                                    return [4 /*yield*/, getBalances(pool)];
                                case 5:
                                    poolAfter = _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 6:
                                    traderAfter = _a.sent();
                                    (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                                    (0, expect_1.expect)(poolAfter.weth9).to.be.eq(poolBefore.weth9.add(3));
                                    (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.sub(1));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('WETH9 -> 0 -> 1', function () { return __awaiter(_this, void 0, void 0, function () {
                        var traderBefore, traderAfter;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getBalances(trader.address)];
                                case 1:
                                    traderBefore = _a.sent();
                                    return [4 /*yield*/, (0, expect_1.expect)(exactInput([weth9.address, tokens[0].address, tokens[1].address], 5))
                                            .to.emit(weth9, 'Deposit')
                                            .withArgs(router.address, 5)];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 3:
                                    traderAfter = _a.sent();
                                    (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.add(1));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
            });
            describe('ETH output', function () {
                describe('WETH9', function () {
                    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, createPoolWETH9(tokens[0].address)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, createPoolWETH9(tokens[1].address)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('0 -> WETH9', function () { return __awaiter(_this, void 0, void 0, function () {
                        var pool, poolBefore, traderBefore, poolAfter, traderAfter;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, factory.getPool(tokens[0].address, weth9.address, constants_1.FeeAmount.MEDIUM)
                                    // get balances before
                                ];
                                case 1:
                                    pool = _a.sent();
                                    return [4 /*yield*/, getBalances(pool)];
                                case 2:
                                    poolBefore = _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 3:
                                    traderBefore = _a.sent();
                                    return [4 /*yield*/, (0, expect_1.expect)(exactInput([tokens[0].address, weth9.address]))
                                            .to.emit(weth9, 'Withdrawal')
                                            .withArgs(router.address, 1)
                                        // get balances after
                                    ];
                                case 4:
                                    _a.sent();
                                    return [4 /*yield*/, getBalances(pool)];
                                case 5:
                                    poolAfter = _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 6:
                                    traderAfter = _a.sent();
                                    (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(3));
                                    (0, expect_1.expect)(poolAfter.weth9).to.be.eq(poolBefore.weth9.sub(1));
                                    (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.add(3));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('0 -> 1 -> WETH9', function () { return __awaiter(_this, void 0, void 0, function () {
                        var traderBefore, traderAfter;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getBalances(trader.address)];
                                case 1:
                                    traderBefore = _a.sent();
                                    return [4 /*yield*/, (0, expect_1.expect)(exactInput([tokens[0].address, tokens[1].address, weth9.address], 5))
                                            .to.emit(weth9, 'Withdrawal')
                                            .withArgs(router.address, 1)
                                        // get balances after
                                    ];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 3:
                                    traderAfter = _a.sent();
                                    (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(5));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
            });
        });
        describe('#exactInputSingle', function () {
            function exactInputSingle(tokenIn_1, tokenOut_1) {
                return __awaiter(this, arguments, void 0, function (tokenIn, tokenOut, amountIn, amountOutMinimum, sqrtPriceLimitX96) {
                    var inputIsWETH, outputIsWETH9, value, params, data;
                    if (amountIn === void 0) { amountIn = 3; }
                    if (amountOutMinimum === void 0) { amountOutMinimum = 1; }
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                inputIsWETH = weth9.address === tokenIn;
                                outputIsWETH9 = tokenOut === weth9.address;
                                value = inputIsWETH ? amountIn : 0;
                                params = {
                                    tokenIn: tokenIn,
                                    tokenOut: tokenOut,
                                    fee: constants_1.FeeAmount.MEDIUM,
                                    sqrtPriceLimitX96: (sqrtPriceLimitX96 !== null && sqrtPriceLimitX96 !== void 0 ? sqrtPriceLimitX96 : tokenIn.toLowerCase() < tokenOut.toLowerCase())
                                        ? ethers_1.BigNumber.from('4295128740')
                                        : ethers_1.BigNumber.from('1461446703485210103287273052203988822378723970341'),
                                    recipient: outputIsWETH9 ? ethers_1.constants.AddressZero : trader.address,
                                    deadline: 1,
                                    amountIn: amountIn,
                                    amountOutMinimum: amountOutMinimum,
                                };
                                data = [router.interface.encodeFunctionData('exactInputSingle', [params])];
                                if (outputIsWETH9)
                                    data.push(router.interface.encodeFunctionData('unwrapWETH9', [amountOutMinimum, trader.address]));
                                // ensure that the swap fails if the limit is any tighter
                                params.amountOutMinimum += 1;
                                return [4 /*yield*/, (0, expect_1.expect)(router.connect(trader).exactInputSingle(params, { value: value })).to.be.revertedWith('Too little received')];
                            case 1:
                                _a.sent();
                                params.amountOutMinimum -= 1;
                                // optimized for the gas test
                                return [2 /*return*/, data.length === 1
                                        ? router.connect(trader).exactInputSingle(params, { value: value })
                                        : router.connect(trader).multicall(data, { value: value })];
                        }
                    });
                });
            }
            it('0 -> 1', function () { return __awaiter(_this, void 0, void 0, function () {
                var pool, poolBefore, traderBefore, poolAfter, traderAfter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, factory.getPool(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM)
                            // get balances before
                        ];
                        case 1:
                            pool = _a.sent();
                            return [4 /*yield*/, getBalances(pool)];
                        case 2:
                            poolBefore = _a.sent();
                            return [4 /*yield*/, getBalances(trader.address)];
                        case 3:
                            traderBefore = _a.sent();
                            return [4 /*yield*/, exactInputSingle(tokens[0].address, tokens[1].address)
                                // get balances after
                            ];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, getBalances(pool)];
                        case 5:
                            poolAfter = _a.sent();
                            return [4 /*yield*/, getBalances(trader.address)];
                        case 6:
                            traderAfter = _a.sent();
                            (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(3));
                            (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.add(1));
                            (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.add(3));
                            (0, expect_1.expect)(poolAfter.token1).to.be.eq(poolBefore.token1.sub(1));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('1 -> 0', function () { return __awaiter(_this, void 0, void 0, function () {
                var pool, poolBefore, traderBefore, poolAfter, traderAfter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, factory.getPool(tokens[1].address, tokens[0].address, constants_1.FeeAmount.MEDIUM)
                            // get balances before
                        ];
                        case 1:
                            pool = _a.sent();
                            return [4 /*yield*/, getBalances(pool)];
                        case 2:
                            poolBefore = _a.sent();
                            return [4 /*yield*/, getBalances(trader.address)];
                        case 3:
                            traderBefore = _a.sent();
                            return [4 /*yield*/, exactInputSingle(tokens[1].address, tokens[0].address)
                                // get balances after
                            ];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, getBalances(pool)];
                        case 5:
                            poolAfter = _a.sent();
                            return [4 /*yield*/, getBalances(trader.address)];
                        case 6:
                            traderAfter = _a.sent();
                            (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                            (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.sub(3));
                            (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.sub(1));
                            (0, expect_1.expect)(poolAfter.token1).to.be.eq(poolBefore.token1.add(3));
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('ETH input', function () {
                describe('WETH9', function () {
                    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, createPoolWETH9(tokens[0].address)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('WETH9 -> 0', function () { return __awaiter(_this, void 0, void 0, function () {
                        var pool, poolBefore, traderBefore, poolAfter, traderAfter;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, factory.getPool(weth9.address, tokens[0].address, constants_1.FeeAmount.MEDIUM)
                                    // get balances before
                                ];
                                case 1:
                                    pool = _a.sent();
                                    return [4 /*yield*/, getBalances(pool)];
                                case 2:
                                    poolBefore = _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 3:
                                    traderBefore = _a.sent();
                                    return [4 /*yield*/, (0, expect_1.expect)(exactInputSingle(weth9.address, tokens[0].address))
                                            .to.emit(weth9, 'Deposit')
                                            .withArgs(router.address, 3)
                                        // get balances after
                                    ];
                                case 4:
                                    _a.sent();
                                    return [4 /*yield*/, getBalances(pool)];
                                case 5:
                                    poolAfter = _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 6:
                                    traderAfter = _a.sent();
                                    (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                                    (0, expect_1.expect)(poolAfter.weth9).to.be.eq(poolBefore.weth9.add(3));
                                    (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.sub(1));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
            });
            describe('ETH output', function () {
                describe('WETH9', function () {
                    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, createPoolWETH9(tokens[0].address)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, createPoolWETH9(tokens[1].address)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('0 -> WETH9', function () { return __awaiter(_this, void 0, void 0, function () {
                        var pool, poolBefore, traderBefore, poolAfter, traderAfter;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, factory.getPool(tokens[0].address, weth9.address, constants_1.FeeAmount.MEDIUM)
                                    // get balances before
                                ];
                                case 1:
                                    pool = _a.sent();
                                    return [4 /*yield*/, getBalances(pool)];
                                case 2:
                                    poolBefore = _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 3:
                                    traderBefore = _a.sent();
                                    return [4 /*yield*/, (0, expect_1.expect)(exactInputSingle(tokens[0].address, weth9.address))
                                            .to.emit(weth9, 'Withdrawal')
                                            .withArgs(router.address, 1)
                                        // get balances after
                                    ];
                                case 4:
                                    _a.sent();
                                    return [4 /*yield*/, getBalances(pool)];
                                case 5:
                                    poolAfter = _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 6:
                                    traderAfter = _a.sent();
                                    (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(3));
                                    (0, expect_1.expect)(poolAfter.weth9).to.be.eq(poolBefore.weth9.sub(1));
                                    (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.add(3));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
            });
        });
        describe('#exactOutput', function () {
            function exactOutput(tokens_2) {
                return __awaiter(this, arguments, void 0, function (tokens, amountOut, amountInMaximum) {
                    var inputIsWETH9, outputIsWETH9, value, params, data;
                    if (amountOut === void 0) { amountOut = 1; }
                    if (amountInMaximum === void 0) { amountInMaximum = 3; }
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                inputIsWETH9 = tokens[0] === weth9.address;
                                outputIsWETH9 = tokens[tokens.length - 1] === weth9.address;
                                value = inputIsWETH9 ? amountInMaximum : 0;
                                params = {
                                    path: (0, path_1.encodePath)(tokens.slice().reverse(), new Array(tokens.length - 1).fill(constants_1.FeeAmount.MEDIUM)),
                                    recipient: outputIsWETH9 ? ethers_1.constants.AddressZero : trader.address,
                                    deadline: 1,
                                    amountOut: amountOut,
                                    amountInMaximum: amountInMaximum,
                                };
                                data = [router.interface.encodeFunctionData('exactOutput', [params])];
                                if (inputIsWETH9)
                                    data.push(router.interface.encodeFunctionData('unwrapWETH9', [0, trader.address]));
                                if (outputIsWETH9)
                                    data.push(router.interface.encodeFunctionData('unwrapWETH9', [amountOut, trader.address]));
                                // ensure that the swap fails if the limit is any tighter
                                params.amountInMaximum -= 1;
                                return [4 /*yield*/, (0, expect_1.expect)(router.connect(trader).exactOutput(params, { value: value })).to.be.revertedWith('Too much requested')];
                            case 1:
                                _a.sent();
                                params.amountInMaximum += 1;
                                return [2 /*return*/, router.connect(trader).multicall(data, { value: value })];
                        }
                    });
                });
            }
            describe('single-pool', function () {
                it('0 -> 1', function () { return __awaiter(_this, void 0, void 0, function () {
                    var pool, poolBefore, traderBefore, poolAfter, traderAfter;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, factory.getPool(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM)
                                // get balances before
                            ];
                            case 1:
                                pool = _a.sent();
                                return [4 /*yield*/, getBalances(pool)];
                            case 2:
                                poolBefore = _a.sent();
                                return [4 /*yield*/, getBalances(trader.address)];
                            case 3:
                                traderBefore = _a.sent();
                                return [4 /*yield*/, exactOutput(tokens.slice(0, 2).map(function (token) { return token.address; }))
                                    // get balances after
                                ];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, getBalances(pool)];
                            case 5:
                                poolAfter = _a.sent();
                                return [4 /*yield*/, getBalances(trader.address)];
                            case 6:
                                traderAfter = _a.sent();
                                (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(3));
                                (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.add(1));
                                (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.add(3));
                                (0, expect_1.expect)(poolAfter.token1).to.be.eq(poolBefore.token1.sub(1));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('1 -> 0', function () { return __awaiter(_this, void 0, void 0, function () {
                    var pool, poolBefore, traderBefore, poolAfter, traderAfter;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, factory.getPool(tokens[1].address, tokens[0].address, constants_1.FeeAmount.MEDIUM)
                                // get balances before
                            ];
                            case 1:
                                pool = _a.sent();
                                return [4 /*yield*/, getBalances(pool)];
                            case 2:
                                poolBefore = _a.sent();
                                return [4 /*yield*/, getBalances(trader.address)];
                            case 3:
                                traderBefore = _a.sent();
                                return [4 /*yield*/, exactOutput(tokens
                                        .slice(0, 2)
                                        .reverse()
                                        .map(function (token) { return token.address; }))
                                    // get balances after
                                ];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, getBalances(pool)];
                            case 5:
                                poolAfter = _a.sent();
                                return [4 /*yield*/, getBalances(trader.address)];
                            case 6:
                                traderAfter = _a.sent();
                                (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                                (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.sub(3));
                                (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.sub(1));
                                (0, expect_1.expect)(poolAfter.token1).to.be.eq(poolBefore.token1.add(3));
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('multi-pool', function () {
                it('0 -> 1 -> 2', function () { return __awaiter(_this, void 0, void 0, function () {
                    var traderBefore, traderAfter;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getBalances(trader.address)];
                            case 1:
                                traderBefore = _a.sent();
                                return [4 /*yield*/, exactOutput(tokens.map(function (token) { return token.address; }), 1, 5)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, getBalances(trader.address)];
                            case 3:
                                traderAfter = _a.sent();
                                (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(5));
                                (0, expect_1.expect)(traderAfter.token2).to.be.eq(traderBefore.token2.add(1));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('2 -> 1 -> 0', function () { return __awaiter(_this, void 0, void 0, function () {
                    var traderBefore, traderAfter;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getBalances(trader.address)];
                            case 1:
                                traderBefore = _a.sent();
                                return [4 /*yield*/, exactOutput(tokens.map(function (token) { return token.address; }).reverse(), 1, 5)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, getBalances(trader.address)];
                            case 3:
                                traderAfter = _a.sent();
                                (0, expect_1.expect)(traderAfter.token2).to.be.eq(traderBefore.token2.sub(5));
                                (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('events', function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, expect_1.expect)(exactOutput(tokens.map(function (token) { return token.address; }), 1, 5))
                                    .to.emit(tokens[2], 'Transfer')
                                    .withArgs((0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[2].address, tokens[1].address], constants_1.FeeAmount.MEDIUM), trader.address, 1)
                                    .to.emit(tokens[1], 'Transfer')
                                    .withArgs((0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[1].address, tokens[0].address], constants_1.FeeAmount.MEDIUM), (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[2].address, tokens[1].address], constants_1.FeeAmount.MEDIUM), 3)
                                    .to.emit(tokens[0], 'Transfer')
                                    .withArgs(trader.address, (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[1].address, tokens[0].address], constants_1.FeeAmount.MEDIUM), 5)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('ETH input', function () {
                describe('WETH9', function () {
                    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, createPoolWETH9(tokens[0].address)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('WETH9 -> 0', function () { return __awaiter(_this, void 0, void 0, function () {
                        var pool, poolBefore, traderBefore, poolAfter, traderAfter;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, factory.getPool(weth9.address, tokens[0].address, constants_1.FeeAmount.MEDIUM)
                                    // get balances before
                                ];
                                case 1:
                                    pool = _a.sent();
                                    return [4 /*yield*/, getBalances(pool)];
                                case 2:
                                    poolBefore = _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 3:
                                    traderBefore = _a.sent();
                                    return [4 /*yield*/, (0, expect_1.expect)(exactOutput([weth9.address, tokens[0].address]))
                                            .to.emit(weth9, 'Deposit')
                                            .withArgs(router.address, 3)
                                        // get balances after
                                    ];
                                case 4:
                                    _a.sent();
                                    return [4 /*yield*/, getBalances(pool)];
                                case 5:
                                    poolAfter = _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 6:
                                    traderAfter = _a.sent();
                                    (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                                    (0, expect_1.expect)(poolAfter.weth9).to.be.eq(poolBefore.weth9.add(3));
                                    (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.sub(1));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('WETH9 -> 0 -> 1', function () { return __awaiter(_this, void 0, void 0, function () {
                        var traderBefore, traderAfter;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getBalances(trader.address)];
                                case 1:
                                    traderBefore = _a.sent();
                                    return [4 /*yield*/, (0, expect_1.expect)(exactOutput([weth9.address, tokens[0].address, tokens[1].address], 1, 5))
                                            .to.emit(weth9, 'Deposit')
                                            .withArgs(router.address, 5)];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 3:
                                    traderAfter = _a.sent();
                                    (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.add(1));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
            });
            describe('ETH output', function () {
                describe('WETH9', function () {
                    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, createPoolWETH9(tokens[0].address)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, createPoolWETH9(tokens[1].address)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('0 -> WETH9', function () { return __awaiter(_this, void 0, void 0, function () {
                        var pool, poolBefore, traderBefore, poolAfter, traderAfter;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, factory.getPool(tokens[0].address, weth9.address, constants_1.FeeAmount.MEDIUM)
                                    // get balances before
                                ];
                                case 1:
                                    pool = _a.sent();
                                    return [4 /*yield*/, getBalances(pool)];
                                case 2:
                                    poolBefore = _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 3:
                                    traderBefore = _a.sent();
                                    return [4 /*yield*/, (0, expect_1.expect)(exactOutput([tokens[0].address, weth9.address]))
                                            .to.emit(weth9, 'Withdrawal')
                                            .withArgs(router.address, 1)
                                        // get balances after
                                    ];
                                case 4:
                                    _a.sent();
                                    return [4 /*yield*/, getBalances(pool)];
                                case 5:
                                    poolAfter = _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 6:
                                    traderAfter = _a.sent();
                                    (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(3));
                                    (0, expect_1.expect)(poolAfter.weth9).to.be.eq(poolBefore.weth9.sub(1));
                                    (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.add(3));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('0 -> 1 -> WETH9', function () { return __awaiter(_this, void 0, void 0, function () {
                        var traderBefore, traderAfter;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getBalances(trader.address)];
                                case 1:
                                    traderBefore = _a.sent();
                                    return [4 /*yield*/, (0, expect_1.expect)(exactOutput([tokens[0].address, tokens[1].address, weth9.address], 1, 5))
                                            .to.emit(weth9, 'Withdrawal')
                                            .withArgs(router.address, 1)
                                        // get balances after
                                    ];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 3:
                                    traderAfter = _a.sent();
                                    (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(5));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
            });
        });
        describe('#exactOutputSingle', function () {
            function exactOutputSingle(tokenIn_1, tokenOut_1) {
                return __awaiter(this, arguments, void 0, function (tokenIn, tokenOut, amountOut, amountInMaximum, sqrtPriceLimitX96) {
                    var inputIsWETH9, outputIsWETH9, value, params, data;
                    if (amountOut === void 0) { amountOut = 1; }
                    if (amountInMaximum === void 0) { amountInMaximum = 3; }
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                inputIsWETH9 = tokenIn === weth9.address;
                                outputIsWETH9 = tokenOut === weth9.address;
                                value = inputIsWETH9 ? amountInMaximum : 0;
                                params = {
                                    tokenIn: tokenIn,
                                    tokenOut: tokenOut,
                                    fee: constants_1.FeeAmount.MEDIUM,
                                    recipient: outputIsWETH9 ? ethers_1.constants.AddressZero : trader.address,
                                    deadline: 1,
                                    amountOut: amountOut,
                                    amountInMaximum: amountInMaximum,
                                    sqrtPriceLimitX96: (sqrtPriceLimitX96 !== null && sqrtPriceLimitX96 !== void 0 ? sqrtPriceLimitX96 : tokenIn.toLowerCase() < tokenOut.toLowerCase())
                                        ? ethers_1.BigNumber.from('4295128740')
                                        : ethers_1.BigNumber.from('1461446703485210103287273052203988822378723970341'),
                                };
                                data = [router.interface.encodeFunctionData('exactOutputSingle', [params])];
                                if (inputIsWETH9)
                                    data.push(router.interface.encodeFunctionData('refundETH'));
                                if (outputIsWETH9)
                                    data.push(router.interface.encodeFunctionData('unwrapWETH9', [amountOut, trader.address]));
                                // ensure that the swap fails if the limit is any tighter
                                params.amountInMaximum -= 1;
                                return [4 /*yield*/, (0, expect_1.expect)(router.connect(trader).exactOutputSingle(params, { value: value })).to.be.revertedWith('Too much requested')];
                            case 1:
                                _a.sent();
                                params.amountInMaximum += 1;
                                return [2 /*return*/, router.connect(trader).multicall(data, { value: value })];
                        }
                    });
                });
            }
            it('0 -> 1', function () { return __awaiter(_this, void 0, void 0, function () {
                var pool, poolBefore, traderBefore, poolAfter, traderAfter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, factory.getPool(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM)
                            // get balances before
                        ];
                        case 1:
                            pool = _a.sent();
                            return [4 /*yield*/, getBalances(pool)];
                        case 2:
                            poolBefore = _a.sent();
                            return [4 /*yield*/, getBalances(trader.address)];
                        case 3:
                            traderBefore = _a.sent();
                            return [4 /*yield*/, exactOutputSingle(tokens[0].address, tokens[1].address)
                                // get balances after
                            ];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, getBalances(pool)];
                        case 5:
                            poolAfter = _a.sent();
                            return [4 /*yield*/, getBalances(trader.address)];
                        case 6:
                            traderAfter = _a.sent();
                            (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(3));
                            (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.add(1));
                            (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.add(3));
                            (0, expect_1.expect)(poolAfter.token1).to.be.eq(poolBefore.token1.sub(1));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('1 -> 0', function () { return __awaiter(_this, void 0, void 0, function () {
                var pool, poolBefore, traderBefore, poolAfter, traderAfter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, factory.getPool(tokens[1].address, tokens[0].address, constants_1.FeeAmount.MEDIUM)
                            // get balances before
                        ];
                        case 1:
                            pool = _a.sent();
                            return [4 /*yield*/, getBalances(pool)];
                        case 2:
                            poolBefore = _a.sent();
                            return [4 /*yield*/, getBalances(trader.address)];
                        case 3:
                            traderBefore = _a.sent();
                            return [4 /*yield*/, exactOutputSingle(tokens[1].address, tokens[0].address)
                                // get balances after
                            ];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, getBalances(pool)];
                        case 5:
                            poolAfter = _a.sent();
                            return [4 /*yield*/, getBalances(trader.address)];
                        case 6:
                            traderAfter = _a.sent();
                            (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                            (0, expect_1.expect)(traderAfter.token1).to.be.eq(traderBefore.token1.sub(3));
                            (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.sub(1));
                            (0, expect_1.expect)(poolAfter.token1).to.be.eq(poolBefore.token1.add(3));
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('ETH input', function () {
                describe('WETH9', function () {
                    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, createPoolWETH9(tokens[0].address)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('WETH9 -> 0', function () { return __awaiter(_this, void 0, void 0, function () {
                        var pool, poolBefore, traderBefore, poolAfter, traderAfter;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, factory.getPool(weth9.address, tokens[0].address, constants_1.FeeAmount.MEDIUM)
                                    // get balances before
                                ];
                                case 1:
                                    pool = _a.sent();
                                    return [4 /*yield*/, getBalances(pool)];
                                case 2:
                                    poolBefore = _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 3:
                                    traderBefore = _a.sent();
                                    return [4 /*yield*/, (0, expect_1.expect)(exactOutputSingle(weth9.address, tokens[0].address))
                                            .to.emit(weth9, 'Deposit')
                                            .withArgs(router.address, 3)
                                        // get balances after
                                    ];
                                case 4:
                                    _a.sent();
                                    return [4 /*yield*/, getBalances(pool)];
                                case 5:
                                    poolAfter = _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 6:
                                    traderAfter = _a.sent();
                                    (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.add(1));
                                    (0, expect_1.expect)(poolAfter.weth9).to.be.eq(poolBefore.weth9.add(3));
                                    (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.sub(1));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
            });
            describe('ETH output', function () {
                describe('WETH9', function () {
                    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, createPoolWETH9(tokens[0].address)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, createPoolWETH9(tokens[1].address)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('0 -> WETH9', function () { return __awaiter(_this, void 0, void 0, function () {
                        var pool, poolBefore, traderBefore, poolAfter, traderAfter;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, factory.getPool(tokens[0].address, weth9.address, constants_1.FeeAmount.MEDIUM)
                                    // get balances before
                                ];
                                case 1:
                                    pool = _a.sent();
                                    return [4 /*yield*/, getBalances(pool)];
                                case 2:
                                    poolBefore = _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 3:
                                    traderBefore = _a.sent();
                                    return [4 /*yield*/, (0, expect_1.expect)(exactOutputSingle(tokens[0].address, weth9.address))
                                            .to.emit(weth9, 'Withdrawal')
                                            .withArgs(router.address, 1)
                                        // get balances after
                                    ];
                                case 4:
                                    _a.sent();
                                    return [4 /*yield*/, getBalances(pool)];
                                case 5:
                                    poolAfter = _a.sent();
                                    return [4 /*yield*/, getBalances(trader.address)];
                                case 6:
                                    traderAfter = _a.sent();
                                    (0, expect_1.expect)(traderAfter.token0).to.be.eq(traderBefore.token0.sub(3));
                                    (0, expect_1.expect)(poolAfter.weth9).to.be.eq(poolBefore.weth9.sub(1));
                                    (0, expect_1.expect)(poolAfter.token0).to.be.eq(poolBefore.token0.add(3));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
            });
        });
        describe('*WithFee', function () {
            var feeRecipient = '0xfEE0000000000000000000000000000000000000';
            it('#sweepTokenWithFee', function () { return __awaiter(_this, void 0, void 0, function () {
                var amountOutMinimum, params, data, balance;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            amountOutMinimum = 100;
                            params = {
                                path: (0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]),
                                recipient: router.address,
                                deadline: 1,
                                amountIn: 102,
                                amountOutMinimum: amountOutMinimum,
                            };
                            data = [
                                router.interface.encodeFunctionData('exactInput', [params]),
                                router.interface.encodeFunctionData('sweepTokenWithFee', [
                                    tokens[1].address,
                                    amountOutMinimum,
                                    trader.address,
                                    100,
                                    feeRecipient,
                                ]),
                            ];
                            return [4 /*yield*/, router.connect(trader).multicall(data)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, tokens[1].balanceOf(feeRecipient)];
                        case 2:
                            balance = _a.sent();
                            (0, expect_1.expect)(balance.eq(1)).to.be.eq(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('#unwrapWETH9WithFee', function () { return __awaiter(_this, void 0, void 0, function () {
                var startBalance, amountOutMinimum, params, data, endBalance;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, hardhat_1.waffle.provider.getBalance(feeRecipient)];
                        case 1:
                            startBalance = _a.sent();
                            return [4 /*yield*/, createPoolWETH9(tokens[0].address)];
                        case 2:
                            _a.sent();
                            amountOutMinimum = 100;
                            params = {
                                path: (0, path_1.encodePath)([tokens[0].address, weth9.address], [constants_1.FeeAmount.MEDIUM]),
                                recipient: router.address,
                                deadline: 1,
                                amountIn: 102,
                                amountOutMinimum: amountOutMinimum,
                            };
                            data = [
                                router.interface.encodeFunctionData('exactInput', [params]),
                                router.interface.encodeFunctionData('unwrapWETH9WithFee', [
                                    amountOutMinimum,
                                    trader.address,
                                    100,
                                    feeRecipient,
                                ]),
                            ];
                            return [4 /*yield*/, router.connect(trader).multicall(data)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, hardhat_1.waffle.provider.getBalance(feeRecipient)];
                        case 4:
                            endBalance = _a.sent();
                            (0, expect_1.expect)(endBalance.sub(startBalance).eq(1)).to.be.eq(true);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
