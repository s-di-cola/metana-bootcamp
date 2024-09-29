// scripts/mineBlocks.ts
import { network } from "hardhat";

async function main() {
    while (true) {
        await network.provider.send("evm_increaseTime", [1]); // Increase time by 1 second
        await network.provider.send("evm_mine"); // Mine a new block
        console.log("Mined a new block");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
    }
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
