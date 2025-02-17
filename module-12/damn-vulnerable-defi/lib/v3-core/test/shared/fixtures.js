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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolFixture = exports.TEST_POOL_START_TIME = void 0;
var ethers_1 = require("ethers");
var hardhat_1 = require("hardhat");
function factoryFixture() {
    return __awaiter(this, void 0, void 0, function () {
        var factoryFactory, factory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('UniswapV3Factory')];
                case 1:
                    factoryFactory = _a.sent();
                    return [4 /*yield*/, factoryFactory.deploy()];
                case 2:
                    factory = (_a.sent());
                    return [2 /*return*/, { factory: factory }];
            }
        });
    });
}
function tokensFixture() {
    return __awaiter(this, void 0, void 0, function () {
        var tokenFactory, tokenA, tokenB, tokenC, _a, token0, token1, token2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TestERC20')];
                case 1:
                    tokenFactory = _b.sent();
                    return [4 /*yield*/, tokenFactory.deploy(ethers_1.BigNumber.from(2).pow(255))];
                case 2:
                    tokenA = (_b.sent());
                    return [4 /*yield*/, tokenFactory.deploy(ethers_1.BigNumber.from(2).pow(255))];
                case 3:
                    tokenB = (_b.sent());
                    return [4 /*yield*/, tokenFactory.deploy(ethers_1.BigNumber.from(2).pow(255))];
                case 4:
                    tokenC = (_b.sent());
                    _a = [tokenA, tokenB, tokenC].sort(function (tokenA, tokenB) {
                        return tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? -1 : 1;
                    }), token0 = _a[0], token1 = _a[1], token2 = _a[2];
                    return [2 /*return*/, { token0: token0, token1: token1, token2: token2 }];
            }
        });
    });
}
// Monday, October 5, 2020 9:00:00 AM GMT-05:00
exports.TEST_POOL_START_TIME = 1601906400;
var poolFixture = function () {
    return __awaiter(this, void 0, void 0, function () {
        var factory, _a, token0, token1, token2, MockTimeUniswapV3PoolDeployerFactory, MockTimeUniswapV3PoolFactory, calleeContractFactory, routerContractFactory, swapTargetCallee, swapTargetRouter;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, factoryFixture()];
                case 1:
                    factory = (_b.sent()).factory;
                    return [4 /*yield*/, tokensFixture()];
                case 2:
                    _a = _b.sent(), token0 = _a.token0, token1 = _a.token1, token2 = _a.token2;
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('MockTimeUniswapV3PoolDeployer')];
                case 3:
                    MockTimeUniswapV3PoolDeployerFactory = _b.sent();
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('MockTimeUniswapV3Pool')];
                case 4:
                    MockTimeUniswapV3PoolFactory = _b.sent();
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TestUniswapV3Callee')];
                case 5:
                    calleeContractFactory = _b.sent();
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TestUniswapV3Router')];
                case 6:
                    routerContractFactory = _b.sent();
                    return [4 /*yield*/, calleeContractFactory.deploy()];
                case 7:
                    swapTargetCallee = (_b.sent());
                    return [4 /*yield*/, routerContractFactory.deploy()];
                case 8:
                    swapTargetRouter = (_b.sent());
                    return [2 /*return*/, {
                            token0: token0,
                            token1: token1,
                            token2: token2,
                            factory: factory,
                            swapTargetCallee: swapTargetCallee,
                            swapTargetRouter: swapTargetRouter,
                            createPool: function (fee_1, tickSpacing_1) {
                                var args_1 = [];
                                for (var _i = 2; _i < arguments.length; _i++) {
                                    args_1[_i - 2] = arguments[_i];
                                }
                                return __awaiter(_this, __spreadArray([fee_1, tickSpacing_1], args_1, true), void 0, function (fee, tickSpacing, firstToken, secondToken) {
                                    var mockTimePoolDeployer, tx, receipt, poolAddress;
                                    var _a, _b;
                                    if (firstToken === void 0) { firstToken = token0; }
                                    if (secondToken === void 0) { secondToken = token1; }
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0: return [4 /*yield*/, MockTimeUniswapV3PoolDeployerFactory.deploy()];
                                            case 1:
                                                mockTimePoolDeployer = (_c.sent());
                                                return [4 /*yield*/, mockTimePoolDeployer.deploy(factory.address, firstToken.address, secondToken.address, fee, tickSpacing)];
                                            case 2:
                                                tx = _c.sent();
                                                return [4 /*yield*/, tx.wait()];
                                            case 3:
                                                receipt = _c.sent();
                                                poolAddress = (_b = (_a = receipt.events) === null || _a === void 0 ? void 0 : _a[0].args) === null || _b === void 0 ? void 0 : _b.pool;
                                                return [2 /*return*/, MockTimeUniswapV3PoolFactory.attach(poolAddress)];
                                        }
                                    });
                                });
                            },
                        }];
            }
        });
    });
};
exports.poolFixture = poolFixture;
