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
var chai_1 = require("chai");
var permit_1 = require("./shared/permit");
describe('SelfPermit', function () {
    var wallet;
    var other;
    var fixture = function (wallets, provider) { return __awaiter(void 0, void 0, void 0, function () {
        var tokenFactory, token, selfPermitTestFactory, selfPermitTest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('TestERC20PermitAllowed')];
                case 1:
                    tokenFactory = _a.sent();
                    return [4 /*yield*/, tokenFactory.deploy(0)];
                case 2:
                    token = (_a.sent());
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory('SelfPermitTest')];
                case 3:
                    selfPermitTestFactory = _a.sent();
                    return [4 /*yield*/, selfPermitTestFactory.deploy()];
                case 4:
                    selfPermitTest = (_a.sent());
                    return [2 /*return*/, {
                            token: token,
                            selfPermitTest: selfPermitTest,
                        }];
            }
        });
    }); };
    var token;
    var selfPermitTest;
    var loadFixture;
    before('create fixture loader', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wallets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    wallets = _a.sent();
                    wallet = wallets[0], other = wallets[1];
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
                    return [4 /*yield*/, loadFixture(fixture)];
                case 1:
                    (_a = _b.sent(), token = _a.token, selfPermitTest = _a.selfPermitTest);
                    return [2 /*return*/];
            }
        });
    }); });
    it('#permit', function () { return __awaiter(void 0, void 0, void 0, function () {
        var value, _a, v, r, s, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    value = 123;
                    return [4 /*yield*/, (0, permit_1.getPermitSignature)(wallet, token, other.address, value)];
                case 1:
                    _a = _d.sent(), v = _a.v, r = _a.r, s = _a.s;
                    _b = chai_1.expect;
                    return [4 /*yield*/, token.allowance(wallet.address, other.address)];
                case 2:
                    _b.apply(void 0, [_d.sent()]).to.be.eq(0);
                    return [4 /*yield*/, token['permit(address,address,uint256,uint256,uint8,bytes32,bytes32)'](wallet.address, other.address, value, ethers_1.constants.MaxUint256, v, r, s)];
                case 3:
                    _d.sent();
                    _c = chai_1.expect;
                    return [4 /*yield*/, token.allowance(wallet.address, other.address)];
                case 4:
                    _c.apply(void 0, [_d.sent()]).to.be.eq(value);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#selfPermit', function () {
        var value = 456;
        it('works', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, v, r, s, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, permit_1.getPermitSignature)(wallet, token, selfPermitTest.address, value)];
                    case 1:
                        _a = _d.sent(), v = _a.v, r = _a.r, s = _a.s;
                        _b = chai_1.expect;
                        return [4 /*yield*/, token.allowance(wallet.address, selfPermitTest.address)];
                    case 2:
                        _b.apply(void 0, [_d.sent()]).to.be.eq(0);
                        return [4 /*yield*/, selfPermitTest.selfPermit(token.address, value, ethers_1.constants.MaxUint256, v, r, s)];
                    case 3:
                        _d.sent();
                        _c = chai_1.expect;
                        return [4 /*yield*/, token.allowance(wallet.address, selfPermitTest.address)];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).to.be.eq(value);
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if permit is submitted externally', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, v, r, s, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, permit_1.getPermitSignature)(wallet, token, selfPermitTest.address, value)];
                    case 1:
                        _a = _d.sent(), v = _a.v, r = _a.r, s = _a.s;
                        _b = chai_1.expect;
                        return [4 /*yield*/, token.allowance(wallet.address, selfPermitTest.address)];
                    case 2:
                        _b.apply(void 0, [_d.sent()]).to.be.eq(0);
                        return [4 /*yield*/, token['permit(address,address,uint256,uint256,uint8,bytes32,bytes32)'](wallet.address, selfPermitTest.address, value, ethers_1.constants.MaxUint256, v, r, s)];
                    case 3:
                        _d.sent();
                        _c = chai_1.expect;
                        return [4 /*yield*/, token.allowance(wallet.address, selfPermitTest.address)];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).to.be.eq(value);
                        return [4 /*yield*/, (0, chai_1.expect)(selfPermitTest.selfPermit(token.address, value, ethers_1.constants.MaxUint256, v, r, s)).to.be.revertedWith('ERC20Permit: invalid signature')];
                    case 5:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#selfPermitIfNecessary', function () {
        var value = 789;
        it('works', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, v, r, s, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, permit_1.getPermitSignature)(wallet, token, selfPermitTest.address, value)];
                    case 1:
                        _a = _d.sent(), v = _a.v, r = _a.r, s = _a.s;
                        _b = chai_1.expect;
                        return [4 /*yield*/, token.allowance(wallet.address, selfPermitTest.address)];
                    case 2:
                        _b.apply(void 0, [_d.sent()]).to.be.eq(0);
                        return [4 /*yield*/, selfPermitTest.selfPermitIfNecessary(token.address, value, ethers_1.constants.MaxUint256, v, r, s)];
                    case 3:
                        _d.sent();
                        _c = chai_1.expect;
                        return [4 /*yield*/, token.allowance(wallet.address, selfPermitTest.address)];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).to.be.eq(value);
                        return [2 /*return*/];
                }
            });
        }); });
        it('does not fail if permit is submitted externally', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, v, r, s, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, permit_1.getPermitSignature)(wallet, token, selfPermitTest.address, value)];
                    case 1:
                        _a = _d.sent(), v = _a.v, r = _a.r, s = _a.s;
                        _b = chai_1.expect;
                        return [4 /*yield*/, token.allowance(wallet.address, selfPermitTest.address)];
                    case 2:
                        _b.apply(void 0, [_d.sent()]).to.be.eq(0);
                        return [4 /*yield*/, token['permit(address,address,uint256,uint256,uint8,bytes32,bytes32)'](wallet.address, selfPermitTest.address, value, ethers_1.constants.MaxUint256, v, r, s)];
                    case 3:
                        _d.sent();
                        _c = chai_1.expect;
                        return [4 /*yield*/, token.allowance(wallet.address, selfPermitTest.address)];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).to.be.eq(value);
                        return [4 /*yield*/, selfPermitTest.selfPermitIfNecessary(token.address, value, ethers_1.constants.MaxUint256, v, r, s)];
                    case 5:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#selfPermitAllowed', function () {
        it('works', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, v, r, s, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, permit_1.getPermitSignature)(wallet, token, selfPermitTest.address, ethers_1.constants.MaxUint256)];
                    case 1:
                        _a = _d.sent(), v = _a.v, r = _a.r, s = _a.s;
                        _b = chai_1.expect;
                        return [4 /*yield*/, token.allowance(wallet.address, selfPermitTest.address)];
                    case 2:
                        _b.apply(void 0, [_d.sent()]).to.be.eq(0);
                        return [4 /*yield*/, (0, chai_1.expect)(selfPermitTest.selfPermitAllowed(token.address, 0, ethers_1.constants.MaxUint256, v, r, s))
                                .to.emit(token, 'Approval')
                                .withArgs(wallet.address, selfPermitTest.address, ethers_1.constants.MaxUint256)];
                    case 3:
                        _d.sent();
                        _c = chai_1.expect;
                        return [4 /*yield*/, token.allowance(wallet.address, selfPermitTest.address)];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).to.be.eq(ethers_1.constants.MaxUint256);
                        return [2 /*return*/];
                }
            });
        }); });
        it('fails if permit is submitted externally', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, v, r, s, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, permit_1.getPermitSignature)(wallet, token, selfPermitTest.address, ethers_1.constants.MaxUint256)];
                    case 1:
                        _a = _d.sent(), v = _a.v, r = _a.r, s = _a.s;
                        _b = chai_1.expect;
                        return [4 /*yield*/, token.allowance(wallet.address, selfPermitTest.address)];
                    case 2:
                        _b.apply(void 0, [_d.sent()]).to.be.eq(0);
                        return [4 /*yield*/, token['permit(address,address,uint256,uint256,bool,uint8,bytes32,bytes32)'](wallet.address, selfPermitTest.address, 0, ethers_1.constants.MaxUint256, true, v, r, s)];
                    case 3:
                        _d.sent();
                        _c = chai_1.expect;
                        return [4 /*yield*/, token.allowance(wallet.address, selfPermitTest.address)];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).to.be.eq(ethers_1.constants.MaxUint256);
                        return [4 /*yield*/, (0, chai_1.expect)(selfPermitTest.selfPermitAllowed(token.address, 0, ethers_1.constants.MaxUint256, v, r, s)).to.be.revertedWith('TestERC20PermitAllowed::permit: wrong nonce')];
                    case 5:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#selfPermitAllowedIfNecessary', function () {
        it('works', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, v, r, s, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, permit_1.getPermitSignature)(wallet, token, selfPermitTest.address, ethers_1.constants.MaxUint256)];
                    case 1:
                        _a = _d.sent(), v = _a.v, r = _a.r, s = _a.s;
                        _b = chai_1.expect;
                        return [4 /*yield*/, token.allowance(wallet.address, selfPermitTest.address)];
                    case 2:
                        _b.apply(void 0, [_d.sent()]).to.eq(0);
                        return [4 /*yield*/, (0, chai_1.expect)(selfPermitTest.selfPermitAllowedIfNecessary(token.address, 0, ethers_1.constants.MaxUint256, v, r, s))
                                .to.emit(token, 'Approval')
                                .withArgs(wallet.address, selfPermitTest.address, ethers_1.constants.MaxUint256)];
                    case 3:
                        _d.sent();
                        _c = chai_1.expect;
                        return [4 /*yield*/, token.allowance(wallet.address, selfPermitTest.address)];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).to.eq(ethers_1.constants.MaxUint256);
                        return [2 /*return*/];
                }
            });
        }); });
        it('skips if already max approved', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, v, r, s, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, permit_1.getPermitSignature)(wallet, token, selfPermitTest.address, ethers_1.constants.MaxUint256)];
                    case 1:
                        _a = _d.sent(), v = _a.v, r = _a.r, s = _a.s;
                        _b = chai_1.expect;
                        return [4 /*yield*/, token.allowance(wallet.address, selfPermitTest.address)];
                    case 2:
                        _b.apply(void 0, [_d.sent()]).to.be.eq(0);
                        return [4 /*yield*/, token.approve(selfPermitTest.address, ethers_1.constants.MaxUint256)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(selfPermitTest.selfPermitAllowedIfNecessary(token.address, 0, ethers_1.constants.MaxUint256, v, r, s)).to.not.emit(token, 'Approval')];
                    case 4:
                        _d.sent();
                        _c = chai_1.expect;
                        return [4 /*yield*/, token.allowance(wallet.address, selfPermitTest.address)];
                    case 5:
                        _c.apply(void 0, [_d.sent()]).to.eq(ethers_1.constants.MaxUint256);
                        return [2 /*return*/];
                }
            });
        }); });
        it('does not fail if permit is submitted externally', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, v, r, s, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, permit_1.getPermitSignature)(wallet, token, selfPermitTest.address, ethers_1.constants.MaxUint256)];
                    case 1:
                        _a = _d.sent(), v = _a.v, r = _a.r, s = _a.s;
                        _b = chai_1.expect;
                        return [4 /*yield*/, token.allowance(wallet.address, selfPermitTest.address)];
                    case 2:
                        _b.apply(void 0, [_d.sent()]).to.be.eq(0);
                        return [4 /*yield*/, token['permit(address,address,uint256,uint256,bool,uint8,bytes32,bytes32)'](wallet.address, selfPermitTest.address, 0, ethers_1.constants.MaxUint256, true, v, r, s)];
                    case 3:
                        _d.sent();
                        _c = chai_1.expect;
                        return [4 /*yield*/, token.allowance(wallet.address, selfPermitTest.address)];
                    case 4:
                        _c.apply(void 0, [_d.sent()]).to.be.eq(ethers_1.constants.MaxUint256);
                        return [4 /*yield*/, selfPermitTest.selfPermitAllowedIfNecessary(token.address, 0, ethers_1.constants.MaxUint256, v, r, s)];
                    case 5:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
