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
var utilities_1 = require("./shared/utilities");
var feeAmount = utilities_1.FeeAmount.MEDIUM;
var tickSpacing = utilities_1.TICK_SPACINGS[feeAmount];
var createFixtureLoader = hardhat_1.waffle.createFixtureLoader;
describe('UniswapV3Pool', function () {
    var wallet, other;
    var token0;
    var token1;
    var token2;
    var factory;
    var pool0;
    var pool1;
    var pool0Functions;
    var pool1Functions;
    var minTick;
    var maxTick;
    var swapTargetCallee;
    var swapTargetRouter;
    var loadFixture;
    var createPool;
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
    beforeEach('deploy first fixture', function () { return __awaiter(void 0, void 0, void 0, function () {
        var createPoolWrapped;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    ;
                    return [4 /*yield*/, loadFixture(fixtures_1.poolFixture)];
                case 1:
                    (_a = _d.sent(), token0 = _a.token0, token1 = _a.token1, token2 = _a.token2, factory = _a.factory, createPool = _a.createPool, swapTargetCallee = _a.swapTargetCallee, swapTargetRouter = _a.swapTargetRouter);
                    createPoolWrapped = function (amount, spacing, firstToken, secondToken) { return __awaiter(void 0, void 0, void 0, function () {
                        var pool, poolFunctions;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, createPool(amount, spacing, firstToken, secondToken)];
                                case 1:
                                    pool = _a.sent();
                                    poolFunctions = (0, utilities_1.createPoolFunctions)({
                                        swapTarget: swapTargetCallee,
                                        token0: firstToken,
                                        token1: secondToken,
                                        pool: pool,
                                    });
                                    minTick = (0, utilities_1.getMinTick)(spacing);
                                    maxTick = (0, utilities_1.getMaxTick)(spacing);
                                    return [2 /*return*/, [pool, poolFunctions]];
                            }
                        });
                    }); };
                    return [4 /*yield*/, createPoolWrapped(feeAmount, tickSpacing, token0, token1)];
                case 2:
                    _b = _d.sent(), pool0 = _b[0], pool0Functions = _b[1];
                    return [4 /*yield*/, createPoolWrapped(feeAmount, tickSpacing, token1, token2)];
                case 3:
                    _c = _d.sent(), pool1 = _c[0], pool1Functions = _c[1];
                    return [2 /*return*/];
            }
        });
    }); });
    it('constructor initializes immutables', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _a = expect_1.expect;
                    return [4 /*yield*/, pool0.factory()];
                case 1:
                    _a.apply(void 0, [_g.sent()]).to.eq(factory.address);
                    _b = expect_1.expect;
                    return [4 /*yield*/, pool0.token0()];
                case 2:
                    _b.apply(void 0, [_g.sent()]).to.eq(token0.address);
                    _c = expect_1.expect;
                    return [4 /*yield*/, pool0.token1()];
                case 3:
                    _c.apply(void 0, [_g.sent()]).to.eq(token1.address);
                    _d = expect_1.expect;
                    return [4 /*yield*/, pool1.factory()];
                case 4:
                    _d.apply(void 0, [_g.sent()]).to.eq(factory.address);
                    _e = expect_1.expect;
                    return [4 /*yield*/, pool1.token0()];
                case 5:
                    _e.apply(void 0, [_g.sent()]).to.eq(token1.address);
                    _f = expect_1.expect;
                    return [4 /*yield*/, pool1.token1()];
                case 6:
                    _f.apply(void 0, [_g.sent()]).to.eq(token2.address);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('multi-swaps', function () {
        var inputToken;
        var outputToken;
        beforeEach('initialize both pools', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputToken = token0;
                        outputToken = token2;
                        return [4 /*yield*/, pool0.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, pool1.initialize((0, utilities_1.encodePriceSqrt)(1, 1))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, pool0Functions.mint(wallet.address, minTick, maxTick, (0, utilities_1.expandTo18Decimals)(1))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, pool1Functions.mint(wallet.address, minTick, maxTick, (0, utilities_1.expandTo18Decimals)(1))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('multi-swap', function () { return __awaiter(void 0, void 0, void 0, function () {
            var token0OfPoolOutput, ForExact0, _a, swapForExact0Multi, swapForExact1Multi, method;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pool1.token0()];
                    case 1:
                        token0OfPoolOutput = _b.sent();
                        ForExact0 = outputToken.address === token0OfPoolOutput;
                        _a = (0, utilities_1.createMultiPoolFunctions)({
                            inputToken: token0,
                            swapTarget: swapTargetRouter,
                            poolInput: pool0,
                            poolOutput: pool1,
                        }), swapForExact0Multi = _a.swapForExact0Multi, swapForExact1Multi = _a.swapForExact1Multi;
                        method = ForExact0 ? swapForExact0Multi : swapForExact1Multi;
                        return [4 /*yield*/, (0, expect_1.expect)(method(100, wallet.address))
                                .to.emit(outputToken, 'Transfer')
                                .withArgs(pool1.address, wallet.address, 100)
                                .to.emit(token1, 'Transfer')
                                .withArgs(pool0.address, pool1.address, 102)
                                .to.emit(inputToken, 'Transfer')
                                .withArgs(wallet.address, pool0.address, 104)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
