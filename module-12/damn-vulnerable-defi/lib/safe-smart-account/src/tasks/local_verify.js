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
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");
var config_1 = require("hardhat/config");
var solc_1 = require("../utils/solc");
(0, config_1.task)("local-verify", "Verifies that the local deployment files correspond to the on chain code").setAction(function (_, hre) { return __awaiter(void 0, void 0, void 0, function () {
    var allowedSourceKey, deployedContracts, _i, _a, contract, deployment, meta, solcjs, sources, _b, sources_1, source, _c, _d, key, targets, _e, targets_1, _f, key, value, compiled, output, _g, targets_2, _h, key, value, compiledContract, onChainCode, onchainBytecodeHash, localBytecodeHash, verifySuccess;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                allowedSourceKey = ["keccak256", "content"];
                return [4 /*yield*/, hre.deployments.all()];
            case 1:
                deployedContracts = _j.sent();
                _i = 0, _a = Object.keys(deployedContracts);
                _j.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 9];
                contract = _a[_i];
                return [4 /*yield*/, hre.deployments.get(contract)];
            case 3:
                deployment = _j.sent();
                meta = JSON.parse(deployment.metadata);
                return [4 /*yield*/, (0, solc_1.loadSolc)(meta.compiler.version)];
            case 4:
                solcjs = _j.sent();
                delete meta.compiler;
                delete meta.output;
                delete meta.version;
                sources = Object.values(meta.sources);
                for (_b = 0, sources_1 = sources; _b < sources_1.length; _b++) {
                    source = sources_1[_b];
                    for (_c = 0, _d = Object.keys(source); _c < _d.length; _c++) {
                        key = _d[_c];
                        if (allowedSourceKey.indexOf(key) < 0)
                            delete source[key];
                    }
                }
                meta.settings.outputSelection = {};
                targets = Object.entries(meta.settings.compilationTarget);
                for (_e = 0, targets_1 = targets; _e < targets_1.length; _e++) {
                    _f = targets_1[_e], key = _f[0], value = _f[1];
                    meta.settings.outputSelection[key] = {};
                    meta.settings.outputSelection[key][value] = ["evm.bytecode", "evm.deployedBytecode", "metadata"];
                }
                delete meta.settings.compilationTarget;
                compiled = solcjs.compile(JSON.stringify(meta));
                output = JSON.parse(compiled);
                _g = 0, targets_2 = targets;
                _j.label = 5;
            case 5:
                if (!(_g < targets_2.length)) return [3 /*break*/, 8];
                _h = targets_2[_g], key = _h[0], value = _h[1];
                compiledContract = output.contracts[key][value];
                return [4 /*yield*/, hre.ethers.provider.getCode(deployment.address)];
            case 6:
                onChainCode = _j.sent();
                onchainBytecodeHash = hre.ethers.utils.keccak256(onChainCode);
                localBytecodeHash = hre.ethers.utils.keccak256("0x".concat(compiledContract.evm.deployedBytecode.object));
                verifySuccess = onchainBytecodeHash === localBytecodeHash ? "SUCCESS" : "FAILURE";
                console.log("Verification status for ".concat(value, ": ").concat(verifySuccess));
                _j.label = 7;
            case 7:
                _g++;
                return [3 /*break*/, 5];
            case 8:
                _i++;
                return [3 /*break*/, 2];
            case 9: return [2 /*return*/];
        }
    });
}); });
