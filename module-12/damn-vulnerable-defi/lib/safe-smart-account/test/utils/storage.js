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
exports.getContractStorageLayout = void 0;
var fs_1 = require("fs");
var getContractStorageLayout = function (hre, smartContractName) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, sourceName, contractName, stateVariables, _i, _b, artifactPath, artifact, artifactJsonABI, artifactIncludesStorageLayout, contractStateVariablesFromArtifact, _c, contractStateVariablesFromArtifact_1, stateVariable;
    var _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, hre.artifacts.readArtifact(smartContractName)];
            case 1:
                _a = _h.sent(), sourceName = _a.sourceName, contractName = _a.contractName;
                stateVariables = [];
                _i = 0;
                return [4 /*yield*/, hre.artifacts.getBuildInfoPaths()];
            case 2:
                _b = _h.sent();
                _h.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 5];
                artifactPath = _b[_i];
                artifact = fs_1.default.readFileSync(artifactPath);
                artifactJsonABI = JSON.parse(artifact.toString());
                artifactIncludesStorageLayout = (_g = (_f = (_e = (_d = artifactJsonABI === null || artifactJsonABI === void 0 ? void 0 : artifactJsonABI.output) === null || _d === void 0 ? void 0 : _d.contracts) === null || _e === void 0 ? void 0 : _e[sourceName]) === null || _f === void 0 ? void 0 : _f[contractName]) === null || _g === void 0 ? void 0 : _g.storageLayout;
                if (!artifactIncludesStorageLayout) {
                    return [3 /*break*/, 4];
                }
                contractStateVariablesFromArtifact = artifactJsonABI.output.contracts[sourceName][contractName].storageLayout.storage;
                for (_c = 0, contractStateVariablesFromArtifact_1 = contractStateVariablesFromArtifact; _c < contractStateVariablesFromArtifact_1.length; _c++) {
                    stateVariable = contractStateVariablesFromArtifact_1[_c];
                    stateVariables.push({
                        name: stateVariable.label,
                        slot: stateVariable.slot,
                        offset: stateVariable.offset,
                        type: stateVariable.type,
                    });
                }
                // The same contract can be present in multiple artifacts; thus we break if we already got
                // storage layout once
                return [3 /*break*/, 5];
            case 4:
                _i++;
                return [3 /*break*/, 3];
            case 5: return [2 /*return*/, stateVariables];
        }
    });
}); };
exports.getContractStorageLayout = getContractStorageLayout;
