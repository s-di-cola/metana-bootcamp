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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = __importStar(require("chai"));
var ethereum_waffle_1 = require("ethereum-waffle");
var ethers_1 = require("ethers");
var utils_1 = require("ethers/utils");
var constants_1 = require("ethers/constants");
var IUniswapV2Pair_json_1 = __importDefault(require("@uniswap/v2-core/build/IUniswapV2Pair.json"));
var fixtures_1 = require("./shared/fixtures");
var utilities_1 = require("./shared/utilities");
var DeflatingERC20_json_1 = __importDefault(require("../build/DeflatingERC20.json"));
var ethereumjs_util_1 = require("ethereumjs-util");
chai_1.default.use(ethereum_waffle_1.solidity);
var overrides = {
    gasLimit: 9999999
};
describe('UniswapV2Router02', function () {
    var provider = new ethereum_waffle_1.MockProvider({
        hardfork: 'istanbul',
        mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
        gasLimit: 9999999
    });
    var wallet = provider.getWallets()[0];
    var loadFixture = (0, ethereum_waffle_1.createFixtureLoader)(provider, [wallet]);
    var token0;
    var token1;
    var router;
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function () {
            var fixture;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loadFixture(fixtures_1.v2Fixture)];
                    case 1:
                        fixture = _a.sent();
                        token0 = fixture.token0;
                        token1 = fixture.token1;
                        router = fixture.router02;
                        return [2 /*return*/];
                }
            });
        });
    });
    it('quote', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = chai_1.expect;
                    return [4 /*yield*/, router.quote((0, utils_1.bigNumberify)(1), (0, utils_1.bigNumberify)(100), (0, utils_1.bigNumberify)(200))];
                case 1:
                    _a.apply(void 0, [_c.sent()]).to.eq((0, utils_1.bigNumberify)(2));
                    _b = chai_1.expect;
                    return [4 /*yield*/, router.quote((0, utils_1.bigNumberify)(2), (0, utils_1.bigNumberify)(200), (0, utils_1.bigNumberify)(100))];
                case 2:
                    _b.apply(void 0, [_c.sent()]).to.eq((0, utils_1.bigNumberify)(1));
                    return [4 /*yield*/, (0, chai_1.expect)(router.quote((0, utils_1.bigNumberify)(0), (0, utils_1.bigNumberify)(100), (0, utils_1.bigNumberify)(200))).to.be.revertedWith('UniswapV2Library: INSUFFICIENT_AMOUNT')];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, chai_1.expect)(router.quote((0, utils_1.bigNumberify)(1), (0, utils_1.bigNumberify)(0), (0, utils_1.bigNumberify)(200))).to.be.revertedWith('UniswapV2Library: INSUFFICIENT_LIQUIDITY')];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, (0, chai_1.expect)(router.quote((0, utils_1.bigNumberify)(1), (0, utils_1.bigNumberify)(100), (0, utils_1.bigNumberify)(0))).to.be.revertedWith('UniswapV2Library: INSUFFICIENT_LIQUIDITY')];
                case 5:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('getAmountOut', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = chai_1.expect;
                    return [4 /*yield*/, router.getAmountOut((0, utils_1.bigNumberify)(2), (0, utils_1.bigNumberify)(100), (0, utils_1.bigNumberify)(100))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eq((0, utils_1.bigNumberify)(1));
                    return [4 /*yield*/, (0, chai_1.expect)(router.getAmountOut((0, utils_1.bigNumberify)(0), (0, utils_1.bigNumberify)(100), (0, utils_1.bigNumberify)(100))).to.be.revertedWith('UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, chai_1.expect)(router.getAmountOut((0, utils_1.bigNumberify)(2), (0, utils_1.bigNumberify)(0), (0, utils_1.bigNumberify)(100))).to.be.revertedWith('UniswapV2Library: INSUFFICIENT_LIQUIDITY')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, chai_1.expect)(router.getAmountOut((0, utils_1.bigNumberify)(2), (0, utils_1.bigNumberify)(100), (0, utils_1.bigNumberify)(0))).to.be.revertedWith('UniswapV2Library: INSUFFICIENT_LIQUIDITY')];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('getAmountIn', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = chai_1.expect;
                    return [4 /*yield*/, router.getAmountIn((0, utils_1.bigNumberify)(1), (0, utils_1.bigNumberify)(100), (0, utils_1.bigNumberify)(100))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eq((0, utils_1.bigNumberify)(2));
                    return [4 /*yield*/, (0, chai_1.expect)(router.getAmountIn((0, utils_1.bigNumberify)(0), (0, utils_1.bigNumberify)(100), (0, utils_1.bigNumberify)(100))).to.be.revertedWith('UniswapV2Library: INSUFFICIENT_OUTPUT_AMOUNT')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, chai_1.expect)(router.getAmountIn((0, utils_1.bigNumberify)(1), (0, utils_1.bigNumberify)(0), (0, utils_1.bigNumberify)(100))).to.be.revertedWith('UniswapV2Library: INSUFFICIENT_LIQUIDITY')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, chai_1.expect)(router.getAmountIn((0, utils_1.bigNumberify)(1), (0, utils_1.bigNumberify)(100), (0, utils_1.bigNumberify)(0))).to.be.revertedWith('UniswapV2Library: INSUFFICIENT_LIQUIDITY')];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('getAmountsOut', function () { return __awaiter(void 0, void 0, void 0, function () {
        var path, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, token0.approve(router.address, constants_1.MaxUint256)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, token1.approve(router.address, constants_1.MaxUint256)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, router.addLiquidity(token0.address, token1.address, (0, utils_1.bigNumberify)(10000), (0, utils_1.bigNumberify)(10000), 0, 0, wallet.address, constants_1.MaxUint256, overrides)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, chai_1.expect)(router.getAmountsOut((0, utils_1.bigNumberify)(2), [token0.address])).to.be.revertedWith('UniswapV2Library: INVALID_PATH')];
                case 4:
                    _b.sent();
                    path = [token0.address, token1.address];
                    _a = chai_1.expect;
                    return [4 /*yield*/, router.getAmountsOut((0, utils_1.bigNumberify)(2), path)];
                case 5:
                    _a.apply(void 0, [_b.sent()]).to.deep.eq([(0, utils_1.bigNumberify)(2), (0, utils_1.bigNumberify)(1)]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('getAmountsIn', function () { return __awaiter(void 0, void 0, void 0, function () {
        var path, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, token0.approve(router.address, constants_1.MaxUint256)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, token1.approve(router.address, constants_1.MaxUint256)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, router.addLiquidity(token0.address, token1.address, (0, utils_1.bigNumberify)(10000), (0, utils_1.bigNumberify)(10000), 0, 0, wallet.address, constants_1.MaxUint256, overrides)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, chai_1.expect)(router.getAmountsIn((0, utils_1.bigNumberify)(1), [token0.address])).to.be.revertedWith('UniswapV2Library: INVALID_PATH')];
                case 4:
                    _b.sent();
                    path = [token0.address, token1.address];
                    _a = chai_1.expect;
                    return [4 /*yield*/, router.getAmountsIn((0, utils_1.bigNumberify)(1), path)];
                case 5:
                    _a.apply(void 0, [_b.sent()]).to.deep.eq([(0, utils_1.bigNumberify)(2), (0, utils_1.bigNumberify)(1)]);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('fee-on-transfer tokens', function () {
    var provider = new ethereum_waffle_1.MockProvider({
        hardfork: 'istanbul',
        mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
        gasLimit: 9999999
    });
    var wallet = provider.getWallets()[0];
    var loadFixture = (0, ethereum_waffle_1.createFixtureLoader)(provider, [wallet]);
    var DTT;
    var WETH;
    var router;
    var pair;
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function () {
            var fixture, pairAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loadFixture(fixtures_1.v2Fixture)];
                    case 1:
                        fixture = _a.sent();
                        WETH = fixture.WETH;
                        router = fixture.router02;
                        return [4 /*yield*/, (0, ethereum_waffle_1.deployContract)(wallet, DeflatingERC20_json_1.default, [(0, utilities_1.expandTo18Decimals)(10000)])
                            // make a DTT<>WETH pair
                        ];
                    case 2:
                        DTT = _a.sent();
                        // make a DTT<>WETH pair
                        return [4 /*yield*/, fixture.factoryV2.createPair(DTT.address, WETH.address)];
                    case 3:
                        // make a DTT<>WETH pair
                        _a.sent();
                        return [4 /*yield*/, fixture.factoryV2.getPair(DTT.address, WETH.address)];
                    case 4:
                        pairAddress = _a.sent();
                        pair = new ethers_1.Contract(pairAddress, JSON.stringify(IUniswapV2Pair_json_1.default.abi), provider).connect(wallet);
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
                        _a.apply(void 0, [_b.sent()]).to.eq(0);
                        return [2 /*return*/];
                }
            });
        });
    });
    function addLiquidity(DTTAmount, WETHAmount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DTT.approve(router.address, constants_1.MaxUint256)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, router.addLiquidityETH(DTT.address, DTTAmount, DTTAmount, WETHAmount, wallet.address, constants_1.MaxUint256, __assign(__assign({}, overrides), { value: WETHAmount }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    it('removeLiquidityETHSupportingFeeOnTransferTokens', function () { return __awaiter(void 0, void 0, void 0, function () {
        var DTTAmount, ETHAmount, DTTInPair, WETHInPair, liquidity, totalSupply, NaiveDTTExpected, WETHExpected;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    DTTAmount = (0, utilities_1.expandTo18Decimals)(1);
                    ETHAmount = (0, utilities_1.expandTo18Decimals)(4);
                    return [4 /*yield*/, addLiquidity(DTTAmount, ETHAmount)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, DTT.balanceOf(pair.address)];
                case 2:
                    DTTInPair = _a.sent();
                    return [4 /*yield*/, WETH.balanceOf(pair.address)];
                case 3:
                    WETHInPair = _a.sent();
                    return [4 /*yield*/, pair.balanceOf(wallet.address)];
                case 4:
                    liquidity = _a.sent();
                    return [4 /*yield*/, pair.totalSupply()];
                case 5:
                    totalSupply = _a.sent();
                    NaiveDTTExpected = DTTInPair.mul(liquidity).div(totalSupply);
                    WETHExpected = WETHInPair.mul(liquidity).div(totalSupply);
                    return [4 /*yield*/, pair.approve(router.address, constants_1.MaxUint256)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, router.removeLiquidityETHSupportingFeeOnTransferTokens(DTT.address, liquidity, NaiveDTTExpected, WETHExpected, wallet.address, constants_1.MaxUint256, overrides)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('removeLiquidityETHWithPermitSupportingFeeOnTransferTokens', function () { return __awaiter(void 0, void 0, void 0, function () {
        var DTTAmount, ETHAmount, expectedLiquidity, nonce, digest, _a, v, r, s, DTTInPair, WETHInPair, liquidity, totalSupply, NaiveDTTExpected, WETHExpected;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    DTTAmount = (0, utilities_1.expandTo18Decimals)(1)
                        .mul(100)
                        .div(99);
                    ETHAmount = (0, utilities_1.expandTo18Decimals)(4);
                    return [4 /*yield*/, addLiquidity(DTTAmount, ETHAmount)];
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
                    return [4 /*yield*/, DTT.balanceOf(pair.address)];
                case 4:
                    DTTInPair = _b.sent();
                    return [4 /*yield*/, WETH.balanceOf(pair.address)];
                case 5:
                    WETHInPair = _b.sent();
                    return [4 /*yield*/, pair.balanceOf(wallet.address)];
                case 6:
                    liquidity = _b.sent();
                    return [4 /*yield*/, pair.totalSupply()];
                case 7:
                    totalSupply = _b.sent();
                    NaiveDTTExpected = DTTInPair.mul(liquidity).div(totalSupply);
                    WETHExpected = WETHInPair.mul(liquidity).div(totalSupply);
                    return [4 /*yield*/, pair.approve(router.address, constants_1.MaxUint256)];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, router.removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(DTT.address, liquidity, NaiveDTTExpected, WETHExpected, wallet.address, constants_1.MaxUint256, false, v, r, s, overrides)];
                case 9:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('swapExactTokensForTokensSupportingFeeOnTransferTokens', function () {
        var DTTAmount = (0, utilities_1.expandTo18Decimals)(5)
            .mul(100)
            .div(99);
        var ETHAmount = (0, utilities_1.expandTo18Decimals)(10);
        var amountIn = (0, utilities_1.expandTo18Decimals)(1);
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, addLiquidity(DTTAmount, ETHAmount)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('DTT -> WETH', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DTT.approve(router.address, constants_1.MaxUint256)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, router.swapExactTokensForTokensSupportingFeeOnTransferTokens(amountIn, 0, [DTT.address, WETH.address], wallet.address, constants_1.MaxUint256, overrides)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // WETH -> DTT
        it('WETH -> DTT', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WETH.deposit({ value: amountIn })]; // mint WETH
                    case 1:
                        _a.sent(); // mint WETH
                        return [4 /*yield*/, WETH.approve(router.address, constants_1.MaxUint256)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, router.swapExactTokensForTokensSupportingFeeOnTransferTokens(amountIn, 0, [WETH.address, DTT.address], wallet.address, constants_1.MaxUint256, overrides)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // ETH -> DTT
    it('swapExactETHForTokensSupportingFeeOnTransferTokens', function () { return __awaiter(void 0, void 0, void 0, function () {
        var DTTAmount, ETHAmount, swapAmount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    DTTAmount = (0, utilities_1.expandTo18Decimals)(10)
                        .mul(100)
                        .div(99);
                    ETHAmount = (0, utilities_1.expandTo18Decimals)(5);
                    swapAmount = (0, utilities_1.expandTo18Decimals)(1);
                    return [4 /*yield*/, addLiquidity(DTTAmount, ETHAmount)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, router.swapExactETHForTokensSupportingFeeOnTransferTokens(0, [WETH.address, DTT.address], wallet.address, constants_1.MaxUint256, __assign(__assign({}, overrides), { value: swapAmount }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // DTT -> ETH
    it('swapExactTokensForETHSupportingFeeOnTransferTokens', function () { return __awaiter(void 0, void 0, void 0, function () {
        var DTTAmount, ETHAmount, swapAmount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    DTTAmount = (0, utilities_1.expandTo18Decimals)(5)
                        .mul(100)
                        .div(99);
                    ETHAmount = (0, utilities_1.expandTo18Decimals)(10);
                    swapAmount = (0, utilities_1.expandTo18Decimals)(1);
                    return [4 /*yield*/, addLiquidity(DTTAmount, ETHAmount)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, DTT.approve(router.address, constants_1.MaxUint256)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, router.swapExactTokensForETHSupportingFeeOnTransferTokens(swapAmount, 0, [DTT.address, WETH.address], wallet.address, constants_1.MaxUint256, overrides)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('fee-on-transfer tokens: reloaded', function () {
    var provider = new ethereum_waffle_1.MockProvider({
        hardfork: 'istanbul',
        mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
        gasLimit: 9999999
    });
    var wallet = provider.getWallets()[0];
    var loadFixture = (0, ethereum_waffle_1.createFixtureLoader)(provider, [wallet]);
    var DTT;
    var DTT2;
    var router;
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function () {
            var fixture, pairAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loadFixture(fixtures_1.v2Fixture)];
                    case 1:
                        fixture = _a.sent();
                        router = fixture.router02;
                        return [4 /*yield*/, (0, ethereum_waffle_1.deployContract)(wallet, DeflatingERC20_json_1.default, [(0, utilities_1.expandTo18Decimals)(10000)])];
                    case 2:
                        DTT = _a.sent();
                        return [4 /*yield*/, (0, ethereum_waffle_1.deployContract)(wallet, DeflatingERC20_json_1.default, [(0, utilities_1.expandTo18Decimals)(10000)])
                            // make a DTT<>WETH pair
                        ];
                    case 3:
                        DTT2 = _a.sent();
                        // make a DTT<>WETH pair
                        return [4 /*yield*/, fixture.factoryV2.createPair(DTT.address, DTT2.address)];
                    case 4:
                        // make a DTT<>WETH pair
                        _a.sent();
                        return [4 /*yield*/, fixture.factoryV2.getPair(DTT.address, DTT2.address)];
                    case 5:
                        pairAddress = _a.sent();
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
                        _a.apply(void 0, [_b.sent()]).to.eq(0);
                        return [2 /*return*/];
                }
            });
        });
    });
    function addLiquidity(DTTAmount, DTT2Amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DTT.approve(router.address, constants_1.MaxUint256)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, DTT2.approve(router.address, constants_1.MaxUint256)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, router.addLiquidity(DTT.address, DTT2.address, DTTAmount, DTT2Amount, DTTAmount, DTT2Amount, wallet.address, constants_1.MaxUint256, overrides)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    describe('swapExactTokensForTokensSupportingFeeOnTransferTokens', function () {
        var DTTAmount = (0, utilities_1.expandTo18Decimals)(5)
            .mul(100)
            .div(99);
        var DTT2Amount = (0, utilities_1.expandTo18Decimals)(5);
        var amountIn = (0, utilities_1.expandTo18Decimals)(1);
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, addLiquidity(DTTAmount, DTT2Amount)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('DTT -> DTT2', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DTT.approve(router.address, constants_1.MaxUint256)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, router.swapExactTokensForTokensSupportingFeeOnTransferTokens(amountIn, 0, [DTT.address, DTT2.address], wallet.address, constants_1.MaxUint256, overrides)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
