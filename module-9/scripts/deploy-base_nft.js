"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
function deploy() {
    return __awaiter(this, void 0, void 0, function* () {
        const BaseNFT = yield hardhat_1.ethers.getContractFactory("BaseERC721");
        const proxy = yield hardhat_1.upgrades.deployProxy(BaseNFT, ["UNIQUEX", "UNQ"], {
            initializer: "initialize",
        });
        yield proxy.waitForDeployment();
        const proxyAddress = yield proxy.getAddress();
        console.log("BaseNFT proxy deployed to:", proxyAddress);
        // If you want to get the implementation address:
        const implementationAddress = yield hardhat_1.upgrades.erc1967.getImplementationAddress(proxyAddress);
        console.log("Implementation address:", implementationAddress);
    });
}
deploy().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
