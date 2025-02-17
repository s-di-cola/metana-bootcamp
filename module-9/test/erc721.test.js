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
const chai_1 = require("chai");
describe("Metana OpenSea", () => {
    it("should upgrade max supply to 100", () => __awaiter(void 0, void 0, void 0, function* () {
        const MetanaNFTV1 = yield hardhat_1.ethers.getContractFactory("MetanaOpenSea");
        const MetanaNFTV2 = yield hardhat_1.ethers.getContractFactory("MetanaOpenSeaV2");
        const instance = yield hardhat_1.upgrades.deployProxy(MetanaNFTV1, ["MetanaV1"]);
        const upgraded = yield hardhat_1.upgrades.upgradeProxy(yield instance.getAddress(), MetanaNFTV2);
        const value = yield upgraded.symbol();
        (0, chai_1.expect)(value.toString()).to.equal("MetanaV1");
        const maxSupply = yield upgraded.getMaximumSupply();
        (0, chai_1.expect)(maxSupply.toString()).to.equal("100");
    }));
});
