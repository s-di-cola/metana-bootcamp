import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

// Load the proof from the file
const tree = StandardMerkleTree.load(
  JSON.parse(fs.readFileSync("tree.json", "utf-8")),
);

// Get the proof for the token with index 1
for (const [i, v] of tree.entries()) {
  if (v[0] === "0x17F6AD8Ef982297579C203069C1DbfFE4348c372") {
    const proof = tree.getProof(i);
    console.log(
      `Proof for token with index ${i}, address ${v[0]} and value ${v[1]}:`,
    );
    console.log(JSON.stringify(proof));
  }
}
