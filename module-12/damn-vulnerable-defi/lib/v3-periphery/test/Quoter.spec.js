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
var quoter_1 = require("./shared/quoter");
describe('Quoter', function () {
    var wallet;
    var trader;
    var swapRouterFixture = function (wallets, provider) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, weth9, factory, router, tokens, nft, _i, tokens_1, token, quoterFactory;
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
                case 8: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('Quoter')];
                case 9:
                    quoterFactory = _b.sent();
                    return [4 /*yield*/, quoterFactory.deploy(factory.address, weth9.address)];
                case 10:
                    quoter = (_b.sent());
                    return [2 /*return*/, {
                            tokens: tokens,
                            nft: nft,
                            quoter: quoter,
                        }];
            }
        });
    }); };
    var nft;
    var tokens;
    var quoter;
    var loadFixture;
    before('create fixture loader', function () { return __awaiter(void 0, void 0, void 0, function () {
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
    // helper for getting weth and token balances
    beforeEach('load fixture', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ;
                    return [4 /*yield*/, loadFixture(swapRouterFixture)];
                case 1:
                    (_a = _b.sent(), tokens = _a.tokens, nft = _a.nft, quoter = _a.quoter);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('quotes', function () {
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, quoter_1.createPool)(nft, wallet, tokens[0].address, tokens[1].address)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, quoter_1.createPool)(nft, wallet, tokens[1].address, tokens[2].address)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('#quoteExactInput', function () {
            it('0 -> 1', function () { return __awaiter(void 0, void 0, void 0, function () {
                var quote;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, quoter.callStatic.quoteExactInput((0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]), 3)];
                        case 1:
                            quote = _a.sent();
                            (0, expect_1.expect)(quote).to.eq(1);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('1 -> 0', function () { return __awaiter(void 0, void 0, void 0, function () {
                var quote;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, quoter.callStatic.quoteExactInput((0, path_1.encodePath)([tokens[1].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]), 3)];
                        case 1:
                            quote = _a.sent();
                            (0, expect_1.expect)(quote).to.eq(1);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('0 -> 1 -> 2', function () { return __awaiter(void 0, void 0, void 0, function () {
                var quote;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, quoter.callStatic.quoteExactInput((0, path_1.encodePath)(tokens.map(function (token) { return token.address; }), [constants_1.FeeAmount.MEDIUM, constants_1.FeeAmount.MEDIUM]), 5)];
                        case 1:
                            quote = _a.sent();
                            (0, expect_1.expect)(quote).to.eq(1);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('2 -> 1 -> 0', function () { return __awaiter(void 0, void 0, void 0, function () {
                var quote;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, quoter.callStatic.quoteExactInput((0, path_1.encodePath)(tokens.map(function (token) { return token.address; }).reverse(), [constants_1.FeeAmount.MEDIUM, constants_1.FeeAmount.MEDIUM]), 5)];
                        case 1:
                            quote = _a.sent();
                            (0, expect_1.expect)(quote).to.eq(1);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('#quoteExactInputSingle', function () {
            it('0 -> 1', function () { return __awaiter(void 0, void 0, void 0, function () {
                var quote;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, quoter.callStatic.quoteExactInputSingle(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, constants_1.MaxUint128, 
                            // -2%
                            (0, encodePriceSqrt_1.encodePriceSqrt)(100, 102))];
                        case 1:
                            quote = _a.sent();
                            (0, expect_1.expect)(quote).to.eq(9852);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('1 -> 0', function () { return __awaiter(void 0, void 0, void 0, function () {
                var quote;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, quoter.callStatic.quoteExactInputSingle(tokens[1].address, tokens[0].address, constants_1.FeeAmount.MEDIUM, constants_1.MaxUint128, 
                            // +2%
                            (0, encodePriceSqrt_1.encodePriceSqrt)(102, 100))];
                        case 1:
                            quote = _a.sent();
                            (0, expect_1.expect)(quote).to.eq(9852);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('#quoteExactOutput', function () {
            it('0 -> 1', function () { return __awaiter(void 0, void 0, void 0, function () {
                var quote;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, quoter.callStatic.quoteExactOutput((0, path_1.encodePath)([tokens[1].address, tokens[0].address], [constants_1.FeeAmount.MEDIUM]), 1)];
                        case 1:
                            quote = _a.sent();
                            (0, expect_1.expect)(quote).to.eq(3);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('1 -> 0', function () { return __awaiter(void 0, void 0, void 0, function () {
                var quote;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, quoter.callStatic.quoteExactOutput((0, path_1.encodePath)([tokens[0].address, tokens[1].address], [constants_1.FeeAmount.MEDIUM]), 1)];
                        case 1:
                            quote = _a.sent();
                            (0, expect_1.expect)(quote).to.eq(3);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('0 -> 1 -> 2', function () { return __awaiter(void 0, void 0, void 0, function () {
                var quote;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, quoter.callStatic.quoteExactOutput((0, path_1.encodePath)(tokens.map(function (token) { return token.address; }).reverse(), [constants_1.FeeAmount.MEDIUM, constants_1.FeeAmount.MEDIUM]), 1)];
                        case 1:
                            quote = _a.sent();
                            (0, expect_1.expect)(quote).to.eq(5);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('2 -> 1 -> 0', function () { return __awaiter(void 0, void 0, void 0, function () {
                var quote;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, quoter.callStatic.quoteExactOutput((0, path_1.encodePath)(tokens.map(function (token) { return token.address; }), [constants_1.FeeAmount.MEDIUM, constants_1.FeeAmount.MEDIUM]), 1)];
                        case 1:
                            quote = _a.sent();
                            (0, expect_1.expect)(quote).to.eq(5);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('#quoteExactOutputSingle', function () {
            it('0 -> 1', function () { return __awaiter(void 0, void 0, void 0, function () {
                var quote;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, quoter.callStatic.quoteExactOutputSingle(tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM, constants_1.MaxUint128, (0, encodePriceSqrt_1.encodePriceSqrt)(100, 102))];
                        case 1:
                            quote = _a.sent();
                            (0, expect_1.expect)(quote).to.eq(9981);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('1 -> 0', function () { return __awaiter(void 0, void 0, void 0, function () {
                var quote;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, quoter.callStatic.quoteExactOutputSingle(tokens[1].address, tokens[0].address, constants_1.FeeAmount.MEDIUM, constants_1.MaxUint128, (0, encodePriceSqrt_1.encodePriceSqrt)(102, 100))];
                        case 1:
                            quote = _a.sent();
                            (0, expect_1.expect)(quote).to.eq(9981);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
