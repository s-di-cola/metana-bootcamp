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
var decimal_js_1 = require("decimal.js");
var BigNumber = hardhat_1.ethers.BigNumber, MaxUint256 = hardhat_1.ethers.constants.MaxUint256;
var Q128 = BigNumber.from(2).pow(128);
decimal_js_1.Decimal.config({ toExpNeg: -500, toExpPos: 500 });
describe('FullMath', function () {
    var fullMath;
    before('deploy FullMathTest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var factory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('FullMathTest')];
                case 1:
                    factory = _a.sent();
                    return [4 /*yield*/, factory.deploy()];
                case 2:
                    fullMath = (_a.sent());
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#mulDiv', function () {
        it('reverts if denominator is 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(fullMath.mulDiv(Q128, 5, 0)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('reverts if denominator is 0 and numerator overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(fullMath.mulDiv(Q128, Q128, 0)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('reverts if output overflows uint256', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(fullMath.mulDiv(Q128, Q128, 1)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('reverts if output overflows uint256', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(fullMath.mulDiv(Q128, Q128, 1)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('reverts on overflow with all max inputs', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(fullMath.mulDiv(MaxUint256, MaxUint256, MaxUint256.sub(1))).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('all max inputs', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, fullMath.mulDiv(MaxUint256, MaxUint256, MaxUint256)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(MaxUint256);
                        return [2 /*return*/];
                }
            });
        }); });
        it('accurate without phantom overflow', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = Q128.div(3);
                        _a = expect_1.expect;
                        return [4 /*yield*/, fullMath.mulDiv(Q128, 
                            /*0.5=*/ BigNumber.from(50).mul(Q128).div(100), 
                            /*1.5=*/ BigNumber.from(150).mul(Q128).div(100))];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(result);
                        return [2 /*return*/];
                }
            });
        }); });
        it('accurate with phantom overflow', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = BigNumber.from(4375).mul(Q128).div(1000);
                        _a = expect_1.expect;
                        return [4 /*yield*/, fullMath.mulDiv(Q128, BigNumber.from(35).mul(Q128), BigNumber.from(8).mul(Q128))];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(result);
                        return [2 /*return*/];
                }
            });
        }); });
        it('accurate with phantom overflow and repeating decimal', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = BigNumber.from(1).mul(Q128).div(3);
                        _a = expect_1.expect;
                        return [4 /*yield*/, fullMath.mulDiv(Q128, BigNumber.from(1000).mul(Q128), BigNumber.from(3000).mul(Q128))];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(result);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#mulDivRoundingUp', function () {
        it('reverts if denominator is 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(fullMath.mulDivRoundingUp(Q128, 5, 0)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('reverts if denominator is 0 and numerator overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(fullMath.mulDivRoundingUp(Q128, Q128, 0)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('reverts if output overflows uint256', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(fullMath.mulDivRoundingUp(Q128, Q128, 1)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('reverts on overflow with all max inputs', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(fullMath.mulDivRoundingUp(MaxUint256, MaxUint256, MaxUint256.sub(1))).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('reverts if mulDiv overflows 256 bits after rounding up', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(fullMath.mulDivRoundingUp('535006138814359', '432862656469423142931042426214547535783388063929571229938474969', '2')).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('reverts if mulDiv overflows 256 bits after rounding up case 2', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(fullMath.mulDivRoundingUp('115792089237316195423570985008687907853269984659341747863450311749907997002549', '115792089237316195423570985008687907853269984659341747863450311749907997002550', '115792089237316195423570985008687907853269984653042931687443039491902864365164')).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('all max inputs', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, fullMath.mulDivRoundingUp(MaxUint256, MaxUint256, MaxUint256)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(MaxUint256);
                        return [2 /*return*/];
                }
            });
        }); });
        it('accurate without phantom overflow', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = Q128.div(3).add(1);
                        _a = expect_1.expect;
                        return [4 /*yield*/, fullMath.mulDivRoundingUp(Q128, 
                            /*0.5=*/ BigNumber.from(50).mul(Q128).div(100), 
                            /*1.5=*/ BigNumber.from(150).mul(Q128).div(100))];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(result);
                        return [2 /*return*/];
                }
            });
        }); });
        it('accurate with phantom overflow', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = BigNumber.from(4375).mul(Q128).div(1000);
                        _a = expect_1.expect;
                        return [4 /*yield*/, fullMath.mulDivRoundingUp(Q128, BigNumber.from(35).mul(Q128), BigNumber.from(8).mul(Q128))];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(result);
                        return [2 /*return*/];
                }
            });
        }); });
        it('accurate with phantom overflow and repeating decimal', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = BigNumber.from(1).mul(Q128).div(3).add(1);
                        _a = expect_1.expect;
                        return [4 /*yield*/, fullMath.mulDivRoundingUp(Q128, BigNumber.from(1000).mul(Q128), BigNumber.from(3000).mul(Q128))];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(result);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    function pseudoRandomBigNumber() {
        return BigNumber.from(new decimal_js_1.Decimal(MaxUint256.toString()).mul(Math.random().toString()).round().toString());
    }
    // tiny fuzzer. unskip to run
    it.skip('check a bunch of random inputs against JS implementation', function () { return __awaiter(void 0, void 0, void 0, function () {
        var tests;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tests = Array(1000)
                        .fill(null)
                        .map(function () {
                        return {
                            x: pseudoRandomBigNumber(),
                            y: pseudoRandomBigNumber(),
                            d: pseudoRandomBigNumber(),
                        };
                    })
                        .map(function (_a) {
                        var x = _a.x, y = _a.y, d = _a.d;
                        return {
                            input: {
                                x: x,
                                y: y,
                                d: d,
                            },
                            floored: fullMath.mulDiv(x, y, d),
                            ceiled: fullMath.mulDivRoundingUp(x, y, d),
                        };
                    });
                    return [4 /*yield*/, Promise.all(tests.map(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                            var _c, _d;
                            var _e = _b.input, x = _e.x, y = _e.y, d = _e.d, floored = _b.floored, ceiled = _b.ceiled;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        if (!d.eq(0)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, (0, expect_1.expect)(floored).to.be.reverted];
                                    case 1:
                                        _f.sent();
                                        return [4 /*yield*/, (0, expect_1.expect)(ceiled).to.be.reverted];
                                    case 2:
                                        _f.sent();
                                        return [2 /*return*/];
                                    case 3:
                                        if (!(x.eq(0) || y.eq(0))) return [3 /*break*/, 6];
                                        return [4 /*yield*/, (0, expect_1.expect)(floored).to.eq(0)];
                                    case 4:
                                        _f.sent();
                                        return [4 /*yield*/, (0, expect_1.expect)(ceiled).to.eq(0)];
                                    case 5:
                                        _f.sent();
                                        return [3 /*break*/, 12];
                                    case 6:
                                        if (!x.mul(y).div(d).gt(MaxUint256)) return [3 /*break*/, 9];
                                        return [4 /*yield*/, (0, expect_1.expect)(floored).to.be.reverted];
                                    case 7:
                                        _f.sent();
                                        return [4 /*yield*/, (0, expect_1.expect)(ceiled).to.be.reverted];
                                    case 8:
                                        _f.sent();
                                        return [3 /*break*/, 12];
                                    case 9:
                                        _c = expect_1.expect;
                                        return [4 /*yield*/, floored];
                                    case 10:
                                        _c.apply(void 0, [_f.sent()]).to.eq(x.mul(y).div(d));
                                        _d = expect_1.expect;
                                        return [4 /*yield*/, ceiled];
                                    case 11:
                                        _d.apply(void 0, [_f.sent()]).to.eq(x
                                            .mul(y)
                                            .div(d)
                                            .add(x.mul(y).mod(d).gt(0) ? 1 : 0));
                                        _f.label = 12;
                                    case 12: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
