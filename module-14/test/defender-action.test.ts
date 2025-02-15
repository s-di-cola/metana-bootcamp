import chai, {expect} from 'chai';
import sinon from 'sinon';
import { AbiCoder, ethers } from 'ethers';
import { handler, getPrice } from '../scripts/defender-action.js';
import { Defender } from '@openzeppelin/defender-sdk';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);


// Minimal ABI fragments
const getOrdersAbiFragment = [
    {
        inputs: [],
        name: "getOrders",
        outputs: [
            { internalType: "uint256", name: "orders", type: "uint256" }
        ],
        stateMutability: "view",
        type: "function"
    }
];

const sOrdersAbiFragment = [
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "s_orders",
        outputs: [
            { internalType: "uint16", name: "fee", type: "uint16" },
            { internalType: "uint8", name: "orderType", type: "uint8" },
            { internalType: "uint8", name: "state", type: "uint8" },
            { internalType: "bool", name: "executed", type: "bool" },
            { internalType: "address", name: "maker", type: "address" },
            { internalType: "address", name: "tokenIn", type: "address" },
            { internalType: "address", name: "tokenOut", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
            { internalType: "uint256", name: "targetPrice", type: "uint256" },
            { internalType: "uint256", name: "timestamp", type: "uint256" },
            { internalType: "uint256", name: "expiry", type: "uint256" },
            { internalType: "bytes32", name: "transactionHash", type: "bytes32" }
        ],
        stateMutability: "view",
        type: "function"
    }
];

const latestRoundDataAbi = [
    {
        inputs: [
            { internalType: "address", name: "base", type: "address" },
            { internalType: "address", name: "quote", type: "address" }
        ],
        name: "latestRoundData",
        outputs: [
            { name: "roundId", type: "uint80" },
            { name: "answer", type: "int256" },
            { name: "startedAt", type: "uint256" },
            { name: "updatedAt", type: "uint256" },
            { name: "answeredInRound", type: "uint80" }
        ],
        stateMutability: "view",
        type: "function"
    }
];

const decimalsAbi = [
    {
        inputs: [
            { internalType: "address", name: "base", type: "address" },
            { internalType: "address", name: "quote", type: "address" }
        ],
        name: "decimals",
        outputs: [{ type: "uint8" }],
        stateMutability: "view",
        type: "function"
    }
];

describe('Defender Action Tests', () => {
    let sandbox: sinon.SinonSandbox;
    let mockLimitOrder: any;
    let mockFeedRegistry: any;

    // Dummy addresses
    const LIMIT_ORDER_ADDRESS = '0xa0C458f3814a7AFE0c3AB9737f5C38f73CdB7BD4';
    const FEED_REGISTRY = '0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf';
    const USD = '0x0000000000000000000000000000000000000348';
    const ETH_ADDRESS = "0x1111111111111111111111111111111111111111";
    const USDC_ADDRESS = "0x2222222222222222222222222222222222222222";

    let fakeProvider: any;
    let fakeSigner: any;
    const abiCoder = new AbiCoder();

    // Global currentEthPrice (8 decimals)
    let currentEthPrice: bigint = 370000000000n;

    // Get selectors using ethers.Interface
    const ifaceGetOrders = new ethers.Interface(getOrdersAbiFragment);
    const getOrdersSelector = ifaceGetOrders.getFunction("getOrders").selector;
    const ifaceSOrders = new ethers.Interface(sOrdersAbiFragment);
    const sOrdersSelector = ifaceSOrders.getFunction("s_orders").selector;
    const ifaceLRD = new ethers.Interface(latestRoundDataAbi);
    const latestRoundDataSelector = ifaceLRD.getFunction("latestRoundData").selector;
    const ifaceDecimals = new ethers.Interface(decimalsAbi);
    const decimalsSelector = ifaceDecimals.getFunction("decimals").selector;

    beforeEach(() => {
        sandbox = sinon.createSandbox();

        // Create mock for LimitOrder contract
        mockLimitOrder = {
            getOrders: sandbox.stub().resolves(1n),
            s_orders: sandbox.stub(),
            executeOrder: sandbox.stub().resolves({
                hash: '0xtxhash',
                wait: () => Promise.resolve({
                    to: LIMIT_ORDER_ADDRESS,
                    from: "0x0000000000000000000000000000000000000001",
                    contractAddress: null,
                    transactionIndex: 0,
                    gasUsed: 21000n,
                    logsBloom: "0x",
                    blockHash: "0x" + "0".repeat(64),
                    transactionHash: "0xtxhash",
                    logs: [],
                    blockNumber: 1,
                    confirmations: () => 1,
                    status: 1,
                    type: 2,
                    byzantium: true
                })
            }),
        };

        // Create mock for FeedRegistry contract
        mockFeedRegistry = {
            latestRoundData: sandbox.stub(),
            decimals: sandbox.stub().resolves(8)
        };

        // Create fake provider
        fakeProvider = {
            call: sandbox.stub().callsFake((tx: any) => {
                // Handle getOrders call:
                if (tx.to === LIMIT_ORDER_ADDRESS && tx.data.startsWith(getOrdersSelector)) {
                    const encoded = abiCoder.encode(["uint256"], [1n]);
                    return Promise.resolve(encoded);
                }
                // Handle s_orders call:
                if (tx.to === LIMIT_ORDER_ADDRESS && tx.data.startsWith(sOrdersSelector)) {
                    const currentTime = BigInt(Math.floor(Date.now() / 1000));
                    const orderData = [
                        100, // fee
                        0,   // orderType (default BUY)
                        0,   // state
                        false, // executed
                        "0x0000000000000000000000000000000000000001",
                        USDC_ADDRESS,
                        ETH_ADDRESS,
                        ethers.parseEther('1'),
                        3700000000n,
                        currentTime,
                        currentTime + 3600n,
                        "0x" + "0".repeat(64)
                    ];
                    const encoded = abiCoder.encode(
                        ["uint16", "uint8", "uint8", "bool", "address", "address", "address", "uint256", "uint256", "uint256", "uint256", "bytes32"],
                        orderData
                    );
                    return Promise.resolve(encoded);
                }
                // Handle latestRoundData call:
                if (tx.to === FEED_REGISTRY && tx.data.startsWith(latestRoundDataSelector)) {
                    const decoded = ifaceLRD.decodeFunctionData("latestRoundData", tx.data);
                    const base: string = decoded.base;
                    let answer: bigint;
                    // For SELL orders test override (see SELL orders block)
                    if (sandbox.currentTest?.parent.title.includes("SELL orders")) {
                        // For SELL orders, return currentEthPrice for both tokenIn and tokenOut
                        answer = currentEthPrice;
                    } else {
                        if (base.toLowerCase() === ETH_ADDRESS.toLowerCase()) {
                            answer = currentEthPrice;
                        } else if (base.toLowerCase() === USDC_ADDRESS.toLowerCase()) {
                            answer = 100000000n;
                        } else {
                            answer = 1n;
                        }
                    }
                    const encoded = abiCoder.encode(
                        ["uint80", "int256", "uint256", "uint256", "uint80"],
                        [1n, answer, 0n, 0n, 1n]
                    );
                    return Promise.resolve(encoded);
                }
                // Handle decimals call:
                if (tx.to === FEED_REGISTRY && tx.data.startsWith(decimalsSelector)) {
                    const encoded = abiCoder.encode(["uint8"], [8]);
                    return Promise.resolve(encoded);
                }
                return Promise.resolve("0x");
            }),
            getTransactionReceipt: sandbox.stub().resolves({
                to: LIMIT_ORDER_ADDRESS,
                from: "0x0000000000000000000000000000000000000001",
                contractAddress: null,
                transactionIndex: 0,
                gasUsed: 21000n,
                logsBloom: "0x",
                blockHash: "0x" + "0".repeat(64),
                transactionHash: "0xtxhash",
                logs: [],
                blockNumber: 1,
                confirmations: () => 1,
                status: 1,
                type: 2,
                byzantium: true
            })
        };

        fakeSigner = {
            provider: fakeProvider,
            sendTransaction: sandbox.stub().resolves({
                hash: '0xtxhash',
                wait: () => Promise.resolve({
                    status: 1,
                    blockNumber: 1,
                    blockHash: '0x' + '0'.repeat(64),
                    transactionHash: '0xtxhash',
                    confirmations: () => 1
                })
            })
        };

        // Stub Defender's relaySigner
        sandbox.stub(Defender.prototype, 'relaySigner').get(() => ({
            getProvider: () => fakeProvider,
            getSigner: async () => fakeSigner
        }));

        // Stub ethers.Contract: return mockFeedRegistry for FEED_REGISTRY and mockLimitOrder for LIMIT_ORDER_ADDRESS.
        sandbox.stub(ethers, 'Contract').callsFake((address: string, abi: any, signerOrProvider: any) => {
            if (address === FEED_REGISTRY) {
                return mockFeedRegistry;
            }
            if (address === LIMIT_ORDER_ADDRESS) {
                const contract = mockLimitOrder;
                contract.connect = () => ({
                    ...contract,
                    signer: fakeSigner,
                    executeOrder: async (orderId: bigint) => {
                        const tx = await fakeSigner.sendTransaction({
                            to: LIMIT_ORDER_ADDRESS,
                            data: '0x'
                        });
                        return tx;
                    }
                });
                return contract;
            }
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    // BUY orders tests
    describe('BUY orders', () => {
        beforeEach(() => {
            currentEthPrice = 370000000000n;
            mockLimitOrder.s_orders.withArgs(0n).resolves({
                fee: 100,
                orderType: 0, // BUY order
                state: 0,
                executed: false,
                maker: "0x0000000000000000000000000000000000000001",
                tokenIn: USDC_ADDRESS,
                tokenOut: ETH_ADDRESS,
                amount: ethers.parseEther('1'),
                targetPrice: 3700000000n,
                timestamp: BigInt(Math.floor(Date.now() / 1000)),
                expiry: BigInt(Math.floor(Date.now() / 1000)) + 3600n,
                transactionHash: "0x" + "0".repeat(64)
            });
            // The provider.call override in beforeEach (top-level) handles BUY orders normally.
        });

        it('should execute when price matches target', async () => {
            await handler({ apiKey: 'test', apiSecret: 'test' });
            expect(fakeSigner.sendTransaction.calledOnce).to.be.true;
        });

        it('should execute when price is below target', async () => {
            currentEthPrice = 360000000000n;
            await handler({ apiKey: 'test', apiSecret: 'test' });
            expect(fakeSigner.sendTransaction.calledOnce).to.be.true;
        });

        it('should not execute when price is above target', async () => {
            currentEthPrice = 380000000000n;
            await handler({ apiKey: 'test', apiSecret: 'test' });
            expect(mockLimitOrder.executeOrder.called).to.be.false;
        });
    });

    // getPrice tests
    describe('getPrice function', () => {
        let feedRegistryStub: any;
        beforeEach(() => {
            feedRegistryStub = {
                latestRoundData: sandbox.stub(),
                decimals: sandbox.stub().resolves(8)
            };
            // Use sinon.match to handle case-insensitive matching
            feedRegistryStub.latestRoundData.withArgs(
                sinon.match((addr: string) => addr.toLowerCase() === USDC_ADDRESS.toLowerCase()),
                sinon.match((q: string) => q.toLowerCase() === USD.toLowerCase())
            ).resolves({
                roundId: 1n,
                answer: 100000000n,
                startedAt: 0n,
                updatedAt: 0n,
                answeredInRound: 1n
            });
            feedRegistryStub.latestRoundData.withArgs(
                sinon.match((addr: string) => addr.toLowerCase() === ETH_ADDRESS.toLowerCase()),
                sinon.match((q: string) => q.toLowerCase() === USD.toLowerCase())
            ).resolves({
                roundId: 1n,
                answer: 370000000000n,
                startedAt: 0n,
                updatedAt: 0n,
                answeredInRound: 1n
            });
        });

        it('should return normalized price when both feeds are valid', async () => {
            const { price } = await getPrice(feedRegistryStub, USDC_ADDRESS, ETH_ADDRESS);
            expect(price).to.equal(3700000000n);
        });

        it('should throw an error if tokenIn feed returns non-positive answer', async () => {
            feedRegistryStub.latestRoundData.withArgs(
                sinon.match((addr: string) => addr.toLowerCase() === USDC_ADDRESS.toLowerCase()),
                sinon.match((q: string) => q.toLowerCase() === USD.toLowerCase())
            ).resolves({
                roundId: 1n,
                answer: 0n,
                startedAt: 0n,
                updatedAt: 0n,
                answeredInRound: 1n
            });
            await expect(getPrice(feedRegistryStub, USDC_ADDRESS, ETH_ADDRESS))
                .to.be.rejectedWith(/Invalid price feed data/);
        });

        it('should throw an error if tokenOut feed returns non-positive answer', async () => {
            feedRegistryStub.latestRoundData.withArgs(
                sinon.match((addr: string) => addr.toLowerCase() === USDC_ADDRESS.toLowerCase()),
                sinon.match((q: string) => q.toLowerCase() === USD.toLowerCase())
            ).resolves({
                roundId: 1n,
                answer: 100000000n,
                startedAt: 0n,
                updatedAt: 0n,
                answeredInRound: 1n
            });
            feedRegistryStub.latestRoundData.withArgs(
                sinon.match((addr: string) => addr.toLowerCase() === ETH_ADDRESS.toLowerCase()),
                sinon.match((q: string) => q.toLowerCase() === USD.toLowerCase())
            ).resolves({
                roundId: 1n,
                answer: -1n,
                startedAt: 0n,
                updatedAt: 0n,
                answeredInRound: 1n
            });
            await expect(getPrice(feedRegistryStub, USDC_ADDRESS, ETH_ADDRESS))
                .to.be.rejectedWith(/Invalid price feed data/);
        });
    });

    // SELL orders tests
    describe('SELL orders', () => {
        beforeEach(() => {
            // Configure SELL order: orderType = 1
            mockLimitOrder.s_orders.withArgs(0n).resolves({
                fee: 100,
                orderType: 1n, // SELL
                state: 0,
                executed: false,
                maker: "0x0000000000000000000000000000000000000001",
                tokenIn: ETH_ADDRESS,    // SELL: selling ETH
                tokenOut: USDC_ADDRESS,   // Receiving USDC
                amount: ethers.parseEther('1'),
                targetPrice: 3700000000n,
                timestamp: BigInt(Math.floor(Date.now() / 1000)),
                expiry: BigInt(Math.floor(Date.now() / 1000)) + 3600n,
                transactionHash: "0x" + "0".repeat(64)
            });
            // Override fakeProvider.call for SELL orders: for latestRoundData, return currentEthPrice regardless of base.
            fakeProvider.call = sandbox.stub().callsFake((tx: any) => {
                if (tx.to === FEED_REGISTRY && tx.data.startsWith(latestRoundDataSelector)) {
                    const encoded = abiCoder.encode(
                        ["uint80", "int256", "uint256", "uint256", "uint80"],
                        [1n, currentEthPrice, 0n, 0n, 1n]
                    );
                    return Promise.resolve(encoded);
                }
                // Fallback for other calls (reuse previous logic)
                if (tx.to === LIMIT_ORDER_ADDRESS && tx.data.startsWith(getOrdersSelector)) {
                    return Promise.resolve(abiCoder.encode(["uint256"], [1n]));
                }
                if (tx.to === LIMIT_ORDER_ADDRESS && tx.data.startsWith(sOrdersSelector)) {
                    const currentTime = BigInt(Math.floor(Date.now() / 1000));
                    const orderData = [
                        100,
                        1, // SELL
                        0,
                        false,
                        "0x0000000000000000000000000000000000000001",
                        ETH_ADDRESS,
                        USDC_ADDRESS,
                        ethers.parseEther('1'),
                        3700000000n,
                        currentTime,
                        currentTime + 3600n,
                        "0x" + "0".repeat(64)
                    ];
                    return Promise.resolve(abiCoder.encode(
                        ["uint16", "uint8", "uint8", "bool", "address", "address", "address", "uint256", "uint256", "uint256", "uint256", "bytes32"],
                        orderData
                    ));
                }
                if (tx.to === FEED_REGISTRY && tx.data.startsWith(decimalsSelector)) {
                    return Promise.resolve(abiCoder.encode(["uint8"], [8]));
                }
                return Promise.resolve("0x");
            });
        });

        it('should execute SELL order when price is above or equal to target', async () => {
            currentEthPrice = 380000000000n; // Normalized: 3800000000n
            await handler({ apiKey: 'test', apiSecret: 'test' });
            expect(fakeSigner.sendTransaction.calledOnce).to.be.true;
        });

        it('should not execute SELL order when price is below target', async () => {
            currentEthPrice = 360000000000n; // Normalized: 3600000000n
            await handler({ apiKey: 'test', apiSecret: 'test' });
            expect(mockLimitOrder.executeOrder.called).to.be.false;
        });
    });

    // Handler error tests
    describe('Handler order skipping and error handling', () => {
        it('should skip execution if the order has already been executed', async () => {
            mockLimitOrder.s_orders.withArgs(0n).resolves({
                fee: 100,
                orderType: 0n,
                state: 0,
                executed: true,
                maker: "0x0000000000000000000000000000000000000001",
                tokenIn: USDC_ADDRESS,
                tokenOut: ETH_ADDRESS,
                amount: ethers.parseEther('1'),
                targetPrice: 3700000000n,
                timestamp: BigInt(Math.floor(Date.now() / 1000)),
                expiry: BigInt(Math.floor(Date.now() / 1000)) + 3600n,
                transactionHash: "0x" + "0".repeat(64)
            });
            await handler({ apiKey: 'test', apiSecret: 'test' });
            expect(mockLimitOrder.executeOrder.called).to.be.false;
        });

        it('should skip execution if order state is not active', async () => {
            mockLimitOrder.s_orders.withArgs(0n).resolves({
                fee: 100,
                orderType: 0n,
                state: 1,
                executed: false,
                maker: "0x0000000000000000000000000000000000000001",
                tokenIn: USDC_ADDRESS,
                tokenOut: ETH_ADDRESS,
                amount: ethers.parseEther('1'),
                targetPrice: 3700000000n,
                timestamp: BigInt(Math.floor(Date.now() / 1000)),
                expiry: BigInt(Math.floor(Date.now() / 1000)) + 3600n,
                transactionHash: "0x" + "0".repeat(64)
            });
            await handler({ apiKey: 'test', apiSecret: 'test' });
            expect(mockLimitOrder.executeOrder.called).to.be.false;
        });

        it('should skip execution if the order has expired', async () => {
            const pastTime = BigInt(Math.floor(Date.now() / 1000)) - 10n;
            mockLimitOrder.s_orders.withArgs(0n).resolves({
                fee: 100,
                orderType: 0n,
                state: 0,
                executed: false,
                maker: "0x0000000000000000000000000000000000000001",
                tokenIn: USDC_ADDRESS,
                tokenOut: ETH_ADDRESS,
                amount: ethers.parseEther('1'),
                targetPrice: 3700000000n,
                timestamp: BigInt(Math.floor(Date.now() / 1000)) - 3600n,
                expiry: pastTime,
                transactionHash: "0x" + "0".repeat(64)
            });
            await handler({ apiKey: 'test', apiSecret: 'test' });
            expect(mockLimitOrder.executeOrder.called).to.be.false;
        });

        it('should catch and log errors when executeOrder fails', async () => {
            fakeSigner.sendTransaction = sandbox.stub().rejects(new Error("Transaction failed"));
            const consoleErrorStub = sandbox.stub(console, 'error');
            await handler({ apiKey: 'test', apiSecret: 'test' });
            expect(consoleErrorStub.calledWithMatch("Error processing order 0")).to.be.true;
        });
    });
});
