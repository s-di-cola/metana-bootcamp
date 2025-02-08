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
var externalFixtures_1 = require("./shared/externalFixtures");
describe('PeripheryImmutableState', function () {
    var nonfungiblePositionManagerFixture = function (wallets, provider) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, weth9, factory, stateFactory, state;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, externalFixtures_1.v3RouterFixture)(wallets, provider)];
                case 1:
                    _a = _b.sent(), weth9 = _a.weth9, factory = _a.factory;
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('PeripheryImmutableStateTest')];
                case 2:
                    stateFactory = _b.sent();
                    return [4 /*yield*/, stateFactory.deploy(factory.address, weth9.address)];
                case 3:
                    state = (_b.sent());
                    return [2 /*return*/, {
                            weth9: weth9,
                            factory: factory,
                            state: state,
                        }];
            }
        });
    }); };
    var factory;
    var weth9;
    var state;
    var loadFixture;
    before('create fixture loader', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = hardhat_1.waffle).createFixtureLoader;
                    return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    loadFixture = _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach('load fixture', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ;
                    return [4 /*yield*/, loadFixture(nonfungiblePositionManagerFixture)];
                case 1:
                    (_a = _b.sent(), state = _a.state, weth9 = _a.weth9, factory = _a.factory);
                    return [2 /*return*/];
            }
        });
    }); });
    it('bytecode size', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect_1.expect;
                    return [4 /*yield*/, state.provider.getCode(state.address)];
                case 1:
                    _a.apply(void 0, [((_b.sent()).length - 2) / 2]).to.matchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#WETH9', function () {
        it('points to WETH9', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, state.WETH9()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(weth9.address);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#factory', function () {
        it('points to v3 core factory', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, state.factory()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(factory.address);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
