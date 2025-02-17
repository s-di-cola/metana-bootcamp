"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const merkle_tree_1 = require("@openzeppelin/merkle-tree");
const fs_1 = require("fs");
const leafs = [
    ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 0],
    ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 1],
    ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", 2],
    ["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", 3],
    ["0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB", 4],
    ["0x617F2E2fD72FD9D5503197092aC168c91465E7f2", 5],
    ["0x17F6AD8Ef982297579C203069C1DbfFE4348c372", 6],
    ["0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678", 7],
    ["0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7", 8],
    ["0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C", 9],
    ["0x0A098Eda01Ce92ff4A4CCb7A4fFFb5A43EBC70DC", 10],
];
const tree = merkle_tree_1.StandardMerkleTree.of(leafs, ["address", "uint256"]);
(0, fs_1.writeFileSync)("root.txt", tree.root);
(0, fs_1.writeFileSync)("tree.json", JSON.stringify(tree.dump()));
