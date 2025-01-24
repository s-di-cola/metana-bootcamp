"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContractStorageLayout = void 0;
const fs_1 = __importDefault(require("fs"));
const getContractStorageLayout = async (hre, smartContractName) => {
    var _a, _b, _c, _d;
    const { sourceName, contractName } = await hre.artifacts.readArtifact(smartContractName);
    const stateVariables = [];
    for (const artifactPath of await hre.artifacts.getBuildInfoPaths()) {
        const artifact = fs_1.default.readFileSync(artifactPath);
        const artifactJsonABI = JSON.parse(artifact.toString());
        const artifactIncludesStorageLayout = (_d = (_c = (_b = (_a = artifactJsonABI === null || artifactJsonABI === void 0 ? void 0 : artifactJsonABI.output) === null || _a === void 0 ? void 0 : _a.contracts) === null || _b === void 0 ? void 0 : _b[sourceName]) === null || _c === void 0 ? void 0 : _c[contractName]) === null || _d === void 0 ? void 0 : _d.storageLayout;
        if (!artifactIncludesStorageLayout) {
            continue;
        }
        const contractStateVariablesFromArtifact = artifactJsonABI.output.contracts[sourceName][contractName].storageLayout.storage;
        for (const stateVariable of contractStateVariablesFromArtifact) {
            stateVariables.push({
                name: stateVariable.label,
                slot: stateVariable.slot,
                offset: stateVariable.offset,
                type: stateVariable.type,
            });
        }
        // The same contract can be present in multiple artifacts; thus we break if we already got
        // storage layout once
        break;
    }
    return stateVariables;
};
exports.getContractStorageLayout = getContractStorageLayout;
