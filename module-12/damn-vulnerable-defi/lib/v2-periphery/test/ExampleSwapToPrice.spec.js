"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = __importStar(require("chai"));
var constants_1 = require("ethers/constants");
var ethereum_waffle_1 = require("ethereum-waffle");
var utilities_1 = require("./shared/utilities");
var fixtures_1 = require("./shared/fixtures");
var ExampleSwapToPrice_json_1 = __importDefault(require("../build/ExampleSwapToPrice.json"));
chai_1.default.use(ethereum_waffle_1.solidity);
var overrides = {
    gasLimit: 9999999
};
describe('ExampleSwapToPrice', function () {
    var provider = new ethereum_waffle_1.MockProvider({
        hardfork: 'istanbul',
        mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
        gasLimit: 9999999
    });
    var wallet = provider.getWallets()[0];
    var loadFixture = (0, ethereum_waffle_1.createFixtureLoader)(provider, [wallet]);
    var token0;
    var token1;
    var pair;
    var swapToPriceExample;
    var router;
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function () {
            var fixture;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loadFixture(fixtures_1.v2Fixture)];
                    case 1:
                        fixture = _a.sent();
                        token0 = fixture.token0;
                        token1 = fixture.token1;
                        pair = fixture.pair;
                        router = fixture.router;
                        return [4 /*yield*/, (0, ethereum_waffle_1.deployContract)(wallet, ExampleSwapToPrice_json_1.default, [fixture.factoryV2.address, fixture.router.address], overrides)];
                    case 2:
                        swapToPriceExample = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    beforeEach('set up price differential of 1:100', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, token0.transfer(pair.address, (0, utilities_1.expandTo18Decimals)(10))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, token1.transfer(pair.address, (0, utilities_1.expandTo18Decimals)(1000))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, pair.sync(overrides)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach('approve the swap contract to spend any amount of both tokens', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, token0.approve(swapToPriceExample.address, constants_1.MaxUint256)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, token1.approve(swapToPriceExample.address, constants_1.MaxUint256)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('correct router address', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = chai_1.expect;
                    return [4 /*yield*/, swapToPriceExample.router()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).to.eq(router.address);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#swapToPrice', function () {
        it('requires non-zero true price inputs', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(swapToPriceExample.swapToPrice(token0.address, token1.address, 0, 0, constants_1.MaxUint256, constants_1.MaxUint256, wallet.address, constants_1.MaxUint256)).to.be.revertedWith('ExampleSwapToPrice: ZERO_PRICE')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(swapToPriceExample.swapToPrice(token0.address, token1.address, 10, 0, constants_1.MaxUint256, constants_1.MaxUint256, wallet.address, constants_1.MaxUint256)).to.be.revertedWith('ExampleSwapToPrice: ZERO_PRICE')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(swapToPriceExample.swapToPrice(token0.address, token1.address, 0, 10, constants_1.MaxUint256, constants_1.MaxUint256, wallet.address, constants_1.MaxUint256)).to.be.revertedWith('ExampleSwapToPrice: ZERO_PRICE')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('requires non-zero max spend', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(swapToPriceExample.swapToPrice(token0.address, token1.address, 1, 100, 0, 0, wallet.address, constants_1.MaxUint256)).to.be.revertedWith('ExampleSwapToPrice: ZERO_SPEND')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('moves the price to 1:90', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(swapToPriceExample.swapToPrice(token0.address, token1.address, 1, 90, constants_1.MaxUint256, constants_1.MaxUint256, wallet.address, constants_1.MaxUint256, overrides))
                            // (1e19 + 526682316179835569) : (1e21 - 49890467170695440744) ~= 1:90
                            .to.emit(token0, 'Transfer')
                            .withArgs(wallet.address, swapToPriceExample.address, '526682316179835569')
                            .to.emit(token0, 'Approval')
                            .withArgs(swapToPriceExample.address, router.address, '526682316179835569')
                            .to.emit(token0, 'Transfer')
                            .withArgs(swapToPriceExample.address, pair.address, '526682316179835569')
                            .to.emit(token1, 'Transfer')
                            .withArgs(pair.address, wallet.address, '49890467170695440744')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('moves the price to 1:110', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(swapToPriceExample.swapToPrice(token0.address, token1.address, 1, 110, constants_1.MaxUint256, constants_1.MaxUint256, wallet.address, constants_1.MaxUint256, overrides))
                            // (1e21 + 47376582963642643588) : (1e19 - 451039908682851138) ~= 1:110
                            .to.emit(token1, 'Transfer')
                            .withArgs(wallet.address, swapToPriceExample.address, '47376582963642643588')
                            .to.emit(token1, 'Approval')
                            .withArgs(swapToPriceExample.address, router.address, '47376582963642643588')
                            .to.emit(token1, 'Transfer')
                            .withArgs(swapToPriceExample.address, pair.address, '47376582963642643588')
                            .to.emit(token0, 'Transfer')
                            .withArgs(pair.address, wallet.address, '451039908682851138')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('reverse token order', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(swapToPriceExample.swapToPrice(token1.address, token0.address, 110, 1, constants_1.MaxUint256, constants_1.MaxUint256, wallet.address, constants_1.MaxUint256, overrides))
                            // (1e21 + 47376582963642643588) : (1e19 - 451039908682851138) ~= 1:110
                            .to.emit(token1, 'Transfer')
                            .withArgs(wallet.address, swapToPriceExample.address, '47376582963642643588')
                            .to.emit(token1, 'Approval')
                            .withArgs(swapToPriceExample.address, router.address, '47376582963642643588')
                            .to.emit(token1, 'Transfer')
                            .withArgs(swapToPriceExample.address, pair.address, '47376582963642643588')
                            .to.emit(token0, 'Transfer')
                            .withArgs(pair.address, wallet.address, '451039908682851138')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('swap gas cost', function () { return __awaiter(void 0, void 0, void 0, function () {
            var tx, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, swapToPriceExample.swapToPrice(token0.address, token1.address, 1, 110, constants_1.MaxUint256, constants_1.MaxUint256, wallet.address, constants_1.MaxUint256, overrides)];
                    case 1:
                        tx = _a.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 2:
                        receipt = _a.sent();
                        (0, chai_1.expect)(receipt.gasUsed).to.eq('115129');
                        return [2 /*return*/];
                }
            });
        }); }).retries(2); // gas test is inconsistent
    });
});
