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
var ethers_1 = require("ethers");
require("@nomiclabs/hardhat-ethers");
var constants_1 = require("@ethersproject/constants");
var setup_1 = require("../utils/setup");
var execution_1 = require("../../src/utils/execution");
var encoding_1 = require("../utils/encoding");
describe("GuardManager", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user1, user2, setupWithTemplate;
    return __generator(this, function (_b) {
        _a = hardhat_1.waffle.provider.getWallets(), user1 = _a[0], user2 = _a[1];
        setupWithTemplate = hardhat_1.deployments.createFixture(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var mock, guardContract, guardEip165Calldata, safe;
            var deployments = _b.deployments;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, deployments.fixture()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, (0, setup_1.getMock)()];
                    case 2:
                        mock = _c.sent();
                        return [4 /*yield*/, hardhat_1.default.ethers.getContractAt("Guard", constants_1.AddressZero)];
                    case 3:
                        guardContract = _c.sent();
                        guardEip165Calldata = guardContract.interface.encodeFunctionData("supportsInterface", ["0xe6d7a83a"]);
                        return [4 /*yield*/, mock.givenCalldataReturnBool(guardEip165Calldata, true)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, (0, setup_1.getSafeWithOwners)([user2.address])];
                    case 5:
                        safe = _c.sent();
                        return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "setGuard", [mock.address], [user2])];
                    case 6:
                        _c.sent();
                        return [2 /*return*/, {
                                safe: safe,
                                mock: mock,
                                guardEip165Calldata: guardEip165Calldata,
                            }];
                }
            });
        }); });
        describe("setGuard", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("is not called when setting initially", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, mock, guardEip165Calldata, slot, _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, setupWithTemplate()];
                            case 1:
                                _a = _f.sent(), safe = _a.safe, mock = _a.mock, guardEip165Calldata = _a.guardEip165Calldata;
                                slot = hardhat_1.ethers.utils.keccak256(hardhat_1.ethers.utils.toUtf8Bytes("guard_manager.guard.address"));
                                return [4 /*yield*/, (0, execution_1.executeContractCallWithSigners)(safe, safe, "setGuard", [constants_1.AddressZero], [user2])];
                            case 2:
                                _f.sent();
                                _b = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, slot)];
                            case 3: 
                            // Check guard
                            return [4 /*yield*/, _b.apply(void 0, [_f.sent()]).to.be.eq("0x" + "".padStart(64, "0"))];
                            case 4:
                                // Check guard
                                _f.sent();
                                return [4 /*yield*/, mock.reset()];
                            case 5:
                                _f.sent();
                                _c = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, slot)];
                            case 6: return [4 /*yield*/, _c.apply(void 0, [_f.sent()]).to.be.eq("0x" + "".padStart(64, "0"))];
                            case 7:
                                _f.sent();
                                // Reverts if it doesn't implement ERC165 Guard Interface
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "setGuard", [mock.address], [user2])).to.be.revertedWith("GS013")];
                            case 8:
                                // Reverts if it doesn't implement ERC165 Guard Interface
                                _f.sent();
                                return [4 /*yield*/, mock.givenCalldataReturnBool(guardEip165Calldata, true)];
                            case 9:
                                _f.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeContractCallWithSigners)(safe, safe, "setGuard", [mock.address], [user2]))
                                        .to.emit(safe, "ChangedGuard")
                                        .withArgs(mock.address)];
                            case 10:
                                _f.sent();
                                _d = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, slot)];
                            case 11: 
                            // Check guard
                            return [4 /*yield*/, _d.apply(void 0, [_f.sent()]).to.be.eq("0x" + mock.address.toLowerCase().slice(2).padStart(64, "0"))];
                            case 12:
                                // Check guard
                                _f.sent();
                                // Guard should not be called, as it was not set before the transaction execution
                                _e = chai_1.expect;
                                return [4 /*yield*/, mock.callStatic.invocationCount()];
                            case 13:
                                // Guard should not be called, as it was not set before the transaction execution
                                _e.apply(void 0, [_f.sent()]).to.be.eq(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("is called when removed", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, mock, slot, _b, safeTx, _c, _d, signature, signatureBytes, _e, _f, guardInterface, checkTxData, _g, checkExecData, _h, _j, _k, _l, _m, _o;
                    return __generator(this, function (_p) {
                        switch (_p.label) {
                            case 0: return [4 /*yield*/, setupWithTemplate()];
                            case 1:
                                _a = _p.sent(), safe = _a.safe, mock = _a.mock;
                                slot = hardhat_1.ethers.utils.keccak256(hardhat_1.ethers.utils.toUtf8Bytes("guard_manager.guard.address"));
                                _b = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, slot)];
                            case 2: 
                            // Check guard
                            return [4 /*yield*/, _b.apply(void 0, [_p.sent()]).to.be.eq("0x" + mock.address.toLowerCase().slice(2).padStart(64, "0"))];
                            case 3:
                                // Check guard
                                _p.sent();
                                _c = execution_1.buildContractCall;
                                _d = [safe, "setGuard", [constants_1.AddressZero]];
                                return [4 /*yield*/, safe.nonce()];
                            case 4:
                                safeTx = _c.apply(void 0, _d.concat([_p.sent()]));
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user2, safe, safeTx)];
                            case 5:
                                signature = _p.sent();
                                signatureBytes = (0, execution_1.buildSignatureBytes)([signature]);
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeTx)(safe, safeTx, [signature]))
                                        .to.emit(safe, "ChangedGuard")
                                        .withArgs(constants_1.AddressZero)];
                            case 6:
                                _p.sent();
                                _e = chai_1.expect;
                                return [4 /*yield*/, hardhat_1.default.ethers.provider.getStorageAt(safe.address, slot)];
                            case 7: 
                            // Check guard
                            return [4 /*yield*/, _e.apply(void 0, [_p.sent()]).to.be.eq("0x" + "".padStart(64, "0"))];
                            case 8:
                                // Check guard
                                _p.sent();
                                _f = chai_1.expect;
                                return [4 /*yield*/, mock.callStatic.invocationCount()];
                            case 9:
                                _f.apply(void 0, [_p.sent()]).to.be.eq(2);
                                return [4 /*yield*/, hardhat_1.default.ethers.getContractAt("Guard", mock.address)];
                            case 10:
                                guardInterface = (_p.sent()).interface;
                                checkTxData = guardInterface.encodeFunctionData("checkTransaction", [
                                    safeTx.to,
                                    safeTx.value,
                                    safeTx.data,
                                    safeTx.operation,
                                    safeTx.safeTxGas,
                                    safeTx.baseGas,
                                    safeTx.gasPrice,
                                    safeTx.gasToken,
                                    safeTx.refundReceiver,
                                    signatureBytes,
                                    user1.address,
                                ]);
                                _g = chai_1.expect;
                                return [4 /*yield*/, mock.callStatic.invocationCountForCalldata(checkTxData)];
                            case 11:
                                _g.apply(void 0, [_p.sent()]).to.be.eq(1);
                                _j = (_h = guardInterface).encodeFunctionData;
                                _k = ["checkAfterExecution"];
                                _l = execution_1.calculateSafeTransactionHash;
                                _m = [safe, safeTx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 12:
                                checkExecData = _j.apply(_h, _k.concat([[
                                        _l.apply(void 0, _m.concat([_p.sent()])),
                                        true
                                    ]]));
                                _o = chai_1.expect;
                                return [4 /*yield*/, mock.callStatic.invocationCountForCalldata(checkExecData)];
                            case 13:
                                _o.apply(void 0, [_p.sent()]).to.be.eq(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
        describe("execTransaction", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("reverts if the pre hook of the guard reverts", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, mock, safeTx, signature, signatureBytes, guardInterface, checkTxData, checkExecData, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0: return [4 /*yield*/, setupWithTemplate()];
                            case 1:
                                _a = _l.sent(), safe = _a.safe, mock = _a.mock;
                                safeTx = (0, execution_1.buildSafeTransaction)({ to: mock.address, data: "0xbaddad42", nonce: 1 });
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user2, safe, safeTx)];
                            case 2:
                                signature = _l.sent();
                                signatureBytes = (0, execution_1.buildSignatureBytes)([signature]);
                                return [4 /*yield*/, hardhat_1.default.ethers.getContractAt("Guard", mock.address)];
                            case 3:
                                guardInterface = (_l.sent()).interface;
                                checkTxData = guardInterface.encodeFunctionData("checkTransaction", [
                                    safeTx.to,
                                    safeTx.value,
                                    safeTx.data,
                                    safeTx.operation,
                                    safeTx.safeTxGas,
                                    safeTx.baseGas,
                                    safeTx.gasPrice,
                                    safeTx.gasToken,
                                    safeTx.refundReceiver,
                                    signatureBytes,
                                    user1.address,
                                ]);
                                return [4 /*yield*/, mock.givenCalldataRevertWithMessage(checkTxData, "Computer says Nah")];
                            case 4:
                                _l.sent();
                                _c = (_b = guardInterface).encodeFunctionData;
                                _d = ["checkAfterExecution"];
                                _e = execution_1.calculateSafeTransactionHash;
                                _f = [safe, safeTx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 5:
                                checkExecData = _c.apply(_b, _d.concat([[
                                        _e.apply(void 0, _f.concat([_l.sent()])),
                                        true
                                    ]]));
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeTx)(safe, safeTx, [signature])).to.be.revertedWith("Computer says Nah")];
                            case 6:
                                _l.sent();
                                return [4 /*yield*/, mock.reset()];
                            case 7:
                                _l.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeTx)(safe, safeTx, [signature])).to.emit(safe, "ExecutionSuccess")];
                            case 8:
                                _l.sent();
                                _g = chai_1.expect;
                                return [4 /*yield*/, mock.callStatic.invocationCount()];
                            case 9:
                                _g.apply(void 0, [_l.sent()]).to.be.deep.equals(ethers_1.BigNumber.from(3));
                                _h = chai_1.expect;
                                return [4 /*yield*/, mock.callStatic.invocationCountForCalldata(checkTxData)];
                            case 10:
                                _h.apply(void 0, [_l.sent()]).to.be.deep.equals(ethers_1.BigNumber.from(1));
                                _j = chai_1.expect;
                                return [4 /*yield*/, mock.callStatic.invocationCountForCalldata(checkExecData)];
                            case 11:
                                _j.apply(void 0, [_l.sent()]).to.be.deep.equals(ethers_1.BigNumber.from(1));
                                _k = chai_1.expect;
                                return [4 /*yield*/, mock.callStatic.invocationCountForCalldata("0xbaddad42")];
                            case 12:
                                _k.apply(void 0, [_l.sent()]).to.be.deep.equals(ethers_1.BigNumber.from(1));
                                return [2 /*return*/];
                        }
                    });
                }); });
                it("reverts if the post hook of the guard reverts", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, safe, mock, safeTx, signature, signatureBytes, guardInterface, checkTxData, checkExecData, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0: return [4 /*yield*/, setupWithTemplate()];
                            case 1:
                                _a = _l.sent(), safe = _a.safe, mock = _a.mock;
                                safeTx = (0, execution_1.buildSafeTransaction)({ to: mock.address, data: "0xbaddad42", nonce: 1 });
                                return [4 /*yield*/, (0, execution_1.safeApproveHash)(user2, safe, safeTx)];
                            case 2:
                                signature = _l.sent();
                                signatureBytes = (0, execution_1.buildSignatureBytes)([signature]);
                                return [4 /*yield*/, hardhat_1.default.ethers.getContractAt("Guard", mock.address)];
                            case 3:
                                guardInterface = (_l.sent()).interface;
                                checkTxData = guardInterface.encodeFunctionData("checkTransaction", [
                                    safeTx.to,
                                    safeTx.value,
                                    safeTx.data,
                                    safeTx.operation,
                                    safeTx.safeTxGas,
                                    safeTx.baseGas,
                                    safeTx.gasPrice,
                                    safeTx.gasToken,
                                    safeTx.refundReceiver,
                                    signatureBytes,
                                    user1.address,
                                ]);
                                _c = (_b = guardInterface).encodeFunctionData;
                                _d = ["checkAfterExecution"];
                                _e = execution_1.calculateSafeTransactionHash;
                                _f = [safe, safeTx];
                                return [4 /*yield*/, (0, encoding_1.chainId)()];
                            case 4:
                                checkExecData = _c.apply(_b, _d.concat([[
                                        _e.apply(void 0, _f.concat([_l.sent()])),
                                        true
                                    ]]));
                                return [4 /*yield*/, mock.givenCalldataRevertWithMessage(checkExecData, "Computer says Nah")];
                            case 5:
                                _l.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeTx)(safe, safeTx, [signature])).to.be.revertedWith("Computer says Nah")];
                            case 6:
                                _l.sent();
                                return [4 /*yield*/, mock.reset()];
                            case 7:
                                _l.sent();
                                return [4 /*yield*/, (0, chai_1.expect)((0, execution_1.executeTx)(safe, safeTx, [signature])).to.emit(safe, "ExecutionSuccess")];
                            case 8:
                                _l.sent();
                                _g = chai_1.expect;
                                return [4 /*yield*/, mock.callStatic.invocationCount()];
                            case 9:
                                _g.apply(void 0, [_l.sent()]).to.be.deep.equals(ethers_1.BigNumber.from(3));
                                _h = chai_1.expect;
                                return [4 /*yield*/, mock.callStatic.invocationCountForCalldata(checkTxData)];
                            case 10:
                                _h.apply(void 0, [_l.sent()]).to.be.deep.equals(ethers_1.BigNumber.from(1));
                                _j = chai_1.expect;
                                return [4 /*yield*/, mock.callStatic.invocationCountForCalldata(checkExecData)];
                            case 11:
                                _j.apply(void 0, [_l.sent()]).to.be.deep.equals(ethers_1.BigNumber.from(1));
                                _k = chai_1.expect;
                                return [4 /*yield*/, mock.callStatic.invocationCountForCalldata("0xbaddad42")];
                            case 12:
                                _k.apply(void 0, [_l.sent()]).to.be.deep.equals(ethers_1.BigNumber.from(1));
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
