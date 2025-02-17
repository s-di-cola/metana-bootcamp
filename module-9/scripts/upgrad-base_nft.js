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
function upgradeBaseNFT() {
    return __awaiter(this, void 0, void 0, function* () {
        const baseNFTV2 = yield hardhat_1.ethers.getContractFactory("BaseERC721V2");
        const proxy = yield hardhat_1.upgrades.upgradeProxy("0x247b1c3e3D1386adafbE7B94109D33307f64768C", baseNFTV2);
        yield proxy.waitForDeployment();
        console.log("BaseNFT Proxy upgraded to:", yield proxy.getAddress());
    });
}
upgradeBaseNFT()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
