"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const merkle_tree_1 = __importDefault(require("./merkle-tree"));
const ethers_1 = require("ethers");
const ethereumjs_util_1 = require("ethereumjs-util");
const encoder = ethers_1.ethers.utils.defaultAbiCoder;
const num_leaves = process.argv[2];
const encoded_leaves = process.argv[3];
const decoded_data = encoder.decode([`bytes32[${num_leaves}]`], encoded_leaves)[0];
var dataAsBuffer = decoded_data.map(b => (0, ethereumjs_util_1.toBuffer)(b));
const tree = new merkle_tree_1.default(dataAsBuffer);
process.stdout.write(ethers_1.ethers.utils.defaultAbiCoder.encode(['bytes32'], [tree.getRoot()]));
