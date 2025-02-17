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
var expect_1 = require("./shared/expect");
var snapshotGasCost_1 = require("./shared/snapshotGasCost");
var utilities_1 = require("./shared/utilities");
var decimal_js_1 = require("decimal.js");
var MIN_TICK = -887272;
var MAX_TICK = 887272;
decimal_js_1.default.config({ toExpNeg: -500, toExpPos: 500 });
describe('TickMath', function () {
    var tickMath;
    before('deploy TickMathTest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var factory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TickMathTest')];
                case 1:
                    factory = _a.sent();
                    return [4 /*yield*/, factory.deploy()];
                case 2:
                    tickMath = (_a.sent());
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#getSqrtRatioAtTick', function () {
        it('throws for too low', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(tickMath.getSqrtRatioAtTick(MIN_TICK - 1)).to.be.revertedWith('T')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws for too low', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(tickMath.getSqrtRatioAtTick(MAX_TICK + 1)).to.be.revertedWith('T')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('min tick', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, tickMath.getSqrtRatioAtTick(MIN_TICK)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('4295128739');
                        return [2 /*return*/];
                }
            });
        }); });
        it('min tick +1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, tickMath.getSqrtRatioAtTick(MIN_TICK + 1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('4295343490');
                        return [2 /*return*/];
                }
            });
        }); });
        it('max tick - 1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, tickMath.getSqrtRatioAtTick(MAX_TICK - 1)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('1461373636630004318706518188784493106690254656249');
                        return [2 /*return*/];
                }
            });
        }); });
        it('min tick ratio is less than js implementation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, tickMath.getSqrtRatioAtTick(MIN_TICK)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.be.lt((0, utilities_1.encodePriceSqrt)(1, ethers_1.BigNumber.from(2).pow(127)));
                        return [2 /*return*/];
                }
            });
        }); });
        it('max tick ratio is greater than js implementation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, tickMath.getSqrtRatioAtTick(MAX_TICK)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.be.gt((0, utilities_1.encodePriceSqrt)(ethers_1.BigNumber.from(2).pow(127), 1));
                        return [2 /*return*/];
                }
            });
        }); });
        it('max tick', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, tickMath.getSqrtRatioAtTick(MAX_TICK)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('1461446703485210103287273052203988822378723970342');
                        return [2 /*return*/];
                }
            });
        }); });
        for (var _i = 0, _a = [
            50, 100, 250, 500, 1000, 2500, 3000, 4000, 5000, 50000, 150000, 250000, 500000, 738203,
        ]; _i < _a.length; _i++) {
            var absTick = _a[_i];
            var _loop_1 = function (tick) {
                describe("tick ".concat(tick), function () {
                    it('is at most off by 1/100th of a bips', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var jsResult, result, absDiff;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    jsResult = new decimal_js_1.default(1.0001).pow(tick).sqrt().mul(new decimal_js_1.default(2).pow(96));
                                    return [4 /*yield*/, tickMath.getSqrtRatioAtTick(tick)];
                                case 1:
                                    result = _a.sent();
                                    absDiff = new decimal_js_1.default(result.toString()).sub(jsResult).abs();
                                    (0, expect_1.expect)(absDiff.div(jsResult).toNumber()).to.be.lt(0.000001);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('result', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = expect_1.expect;
                                    return [4 /*yield*/, tickMath.getSqrtRatioAtTick(tick)];
                                case 1:
                                    _a.apply(void 0, [(_b.sent()).toString()]).to.matchSnapshot();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(tickMath.getGasCostOfGetSqrtRatioAtTick(tick))];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
            };
            for (var _b = 0, _c = [-absTick, absTick]; _b < _c.length; _b++) {
                var tick = _c[_b];
                _loop_1(tick);
            }
        }
    });
    describe('#MIN_SQRT_RATIO', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            it('equals #getSqrtRatioAtTick(MIN_TICK)', function () { return __awaiter(void 0, void 0, void 0, function () {
                var min, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, tickMath.getSqrtRatioAtTick(MIN_TICK)];
                        case 1:
                            min = _c.sent();
                            _b = (_a = (0, expect_1.expect)(min).to).eq;
                            return [4 /*yield*/, tickMath.MIN_SQRT_RATIO()];
                        case 2:
                            _b.apply(_a, [_c.sent()]);
                            (0, expect_1.expect)(min).to.eq(utilities_1.MIN_SQRT_RATIO);
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
    describe('#MAX_SQRT_RATIO', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            it('equals #getSqrtRatioAtTick(MAX_TICK)', function () { return __awaiter(void 0, void 0, void 0, function () {
                var max, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, tickMath.getSqrtRatioAtTick(MAX_TICK)];
                        case 1:
                            max = _c.sent();
                            _b = (_a = (0, expect_1.expect)(max).to).eq;
                            return [4 /*yield*/, tickMath.MAX_SQRT_RATIO()];
                        case 2:
                            _b.apply(_a, [_c.sent()]);
                            (0, expect_1.expect)(max).to.eq(utilities_1.MAX_SQRT_RATIO);
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
    describe('#getTickAtSqrtRatio', function () {
        it('throws for too low', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(tickMath.getTickAtSqrtRatio(utilities_1.MIN_SQRT_RATIO.sub(1))).to.be.revertedWith('R')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws for too high', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(tickMath.getTickAtSqrtRatio(ethers_1.BigNumber.from(utilities_1.MAX_SQRT_RATIO))).to.be.revertedWith('R')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('ratio of min tick', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, tickMath.getTickAtSqrtRatio(utilities_1.MIN_SQRT_RATIO)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(MIN_TICK);
                        return [2 /*return*/];
                }
            });
        }); });
        it('ratio of min tick + 1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, tickMath.getTickAtSqrtRatio('4295343490')];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(MIN_TICK + 1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('ratio of max tick - 1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, tickMath.getTickAtSqrtRatio('1461373636630004318706518188784493106690254656249')];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(MAX_TICK - 1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('ratio closest to max tick', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, tickMath.getTickAtSqrtRatio(utilities_1.MAX_SQRT_RATIO.sub(1))];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(MAX_TICK - 1);
                        return [2 /*return*/];
                }
            });
        }); });
        var _loop_2 = function (ratio) {
            describe("ratio ".concat(ratio), function () {
                it('is at most off by 1', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var jsResult, result, absDiff;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                jsResult = new decimal_js_1.default(ratio.toString()).div(new decimal_js_1.default(2).pow(96)).pow(2).log(1.0001).floor();
                                return [4 /*yield*/, tickMath.getTickAtSqrtRatio(ratio)];
                            case 1:
                                result = _a.sent();
                                absDiff = new decimal_js_1.default(result.toString()).sub(jsResult).abs();
                                (0, expect_1.expect)(absDiff.toNumber()).to.be.lte(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('ratio is between the tick and tick+1', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tick, ratioOfTick, ratioOfTickPlusOne;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, tickMath.getTickAtSqrtRatio(ratio)];
                            case 1:
                                tick = _a.sent();
                                return [4 /*yield*/, tickMath.getSqrtRatioAtTick(tick)];
                            case 2:
                                ratioOfTick = _a.sent();
                                return [4 /*yield*/, tickMath.getSqrtRatioAtTick(tick + 1)];
                            case 3:
                                ratioOfTickPlusOne = _a.sent();
                                (0, expect_1.expect)(ratio).to.be.gte(ratioOfTick);
                                (0, expect_1.expect)(ratio).to.be.lt(ratioOfTickPlusOne);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('result', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = expect_1.expect;
                                return [4 /*yield*/, tickMath.getTickAtSqrtRatio(ratio)];
                            case 1:
                                _a.apply(void 0, [_b.sent()]).to.matchSnapshot();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(tickMath.getGasCostOfGetTickAtSqrtRatio(ratio))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        };
        for (var _i = 0, _a = [
            utilities_1.MIN_SQRT_RATIO,
            (0, utilities_1.encodePriceSqrt)(ethers_1.BigNumber.from(10).pow(12), 1),
            (0, utilities_1.encodePriceSqrt)(ethers_1.BigNumber.from(10).pow(6), 1),
            (0, utilities_1.encodePriceSqrt)(1, 64),
            (0, utilities_1.encodePriceSqrt)(1, 8),
            (0, utilities_1.encodePriceSqrt)(1, 2),
            (0, utilities_1.encodePriceSqrt)(1, 1),
            (0, utilities_1.encodePriceSqrt)(2, 1),
            (0, utilities_1.encodePriceSqrt)(8, 1),
            (0, utilities_1.encodePriceSqrt)(64, 1),
            (0, utilities_1.encodePriceSqrt)(1, ethers_1.BigNumber.from(10).pow(6)),
            (0, utilities_1.encodePriceSqrt)(1, ethers_1.BigNumber.from(10).pow(12)),
            utilities_1.MAX_SQRT_RATIO.sub(1),
        ]; _i < _a.length; _i++) {
            var ratio = _a[_i];
            _loop_2(ratio);
        }
    });
});
