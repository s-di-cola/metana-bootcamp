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
describe("ERC20 Upgrade", () => {
    it("should deploy initial version", () => __awaiter(void 0, void 0, void 0, function* () {
        const erc20V1 = yield hardhat_1.ethers.getContractFactory("ERC20Exchange");
        const proxy = yield hardhat_1.upgrades.deployProxy(erc20V1, ["TestToken", "TEX"]);
        yield proxy.waitForDeployment();
        (0, chai_1.expect)(yield proxy.name()).to.equal("TestToken");
        (0, chai_1.expect)(yield proxy.symbol()).to.equal("TEX");
    }));
    it("should upgrade to V2", () => __awaiter(void 0, void 0, void 0, function* () {
        const erc20V1 = yield hardhat_1.ethers.getContractFactory("ERC20Exchange");
        const erc20v2 = yield hardhat_1.ethers.getContractFactory("ERC20ExchangeV2");
        const proxy = yield hardhat_1.upgrades.deployProxy(erc20V1, ["TestToken", "TEX"]);
        yield proxy.waitForDeployment();
        const proxyAddress = yield proxy.getAddress();
        const upgradedProxy = yield hardhat_1.upgrades.upgradeProxy(proxyAddress, erc20v2);
        yield upgradedProxy.waitForDeployment();
        yield upgradedProxy.initializeV2();
        (0, chai_1.expect)(yield upgradedProxy.exchangeRate()).to.equal(100);
    }));
    it("should fail when trying to initialize V1 again after upgrade", () => __awaiter(void 0, void 0, void 0, function* () {
        const erc20V1 = yield hardhat_1.ethers.getContractFactory("ERC20Exchange");
        const erc20v2 = yield hardhat_1.ethers.getContractFactory("ERC20ExchangeV2");
        const proxy = yield hardhat_1.upgrades.deployProxy(erc20V1, ["TestToken", "TEX"]);
        yield proxy.waitForDeployment();
        const proxyAddress = yield proxy.getAddress();
        const upgradedProxy = yield hardhat_1.upgrades.upgradeProxy(proxyAddress, erc20v2);
        yield upgradedProxy.waitForDeployment();
        yield (0, chai_1.expect)(upgradedProxy.initialize("TestToken", "NEWTEX")).to.be
            .reverted;
    }));
});
