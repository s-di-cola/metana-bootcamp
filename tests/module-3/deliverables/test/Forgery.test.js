"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = __importDefault(require("hardhat"));
const viem_1 = require("viem");
const chai_1 = require("chai");
const network_helpers_1 = require("@nomicfoundation/hardhat-toolbox-viem/network-helpers");
describe("Forgery", () => {
    let forgery;
    let testClient;
    let owner;
    let user;
    const Tokens = {
        IRON: 0,
        COPPER: 1,
        SILVER: 2,
        GOLD: 3,
        PLATINUM: 4,
        PALLADIUM: 5,
        RHODIUM: 6,
    };
    const COOLDOWN = 61; // seconds
    async function deployForgery() {
        return await hardhat_1.default.viem.deployContract("contracts/module-3/deliverables/packages/hardhat/contracts/Forgery.sol:Forgery", []);
    }
    beforeEach(async () => {
        const clients = await hardhat_1.default.viem.getWalletClients();
        [owner, user] = clients;
        forgery = await (0, network_helpers_1.loadFixture)(deployForgery);
        testClient = (await hardhat_1.default.viem.getTestClient());
        await testClient.impersonateAccount(user.account);
    });
    async function forgeBasicToken(tokenId, amount, account) {
        await forgery.write.forgeBasicToken([tokenId, (0, viem_1.parseEther)(amount)], {
            account,
        });
    }
    async function forgeCompoundToken(tokenId, amount, account) {
        await forgery.write.forgeCompoundToken([tokenId, (0, viem_1.parseEther)(amount)], {
            account,
        });
    }
    async function increaseTime() {
        await testClient.increaseTime({ seconds: COOLDOWN });
    }
    async function getBalances(account) {
        return await forgery.read.getBalances([account.address]);
    }
    it("should not forge illegal ids", async () => {
        await (0, chai_1.expect)(forgery.write.forgeBasicToken([Tokens.RHODIUM, (0, viem_1.parseEther)("1")], {
            account: owner.account,
        })).to.be.rejectedWith("Can only forge IRON, COPPER, or SILVER");
        await (0, chai_1.expect)(forgery.write.forgeCompoundToken([8, (0, viem_1.parseEther)("1")], {
            account: owner.account,
        })).to.be.rejected;
    });
    it("should enforce cooldown between forges", async () => {
        await forgeBasicToken(Tokens.IRON, "1", user.account);
        const canForgeNow = await forgery.read.canForgeNow({
            account: user.account,
        });
        (0, chai_1.expect)(canForgeNow).to.be.false;
        await (0, chai_1.expect)(forgeBasicToken(Tokens.COPPER, "1", owner.account)).to.be.rejectedWith("Can mint only once per minute");
    });
    it("should allow forging after cooldown", async () => {
        await forgeBasicToken(Tokens.IRON, "1", user.account);
        const canForgeNowBefore = await forgery.read.canForgeNow();
        (0, chai_1.expect)(canForgeNowBefore).to.be.false;
        await testClient.mine({ blocks: COOLDOWN, interval: 1 });
        const canForgeNowAfter = await forgery.read.canForgeNow();
        (0, chai_1.expect)(canForgeNowAfter).to.be.true;
    });
    it("should forge GOLD by burning IRON and COPPER", async () => {
        await forgeBasicToken(Tokens.IRON, "10", user.account);
        await increaseTime();
        await forgeBasicToken(Tokens.COPPER, "10", user.account);
        await increaseTime();
        await forgeCompoundToken(Tokens.GOLD, "5", user.account);
        const balances = await getBalances(user.account);
        (0, chai_1.expect)(balances[Tokens.IRON]).to.equal((0, viem_1.parseEther)("5"));
        (0, chai_1.expect)(balances[Tokens.COPPER]).to.equal((0, viem_1.parseEther)("5"));
        (0, chai_1.expect)(balances[Tokens.GOLD]).to.equal((0, viem_1.parseEther)("5"));
    });
    it("should not forge GOLD with insufficient balance", async () => {
        await (0, chai_1.expect)(forgeCompoundToken(Tokens.GOLD, "5", user.account)).to.be.rejectedWith("Insufficient balance");
    });
    it("should forge PLATINUM by burning COPPER and SILVER", async () => {
        await forgeBasicToken(Tokens.COPPER, "10", user.account);
        await increaseTime();
        await forgeBasicToken(Tokens.SILVER, "10", user.account);
        await increaseTime();
        await forgeCompoundToken(Tokens.PLATINUM, "5", user.account);
        const balances = await getBalances(user.account);
        (0, chai_1.expect)(balances[Tokens.COPPER]).to.equal((0, viem_1.parseEther)("5"));
        (0, chai_1.expect)(balances[Tokens.SILVER]).to.equal((0, viem_1.parseEther)("5"));
        (0, chai_1.expect)(balances[Tokens.PLATINUM]).to.equal((0, viem_1.parseEther)("5"));
    });
    it("should not forge PLATINUM with insufficient balance", async () => {
        await (0, chai_1.expect)(forgeCompoundToken(Tokens.PLATINUM, "5", user.account)).to.be.rejectedWith("Insufficient balance");
    });
    it("should forge PALLADIUM by burning IRON and SILVER", async () => {
        await forgeBasicToken(Tokens.IRON, "10", user.account);
        await increaseTime();
        await forgeBasicToken(Tokens.SILVER, "10", user.account);
        await increaseTime();
        await forgeCompoundToken(Tokens.PALLADIUM, "5", user.account);
        const balances = await getBalances(user.account);
        (0, chai_1.expect)(balances[Tokens.IRON]).to.equal((0, viem_1.parseEther)("5"));
        (0, chai_1.expect)(balances[Tokens.SILVER]).to.equal((0, viem_1.parseEther)("5"));
        (0, chai_1.expect)(balances[Tokens.PALLADIUM]).to.equal((0, viem_1.parseEther)("5"));
    });
    it("should not forge PALLADIUM with insufficient balance", async () => {
        await (0, chai_1.expect)(forgeCompoundToken(Tokens.PALLADIUM, "5", user.account)).to.be.rejectedWith("Insufficient balance");
    });
    it("should forge RHODIUM by burning IRON, COPPER, and SILVER", async () => {
        await forgeBasicToken(Tokens.IRON, "10", user.account);
        await increaseTime();
        await forgeBasicToken(Tokens.COPPER, "10", user.account);
        await increaseTime();
        await forgeBasicToken(Tokens.SILVER, "10", user.account);
        await increaseTime();
        await forgeCompoundToken(Tokens.RHODIUM, "5", user.account);
        const balances = await getBalances(user.account);
        (0, chai_1.expect)(balances[Tokens.IRON]).to.equal((0, viem_1.parseEther)("5"));
        (0, chai_1.expect)(balances[Tokens.COPPER]).to.equal((0, viem_1.parseEther)("5"));
        (0, chai_1.expect)(balances[Tokens.SILVER]).to.equal((0, viem_1.parseEther)("5"));
        (0, chai_1.expect)(balances[Tokens.RHODIUM]).to.equal((0, viem_1.parseEther)("5"));
    });
    it("should not forge RHODIUM with insufficient balance", async () => {
        await (0, chai_1.expect)(forgeCompoundToken(Tokens.RHODIUM, "5", user.account)).to.be.rejectedWith("Insufficient balance");
    });
    it("should trade compound tokens for basic tokens", async () => {
        await forgeBasicToken(Tokens.IRON, "50", user.account);
        await increaseTime();
        await forgeBasicToken(Tokens.COPPER, "20", user.account);
        await increaseTime();
        await forgeBasicToken(Tokens.SILVER, "60", user.account);
        await increaseTime();
        await forgeCompoundToken(Tokens.PALLADIUM, "30", user.account);
        await increaseTime();
        await forgery.write.trade([Tokens.PALLADIUM, Tokens.COPPER, (0, viem_1.parseEther)("30")], {
            account: user.account,
        });
        const balances = await getBalances(user.account);
        (0, chai_1.expect)(balances[Tokens.COPPER]).to.equal((0, viem_1.parseEther)("50"));
        (0, chai_1.expect)(balances[Tokens.PALLADIUM]).to.equal((0, viem_1.parseEther)("0"));
    });
    it("should not trade with insufficient balance", async () => {
        await (0, chai_1.expect)(forgery.write.trade([Tokens.PALLADIUM, Tokens.COPPER, (0, viem_1.parseEther)("30")], {
            account: user.account,
        })).to.be.rejectedWith("Insufficient balance");
    });
});
