import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { writeFileSync } from "fs";

const leafs = [
  ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 0],
  ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", 1],
  ["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", 2],
  ["0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB", 3],
  ["0x617F2E2fD72FD9D5503197092aC168c91465E7f2", 4],
];

const tree = StandardMerkleTree.of(leafs, ["address", "uint256"]);
writeFileSync("root.txt", tree.root);
writeFileSync("tree.json", JSON.stringify(tree.dump()));
