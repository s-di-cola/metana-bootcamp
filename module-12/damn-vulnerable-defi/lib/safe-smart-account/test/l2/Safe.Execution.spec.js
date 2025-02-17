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
var chai_1 = require("chai");
var hardhat_1 = require("hardhat");
require("@nomiclabs/hardhat-ethers");
var setup_1 = require("../utils/setup");
var execution_1 = require("../../src/utils/execution");
var units_1 = require("@ethersproject/units");
var config_1 = require("../utils/config");
describe("SafeL2", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user1, user2, setupTests;
    return __generator(this, function (_b) {
        before(function () {
            if ((0, config_1.safeContractUnderTest)() != "SafeL2") {
                this.skip();
            }
        });
        _a = hardhat_1.waffle.provider.getWallets(), user1 = _a[0], user2 = _a[1];
        setupTests = hardhat_1.deployments.createFixture(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var mock;
            var _c;
            var deployments = _b.deployments;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, deployments.fixture()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, (0, setup_1.getMock)()];
                    case 2:
                        mock = _d.sent();
                        _c = {};
                        return [4 /*yield*/, (0, setup_1.getSafeWithOwners)([user1.address])];
                    case 3: return [2 /*return*/, (_c.safe = _d.sent(),
                            _c.mock = mock,
                            _c)];
                }
            });
        }); });
        describe("execTransactions", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should emit SafeMultiSigTransaction event", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var safe, tx, _a, _b, additionalInfo, signatures, signatureBytes, executedTx;
                    var _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                safe = (_d.sent()).safe;
                                _a = execution_1.buildSafeTransaction;
                                _c = {
                                    to: user1.address
                                };
                                return [4 /*yield*/, safe.nonce()];
                            case 2:
                                tx = _a.apply(void 0, [(_c.nonce = _d.sent(),
                                        _c.operation = 0,
                                        _c.gasPrice = 1,
                                        _c.safeTxGas = 100000,
                                        _c.refundReceiver = user2.address,
                                        _c)]);
                                return [4 /*yield*/, user1.sendTransaction({ to: safe.address, value: (0, units_1.parseEther)("1") })];
                            case 3:
                                _d.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getBalance(safe.address)];
                            case 4: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).to.be.deep.eq((0, units_1.parseEther)("1"))];
                            case 5:
                                _d.sent();
                                additionalInfo = hardhat_1.ethers.utils.defaultAbiCoder.encode(["uint256", "address", "uint256"], [tx.nonce, user1.address, 1]);
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, tx, true)];
                            case 6:
                                signatures = [_d.sent()];
                                signatureBytes = (0, execution_1.buildSignatureBytes)(signatures).toLowerCase();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeTx)(safe, tx, signatures).then(function (tx) {
                                        executedTx = tx;
                                        return tx;
                                    }))
                                        .to.emit(safe, "ExecutionSuccess")
                                        .to.emit(safe, "SafeMultiSigTransaction")
                                        .withArgs(tx.to, tx.value, tx.data, tx.operation, tx.safeTxGas, tx.baseGas, tx.gasPrice, tx.gasToken, tx.refundReceiver, signatureBytes, additionalInfo)];
                            case 7:
                                _d.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("should emit SafeModuleTransaction event", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, mock, user2Safe;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, setupTests()];
                            case 1:
                                _a = _b.sent(), safe = _a.safe, mock = _a.mock;
                                user2Safe = safe.connect(user2);
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "enableModule", [user2.address], [user1])];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, (0, chai_1.expect)(user2Safe.execTransactionFromModule(mock.address, 0, "0xbaddad", 0))
                                        .to.emit(safe, "SafeModuleTransaction")
                                        .withArgs(user2.address, mock.address, 0, "0xbaddad", 0)
                                        .to.emit(safe, "ExecutionFromModuleSuccess")
                                        .withArgs(user2.address)];
                            case 3:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        return [2 /*return*/];
    });
}); });
