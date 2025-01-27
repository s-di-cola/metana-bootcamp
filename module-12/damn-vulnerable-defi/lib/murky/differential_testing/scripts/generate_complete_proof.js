"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const merkle_tree_1 = require("@openzeppelin/merkle-tree");
const ethers_1 = require("ethers");
const fs = require('fs');
const input_file = process.argv[2];
const input = JSON.parse(fs.readFileSync(input_file, 'utf8'));
const one_word = "0x0000000000000000000000000000000000000000000000000000000000000001";
const leafs = input['leafs'].map((bytes32) => [bytes32, one_word]);
const indexToProve = input['index'];
const tree = merkle_tree_1.StandardMerkleTree.of(leafs, ["bytes32", "bytes32"], { sortLeaves: false }); // NO DEFAULT SORTING LEAVES
const proof = tree.getProof(indexToProve);
process.stdout.write(ethers_1.ethers.utils.defaultAbiCoder.encode(['bytes32[]'], [proof]));
