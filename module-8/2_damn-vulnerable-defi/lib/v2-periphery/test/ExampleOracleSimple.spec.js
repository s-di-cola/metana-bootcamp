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
var ethereum_waffle_1 = require("ethereum-waffle");
var utilities_1 = require("./shared/utilities");
var fixtures_1 = require("./shared/fixtures");
var ExampleOracleSimple_json_1 = __importDefault(require("../build/ExampleOracleSimple.json"));
chai_1.default.use(ethereum_waffle_1.solidity);
var overrides = {
    gasLimit: 9999999
};
var token0Amount = (0, utilities_1.expandTo18Decimals)(5);
var token1Amount = (0, utilities_1.expandTo18Decimals)(10);
describe('ExampleOracleSimple', function () {
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
    var exampleOracleSimple;
    function addLiquidity() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, token0.transfer(pair.address, token0Amount)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, token1.transfer(pair.address, token1Amount)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, pair.mint(wallet.address, overrides)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
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
                        return [4 /*yield*/, addLiquidity()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, ethereum_waffle_1.deployContract)(wallet, ExampleOracleSimple_json_1.default, [fixture.factoryV2.address, token0.address, token1.address], overrides)];
                    case 3:
                        exampleOracleSimple = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('update', function () { return __awaiter(void 0, void 0, void 0, function () {
        var blockTimestamp, expectedPrice, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, pair.getReserves()];
                case 1:
                    blockTimestamp = (_e.sent())[2];
                    return [4 /*yield*/, (0, utilities_1.mineBlock)(provider, blockTimestamp + 60 * 60 * 23)];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, (0, chai_1.expect)(exampleOracleSimple.update(overrides)).to.be.reverted];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, (0, utilities_1.mineBlock)(provider, blockTimestamp + 60 * 60 * 24)];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, exampleOracleSimple.update(overrides)];
                case 5:
                    _e.sent();
                    expectedPrice = (0, utilities_1.encodePrice)(token0Amount, token1Amount);
                    _a = chai_1.expect;
                    return [4 /*yield*/, exampleOracleSimple.price0Average()];
                case 6:
                    _a.apply(void 0, [_e.sent()]).to.eq(expectedPrice[0]);
                    _b = chai_1.expect;
                    return [4 /*yield*/, exampleOracleSimple.price1Average()];
                case 7:
                    _b.apply(void 0, [_e.sent()]).to.eq(expectedPrice[1]);
                    _c = chai_1.expect;
                    return [4 /*yield*/, exampleOracleSimple.consult(token0.address, token0Amount)];
                case 8:
                    _c.apply(void 0, [_e.sent()]).to.eq(token1Amount);
                    _d = chai_1.expect;
                    return [4 /*yield*/, exampleOracleSimple.consult(token1.address, token1Amount)];
                case 9:
                    _d.apply(void 0, [_e.sent()]).to.eq(token0Amount);
                    return [2 /*return*/];
            }
        });
    }); });
});
