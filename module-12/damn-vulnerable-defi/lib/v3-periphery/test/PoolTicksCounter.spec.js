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
var ethereum_waffle_1 = require("ethereum-waffle");
describe('PoolTicksCounter', function () {
    var TICK_SPACINGS = [200, 60, 10];
    TICK_SPACINGS.forEach(function (TICK_SPACING) {
        var PoolTicksCounter;
        var pool;
        var PoolAbi;
        // Bit index to tick
        var bitIdxToTick = function (idx, page) {
            if (page === void 0) { page = 0; }
            return idx * TICK_SPACING + page * 256 * TICK_SPACING;
        };
        before(function () { return __awaiter(void 0, void 0, void 0, function () {
            var wallets, poolTicksHelperFactory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                    case 1:
                        wallets = _a.sent();
                        return [4 /*yield*/, hardhat_1.artifacts.readArtifact('IUniswapV3Pool')];
                    case 2:
                        PoolAbi = _a.sent();
                        return [4 /*yield*/, hardhat_1.ethers.getContractFactory('PoolTicksCounterTest')];
                    case 3:
                        poolTicksHelperFactory = _a.sent();
                        return [4 /*yield*/, poolTicksHelperFactory.deploy()];
                    case 4:
                        PoolTicksCounter = (_a.sent());
                        return [4 /*yield*/, (0, ethereum_waffle_1.deployMockContract)(wallets[0], PoolAbi.abi)];
                    case 5:
                        pool = _a.sent();
                        return [4 /*yield*/, pool.mock.tickSpacing.returns(TICK_SPACING)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe("[Tick Spacing: ".concat(TICK_SPACING, "]: tick after is bigger"), function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it('same tick initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.mock.tickBitmap.withArgs(0).returns(12)]; // 1100
                            case 1:
                                _a.sent(); // 1100
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(2), bitIdxToTick(2))];
                            case 2:
                                result = _a.sent();
                                (0, expect_1.expect)(result).to.be.eq(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('same tick not-initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.mock.tickBitmap.withArgs(0).returns(12)]; // 1100
                            case 1:
                                _a.sent(); // 1100
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(1), bitIdxToTick(1))];
                            case 2:
                                result = _a.sent();
                                (0, expect_1.expect)(result).to.be.eq(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('same page', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.mock.tickBitmap.withArgs(0).returns(12)]; // 1100
                            case 1:
                                _a.sent(); // 1100
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(0), bitIdxToTick(255))];
                            case 2:
                                result = _a.sent();
                                (0, expect_1.expect)(result).to.be.eq(2);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('multiple pages', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.mock.tickBitmap.withArgs(0).returns(12)]; // 1100
                            case 1:
                                _a.sent(); // 1100
                                return [4 /*yield*/, pool.mock.tickBitmap.withArgs(1).returns(13)]; // 1101
                            case 2:
                                _a.sent(); // 1101
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(0), bitIdxToTick(255, 1))];
                            case 3:
                                result = _a.sent();
                                (0, expect_1.expect)(result).to.be.eq(5);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('counts all ticks in a page except ending tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.mock.tickBitmap.withArgs(0).returns(hardhat_1.ethers.constants.MaxUint256)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, pool.mock.tickBitmap.withArgs(1).returns(0x0)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(0), bitIdxToTick(255, 1))];
                            case 3:
                                result = _a.sent();
                                (0, expect_1.expect)(result).to.be.eq(255);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('counts ticks to left of start and right of end on same page', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.mock.tickBitmap.withArgs(0).returns(61711)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(8), bitIdxToTick(255))];
                            case 2:
                                result = _a.sent();
                                (0, expect_1.expect)(result).to.be.eq(4);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('counts ticks to left of start and right of end across on multiple pages', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.mock.tickBitmap.withArgs(0).returns(61711)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, pool.mock.tickBitmap.withArgs(1).returns(61711)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(8), bitIdxToTick(8, 1))];
                            case 3:
                                result = _a.sent();
                                (0, expect_1.expect)(result).to.be.eq(9);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('counts ticks when before and after are initialized on same page', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var startingTickInit, endingTickInit, bothInit;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.mock.tickBitmap.withArgs(0).returns(252)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(2), bitIdxToTick(255))];
                            case 2:
                                startingTickInit = _a.sent();
                                (0, expect_1.expect)(startingTickInit).to.be.eq(5);
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(0), bitIdxToTick(3))];
                            case 3:
                                endingTickInit = _a.sent();
                                (0, expect_1.expect)(endingTickInit).to.be.eq(2);
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(2), bitIdxToTick(5))];
                            case 4:
                                bothInit = _a.sent();
                                (0, expect_1.expect)(bothInit).to.be.eq(3);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('counts ticks when before and after are initialized on multiple page', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var startingTickInit, endingTickInit, bothInit;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.mock.tickBitmap.withArgs(0).returns(252)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, pool.mock.tickBitmap.withArgs(1).returns(252)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(2), bitIdxToTick(255))];
                            case 3:
                                startingTickInit = _a.sent();
                                (0, expect_1.expect)(startingTickInit).to.be.eq(5);
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(0), bitIdxToTick(3, 1))];
                            case 4:
                                endingTickInit = _a.sent();
                                (0, expect_1.expect)(endingTickInit).to.be.eq(8);
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(2), bitIdxToTick(5, 1))];
                            case 5:
                                bothInit = _a.sent();
                                (0, expect_1.expect)(bothInit).to.be.eq(9);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('counts ticks with lots of pages', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var bothInit;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.mock.tickBitmap.withArgs(0).returns(252)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, pool.mock.tickBitmap.withArgs(1).returns(255)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, pool.mock.tickBitmap.withArgs(2).returns(0x0)];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, pool.mock.tickBitmap.withArgs(3).returns(0x0)];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, pool.mock.tickBitmap.withArgs(4).returns(252)];
                            case 5:
                                _a.sent();
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(4), bitIdxToTick(5, 4))];
                            case 6:
                                bothInit = _a.sent();
                                (0, expect_1.expect)(bothInit).to.be.eq(15);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("[Tick Spacing: ".concat(TICK_SPACING, "]: tick after is smaller"), function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it('same page', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.mock.tickBitmap.withArgs(0).returns(12)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(255), bitIdxToTick(0))];
                            case 2:
                                result = _a.sent();
                                (0, expect_1.expect)(result).to.be.eq(2);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('multiple pages', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.mock.tickBitmap.withArgs(0).returns(12)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, pool.mock.tickBitmap.withArgs(-1).returns(12)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(255), bitIdxToTick(0, -1))];
                            case 3:
                                result = _a.sent();
                                (0, expect_1.expect)(result).to.be.eq(4);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('counts all ticks in a page', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.mock.tickBitmap.withArgs(0).returns(hardhat_1.ethers.constants.MaxUint256)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, pool.mock.tickBitmap.withArgs(-1).returns(0x0)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(255), bitIdxToTick(0, -1))];
                            case 3:
                                result = _a.sent();
                                (0, expect_1.expect)(result).to.be.eq(256);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('counts ticks to right of start and left of end on same page', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.mock.tickBitmap.withArgs(0).returns(61711)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(15), bitIdxToTick(2))];
                            case 2:
                                result = _a.sent();
                                (0, expect_1.expect)(result).to.be.eq(6);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('counts ticks to right of start and left of end on multiple pages', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.mock.tickBitmap.withArgs(0).returns(61711)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, pool.mock.tickBitmap.withArgs(-1).returns(61711)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(8), bitIdxToTick(8, -1))];
                            case 3:
                                result = _a.sent();
                                (0, expect_1.expect)(result).to.be.eq(9);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('counts ticks when before and after are initialized on same page', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var startingTickInit, endingTickInit, bothInit;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.mock.tickBitmap.withArgs(0).returns(252)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(3), bitIdxToTick(0))];
                            case 2:
                                startingTickInit = _a.sent();
                                (0, expect_1.expect)(startingTickInit).to.be.eq(2);
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(255), bitIdxToTick(2))];
                            case 3:
                                endingTickInit = _a.sent();
                                (0, expect_1.expect)(endingTickInit).to.be.eq(5);
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(5), bitIdxToTick(2))];
                            case 4:
                                bothInit = _a.sent();
                                (0, expect_1.expect)(bothInit).to.be.eq(3);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('counts ticks when before and after are initialized on multiple page', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var startingTickInit, endingTickInit, bothInit;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.mock.tickBitmap.withArgs(0).returns(252)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, pool.mock.tickBitmap.withArgs(-1).returns(252)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(2), bitIdxToTick(3, -1))];
                            case 3:
                                startingTickInit = _a.sent();
                                (0, expect_1.expect)(startingTickInit).to.be.eq(5);
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(5), bitIdxToTick(255, -1))];
                            case 4:
                                endingTickInit = _a.sent();
                                (0, expect_1.expect)(endingTickInit).to.be.eq(4);
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(2), bitIdxToTick(5, -1))];
                            case 5:
                                bothInit = _a.sent();
                                (0, expect_1.expect)(bothInit).to.be.eq(3);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('counts ticks with lots of pages', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var bothInit;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, pool.mock.tickBitmap.withArgs(0).returns(252)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, pool.mock.tickBitmap.withArgs(-1).returns(0xff)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, pool.mock.tickBitmap.withArgs(-2).returns(0x0)];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, pool.mock.tickBitmap.withArgs(-3).returns(0x0)];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, pool.mock.tickBitmap.withArgs(-4).returns(252)];
                            case 5:
                                _a.sent();
                                return [4 /*yield*/, PoolTicksCounter.countInitializedTicksCrossed(pool.address, bitIdxToTick(3), bitIdxToTick(6, -4))];
                            case 6:
                                bothInit = _a.sent();
                                (0, expect_1.expect)(bothInit).to.be.eq(11);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
    });
});
