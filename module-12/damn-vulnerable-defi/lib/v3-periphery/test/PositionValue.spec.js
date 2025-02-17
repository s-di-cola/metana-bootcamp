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
var hardhat_1 = require("hardhat");
var ethers_1 = require("ethers");
var constants_1 = require("./shared/constants");
var ticks_1 = require("./shared/ticks");
var encodePriceSqrt_1 = require("./shared/encodePriceSqrt");
var expandTo18Decimals_1 = require("./shared/expandTo18Decimals");
var path_1 = require("./shared/path");
var computePoolAddress_1 = require("./shared/computePoolAddress");
var completeFixture_1 = require("./shared/completeFixture");
var snapshotGasCost_1 = require("./shared/snapshotGasCost");
var expect_1 = require("./shared/expect");
var IUniswapV3Pool_json_1 = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
describe('PositionValue', function () { return __awaiter(void 0, void 0, void 0, function () {
    var wallets, positionValueCompleteFixture, pool, tokens, positionValue, nft, router, factory, amountDesired, loadFixture;
    return __generator(this, function (_a) {
        wallets = hardhat_1.waffle.provider.getWallets().slice(0);
        positionValueCompleteFixture = function (wallets, provider) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, nft, router, tokens, factory, positionValueFactory, positionValue, _i, tokens_1, token;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, completeFixture_1.default)(wallets, provider)];
                    case 1:
                        _a = _b.sent(), nft = _a.nft, router = _a.router, tokens = _a.tokens, factory = _a.factory;
                        return [4 /*yield*/, hardhat_1.ethers.getContractFactory('PositionValueTest')];
                    case 2:
                        positionValueFactory = _b.sent();
                        return [4 /*yield*/, positionValueFactory.deploy()];
                    case 3:
                        positionValue = (_b.sent());
                        _i = 0, tokens_1 = tokens;
                        _b.label = 4;
                    case 4:
                        if (!(_i < tokens_1.length)) return [3 /*break*/, 9];
                        token = tokens_1[_i];
                        return [4 /*yield*/, token.approve(nft.address, ethers_1.constants.MaxUint256)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, token.connect(wallets[0]).approve(nft.address, ethers_1.constants.MaxUint256)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, token.transfer(wallets[0].address, (0, expandTo18Decimals_1.expandTo18Decimals)(1000000))];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 4];
                    case 9: return [2 /*return*/, {
                            positionValue: positionValue,
                            tokens: tokens,
                            nft: nft,
                            router: router,
                            factory: factory,
                        }];
                }
            });
        }); };
        before('create fixture loader', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                loadFixture = hardhat_1.waffle.createFixtureLoader(wallets);
                return [2 /*return*/];
            });
        }); });
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            var poolAddress;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ;
                        return [4 /*yield*/, loadFixture(positionValueCompleteFixture)];
                    case 1:
                        (_a = _b.sent(), positionValue = _a.positionValue, tokens = _a.tokens, nft = _a.nft, router = _a.router, factory = _a.factory);
                        return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 2:
                        _b.sent();
                        poolAddress = (0, computePoolAddress_1.computePoolAddress)(factory.address, [tokens[0].address, tokens[1].address], constants_1.FeeAmount.MEDIUM);
                        pool = new hardhat_1.ethers.Contract(poolAddress, IUniswapV3Pool_json_1.abi, wallets[0]);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('#total', function () {
            var tokenId;
            var sqrtRatioX96;
            beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
                var swapAmount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            amountDesired = (0, expandTo18Decimals_1.expandTo18Decimals)(100000);
                            return [4 /*yield*/, nft.mint({
                                    token0: tokens[0].address,
                                    token1: tokens[1].address,
                                    tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                    tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                    fee: constants_1.FeeAmount.MEDIUM,
                                    recipient: wallets[0].address,
                                    amount0Desired: amountDesired,
                                    amount1Desired: amountDesired,
                                    amount0Min: 0,
                                    amount1Min: 0,
                                    deadline: 10,
                                })];
                        case 1:
                            _a.sent();
                            swapAmount = (0, expandTo18Decimals_1.expandTo18Decimals)(1000);
                            return [4 /*yield*/, tokens[0].approve(router.address, swapAmount)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, tokens[1].approve(router.address, swapAmount)
                                // accmuluate token0 fees
                            ];
                        case 3:
                            _a.sent();
                            // accmuluate token0 fees
                            return [4 /*yield*/, router.exactInput({
                                    recipient: wallets[0].address,
                                    deadline: 1,
                                    path: (0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]),
                                    amountIn: swapAmount,
                                    amountOutMinimum: 0,
                                })
                                // accmuluate token1 fees
                            ];
                        case 4:
                            // accmuluate token0 fees
                            _a.sent();
                            // accmuluate token1 fees
                            return [4 /*yield*/, router.exactInput({
                                    recipient: wallets[0].address,
                                    deadline: 1,
                                    path: (0, path_1.encodePath)([tokens[1].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]),
                                    amountIn: swapAmount,
                                    amountOutMinimum: 0,
                                })];
                        case 5:
                            // accmuluate token1 fees
                            _a.sent();
                            return [4 /*yield*/, pool.slot0()];
                        case 6:
                            sqrtRatioX96 = (_a.sent()).sqrtPriceX96;
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns the correct amount', function () { return __awaiter(void 0, void 0, void 0, function () {
                var principal, fees, total;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, positionValue.principal(nft.address, 1, sqrtRatioX96)];
                        case 1:
                            principal = _a.sent();
                            return [4 /*yield*/, positionValue.fees(nft.address, 1)];
                        case 2:
                            fees = _a.sent();
                            return [4 /*yield*/, positionValue.total(nft.address, 1, sqrtRatioX96)];
                        case 3:
                            total = _a.sent();
                            (0, expect_1.expect)(total[0]).to.equal(principal[0].add(fees[0]));
                            (0, expect_1.expect)(total[1]).to.equal(principal[1].add(fees[1]));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(positionValue.totalGas(nft.address, 1, sqrtRatioX96))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('#principal', function () {
            var sqrtRatioX96;
            beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            amountDesired = (0, expandTo18Decimals_1.expandTo18Decimals)(100000);
                            return [4 /*yield*/, pool.slot0()];
                        case 1:
                            sqrtRatioX96 = (_a.sent()).sqrtPriceX96;
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns the correct values when price is in the middle of the range', function () { return __awaiter(void 0, void 0, void 0, function () {
                var principal;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                fee: constants_1.FeeAmount.MEDIUM,
                                recipient: wallets[0].address,
                                amount0Desired: amountDesired,
                                amount1Desired: amountDesired,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 10,
                            })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, positionValue.principal(nft.address, 1, sqrtRatioX96)];
                        case 2:
                            principal = _a.sent();
                            (0, expect_1.expect)(principal.amount0).to.equal('99999999999999999999999');
                            (0, expect_1.expect)(principal.amount1).to.equal('99999999999999999999999');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns the correct values when range is below current price', function () { return __awaiter(void 0, void 0, void 0, function () {
                var principal;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: -60,
                                fee: constants_1.FeeAmount.MEDIUM,
                                recipient: wallets[0].address,
                                amount0Desired: amountDesired,
                                amount1Desired: amountDesired,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 10,
                            })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, positionValue.principal(nft.address, 1, sqrtRatioX96)];
                        case 2:
                            principal = _a.sent();
                            (0, expect_1.expect)(principal.amount0).to.equal('0');
                            (0, expect_1.expect)(principal.amount1).to.equal('99999999999999999999999');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns the correct values when range is below current price', function () { return __awaiter(void 0, void 0, void 0, function () {
                var principal;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                tickLower: 60,
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                fee: constants_1.FeeAmount.MEDIUM,
                                recipient: wallets[0].address,
                                amount0Desired: amountDesired,
                                amount1Desired: amountDesired,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 10,
                            })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, positionValue.principal(nft.address, 1, sqrtRatioX96)];
                        case 2:
                            principal = _a.sent();
                            (0, expect_1.expect)(principal.amount0).to.equal('99999999999999999999999');
                            (0, expect_1.expect)(principal.amount1).to.equal('0');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns the correct values when range is skewed above price', function () { return __awaiter(void 0, void 0, void 0, function () {
                var principal;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                tickLower: -6000,
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                fee: constants_1.FeeAmount.MEDIUM,
                                recipient: wallets[0].address,
                                amount0Desired: amountDesired,
                                amount1Desired: amountDesired,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 10,
                            })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, positionValue.principal(nft.address, 1, sqrtRatioX96)];
                        case 2:
                            principal = _a.sent();
                            (0, expect_1.expect)(principal.amount0).to.equal('99999999999999999999999');
                            (0, expect_1.expect)(principal.amount1).to.equal('25917066770240321655335');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns the correct values when range is skewed below price', function () { return __awaiter(void 0, void 0, void 0, function () {
                var principal;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: 6000,
                                fee: constants_1.FeeAmount.MEDIUM,
                                recipient: wallets[0].address,
                                amount0Desired: amountDesired,
                                amount1Desired: amountDesired,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 10,
                            })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, positionValue.principal(nft.address, 1, sqrtRatioX96)];
                        case 2:
                            principal = _a.sent();
                            (0, expect_1.expect)(principal.amount0).to.equal('25917066770240321655335');
                            (0, expect_1.expect)(principal.amount1).to.equal('99999999999999999999999');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, nft.mint({
                                token0: tokens[0].address,
                                token1: tokens[1].address,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                fee: constants_1.FeeAmount.MEDIUM,
                                recipient: wallets[0].address,
                                amount0Desired: amountDesired,
                                amount1Desired: amountDesired,
                                amount0Min: 0,
                                amount1Min: 0,
                                deadline: 10,
                            })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, snapshotGasCost_1.default)(positionValue.principalGas(nft.address, 1, sqrtRatioX96))];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('#fees', function () {
            var tokenId;
            beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            amountDesired = (0, expandTo18Decimals_1.expandTo18Decimals)(100000);
                            tokenId = 2;
                            return [4 /*yield*/, nft.mint({
                                    token0: tokens[0].address,
                                    token1: tokens[1].address,
                                    tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                    tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM]),
                                    fee: constants_1.FeeAmount.MEDIUM,
                                    recipient: wallets[0].address,
                                    amount0Desired: amountDesired,
                                    amount1Desired: amountDesired,
                                    amount0Min: 0,
                                    amount1Min: 0,
                                    deadline: 10,
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('when price is within the position range', function () {
                beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var swapAmount;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, nft.mint({
                                    token0: tokens[0].address,
                                    token1: tokens[1].address,
                                    tickLower: constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM] * -1000,
                                    tickUpper: constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM] * 1000,
                                    fee: constants_1.FeeAmount.MEDIUM,
                                    recipient: wallets[0].address,
                                    amount0Desired: amountDesired,
                                    amount1Desired: amountDesired,
                                    amount0Min: 0,
                                    amount1Min: 0,
                                    deadline: 10,
                                })];
                            case 1:
                                _a.sent();
                                swapAmount = (0, expandTo18Decimals_1.expandTo18Decimals)(1000);
                                return [4 /*yield*/, tokens[0].approve(router.address, swapAmount)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, tokens[1].approve(router.address, swapAmount)
                                    // accmuluate token0 fees
                                ];
                            case 3:
                                _a.sent();
                                // accmuluate token0 fees
                                return [4 /*yield*/, router.exactInput({
                                        recipient: wallets[0].address,
                                        deadline: 1,
                                        path: (0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]),
                                        amountIn: swapAmount,
                                        amountOutMinimum: 0,
                                    })
                                    // accmuluate token1 fees
                                ];
                            case 4:
                                // accmuluate token0 fees
                                _a.sent();
                                // accmuluate token1 fees
                                return [4 /*yield*/, router.exactInput({
                                        recipient: wallets[0].address,
                                        deadline: 1,
                                        path: (0, path_1.encodePath)([tokens[1].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]),
                                        amountIn: swapAmount,
                                        amountOutMinimum: 0,
                                    })];
                            case 5:
                                // accmuluate token1 fees
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('return the correct amount of fees', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var feesFromCollect, feeAmounts;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, nft.callStatic.collect({
                                    tokenId: tokenId,
                                    recipient: wallets[0].address,
                                    amount0Max: constants_1.MaxUint128,
                                    amount1Max: constants_1.MaxUint128,
                                })];
                            case 1:
                                feesFromCollect = _a.sent();
                                return [4 /*yield*/, positionValue.fees(nft.address, tokenId)];
                            case 2:
                                feeAmounts = _a.sent();
                                (0, expect_1.expect)(feeAmounts[0]).to.equal(feesFromCollect[0]);
                                (0, expect_1.expect)(feeAmounts[1]).to.equal(feesFromCollect[1]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('returns the correct amount of fees if tokensOwed fields are greater than 0', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var swapAmount, feesFromCollect, feeAmounts;
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
                                swapAmount = (0, expandTo18Decimals_1.expandTo18Decimals)(1000);
                                return [4 /*yield*/, tokens[0].approve(router.address, swapAmount)
                                    // accmuluate more token0 fees after clearing initial amount
                                ];
                            case 2:
                                _a.sent();
                                // accmuluate more token0 fees after clearing initial amount
                                return [4 /*yield*/, router.exactInput({
                                        recipient: wallets[0].address,
                                        deadline: 1,
                                        path: (0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]),
                                        amountIn: swapAmount,
                                        amountOutMinimum: 0,
                                    })];
                            case 3:
                                // accmuluate more token0 fees after clearing initial amount
                                _a.sent();
                                return [4 /*yield*/, nft.callStatic.collect({
                                        tokenId: tokenId,
                                        recipient: wallets[0].address,
                                        amount0Max: constants_1.MaxUint128,
                                        amount1Max: constants_1.MaxUint128,
                                    })];
                            case 4:
                                feesFromCollect = _a.sent();
                                return [4 /*yield*/, positionValue.fees(nft.address, tokenId)];
                            case 5:
                                feeAmounts = _a.sent();
                                (0, expect_1.expect)(feeAmounts[0]).to.equal(feesFromCollect[0]);
                                (0, expect_1.expect)(feeAmounts[1]).to.equal(feesFromCollect[1]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(positionValue.feesGas(nft.address, tokenId))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('when price is below the position range', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, nft.mint({
                                        token0: tokens[0].address,
                                        token1: tokens[1].address,
                                        tickLower: constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM] * -10,
                                        tickUpper: constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM] * 10,
                                        fee: constants_1.FeeAmount.MEDIUM,
                                        recipient: wallets[0].address,
                                        amount0Desired: (0, expandTo18Decimals_1.expandTo18Decimals)(10000),
                                        amount1Desired: (0, expandTo18Decimals_1.expandTo18Decimals)(10000),
                                        amount0Min: 0,
                                        amount1Min: 0,
                                        deadline: 10,
                                    })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, tokens[0].approve(router.address, ethers_1.constants.MaxUint256)];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, tokens[1].approve(router.address, ethers_1.constants.MaxUint256)
                                        // accumulate token1 fees
                                    ];
                                case 3:
                                    _a.sent();
                                    // accumulate token1 fees
                                    return [4 /*yield*/, router.exactInput({
                                            recipient: wallets[0].address,
                                            deadline: 1,
                                            path: (0, path_1.encodePath)([tokens[1].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]),
                                            amountIn: (0, expandTo18Decimals_1.expandTo18Decimals)(1000),
                                            amountOutMinimum: 0,
                                        })
                                        // accumulate token0 fees and push price below tickLower
                                    ];
                                case 4:
                                    // accumulate token1 fees
                                    _a.sent();
                                    // accumulate token0 fees and push price below tickLower
                                    return [4 /*yield*/, router.exactInput({
                                            recipient: wallets[0].address,
                                            deadline: 1,
                                            path: (0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]),
                                            amountIn: (0, expandTo18Decimals_1.expandTo18Decimals)(50000),
                                            amountOutMinimum: 0,
                                        })];
                                case 5:
                                    // accumulate token0 fees and push price below tickLower
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('returns the correct amount of fees', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var feesFromCollect, feeAmounts;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, nft.callStatic.collect({
                                        tokenId: tokenId,
                                        recipient: wallets[0].address,
                                        amount0Max: constants_1.MaxUint128,
                                        amount1Max: constants_1.MaxUint128,
                                    })];
                                case 1:
                                    feesFromCollect = _a.sent();
                                    return [4 /*yield*/, positionValue.fees(nft.address, tokenId)];
                                case 2:
                                    feeAmounts = _a.sent();
                                    (0, expect_1.expect)(feeAmounts[0]).to.equal(feesFromCollect[0]);
                                    (0, expect_1.expect)(feeAmounts[1]).to.equal(feesFromCollect[1]);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(positionValue.feesGas(nft.address, tokenId))];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
                });
            }); });
            describe('when price is above the position range', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, nft.mint({
                                        token0: tokens[0].address,
                                        token1: tokens[1].address,
                                        tickLower: constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM] * -10,
                                        tickUpper: constants_1.TICK_SPACINGS[constants_1.FeeAmount.MEDIUM] * 10,
                                        fee: constants_1.FeeAmount.MEDIUM,
                                        recipient: wallets[0].address,
                                        amount0Desired: (0, expandTo18Decimals_1.expandTo18Decimals)(10000),
                                        amount1Desired: (0, expandTo18Decimals_1.expandTo18Decimals)(10000),
                                        amount0Min: 0,
                                        amount1Min: 0,
                                        deadline: 10,
                                    })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, tokens[0].approve(router.address, ethers_1.constants.MaxUint256)];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, tokens[1].approve(router.address, ethers_1.constants.MaxUint256)
                                        // accumulate token0 fees
                                    ];
                                case 3:
                                    _a.sent();
                                    // accumulate token0 fees
                                    return [4 /*yield*/, router.exactInput({
                                            recipient: wallets[0].address,
                                            deadline: 1,
                                            path: (0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]),
                                            amountIn: (0, expandTo18Decimals_1.expandTo18Decimals)(1000),
                                            amountOutMinimum: 0,
                                        })
                                        // accumulate token1 fees and push price above tickUpper
                                    ];
                                case 4:
                                    // accumulate token0 fees
                                    _a.sent();
                                    // accumulate token1 fees and push price above tickUpper
                                    return [4 /*yield*/, router.exactInput({
                                            recipient: wallets[0].address,
                                            deadline: 1,
                                            path: (0, path_1.encodePath)([tokens[1].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]),
                                            amountIn: (0, expandTo18Decimals_1.expandTo18Decimals)(50000),
                                            amountOutMinimum: 0,
                                        })];
                                case 5:
                                    // accumulate token1 fees and push price above tickUpper
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('returns the correct amount of fees', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var feesFromCollect, feeAmounts;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, nft.callStatic.collect({
                                        tokenId: tokenId,
                                        recipient: wallets[0].address,
                                        amount0Max: constants_1.MaxUint128,
                                        amount1Max: constants_1.MaxUint128,
                                    })];
                                case 1:
                                    feesFromCollect = _a.sent();
                                    return [4 /*yield*/, positionValue.fees(nft.address, tokenId)];
                                case 2:
                                    feeAmounts = _a.sent();
                                    (0, expect_1.expect)(feeAmounts[0]).to.equal(feesFromCollect[0]);
                                    (0, expect_1.expect)(feeAmounts[1]).to.equal(feesFromCollect[1]);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(positionValue.feesGas(nft.address, tokenId))];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
                });
            }); });
        });
        return [2 /*return*/];
    });
}); });
