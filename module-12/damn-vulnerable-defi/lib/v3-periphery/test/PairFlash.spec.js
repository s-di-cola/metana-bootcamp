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
var completeFixture_1 = require("./shared/completeFixture");
var constants_1 = require("./shared/constants");
var encodePriceSqrt_1 = require("./shared/encodePriceSqrt");
var snapshotGasCost_1 = require("./shared/snapshotGasCost");
var expect_1 = require("./shared/expect");
var ticks_1 = require("./shared/ticks");
var computePoolAddress_1 = require("./shared/computePoolAddress");
describe('PairFlash test', function () {
    var provider = hardhat_1.waffle.provider;
    var wallets = hardhat_1.waffle.provider.getWallets();
    var wallet = wallets[0];
    var flash;
    var nft;
    var token0;
    var token1;
    var factory;
    var quoter;
    function createPool(tokenAddressA, tokenAddressB, fee, price) {
        return __awaiter(this, void 0, void 0, function () {
            var liquidityParams;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (tokenAddressA.toLowerCase() > tokenAddressB.toLowerCase())
                            _a = [tokenAddressB, tokenAddressA], tokenAddressA = _a[0], tokenAddressB = _a[1];
                        return [4 /*yield*/, nft.createAndInitializePoolIfNecessary(tokenAddressA, tokenAddressB, fee, price)];
                    case 1:
                        _b.sent();
                        liquidityParams = {
                            token0: tokenAddressA,
                            token1: tokenAddressB,
                            fee: fee,
                            tickLower: (0, ticks_1.getMinTick)(constants_1.TICK_SPACINGS[fee]),
                            tickUpper: (0, ticks_1.getMaxTick)(constants_1.TICK_SPACINGS[fee]),
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
    var flashFixture = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, router, tokens, factory, weth9, nft, token0, token1, flashContractFactory, flash, quoterFactory, quoter;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, completeFixture_1.default)(wallets, provider)];
                case 1:
                    _a = _b.sent(), router = _a.router, tokens = _a.tokens, factory = _a.factory, weth9 = _a.weth9, nft = _a.nft;
                    token0 = tokens[0];
                    token1 = tokens[1];
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('PairFlash')];
                case 2:
                    flashContractFactory = _b.sent();
                    return [4 /*yield*/, flashContractFactory.deploy(router.address, factory.address, weth9.address)];
                case 3:
                    flash = (_b.sent());
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('Quoter')];
                case 4:
                    quoterFactory = _b.sent();
                    return [4 /*yield*/, quoterFactory.deploy(factory.address, weth9.address)];
                case 5:
                    quoter = (_b.sent());
                    return [2 /*return*/, {
                            token0: token0,
                            token1: token1,
                            flash: flash,
                            factory: factory,
                            weth9: weth9,
                            nft: nft,
                            quoter: quoter,
                            router: router,
                        }];
            }
        });
    }); };
    var loadFixture;
    before('create fixture loader', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            loadFixture = hardhat_1.waffle.createFixtureLoader(wallets);
            return [2 /*return*/];
        });
    }); });
    beforeEach('load fixture', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ;
                    return [4 /*yield*/, loadFixture(flashFixture)];
                case 1:
                    (_a = _b.sent(), factory = _a.factory, token0 = _a.token0, token1 = _a.token1, flash = _a.flash, nft = _a.nft, quoter = _a.quoter);
                    return [4 /*yield*/, token0.approve(nft.address, constants_1.MaxUint128)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, token1.approve(nft.address, constants_1.MaxUint128)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, createPool(token0.address, token1.address, constants_1.FeeAmount.LOW, (0, encodePriceSqrt_1.encodePriceSqrt)(5, 10))];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, createPool(token0.address, token1.address, constants_1.FeeAmount.MEDIUM, (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1))];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, createPool(token0.address, token1.address, constants_1.FeeAmount.HIGH, (0, encodePriceSqrt_1.encodePriceSqrt)(20, 10))];
                case 6:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('flash', function () {
        it('test correct transfer events', function () { return __awaiter(void 0, void 0, void 0, function () {
            var amount0In, amount1In, fee0, fee1, flashParams, pool1, pool2, pool3, expectedAmountOut0, expectedAmountOut1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amount0In = 1000;
                        amount1In = 1000;
                        fee0 = Math.ceil((amount0In * constants_1.FeeAmount.MEDIUM) / 1000000);
                        fee1 = Math.ceil((amount1In * constants_1.FeeAmount.MEDIUM) / 1000000);
                        flashParams = {
                            token0: token0.address,
                            token1: token1.address,
                            fee1: constants_1.FeeAmount.MEDIUM,
                            amount0: amount0In,
                            amount1: amount1In,
                            fee2: constants_1.FeeAmount.LOW,
                            fee3: constants_1.FeeAmount.HIGH,
                        };
                        pool1 = (0, computePoolAddress_1.computePoolAddress)(factory.address, [token0.address, token1.address], constants_1.FeeAmount.MEDIUM);
                        pool2 = (0, computePoolAddress_1.computePoolAddress)(factory.address, [token0.address, token1.address], constants_1.FeeAmount.LOW);
                        pool3 = (0, computePoolAddress_1.computePoolAddress)(factory.address, [token0.address, token1.address], constants_1.FeeAmount.HIGH);
                        return [4 /*yield*/, quoter.callStatic.quoteExactInputSingle(token1.address, token0.address, constants_1.FeeAmount.LOW, amount1In, (0, encodePriceSqrt_1.encodePriceSqrt)(20, 10))];
                    case 1:
                        expectedAmountOut0 = _a.sent();
                        return [4 /*yield*/, quoter.callStatic.quoteExactInputSingle(token0.address, token1.address, constants_1.FeeAmount.HIGH, amount0In, (0, encodePriceSqrt_1.encodePriceSqrt)(5, 10))];
                    case 2:
                        expectedAmountOut1 = _a.sent();
                        return [4 /*yield*/, (0, expect_1.expect)(flash.initFlash(flashParams))
                                .to.emit(token0, 'Transfer')
                                .withArgs(pool1, flash.address, amount0In)
                                .to.emit(token1, 'Transfer')
                                .withArgs(pool1, flash.address, amount1In)
                                .to.emit(token0, 'Transfer')
                                .withArgs(pool2, flash.address, expectedAmountOut0)
                                .to.emit(token1, 'Transfer')
                                .withArgs(pool3, flash.address, expectedAmountOut1)
                                .to.emit(token0, 'Transfer')
                                .withArgs(flash.address, wallet.address, expectedAmountOut0.toNumber() - amount0In - fee0)
                                .to.emit(token1, 'Transfer')
                                .withArgs(flash.address, wallet.address, expectedAmountOut1.toNumber() - amount1In - fee1)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
            var amount0In, amount1In, flashParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amount0In = 1000;
                        amount1In = 1000;
                        flashParams = {
                            token0: token0.address,
                            token1: token1.address,
                            fee1: constants_1.FeeAmount.MEDIUM,
                            amount0: amount0In,
                            amount1: amount1In,
                            fee2: constants_1.FeeAmount.LOW,
                            fee3: constants_1.FeeAmount.HIGH,
                        };
                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(flash.initFlash(flashParams))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
