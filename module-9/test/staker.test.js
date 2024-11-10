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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const chai_1 = __importDefault(require("chai"));
const bn_js_1 = __importDefault(require("bn.js"));
const chaiBN = require("chai-bn")(bn_js_1.default);
chai_1.default.use(chaiBN);
const { expect } = chai_1.default;
describe("Staker", () => {
    let stacker;
    let erc20Token;
    let erc721Token;
    let proxy;
    let signer;
    let currentAddr;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        [signer] = yield hardhat_1.ethers.getSigners();
        currentAddr = yield signer.getAddress();
        stacker = yield hardhat_1.ethers.getContractFactory("Staker");
        const erc20TokenFactory = yield hardhat_1.ethers.getContractFactory("S_ERC20Token");
        const erc721TokenFactory = yield hardhat_1.ethers.getContractFactory("S_ERC721Token");
        erc20Token = yield erc20TokenFactory.deploy();
        yield erc20Token.waitForDeployment();
        const erc20TokenAddress = yield erc20Token.getAddress();
        erc721Token = yield erc721TokenFactory.deploy(100, 100000, erc20TokenAddress);
        yield erc721Token.waitForDeployment();
        const erc721TokenAddress = yield erc721Token.getAddress();
        proxy = yield hardhat_1.upgrades.deployProxy(stacker, [erc20TokenAddress, erc721TokenAddress], {
            kind: "uups",
            initializer: "initialize",
        });
        yield proxy.waitForDeployment();
        yield erc20Token.setStaker(yield proxy.getAddress());
    }));
    it("should deploy initial version", () => __awaiter(void 0, void 0, void 0, function* () {
        const tokenId = 1;
        const stakedNFT = yield proxy.stakedNFTs(tokenId, currentAddr);
        expect(stakedNFT.stakingTimestamp).to.equal(0);
        expect(stakedNFT.lastRewardClaimTimestamp).to.equal(0);
    }));
    it("should upgrade to V2 and use new multiplier feature", () => __awaiter(void 0, void 0, void 0, function* () {
        const tokenId = 1;
        const nftPrice = yield erc721Token.NFT_PRICE();
        yield erc20Token.approve(yield erc721Token.getAddress(), nftPrice);
        yield erc721Token.mint(tokenId);
        yield erc721Token.approve(yield proxy.getAddress(), tokenId);
        yield proxy.stakeNFT(tokenId);
        const stakedNFTv1 = yield proxy.stakedNFTs(tokenId, currentAddr);
        expect(stakedNFTv1.stakingTimestamp).to.not.equal(0);
        expect(stakedNFTv1.lastRewardClaimTimestamp).to.not.equal(0);
        const StakerV2 = yield hardhat_1.ethers.getContractFactory("StakerV2");
        const proxyV2 = yield hardhat_1.upgrades.upgradeProxy(yield proxy.getAddress(), StakerV2, {
            kind: "uups",
            call: {
                fn: "initialize",
                args: [yield erc20Token.getAddress(), yield erc721Token.getAddress()],
            },
        });
        expect(yield proxyV2.rewardMultiplier()).to.equal(1);
        const stakedNFTv2 = yield proxyV2.stakedNFTs(tokenId, currentAddr);
        expect(stakedNFTv2.stakingTimestamp).to.equal(stakedNFTv1.stakingTimestamp);
        expect(stakedNFTv2.lastRewardClaimTimestamp).to.equal(stakedNFTv1.lastRewardClaimTimestamp);
        yield proxyV2.setRewardMultiplier(2);
        expect(yield proxyV2.rewardMultiplier()).to.equal(2);
        yield hardhat_1.ethers.provider.send("evm_increaseTime", [86400]);
        yield hardhat_1.ethers.provider.send("evm_mine", []);
        const balanceBefore = yield erc20Token.balanceOf(currentAddr);
        yield proxyV2.withdrawReward();
        const balanceAfter = yield erc20Token.balanceOf(currentAddr);
        const rewardAmount = balanceAfter - balanceBefore;
        const expectedReward = new bn_js_1.default("20000000000000000000000000000000000000"); // 20 * 10^21
        const actualReward = new bn_js_1.default(rewardAmount.toString());
        expect(actualReward).to.be.bignumber.equal(expectedReward);
    }));
});
