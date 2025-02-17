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
var constants_1 = require("./shared/constants");
var expect_1 = require("./shared/expect");
var path_1 = require("./shared/path");
var snapshotGasCost_1 = require("./shared/snapshotGasCost");
describe('Path', function () {
    var path;
    var tokenAddresses = [
        '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
        '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
        '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    ];
    var fees = [constants_1.FeeAmount.MEDIUM, constants_1.FeeAmount.MEDIUM];
    var pathTestFixture = function () { return __awaiter(void 0, void 0, void 0, function () {
        var pathTestFactory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('PathTest')];
                case 1:
                    pathTestFactory = _a.sent();
                    return [4 /*yield*/, pathTestFactory.deploy()];
                case 2: return [2 /*return*/, (_a.sent())];
            }
        });
    }); };
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
    beforeEach('deploy PathTest', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadFixture(pathTestFixture)];
                case 1:
                    path = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('js encoding works as expected', function () { return __awaiter(void 0, void 0, void 0, function () {
        var expectedPath;
        return __generator(this, function (_a) {
            expectedPath = '0x' +
                tokenAddresses
                    .slice(0, 2)
                    .map(function (tokenAddress) { return tokenAddress.slice(2).toLowerCase(); })
                    .join('000bb8');
            (0, expect_1.expect)((0, path_1.encodePath)(tokenAddresses.slice(0, 2), fees.slice(0, 1))).to.eq(expectedPath);
            expectedPath = '0x' + tokenAddresses.map(function (tokenAddress) { return tokenAddress.slice(2).toLowerCase(); }).join('000bb8');
            (0, expect_1.expect)((0, path_1.encodePath)(tokenAddresses, fees)).to.eq(expectedPath);
            return [2 /*return*/];
        });
    }); });
    it('js decoding works as expected', function () { return __awaiter(void 0, void 0, void 0, function () {
        var encodedPath, _a, decodedTokens, decodedFees;
        return __generator(this, function (_b) {
            encodedPath = (0, path_1.encodePath)(tokenAddresses, fees);
            _a = (0, path_1.decodePath)(encodedPath), decodedTokens = _a[0], decodedFees = _a[1];
            (0, expect_1.expect)(decodedTokens).to.deep.eq(tokenAddresses);
            (0, expect_1.expect)(decodedFees).to.deep.eq(fees);
            return [2 /*return*/];
        });
    }); });
    describe('#hasMultiplePools / #decodeFirstPool / #skipToken / #getFirstPool', function () {
        var encodedPath = (0, path_1.encodePath)(tokenAddresses, fees);
        it('works on first pool', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, firstPool, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, path.hasMultiplePools(encodedPath)];
                    case 1:
                        _a.apply(void 0, [_e.sent()]).to.be.true;
                        return [4 /*yield*/, path.decodeFirstPool(encodedPath)];
                    case 2:
                        firstPool = _e.sent();
                        (0, expect_1.expect)(firstPool.tokenA).to.be.eq(tokenAddresses[0]);
                        (0, expect_1.expect)(firstPool.tokenB).to.be.eq(tokenAddresses[1]);
                        (0, expect_1.expect)(firstPool.fee).to.be.eq(constants_1.FeeAmount.MEDIUM);
                        _b = expect_1.expect;
                        _d = (_c = path).decodeFirstPool;
                        return [4 /*yield*/, path.getFirstPool(encodedPath)];
                    case 3: return [4 /*yield*/, _d.apply(_c, [_e.sent()])];
                    case 4:
                        _b.apply(void 0, [_e.sent()]).to.deep.eq(firstPool);
                        return [2 /*return*/];
                }
            });
        }); });
        var offset = 20 + 3;
        it('skips 1 item', function () { return __awaiter(void 0, void 0, void 0, function () {
            var skipped, _a, _b, tokenA, tokenB, decodedFee;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, path.skipToken(encodedPath)];
                    case 1:
                        skipped = _c.sent();
                        (0, expect_1.expect)(skipped).to.be.eq('0x' + encodedPath.slice(2 + offset * 2));
                        _a = expect_1.expect;
                        return [4 /*yield*/, path.hasMultiplePools(skipped)];
                    case 2:
                        _a.apply(void 0, [_c.sent()]).to.be.false;
                        return [4 /*yield*/, path.decodeFirstPool(skipped)];
                    case 3:
                        _b = _c.sent(), tokenA = _b.tokenA, tokenB = _b.tokenB, decodedFee = _b.fee;
                        (0, expect_1.expect)(tokenA).to.be.eq(tokenAddresses[1]);
                        (0, expect_1.expect)(tokenB).to.be.eq(tokenAddresses[2]);
                        (0, expect_1.expect)(decodedFee).to.be.eq(constants_1.FeeAmount.MEDIUM);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('gas cost', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(path.getGasCostOfDecodeFirstPool((0, path_1.encodePath)([tokenAddresses[0], tokenAddresses[1]], [constants_1.FeeAmount.MEDIUM])))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
