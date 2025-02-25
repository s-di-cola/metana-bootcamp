"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = __importDefault(require("hardhat"));
require("@nomiclabs/hardhat-ethers");
const storage_1 = require("../utils/storage");
const EXPECTED_LAYOUT = [
    { name: "singleton", slot: "0", offset: 0, type: "t_address" },
    {
        name: "modules",
        slot: "1",
        offset: 0,
        type: "t_mapping(t_address,t_address)",
    },
    {
        name: "owners",
        slot: "2",
        offset: 0,
        type: "t_mapping(t_address,t_address)",
    },
    { name: "ownerCount", slot: "3", offset: 0, type: "t_uint256" },
    { name: "threshold", slot: "4", offset: 0, type: "t_uint256" },
    { name: "nonce", slot: "5", offset: 0, type: "t_uint256" },
    {
        name: "_deprecatedDomainSeparator",
        slot: "6",
        offset: 0,
        type: "t_bytes32",
    },
    {
        name: "signedMessages",
        slot: "7",
        offset: 0,
        type: "t_mapping(t_bytes32,t_uint256)",
    },
    {
        name: "approvedHashes",
        slot: "8",
        offset: 0,
        type: "t_mapping(t_address,t_mapping(t_bytes32,t_uint256))",
    },
];
describe("SafeStorage", async () => {
    it("follows the expected storage layout", async () => {
        const safeStorageLayout = await (0, storage_1.getContractStorageLayout)(hardhat_1.default, "SafeStorage");
        (0, chai_1.expect)(safeStorageLayout).to.deep.eq(EXPECTED_LAYOUT);
    });
});
