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
var completeFixture_1 = require("./shared/completeFixture");
var expect_1 = require("./shared/expect");
var constants_1 = require("./shared/constants");
describe('CallbackValidation', function () {
    var nonpairAddr, wallets;
    var callbackValidationFixture = function (wallets, provider) { return __awaiter(void 0, void 0, void 0, function () {
        var factory, tokenFactory, callbackValidationFactory, tokens, _a, callbackValidation;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, completeFixture_1.default)(wallets, provider)];
                case 1:
                    factory = (_b.sent()).factory;
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TestERC20')];
                case 2:
                    tokenFactory = _b.sent();
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TestCallbackValidation')];
                case 3:
                    callbackValidationFactory = _b.sent();
                    return [4 /*yield*/, tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))];
                case 4:
                    _a = [
                        (_b.sent())
                    ];
                    return [4 /*yield*/, tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))];
                case 5:
                    tokens = _a.concat([
                        (_b.sent())
                    ]);
                    return [4 /*yield*/, callbackValidationFactory.deploy()];
                case 6:
                    callbackValidation = (_b.sent());
                    return [2 /*return*/, {
                            tokens: tokens,
                            callbackValidation: callbackValidation,
                            factory: factory,
                        }];
            }
        });
    }); };
    var callbackValidation;
    var tokens;
    var factory;
    var loadFixture;
    before('create fixture loader', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ;
                    return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    _a = _b.sent(), nonpairAddr = _a[0], wallets = _a.slice(1);
                    loadFixture = hardhat_1.waffle.createFixtureLoader(wallets);
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
                    return [4 /*yield*/, loadFixture(callbackValidationFixture)];
                case 1:
                    (_a = _b.sent(), callbackValidation = _a.callbackValidation, tokens = _a.tokens, factory = _a.factory);
                    return [2 /*return*/];
            }
        });
    }); });
    it('reverts when called from an address other than the associated UniswapV3Pool', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            (0, expect_1.expect)(callbackValidation
                .connect(nonpairAddr)
                .verifyCallback(factory.address, tokens[0].address, tokens[1].address, constants_1.FeeAmount.MEDIUM)).to.be.reverted;
            return [2 /*return*/];
        });
    }); });
});
