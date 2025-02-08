"use strict";
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
var constants_1 = require("ethers/constants");
var chai_1 = __importStar(require("chai"));
var ethereum_waffle_1 = require("ethereum-waffle");
var utilities_1 = require("./shared/utilities");
var fixtures_1 = require("./shared/fixtures");
var ExampleComputeLiquidityValue_json_1 = __importDefault(require("../build/ExampleComputeLiquidityValue.json"));
chai_1.default.use(ethereum_waffle_1.solidity);
var overrides = {
    gasLimit: 9999999
};
describe('ExampleComputeLiquidityValue', function () {
    var provider = new ethereum_waffle_1.MockProvider({
        hardfork: 'istanbul',
        mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
        gasLimit: 9999999
    });
    var wallet = provider.getWallets()[0];
    var loadFixture = (0, ethereum_waffle_1.createFixtureLoader)(provider, [wallet]);
    var token0;
    var token1;
    var factory;
    var pair;
    var computeLiquidityValue;
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
                        pair = fixture.pair;
                        factory = fixture.factoryV2;
                        router = fixture.router;
                        return [4 /*yield*/, (0, ethereum_waffle_1.deployContract)(wallet, ExampleComputeLiquidityValue_json_1.default, [fixture.factoryV2.address], overrides)];
                    case 2:
                        computeLiquidityValue = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    beforeEach('mint some liquidity for the pair at 1:100 (100 shares minted)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, token0.transfer(pair.address, (0, utilities_1.expandTo18Decimals)(10))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, token1.transfer(pair.address, (0, utilities_1.expandTo18Decimals)(1000))];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, pair.mint(wallet.address, overrides)];
                case 3:
                    _b.sent();
                    _a = chai_1.expect;
                    return [4 /*yield*/, pair.totalSupply()];
                case 4:
                    _a.apply(void 0, [_b.sent()]).to.eq((0, utilities_1.expandTo18Decimals)(100));
                    return [2 /*return*/];
            }
        });
    }); });
    it('correct factory address', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = chai_1.expect;
                    return [4 /*yield*/, computeLiquidityValue.factory()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eq(factory.address);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#getLiquidityValue', function () {
        it('correct for 5 shares', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0Amount, token1Amount;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, computeLiquidityValue.getLiquidityValue(token0.address, token1.address, (0, utilities_1.expandTo18Decimals)(5))];
                    case 1:
                        _a = _b.sent(), token0Amount = _a[0], token1Amount = _a[1];
                        (0, chai_1.expect)(token0Amount).to.eq('500000000000000000');
                        (0, chai_1.expect)(token1Amount).to.eq('50000000000000000000');
                        return [2 /*return*/];
                }
            });
        }); });
        it('correct for 7 shares', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0Amount, token1Amount;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, computeLiquidityValue.getLiquidityValue(token0.address, token1.address, (0, utilities_1.expandTo18Decimals)(7))];
                    case 1:
                        _a = _b.sent(), token0Amount = _a[0], token1Amount = _a[1];
                        (0, chai_1.expect)(token0Amount).to.eq('700000000000000000');
                        (0, chai_1.expect)(token1Amount).to.eq('70000000000000000000');
                        return [2 /*return*/];
                }
            });
        }); });
        it('correct after swap', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, token0Amount, token1Amount;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, token0.approve(router.address, constants_1.MaxUint256, overrides)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, router.swapExactTokensForTokens((0, utilities_1.expandTo18Decimals)(10), 0, [token0.address, token1.address], wallet.address, constants_1.MaxUint256, overrides)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, computeLiquidityValue.getLiquidityValue(token0.address, token1.address, (0, utilities_1.expandTo18Decimals)(7))];
                    case 3:
                        _a = _b.sent(), token0Amount = _a[0], token1Amount = _a[1];
                        (0, chai_1.expect)(token0Amount).to.eq('1400000000000000000');
                        (0, chai_1.expect)(token1Amount).to.eq('35052578868302453680');
                        return [2 /*return*/];
                }
            });
        }); });
        describe('fee on', function () {
            beforeEach('turn on fee', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, factory.setFeeTo(wallet.address)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            // this is necessary to cause kLast to be set
            beforeEach('mint more liquidity to address zero', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, token0.transfer(pair.address, (0, utilities_1.expandTo18Decimals)(10))];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, token1.transfer(pair.address, (0, utilities_1.expandTo18Decimals)(1000))];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, pair.mint(constants_1.AddressZero, overrides)];
                        case 3:
                            _b.sent();
                            _a = chai_1.expect;
                            return [4 /*yield*/, pair.totalSupply()];
                        case 4:
                            _a.apply(void 0, [_b.sent()]).to.eq((0, utilities_1.expandTo18Decimals)(200));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('correct after swap', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, token0Amount, token1Amount;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, token0.approve(router.address, constants_1.MaxUint256, overrides)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, router.swapExactTokensForTokens((0, utilities_1.expandTo18Decimals)(20), 0, [token0.address, token1.address], wallet.address, constants_1.MaxUint256, overrides)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, computeLiquidityValue.getLiquidityValue(token0.address, token1.address, (0, utilities_1.expandTo18Decimals)(7))];
                        case 3:
                            _a = _b.sent(), token0Amount = _a[0], token1Amount = _a[1];
                            (0, chai_1.expect)(token0Amount).to.eq('1399824934325735058');
                            (0, chai_1.expect)(token1Amount).to.eq('35048195651620807684');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('#getReservesAfterArbitrage', function () {
        it('1/400', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, reserveA, reserveB;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, computeLiquidityValue.getReservesAfterArbitrage(token0.address, token1.address, 1, 400)];
                    case 1:
                        _a = _b.sent(), reserveA = _a[0], reserveB = _a[1];
                        (0, chai_1.expect)(reserveA).to.eq('5007516917298542016');
                        (0, chai_1.expect)(reserveB).to.eq('1999997739838173075192');
                        return [2 /*return*/];
                }
            });
        }); });
        it('1/200', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, reserveA, reserveB;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, computeLiquidityValue.getReservesAfterArbitrage(token0.address, token1.address, 1, 200)];
                    case 1:
                        _a = _b.sent(), reserveA = _a[0], reserveB = _a[1];
                        (0, chai_1.expect)(reserveA).to.eq('7081698338256310291');
                        (0, chai_1.expect)(reserveB).to.eq('1413330640570018326894');
                        return [2 /*return*/];
                }
            });
        }); });
        it('1/100 (same price)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, reserveA, reserveB;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, computeLiquidityValue.getReservesAfterArbitrage(token0.address, token1.address, 1, 100)];
                    case 1:
                        _a = _b.sent(), reserveA = _a[0], reserveB = _a[1];
                        (0, chai_1.expect)(reserveA).to.eq('10000000000000000000');
                        (0, chai_1.expect)(reserveB).to.eq('1000000000000000000000');
                        return [2 /*return*/];
                }
            });
        }); });
        it('1/50', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, reserveA, reserveB;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, computeLiquidityValue.getReservesAfterArbitrage(token0.address, token1.address, 1, 50)];
                    case 1:
                        _a = _b.sent(), reserveA = _a[0], reserveB = _a[1];
                        (0, chai_1.expect)(reserveA).to.eq('14133306405700183269');
                        (0, chai_1.expect)(reserveB).to.eq('708169833825631029041');
                        return [2 /*return*/];
                }
            });
        }); });
        it('1/25', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, reserveA, reserveB;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, computeLiquidityValue.getReservesAfterArbitrage(token0.address, token1.address, 1, 25)];
                    case 1:
                        _a = _b.sent(), reserveA = _a[0], reserveB = _a[1];
                        (0, chai_1.expect)(reserveA).to.eq('19999977398381730752');
                        (0, chai_1.expect)(reserveB).to.eq('500751691729854201595');
                        return [2 /*return*/];
                }
            });
        }); });
        it('25/1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, reserveA, reserveB;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, computeLiquidityValue.getReservesAfterArbitrage(token0.address, token1.address, 25, 1)];
                    case 1:
                        _a = _b.sent(), reserveA = _a[0], reserveB = _a[1];
                        (0, chai_1.expect)(reserveA).to.eq('500721601459041764285');
                        (0, chai_1.expect)(reserveB).to.eq('20030067669194168064');
                        return [2 /*return*/];
                }
            });
        }); });
        it('works with large numbers for the price', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, reserveA, reserveB;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, computeLiquidityValue.getReservesAfterArbitrage(token0.address, token1.address, constants_1.MaxUint256.div(1000), constants_1.MaxUint256.div(1000))
                        // diff of 30 bips
                    ];
                    case 1:
                        _a = _b.sent(), reserveA = _a[0], reserveB = _a[1];
                        // diff of 30 bips
                        (0, chai_1.expect)(reserveA).to.eq('100120248075158403008');
                        (0, chai_1.expect)(reserveB).to.eq('100150338345970840319');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#getLiquidityValue', function () {
        describe('fee is off', function () {
            it('produces the correct value after arbing to 1:105', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, token0Amount, token1Amount;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, computeLiquidityValue.getLiquidityValueAfterArbitrageToPrice(token0.address, token1.address, 1, 105, (0, utilities_1.expandTo18Decimals)(5))];
                        case 1:
                            _a = _b.sent(), token0Amount = _a[0], token1Amount = _a[1];
                            (0, chai_1.expect)(token0Amount).to.eq('488683612488266114'); // slightly less than 5% of 10, or 0.5
                            (0, chai_1.expect)(token1Amount).to.eq('51161327957205755422'); // slightly more than 5% of 100, or 5
                            return [2 /*return*/];
                    }
                });
            }); });
            it('produces the correct value after arbing to 1:95', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, token0Amount, token1Amount;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, computeLiquidityValue.getLiquidityValueAfterArbitrageToPrice(token0.address, token1.address, 1, 95, (0, utilities_1.expandTo18Decimals)(5))];
                        case 1:
                            _a = _b.sent(), token0Amount = _a[0], token1Amount = _a[1];
                            (0, chai_1.expect)(token0Amount).to.eq('512255881944227034'); // slightly more than 5% of 10, or 0.5
                            (0, chai_1.expect)(token1Amount).to.eq('48807237571060645526'); // slightly less than 5% of 100, or 5
                            return [2 /*return*/];
                    }
                });
            }); });
            it('produces correct value at the current price', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, token0Amount, token1Amount;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, computeLiquidityValue.getLiquidityValueAfterArbitrageToPrice(token0.address, token1.address, 1, 100, (0, utilities_1.expandTo18Decimals)(5))];
                        case 1:
                            _a = _b.sent(), token0Amount = _a[0], token1Amount = _a[1];
                            (0, chai_1.expect)(token0Amount).to.eq('500000000000000000');
                            (0, chai_1.expect)(token1Amount).to.eq('50000000000000000000');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas current price', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = chai_1.expect;
                            return [4 /*yield*/, computeLiquidityValue.getGasCostOfGetLiquidityValueAfterArbitrageToPrice(token0.address, token1.address, 1, 100, (0, utilities_1.expandTo18Decimals)(5))];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq('12705');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas higher price', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = chai_1.expect;
                            return [4 /*yield*/, computeLiquidityValue.getGasCostOfGetLiquidityValueAfterArbitrageToPrice(token0.address, token1.address, 1, 105, (0, utilities_1.expandTo18Decimals)(5))];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq('13478');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas lower price', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = chai_1.expect;
                            return [4 /*yield*/, computeLiquidityValue.getGasCostOfGetLiquidityValueAfterArbitrageToPrice(token0.address, token1.address, 1, 95, (0, utilities_1.expandTo18Decimals)(5))];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq('13523');
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('after a swap', function () {
                beforeEach('swap to ~1:25', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, reserve0, reserve1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, token0.approve(router.address, constants_1.MaxUint256, overrides)];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, router.swapExactTokensForTokens((0, utilities_1.expandTo18Decimals)(10), 0, [token0.address, token1.address], wallet.address, constants_1.MaxUint256, overrides)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, pair.getReserves()];
                            case 3:
                                _a = _b.sent(), reserve0 = _a[0], reserve1 = _a[1];
                                (0, chai_1.expect)(reserve0).to.eq('20000000000000000000');
                                (0, chai_1.expect)(reserve1).to.eq('500751126690035052579'); // half plus the fee
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('is roughly 1/25th liquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, token0Amount, token1Amount;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, computeLiquidityValue.getLiquidityValueAfterArbitrageToPrice(token0.address, token1.address, 1, 25, (0, utilities_1.expandTo18Decimals)(5))];
                            case 1:
                                _a = _b.sent(), token0Amount = _a[0], token1Amount = _a[1];
                                (0, chai_1.expect)(token0Amount).to.eq('1000000000000000000');
                                (0, chai_1.expect)(token1Amount).to.eq('25037556334501752628');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('shares after arbing back to 1:100', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, token0Amount, token1Amount;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, computeLiquidityValue.getLiquidityValueAfterArbitrageToPrice(token0.address, token1.address, 1, 100, (0, utilities_1.expandTo18Decimals)(5))];
                            case 1:
                                _a = _b.sent(), token0Amount = _a[0], token1Amount = _a[1];
                                (0, chai_1.expect)(token0Amount).to.eq('501127678536722155');
                                (0, chai_1.expect)(token1Amount).to.eq('50037429168613534246');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
        describe('fee is on', function () {
            beforeEach('turn on fee', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, factory.setFeeTo(wallet.address)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            // this is necessary to cause kLast to be set
            beforeEach('mint more liquidity to address zero', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, token0.transfer(pair.address, (0, utilities_1.expandTo18Decimals)(10))];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, token1.transfer(pair.address, (0, utilities_1.expandTo18Decimals)(1000))];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, pair.mint(constants_1.AddressZero, overrides)];
                        case 3:
                            _b.sent();
                            _a = chai_1.expect;
                            return [4 /*yield*/, pair.totalSupply()];
                        case 4:
                            _a.apply(void 0, [_b.sent()]).to.eq((0, utilities_1.expandTo18Decimals)(200));
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('no fee to be collected', function () {
                it('produces the correct value after arbing to 1:105', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, token0Amount, token1Amount;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, computeLiquidityValue.getLiquidityValueAfterArbitrageToPrice(token0.address, token1.address, 1, 105, (0, utilities_1.expandTo18Decimals)(5))];
                            case 1:
                                _a = _b.sent(), token0Amount = _a[0], token1Amount = _a[1];
                                (0, chai_1.expect)(token0Amount).to.eq('488680839243189328'); // slightly less than 5% of 10, or 0.5
                                (0, chai_1.expect)(token1Amount).to.eq('51161037620273529068'); // slightly more than 5% of 100, or 5
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('produces the correct value after arbing to 1:95', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, token0Amount, token1Amount;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, computeLiquidityValue.getLiquidityValueAfterArbitrageToPrice(token0.address, token1.address, 1, 95, (0, utilities_1.expandTo18Decimals)(5))];
                            case 1:
                                _a = _b.sent(), token0Amount = _a[0], token1Amount = _a[1];
                                (0, chai_1.expect)(token0Amount).to.eq('512252817918759166'); // slightly more than 5% of 10, or 0.5
                                (0, chai_1.expect)(token1Amount).to.eq('48806945633721895174'); // slightly less than 5% of 100, or 5
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('produces correct value at the current price', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, token0Amount, token1Amount;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, computeLiquidityValue.getLiquidityValueAfterArbitrageToPrice(token0.address, token1.address, 1, 100, (0, utilities_1.expandTo18Decimals)(5))];
                            case 1:
                                _a = _b.sent(), token0Amount = _a[0], token1Amount = _a[1];
                                (0, chai_1.expect)(token0Amount).to.eq('500000000000000000');
                                (0, chai_1.expect)(token1Amount).to.eq('50000000000000000000');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            it('gas current price', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = chai_1.expect;
                            return [4 /*yield*/, computeLiquidityValue.getGasCostOfGetLiquidityValueAfterArbitrageToPrice(token0.address, token1.address, 1, 100, (0, utilities_1.expandTo18Decimals)(5))];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq('16938');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas higher price', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = chai_1.expect;
                            return [4 /*yield*/, computeLiquidityValue.getGasCostOfGetLiquidityValueAfterArbitrageToPrice(token0.address, token1.address, 1, 105, (0, utilities_1.expandTo18Decimals)(5))];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq('18475');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas lower price', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = chai_1.expect;
                            return [4 /*yield*/, computeLiquidityValue.getGasCostOfGetLiquidityValueAfterArbitrageToPrice(token0.address, token1.address, 1, 95, (0, utilities_1.expandTo18Decimals)(5))];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq('18406');
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('after a swap', function () {
                beforeEach('swap to ~1:25', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, reserve0, reserve1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, token0.approve(router.address, constants_1.MaxUint256, overrides)];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, router.swapExactTokensForTokens((0, utilities_1.expandTo18Decimals)(20), 0, [token0.address, token1.address], wallet.address, constants_1.MaxUint256, overrides)];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, pair.getReserves()];
                            case 3:
                                _a = _b.sent(), reserve0 = _a[0], reserve1 = _a[1];
                                (0, chai_1.expect)(reserve0).to.eq('40000000000000000000');
                                (0, chai_1.expect)(reserve1).to.eq('1001502253380070105158'); // half plus the fee
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('is roughly 1:25', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, token0Amount, token1Amount;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, computeLiquidityValue.getLiquidityValueAfterArbitrageToPrice(token0.address, token1.address, 1, 25, (0, utilities_1.expandTo18Decimals)(5))];
                            case 1:
                                _a = _b.sent(), token0Amount = _a[0], token1Amount = _a[1];
                                (0, chai_1.expect)(token0Amount).to.eq('999874953089810756');
                                (0, chai_1.expect)(token1Amount).to.eq('25034425465443434060');
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('shares after arbing back to 1:100', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, token0Amount, token1Amount;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, computeLiquidityValue.getLiquidityValueAfterArbitrageToPrice(token0.address, token1.address, 1, 100, (0, utilities_1.expandTo18Decimals)(5))];
                            case 1:
                                _a = _b.sent(), token0Amount = _a[0], token1Amount = _a[1];
                                (0, chai_1.expect)(token0Amount).to.eq('501002443792372662');
                                (0, chai_1.expect)(token1Amount).to.eq('50024924521757597314');
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    });
});
