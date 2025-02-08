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
describe('SwapMath', function () {
    var swapMath;
    var sqrtPriceMath;
    before(function () { return __awaiter(void 0, void 0, void 0, function () {
        var swapMathTestFactory, sqrtPriceMathTestFactory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('SwapMathTest')];
                case 1:
                    swapMathTestFactory = _a.sent();
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('SqrtPriceMathTest')];
                case 2:
                    sqrtPriceMathTestFactory = _a.sent();
                    return [4 /*yield*/, swapMathTestFactory.deploy()];
                case 3:
                    swapMath = (_a.sent());
                    return [4 /*yield*/, sqrtPriceMathTestFactory.deploy()];
                case 4:
                    sqrtPriceMath = (_a.sent());
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#computeSwapStep', function () {
        it('exact amount in that gets capped at price target in one for zero', function () { return __awaiter(void 0, void 0, void 0, function () {
            var price, priceTarget, liquidity, amount, fee, zeroForOne, _a, amountIn, amountOut, sqrtQ, feeAmount, priceAfterWholeInputAmount;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        price = (0, utilities_1.encodePriceSqrt)(1, 1);
                        priceTarget = (0, utilities_1.encodePriceSqrt)(101, 100);
                        liquidity = (0, utilities_1.expandTo18Decimals)(2);
                        amount = (0, utilities_1.expandTo18Decimals)(1);
                        fee = 600;
                        zeroForOne = false;
                        return [4 /*yield*/, swapMath.computeSwapStep(price, priceTarget, liquidity, amount, fee)];
                    case 1:
                        _a = _b.sent(), amountIn = _a.amountIn, amountOut = _a.amountOut, sqrtQ = _a.sqrtQ, feeAmount = _a.feeAmount;
                        (0, expect_1.expect)(amountIn).to.eq('9975124224178055');
                        (0, expect_1.expect)(feeAmount).to.eq('5988667735148');
                        (0, expect_1.expect)(amountOut).to.eq('9925619580021728');
                        (0, expect_1.expect)(amountIn.add(feeAmount), 'entire amount is not used').to.lt(amount);
                        return [4 /*yield*/, sqrtPriceMath.getNextSqrtPriceFromInput(price, liquidity, amount, zeroForOne)];
                    case 2:
                        priceAfterWholeInputAmount = _b.sent();
                        (0, expect_1.expect)(sqrtQ, 'price is capped at price target').to.eq(priceTarget);
                        (0, expect_1.expect)(sqrtQ, 'price is less than price after whole input amount').to.lt(priceAfterWholeInputAmount);
                        return [2 /*return*/];
                }
            });
        }); });
        it('exact amount out that gets capped at price target in one for zero', function () { return __awaiter(void 0, void 0, void 0, function () {
            var price, priceTarget, liquidity, amount, fee, zeroForOne, _a, amountIn, amountOut, sqrtQ, feeAmount, priceAfterWholeOutputAmount;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        price = (0, utilities_1.encodePriceSqrt)(1, 1);
                        priceTarget = (0, utilities_1.encodePriceSqrt)(101, 100);
                        liquidity = (0, utilities_1.expandTo18Decimals)(2);
                        amount = (0, utilities_1.expandTo18Decimals)(1).mul(-1);
                        fee = 600;
                        zeroForOne = false;
                        return [4 /*yield*/, swapMath.computeSwapStep(price, priceTarget, liquidity, amount, fee)];
                    case 1:
                        _a = _b.sent(), amountIn = _a.amountIn, amountOut = _a.amountOut, sqrtQ = _a.sqrtQ, feeAmount = _a.feeAmount;
                        (0, expect_1.expect)(amountIn).to.eq('9975124224178055');
                        (0, expect_1.expect)(feeAmount).to.eq('5988667735148');
                        (0, expect_1.expect)(amountOut).to.eq('9925619580021728');
                        (0, expect_1.expect)(amountOut, 'entire amount out is not returned').to.lt(amount.mul(-1));
                        return [4 /*yield*/, sqrtPriceMath.getNextSqrtPriceFromOutput(price, liquidity, amount.mul(-1), zeroForOne)];
                    case 2:
                        priceAfterWholeOutputAmount = _b.sent();
                        (0, expect_1.expect)(sqrtQ, 'price is capped at price target').to.eq(priceTarget);
                        (0, expect_1.expect)(sqrtQ, 'price is less than price after whole output amount').to.lt(priceAfterWholeOutputAmount);
                        return [2 /*return*/];
                }
            });
        }); });
        it('exact amount in that is fully spent in one for zero', function () { return __awaiter(void 0, void 0, void 0, function () {
            var price, priceTarget, liquidity, amount, fee, zeroForOne, _a, amountIn, amountOut, sqrtQ, feeAmount, priceAfterWholeInputAmountLessFee;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        price = (0, utilities_1.encodePriceSqrt)(1, 1);
                        priceTarget = (0, utilities_1.encodePriceSqrt)(1000, 100);
                        liquidity = (0, utilities_1.expandTo18Decimals)(2);
                        amount = (0, utilities_1.expandTo18Decimals)(1);
                        fee = 600;
                        zeroForOne = false;
                        return [4 /*yield*/, swapMath.computeSwapStep(price, priceTarget, liquidity, amount, fee)];
                    case 1:
                        _a = _b.sent(), amountIn = _a.amountIn, amountOut = _a.amountOut, sqrtQ = _a.sqrtQ, feeAmount = _a.feeAmount;
                        (0, expect_1.expect)(amountIn).to.eq('999400000000000000');
                        (0, expect_1.expect)(feeAmount).to.eq('600000000000000');
                        (0, expect_1.expect)(amountOut).to.eq('666399946655997866');
                        (0, expect_1.expect)(amountIn.add(feeAmount), 'entire amount is used').to.eq(amount);
                        return [4 /*yield*/, sqrtPriceMath.getNextSqrtPriceFromInput(price, liquidity, amount.sub(feeAmount), zeroForOne)];
                    case 2:
                        priceAfterWholeInputAmountLessFee = _b.sent();
                        (0, expect_1.expect)(sqrtQ, 'price does not reach price target').to.be.lt(priceTarget);
                        (0, expect_1.expect)(sqrtQ, 'price is equal to price after whole input amount').to.eq(priceAfterWholeInputAmountLessFee);
                        return [2 /*return*/];
                }
            });
        }); });
        it('exact amount out that is fully received in one for zero', function () { return __awaiter(void 0, void 0, void 0, function () {
            var price, priceTarget, liquidity, amount, fee, zeroForOne, _a, amountIn, amountOut, sqrtQ, feeAmount, priceAfterWholeOutputAmount;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        price = (0, utilities_1.encodePriceSqrt)(1, 1);
                        priceTarget = (0, utilities_1.encodePriceSqrt)(10000, 100);
                        liquidity = (0, utilities_1.expandTo18Decimals)(2);
                        amount = (0, utilities_1.expandTo18Decimals)(1).mul(-1);
                        fee = 600;
                        zeroForOne = false;
                        return [4 /*yield*/, swapMath.computeSwapStep(price, priceTarget, liquidity, amount, fee)];
                    case 1:
                        _a = _b.sent(), amountIn = _a.amountIn, amountOut = _a.amountOut, sqrtQ = _a.sqrtQ, feeAmount = _a.feeAmount;
                        (0, expect_1.expect)(amountIn).to.eq('2000000000000000000');
                        (0, expect_1.expect)(feeAmount).to.eq('1200720432259356');
                        (0, expect_1.expect)(amountOut).to.eq(amount.mul(-1));
                        return [4 /*yield*/, sqrtPriceMath.getNextSqrtPriceFromOutput(price, liquidity, amount.mul(-1), zeroForOne)];
                    case 2:
                        priceAfterWholeOutputAmount = _b.sent();
                        (0, expect_1.expect)(sqrtQ, 'price does not reach price target').to.be.lt(priceTarget);
                        (0, expect_1.expect)(sqrtQ, 'price is less than price after whole output amount').to.eq(priceAfterWholeOutputAmount);
                        return [2 /*return*/];
                }
            });
        }); });
        it('amount out is capped at the desired amount out', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, amountIn, amountOut, sqrtQ, feeAmount;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, swapMath.computeSwapStep(ethers_1.BigNumber.from('417332158212080721273783715441582'), ethers_1.BigNumber.from('1452870262520218020823638996'), '159344665391607089467575320103', '-1', 1)];
                    case 1:
                        _a = _b.sent(), amountIn = _a.amountIn, amountOut = _a.amountOut, sqrtQ = _a.sqrtQ, feeAmount = _a.feeAmount;
                        (0, expect_1.expect)(amountIn).to.eq('1');
                        (0, expect_1.expect)(feeAmount).to.eq('1');
                        (0, expect_1.expect)(amountOut).to.eq('1'); // would be 2 if not capped
                        (0, expect_1.expect)(sqrtQ).to.eq('417332158212080721273783715441581');
                        return [2 /*return*/];
                }
            });
        }); });
        it('target price of 1 uses partial input amount', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, amountIn, amountOut, sqrtQ, feeAmount;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, swapMath.computeSwapStep(ethers_1.BigNumber.from('2'), ethers_1.BigNumber.from('1'), '1', '3915081100057732413702495386755767', 1)];
                    case 1:
                        _a = _b.sent(), amountIn = _a.amountIn, amountOut = _a.amountOut, sqrtQ = _a.sqrtQ, feeAmount = _a.feeAmount;
                        (0, expect_1.expect)(amountIn).to.eq('39614081257132168796771975168');
                        (0, expect_1.expect)(feeAmount).to.eq('39614120871253040049813');
                        (0, expect_1.expect)(amountIn.add(feeAmount)).to.be.lte('3915081100057732413702495386755767');
                        (0, expect_1.expect)(amountOut).to.eq('0');
                        (0, expect_1.expect)(sqrtQ).to.eq('1');
                        return [2 /*return*/];
                }
            });
        }); });
        it('entire input amount taken as fee', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, amountIn, amountOut, sqrtQ, feeAmount;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, swapMath.computeSwapStep('2413', '79887613182836312', '1985041575832132834610021537970', '10', 1872)];
                    case 1:
                        _a = _b.sent(), amountIn = _a.amountIn, amountOut = _a.amountOut, sqrtQ = _a.sqrtQ, feeAmount = _a.feeAmount;
                        (0, expect_1.expect)(amountIn).to.eq('0');
                        (0, expect_1.expect)(feeAmount).to.eq('10');
                        (0, expect_1.expect)(amountOut).to.eq('0');
                        (0, expect_1.expect)(sqrtQ).to.eq('2413');
                        return [2 /*return*/];
                }
            });
        }); });
        it('handles intermediate insufficient liquidity in zero for one exact output case', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sqrtP, sqrtPTarget, liquidity, amountRemaining, feePips, _a, amountIn, amountOut, sqrtQ, feeAmount;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sqrtP = ethers_1.BigNumber.from('20282409603651670423947251286016');
                        sqrtPTarget = sqrtP.mul(11).div(10);
                        liquidity = 1024;
                        amountRemaining = -4;
                        feePips = 3000;
                        return [4 /*yield*/, swapMath.computeSwapStep(sqrtP, sqrtPTarget, liquidity, amountRemaining, feePips)];
                    case 1:
                        _a = _b.sent(), amountIn = _a.amountIn, amountOut = _a.amountOut, sqrtQ = _a.sqrtQ, feeAmount = _a.feeAmount;
                        (0, expect_1.expect)(amountOut).to.eq(0);
                        (0, expect_1.expect)(sqrtQ).to.eq(sqrtPTarget);
                        (0, expect_1.expect)(amountIn).to.eq(26215);
                        (0, expect_1.expect)(feeAmount).to.eq(79);
                        return [2 /*return*/];
                }
            });
        }); });
        it('handles intermediate insufficient liquidity in one for zero exact output case', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sqrtP, sqrtPTarget, liquidity, amountRemaining, feePips, _a, amountIn, amountOut, sqrtQ, feeAmount;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sqrtP = ethers_1.BigNumber.from('20282409603651670423947251286016');
                        sqrtPTarget = sqrtP.mul(9).div(10);
                        liquidity = 1024;
                        amountRemaining = -263000;
                        feePips = 3000;
                        return [4 /*yield*/, swapMath.computeSwapStep(sqrtP, sqrtPTarget, liquidity, amountRemaining, feePips)];
                    case 1:
                        _a = _b.sent(), amountIn = _a.amountIn, amountOut = _a.amountOut, sqrtQ = _a.sqrtQ, feeAmount = _a.feeAmount;
                        (0, expect_1.expect)(amountOut).to.eq(26214);
                        (0, expect_1.expect)(sqrtQ).to.eq(sqrtPTarget);
                        (0, expect_1.expect)(amountIn).to.eq(1);
                        (0, expect_1.expect)(feeAmount).to.eq(1);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('gas', function () {
            it('swap one for zero exact in capped', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapMath.getGasCostOfComputeSwapStep((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.encodePriceSqrt)(101, 100), (0, utilities_1.expandTo18Decimals)(2), (0, utilities_1.expandTo18Decimals)(1), 600))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('swap zero for one exact in capped', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapMath.getGasCostOfComputeSwapStep((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.encodePriceSqrt)(99, 100), (0, utilities_1.expandTo18Decimals)(2), (0, utilities_1.expandTo18Decimals)(1), 600))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('swap one for zero exact out capped', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapMath.getGasCostOfComputeSwapStep((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.encodePriceSqrt)(101, 100), (0, utilities_1.expandTo18Decimals)(2), (0, utilities_1.expandTo18Decimals)(1).mul(-1), 600))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('swap zero for one exact out capped', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapMath.getGasCostOfComputeSwapStep((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.encodePriceSqrt)(99, 100), (0, utilities_1.expandTo18Decimals)(2), (0, utilities_1.expandTo18Decimals)(1).mul(-1), 600))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('swap one for zero exact in partial', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapMath.getGasCostOfComputeSwapStep((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.encodePriceSqrt)(1010, 100), (0, utilities_1.expandTo18Decimals)(2), 1000, 600))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('swap zero for one exact in partial', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapMath.getGasCostOfComputeSwapStep((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.encodePriceSqrt)(99, 1000), (0, utilities_1.expandTo18Decimals)(2), 1000, 600))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('swap one for zero exact out partial', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapMath.getGasCostOfComputeSwapStep((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.encodePriceSqrt)(1010, 100), (0, utilities_1.expandTo18Decimals)(2), 1000, 600))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('swap zero for one exact out partial', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(swapMath.getGasCostOfComputeSwapStep((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.encodePriceSqrt)(99, 1000), (0, utilities_1.expandTo18Decimals)(2), 1000, 600))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
