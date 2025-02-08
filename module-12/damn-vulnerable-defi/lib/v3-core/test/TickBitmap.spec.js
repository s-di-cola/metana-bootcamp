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
var snapshotGasCost_1 = require("./shared/snapshotGasCost");
describe('TickBitmap', function () {
    var tickBitmap;
    beforeEach('deploy TickBitmapTest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var tickBitmapTestFactory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TickBitmapTest')];
                case 1:
                    tickBitmapTestFactory = _a.sent();
                    return [4 /*yield*/, tickBitmapTestFactory.deploy()];
                case 2:
                    tickBitmap = (_a.sent());
                    return [2 /*return*/];
            }
        });
    }); });
    function initTicks(ticks) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, ticks_1, tick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, ticks_1 = ticks;
                        _a.label = 1;
                    case 1:
                        if (!(_i < ticks_1.length)) return [3 /*break*/, 4];
                        tick = ticks_1[_i];
                        return [4 /*yield*/, tickBitmap.flipTick(tick)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    describe('#isInitialized', function () {
        it('is false at first', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, tickBitmap.isInitialized(1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('is flipped by #flipTick', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tickBitmap.flipTick(1)];
                    case 1:
                        _b.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, tickBitmap.isInitialized(1)];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).to.eq(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('is flipped back by #flipTick', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tickBitmap.flipTick(1)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, tickBitmap.flipTick(1)];
                    case 2:
                        _b.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, tickBitmap.isInitialized(1)];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).to.eq(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('is not changed by another flip to a different tick', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tickBitmap.flipTick(2)];
                    case 1:
                        _b.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, tickBitmap.isInitialized(1)];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).to.eq(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('is not changed by another flip to a different tick on another word', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tickBitmap.flipTick(1 + 256)];
                    case 1:
                        _c.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, tickBitmap.isInitialized(257)];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).to.eq(true);
                        _b = expect_1.expect;
                        return [4 /*yield*/, tickBitmap.isInitialized(1)];
                    case 3:
                        _b.apply(void 0, [_c.sent()]).to.eq(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#flipTick', function () {
        it('flips only the specified tick', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0: return [4 /*yield*/, tickBitmap.flipTick(-230)];
                    case 1:
                        _l.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, tickBitmap.isInitialized(-230)];
                    case 2:
                        _a.apply(void 0, [_l.sent()]).to.eq(true);
                        _b = expect_1.expect;
                        return [4 /*yield*/, tickBitmap.isInitialized(-231)];
                    case 3:
                        _b.apply(void 0, [_l.sent()]).to.eq(false);
                        _c = expect_1.expect;
                        return [4 /*yield*/, tickBitmap.isInitialized(-229)];
                    case 4:
                        _c.apply(void 0, [_l.sent()]).to.eq(false);
                        _d = expect_1.expect;
                        return [4 /*yield*/, tickBitmap.isInitialized(-230 + 256)];
                    case 5:
                        _d.apply(void 0, [_l.sent()]).to.eq(false);
                        _e = expect_1.expect;
                        return [4 /*yield*/, tickBitmap.isInitialized(-230 - 256)];
                    case 6:
                        _e.apply(void 0, [_l.sent()]).to.eq(false);
                        return [4 /*yield*/, tickBitmap.flipTick(-230)];
                    case 7:
                        _l.sent();
                        _f = expect_1.expect;
                        return [4 /*yield*/, tickBitmap.isInitialized(-230)];
                    case 8:
                        _f.apply(void 0, [_l.sent()]).to.eq(false);
                        _g = expect_1.expect;
                        return [4 /*yield*/, tickBitmap.isInitialized(-231)];
                    case 9:
                        _g.apply(void 0, [_l.sent()]).to.eq(false);
                        _h = expect_1.expect;
                        return [4 /*yield*/, tickBitmap.isInitialized(-229)];
                    case 10:
                        _h.apply(void 0, [_l.sent()]).to.eq(false);
                        _j = expect_1.expect;
                        return [4 /*yield*/, tickBitmap.isInitialized(-230 + 256)];
                    case 11:
                        _j.apply(void 0, [_l.sent()]).to.eq(false);
                        _k = expect_1.expect;
                        return [4 /*yield*/, tickBitmap.isInitialized(-230 - 256)];
                    case 12:
                        _k.apply(void 0, [_l.sent()]).to.eq(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('reverts only itself', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, tickBitmap.flipTick(-230)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, tickBitmap.flipTick(-259)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, tickBitmap.flipTick(-229)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, tickBitmap.flipTick(500)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, tickBitmap.flipTick(-259)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, tickBitmap.flipTick(-229)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, tickBitmap.flipTick(-259)];
                    case 7:
                        _c.sent();
                        _a = expect_1.expect;
                        return [4 /*yield*/, tickBitmap.isInitialized(-259)];
                    case 8:
                        _a.apply(void 0, [_c.sent()]).to.eq(true);
                        _b = expect_1.expect;
                        return [4 /*yield*/, tickBitmap.isInitialized(-229)];
                    case 9:
                        _b.apply(void 0, [_c.sent()]).to.eq(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas cost of flipping first tick in word to initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = snapshotGasCost_1.default;
                        return [4 /*yield*/, tickBitmap.getGasCostOfFlipTick(1)];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas cost of flipping second tick in word to initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tickBitmap.flipTick(0)];
                    case 1:
                        _b.sent();
                        _a = snapshotGasCost_1.default;
                        return [4 /*yield*/, tickBitmap.getGasCostOfFlipTick(1)];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('gas cost of flipping a tick that results in deleting a word', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, tickBitmap.flipTick(0)];
                    case 1:
                        _b.sent();
                        _a = snapshotGasCost_1.default;
                        return [4 /*yield*/, tickBitmap.getGasCostOfFlipTick(0)];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#nextInitializedTickWithinOneWord', function () {
        beforeEach('set up some ticks', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // word boundaries are at multiples of 256
                    return [4 /*yield*/, initTicks([-200, -55, -4, 70, 78, 84, 139, 240, 535])];
                    case 1:
                        // word boundaries are at multiples of 256
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('lte = false', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it('returns tick to right if at initialized tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, next, initialized;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(78, false)];
                            case 1:
                                _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                                (0, expect_1.expect)(next).to.eq(84);
                                (0, expect_1.expect)(initialized).to.eq(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('returns tick to right if at initialized tick', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, next, initialized;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(-55, false)];
                            case 1:
                                _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                                (0, expect_1.expect)(next).to.eq(-4);
                                (0, expect_1.expect)(initialized).to.eq(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('returns the tick directly to the right', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, next, initialized;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(77, false)];
                            case 1:
                                _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                                (0, expect_1.expect)(next).to.eq(78);
                                (0, expect_1.expect)(initialized).to.eq(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('returns the tick directly to the right', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, next, initialized;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(-56, false)];
                            case 1:
                                _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                                (0, expect_1.expect)(next).to.eq(-55);
                                (0, expect_1.expect)(initialized).to.eq(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('returns the next words initialized tick if on the right boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, next, initialized;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(255, false)];
                            case 1:
                                _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                                (0, expect_1.expect)(next).to.eq(511);
                                (0, expect_1.expect)(initialized).to.eq(false);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('returns the next words initialized tick if on the right boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, next, initialized;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(-257, false)];
                            case 1:
                                _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                                (0, expect_1.expect)(next).to.eq(-200);
                                (0, expect_1.expect)(initialized).to.eq(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('returns the next initialized tick from the next word', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, next, initialized;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, tickBitmap.flipTick(340)];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(328, false)];
                            case 2:
                                _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                                (0, expect_1.expect)(next).to.eq(340);
                                (0, expect_1.expect)(initialized).to.eq(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('does not exceed boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, next, initialized;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(508, false)];
                            case 1:
                                _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                                (0, expect_1.expect)(next).to.eq(511);
                                (0, expect_1.expect)(initialized).to.eq(false);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('skips entire word', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, next, initialized;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(255, false)];
                            case 1:
                                _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                                (0, expect_1.expect)(next).to.eq(511);
                                (0, expect_1.expect)(initialized).to.eq(false);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('skips half word', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, next, initialized;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(383, false)];
                            case 1:
                                _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                                (0, expect_1.expect)(next).to.eq(511);
                                (0, expect_1.expect)(initialized).to.eq(false);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('gas cost on boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = snapshotGasCost_1.default;
                                return [4 /*yield*/, tickBitmap.getGasCostOfNextInitializedTickWithinOneWord(255, false)];
                            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('gas cost just below boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = snapshotGasCost_1.default;
                                return [4 /*yield*/, tickBitmap.getGasCostOfNextInitializedTickWithinOneWord(254, false)];
                            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('gas cost for entire word', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = snapshotGasCost_1.default;
                                return [4 /*yield*/, tickBitmap.getGasCostOfNextInitializedTickWithinOneWord(768, false)];
                            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                            case 2:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe('lte = true', function () {
            it('returns same tick if initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, next, initialized;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(78, true)];
                        case 1:
                            _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                            (0, expect_1.expect)(next).to.eq(78);
                            (0, expect_1.expect)(initialized).to.eq(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('returns tick directly to the left of input tick if not initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, next, initialized;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(79, true)];
                        case 1:
                            _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                            (0, expect_1.expect)(next).to.eq(78);
                            (0, expect_1.expect)(initialized).to.eq(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('will not exceed the word boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, next, initialized;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(258, true)];
                        case 1:
                            _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                            (0, expect_1.expect)(next).to.eq(256);
                            (0, expect_1.expect)(initialized).to.eq(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('at the word boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, next, initialized;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(256, true)];
                        case 1:
                            _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                            (0, expect_1.expect)(next).to.eq(256);
                            (0, expect_1.expect)(initialized).to.eq(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('word boundary less 1 (next initialized tick in next word)', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, next, initialized;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(72, true)];
                        case 1:
                            _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                            (0, expect_1.expect)(next).to.eq(70);
                            (0, expect_1.expect)(initialized).to.eq(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('word boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, next, initialized;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(-257, true)];
                        case 1:
                            _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                            (0, expect_1.expect)(next).to.eq(-512);
                            (0, expect_1.expect)(initialized).to.eq(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('entire empty word', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, next, initialized;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(1023, true)];
                        case 1:
                            _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                            (0, expect_1.expect)(next).to.eq(768);
                            (0, expect_1.expect)(initialized).to.eq(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('halfway through empty word', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, next, initialized;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(900, true)];
                        case 1:
                            _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                            (0, expect_1.expect)(next).to.eq(768);
                            (0, expect_1.expect)(initialized).to.eq(false);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('boundary is initialized', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, next, initialized;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, tickBitmap.flipTick(329)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, tickBitmap.nextInitializedTickWithinOneWord(456, true)];
                        case 2:
                            _a = _b.sent(), next = _a.next, initialized = _a.initialized;
                            (0, expect_1.expect)(next).to.eq(329);
                            (0, expect_1.expect)(initialized).to.eq(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas cost on boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = snapshotGasCost_1.default;
                            return [4 /*yield*/, tickBitmap.getGasCostOfNextInitializedTickWithinOneWord(256, true)];
                        case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas cost just below boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = snapshotGasCost_1.default;
                            return [4 /*yield*/, tickBitmap.getGasCostOfNextInitializedTickWithinOneWord(255, true)];
                        case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas cost for entire word', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = snapshotGasCost_1.default;
                            return [4 /*yield*/, tickBitmap.getGasCostOfNextInitializedTickWithinOneWord(1024, true)];
                        case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
