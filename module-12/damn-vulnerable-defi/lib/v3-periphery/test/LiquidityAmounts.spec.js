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
var encodePriceSqrt_1 = require("./shared/encodePriceSqrt");
var expect_1 = require("./shared/expect");
var snapshotGasCost_1 = require("./shared/snapshotGasCost");
describe('LiquidityAmounts', function () { return __awaiter(void 0, void 0, void 0, function () {
    var liquidityFromAmounts;
    return __generator(this, function (_a) {
        before('deploy test library', function () { return __awaiter(void 0, void 0, void 0, function () {
            var liquidityFromAmountsTestFactory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('LiquidityAmountsTest')];
                    case 1:
                        liquidityFromAmountsTestFactory = _a.sent();
                        return [4 /*yield*/, liquidityFromAmountsTestFactory.deploy()];
                    case 2:
                        liquidityFromAmounts = (_a.sent());
                        return [2 /*return*/];
                }
            });
        }); });
        describe('#getLiquidityForAmount0', function () {
            it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceAX96, sqrtPriceBX96;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            return [4 /*yield*/, (0, snapshotGasCost_1.default)(liquidityFromAmounts.getGasCostOfGetLiquidityForAmount0(sqrtPriceAX96, sqrtPriceBX96, 100))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('#getLiquidityForAmount1', function () {
            it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceAX96, sqrtPriceBX96;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            return [4 /*yield*/, (0, snapshotGasCost_1.default)(liquidityFromAmounts.getGasCostOfGetLiquidityForAmount1(sqrtPriceAX96, sqrtPriceBX96, 100))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('#getLiquidityForAmounts', function () {
            it('amounts for price inside', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, liquidity;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sqrtPriceX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1);
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            return [4 /*yield*/, liquidityFromAmounts.getLiquidityForAmounts(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, 100, 200)];
                        case 1:
                            liquidity = _a.sent();
                            (0, expect_1.expect)(liquidity).to.eq(2148);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('amounts for price below', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, liquidity;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sqrtPriceX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(99, 110);
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            return [4 /*yield*/, liquidityFromAmounts.getLiquidityForAmounts(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, 100, 200)];
                        case 1:
                            liquidity = _a.sent();
                            (0, expect_1.expect)(liquidity).to.eq(1048);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('amounts for price above', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, liquidity;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sqrtPriceX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(111, 100);
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            return [4 /*yield*/, liquidityFromAmounts.getLiquidityForAmounts(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, 100, 200)];
                        case 1:
                            liquidity = _a.sent();
                            (0, expect_1.expect)(liquidity).to.eq(2097);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('amounts for price equal to lower boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceAX96, sqrtPriceX96, sqrtPriceBX96, liquidity;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceX96 = sqrtPriceAX96;
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            return [4 /*yield*/, liquidityFromAmounts.getLiquidityForAmounts(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, 100, 200)];
                        case 1:
                            liquidity = _a.sent();
                            (0, expect_1.expect)(liquidity).to.eq(1048);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('amounts for price equal to upper boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceAX96, sqrtPriceBX96, sqrtPriceX96, liquidity;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            sqrtPriceX96 = sqrtPriceBX96;
                            return [4 /*yield*/, liquidityFromAmounts.getLiquidityForAmounts(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, 100, 200)];
                        case 1:
                            liquidity = _a.sent();
                            (0, expect_1.expect)(liquidity).to.eq(2097);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas for price below', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sqrtPriceX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(99, 110);
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            return [4 /*yield*/, (0, snapshotGasCost_1.default)(liquidityFromAmounts.getGasCostOfGetLiquidityForAmounts(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, 100, 200))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas for price above', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sqrtPriceX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(111, 100);
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            return [4 /*yield*/, (0, snapshotGasCost_1.default)(liquidityFromAmounts.getGasCostOfGetLiquidityForAmounts(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, 100, 200))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas for price inside', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sqrtPriceX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1);
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            return [4 /*yield*/, (0, snapshotGasCost_1.default)(liquidityFromAmounts.getGasCostOfGetLiquidityForAmounts(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, 100, 200))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('#getAmount0ForLiquidity', function () {
            it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceAX96, sqrtPriceBX96;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            return [4 /*yield*/, (0, snapshotGasCost_1.default)(liquidityFromAmounts.getGasCostOfGetAmount0ForLiquidity(sqrtPriceAX96, sqrtPriceBX96, 100))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('#getLiquidityForAmount1', function () {
            it('gas', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceAX96, sqrtPriceBX96;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            return [4 /*yield*/, (0, snapshotGasCost_1.default)(liquidityFromAmounts.getGasCostOfGetAmount1ForLiquidity(sqrtPriceAX96, sqrtPriceBX96, 100))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('#getAmountsForLiquidity', function () {
            it('amounts for price inside', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, _a, amount0, amount1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            sqrtPriceX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1);
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            return [4 /*yield*/, liquidityFromAmounts.getAmountsForLiquidity(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, 2148)];
                        case 1:
                            _a = _b.sent(), amount0 = _a.amount0, amount1 = _a.amount1;
                            (0, expect_1.expect)(amount0).to.eq(99);
                            (0, expect_1.expect)(amount1).to.eq(99);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('amounts for price below', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, _a, amount0, amount1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            sqrtPriceX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(99, 110);
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            return [4 /*yield*/, liquidityFromAmounts.getAmountsForLiquidity(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, 1048)];
                        case 1:
                            _a = _b.sent(), amount0 = _a.amount0, amount1 = _a.amount1;
                            (0, expect_1.expect)(amount0).to.eq(99);
                            (0, expect_1.expect)(amount1).to.eq(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('amounts for price above', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, _a, amount0, amount1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            sqrtPriceX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(111, 100);
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            return [4 /*yield*/, liquidityFromAmounts.getAmountsForLiquidity(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, 2097)];
                        case 1:
                            _a = _b.sent(), amount0 = _a.amount0, amount1 = _a.amount1;
                            (0, expect_1.expect)(amount0).to.eq(0);
                            (0, expect_1.expect)(amount1).to.eq(199);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('amounts for price on lower boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceAX96, sqrtPriceX96, sqrtPriceBX96, _a, amount0, amount1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceX96 = sqrtPriceAX96;
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            return [4 /*yield*/, liquidityFromAmounts.getAmountsForLiquidity(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, 1048)];
                        case 1:
                            _a = _b.sent(), amount0 = _a.amount0, amount1 = _a.amount1;
                            (0, expect_1.expect)(amount0).to.eq(99);
                            (0, expect_1.expect)(amount1).to.eq(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('amounts for price on upper boundary', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceAX96, sqrtPriceBX96, sqrtPriceX96, _a, amount0, amount1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            sqrtPriceX96 = sqrtPriceBX96;
                            return [4 /*yield*/, liquidityFromAmounts.getAmountsForLiquidity(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, 2097)];
                        case 1:
                            _a = _b.sent(), amount0 = _a.amount0, amount1 = _a.amount1;
                            (0, expect_1.expect)(amount0).to.eq(0);
                            (0, expect_1.expect)(amount1).to.eq(199);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas for price below', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sqrtPriceX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(99, 110);
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            return [4 /*yield*/, (0, snapshotGasCost_1.default)(liquidityFromAmounts.getGasCostOfGetAmountsForLiquidity(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, 2148))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas for price above', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sqrtPriceX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(111, 100);
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            return [4 /*yield*/, (0, snapshotGasCost_1.default)(liquidityFromAmounts.getGasCostOfGetAmountsForLiquidity(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, 1048))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas for price inside', function () { return __awaiter(void 0, void 0, void 0, function () {
                var sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sqrtPriceX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(1, 1);
                            sqrtPriceAX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(100, 110);
                            sqrtPriceBX96 = (0, encodePriceSqrt_1.encodePriceSqrt)(110, 100);
                            return [4 /*yield*/, (0, snapshotGasCost_1.default)(liquidityFromAmounts.getGasCostOfGetAmountsForLiquidity(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, 2097))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        return [2 /*return*/];
    });
}); });
