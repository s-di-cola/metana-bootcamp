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
var MaxUint256 = hardhat_1.ethers.constants.MaxUint256;
describe('SqrtPriceMath', function () {
    var sqrtPriceMath;
    before(function () { return __awaiter(void 0, void 0, void 0, function () {
        var sqrtPriceMathTestFactory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('SqrtPriceMathTest')];
                case 1:
                    sqrtPriceMathTestFactory = _a.sent();
                    return [4 /*yield*/, sqrtPriceMathTestFactory.deploy()];
                case 2:
                    sqrtPriceMath = (_a.sent());
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#getNextSqrtPriceFromInput', function () {
        it('fails if price is zero', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(sqrtPriceMath.getNextSqrtPriceFromInput(0, 0, (0, utilities_1.expandTo18Decimals)(1).div(10), false)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if liquidity is zero', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(sqrtPriceMath.getNextSqrtPriceFromInput(1, 0, (0, utilities_1.expandTo18Decimals)(1).div(10), true)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if input amount overflows the price', function () { return __awaiter(void 0, void 0, void 0, function () {
            var price, liquidity, amountIn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        price = ethers_1.BigNumber.from(2).pow(160).sub(1);
                        liquidity = 1024;
                        amountIn = 1024;
                        return [4 /*yield*/, (0, expect_1.expect)(sqrtPriceMath.getNextSqrtPriceFromInput(price, liquidity, amountIn, false)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('any input amount cannot underflow the price', function () { return __awaiter(void 0, void 0, void 0, function () {
            var price, liquidity, amountIn, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        price = 1;
                        liquidity = 1;
                        amountIn = ethers_1.BigNumber.from(2).pow(255);
                        _a = expect_1.expect;
                        return [4 /*yield*/, sqrtPriceMath.getNextSqrtPriceFromInput(price, liquidity, amountIn, true)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns input price if amount in is zero and zeroForOne = true', function () { return __awaiter(void 0, void 0, void 0, function () {
            var price, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        price = (0, utilities_1.encodePriceSqrt)(1, 1);
                        _a = expect_1.expect;
                        return [4 /*yield*/, sqrtPriceMath.getNextSqrtPriceFromInput(price, (0, utilities_1.expandTo18Decimals)(1).div(10), 0, true)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(price);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns input price if amount in is zero and zeroForOne = false', function () { return __awaiter(void 0, void 0, void 0, function () {
            var price, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        price = (0, utilities_1.encodePriceSqrt)(1, 1);
                        _a = expect_1.expect;
                        return [4 /*yield*/, sqrtPriceMath.getNextSqrtPriceFromInput(price, (0, utilities_1.expandTo18Decimals)(1).div(10), 0, false)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(price);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns the minimum price for max inputs', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sqrtP, liquidity, maxAmountNoOverflow, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sqrtP = ethers_1.BigNumber.from(2).pow(160).sub(1);
                        liquidity = utilities_1.MaxUint128;
                        maxAmountNoOverflow = MaxUint256.sub(liquidity.shl(96).div(sqrtP));
                        _a = expect_1.expect;
                        return [4 /*yield*/, sqrtPriceMath.getNextSqrtPriceFromInput(sqrtP, liquidity, maxAmountNoOverflow, true)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('1');
                        return [2 /*return*/];
                }
            });
        }); });
        it('input amount of 0.1 token1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sqrtQ;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sqrtPriceMath.getNextSqrtPriceFromInput((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.expandTo18Decimals)(1), (0, utilities_1.expandTo18Decimals)(1).div(10), false)];
                    case 1:
                        sqrtQ = _a.sent();
                        (0, expect_1.expect)(sqrtQ).to.eq('87150978765690771352898345369');
                        return [2 /*return*/];
                }
            });
        }); });
        it('input amount of 0.1 token0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sqrtQ;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sqrtPriceMath.getNextSqrtPriceFromInput((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.expandTo18Decimals)(1), (0, utilities_1.expandTo18Decimals)(1).div(10), true)];
                    case 1:
                        sqrtQ = _a.sent();
                        (0, expect_1.expect)(sqrtQ).to.eq('72025602285694852357767227579');
                        return [2 /*return*/];
                }
            });
        }); });
        it('amountIn > type(uint96).max and zeroForOne = true', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, sqrtPriceMath.getNextSqrtPriceFromInput((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.expandTo18Decimals)(10), ethers_1.BigNumber.from(2).pow(100), true)
                            // perfect answer:
                            // https://www.wolframalpha.com/input/?i=624999999995069620+-+%28%281e19+*+1+%2F+%281e19+%2B+2%5E100+*+1%29%29+*+2%5E96%29
                        ];
                    case 1:
                        _a.apply(void 0, [_b.sent()
                            // perfect answer:
                            // https://www.wolframalpha.com/input/?i=624999999995069620+-+%28%281e19+*+1+%2F+%281e19+%2B+2%5E100+*+1%29%29+*+2%5E96%29
                        ]).to.eq('624999999995069620');
                        return [2 /*return*/];
                }
            });
        }); });
        it('can return 1 with enough amountIn and zeroForOne = true', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, sqrtPriceMath.getNextSqrtPriceFromInput((0, utilities_1.encodePriceSqrt)(1, 1), 1, ethers_1.constants.MaxUint256.div(2), true)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('zeroForOne = true gas', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(sqrtPriceMath.getGasCostOfGetNextSqrtPriceFromInput((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.expandTo18Decimals)(1), (0, utilities_1.expandTo18Decimals)(1).div(10), true))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('zeroForOne = false gas', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(sqrtPriceMath.getGasCostOfGetNextSqrtPriceFromInput((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.expandTo18Decimals)(1), (0, utilities_1.expandTo18Decimals)(1).div(10), false))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#getNextSqrtPriceFromOutput', function () {
        it('fails if price is zero', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(sqrtPriceMath.getNextSqrtPriceFromOutput(0, 0, (0, utilities_1.expandTo18Decimals)(1).div(10), false)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if liquidity is zero', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(sqrtPriceMath.getNextSqrtPriceFromOutput(1, 0, (0, utilities_1.expandTo18Decimals)(1).div(10), true)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if output amount is exactly the virtual reserves of token0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var price, liquidity, amountOut;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        price = '20282409603651670423947251286016';
                        liquidity = 1024;
                        amountOut = 4;
                        return [4 /*yield*/, (0, expect_1.expect)(sqrtPriceMath.getNextSqrtPriceFromOutput(price, liquidity, amountOut, false)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if output amount is greater than virtual reserves of token0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var price, liquidity, amountOut;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        price = '20282409603651670423947251286016';
                        liquidity = 1024;
                        amountOut = 5;
                        return [4 /*yield*/, (0, expect_1.expect)(sqrtPriceMath.getNextSqrtPriceFromOutput(price, liquidity, amountOut, false)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if output amount is greater than virtual reserves of token1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var price, liquidity, amountOut;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        price = '20282409603651670423947251286016';
                        liquidity = 1024;
                        amountOut = 262145;
                        return [4 /*yield*/, (0, expect_1.expect)(sqrtPriceMath.getNextSqrtPriceFromOutput(price, liquidity, amountOut, true)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if output amount is exactly the virtual reserves of token1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var price, liquidity, amountOut;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        price = '20282409603651670423947251286016';
                        liquidity = 1024;
                        amountOut = 262144;
                        return [4 /*yield*/, (0, expect_1.expect)(sqrtPriceMath.getNextSqrtPriceFromOutput(price, liquidity, amountOut, true)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('succeeds if output amount is just less than the virtual reserves of token1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var price, liquidity, amountOut, sqrtQ;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        price = '20282409603651670423947251286016';
                        liquidity = 1024;
                        amountOut = 262143;
                        return [4 /*yield*/, sqrtPriceMath.getNextSqrtPriceFromOutput(price, liquidity, amountOut, true)];
                    case 1:
                        sqrtQ = _a.sent();
                        (0, expect_1.expect)(sqrtQ).to.eq('77371252455336267181195264');
                        return [2 /*return*/];
                }
            });
        }); });
        it('puzzling echidna test', function () { return __awaiter(void 0, void 0, void 0, function () {
            var price, liquidity, amountOut;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        price = '20282409603651670423947251286016';
                        liquidity = 1024;
                        amountOut = 4;
                        return [4 /*yield*/, (0, expect_1.expect)(sqrtPriceMath.getNextSqrtPriceFromOutput(price, liquidity, amountOut, false)).to.be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns input price if amount in is zero and zeroForOne = true', function () { return __awaiter(void 0, void 0, void 0, function () {
            var price, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        price = (0, utilities_1.encodePriceSqrt)(1, 1);
                        _a = expect_1.expect;
                        return [4 /*yield*/, sqrtPriceMath.getNextSqrtPriceFromOutput(price, (0, utilities_1.expandTo18Decimals)(1).div(10), 0, true)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(price);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns input price if amount in is zero and zeroForOne = false', function () { return __awaiter(void 0, void 0, void 0, function () {
            var price, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        price = (0, utilities_1.encodePriceSqrt)(1, 1);
                        _a = expect_1.expect;
                        return [4 /*yield*/, sqrtPriceMath.getNextSqrtPriceFromOutput(price, (0, utilities_1.expandTo18Decimals)(1).div(10), 0, false)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(price);
                        return [2 /*return*/];
                }
            });
        }); });
        it('output amount of 0.1 token1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sqrtQ;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sqrtPriceMath.getNextSqrtPriceFromOutput((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.expandTo18Decimals)(1), (0, utilities_1.expandTo18Decimals)(1).div(10), false)];
                    case 1:
                        sqrtQ = _a.sent();
                        (0, expect_1.expect)(sqrtQ).to.eq('88031291682515930659493278152');
                        return [2 /*return*/];
                }
            });
        }); });
        it('output amount of 0.1 token1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sqrtQ;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sqrtPriceMath.getNextSqrtPriceFromOutput((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.expandTo18Decimals)(1), (0, utilities_1.expandTo18Decimals)(1).div(10), true)];
                    case 1:
                        sqrtQ = _a.sent();
                        (0, expect_1.expect)(sqrtQ).to.eq('71305346262837903834189555302');
                        return [2 /*return*/];
                }
            });
        }); });
        it('reverts if amountOut is impossible in zero for one direction', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(sqrtPriceMath.getNextSqrtPriceFromOutput((0, utilities_1.encodePriceSqrt)(1, 1), 1, ethers_1.constants.MaxUint256, true)).to.be
                            .reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('reverts if amountOut is impossible in one for zero direction', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, expect_1.expect)(sqrtPriceMath.getNextSqrtPriceFromOutput((0, utilities_1.encodePriceSqrt)(1, 1), 1, ethers_1.constants.MaxUint256, false)).to
                            .be.reverted];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('zeroForOne = true gas', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(sqrtPriceMath.getGasCostOfGetNextSqrtPriceFromOutput((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.expandTo18Decimals)(1), (0, utilities_1.expandTo18Decimals)(1).div(10), true))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('zeroForOne = false gas', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(sqrtPriceMath.getGasCostOfGetNextSqrtPriceFromOutput((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.expandTo18Decimals)(1), (0, utilities_1.expandTo18Decimals)(1).div(10), false))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#getAmount0Delta', function () {
        it('returns 0 if liquidity is 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var amount0;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sqrtPriceMath.getAmount0Delta((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.encodePriceSqrt)(2, 1), 0, true)];
                    case 1:
                        amount0 = _a.sent();
                        (0, expect_1.expect)(amount0).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns 0 if prices are equal', function () { return __awaiter(void 0, void 0, void 0, function () {
            var amount0;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sqrtPriceMath.getAmount0Delta((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.encodePriceSqrt)(1, 1), 0, true)];
                    case 1:
                        amount0 = _a.sent();
                        (0, expect_1.expect)(amount0).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns 0.1 amount1 for price of 1 to 1.21', function () { return __awaiter(void 0, void 0, void 0, function () {
            var amount0, amount0RoundedDown;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sqrtPriceMath.getAmount0Delta((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.encodePriceSqrt)(121, 100), (0, utilities_1.expandTo18Decimals)(1), true)];
                    case 1:
                        amount0 = _a.sent();
                        (0, expect_1.expect)(amount0).to.eq('90909090909090910');
                        return [4 /*yield*/, sqrtPriceMath.getAmount0Delta((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.encodePriceSqrt)(121, 100), (0, utilities_1.expandTo18Decimals)(1), false)];
                    case 2:
                        amount0RoundedDown = _a.sent();
                        (0, expect_1.expect)(amount0RoundedDown).to.eq(amount0.sub(1));
                        return [2 /*return*/];
                }
            });
        }); });
        it('works for prices that overflow', function () { return __awaiter(void 0, void 0, void 0, function () {
            var amount0Up, amount0Down;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sqrtPriceMath.getAmount0Delta((0, utilities_1.encodePriceSqrt)(ethers_1.BigNumber.from(2).pow(90), 1), (0, utilities_1.encodePriceSqrt)(ethers_1.BigNumber.from(2).pow(96), 1), (0, utilities_1.expandTo18Decimals)(1), true)];
                    case 1:
                        amount0Up = _a.sent();
                        return [4 /*yield*/, sqrtPriceMath.getAmount0Delta((0, utilities_1.encodePriceSqrt)(ethers_1.BigNumber.from(2).pow(90), 1), (0, utilities_1.encodePriceSqrt)(ethers_1.BigNumber.from(2).pow(96), 1), (0, utilities_1.expandTo18Decimals)(1), false)];
                    case 2:
                        amount0Down = _a.sent();
                        (0, expect_1.expect)(amount0Up).to.eq(amount0Down.add(1));
                        return [2 /*return*/];
                }
            });
        }); });
        it("gas cost for amount0 where roundUp = true", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(sqrtPriceMath.getGasCostOfGetAmount0Delta((0, utilities_1.encodePriceSqrt)(100, 121), (0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.expandTo18Decimals)(1), true))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("gas cost for amount0 where roundUp = true", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(sqrtPriceMath.getGasCostOfGetAmount0Delta((0, utilities_1.encodePriceSqrt)(100, 121), (0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.expandTo18Decimals)(1), false))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#getAmount1Delta', function () {
        it('returns 0 if liquidity is 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var amount1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sqrtPriceMath.getAmount1Delta((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.encodePriceSqrt)(2, 1), 0, true)];
                    case 1:
                        amount1 = _a.sent();
                        (0, expect_1.expect)(amount1).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns 0 if prices are equal', function () { return __awaiter(void 0, void 0, void 0, function () {
            var amount1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sqrtPriceMath.getAmount0Delta((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.encodePriceSqrt)(1, 1), 0, true)];
                    case 1:
                        amount1 = _a.sent();
                        (0, expect_1.expect)(amount1).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns 0.1 amount1 for price of 1 to 1.21', function () { return __awaiter(void 0, void 0, void 0, function () {
            var amount1, amount1RoundedDown;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sqrtPriceMath.getAmount1Delta((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.encodePriceSqrt)(121, 100), (0, utilities_1.expandTo18Decimals)(1), true)];
                    case 1:
                        amount1 = _a.sent();
                        (0, expect_1.expect)(amount1).to.eq('100000000000000000');
                        return [4 /*yield*/, sqrtPriceMath.getAmount1Delta((0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.encodePriceSqrt)(121, 100), (0, utilities_1.expandTo18Decimals)(1), false)];
                    case 2:
                        amount1RoundedDown = _a.sent();
                        (0, expect_1.expect)(amount1RoundedDown).to.eq(amount1.sub(1));
                        return [2 /*return*/];
                }
            });
        }); });
        it("gas cost for amount0 where roundUp = true", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(sqrtPriceMath.getGasCostOfGetAmount0Delta((0, utilities_1.encodePriceSqrt)(100, 121), (0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.expandTo18Decimals)(1), true))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("gas cost for amount0 where roundUp = false", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(sqrtPriceMath.getGasCostOfGetAmount0Delta((0, utilities_1.encodePriceSqrt)(100, 121), (0, utilities_1.encodePriceSqrt)(1, 1), (0, utilities_1.expandTo18Decimals)(1), false))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('swap computation', function () {
        it('sqrtP * sqrtQ overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            var sqrtP, liquidity, zeroForOne, amountIn, sqrtQ, amount0Delta;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sqrtP = '1025574284609383690408304870162715216695788925244';
                        liquidity = '50015962439936049619261659728067971248';
                        zeroForOne = true;
                        amountIn = '406';
                        return [4 /*yield*/, sqrtPriceMath.getNextSqrtPriceFromInput(sqrtP, liquidity, amountIn, zeroForOne)];
                    case 1:
                        sqrtQ = _a.sent();
                        (0, expect_1.expect)(sqrtQ).to.eq('1025574284609383582644711336373707553698163132913');
                        return [4 /*yield*/, sqrtPriceMath.getAmount0Delta(sqrtQ, sqrtP, liquidity, true)];
                    case 2:
                        amount0Delta = _a.sent();
                        (0, expect_1.expect)(amount0Delta).to.eq('406');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
