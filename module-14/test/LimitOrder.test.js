"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = __importDefault(require("hardhat"));
const viem_1 = require("viem");
const chai_1 = require("chai");
const viem_2 = require("viem");
const ADDRESSES = {
    UNISWAP_V3_ROUTER: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
};
const ORDER_TYPES = { BUY: 0, SELL: 1 };
const ORDER_STATES = { PLACED: 0, EXECUTED: 1, CANCELLED: 2 };
const WETH_WHALE = '0x2fEb1512183545f48f6b9C5b4EbfCaF49CfCa6F3';
async function createOrder(userAddress, orderType = ORDER_TYPES.BUY) {
    const oneHourFromNow = (await (await hardhat_1.default.viem.getPublicClient()).getBlock()).timestamp + 3600n;
    return {
        orderType,
        state: ORDER_STATES.PLACED,
        maker: userAddress,
        tokenIn: orderType === ORDER_TYPES.BUY ? ADDRESSES.WETH : ADDRESSES.USDC,
        tokenOut: orderType === ORDER_TYPES.BUY ? ADDRESSES.USDC : ADDRESSES.WETH,
        amount: orderType === ORDER_TYPES.BUY ? (0, viem_1.parseEther)('1') : BigInt(1800 * 1e6),
        targetPrice: orderType === ORDER_TYPES.BUY ? BigInt(1800 * 1e6) : (0, viem_1.parseEther)('1'),
        expiry: oneHourFromNow,
        fee: 3000,
        executed: false
    };
}
describe('LimitOrder', () => {
    let limitOrder, weth, usdc, owner, user, order;
    beforeEach(async () => {
        [owner, user] = await hardhat_1.default.viem.getWalletClients();
        limitOrder = await hardhat_1.default.viem.deployContract('LimitOrder', [ADDRESSES.UNISWAP_V3_ROUTER], {
            client: { wallet: owner }
        });
        weth = await hardhat_1.default.viem.getContractAt('IWETH', ADDRESSES.WETH);
        usdc = await hardhat_1.default.viem.getContractAt('IERC20', ADDRESSES.USDC);
        order = await createOrder(user.account.address);
    });
    describe('Order Placement', () => {
        describe('Valid Orders', () => {
            it('accepts BUY orders with WETH/USDC pair', async () => {
                await weth.write.approve([limitOrder.address, order.amount], { account: user.account });
                const tx = await limitOrder.write.placeOrder([order], { account: user.account });
                const receipt = await (await hardhat_1.default.viem.getPublicClient()).waitForTransactionReceipt({ hash: tx });
                const event = (0, viem_2.parseEventLogs)({
                    abi: limitOrder.abi,
                    logs: receipt.logs,
                    eventName: 'OrderPlaced'
                });
                (0, chai_1.expect)(event[0].args.orderID).to.equal(0n);
                const storedOrder = await limitOrder.read.s_orders([0n]);
                (0, chai_1.expect)(storedOrder[0]).to.equal(ORDER_TYPES.BUY);
                (0, chai_1.expect)(storedOrder[5]).to.equal((0, viem_1.parseEther)('1'));
                (0, chai_1.expect)(storedOrder[6]).to.equal(BigInt(1800 * 1e6));
            });
            it('accepts SELL orders with USDC/WETH pair', async () => {
                order = await createOrder(user.account.address, ORDER_TYPES.SELL);
                await usdc.write.approve([limitOrder.address, order.amount], { account: user.account });
                const tx = await limitOrder.write.placeOrder([order], { account: user.account });
                await (await hardhat_1.default.viem.getPublicClient()).waitForTransactionReceipt({ hash: tx });
                const storedOrder = await limitOrder.read.s_orders([0n]);
                (0, chai_1.expect)(storedOrder[0]).to.equal(ORDER_TYPES.SELL);
                (0, chai_1.expect)(storedOrder[5]).to.equal(BigInt(1800 * 1e6));
                (0, chai_1.expect)(storedOrder[6]).to.equal((0, viem_1.parseEther)('1'));
            });
        });
        describe('Invalid Orders', () => {
            it('rejects expired orders', async () => {
                const block = await (await hardhat_1.default.viem.getPublicClient()).getBlock();
                order.expiry = block.timestamp - 3600n;
                await (0, chai_1.expect)(limitOrder.write.placeOrder([order], {
                    account: user.account
                })).to.be.rejectedWith('Invalid expiry since it is in the past');
            });
            it('rejects zero amount', async () => {
                order.amount = 0n;
                await (0, chai_1.expect)(limitOrder.write.placeOrder([order], {
                    account: user.account
                })).to.be.rejectedWith('Amount must be greater than 0');
            });
            it('rejects zero target price', async () => {
                order.targetPrice = 0n;
                await (0, chai_1.expect)(limitOrder.write.placeOrder([order], {
                    account: user.account
                })).to.be.rejectedWith('Target price must be greater than 0');
            });
            it('rejects invalid fees', async () => {
                order.fee = 0;
                await (0, chai_1.expect)(limitOrder.write.placeOrder([order], {
                    account: user.account
                })).to.be.rejectedWith('Fee must be greater than 0');
                order.fee = 10000;
                await (0, chai_1.expect)(limitOrder.write.placeOrder([order], {
                    account: user.account
                })).to.be.rejectedWith('Fee must be less than 10000');
            });
            it('rejects identical input/output tokens', async () => {
                order.tokenOut = order.tokenIn;
                await (0, chai_1.expect)(limitOrder.write.placeOrder([order], {
                    account: user.account
                })).to.be.rejectedWith('TokenIn and TokenOut must be different');
            });
        });
    });
    describe('Order Execution', () => {
        describe('Valid Execution', () => {
            it('executes BUY orders', async () => {
                await weth.write.deposit({ account: user.account, value: order.amount });
                await weth.write.approve([limitOrder.address, order.amount], { account: user.account });
                const tx = await limitOrder.write.placeOrder([order], { account: user.account });
                await (await hardhat_1.default.viem.getPublicClient()).waitForTransactionReceipt({ hash: tx });
                await limitOrder.write.executeOrder([0n], { account: owner.account });
                const storedOrder = await limitOrder.read.s_orders([0n]);
                (0, chai_1.expect)(storedOrder[1]).to.equal(ORDER_STATES.EXECUTED);
            });
            it('executes SELL orders', async () => {
                const testClient = await hardhat_1.default.viem.getTestClient();
                await testClient.impersonateAccount({ address: WETH_WHALE });
                await testClient.setBalance({ address: WETH_WHALE, value: (0, viem_1.parseEther)('10') });
                await weth.write.transfer([user.account.address, (0, viem_1.parseEther)('10')], { account: WETH_WHALE });
                await weth.write.approve([limitOrder.address, (0, viem_1.parseEther)('10')], { account: user.account });
                const sellOrder = {
                    ...await createOrder(user.account.address, ORDER_TYPES.SELL),
                    amount: (0, viem_1.parseEther)('1'),
                    targetPrice: BigInt(2000 * 1e6),
                    tokenIn: ADDRESSES.WETH,
                    tokenOut: ADDRESSES.USDC,
                };
                const tx = await limitOrder.write.placeOrder([sellOrder], { account: user.account });
                await (await hardhat_1.default.viem.getPublicClient()).waitForTransactionReceipt({ hash: tx });
                await limitOrder.write.executeOrder([0n], { account: owner.account });
                const storedOrder = await limitOrder.read.s_orders([0n]);
                (0, chai_1.expect)(storedOrder[1]).to.equal(ORDER_STATES.EXECUTED);
            });
        });
        describe('Invalid Execution', () => {
            it('rejects non-existent orders', async () => {
                await (0, chai_1.expect)(limitOrder.write.executeOrder([0n], {
                    account: owner.account
                })).to.be.rejectedWith('Order does not exist');
            });
            it('enforces executor role', async () => {
                await weth.write.deposit({ account: user.account, value: order.amount });
                await weth.write.approve([limitOrder.address, order.amount], { account: user.account });
                const tx = await limitOrder.write.placeOrder([order], { account: user.account });
                await (await hardhat_1.default.viem.getPublicClient()).waitForTransactionReceipt({ hash: tx });
                await (0, chai_1.expect)(limitOrder.write.executeOrder([0n], {
                    account: user.account
                })).to.be.rejectedWith('AccessControlUnauthorizedAccount');
            });
            it('rejects expired orders', async () => {
                await weth.write.deposit({ account: user.account, value: order.amount });
                await weth.write.approve([limitOrder.address, order.amount], { account: user.account });
                const tx = await limitOrder.write.placeOrder([order], { account: user.account });
                await (await hardhat_1.default.viem.getPublicClient()).waitForTransactionReceipt({ hash: tx });
                await hardhat_1.default.network.provider.send('evm_increaseTime', [3601]);
                await hardhat_1.default.network.provider.send('evm_mine');
                await (0, chai_1.expect)(limitOrder.write.executeOrder([0n], {
                    account: owner.account
                })).to.be.rejectedWith('Order has expired');
            });
        });
    });
    describe('Order Cancellation', () => {
        describe('Valid Cancellation', () => {
            it('cancels open orders', async () => {
                await weth.write.approve([limitOrder.address, order.amount], { account: user.account });
                const placeTx = await limitOrder.write.placeOrder([order], { account: user.account });
                const placeReceipt = await (await hardhat_1.default.viem.getPublicClient()).waitForTransactionReceipt({ hash: placeTx });
                const orderEvent = (0, viem_2.parseEventLogs)({
                    abi: limitOrder.abi,
                    logs: placeReceipt.logs,
                    eventName: 'OrderPlaced'
                });
                const orderId = orderEvent[0].args.orderID;
                const cancelTx = await limitOrder.write.cancelOrder([orderId], { account: user.account });
                const cancelReceipt = await (await hardhat_1.default.viem.getPublicClient()).waitForTransactionReceipt({ hash: cancelTx });
                const cancelEvent = (0, viem_2.parseEventLogs)({
                    abi: limitOrder.abi,
                    logs: cancelReceipt.logs,
                    eventName: 'OrderCancelled'
                });
                (0, chai_1.expect)(cancelEvent[0].args.orderID).to.equal(orderId);
                const storedOrder = await limitOrder.read.s_orders([orderId]);
                (0, chai_1.expect)(storedOrder[1]).to.equal(ORDER_STATES.CANCELLED);
            });
        });
        describe('Invalid Cancellation', () => {
            it('rejects non-existent orders', async () => {
                await (0, chai_1.expect)(limitOrder.write.cancelOrder([10n])).to.be.rejectedWith('Order does not exist');
            });
            it('rejects executed orders', async () => {
                await weth.write.deposit({ account: user.account, value: order.amount });
                await weth.write.approve([limitOrder.address, order.amount], { account: user.account });
                const tx = await limitOrder.write.placeOrder([order], { account: user.account });
                await (await hardhat_1.default.viem.getPublicClient()).waitForTransactionReceipt({ hash: tx });
                await limitOrder.write.executeOrder([0n], { account: owner.account });
                await (0, chai_1.expect)(limitOrder.write.cancelOrder([0n], {
                    account: user.account
                })).to.be.rejectedWith('Order has already been executed');
            });
        });
    });
});
