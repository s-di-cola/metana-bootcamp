"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
async function main() {
    while (true) {
        await hardhat_1.network.provider.send("evm_increaseTime", [1]); // Increase time by 1 second
        await hardhat_1.network.provider.send("evm_mine"); // Mine a new block
        console.log("Mined a new block");
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    }
}
main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
