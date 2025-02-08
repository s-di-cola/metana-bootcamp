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
var snapshotGasCost_1 = require("./shared/snapshotGasCost");
describe('NoDelegateCall', function () {
    var wallet, other;
    var loadFixture;
    before('create fixture loader', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ;
                    return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    _a = _b.sent(), wallet = _a[0], other = _a[1];
                    loadFixture = hardhat_1.waffle.createFixtureLoader([wallet, other]);
                    return [2 /*return*/];
            }
        });
    }); });
    var noDelegateCallFixture = function () { return __awaiter(void 0, void 0, void 0, function () {
        var noDelegateCallTestFactory, noDelegateCallTest, minimalProxyFactory, proxy;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('NoDelegateCallTest')];
                case 1:
                    noDelegateCallTestFactory = _a.sent();
                    return [4 /*yield*/, noDelegateCallTestFactory.deploy()];
                case 2:
                    noDelegateCallTest = (_a.sent());
                    minimalProxyFactory = new hardhat_1.ethers.ContractFactory(noDelegateCallTestFactory.interface, "3d602d80600a3d3981f3363d3d373d3d3d363d73".concat(noDelegateCallTest.address.slice(2), "5af43d82803e903d91602b57fd5bf3"), wallet);
                    return [4 /*yield*/, minimalProxyFactory.deploy()];
                case 3:
                    proxy = (_a.sent());
                    return [2 /*return*/, { noDelegateCallTest: noDelegateCallTest, proxy: proxy }];
            }
        });
    }); };
    var base;
    var proxy;
    beforeEach('deploy test contracts', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ;
                    return [4 /*yield*/, loadFixture(noDelegateCallFixture)];
                case 1:
                    (_a = _b.sent(), base = _a.noDelegateCallTest, proxy = _a.proxy);
                    return [2 /*return*/];
            }
        });
    }); });
    it('runtime overhead', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = snapshotGasCost_1.default;
                    return [4 /*yield*/, base.getGasCostOfCannotBeDelegateCalled()];
                case 1:
                    _c = (_b = (_d.sent())).sub;
                    return [4 /*yield*/, base.getGasCostOfCanBeDelegateCalled()];
                case 2: return [4 /*yield*/, _a.apply(void 0, [_c.apply(_b, [_d.sent()])])];
                case 3:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('proxy can call the method without the modifier', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, proxy.canBeDelegateCalled()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('proxy cannot call the method with the modifier', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, expect_1.expect)(proxy.cannotBeDelegateCalled()).to.be.reverted];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('can call the method that calls into a private method with the modifier', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, base.callsIntoNoDelegateCallFunction()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('proxy cannot call the method that calls a private method with the modifier', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, expect_1.expect)(proxy.callsIntoNoDelegateCallFunction()).to.be.reverted];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
