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
var expect_1 = require("./shared/expect");
var fixtures_1 = require("./shared/fixtures");
var snapshotGasCost_1 = require("./shared/snapshotGasCost");
var utilities_1 = require("./shared/utilities");
var createFixtureLoader = hardhat_1.waffle.createFixtureLoader;
describe('UniswapV3Pool gas tests', function () {
    var wallet, other;
    var loadFixture;
    before('create fixture loader', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ;
                    return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    _a = _b.sent(), wallet = _a[0], other = _a[1];
                    loadFixture = createFixtureLoader([wallet, other]);
                    return [2 /*return*/];
            }
        });
    }); });
    var _loop_1 = function (feeProtocol) {
        describe(feeProtocol > 0 ? 'fee is on' : 'fee is off', function () {
            var startingPrice = (0, utilities_1.encodePriceSqrt)(100001, 100000);
            var startingTick = 0;
            var feeAmount = utilities_1.FeeAmount.MEDIUM;
            var tickSpacing = utilities_1.TICK_SPACINGS[feeAmount];
            var minTick = (0, utilities_1.getMinTick)(tickSpacing);
            var maxTick = (0, utilities_1.getMaxTick)(tickSpacing);
            var gasTestFixture = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                var fix, pool, _c, swapExact0For1, swapToHigherPrice, mint, swapToLowerPrice, _d, _e;
                var wallet = _b[0];
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, (0, fixtures_1.poolFixture)([wallet], hardhat_1.waffle.provider)];
                        case 1:
                            fix = _f.sent();
                            return [4 /*yield*/, fix.createPool(feeAmount, tickSpacing)];
                        case 2:
                            pool = _f.sent();
                            return [4 /*yield*/, (0, utilities_1.createPoolFunctions)({
                                    swapTarget: fix.swapTargetCallee,
                                    token0: fix.token0,
                                    token1: fix.token1,
                                    pool: pool,
                                })];
                        case 3:
                            _c = _f.sent(), swapExact0For1 = _c.swapExact0For1, swapToHigherPrice = _c.swapToHigherPrice, mint = _c.mint, swapToLowerPrice = _c.swapToLowerPrice;
                            return [4 /*yield*/, pool.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                        case 4:
                            _f.sent();
                            return [4 /*yield*/, pool.setFeeProtocol(feeProtocol, feeProtocol)];
                        case 5:
                            _f.sent();
                            return [4 /*yield*/, pool.increaseObservationCardinalityNext(4)];
                        case 6:
                            _f.sent();
                            return [4 /*yield*/, pool.advanceTime(1)];
                        case 7:
                            _f.sent();
                            return [4 /*yield*/, mint(wallet.address, minTick, maxTick, (0, utilities_1.expandTo18Decimals)(2))];
                        case 8:
                            _f.sent();
                            return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address)];
                        case 9:
                            _f.sent();
                            return [4 /*yield*/, pool.advanceTime(1)];
                        case 10:
                            _f.sent();
                            return [4 /*yield*/, swapToHigherPrice(startingPrice, wallet.address)];
                        case 11:
                            _f.sent();
                            return [4 /*yield*/, pool.advanceTime(1)];
                        case 12:
                            _f.sent();
                            _d = expect_1.expect;
                            return [4 /*yield*/, pool.slot0()];
                        case 13:
                            _d.apply(void 0, [(_f.sent()).tick]).to.eq(startingTick);
                            _e = expect_1.expect;
                            return [4 /*yield*/, pool.slot0()];
                        case 14:
                            _e.apply(void 0, [(_f.sent()).sqrtPriceX96]).to.eq(startingPrice);
                            return [2 /*return*/, { pool: pool, swapExact0For1: swapExact0For1, mint: mint, swapToHigherPrice: swapToHigherPrice, swapToLowerPrice: swapToLowerPrice }];
                    }
                });
            }); };
            var swapExact0For1;
            var swapToHigherPrice;
            var swapToLowerPrice;
            var pool;
            var mint;
            beforeEach('load the fixture', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            ;
                            return [4 /*yield*/, loadFixture(gasTestFixture)];
                        case 1:
                            (_a = _b.sent(), swapExact0For1 = _a.swapExact0For1, pool = _a.pool, mint = _a.mint, swapToHigherPrice = _a.swapToHigherPrice, swapToLowerPrice = _a.swapToLowerPrice);
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('#swapExact0For1', function () {
                it('first swap in block with no tick movement', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapExact0For1(2000, wallet.address))];
                            case 1:
                                _c.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 2:
                                _a.apply(void 0, [(_c.sent()).sqrtPriceX96]).to.not.eq(startingPrice);
                                _b = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 3:
                                _b.apply(void 0, [(_c.sent()).tick]).to.eq(startingTick);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('first swap in block moves tick, no initialized crossings', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(10000), wallet.address))];
                            case 1:
                                _b.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 2:
                                _a.apply(void 0, [(_b.sent()).tick]).to.eq(startingTick - 1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('second swap in block with no tick movement', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(10000), wallet.address)];
                            case 1:
                                _c.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 2:
                                _a.apply(void 0, [(_c.sent()).tick]).to.eq(startingTick - 1);
                                return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapExact0For1(2000, wallet.address))];
                            case 3:
                                _c.sent();
                                _b = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 4:
                                _b.apply(void 0, [(_c.sent()).tick]).to.eq(startingTick - 1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('second swap in block moves tick, no initialized crossings', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, swapExact0For1(1000, wallet.address)];
                            case 1:
                                _c.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 2:
                                _a.apply(void 0, [(_c.sent()).tick]).to.eq(startingTick);
                                return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(10000), wallet.address))];
                            case 3:
                                _c.sent();
                                _b = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 4:
                                _b.apply(void 0, [(_c.sent()).tick]).to.eq(startingTick - 1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('first swap in block, large swap, no initialized crossings', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapExact0For1((0, utilities_1.expandTo18Decimals)(10), wallet.address))];
                            case 1:
                                _b.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 2:
                                _a.apply(void 0, [(_b.sent()).tick]).to.eq(-35787);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('first swap in block, large swap crossing several initialized ticks', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, mint(wallet.address, startingTick - 3 * tickSpacing, startingTick - tickSpacing, (0, utilities_1.expandTo18Decimals)(1))];
                            case 1:
                                _c.sent();
                                return [4 /*yield*/, mint(wallet.address, startingTick - 4 * tickSpacing, startingTick - 2 * tickSpacing, (0, utilities_1.expandTo18Decimals)(1))];
                            case 2:
                                _c.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 3:
                                _a.apply(void 0, [(_c.sent()).tick]).to.eq(startingTick);
                                return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address))];
                            case 4:
                                _c.sent();
                                _b = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 5:
                                _b.apply(void 0, [(_c.sent()).tick]).to.be.lt(startingTick - 4 * tickSpacing); // we crossed the last tick
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('first swap in block, large swap crossing a single initialized tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, mint(wallet.address, minTick, startingTick - 2 * tickSpacing, (0, utilities_1.expandTo18Decimals)(1))];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address))];
                            case 2:
                                _b.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 3:
                                _a.apply(void 0, [(_b.sent()).tick]).to.be.lt(startingTick - 2 * tickSpacing); // we crossed the last tick
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('second swap in block, large swap crossing several initialized ticks', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, mint(wallet.address, startingTick - 3 * tickSpacing, startingTick - tickSpacing, (0, utilities_1.expandTo18Decimals)(1))];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, mint(wallet.address, startingTick - 4 * tickSpacing, startingTick - 2 * tickSpacing, (0, utilities_1.expandTo18Decimals)(1))];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(10000), wallet.address)];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address))];
                            case 4:
                                _b.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 5:
                                _a.apply(void 0, [(_b.sent()).tick]).to.be.lt(startingTick - 4 * tickSpacing);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('second swap in block, large swap crossing a single initialized tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, mint(wallet.address, minTick, startingTick - 2 * tickSpacing, (0, utilities_1.expandTo18Decimals)(1))];
                            case 1:
                                _c.sent();
                                return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(10000), wallet.address)];
                            case 2:
                                _c.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 3:
                                _a.apply(void 0, [(_c.sent()).tick]).to.be.gt(startingTick - 2 * tickSpacing); // we didn't cross the initialized tick
                                return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address))];
                            case 4:
                                _c.sent();
                                _b = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 5:
                                _b.apply(void 0, [(_c.sent()).tick]).to.be.lt(startingTick - 2 * tickSpacing); // we crossed the last tick
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('large swap crossing several initialized ticks after some time passes', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, mint(wallet.address, startingTick - 3 * tickSpacing, startingTick - tickSpacing, (0, utilities_1.expandTo18Decimals)(1))];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, mint(wallet.address, startingTick - 4 * tickSpacing, startingTick - 2 * tickSpacing, (0, utilities_1.expandTo18Decimals)(1))];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, swapExact0For1(2, wallet.address)];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, pool.advanceTime(1)];
                            case 4:
                                _b.sent();
                                return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address))];
                            case 5:
                                _b.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 6:
                                _a.apply(void 0, [(_b.sent()).tick]).to.be.lt(startingTick - 4 * tickSpacing);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('large swap crossing several initialized ticks second time after some time passes', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, mint(wallet.address, startingTick - 3 * tickSpacing, startingTick - tickSpacing, (0, utilities_1.expandTo18Decimals)(1))];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, mint(wallet.address, startingTick - 4 * tickSpacing, startingTick - 2 * tickSpacing, (0, utilities_1.expandTo18Decimals)(1))];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address)];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, swapToHigherPrice(startingPrice, wallet.address)];
                            case 4:
                                _b.sent();
                                return [4 /*yield*/, pool.advanceTime(1)];
                            case 5:
                                _b.sent();
                                return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapExact0For1((0, utilities_1.expandTo18Decimals)(1), wallet.address))];
                            case 6:
                                _b.sent();
                                _a = expect_1.expect;
                                return [4 /*yield*/, pool.slot0()];
                            case 7:
                                _a.apply(void 0, [(_b.sent()).tick]).to.be.lt(tickSpacing * -4);
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('#mint', function () {
                var _loop_2 = function (description, tickLower, tickUpper) {
                    describe(description, function () {
                        it('new position mint first in range', function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(mint(wallet.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1)))];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        it('add to position existing', function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, mint(wallet.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1))];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(mint(wallet.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1)))];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        it('second position in same range', function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, mint(wallet.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1))];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(mint(other.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1)))];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        it('add to position after some time passes', function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, mint(wallet.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1))];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, pool.advanceTime(1)];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(mint(wallet.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1)))];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    });
                };
                for (var _i = 0, _a = [
                    {
                        description: 'around current price',
                        tickLower: startingTick - tickSpacing,
                        tickUpper: startingTick + tickSpacing,
                    },
                    {
                        description: 'below current price',
                        tickLower: startingTick - 2 * tickSpacing,
                        tickUpper: startingTick - tickSpacing,
                    },
                    {
                        description: 'above current price',
                        tickLower: startingTick + tickSpacing,
                        tickUpper: startingTick + 2 * tickSpacing,
                    },
                ]; _i < _a.length; _i++) {
                    var _b = _a[_i], description = _b.description, tickLower = _b.tickLower, tickUpper = _b.tickUpper;
                    _loop_2(description, tickLower, tickUpper);
                }
            });
            describe('#burn', function () {
                var _loop_3 = function (description, tickLower, tickUpper) {
                    describe(description, function () {
                        var liquidityAmount = (0, utilities_1.expandTo18Decimals)(1);
                        beforeEach('mint a position', function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, mint(wallet.address, tickLower, tickUpper, liquidityAmount)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        it('burn when only position using ticks', function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(pool.burn(tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1)))];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        it('partial position burn', function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(pool.burn(tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1).div(2)))];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        it('entire position burn but other positions are using the ticks', function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, mint(other.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1))];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(pool.burn(tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1)))];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        it('burn entire position after some time passes', function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, pool.advanceTime(1)];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, (0, snapshotGasCost_1.default)(pool.burn(tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1)))];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    });
                };
                for (var _i = 0, _a = [
                    {
                        description: 'around current price',
                        tickLower: startingTick - tickSpacing,
                        tickUpper: startingTick + tickSpacing,
                    },
                    {
                        description: 'below current price',
                        tickLower: startingTick - 2 * tickSpacing,
                        tickUpper: startingTick - tickSpacing,
                    },
                    {
                        description: 'above current price',
                        tickLower: startingTick + tickSpacing,
                        tickUpper: startingTick + 2 * tickSpacing,
                    },
                ]; _i < _a.length; _i++) {
                    var _b = _a[_i], description = _b.description, tickLower = _b.tickLower, tickUpper = _b.tickUpper;
                    _loop_3(description, tickLower, tickUpper);
                }
            });
            describe('#poke', function () {
                var tickLower = startingTick - tickSpacing;
                var tickUpper = startingTick + tickSpacing;
                it('best case', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, mint(wallet.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1))];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(100), wallet.address)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, pool.burn(tickLower, tickUpper, 0)];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(100), wallet.address)];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, (0, snapshotGasCost_1.default)(pool.burn(tickLower, tickUpper, 0))];
                            case 5:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('#collect', function () {
                var tickLower = startingTick - tickSpacing;
                var tickUpper = startingTick + tickSpacing;
                it('close to worst case', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, mint(wallet.address, tickLower, tickUpper, (0, utilities_1.expandTo18Decimals)(1))];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, swapExact0For1((0, utilities_1.expandTo18Decimals)(1).div(100), wallet.address)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, pool.burn(tickLower, tickUpper, 0)]; // poke to accumulate fees
                            case 3:
                                _a.sent(); // poke to accumulate fees
                                return [4 /*yield*/, (0, snapshotGasCost_1.default)(pool.collect(wallet.address, tickLower, tickUpper, utilities_1.MaxUint128, utilities_1.MaxUint128))];
                            case 4:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('#increaseObservationCardinalityNext', function () {
                it('grow by 1 slot', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(pool.increaseObservationCardinalityNext(5))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('no op', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(pool.increaseObservationCardinalityNext(3))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('#snapshotCumulativesInside', function () {
                it('tick inside', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(pool.estimateGas.snapshotCumulativesInside(minTick, maxTick))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('tick above', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, swapToHigherPrice(utilities_1.MAX_SQRT_RATIO.sub(1), wallet.address)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, snapshotGasCost_1.default)(pool.estimateGas.snapshotCumulativesInside(minTick, maxTick))];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('tick below', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, swapToLowerPrice(utilities_1.MIN_SQRT_RATIO.add(1), wallet.address)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, (0, snapshotGasCost_1.default)(pool.estimateGas.snapshotCumulativesInside(minTick, maxTick))];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    };
    for (var _i = 0, _a = [0, 6]; _i < _a.length; _i++) {
        var feeProtocol = _a[_i];
        _loop_1(feeProtocol);
    }
});
