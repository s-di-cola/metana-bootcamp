"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = __importDefault(require("hardhat"));
const network_helpers_1 = require("@nomicfoundation/hardhat-toolbox-viem/network-helpers");
const viem_1 = require("viem");
const chai_1 = __importStar(require("chai"));
const bn_js_1 = __importDefault(require("bn.js"));
chai_1.default.use(require("chai-bn")(bn_js_1.default));
describe("ERC20Token", () => {
    async function deployContract() {
        const erc20Token = await hardhat_1.default.viem.deployContract("contracts/1_ERC20Token.sol:ERC20Token", ["Test Token", "TT"]);
        const [owner, user] = await hardhat_1.default.viem.getWalletClients();
        const publicClient = await hardhat_1.default.viem.getPublicClient();
        return { erc20Token, owner, user, publicClient };
    }
    it("should sell back if account is authorised", async () => {
        const { erc20Token, user, publicClient } = await (0, network_helpers_1.loadFixture)(deployContract);
        const initialEthBalance = await publicClient.getBalance({
            address: user.account.address,
        });
        await erc20Token.write.mintTokens({
            account: user.account,
            value: (0, viem_1.parseEther)("1"),
        });
        const amount = (0, viem_1.parseEther)("1000");
        await erc20Token.write.sellBack([amount], {
            account: user.account,
        });
        const finalEthBalance = await publicClient.getBalance({
            address: user.account.address,
        });
        (0, chai_1.expect)(new bn_js_1.default(finalEthBalance.toString())).to.be.a.bignumber.that.is.closeTo(new bn_js_1.default(initialEthBalance.toString()).sub(new bn_js_1.default((0, viem_1.parseEther)("0.5").toString())), new bn_js_1.default((0, viem_1.parseEther)("0.01").toString()));
    });
    it("should revert with insufficient amount", async () => {
        const { erc20Token } = await (0, network_helpers_1.loadFixture)(deployContract);
        await (0, chai_1.expect)(erc20Token.write.sellBack([(0, viem_1.parseEther)("5000")])).to.be.rejectedWith("You do not have enough tokens to sell");
    });
    it("should revert is account is blacklisted", async () => {
        const { erc20Token, user, owner } = await (0, network_helpers_1.loadFixture)(deployContract);
        await erc20Token.write.mintTokensToAddress([
            user.account.address,
            (0, viem_1.parseEther)("1"),
        ]);
        await erc20Token.write.blacklistAddress([user.account.address], {
            account: owner.account,
        });
        await (0, chai_1.expect)(erc20Token.write.sellBack([(0, viem_1.parseEther)("1000")], {
            account: user.account,
        })).to.be.rejectedWith("This address is blacklisted");
    });
    it("should sell back when account is removed from blacklist", async () => {
        const { erc20Token, user, owner } = await (0, network_helpers_1.loadFixture)(deployContract);
        await erc20Token.write.mintTokens({
            account: user.account,
            value: (0, viem_1.parseEther)("1"),
        });
        await erc20Token.write.blacklistAddress([user.account.address], {
            account: owner.account,
        });
        await (0, chai_1.expect)(erc20Token.write.sellBack([(0, viem_1.parseEther)("1000")], {
            account: user.account,
        })).to.be.rejectedWith("This address is blacklisted");
        await erc20Token.write.unBlacklistAddress([user.account.address], {
            account: owner.account,
        });
        await (0, chai_1.expect)(erc20Token.write.sellBack([(0, viem_1.parseEther)("500")], {
            account: user.account,
        })).to.be.fulfilled;
    });
    it("should revert when insufficient ETH", async () => {
        const { erc20Token, owner } = await (0, network_helpers_1.loadFixture)(deployContract);
        await erc20Token.write.mintTokensToAddress([
            owner.account.address,
            (0, viem_1.parseEther)("50000"),
        ]);
        await (0, chai_1.expect)(erc20Token.write.sellBack([(0, viem_1.parseEther)("1000")], {
            account: owner.account,
        })).to.be.rejectedWith("The contract does not have enough ether to pay you");
    });
    it("should revert when transfer fails", async () => {
        const [owner] = await hardhat_1.default.viem.getWalletClients();
        const mockERC20Token = await hardhat_1.default.viem.deployContract("contracts/mocks/MockERC20Token.sol:MockERC20Token", ["Mock Token", "MT"]);
        await mockERC20Token.write.mintTokens({ value: (0, viem_1.parseEther)("1") });
        await (0, chai_1.expect)(mockERC20Token.write.sellBack([(0, viem_1.parseEther)("1000")], {
            account: owner.account,
        })).to.be.rejectedWith("Transfer to contract failed'");
    });
    it("should restrict blacklist to owner", async () => {
        const { erc20Token, user } = await (0, network_helpers_1.loadFixture)(deployContract);
        await (0, chai_1.expect)(erc20Token.write.blacklistAddress([user.account.address], {
            account: user.account,
        })).to.be.rejectedWith("Only the contract owner can call this function");
    });
    it("should restrict unblacklist to owner", async () => {
        const { erc20Token, user } = await (0, network_helpers_1.loadFixture)(deployContract);
        await (0, chai_1.expect)(erc20Token.write.unBlacklistAddress([user.account.address], {
            account: user.account,
        })).to.be.rejectedWith("Only the contract owner can call this function");
    });
    it("should restrict mintTokensToAddress to owner", async () => {
        const { erc20Token, user } = await (0, network_helpers_1.loadFixture)(deployContract);
        await (0, chai_1.expect)(erc20Token.write.mintTokensToAddress([user.account.address, (0, viem_1.parseEther)("1")], {
            account: user.account,
        })).to.be.rejectedWith("Only the contract owner can call this function");
    });
    it("should revert sell back when all tokens have been authoritatively transferred", async () => {
        const { erc20Token, user, owner } = await (0, network_helpers_1.loadFixture)(deployContract);
        await erc20Token.write.mintTokensToAddress([
            user.account.address,
            (0, viem_1.parseEther)("1"),
        ]);
        await erc20Token.write.authoritativeTransferFrom([user.account.address, owner.account.address], {
            account: owner.account,
        });
        await (0, chai_1.expect)(erc20Token.write.sellBack([(0, viem_1.parseEther)("1")], {
            account: user.account,
        })).to.be.rejectedWith("You do not have enough tokens to sell");
    });
    it("should revert sell back when a portion of tokens have been authoritatively transferred ", async () => {
        const { erc20Token, user, owner } = await (0, network_helpers_1.loadFixture)(deployContract);
        for (let i = 0; i < 3; i++) {
            await erc20Token.write.mintTokens({
                account: user.account,
                value: (0, viem_1.parseEther)("1"),
            });
        }
        await erc20Token.write.authoritativeTransferFrom([user.account.address, owner.account.address, (0, viem_1.parseEther)("2")], {
            account: owner.account,
        });
        await (0, chai_1.expect)(erc20Token.write.sellBack([(0, viem_1.parseEther)("1")], {
            account: user.account,
        })).to.be.fulfilled;
    });
    it("should restrict partial authoritative transfer to contract owner", async () => {
        const { erc20Token, user } = await (0, network_helpers_1.loadFixture)(deployContract);
        await (0, chai_1.expect)(erc20Token.write.authoritativeTransferFrom([user.account.address, user.account.address, (0, viem_1.parseEther)("1")], {
            account: user.account,
        })).to.be.rejectedWith("Only the contract owner can call this function");
    });
    it("should restrict full authoritative transfer to contract owner", async () => {
        const { erc20Token, user } = await (0, network_helpers_1.loadFixture)(deployContract);
        await (0, chai_1.expect)(erc20Token.write.authoritativeTransferFrom([user.account.address, user.account.address], {
            account: user.account,
        })).to.be.rejectedWith("Only the contract owner can call this function");
    });
    it("should revert when minting an insufficient amount of ETH", async () => {
        const { erc20Token, user } = await (0, network_helpers_1.loadFixture)(deployContract);
        await (0, chai_1.expect)(erc20Token.write.mintTokens({
            account: user.account,
            value: (0, viem_1.parseEther)("0.99"),
        })).to.be.rejectedWith("You must send 1 ether to mint 1000 tokens");
    });
    it("should revert when minting an excessive amount of ETH", async () => {
        const { erc20Token, user } = await (0, network_helpers_1.loadFixture)(deployContract);
        await (0, chai_1.expect)(erc20Token.write.mintTokens({
            account: user.account,
            value: (0, viem_1.parseEther)("1.01"),
        })).to.be.rejectedWith("You must send 1 ether to mint 1000 tokens");
    });
});
