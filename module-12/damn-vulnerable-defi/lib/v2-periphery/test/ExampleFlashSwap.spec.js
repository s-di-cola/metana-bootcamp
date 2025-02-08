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
var constants_1 = require("ethers/constants");
var utils_1 = require("ethers/utils");
var ethereum_waffle_1 = require("ethereum-waffle");
var utilities_1 = require("./shared/utilities");
var fixtures_1 = require("./shared/fixtures");
var ExampleFlashSwap_json_1 = __importDefault(require("../build/ExampleFlashSwap.json"));
chai_1.default.use(ethereum_waffle_1.solidity);
var overrides = {
    gasLimit: 9999999,
    gasPrice: 0
};
describe('ExampleFlashSwap', function () {
    var provider = new ethereum_waffle_1.MockProvider({
        hardfork: 'istanbul',
        mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
        gasLimit: 9999999
    });
    var wallet = provider.getWallets()[0];
    var loadFixture = (0, ethereum_waffle_1.createFixtureLoader)(provider, [wallet]);
    var WETH;
    var WETHPartner;
    var WETHExchangeV1;
    var WETHPair;
    var flashSwapExample;
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function () {
            var fixture;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loadFixture(fixtures_1.v2Fixture)];
                    case 1:
                        fixture = _a.sent();
                        WETH = fixture.WETH;
                        WETHPartner = fixture.WETHPartner;
                        WETHExchangeV1 = fixture.WETHExchangeV1;
                        WETHPair = fixture.WETHPair;
                        return [4 /*yield*/, (0, ethereum_waffle_1.deployContract)(wallet, ExampleFlashSwap_json_1.default, [fixture.factoryV2.address, fixture.factoryV1.address, fixture.router.address], overrides)];
                    case 2:
                        flashSwapExample = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('uniswapV2Call:0', function () { return __awaiter(void 0, void 0, void 0, function () {
        var WETHPartnerAmountV1, ETHAmountV1, WETHPartnerAmountV2, ETHAmountV2, balanceBefore, arbitrageAmount, WETHPairToken0, amount0, amount1, balanceAfter, profit, reservesV1, _a, priceV1, reservesV2, priceV2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    WETHPartnerAmountV1 = (0, utilities_1.expandTo18Decimals)(2000);
                    ETHAmountV1 = (0, utilities_1.expandTo18Decimals)(10);
                    return [4 /*yield*/, WETHPartner.approve(WETHExchangeV1.address, WETHPartnerAmountV1)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, WETHExchangeV1.addLiquidity((0, utils_1.bigNumberify)(1), WETHPartnerAmountV1, constants_1.MaxUint256, __assign(__assign({}, overrides), { value: ETHAmountV1 }))
                        // add liquidity to V2 at a rate of 1 ETH / 100 X
                    ];
                case 2:
                    _b.sent();
                    WETHPartnerAmountV2 = (0, utilities_1.expandTo18Decimals)(1000);
                    ETHAmountV2 = (0, utilities_1.expandTo18Decimals)(10);
                    return [4 /*yield*/, WETHPartner.transfer(WETHPair.address, WETHPartnerAmountV2)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, WETH.deposit({ value: ETHAmountV2 })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, WETH.transfer(WETHPair.address, ETHAmountV2)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, WETHPair.mint(wallet.address, overrides)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, WETHPartner.balanceOf(wallet.address)
                        // now, execute arbitrage via uniswapV2Call:
                        // receive 1 ETH from V2, get as much X from V1 as we can, repay V2 with minimum X, keep the rest!
                    ];
                case 7:
                    balanceBefore = _b.sent();
                    arbitrageAmount = (0, utilities_1.expandTo18Decimals)(1);
                    return [4 /*yield*/, WETHPair.token0()];
                case 8:
                    WETHPairToken0 = _b.sent();
                    amount0 = WETHPairToken0 === WETHPartner.address ? (0, utils_1.bigNumberify)(0) : arbitrageAmount;
                    amount1 = WETHPairToken0 === WETHPartner.address ? arbitrageAmount : (0, utils_1.bigNumberify)(0);
                    return [4 /*yield*/, WETHPair.swap(amount0, amount1, flashSwapExample.address, utils_1.defaultAbiCoder.encode(['uint'], [(0, utils_1.bigNumberify)(1)]), overrides)];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, WETHPartner.balanceOf(wallet.address)];
                case 10:
                    balanceAfter = _b.sent();
                    profit = balanceAfter.sub(balanceBefore).div((0, utilities_1.expandTo18Decimals)(1));
                    return [4 /*yield*/, WETHPartner.balanceOf(WETHExchangeV1.address)];
                case 11:
                    _a = [
                        _b.sent()
                    ];
                    return [4 /*yield*/, provider.getBalance(WETHExchangeV1.address)];
                case 12:
                    reservesV1 = _a.concat([
                        _b.sent()
                    ]);
                    priceV1 = reservesV1[0].div(reservesV1[1]);
                    return [4 /*yield*/, WETHPair.getReserves()];
                case 13:
                    reservesV2 = (_b.sent()).slice(0, 2);
                    priceV2 = WETHPairToken0 === WETHPartner.address ? reservesV2[0].div(reservesV2[1]) : reservesV2[1].div(reservesV2[0]);
                    (0, chai_1.expect)(profit.toString()).to.eq('69'); // our profit is ~69 tokens
                    (0, chai_1.expect)(priceV1.toString()).to.eq('165'); // we pushed the v1 price down to ~165
                    (0, chai_1.expect)(priceV2.toString()).to.eq('123'); // we pushed the v2 price up to ~123
                    return [2 /*return*/];
            }
        });
    }); });
    it('uniswapV2Call:1', function () { return __awaiter(void 0, void 0, void 0, function () {
        var WETHPartnerAmountV1, ETHAmountV1, WETHPartnerAmountV2, ETHAmountV2, balanceBefore, arbitrageAmount, WETHPairToken0, amount0, amount1, balanceAfter, profit, reservesV1, _a, priceV1, reservesV2, priceV2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    WETHPartnerAmountV1 = (0, utilities_1.expandTo18Decimals)(1000);
                    ETHAmountV1 = (0, utilities_1.expandTo18Decimals)(10);
                    return [4 /*yield*/, WETHPartner.approve(WETHExchangeV1.address, WETHPartnerAmountV1)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, WETHExchangeV1.addLiquidity((0, utils_1.bigNumberify)(1), WETHPartnerAmountV1, constants_1.MaxUint256, __assign(__assign({}, overrides), { value: ETHAmountV1 }))
                        // add liquidity to V2 at a rate of 1 ETH / 200 X
                    ];
                case 2:
                    _b.sent();
                    WETHPartnerAmountV2 = (0, utilities_1.expandTo18Decimals)(2000);
                    ETHAmountV2 = (0, utilities_1.expandTo18Decimals)(10);
                    return [4 /*yield*/, WETHPartner.transfer(WETHPair.address, WETHPartnerAmountV2)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, WETH.deposit({ value: ETHAmountV2 })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, WETH.transfer(WETHPair.address, ETHAmountV2)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, WETHPair.mint(wallet.address, overrides)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, provider.getBalance(wallet.address)
                        // now, execute arbitrage via uniswapV2Call:
                        // receive 200 X from V2, get as much ETH from V1 as we can, repay V2 with minimum ETH, keep the rest!
                    ];
                case 7:
                    balanceBefore = _b.sent();
                    arbitrageAmount = (0, utilities_1.expandTo18Decimals)(200);
                    return [4 /*yield*/, WETHPair.token0()];
                case 8:
                    WETHPairToken0 = _b.sent();
                    amount0 = WETHPairToken0 === WETHPartner.address ? arbitrageAmount : (0, utils_1.bigNumberify)(0);
                    amount1 = WETHPairToken0 === WETHPartner.address ? (0, utils_1.bigNumberify)(0) : arbitrageAmount;
                    return [4 /*yield*/, WETHPair.swap(amount0, amount1, flashSwapExample.address, utils_1.defaultAbiCoder.encode(['uint'], [(0, utils_1.bigNumberify)(1)]), overrides)];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, provider.getBalance(wallet.address)];
                case 10:
                    balanceAfter = _b.sent();
                    profit = balanceAfter.sub(balanceBefore);
                    return [4 /*yield*/, WETHPartner.balanceOf(WETHExchangeV1.address)];
                case 11:
                    _a = [
                        _b.sent()
                    ];
                    return [4 /*yield*/, provider.getBalance(WETHExchangeV1.address)];
                case 12:
                    reservesV1 = _a.concat([
                        _b.sent()
                    ]);
                    priceV1 = reservesV1[0].div(reservesV1[1]);
                    return [4 /*yield*/, WETHPair.getReserves()];
                case 13:
                    reservesV2 = (_b.sent()).slice(0, 2);
                    priceV2 = WETHPairToken0 === WETHPartner.address ? reservesV2[0].div(reservesV2[1]) : reservesV2[1].div(reservesV2[0]);
                    (0, chai_1.expect)((0, utils_1.formatEther)(profit)).to.eq('0.548043441089763649'); // our profit is ~.5 ETH
                    (0, chai_1.expect)(priceV1.toString()).to.eq('143'); // we pushed the v1 price up to ~143
                    (0, chai_1.expect)(priceV2.toString()).to.eq('161'); // we pushed the v2 price down to ~161
                    return [2 /*return*/];
            }
        });
    }); });
});
