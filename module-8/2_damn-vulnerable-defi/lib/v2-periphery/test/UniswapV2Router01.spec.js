"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var chai_1 = __importStar(require("chai"));
var constants_1 = require("ethers/constants");
var utils_1 = require("ethers/utils");
var ethereum_waffle_1 = require("ethereum-waffle");
var ethereumjs_util_1 = require("ethereumjs-util");
var utilities_1 = require("./shared/utilities");
var fixtures_1 = require("./shared/fixtures");
chai_1.default.use(ethereum_waffle_1.solidity);
var overrides = {
    gasLimit: 9999999
};
var RouterVersion;
(function (RouterVersion) {
    RouterVersion["UniswapV2Router01"] = "UniswapV2Router01";
    RouterVersion["UniswapV2Router02"] = "UniswapV2Router02";
})(RouterVersion || (RouterVersion = {}));
describe('UniswapV2Router{01,02}', function () {
    var _loop_1 = function (routerVersion) {
        var provider = new ethereum_waffle_1.MockProvider({
            hardfork: 'istanbul',
            mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
            gasLimit: 9999999
        });
        var wallet = provider.getWallets()[0];
        var loadFixture = (0, ethereum_waffle_1.createFixtureLoader)(provider, [wallet]);
        var token0;
        var token1;
        var WETH;
        var WETHPartner;
        var factory;
        var router;
        var pair;
        var WETHPair;
        var routerEventEmitter;
        beforeEach(function () {
            return __awaiter(this, void 0, void 0, function () {
                var fixture;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, loadFixture(fixtures_1.v2Fixture)];
                        case 1:
                            fixture = _b.sent();
                            token0 = fixture.token0;
                            token1 = fixture.token1;
                            WETH = fixture.WETH;
                            WETHPartner = fixture.WETHPartner;
                            factory = fixture.factoryV2;
                            router = (_a = {},
                                _a[RouterVersion.UniswapV2Router01] = fixture.router01,
                                _a[RouterVersion.UniswapV2Router02] = fixture.router02,
                                _a)[routerVersion];
                            pair = fixture.pair;
                            WETHPair = fixture.WETHPair;
                            routerEventEmitter = fixture.routerEventEmitter;
                            return [2 /*return*/];
                    }
                });
            });
        });
        afterEach(function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = chai_1.expect;
                            return [4 /*yield*/, provider.getBalance(router.address)];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq(constants_1.Zero);
                            return [2 /*return*/];
                    }
                });
            });
        });
        describe(routerVersion, function () {
            it('factory, WETH', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = chai_1.expect;
                            return [4 /*yield*/, router.factory()];
                        case 1:
                            _a.apply(void 0, [_c.sent()]).to.eq(factory.address);
                            _b = chai_1.expect;
                            return [4 /*yield*/, router.WETH()];
                        case 2:
                            _b.apply(void 0, [_c.sent()]).to.eq(WETH.address);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('addLiquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
                var token0Amount, token1Amount, expectedLiquidity, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            token0Amount = (0, utilities_1.expandTo18Decimals)(1);
                            token1Amount = (0, utilities_1.expandTo18Decimals)(4);
                            expectedLiquidity = (0, utilities_1.expandTo18Decimals)(2);
                            return [4 /*yield*/, token0.approve(router.address, constants_1.MaxUint256)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, token1.approve(router.address, constants_1.MaxUint256)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, (0, chai_1.expect)(router.addLiquidity(token0.address, token1.address, token0Amount, token1Amount, 0, 0, wallet.address, constants_1.MaxUint256, overrides))
                                    .to.emit(token0, 'Transfer')
                                    .withArgs(wallet.address, pair.address, token0Amount)
                                    .to.emit(token1, 'Transfer')
                                    .withArgs(wallet.address, pair.address, token1Amount)
                                    .to.emit(pair, 'Transfer')
                                    .withArgs(constants_1.AddressZero, constants_1.AddressZero, utilities_1.MINIMUM_LIQUIDITY)
                                    .to.emit(pair, 'Transfer')
                                    .withArgs(constants_1.AddressZero, wallet.address, expectedLiquidity.sub(utilities_1.MINIMUM_LIQUIDITY))
                                    .to.emit(pair, 'Sync')
                                    .withArgs(token0Amount, token1Amount)
                                    .to.emit(pair, 'Mint')
                                    .withArgs(router.address, token0Amount, token1Amount)];
                        case 3:
                            _b.sent();
                            _a = chai_1.expect;
                            return [4 /*yield*/, pair.balanceOf(wallet.address)];
                        case 4:
                            _a.apply(void 0, [_b.sent()]).to.eq(expectedLiquidity.sub(utilities_1.MINIMUM_LIQUIDITY));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('addLiquidityETH', function () { return __awaiter(void 0, void 0, void 0, function () {
                var WETHPartnerAmount, ETHAmount, expectedLiquidity, WETHPairToken0, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            WETHPartnerAmount = (0, utilities_1.expandTo18Decimals)(1);
                            ETHAmount = (0, utilities_1.expandTo18Decimals)(4);
                            expectedLiquidity = (0, utilities_1.expandTo18Decimals)(2);
                            return [4 /*yield*/, WETHPair.token0()];
                        case 1:
                            WETHPairToken0 = _b.sent();
                            return [4 /*yield*/, WETHPartner.approve(router.address, constants_1.MaxUint256)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, (0, chai_1.expect)(router.addLiquidityETH(WETHPartner.address, WETHPartnerAmount, WETHPartnerAmount, ETHAmount, wallet.address, constants_1.MaxUint256, __assign(__assign({}, overrides), { value: ETHAmount })))
                                    .to.emit(WETHPair, 'Transfer')
                                    .withArgs(constants_1.AddressZero, constants_1.AddressZero, utilities_1.MINIMUM_LIQUIDITY)
                                    .to.emit(WETHPair, 'Transfer')
                                    .withArgs(constants_1.AddressZero, wallet.address, expectedLiquidity.sub(utilities_1.MINIMUM_LIQUIDITY))
                                    .to.emit(WETHPair, 'Sync')
                                    .withArgs(WETHPairToken0 === WETHPartner.address ? WETHPartnerAmount : ETHAmount, WETHPairToken0 === WETHPartner.address ? ETHAmount : WETHPartnerAmount)
                                    .to.emit(WETHPair, 'Mint')
                                    .withArgs(router.address, WETHPairToken0 === WETHPartner.address ? WETHPartnerAmount : ETHAmount, WETHPairToken0 === WETHPartner.address ? ETHAmount : WETHPartnerAmount)];
                        case 3:
                            _b.sent();
                            _a = chai_1.expect;
                            return [4 /*yield*/, WETHPair.balanceOf(wallet.address)];
                        case 4:
                            _a.apply(void 0, [_b.sent()]).to.eq(expectedLiquidity.sub(utilities_1.MINIMUM_LIQUIDITY));
                            return [2 /*return*/];
                    }
                });
            }); });
            function addLiquidity(token0Amount, token1Amount) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, token0.transfer(pair.address, token0Amount)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, token1.transfer(pair.address, token1Amount)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, pair.mint(wallet.address, overrides)];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
            it('removeLiquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
                var token0Amount, token1Amount, expectedLiquidity, _a, totalSupplyToken0, totalSupplyToken1, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            token0Amount = (0, utilities_1.expandTo18Decimals)(1);
                            token1Amount = (0, utilities_1.expandTo18Decimals)(4);
                            return [4 /*yield*/, addLiquidity(token0Amount, token1Amount)];
                        case 1:
                            _d.sent();
                            expectedLiquidity = (0, utilities_1.expandTo18Decimals)(2);
                            return [4 /*yield*/, pair.approve(router.address, constants_1.MaxUint256)];
                        case 2:
                            _d.sent();
                            return [4 /*yield*/, (0, chai_1.expect)(router.removeLiquidity(token0.address, token1.address, expectedLiquidity.sub(utilities_1.MINIMUM_LIQUIDITY), 0, 0, wallet.address, constants_1.MaxUint256, overrides))
                                    .to.emit(pair, 'Transfer')
                                    .withArgs(wallet.address, pair.address, expectedLiquidity.sub(utilities_1.MINIMUM_LIQUIDITY))
                                    .to.emit(pair, 'Transfer')
                                    .withArgs(pair.address, constants_1.AddressZero, expectedLiquidity.sub(utilities_1.MINIMUM_LIQUIDITY))
                                    .to.emit(token0, 'Transfer')
                                    .withArgs(pair.address, wallet.address, token0Amount.sub(500))
                                    .to.emit(token1, 'Transfer')
                                    .withArgs(pair.address, wallet.address, token1Amount.sub(2000))
                                    .to.emit(pair, 'Sync')
                                    .withArgs(500, 2000)
                                    .to.emit(pair, 'Burn')
                                    .withArgs(router.address, token0Amount.sub(500), token1Amount.sub(2000), wallet.address)];
                        case 3:
                            _d.sent();
                            _a = chai_1.expect;
                            return [4 /*yield*/, pair.balanceOf(wallet.address)];
                        case 4:
                            _a.apply(void 0, [_d.sent()]).to.eq(0);
                            return [4 /*yield*/, token0.totalSupply()];
                        case 5:
                            totalSupplyToken0 = _d.sent();
                            return [4 /*yield*/, token1.totalSupply()];
                        case 6:
                            totalSupplyToken1 = _d.sent();
                            _b = chai_1.expect;
                            return [4 /*yield*/, token0.balanceOf(wallet.address)];
                        case 7:
                            _b.apply(void 0, [_d.sent()]).to.eq(totalSupplyToken0.sub(500));
                            _c = chai_1.expect;
                            return [4 /*yield*/, token1.balanceOf(wallet.address)];
                        case 8:
                            _c.apply(void 0, [_d.sent()]).to.eq(totalSupplyToken1.sub(2000));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('removeLiquidityETH', function () { return __awaiter(void 0, void 0, void 0, function () {
                var WETHPartnerAmount, ETHAmount, expectedLiquidity, WETHPairToken0, _a, totalSupplyWETHPartner, totalSupplyWETH, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            WETHPartnerAmount = (0, utilities_1.expandTo18Decimals)(1);
                            ETHAmount = (0, utilities_1.expandTo18Decimals)(4);
                            return [4 /*yield*/, WETHPartner.transfer(WETHPair.address, WETHPartnerAmount)];
                        case 1:
                            _d.sent();
                            return [4 /*yield*/, WETH.deposit({ value: ETHAmount })];
                        case 2:
                            _d.sent();
                            return [4 /*yield*/, WETH.transfer(WETHPair.address, ETHAmount)];
                        case 3:
                            _d.sent();
                            return [4 /*yield*/, WETHPair.mint(wallet.address, overrides)];
                        case 4:
                            _d.sent();
                            expectedLiquidity = (0, utilities_1.expandTo18Decimals)(2);
                            return [4 /*yield*/, WETHPair.token0()];
                        case 5:
                            WETHPairToken0 = _d.sent();
                            return [4 /*yield*/, WETHPair.approve(router.address, constants_1.MaxUint256)];
                        case 6:
                            _d.sent();
                            return [4 /*yield*/, (0, chai_1.expect)(router.removeLiquidityETH(WETHPartner.address, expectedLiquidity.sub(utilities_1.MINIMUM_LIQUIDITY), 0, 0, wallet.address, constants_1.MaxUint256, overrides))
                                    .to.emit(WETHPair, 'Transfer')
                                    .withArgs(wallet.address, WETHPair.address, expectedLiquidity.sub(utilities_1.MINIMUM_LIQUIDITY))
                                    .to.emit(WETHPair, 'Transfer')
                                    .withArgs(WETHPair.address, constants_1.AddressZero, expectedLiquidity.sub(utilities_1.MINIMUM_LIQUIDITY))
                                    .to.emit(WETH, 'Transfer')
                                    .withArgs(WETHPair.address, router.address, ETHAmount.sub(2000))
                                    .to.emit(WETHPartner, 'Transfer')
                                    .withArgs(WETHPair.address, router.address, WETHPartnerAmount.sub(500))
                                    .to.emit(WETHPartner, 'Transfer')
                                    .withArgs(router.address, wallet.address, WETHPartnerAmount.sub(500))
                                    .to.emit(WETHPair, 'Sync')
                                    .withArgs(WETHPairToken0 === WETHPartner.address ? 500 : 2000, WETHPairToken0 === WETHPartner.address ? 2000 : 500)
                                    .to.emit(WETHPair, 'Burn')
                                    .withArgs(router.address, WETHPairToken0 === WETHPartner.address ? WETHPartnerAmount.sub(500) : ETHAmount.sub(2000), WETHPairToken0 === WETHPartner.address ? ETHAmount.sub(2000) : WETHPartnerAmount.sub(500), router.address)];
                        case 7:
                            _d.sent();
                            _a = chai_1.expect;
                            return [4 /*yield*/, WETHPair.balanceOf(wallet.address)];
                        case 8:
                            _a.apply(void 0, [_d.sent()]).to.eq(0);
                            return [4 /*yield*/, WETHPartner.totalSupply()];
                        case 9:
                            totalSupplyWETHPartner = _d.sent();
                            return [4 /*yield*/, WETH.totalSupply()];
                        case 10:
                            totalSupplyWETH = _d.sent();
                            _b = chai_1.expect;
                            return [4 /*yield*/, WETHPartner.balanceOf(wallet.address)];
                        case 11:
                            _b.apply(void 0, [_d.sent()]).to.eq(totalSupplyWETHPartner.sub(500));
                            _c = chai_1.expect;
                            return [4 /*yield*/, WETH.balanceOf(wallet.address)];
                        case 12:
                            _c.apply(void 0, [_d.sent()]).to.eq(totalSupplyWETH.sub(2000));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('removeLiquidityWithPermit', function () { return __awaiter(void 0, void 0, void 0, function () {
                var token0Amount, token1Amount, expectedLiquidity, nonce, digest, _a, v, r, s;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            token0Amount = (0, utilities_1.expandTo18Decimals)(1);
                            token1Amount = (0, utilities_1.expandTo18Decimals)(4);
                            return [4 /*yield*/, addLiquidity(token0Amount, token1Amount)];
                        case 1:
                            _b.sent();
                            expectedLiquidity = (0, utilities_1.expandTo18Decimals)(2);
                            return [4 /*yield*/, pair.nonces(wallet.address)];
                        case 2:
                            nonce = _b.sent();
                            return [4 /*yield*/, (0, utilities_1.getApprovalDigest)(pair, { owner: wallet.address, spender: router.address, value: expectedLiquidity.sub(utilities_1.MINIMUM_LIQUIDITY) }, nonce, constants_1.MaxUint256)];
                        case 3:
                            digest = _b.sent();
                            _a = (0, ethereumjs_util_1.ecsign)(Buffer.from(digest.slice(2), 'hex'), Buffer.from(wallet.privateKey.slice(2), 'hex')), v = _a.v, r = _a.r, s = _a.s;
                            return [4 /*yield*/, router.removeLiquidityWithPermit(token0.address, token1.address, expectedLiquidity.sub(utilities_1.MINIMUM_LIQUIDITY), 0, 0, wallet.address, constants_1.MaxUint256, false, v, r, s, overrides)];
                        case 4:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('removeLiquidityETHWithPermit', function () { return __awaiter(void 0, void 0, void 0, function () {
                var WETHPartnerAmount, ETHAmount, expectedLiquidity, nonce, digest, _a, v, r, s;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            WETHPartnerAmount = (0, utilities_1.expandTo18Decimals)(1);
                            ETHAmount = (0, utilities_1.expandTo18Decimals)(4);
                            return [4 /*yield*/, WETHPartner.transfer(WETHPair.address, WETHPartnerAmount)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, WETH.deposit({ value: ETHAmount })];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, WETH.transfer(WETHPair.address, ETHAmount)];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, WETHPair.mint(wallet.address, overrides)];
                        case 4:
                            _b.sent();
                            expectedLiquidity = (0, utilities_1.expandTo18Decimals)(2);
                            return [4 /*yield*/, WETHPair.nonces(wallet.address)];
                        case 5:
                            nonce = _b.sent();
                            return [4 /*yield*/, (0, utilities_1.getApprovalDigest)(WETHPair, { owner: wallet.address, spender: router.address, value: expectedLiquidity.sub(utilities_1.MINIMUM_LIQUIDITY) }, nonce, constants_1.MaxUint256)];
                        case 6:
                            digest = _b.sent();
                            _a = (0, ethereumjs_util_1.ecsign)(Buffer.from(digest.slice(2), 'hex'), Buffer.from(wallet.privateKey.slice(2), 'hex')), v = _a.v, r = _a.r, s = _a.s;
                            return [4 /*yield*/, router.removeLiquidityETHWithPermit(WETHPartner.address, expectedLiquidity.sub(utilities_1.MINIMUM_LIQUIDITY), 0, 0, wallet.address, constants_1.MaxUint256, false, v, r, s, overrides)];
                        case 7:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('swapExactTokensForTokens', function () {
                var token0Amount = (0, utilities_1.expandTo18Decimals)(5);
                var token1Amount = (0, utilities_1.expandTo18Decimals)(10);
                var swapAmount = (0, utilities_1.expandTo18Decimals)(1);
                var expectedOutputAmount = (0, utils_1.bigNumberify)('1662497915624478906');
                beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, addLiquidity(token0Amount, token1Amount)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, token0.approve(router.address, constants_1.MaxUint256)];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('happy path', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, chai_1.expect)(router.swapExactTokensForTokens(swapAmount, 0, [token0.address, token1.address], wallet.address, constants_1.MaxUint256, overrides))
                                    .to.emit(token0, 'Transfer')
                                    .withArgs(wallet.address, pair.address, swapAmount)
                                    .to.emit(token1, 'Transfer')
                                    .withArgs(pair.address, wallet.address, expectedOutputAmount)
                                    .to.emit(pair, 'Sync')
                                    .withArgs(token0Amount.add(swapAmount), token1Amount.sub(expectedOutputAmount))
                                    .to.emit(pair, 'Swap')
                                    .withArgs(router.address, swapAmount, 0, 0, expectedOutputAmount, wallet.address)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('amounts', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, token0.approve(routerEventEmitter.address, constants_1.MaxUint256)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(routerEventEmitter.swapExactTokensForTokens(router.address, swapAmount, 0, [token0.address, token1.address], wallet.address, constants_1.MaxUint256, overrides))
                                        .to.emit(routerEventEmitter, 'Amounts')
                                        .withArgs([swapAmount, expectedOutputAmount])];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b, _c, _d, tx, receipt;
                    var _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                _a = utilities_1.mineBlock;
                                _b = [provider];
                                return [4 /*yield*/, provider.getBlock('latest')];
                            case 1: 
                            // ensure that setting price{0,1}CumulativeLast for the first time doesn't affect our gas math
                            return [4 /*yield*/, _a.apply(void 0, _b.concat([(_f.sent()).timestamp + 1]))];
                            case 2:
                                // ensure that setting price{0,1}CumulativeLast for the first time doesn't affect our gas math
                                _f.sent();
                                return [4 /*yield*/, pair.sync(overrides)];
                            case 3:
                                _f.sent();
                                return [4 /*yield*/, token0.approve(router.address, constants_1.MaxUint256)];
                            case 4:
                                _f.sent();
                                _c = utilities_1.mineBlock;
                                _d = [provider];
                                return [4 /*yield*/, provider.getBlock('latest')];
                            case 5: return [4 /*yield*/, _c.apply(void 0, _d.concat([(_f.sent()).timestamp + 1]))];
                            case 6:
                                _f.sent();
                                return [4 /*yield*/, router.swapExactTokensForTokens(swapAmount, 0, [token0.address, token1.address], wallet.address, constants_1.MaxUint256, overrides)];
                            case 7:
                                tx = _f.sent();
                                return [4 /*yield*/, tx.wait()];
                            case 8:
                                receipt = _f.sent();
                                (0, chai_1.expect)(receipt.gasUsed).to.eq((_e = {},
                                    _e[RouterVersion.UniswapV2Router01] = 101876,
                                    _e[RouterVersion.UniswapV2Router02] = 101898,
                                    _e)[routerVersion]);
                                return [2 /*return*/];
                        }
                    });
                }); }).retries(3);
            });
            describe('swapTokensForExactTokens', function () {
                var token0Amount = (0, utilities_1.expandTo18Decimals)(5);
                var token1Amount = (0, utilities_1.expandTo18Decimals)(10);
                var expectedSwapAmount = (0, utils_1.bigNumberify)('557227237267357629');
                var outputAmount = (0, utilities_1.expandTo18Decimals)(1);
                beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, addLiquidity(token0Amount, token1Amount)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('happy path', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, token0.approve(router.address, constants_1.MaxUint256)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(router.swapTokensForExactTokens(outputAmount, constants_1.MaxUint256, [token0.address, token1.address], wallet.address, constants_1.MaxUint256, overrides))
                                        .to.emit(token0, 'Transfer')
                                        .withArgs(wallet.address, pair.address, expectedSwapAmount)
                                        .to.emit(token1, 'Transfer')
                                        .withArgs(pair.address, wallet.address, outputAmount)
                                        .to.emit(pair, 'Sync')
                                        .withArgs(token0Amount.add(expectedSwapAmount), token1Amount.sub(outputAmount))
                                        .to.emit(pair, 'Swap')
                                        .withArgs(router.address, expectedSwapAmount, 0, 0, outputAmount, wallet.address)];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('amounts', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, token0.approve(routerEventEmitter.address, constants_1.MaxUint256)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(routerEventEmitter.swapTokensForExactTokens(router.address, outputAmount, constants_1.MaxUint256, [token0.address, token1.address], wallet.address, constants_1.MaxUint256, overrides))
                                        .to.emit(routerEventEmitter, 'Amounts')
                                        .withArgs([expectedSwapAmount, outputAmount])];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('swapExactETHForTokens', function () {
                var WETHPartnerAmount = (0, utilities_1.expandTo18Decimals)(10);
                var ETHAmount = (0, utilities_1.expandTo18Decimals)(5);
                var swapAmount = (0, utilities_1.expandTo18Decimals)(1);
                var expectedOutputAmount = (0, utils_1.bigNumberify)('1662497915624478906');
                beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, WETHPartner.transfer(WETHPair.address, WETHPartnerAmount)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, WETH.deposit({ value: ETHAmount })];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, WETH.transfer(WETHPair.address, ETHAmount)];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, WETHPair.mint(wallet.address, overrides)];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, token0.approve(router.address, constants_1.MaxUint256)];
                            case 5:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('happy path', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var WETHPairToken0;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, WETHPair.token0()];
                            case 1:
                                WETHPairToken0 = _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(router.swapExactETHForTokens(0, [WETH.address, WETHPartner.address], wallet.address, constants_1.MaxUint256, __assign(__assign({}, overrides), { value: swapAmount })))
                                        .to.emit(WETH, 'Transfer')
                                        .withArgs(router.address, WETHPair.address, swapAmount)
                                        .to.emit(WETHPartner, 'Transfer')
                                        .withArgs(WETHPair.address, wallet.address, expectedOutputAmount)
                                        .to.emit(WETHPair, 'Sync')
                                        .withArgs(WETHPairToken0 === WETHPartner.address
                                        ? WETHPartnerAmount.sub(expectedOutputAmount)
                                        : ETHAmount.add(swapAmount), WETHPairToken0 === WETHPartner.address
                                        ? ETHAmount.add(swapAmount)
                                        : WETHPartnerAmount.sub(expectedOutputAmount))
                                        .to.emit(WETHPair, 'Swap')
                                        .withArgs(router.address, WETHPairToken0 === WETHPartner.address ? 0 : swapAmount, WETHPairToken0 === WETHPartner.address ? swapAmount : 0, WETHPairToken0 === WETHPartner.address ? expectedOutputAmount : 0, WETHPairToken0 === WETHPartner.address ? 0 : expectedOutputAmount, wallet.address)];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('amounts', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, chai_1.expect)(routerEventEmitter.swapExactETHForTokens(router.address, 0, [WETH.address, WETHPartner.address], wallet.address, constants_1.MaxUint256, __assign(__assign({}, overrides), { value: swapAmount })))
                                    .to.emit(routerEventEmitter, 'Amounts')
                                    .withArgs([swapAmount, expectedOutputAmount])];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var WETHPartnerAmount, ETHAmount, _a, _b, swapAmount, _c, _d, tx, receipt;
                    var _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                WETHPartnerAmount = (0, utilities_1.expandTo18Decimals)(10);
                                ETHAmount = (0, utilities_1.expandTo18Decimals)(5);
                                return [4 /*yield*/, WETHPartner.transfer(WETHPair.address, WETHPartnerAmount)];
                            case 1:
                                _f.sent();
                                return [4 /*yield*/, WETH.deposit({ value: ETHAmount })];
                            case 2:
                                _f.sent();
                                return [4 /*yield*/, WETH.transfer(WETHPair.address, ETHAmount)];
                            case 3:
                                _f.sent();
                                return [4 /*yield*/, WETHPair.mint(wallet.address, overrides)
                                    // ensure that setting price{0,1}CumulativeLast for the first time doesn't affect our gas math
                                ];
                            case 4:
                                _f.sent();
                                _a = utilities_1.mineBlock;
                                _b = [provider];
                                return [4 /*yield*/, provider.getBlock('latest')];
                            case 5: 
                            // ensure that setting price{0,1}CumulativeLast for the first time doesn't affect our gas math
                            return [4 /*yield*/, _a.apply(void 0, _b.concat([(_f.sent()).timestamp + 1]))];
                            case 6:
                                // ensure that setting price{0,1}CumulativeLast for the first time doesn't affect our gas math
                                _f.sent();
                                return [4 /*yield*/, pair.sync(overrides)];
                            case 7:
                                _f.sent();
                                swapAmount = (0, utilities_1.expandTo18Decimals)(1);
                                _c = utilities_1.mineBlock;
                                _d = [provider];
                                return [4 /*yield*/, provider.getBlock('latest')];
                            case 8: return [4 /*yield*/, _c.apply(void 0, _d.concat([(_f.sent()).timestamp + 1]))];
                            case 9:
                                _f.sent();
                                return [4 /*yield*/, router.swapExactETHForTokens(0, [WETH.address, WETHPartner.address], wallet.address, constants_1.MaxUint256, __assign(__assign({}, overrides), { value: swapAmount }))];
                            case 10:
                                tx = _f.sent();
                                return [4 /*yield*/, tx.wait()];
                            case 11:
                                receipt = _f.sent();
                                (0, chai_1.expect)(receipt.gasUsed).to.eq((_e = {},
                                    _e[RouterVersion.UniswapV2Router01] = 138770,
                                    _e[RouterVersion.UniswapV2Router02] = 138770,
                                    _e)[routerVersion]);
                                return [2 /*return*/];
                        }
                    });
                }); }).retries(3);
            });
            describe('swapTokensForExactETH', function () {
                var WETHPartnerAmount = (0, utilities_1.expandTo18Decimals)(5);
                var ETHAmount = (0, utilities_1.expandTo18Decimals)(10);
                var expectedSwapAmount = (0, utils_1.bigNumberify)('557227237267357629');
                var outputAmount = (0, utilities_1.expandTo18Decimals)(1);
                beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, WETHPartner.transfer(WETHPair.address, WETHPartnerAmount)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, WETH.deposit({ value: ETHAmount })];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, WETH.transfer(WETHPair.address, ETHAmount)];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, WETHPair.mint(wallet.address, overrides)];
                            case 4:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('happy path', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var WETHPairToken0;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, WETHPartner.approve(router.address, constants_1.MaxUint256)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, WETHPair.token0()];
                            case 2:
                                WETHPairToken0 = _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(router.swapTokensForExactETH(outputAmount, constants_1.MaxUint256, [WETHPartner.address, WETH.address], wallet.address, constants_1.MaxUint256, overrides))
                                        .to.emit(WETHPartner, 'Transfer')
                                        .withArgs(wallet.address, WETHPair.address, expectedSwapAmount)
                                        .to.emit(WETH, 'Transfer')
                                        .withArgs(WETHPair.address, router.address, outputAmount)
                                        .to.emit(WETHPair, 'Sync')
                                        .withArgs(WETHPairToken0 === WETHPartner.address
                                        ? WETHPartnerAmount.add(expectedSwapAmount)
                                        : ETHAmount.sub(outputAmount), WETHPairToken0 === WETHPartner.address
                                        ? ETHAmount.sub(outputAmount)
                                        : WETHPartnerAmount.add(expectedSwapAmount))
                                        .to.emit(WETHPair, 'Swap')
                                        .withArgs(router.address, WETHPairToken0 === WETHPartner.address ? expectedSwapAmount : 0, WETHPairToken0 === WETHPartner.address ? 0 : expectedSwapAmount, WETHPairToken0 === WETHPartner.address ? 0 : outputAmount, WETHPairToken0 === WETHPartner.address ? outputAmount : 0, router.address)];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('amounts', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, WETHPartner.approve(routerEventEmitter.address, constants_1.MaxUint256)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(routerEventEmitter.swapTokensForExactETH(router.address, outputAmount, constants_1.MaxUint256, [WETHPartner.address, WETH.address], wallet.address, constants_1.MaxUint256, overrides))
                                        .to.emit(routerEventEmitter, 'Amounts')
                                        .withArgs([expectedSwapAmount, outputAmount])];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('swapExactTokensForETH', function () {
                var WETHPartnerAmount = (0, utilities_1.expandTo18Decimals)(5);
                var ETHAmount = (0, utilities_1.expandTo18Decimals)(10);
                var swapAmount = (0, utilities_1.expandTo18Decimals)(1);
                var expectedOutputAmount = (0, utils_1.bigNumberify)('1662497915624478906');
                beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, WETHPartner.transfer(WETHPair.address, WETHPartnerAmount)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, WETH.deposit({ value: ETHAmount })];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, WETH.transfer(WETHPair.address, ETHAmount)];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, WETHPair.mint(wallet.address, overrides)];
                            case 4:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('happy path', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var WETHPairToken0;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, WETHPartner.approve(router.address, constants_1.MaxUint256)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, WETHPair.token0()];
                            case 2:
                                WETHPairToken0 = _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(router.swapExactTokensForETH(swapAmount, 0, [WETHPartner.address, WETH.address], wallet.address, constants_1.MaxUint256, overrides))
                                        .to.emit(WETHPartner, 'Transfer')
                                        .withArgs(wallet.address, WETHPair.address, swapAmount)
                                        .to.emit(WETH, 'Transfer')
                                        .withArgs(WETHPair.address, router.address, expectedOutputAmount)
                                        .to.emit(WETHPair, 'Sync')
                                        .withArgs(WETHPairToken0 === WETHPartner.address
                                        ? WETHPartnerAmount.add(swapAmount)
                                        : ETHAmount.sub(expectedOutputAmount), WETHPairToken0 === WETHPartner.address
                                        ? ETHAmount.sub(expectedOutputAmount)
                                        : WETHPartnerAmount.add(swapAmount))
                                        .to.emit(WETHPair, 'Swap')
                                        .withArgs(router.address, WETHPairToken0 === WETHPartner.address ? swapAmount : 0, WETHPairToken0 === WETHPartner.address ? 0 : swapAmount, WETHPairToken0 === WETHPartner.address ? 0 : expectedOutputAmount, WETHPairToken0 === WETHPartner.address ? expectedOutputAmount : 0, router.address)];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('amounts', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, WETHPartner.approve(routerEventEmitter.address, constants_1.MaxUint256)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(routerEventEmitter.swapExactTokensForETH(router.address, swapAmount, 0, [WETHPartner.address, WETH.address], wallet.address, constants_1.MaxUint256, overrides))
                                        .to.emit(routerEventEmitter, 'Amounts')
                                        .withArgs([swapAmount, expectedOutputAmount])];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('swapETHForExactTokens', function () {
                var WETHPartnerAmount = (0, utilities_1.expandTo18Decimals)(10);
                var ETHAmount = (0, utilities_1.expandTo18Decimals)(5);
                var expectedSwapAmount = (0, utils_1.bigNumberify)('557227237267357629');
                var outputAmount = (0, utilities_1.expandTo18Decimals)(1);
                beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, WETHPartner.transfer(WETHPair.address, WETHPartnerAmount)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, WETH.deposit({ value: ETHAmount })];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, WETH.transfer(WETHPair.address, ETHAmount)];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, WETHPair.mint(wallet.address, overrides)];
                            case 4:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('happy path', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var WETHPairToken0;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, WETHPair.token0()];
                            case 1:
                                WETHPairToken0 = _a.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(router.swapETHForExactTokens(outputAmount, [WETH.address, WETHPartner.address], wallet.address, constants_1.MaxUint256, __assign(__assign({}, overrides), { value: expectedSwapAmount })))
                                        .to.emit(WETH, 'Transfer')
                                        .withArgs(router.address, WETHPair.address, expectedSwapAmount)
                                        .to.emit(WETHPartner, 'Transfer')
                                        .withArgs(WETHPair.address, wallet.address, outputAmount)
                                        .to.emit(WETHPair, 'Sync')
                                        .withArgs(WETHPairToken0 === WETHPartner.address
                                        ? WETHPartnerAmount.sub(outputAmount)
                                        : ETHAmount.add(expectedSwapAmount), WETHPairToken0 === WETHPartner.address
                                        ? ETHAmount.add(expectedSwapAmount)
                                        : WETHPartnerAmount.sub(outputAmount))
                                        .to.emit(WETHPair, 'Swap')
                                        .withArgs(router.address, WETHPairToken0 === WETHPartner.address ? 0 : expectedSwapAmount, WETHPairToken0 === WETHPartner.address ? expectedSwapAmount : 0, WETHPairToken0 === WETHPartner.address ? outputAmount : 0, WETHPairToken0 === WETHPartner.address ? 0 : outputAmount, wallet.address)];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('amounts', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, chai_1.expect)(routerEventEmitter.swapETHForExactTokens(router.address, outputAmount, [WETH.address, WETHPartner.address], wallet.address, constants_1.MaxUint256, __assign(__assign({}, overrides), { value: expectedSwapAmount })))
                                    .to.emit(routerEventEmitter, 'Amounts')
                                    .withArgs([expectedSwapAmount, outputAmount])];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    };
    for (var _i = 0, _a = Object.keys(RouterVersion); _i < _a.length; _i++) {
        var routerVersion = _a[_i];
        _loop_1(routerVersion);
    }
});
