"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
async function main() {
    const Box = await hardhat_1.viem.deployContract("Box", [42]);
    hardhat_1.upgrades.deployProxy(Box, [42]);
    console.log("Box deployed to:", Box.address);
}
