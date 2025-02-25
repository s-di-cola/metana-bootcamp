import hre from 'hardhat';
import {Address, parseEther} from 'viem';
import chai, {expect} from 'chai';
import {parseEventLogs} from 'viem';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

const ADDRESSES = {
    UNISWAP_V3_ROUTER: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    ADMIN: '0x88055326795DD479B39335CAb1c48357A66a6a6F',
    EXECUTOR: '0x3Fd2FbfcFA051455A34fcd931cb53772E370C0B0',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
} as const;

const ORDER_TYPES = {BUY: 0, SELL: 1} as const;
const ORDER_STATES = {PLACED: 0, EXECUTED: 1, CANCELLED: 2} as const;
const WETH_WHALE = '0x2fEb1512183545f48f6b9C5b4EbfCaF49CfCa6F3';

interface Order {
    orderType: number;
    state: number;
    maker: Address;
    tokenIn: Address;
    tokenOut: Address;
    amount: bigint;
    targetPrice: bigint;
    expiry: bigint;
    fee: number;
    executed: boolean;
}

async function createOrder(userAddress: string, orderType: number = ORDER_TYPES.BUY): Promise<Order> {
    const oneHourFromNow = (await (await hre.viem.getPublicClient()).getBlock()).timestamp + 3600n;

    return {
        orderType,
        state: ORDER_STATES.PLACED,
        maker: userAddress as Address,
        tokenIn: orderType === ORDER_TYPES.BUY ? ADDRESSES.WETH : ADDRESSES.USDC,
        tokenOut: orderType === ORDER_TYPES.BUY ? ADDRESSES.USDC : ADDRESSES.WETH,
        amount: orderType === ORDER_TYPES.BUY ? parseEther('1') : BigInt(1800 * 1e6),
        targetPrice: orderType === ORDER_TYPES.BUY ? BigInt(1800 * 1e6) : parseEther('1'),
        expiry: oneHourFromNow,
        fee: 3000,
        executed: false
    };
}

async function impersonateAddress(address: string) {
    const testClient = await hre.viem.getTestClient();
    await testClient.impersonateAccount({address});
    await testClient.setBalance({ address, value: parseEther('10') });
    return testClient;
}

describe('LimitOrder', () => {
    let limitOrder: any, weth: any, usdc: any, owner: any, user: any, order: Order;

    beforeEach(async () => {
        [owner, user] = await hre.viem.getWalletClients();
        limitOrder = await hre.viem.deployContract('LimitOrder', [ADDRESSES.UNISWAP_V3_ROUTER, ADDRESSES.ADMIN, ADDRESSES.EXECUTOR], {
            client: {wallet: owner}
        });
        weth = await hre.viem.getContractAt('IWETH', ADDRESSES.WETH);
        usdc = await hre.viem.getContractAt('IERC20', ADDRESSES.USDC);
        order = await createOrder(user.account.address);
    });

    describe('Order Placement', () => {
        describe('Valid Orders', () => {
            it('accepts BUY orders with WETH/USDC pair', async () => {
                await weth.write.approve([limitOrder.address, order.amount], {account: user.account});

                const tx = await limitOrder.write.placeOrder([
                    order.orderType,
                    order.tokenIn,
                    order.tokenOut,
                    order.amount,
                    order.targetPrice,
                    order.expiry,
                    order.fee], {account: user.account});
                const receipt = await (await hre.viem.getPublicClient()).waitForTransactionReceipt({hash: tx});

                const event = parseEventLogs({
                    abi: limitOrder.abi,
                    logs: receipt.logs,
                    eventName: 'OrderPlaced'
                });
                expect(event[0].args.orderID).to.equal(0n);

                const storedOrder = await limitOrder.read.s_orders([0n]);
                expect(storedOrder[1]).to.equal(ORDER_TYPES.BUY);
                expect(storedOrder[7]).to.equal(parseEther('1'));
                expect(storedOrder[8]).to.equal(BigInt(1800 * 1e6));
            });

            it('accepts SELL orders with USDC/WETH pair', async () => {
                order = await createOrder(user.account.address, ORDER_TYPES.SELL);
                await usdc.write.approve([limitOrder.address, order.amount], {account: user.account});

                const tx = await limitOrder.write.placeOrder([
                    order.orderType,
                    order.tokenIn,
                    order.tokenOut,
                    order.amount,
                    order.targetPrice,
                    order.expiry,
                    order.fee], {account: user.account});
                await (await hre.viem.getPublicClient()).waitForTransactionReceipt({hash: tx});

                const storedOrder = await limitOrder.read.s_orders([0n]);
                expect(storedOrder[1]).to.equal(ORDER_TYPES.SELL);
                expect(storedOrder[7]).to.equal(BigInt(1800 * 1e6));
                expect(storedOrder[8]).to.equal(parseEther('1'));
            });
        });

        describe('Invalid Orders', () => {
            it('rejects expired orders', async () => {
                const block = await (await hre.viem.getPublicClient()).getBlock();
                order.expiry = block.timestamp - 3600n;
                await expect(limitOrder.write.placeOrder([
                    order.orderType,
                    order.tokenIn,
                    order.tokenOut,
                    order.amount,
                    order.targetPrice,
                    order.expiry,
                    order.fee], {
                    account: user.account
                })).to.eventually.be.rejectedWith('Invalid expiry');
            });

            it('rejects zero amount', async () => {
                order.amount = 0n;
                await expect(limitOrder.write.placeOrder([
                    order.orderType,
                    order.tokenIn,
                    order.tokenOut,
                    order.amount,
                    order.targetPrice,
                    order.expiry,
                    order.fee], {
                    account: user.account
                })).to.eventually.be.rejectedWith('Amount must be greater than 0');
            });

            it('rejects zero target price', async () => {
                order.targetPrice = 0n;
                await expect(limitOrder.write.placeOrder([
                    order.orderType,
                    order.tokenIn,
                    order.tokenOut,
                    order.amount,
                    order.targetPrice,
                    order.expiry,
                    order.fee], {
                    account: user.account
                })).to.eventually.be.rejectedWith('Target price must be greater than 0');
            });

            it('rejects invalid fees', async () => {
                order.fee = 0;
                await expect(limitOrder.write.placeOrder([
                    order.orderType,
                    order.tokenIn,
                    order.tokenOut,
                    order.amount,
                    order.targetPrice,
                    order.expiry,
                    order.fee], {
                    account: user.account
                })).to.eventually.be.rejectedWith('Invalid fee');

                order.fee = 10000;
                await expect(limitOrder.write.placeOrder([
                    order.orderType,
                    order.tokenIn,
                    order.tokenOut,
                    order.amount,
                    order.targetPrice,
                    order.expiry,
                    order.fee], {
                    account: user.account
                })).to.eventually.be.rejectedWith('Invalid fee');
            });

            it('rejects identical input/output tokens', async () => {
                order.tokenOut = order.tokenIn;
                await expect(limitOrder.write.placeOrder([
                    order.orderType,
                    order.tokenIn,
                    order.tokenOut,
                    order.amount,
                    order.targetPrice,
                    order.expiry,
                    order.fee], {
                    account: user.account
                })).to.eventually.be.rejectedWith('Invalid tokens');
            });
        });
    });

    describe('Order Execution', () => {
        describe('Valid Execution', () => {
            it('executes BUY orders', async () => {
                await weth.write.deposit({account: user.account, value: order.amount});
                await weth.write.approve([limitOrder.address, order.amount], {account: user.account});

                const tx = await limitOrder.write.placeOrder([
                    order.orderType,
                    order.tokenIn,
                    order.tokenOut,
                    order.amount,
                    order.targetPrice,
                    order.expiry,
                    order.fee], {account: user.account});
                await (await hre.viem.getPublicClient()).waitForTransactionReceipt({hash: tx});

                await impersonateAddress(ADDRESSES.EXECUTOR);
                await limitOrder.write.executeOrder([0n], {account: ADDRESSES.EXECUTOR});

                const storedOrder = await limitOrder.read.s_orders([0n]);
                expect(storedOrder[2]).to.equal(ORDER_STATES.EXECUTED);
            });

            it('executes SELL orders', async () => {
                await impersonateAddress(WETH_WHALE);
                await weth.write.transfer([user.account.address, parseEther('10')], {account: WETH_WHALE});
                await weth.write.approve([limitOrder.address, parseEther('10')], {account: user.account});

                const sellOrder = {
                    ...await createOrder(user.account.address, ORDER_TYPES.SELL),
                    amount: parseEther('1'),
                    targetPrice: BigInt(2000 * 1e6),
                    tokenIn: ADDRESSES.WETH,
                    tokenOut: ADDRESSES.USDC,
                }

                const tx = await limitOrder.write.placeOrder([
                    order.orderType,
                    order.tokenIn,
                    order.tokenOut,
                    order.amount,
                    order.targetPrice,
                    order.expiry,
                    order.fee], {account: user.account});
                await (await hre.viem.getPublicClient()).waitForTransactionReceipt({hash: tx});

                await impersonateAddress(ADDRESSES.EXECUTOR);
                await limitOrder.write.executeOrder([0n], {account: ADDRESSES.EXECUTOR});

                const storedOrder = await limitOrder.read.s_orders([0n]);
                expect(storedOrder[2]).to.equal(ORDER_STATES.EXECUTED);
            });
        });

        describe('Invalid Execution', () => {
            it('rejects non-existent orders', async () => {
                await impersonateAddress(ADDRESSES.EXECUTOR);
                await expect(limitOrder.write.executeOrder([0n], {
                    account: ADDRESSES.EXECUTOR
                })).to.eventually.be.rejectedWith('Order does not exist');
            });

            it('enforces executor role', async () => {
                await weth.write.deposit({account: user.account, value: order.amount});
                await weth.write.approve([limitOrder.address, order.amount], {account: user.account});

                const tx = await limitOrder.write.placeOrder([
                    order.orderType,
                    order.tokenIn,
                    order.tokenOut,
                    order.amount,
                    order.targetPrice,
                    order.expiry,
                    order.fee], {account: user.account});
                await (await hre.viem.getPublicClient()).waitForTransactionReceipt({hash: tx});

                await expect(limitOrder.write.executeOrder([0n], {
                    account: user.account
                })).to.eventually.be.rejectedWith('AccessControlUnauthorizedAccount');
            });

            it('rejects expired orders', async () => {
                await weth.write.deposit({account: user.account, value: order.amount});
                await weth.write.approve([limitOrder.address, order.amount], {account: user.account});

                const tx = await limitOrder.write.placeOrder([
                    order.orderType,
                    order.tokenIn,
                    order.tokenOut,
                    order.amount,
                    order.targetPrice,
                    order.expiry,
                    order.fee], {account: user.account});
                await (await hre.viem.getPublicClient()).waitForTransactionReceipt({hash: tx});

                const testClient = await hre.viem.getTestClient();
                await testClient.increaseTime({seconds: 3601});

                await impersonateAddress(ADDRESSES.EXECUTOR);
                await expect(limitOrder.write.executeOrder([0n], {
                    account: ADDRESSES.EXECUTOR
                })).to.eventually.be.rejectedWith('Expired');
            });
        });
    });

    describe('Order Cancellation', () => {
        describe('Valid Cancellation', () => {
            it('cancels open orders', async () => {
                await weth.write.approve([limitOrder.address, order.amount], {account: user.account});

                const placeTx = await limitOrder.write.placeOrder([
                    order.orderType,
                    order.tokenIn,
                    order.tokenOut,
                    order.amount,
                    order.targetPrice,
                    order.expiry,
                    order.fee], {account: user.account});
                const placeReceipt = await (await hre.viem.getPublicClient()).waitForTransactionReceipt({hash: placeTx});

                const orderEvent = parseEventLogs({
                    abi: limitOrder.abi,
                    logs: placeReceipt.logs,
                    eventName: 'OrderPlaced'
                });
                const orderId = orderEvent[0].args.orderID;

                const cancelTx = await limitOrder.write.cancelOrder([orderId], {account: user.account});
                const cancelReceipt = await (await hre.viem.getPublicClient()).waitForTransactionReceipt({hash: cancelTx});

                const cancelEvent = parseEventLogs({
                    abi: limitOrder.abi,
                    logs: cancelReceipt.logs,
                    eventName: 'OrderCancelled'
                });
                expect(cancelEvent[0].args.orderID).to.equal(orderId);

                const storedOrder = await limitOrder.read.s_orders([orderId]);
                expect(storedOrder[2]).to.equal(ORDER_STATES.CANCELLED);
            });
        });

        describe('Invalid Cancellation', () => {
            it('rejects non-existent orders', async () => {
                await expect(limitOrder.write.cancelOrder([10n])).to.be.rejectedWith('Order does not exist');
            });

            it('rejects executed orders', async () => {
                await weth.write.deposit({account: user.account, value: order.amount});
                await weth.write.approve([limitOrder.address, order.amount], {account: user.account});

                const tx = await limitOrder.write.placeOrder([
                    order.orderType,
                    order.tokenIn,
                    order.tokenOut,
                    order.amount,
                    order.targetPrice,
                    order.expiry,
                    order.fee], {account: user.account});
                await (await hre.viem.getPublicClient()).waitForTransactionReceipt({hash: tx});

                await impersonateAddress(ADDRESSES.EXECUTOR);
                await limitOrder.write.executeOrder([0n], {account: ADDRESSES.EXECUTOR});

                await expect(limitOrder.write.cancelOrder([0n], {
                    account: user.account
                })).to.eventually.be.rejectedWith('Already executed');
            });
        });
    });
});
