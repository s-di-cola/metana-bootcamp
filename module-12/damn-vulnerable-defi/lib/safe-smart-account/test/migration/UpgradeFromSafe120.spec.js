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
var constants_1 = require("@ethersproject/constants");
var setup_1 = require("../utils/setup");
var execution_1 = require("../../src/utils/execution");
var subTests_spec_1 = require("./subTests.spec");
var safeDeployment_json_1 = require("../json/safeDeployment.json");
var proxies_1 = require("../../src/utils/proxies");
describe("Upgrade from Safe 1.2.0", function () {
    var user1 = hardhat_1.waffle.provider.getWallets()[0];
    var ChangeMasterCopyInterface = new hardhat_1.ethers.utils.Interface(["function changeMasterCopy(address target)"]);
    // We migrate the Safe and run the verification tests
    var setupTests = hardhat_1.deployments.createFixture(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var mock, singleton120, singleton140, factory, saltNonce, proxyAddress, Safe, safe, _c, nonce, data, tx, _d, _e, _f;
        var _g;
        var deployments = _b.deployments;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, deployments.fixture()];
                case 1:
                    _h.sent();
                    return [4 /*yield*/, (0, setup_1.getMock)()];
                case 2:
                    mock = _h.sent();
                    return [4 /*yield*/, user1.sendTransaction({ data: safeDeployment_json_1.default.safe120 })];
                case 3: return [4 /*yield*/, (_h.sent()).wait()];
                case 4:
                    singleton120 = (_h.sent()).contractAddress;
                    return [4 /*yield*/, (0, setup_1.getSafeSingleton)()];
                case 5:
                    singleton140 = (_h.sent()).address;
                    return [4 /*yield*/, (0, setup_1.getFactory)()];
                case 6:
                    factory = _h.sent();
                    saltNonce = 42;
                    return [4 /*yield*/, (0, proxies_1.calculateProxyAddress)(factory, singleton120, "0x", saltNonce)];
                case 7:
                    proxyAddress = _h.sent();
                    return [4 /*yield*/, factory.createProxyWithNonce(singleton120, "0x", saltNonce).then(function (tx) { return tx.wait(); })];
                case 8:
                    _h.sent();
                    return [4 /*yield*/, hardhat_1.default.ethers.getContractFactory("Safe")];
                case 9:
                    Safe = _h.sent();
                    safe = Safe.attach(proxyAddress);
                    return [4 /*yield*/, safe.setup([user1.address], 1, constants_1.AddressZero, "0x", mock.address, constants_1.AddressZero, 0, constants_1.AddressZero)];
                case 10:
                    _h.sent();
                    _c = chai_1.expect;
                    return [4 /*yield*/, safe.VERSION()];
                case 11:
                    _c.apply(void 0, [_h.sent()]).to.be.eq("1.2.0");
                    return [4 /*yield*/, safe.callStatic.nonce()];
                case 12:
                    nonce = _h.sent();
                    data = ChangeMasterCopyInterface.encodeFunctionData("changeMasterCopy", [singleton140]);
                    tx = (0, execution_1.buildSafeTransaction)({ to: safe.address, data: data, nonce: nonce });
                    _d = execution_1.executeTx;
                    _e = [safe, tx];
                    return [4 /*yield*/, (0, execution_1.safeApproveHash)(user1, safe, tx, true)];
                case 13: return [4 /*yield*/, _d.apply(void 0, _e.concat([[_h.sent()]]))];
                case 14:
                    _h.sent();
                    _f = chai_1.expect;
                    return [4 /*yield*/, safe.VERSION()];
                case 15:
                    _f.apply(void 0, [_h.sent()]).to.be.eq("1.4.1");
                    _g = {
                        migratedSafe: safe,
                        mock: mock
                    };
                    return [4 /*yield*/, (0, setup_1.getMultiSend)()];
                case 16: return [2 /*return*/, (_g.multiSend = _h.sent(),
                        _g)];
            }
        });
    }); });
    (0, subTests_spec_1.verificationTests)(setupTests);
});
