import hre from "hardhat";
import { formatEther, parseAbi, parseEther } from "viem";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { Account, WalletClient, TestClient } from "viem";

describe("Forgery", () => {
  let forgery: any;
  let testClient: TestClient;
  let owner: WalletClientWithAccount;
  let user: WalletClientWithAccount;

  interface WalletClientWithAccount extends WalletClient {
    account: Account;
  }

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

  async function deployForgery(): Promise<any> {
    return await hre.viem.deployContract(
      "contracts/module-3/deliverables/packages/hardhat/contracts/Forgery.sol:Forgery",
      [],
    );
  }

  beforeEach(async () => {
    const clients = await hre.viem.getWalletClients();
    [owner, user] = clients as [
      WalletClientWithAccount,
      WalletClientWithAccount,
    ];

    forgery = await loadFixture(deployForgery);
    testClient = (await hre.viem.getTestClient()) as TestClient;
    await testClient.impersonateAccount(user.account);
  });

  async function forgeBasicToken(
    tokenId: number,
    amount: string,
    account: Account,
  ): Promise<void> {
    await forgery.write.forgeBasicToken([tokenId, parseEther(amount)], {
      account,
    });
  }

  async function forgeCompoundToken(
    tokenId: number,
    amount: string,
    account: Account,
  ): Promise<void> {
    await forgery.write.forgeCompoundToken([tokenId, parseEther(amount)], {
      account,
    });
  }

  async function increaseTime(): Promise<void> {
    await testClient.increaseTime({ seconds: COOLDOWN });
  }

  async function getBalances(account: Account): Promise<bigint[]> {
    return await forgery.read.getBalances([account.address]);
  }

  it("should not forge illegal ids", async () => {
    await expect(
      forgery.write.forgeBasicToken([Tokens.RHODIUM, parseEther("1")], {
        account: owner.account,
      }),
    ).to.be.rejectedWith("Can only forge IRON, COPPER, or SILVER");

    await expect(
      forgery.write.forgeCompoundToken([8, parseEther("1")], {
        account: owner.account,
      }),
    ).to.be.rejected;
  });

  it("should enforce cooldown between forges", async () => {
    await forgeBasicToken(Tokens.IRON, "1", user.account);
    const canForgeNow = await forgery.read.canForgeNow({
      account: user.account,
    });
    expect(canForgeNow).to.be.false;

    await expect(
      forgeBasicToken(Tokens.COPPER, "1", owner.account),
    ).to.be.rejectedWith("Can mint only once per minute");
  });

  it("should allow forging after cooldown", async () => {
    await forgeBasicToken(Tokens.IRON, "1", user.account);
    const canForgeNowBefore = await forgery.read.canForgeNow();
    expect(canForgeNowBefore).to.be.false;

    await testClient.mine({ blocks: COOLDOWN, interval: 1 });

    const canForgeNowAfter = await forgery.read.canForgeNow();
    expect(canForgeNowAfter).to.be.true;
  });

  it("should forge GOLD by burning IRON and COPPER", async () => {
    await forgeBasicToken(Tokens.IRON, "10", user.account);
    await increaseTime();
    await forgeBasicToken(Tokens.COPPER, "10", user.account);
    await increaseTime();

    await forgeCompoundToken(Tokens.GOLD, "5", user.account);

    const balances = await getBalances(user.account);
    expect(balances[Tokens.IRON]).to.equal(parseEther("5"));
    expect(balances[Tokens.COPPER]).to.equal(parseEther("5"));
    expect(balances[Tokens.GOLD]).to.equal(parseEther("5"));
  });

  it("should not forge basic token when forging compound tokens ", async () => {
    await expect(
      forgery.write.forgeCompoundToken([Tokens.IRON, parseEther("10")]),
    ).to.be.rejectedWith("Invalid compound token");
  });

  it("should not forge GOLD with insufficient balance", async () => {
    await expect(
      forgeCompoundToken(Tokens.GOLD, "5", user.account),
    ).to.be.rejectedWith("Insufficient balance");
  });

  it("should forge PLATINUM by burning COPPER and SILVER", async () => {
    await forgeBasicToken(Tokens.COPPER, "10", user.account);
    await increaseTime();
    await forgeBasicToken(Tokens.SILVER, "10", user.account);
    await increaseTime();

    await forgeCompoundToken(Tokens.PLATINUM, "5", user.account);

    const balances = await getBalances(user.account);
    expect(balances[Tokens.COPPER]).to.equal(parseEther("5"));
    expect(balances[Tokens.SILVER]).to.equal(parseEther("5"));
    expect(balances[Tokens.PLATINUM]).to.equal(parseEther("5"));
  });

  it("should not forge PLATINUM with insufficient balance", async () => {
    await expect(
      forgeCompoundToken(Tokens.PLATINUM, "5", user.account),
    ).to.be.rejectedWith("Insufficient balance");
  });

  it("should forge PALLADIUM by burning IRON and SILVER", async () => {
    await forgeBasicToken(Tokens.IRON, "10", user.account);
    await increaseTime();
    await forgeBasicToken(Tokens.SILVER, "10", user.account);
    await increaseTime();

    await forgeCompoundToken(Tokens.PALLADIUM, "5", user.account);

    const balances = await getBalances(user.account);
    expect(balances[Tokens.IRON]).to.equal(parseEther("5"));
    expect(balances[Tokens.SILVER]).to.equal(parseEther("5"));
    expect(balances[Tokens.PALLADIUM]).to.equal(parseEther("5"));
  });

  it("should not forge PALLADIUM with insufficient balance", async () => {
    await expect(
      forgeCompoundToken(Tokens.PALLADIUM, "5", user.account),
    ).to.be.rejectedWith("Insufficient balance");
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
    expect(balances[Tokens.IRON]).to.equal(parseEther("5"));
    expect(balances[Tokens.COPPER]).to.equal(parseEther("5"));
    expect(balances[Tokens.SILVER]).to.equal(parseEther("5"));
    expect(balances[Tokens.RHODIUM]).to.equal(parseEther("5"));
  });

  it("should not forge RHODIUM with insufficient balance", async () => {
    await expect(
      forgeCompoundToken(Tokens.RHODIUM, "5", user.account),
    ).to.be.rejectedWith("Insufficient balance");
  });

  it("should not trade compound tokens", async () => {
    await expect(
      forgery.write.trade([Tokens.GOLD, Tokens.PALLADIUM, parseEther("1")]),
    ).to.be.rejectedWith("Can only trade to IRON, COPPER, or SILVER");
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

    await forgery.write.trade(
      [Tokens.PALLADIUM, Tokens.COPPER, parseEther("30")],
      {
        account: user.account,
      },
    );

    const balances = await getBalances(user.account);
    expect(balances[Tokens.COPPER]).to.equal(parseEther("50"));
    expect(balances[Tokens.PALLADIUM]).to.equal(parseEther("0"));
  });

  it("should not trade with insufficient balance", async () => {
    await expect(
      forgery.write.trade([Tokens.PALLADIUM, Tokens.COPPER, parseEther("30")], {
        account: user.account,
      }),
    ).to.be.rejectedWith("Insufficient balance");
  });

  it("should get token URI", async () => {
    await forgeBasicToken(Tokens.IRON, "50", user.account);
    expect(await forgery.read.getTokenURI([Tokens.IRON, 0])).to.be.eq(
      "ipfs://QmZ3ae8RvL91RiVxy6MHC7Zw33cNMUZh9jgHanRppN17ci/0.json",
    );
  });
  it("should fail to return a URI for a non existing token ", async () => {
    await expect(
      forgery.read.getTokenURI([Tokens.RHODIUM, 5]),
    ).to.be.rejectedWith("Token does not exist");
  });

  it("should get last minted time", async () => {
    const publicClient = await hre.viem.getPublicClient();
    const currentBlock = await publicClient.getBlock();
    const currentTimestamp = currentBlock.timestamp;

    let nextTimeStamp = currentTimestamp + BigInt(10);
    await testClient.setNextBlockTimestamp({
      timestamp: nextTimeStamp,
    });

    await forgeBasicToken(Tokens.COPPER, "80", user.account);
    expect(await forgery.read.getLastMintedTime()).to.be.eq(nextTimeStamp);
  });

  it("should get tokens forged by id", async () => {
    await forgeBasicToken(Tokens.COPPER, "100", user.account);
    expect(await forgery.read.getTokensMinted([Tokens.COPPER])).to.be.eq(
      parseEther("100"),
    );
  });

  it("should fail to mint a basic token when a non owner", async () => {
    const alchemyTokens = await forgery.read.alchemyTokens();
    const alchemyContract = await hre.viem.getContractAt(
      "AlchemyTokens",
      alchemyTokens,
    );
    await expect(
      alchemyContract.write.mintBasicToken(
        [user.account.address, Tokens.IRON, parseEther("1")],
        {
          account: user.account,
        },
      ),
    ).to.be.rejectedWith("OwnableUnauthorizedAccount");
  });

  it("should fail to mint a compound token when a non owner", async () => {
    const alchemyTokens = await forgery.read.alchemyTokens();
    const alchemyContract = await hre.viem.getContractAt(
      "AlchemyTokens",
      alchemyTokens,
    );
    await expect(
      alchemyContract.write.mintCompoundToken(
        [user.account.address, Tokens.RHODIUM, parseEther("1")],
        {
          account: user.account,
        },
      ),
    ).to.be.rejectedWith("OwnableUnauthorizedAccount");
  });

  it("should fail to burn when insufficient balance", async () => {
    const alchemyTokens = await forgery.read.alchemyTokens();
    const alchemyContract = await hre.viem.getContractAt(
      "AlchemyTokens",
      alchemyTokens,
    );
    await expect(
      alchemyContract.write.burn([
        user.account.address,
        Tokens.PALLADIUM,
        parseEther("100"),
      ]),
    ).to.be.rejectedWith("Insufficient balance");
  });
});
