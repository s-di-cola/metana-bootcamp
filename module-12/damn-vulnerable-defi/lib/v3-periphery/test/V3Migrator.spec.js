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
var externalFixtures_1 = require("./shared/externalFixtures");
var UniswapV2Pair_json_1 = require("@uniswap/v2-core/build/UniswapV2Pair.json");
var chai_1 = require("chai");
var constants_1 = require("./shared/constants");
var encodePriceSqrt_1 = require("./shared/encodePriceSqrt");
var snapshotGasCost_1 = require("./shared/snapshotGasCost");
var tokenSort_1 = require("./shared/tokenSort");
var ticks_1 = require("./shared/ticks");
describe('V3Migrator', function () {
    var wallet;
    var migratorFixture = function (wallets, provider) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, factory, tokens, nft, weth9, factoryV2, token, migrator;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, completeFixture_1.default)(wallets, provider)];
                case 1:
                    _a = _b.sent(), factory = _a.factory, tokens = _a.tokens, nft = _a.nft, weth9 = _a.weth9;
                    return [4 /*yield*/, (0, externalFixtures_1.v2FactoryFixture)(wallets, provider)];
                case 2:
                    factoryV2 = (_b.sent()).factory;
                    token = tokens[0];
                    return [4 /*yield*/, token.approve(factoryV2.address, ethers_1.constants.MaxUint256)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, weth9.deposit({ value: 10000 })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, weth9.approve(nft.address, ethers_1.constants.MaxUint256)
                        // deploy the migrator
                    ];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('V3Migrator')];
                case 6: return [4 /*yield*/, (_b.sent()).deploy(factory.address, weth9.address, nft.address)];
                case 7:
                    migrator = (_b.sent());
                    return [2 /*return*/, {
                            factoryV2: factoryV2,
                            factoryV3: factory,
                            token: token,
                            weth9: weth9,
                            nft: nft,
                            migrator: migrator,
                        }];
            }
        });
    }); };
    var factoryV2;
    var factoryV3;
    var token;
    var weth9;
    var nft;
    var migrator;
    var pair;
    var loadFixture;
    var expectedLiquidity = 10000 - 1000;
    before('create fixture loader', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wallets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    wallets = _a.sent();
                    wallet = wallets[0];
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
                    return [4 /*yield*/, loadFixture(migratorFixture)];
                case 1:
                    (_a = _b.sent(), factoryV2 = _a.factoryV2, factoryV3 = _a.factoryV3, token = _a.token, weth9 = _a.weth9, nft = _a.nft, migrator = _a.migrator);
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach('add V2 liquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pairAddress, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, factoryV2.createPair(token.address, weth9.address)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, factoryV2.getPair(token.address, weth9.address)];
                case 2:
                    pairAddress = _b.sent();
                    pair = new hardhat_1.ethers.Contract(pairAddress, UniswapV2Pair_json_1.abi, wallet);
                    return [4 /*yield*/, token.transfer(pair.address, 10000)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, weth9.transfer(pair.address, 10000)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, pair.mint(wallet.address)];
                case 5:
                    _b.sent();
                    _a = chai_1.expect;
                    return [4 /*yield*/, pair.balanceOf(wallet.address)];
                case 6:
                    _a.apply(void 0, [_b.sent()]).to.be.eq(expectedLiquidity);
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach('ensure allowances are cleared', function () { return __awaiter(void 0, void 0, void 0, function () {
        var allowanceToken, allowanceWETH9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, token.allowance(migrator.address, nft.address)];
                case 1:
                    allowanceToken = _a.sent();
                    return [4 /*yield*/, weth9.allowance(migrator.address, nft.address)];
                case 2:
                    allowanceWETH9 = _a.sent();
                    (0, chai_1.expect)(allowanceToken).to.be.eq(0);
                    (0, chai_1.expect)(allowanceWETH9).to.be.eq(0);
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach('ensure balances are cleared', function () { return __awaiter(void 0, void 0, void 0, function () {
        var balanceToken, balanceWETH9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, token.balanceOf(migrator.address)];
                case 1:
                    balanceToken = _a.sent();
                    return [4 /*yield*/, weth9.balanceOf(migrator.address)];
                case 2:
                    balanceWETH9 = _a.sent();
                    (0, chai_1.expect)(balanceToken).to.be.eq(0);
                    (0, chai_1.expect)(balanceWETH9).to.be.eq(0);
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach('ensure eth balance is cleared', function () { return __awaiter(void 0, void 0, void 0, function () {
        var balanceETH;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.provider.getBalance(migrator.address)];
                case 1:
                    balanceETH = _a.sent();
                    (0, chai_1.expect)(balanceETH).to.be.eq(0);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#migrate', function () {
        var tokenLower;
        beforeEach(function () {
            tokenLower = token.address.toLowerCase() < weth9.address.toLowerCase();
        });
        it('fails if v3 pool is not initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pair.approve(migrator.address, expectedLiquidity)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(migrator.migrate({
                                pair: pair.address,
                                liquidityToMigrate: expectedLiquidity,
                                percentageToMigrate: 100,
                                token0: tokenLower ? token.address : weth9.address,
                                token1: tokenLower ? weth9.address : token.address,
                                fee: constants_1.FeeAmount.MEDIUM,
                                tickLower: -1,
                                tickUpper: 1,
                                amount0Min: 9000,
                                amount1Min: 9000,
                                recipient: wallet.address,
                                deadline: 1,
                                refundAsETH: false,
                            })).to.be.reverted];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('works once v3 pool is initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0, token1, position, poolAddress, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = (0, tokenSort_1.sortedTokens)(weth9, token), token0 = _a[0], token1 = _a[1];
                        return [4 /*yield*/, migrator.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, pair.approve(migrator.address, expectedLiquidity)];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, migrator.migrate({
                                pair: pair.address,
                                liquidityToMigrate: expectedLiquidity,
                                percentageToMigrate: 100,
                                token0: tokenLower ? token.address : weth9.address,
                                token1: tokenLower ? weth9.address : token.address,
                                fee: constants_1.FeeAmount.MEDIUM,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.FeeAmount.MEDIUM),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.FeeAmount.MEDIUM),
                                amount0Min: 9000,
                                amount1Min: 9000,
                                recipient: wallet.address,
                                deadline: 1,
                                refundAsETH: false,
                            })];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, nft.positions(1)];
                    case 4:
                        position = _d.sent();
                        (0, chai_1.expect)(position.liquidity).to.be.eq(9000);
                        return [4 /*yield*/, factoryV3.getPool(token.address, weth9.address, constants_1.FeeAmount.MEDIUM)];
                    case 5:
                        poolAddress = _d.sent();
                        _b = chai_1.expect;
                        return [4 /*yield*/, token.balanceOf(poolAddress)];
                    case 6:
                        _b.apply(void 0, [_d.sent()]).to.be.eq(9000);
                        _c = chai_1.expect;
                        return [4 /*yield*/, weth9.balanceOf(poolAddress)];
                    case 7:
                        _c.apply(void 0, [_d.sent()]).to.be.eq(9000);
                        return [2 /*return*/];
                }
            });
        }); });
        it('works for partial', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0, token1, tokenBalanceBefore, weth9BalanceBefore, tokenBalanceAfter, weth9BalanceAfter, position, poolAddress, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = (0, tokenSort_1.sortedTokens)(weth9, token), token0 = _a[0], token1 = _a[1];
                        return [4 /*yield*/, migrator.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, token.balanceOf(wallet.address)];
                    case 2:
                        tokenBalanceBefore = _d.sent();
                        return [4 /*yield*/, weth9.balanceOf(wallet.address)];
                    case 3:
                        weth9BalanceBefore = _d.sent();
                        return [4 /*yield*/, pair.approve(migrator.address, expectedLiquidity)];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, migrator.migrate({
                                pair: pair.address,
                                liquidityToMigrate: expectedLiquidity,
                                percentageToMigrate: 50,
                                token0: tokenLower ? token.address : weth9.address,
                                token1: tokenLower ? weth9.address : token.address,
                                fee: constants_1.FeeAmount.MEDIUM,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.FeeAmount.MEDIUM),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.FeeAmount.MEDIUM),
                                amount0Min: 4500,
                                amount1Min: 4500,
                                recipient: wallet.address,
                                deadline: 1,
                                refundAsETH: false,
                            })];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, token.balanceOf(wallet.address)];
                    case 6:
                        tokenBalanceAfter = _d.sent();
                        return [4 /*yield*/, weth9.balanceOf(wallet.address)];
                    case 7:
                        weth9BalanceAfter = _d.sent();
                        (0, chai_1.expect)(tokenBalanceAfter.sub(tokenBalanceBefore)).to.be.eq(4500);
                        (0, chai_1.expect)(weth9BalanceAfter.sub(weth9BalanceBefore)).to.be.eq(4500);
                        return [4 /*yield*/, nft.positions(1)];
                    case 8:
                        position = _d.sent();
                        (0, chai_1.expect)(position.liquidity).to.be.eq(4500);
                        return [4 /*yield*/, factoryV3.getPool(token.address, weth9.address, constants_1.FeeAmount.MEDIUM)];
                    case 9:
                        poolAddress = _d.sent();
                        _b = chai_1.expect;
                        return [4 /*yield*/, token.balanceOf(poolAddress)];
                    case 10:
                        _b.apply(void 0, [_d.sent()]).to.be.eq(4500);
                        _c = chai_1.expect;
                        return [4 /*yield*/, weth9.balanceOf(poolAddress)];
                    case 11:
                        _c.apply(void 0, [_d.sent()]).to.be.eq(4500);
                        return [2 /*return*/];
                }
            });
        }); });
        it('double the price', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0, token1, tokenBalanceBefore, weth9BalanceBefore, tokenBalanceAfter, weth9BalanceAfter, position, poolAddress, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = (0, tokenSort_1.sortedTokens)(weth9, token), token0 = _a[0], token1 = _a[1];
                        return [4 /*yield*/, migrator.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(2, 1))];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, token.balanceOf(wallet.address)];
                    case 2:
                        tokenBalanceBefore = _f.sent();
                        return [4 /*yield*/, weth9.balanceOf(wallet.address)];
                    case 3:
                        weth9BalanceBefore = _f.sent();
                        return [4 /*yield*/, pair.approve(migrator.address, expectedLiquidity)];
                    case 4:
                        _f.sent();
                        return [4 /*yield*/, migrator.migrate({
                                pair: pair.address,
                                liquidityToMigrate: expectedLiquidity,
                                percentageToMigrate: 100,
                                token0: tokenLower ? token.address : weth9.address,
                                token1: tokenLower ? weth9.address : token.address,
                                fee: constants_1.FeeAmount.MEDIUM,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.FeeAmount.MEDIUM),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.FeeAmount.MEDIUM),
                                amount0Min: 4500,
                                amount1Min: 8999,
                                recipient: wallet.address,
                                deadline: 1,
                                refundAsETH: false,
                            })];
                    case 5:
                        _f.sent();
                        return [4 /*yield*/, token.balanceOf(wallet.address)];
                    case 6:
                        tokenBalanceAfter = _f.sent();
                        return [4 /*yield*/, weth9.balanceOf(wallet.address)];
                    case 7:
                        weth9BalanceAfter = _f.sent();
                        return [4 /*yield*/, nft.positions(1)];
                    case 8:
                        position = _f.sent();
                        (0, chai_1.expect)(position.liquidity).to.be.eq(6363);
                        return [4 /*yield*/, factoryV3.getPool(token.address, weth9.address, constants_1.FeeAmount.MEDIUM)];
                    case 9:
                        poolAddress = _f.sent();
                        if (!(token.address.toLowerCase() < weth9.address.toLowerCase())) return [3 /*break*/, 12];
                        _b = chai_1.expect;
                        return [4 /*yield*/, token.balanceOf(poolAddress)];
                    case 10:
                        _b.apply(void 0, [_f.sent()]).to.be.eq(4500);
                        (0, chai_1.expect)(tokenBalanceAfter.sub(tokenBalanceBefore)).to.be.eq(4500);
                        _c = chai_1.expect;
                        return [4 /*yield*/, weth9.balanceOf(poolAddress)];
                    case 11:
                        _c.apply(void 0, [_f.sent()]).to.be.eq(8999);
                        (0, chai_1.expect)(weth9BalanceAfter.sub(weth9BalanceBefore)).to.be.eq(1);
                        return [3 /*break*/, 15];
                    case 12:
                        _d = chai_1.expect;
                        return [4 /*yield*/, token.balanceOf(poolAddress)];
                    case 13:
                        _d.apply(void 0, [_f.sent()]).to.be.eq(8999);
                        (0, chai_1.expect)(tokenBalanceAfter.sub(tokenBalanceBefore)).to.be.eq(1);
                        _e = chai_1.expect;
                        return [4 /*yield*/, weth9.balanceOf(poolAddress)];
                    case 14:
                        _e.apply(void 0, [_f.sent()]).to.be.eq(4500);
                        (0, chai_1.expect)(weth9BalanceAfter.sub(weth9BalanceBefore)).to.be.eq(4500);
                        _f.label = 15;
                    case 15: return [2 /*return*/];
                }
            });
        }); });
        it('half the price', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0, token1, tokenBalanceBefore, weth9BalanceBefore, tokenBalanceAfter, weth9BalanceAfter, position, poolAddress, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = (0, tokenSort_1.sortedTokens)(weth9, token), token0 = _a[0], token1 = _a[1];
                        return [4 /*yield*/, migrator.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 2))];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, token.balanceOf(wallet.address)];
                    case 2:
                        tokenBalanceBefore = _f.sent();
                        return [4 /*yield*/, weth9.balanceOf(wallet.address)];
                    case 3:
                        weth9BalanceBefore = _f.sent();
                        return [4 /*yield*/, pair.approve(migrator.address, expectedLiquidity)];
                    case 4:
                        _f.sent();
                        return [4 /*yield*/, migrator.migrate({
                                pair: pair.address,
                                liquidityToMigrate: expectedLiquidity,
                                percentageToMigrate: 100,
                                token0: tokenLower ? token.address : weth9.address,
                                token1: tokenLower ? weth9.address : token.address,
                                fee: constants_1.FeeAmount.MEDIUM,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.FeeAmount.MEDIUM),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.FeeAmount.MEDIUM),
                                amount0Min: 8999,
                                amount1Min: 4500,
                                recipient: wallet.address,
                                deadline: 1,
                                refundAsETH: false,
                            })];
                    case 5:
                        _f.sent();
                        return [4 /*yield*/, token.balanceOf(wallet.address)];
                    case 6:
                        tokenBalanceAfter = _f.sent();
                        return [4 /*yield*/, weth9.balanceOf(wallet.address)];
                    case 7:
                        weth9BalanceAfter = _f.sent();
                        return [4 /*yield*/, nft.positions(1)];
                    case 8:
                        position = _f.sent();
                        (0, chai_1.expect)(position.liquidity).to.be.eq(6363);
                        return [4 /*yield*/, factoryV3.getPool(token.address, weth9.address, constants_1.FeeAmount.MEDIUM)];
                    case 9:
                        poolAddress = _f.sent();
                        if (!(token.address.toLowerCase() < weth9.address.toLowerCase())) return [3 /*break*/, 12];
                        _b = chai_1.expect;
                        return [4 /*yield*/, token.balanceOf(poolAddress)];
                    case 10:
                        _b.apply(void 0, [_f.sent()]).to.be.eq(8999);
                        (0, chai_1.expect)(tokenBalanceAfter.sub(tokenBalanceBefore)).to.be.eq(1);
                        _c = chai_1.expect;
                        return [4 /*yield*/, weth9.balanceOf(poolAddress)];
                    case 11:
                        _c.apply(void 0, [_f.sent()]).to.be.eq(4500);
                        (0, chai_1.expect)(weth9BalanceAfter.sub(weth9BalanceBefore)).to.be.eq(4500);
                        return [3 /*break*/, 15];
                    case 12:
                        _d = chai_1.expect;
                        return [4 /*yield*/, token.balanceOf(poolAddress)];
                    case 13:
                        _d.apply(void 0, [_f.sent()]).to.be.eq(4500);
                        (0, chai_1.expect)(tokenBalanceAfter.sub(tokenBalanceBefore)).to.be.eq(4500);
                        _e = chai_1.expect;
                        return [4 /*yield*/, weth9.balanceOf(poolAddress)];
                    case 14:
                        _e.apply(void 0, [_f.sent()]).to.be.eq(8999);
                        (0, chai_1.expect)(weth9BalanceAfter.sub(weth9BalanceBefore)).to.be.eq(1);
                        _f.label = 15;
                    case 15: return [2 /*return*/];
                }
            });
        }); });
        it('double the price - as ETH', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0, token1, tokenBalanceBefore, tokenBalanceAfter, position, poolAddress, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = (0, tokenSort_1.sortedTokens)(weth9, token), token0 = _a[0], token1 = _a[1];
                        return [4 /*yield*/, migrator.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(2, 1))];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, token.balanceOf(wallet.address)];
                    case 2:
                        tokenBalanceBefore = _f.sent();
                        return [4 /*yield*/, pair.approve(migrator.address, expectedLiquidity)];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(migrator.migrate({
                                pair: pair.address,
                                liquidityToMigrate: expectedLiquidity,
                                percentageToMigrate: 100,
                                token0: tokenLower ? token.address : weth9.address,
                                token1: tokenLower ? weth9.address : token.address,
                                fee: constants_1.FeeAmount.MEDIUM,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.FeeAmount.MEDIUM),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.FeeAmount.MEDIUM),
                                amount0Min: 4500,
                                amount1Min: 8999,
                                recipient: wallet.address,
                                deadline: 1,
                                refundAsETH: true,
                            }))
                                .to.emit(weth9, 'Withdrawal')
                                .withArgs(migrator.address, tokenLower ? 1 : 4500)];
                    case 4:
                        _f.sent();
                        return [4 /*yield*/, token.balanceOf(wallet.address)];
                    case 5:
                        tokenBalanceAfter = _f.sent();
                        return [4 /*yield*/, nft.positions(1)];
                    case 6:
                        position = _f.sent();
                        (0, chai_1.expect)(position.liquidity).to.be.eq(6363);
                        return [4 /*yield*/, factoryV3.getPool(token.address, weth9.address, constants_1.FeeAmount.MEDIUM)];
                    case 7:
                        poolAddress = _f.sent();
                        if (!tokenLower) return [3 /*break*/, 10];
                        _b = chai_1.expect;
                        return [4 /*yield*/, token.balanceOf(poolAddress)];
                    case 8:
                        _b.apply(void 0, [_f.sent()]).to.be.eq(4500);
                        (0, chai_1.expect)(tokenBalanceAfter.sub(tokenBalanceBefore)).to.be.eq(4500);
                        _c = chai_1.expect;
                        return [4 /*yield*/, weth9.balanceOf(poolAddress)];
                    case 9:
                        _c.apply(void 0, [_f.sent()]).to.be.eq(8999);
                        return [3 /*break*/, 13];
                    case 10:
                        _d = chai_1.expect;
                        return [4 /*yield*/, token.balanceOf(poolAddress)];
                    case 11:
                        _d.apply(void 0, [_f.sent()]).to.be.eq(8999);
                        (0, chai_1.expect)(tokenBalanceAfter.sub(tokenBalanceBefore)).to.be.eq(1);
                        _e = chai_1.expect;
                        return [4 /*yield*/, weth9.balanceOf(poolAddress)];
                    case 12:
                        _e.apply(void 0, [_f.sent()]).to.be.eq(4500);
                        _f.label = 13;
                    case 13: return [2 /*return*/];
                }
            });
        }); });
        it('half the price - as ETH', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0, token1, tokenBalanceBefore, tokenBalanceAfter, position, poolAddress, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = (0, tokenSort_1.sortedTokens)(weth9, token), token0 = _a[0], token1 = _a[1];
                        return [4 /*yield*/, migrator.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 2))];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, token.balanceOf(wallet.address)];
                    case 2:
                        tokenBalanceBefore = _f.sent();
                        return [4 /*yield*/, pair.approve(migrator.address, expectedLiquidity)];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(migrator.migrate({
                                pair: pair.address,
                                liquidityToMigrate: expectedLiquidity,
                                percentageToMigrate: 100,
                                token0: tokenLower ? token.address : weth9.address,
                                token1: tokenLower ? weth9.address : token.address,
                                fee: constants_1.FeeAmount.MEDIUM,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.FeeAmount.MEDIUM),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.FeeAmount.MEDIUM),
                                amount0Min: 8999,
                                amount1Min: 4500,
                                recipient: wallet.address,
                                deadline: 1,
                                refundAsETH: true,
                            }))
                                .to.emit(weth9, 'Withdrawal')
                                .withArgs(migrator.address, tokenLower ? 4500 : 1)];
                    case 4:
                        _f.sent();
                        return [4 /*yield*/, token.balanceOf(wallet.address)];
                    case 5:
                        tokenBalanceAfter = _f.sent();
                        return [4 /*yield*/, nft.positions(1)];
                    case 6:
                        position = _f.sent();
                        (0, chai_1.expect)(position.liquidity).to.be.eq(6363);
                        return [4 /*yield*/, factoryV3.getPool(token.address, weth9.address, constants_1.FeeAmount.MEDIUM)];
                    case 7:
                        poolAddress = _f.sent();
                        if (!tokenLower) return [3 /*break*/, 10];
                        _b = chai_1.expect;
                        return [4 /*yield*/, token.balanceOf(poolAddress)];
                    case 8:
                        _b.apply(void 0, [_f.sent()]).to.be.eq(8999);
                        (0, chai_1.expect)(tokenBalanceAfter.sub(tokenBalanceBefore)).to.be.eq(1);
                        _c = chai_1.expect;
                        return [4 /*yield*/, weth9.balanceOf(poolAddress)];
                    case 9:
                        _c.apply(void 0, [_f.sent()]).to.be.eq(4500);
                        return [3 /*break*/, 13];
                    case 10:
                        _d = chai_1.expect;
                        return [4 /*yield*/, token.balanceOf(poolAddress)];
                    case 11:
                        _d.apply(void 0, [_f.sent()]).to.be.eq(4500);
                        (0, chai_1.expect)(tokenBalanceAfter.sub(tokenBalanceBefore)).to.be.eq(4500);
                        _e = chai_1.expect;
                        return [4 /*yield*/, weth9.balanceOf(poolAddress)];
                    case 12:
                        _e.apply(void 0, [_f.sent()]).to.be.eq(8999);
                        _f.label = 13;
                    case 13: return [2 /*return*/];
                }
            });
        }); });
        it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0, token1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = (0, tokenSort_1.sortedTokens)(weth9, token), token0 = _a[0], token1 = _a[1];
                        return [4 /*yield*/, migrator.createAndInitializePoolIfNecessary(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, pair.approve(migrator.address, expectedLiquidity)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(migrator.migrate({
                                pair: pair.address,
                                liquidityToMigrate: expectedLiquidity,
                                percentageToMigrate: 100,
                                token0: tokenLower ? token.address : weth9.address,
                                token1: tokenLower ? weth9.address : token.address,
                                fee: constants_1.FeeAmount.MEDIUM,
                                tickLower: (0, ticks_1.getMinTick)(constants_1.FeeAmount.MEDIUM),
                                tickUpper: (0, ticks_1.getMaxTick)(constants_1.FeeAmount.MEDIUM),
                                amount0Min: 9000,
                                amount1Min: 9000,
                                recipient: wallet.address,
                                deadline: 1,
                                refundAsETH: false,
                            }))];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
