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
var constants_1 = require("./shared/constants");
var encodePriceSqrt_1 = require("./shared/encodePriceSqrt");
var expandTo18Decimals_1 = require("./shared/expandTo18Decimals");
var expect_1 = require("./shared/expect");
var path_1 = require("./shared/path");
var snapshotGasCost_1 = require("./shared/snapshotGasCost");
var ticks_1 = require("./shared/ticks");
describe('SwapRouter gas tests', function () {
    var _this = this;
    this.timeout(40000);
    var wallet;
    var trader;
    var swapRouterFixture = function (wallets, provider) { return __awaiter(_this, void 0, void 0, function () {
        function createPool(tokenAddressA, tokenAddressB) {
            return __awaiter(this, void 0, void 0, function () {
                var liquidityParams;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (tokenAddressA.toLowerCase() > tokenAddressB.toLowerCase())
                                _a = [tokenAddressB, tokenAddressA], tokenAddressA = _a[0], tokenAddressB = _a[1];
                            return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokenAddressA, tokenAddressB, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(100005, 100000) // we don't want to cross any ticks
                                )];
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
                        case 0: return [4 /*yield*/, weth9.deposit({ value: liquidity * 2 })];
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
        var _a, weth9, factory, router, tokens, nft, _i, tokens_1, token, liquidity, poolAddresses, pools;
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
                case 8:
                    liquidity = 1000000;
                    // create pools
                    return [4 /*yield*/, createPool(tokens[0].address, tokens[1].address)];
                case 9:
                    // create pools
                    _b.sent();
                    return [4 /*yield*/, createPool(tokens[1].address, tokens[2].address)];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, createPoolWETH9(tokens[0].address)];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, Promise.all([
                            factory.getPool(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM),
                            factory.getPool(tokens[1].address, tokens[2].address, constants_1.FeeAmount.MEDIUM),
                            factory.getPool(weth9.address, tokens[0].address, constants_1.FeeAmount.MEDIUM),
                        ])];
                case 12:
                    poolAddresses = _b.sent();
                    pools = poolAddresses.map(function (poolAddress) { return new hardhat_1.ethers.Contract(poolAddress, IUniswapV3Pool_json_1.abi, wallet); });
                    return [2 /*return*/, {
                            weth9: weth9,
                            router: router,
                            tokens: tokens,
                            pools: pools,
                        }];
            }
        });
    }); };
    var weth9;
    var router;
    var tokens;
    var pools;
    var loadFixture;
    before('create fixture loader', function () { return __awaiter(_this, void 0, void 0, function () {
        var wallets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    wallets = _a.sent();
                    wallet = wallets[0], trader = wallets[1];
                    loadFixture = hardhat_1.waffle.createFixtureLoader(wallets);
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach('load fixture', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ;
                    return [4 /*yield*/, loadFixture(swapRouterFixture)];
                case 1:
                    (_a = _b.sent(), router = _a.router, weth9 = _a.weth9, tokens = _a.tokens, pools = _a.pools);
                    return [2 /*return*/];
            }
        });
    }); });
    function exactInput(tokens_2) {
        return __awaiter(this, arguments, void 0, function (tokens, amountIn, amountOutMinimum) {
            var inputIsWETH, outputIsWETH9, value, params, data;
            if (amountIn === void 0) { amountIn = 2; }
            if (amountOutMinimum === void 0) { amountOutMinimum = 1; }
            return __generator(this, function (_a) {
                inputIsWETH = weth9.address === tokens[0];
                outputIsWETH9 = tokens[tokens.length - 1] === weth9.address;
                value = inputIsWETH ? amountIn : 0;
                params = {
                    path: (0, path_1.encodePath)(tokens, new Array(tokens.length - 1).fill(constants_1.FeeAmount.MEDIUM)),
                    recipient: outputIsWETH9 ? ethers_1.constants.AddressZero : trader.address,
                    deadline: 1,
                    amountIn: amountIn,
                    amountOutMinimum: outputIsWETH9 ? 0 : amountOutMinimum, // save on calldata,
                };
                data = [router.interface.encodeFunctionData('exactInput', [params])];
                if (outputIsWETH9)
                    data.push(router.interface.encodeFunctionData('unwrapWETH9', [amountOutMinimum, trader.address]));
                // optimized for the gas test
                return [2 /*return*/, data.length === 1
                        ? router.connect(trader).exactInput(params, { value: value })
                        : router.connect(trader).multicall(data, { value: value })];
            });
        });
    }
    function exactInputSingle(tokenIn_1, tokenOut_1) {
        return __awaiter(this, arguments, void 0, function (tokenIn, tokenOut, amountIn, amountOutMinimum, sqrtPriceLimitX96) {
            var inputIsWETH, outputIsWETH9, value, params, data;
            if (amountIn === void 0) { amountIn = 3; }
            if (amountOutMinimum === void 0) { amountOutMinimum = 1; }
            return __generator(this, function (_a) {
                inputIsWETH = weth9.address === tokenIn;
                outputIsWETH9 = tokenOut === weth9.address;
                value = inputIsWETH ? amountIn : 0;
                params = {
                    tokenIn: tokenIn,
                    tokenOut: tokenOut,
                    fee: constants_1.FeeAmount.MEDIUM,
                    sqrtPriceLimitX96: sqrtPriceLimitX96 !== null && sqrtPriceLimitX96 !== void 0 ? sqrtPriceLimitX96 : 0,
                    recipient: outputIsWETH9 ? ethers_1.constants.AddressZero : trader.address,
                    deadline: 1,
                    amountIn: amountIn,
                    amountOutMinimum: outputIsWETH9 ? 0 : amountOutMinimum, // save on calldata
                };
                data = [router.interface.encodeFunctionData('exactInputSingle', [params])];
                if (outputIsWETH9)
                    data.push(router.interface.encodeFunctionData('unwrapWETH9', [amountOutMinimum, trader.address]));
                // optimized for the gas test
                return [2 /*return*/, data.length === 1
                        ? router.connect(trader).exactInputSingle(params, { value: value })
                        : router.connect(trader).multicall(data, { value: value })];
            });
        });
    }
    function exactOutput(tokens) {
        return __awaiter(this, void 0, void 0, function () {
            var amountInMaximum, amountOut, inputIsWETH9, outputIsWETH9, value, params, data;
            return __generator(this, function (_a) {
                amountInMaximum = 10 // we don't care
                ;
                amountOut = 1;
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
                    data.push(router.interface.encodeFunctionData('refundETH'));
                if (outputIsWETH9)
                    data.push(router.interface.encodeFunctionData('unwrapWETH9', [amountOut, trader.address]));
                return [2 /*return*/, router.connect(trader).multicall(data, { value: value })];
            });
        });
    }
    function exactOutputSingle(tokenIn_1, tokenOut_1) {
        return __awaiter(this, arguments, void 0, function (tokenIn, tokenOut, amountOut, amountInMaximum, sqrtPriceLimitX96) {
            var inputIsWETH9, outputIsWETH9, value, params, data;
            if (amountOut === void 0) { amountOut = 1; }
            if (amountInMaximum === void 0) { amountInMaximum = 3; }
            return __generator(this, function (_a) {
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
                    sqrtPriceLimitX96: sqrtPriceLimitX96 !== null && sqrtPriceLimitX96 !== void 0 ? sqrtPriceLimitX96 : 0,
                };
                data = [router.interface.encodeFunctionData('exactOutputSingle', [params])];
                if (inputIsWETH9)
                    data.push(router.interface.encodeFunctionData('unwrapWETH9', [0, trader.address]));
                if (outputIsWETH9)
                    data.push(router.interface.encodeFunctionData('unwrapWETH9', [amountOut, trader.address]));
                return [2 /*return*/, router.connect(trader).multicall(data, { value: value })];
            });
        });
    }
    // TODO should really throw this in the fixture
    beforeEach('intialize feeGrowthGlobals', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exactInput([tokens[0].address, tokens[1].address], 1, 0)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, exactInput([tokens[1].address, tokens[0].address], 1, 0)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, exactInput([tokens[1].address, tokens[2].address], 1, 0)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, exactInput([tokens[2].address, tokens[1].address], 1, 0)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, exactInput([tokens[0].address, weth9.address], 1, 0)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, exactInput([weth9.address, tokens[0].address], 1, 0)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach('ensure feeGrowthGlobals are >0', function () { return __awaiter(_this, void 0, void 0, function () {
        var slots;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(pools.map(function (pool) {
                        return Promise.all([
                            pool.feeGrowthGlobal0X128().then(function (f) { return f.toString(); }),
                            pool.feeGrowthGlobal1X128().then(function (f) { return f.toString(); }),
                        ]);
                    }))];
                case 1:
                    slots = _a.sent();
                    (0, expect_1.expect)(slots).to.deep.eq([
                        ['340290874192793283295456993856614', '340290874192793283295456993856614'],
                        ['340290874192793283295456993856614', '340290874192793283295456993856614'],
                        ['340290874192793283295456993856614', '340290874192793283295456993856614'],
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach('ensure ticks are 0 before', function () { return __awaiter(_this, void 0, void 0, function () {
        var slots;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(pools.map(function (pool) { return pool.slot0().then(function (_a) {
                        var tick = _a.tick;
                        return tick;
                    }); }))];
                case 1:
                    slots = _a.sent();
                    (0, expect_1.expect)(slots).to.deep.eq([0, 0, 0]);
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach('ensure ticks are 0 after', function () { return __awaiter(_this, void 0, void 0, function () {
        var slots;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(pools.map(function (pool) { return pool.slot0().then(function (_a) {
                        var tick = _a.tick;
                        return tick;
                    }); }))];
                case 1:
                    slots = _a.sent();
                    (0, expect_1.expect)(slots).to.deep.eq([0, 0, 0]);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#exactInput', function () {
        it('0 -> 1', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(exactInput(tokens.slice(0, 2).map(function (token) { return token.address; })))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('0 -> 1 minimal', function () { return __awaiter(_this, void 0, void 0, function () {
            var calleeFactory, callee;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TestUniswapV3Callee')];
                    case 1:
                        calleeFactory = _a.sent();
                        return [4 /*yield*/, calleeFactory.deploy()];
                    case 2:
                        callee = _a.sent();
                        return [4 /*yield*/, tokens[0].connect(trader).approve(callee.address, ethers_1.constants.MaxUint256)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(callee.connect(trader).swapExact0For1(pools[0].address, 2, trader.address, '4295128740'))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('0 -> 1 -> 2', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(exactInput(tokens.map(function (token) { return token.address; }), 3))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('WETH9 -> 0', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(exactInput([weth9.address, tokens[0].address], weth9.address.toLowerCase() < tokens[0].address.toLowerCase() ? 2 : 3))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('0 -> WETH9', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(exactInput([tokens[0].address, weth9.address], tokens[0].address.toLowerCase() < weth9.address.toLowerCase() ? 2 : 3))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('2 trades (via router)', function () { return __awaiter(_this, void 0, void 0, function () {
            var swap0, swap1, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, weth9.connect(trader).deposit({ value: 3 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, weth9.connect(trader).approve(router.address, ethers_1.constants.MaxUint256)];
                    case 2:
                        _a.sent();
                        swap0 = {
                            path: (0, path_1.encodePath)([weth9.address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]),
                            recipient: ethers_1.constants.AddressZero,
                            deadline: 1,
                            amountIn: 3,
                            amountOutMinimum: 0, // save on calldata
                        };
                        swap1 = {
                            path: (0, path_1.encodePath)([tokens[1].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]),
                            recipient: ethers_1.constants.AddressZero,
                            deadline: 1,
                            amountIn: 3,
                            amountOutMinimum: 0, // save on calldata
                        };
                        data = [
                            router.interface.encodeFunctionData('exactInput', [swap0]),
                            router.interface.encodeFunctionData('exactInput', [swap1]),
                            router.interface.encodeFunctionData('sweepToken', [tokens[0].address, 2, trader.address]),
                        ];
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(router.connect(trader).multicall(data))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('3 trades (directly to sender)', function () { return __awaiter(_this, void 0, void 0, function () {
            var swap0, swap1, swap2, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, weth9.connect(trader).deposit({ value: 3 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, weth9.connect(trader).approve(router.address, ethers_1.constants.MaxUint256)];
                    case 2:
                        _a.sent();
                        swap0 = {
                            path: (0, path_1.encodePath)([weth9.address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]),
                            recipient: trader.address,
                            deadline: 1,
                            amountIn: 3,
                            amountOutMinimum: 1,
                        };
                        swap1 = {
                            path: (0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]),
                            recipient: trader.address,
                            deadline: 1,
                            amountIn: 3,
                            amountOutMinimum: 1,
                        };
                        swap2 = {
                            path: (0, path_1.encodePath)([tokens[1].address, tokens[2].address], [constants_1.FeeAmount.MEDIUM]),
                            recipient: trader.address,
                            deadline: 1,
                            amountIn: 3,
                            amountOutMinimum: 1,
                        };
                        data = [
                            router.interface.encodeFunctionData('exactInput', [swap0]),
                            router.interface.encodeFunctionData('exactInput', [swap1]),
                            router.interface.encodeFunctionData('exactInput', [swap2]),
                        ];
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(router.connect(trader).multicall(data))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('3 trades (directly to sender)', function () { return __awaiter(_this, void 0, void 0, function () {
        var swap0, swap1, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, weth9.connect(trader).deposit({ value: 3 })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, weth9.connect(trader).approve(router.address, ethers_1.constants.MaxUint256)];
                case 2:
                    _a.sent();
                    swap0 = {
                        path: (0, path_1.encodePath)([weth9.address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]),
                        recipient: trader.address,
                        deadline: 1,
                        amountIn: 3,
                        amountOutMinimum: 1,
                    };
                    swap1 = {
                        path: (0, path_1.encodePath)([tokens[1].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]),
                        recipient: trader.address,
                        deadline: 1,
                        amountIn: 3,
                        amountOutMinimum: 1,
                    };
                    data = [
                        router.interface.encodeFunctionData('exactInput', [swap0]),
                        router.interface.encodeFunctionData('exactInput', [swap1]),
                    ];
                    return [4 /*yield*/, (0, snapshotGasCost_1.default)(router.connect(trader).multicall(data))];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#exactInputSingle', function () {
        it('0 -> 1', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(exactInputSingle(tokens[0].address, tokens[1].address))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('WETH9 -> 0', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(exactInputSingle(weth9.address, tokens[0].address, weth9.address.toLowerCase() < tokens[0].address.toLowerCase() ? 2 : 3))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('0 -> WETH9', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(exactInputSingle(tokens[0].address, weth9.address, tokens[0].address.toLowerCase() < weth9.address.toLowerCase() ? 2 : 3))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#exactOutput', function () {
        it('0 -> 1', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(exactOutput(tokens.slice(0, 2).map(function (token) { return token.address; })))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('0 -> 1 -> 2', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(exactOutput(tokens.map(function (token) { return token.address; })))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('WETH9 -> 0', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(exactOutput([weth9.address, tokens[0].address]))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('0 -> WETH9', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(exactOutput([tokens[0].address, weth9.address]))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#exactOutputSingle', function () {
        it('0 -> 1', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(exactOutputSingle(tokens[0].address, tokens[1].address))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('WETH9 -> 0', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(exactOutputSingle(weth9.address, tokens[0].address))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('0 -> WETH9', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(exactOutputSingle(tokens[0].address, weth9.address))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
