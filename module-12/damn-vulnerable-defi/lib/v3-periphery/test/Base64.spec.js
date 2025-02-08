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
var base64_1 = require("./shared/base64");
var expect_1 = require("./shared/expect");
var crypto_1 = require("crypto");
var snapshotGasCost_1 = require("./shared/snapshotGasCost");
function stringToHex(str) {
    return "0x".concat(Buffer.from(str, 'utf8').toString('hex'));
}
describe('Base64', function () {
    var base64;
    before('deploy test contract', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('Base64Test')];
                case 1: return [4 /*yield*/, (_a.sent()).deploy()];
                case 2:
                    base64 = (_a.sent());
                    return [2 /*return*/];
            }
        });
    }); });
    describe('#encode', function () {
        it('is correct for empty bytes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect_1.expect;
                        return [4 /*yield*/, base64.encode(stringToHex(''))];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq('');
                        return [2 /*return*/];
                }
            });
        }); });
        var _loop_1 = function (example) {
            it("works for \"".concat(example, "\""), function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect_1.expect;
                            return [4 /*yield*/, base64.encode(stringToHex(example))];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq((0, base64_1.base64Encode)(example));
                            return [2 /*return*/];
                    }
                });
            }); });
            it("gas cost of encode(".concat(example, ")"), function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(base64.getGasCostOfEncode(stringToHex(example)))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        for (var _i = 0, _a = [
            'test string',
            'this is a test',
            'alphabet soup',
            'aLpHaBeT',
            'includes\nnewlines',
            '<some html>',
            '😀',
            'f',
            'fo',
            'foo',
            'foob',
            'fooba',
            'foobar',
            'this is a very long string that should cost a lot of gas to encode :)',
        ]; _i < _a.length; _i++) {
            var example = _a[_i];
            _loop_1(example);
        }
        describe('max size string (24kB)', function () {
            var str;
            before(function () {
                str = Array(24 * 1024)
                    .fill(null)
                    .map(function (_, i) { return String.fromCharCode(i % 1024); })
                    .join('');
            });
            it('correctness', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect_1.expect;
                            return [4 /*yield*/, base64.encode(stringToHex(str))];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.eq((0, base64_1.base64Encode)(str));
                            return [2 /*return*/];
                    }
                });
            }); });
            it('gas cost', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, snapshotGasCost_1.default)(base64.getGasCostOfEncode(stringToHex(str)))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it('tiny fuzzing', function () { return __awaiter(void 0, void 0, void 0, function () {
            var inputs, i, promises, results, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputs = [];
                        for (i = 0; i < 100; i++) {
                            inputs.push((0, crypto_1.randomBytes)(Math.random() * 100));
                        }
                        promises = inputs.map(function (input) {
                            return base64.encode("0x".concat(input.toString('hex')));
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        results = _a.sent();
                        for (i = 0; i < inputs.length; i++) {
                            (0, expect_1.expect)(inputs[i].toString('base64')).to.eq(results[i]);
                        }
                        return [2 /*return*/];
                }
            });
        }); }).timeout(300000);
    });
});
