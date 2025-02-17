// defender-action.js
const { Defender } = require('@openzeppelin/defender-sdk');
const ethers = require('ethers');

const LIMIT_ORDER_ADDRESS = '0xf65a0930ac58e0640d46b60a038dd8406512834c';
const FEED_REGISTRY = '0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf';
const USD = '0x0000000000000000000000000000000000000348';
const ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

const feedRegistryAbi = [
    {
        inputs: [
            { internalType: 'address', name: 'base', type: 'address' },
            { internalType: 'address', name: 'quote', type: 'address' }
        ],
        name: 'latestRoundData',
        outputs: [
            { name: 'roundId', type: 'uint80' },
            { name: 'answer', type: 'int256' },
            { name: 'startedAt', type: 'uint256' },
            { name: 'updatedAt', type: 'uint256' },
            { name: 'answeredInRound', type: 'uint80' }
        ],
        stateMutability: 'view',
        type: 'function'
    }
];

const limitOrderAbi = [
    {
        inputs: [],
        name: 'getOrders',
        outputs: [{ internalType: 'uint256', name: 'orders', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 's_orders',
        outputs: [
            { internalType: 'uint16', name: 'fee', type: 'uint16' },
            { internalType: 'uint8', name: 'orderType', type: 'uint8' },
            { internalType: 'uint8', name: 'state', type: 'uint8' },
            { internalType: 'bool', name: 'executed', type: 'bool' },
            { internalType: 'address', name: 'maker', type: 'address' },
            { internalType: 'address', name: 'tokenIn', type: 'address' },
            { internalType: 'address', name: 'tokenOut', type: 'address' },
            { internalType: 'uint256', name: 'amount', type: 'uint256' },
            { internalType: 'uint256', name: 'targetPrice', type: 'uint256' },
            { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
            { internalType: 'uint256', name: 'expiry', type: 'uint256' },
            { internalType: 'bytes32', name: 'transactionHash', type: 'bytes32' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: '_orderID', type: 'uint256' }],
        name: 'executeOrder',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
];

async function getPrice(feedRegistry, tokenIn) {
    try {
        const baseToken = tokenIn.toLowerCase() === WETH.toLowerCase() ? ETH : tokenIn;
        console.log(`Getting USD price for token ${tokenIn} (using ${baseToken} for feed)`);
        console.log(`Using Feed Registry at ${feedRegistry.address}`);

        const data = await feedRegistry.latestRoundData(baseToken, USD);

        console.log(JSON.stringify({
            message: 'Price feed response',
            data: {
                roundId: data.roundId.toString(),
                price: data.answer.toString(),
                timestamp: new Date(data.updatedAt.toNumber() * 1000).toISOString()
            }
        }));

        if (data.answer.lte(0)) {
            throw new Error('Invalid price - less than or equal to 0');
        }

        return { price: data.answer };
    } catch (error) {
        console.error('Price feed error:', error);
        throw error;
    }
}

async function getSigner(event) {
    const client = new Defender(event);
    const provider = client.relaySigner.getProvider();
    return client.relaySigner.getSigner(provider, {
        speed: 'fast',
        validForSeconds: 300,
        validUntilSeconds: Math.floor(Date.now() / 1000) + 300,
        gasLimit: 3000000
    });
}

async function handler(event) {
    console.log('Starting limit order check...');

    try {
        const signer = await getSigner(event);
        const provider = signer.provider;

        const network = await provider.getNetwork();
        console.log(JSON.stringify({
            message: 'Network connection established',
            network: {
                name: network.name,
                chainId: network.chainId
            },
            signer: await signer.getAddress()
        }));

        const feedRegistry = new ethers.Contract(FEED_REGISTRY, feedRegistryAbi, provider);
        const limitOrder = new ethers.Contract(LIMIT_ORDER_ADDRESS, limitOrderAbi, signer);

        const orders = await limitOrder.getOrders();
        const totalOrders = orders.toNumber();
        console.log(`Found ${totalOrders} total orders`);

        for (let i = 0; i < totalOrders; i++) {
            console.log(`\nChecking order ${i}...`);
            try {
                const order = await limitOrder.s_orders(i);

                if (order.executed) {
                    console.log('Order already executed, skipping');
                    continue;
                }

                if (order.state.toString() !== '0') {
                    console.log(`Order not active (state: ${order.state}), skipping`);
                    continue;
                }

                const currentTime = Math.floor(Date.now() / 1000);
                if (order.expiry.toNumber() <= currentTime) {
                    console.log('Order expired, skipping');
                    continue;
                }

                const { price } = await getPrice(feedRegistry, order.tokenIn);

                const shouldExecute = order.orderType.toString() === '0'
                    ? price.lte(order.targetPrice)
                    : price.gte(order.targetPrice);

                if (shouldExecute) {
                    console.log('Price conditions met, executing order...');

                    // Set gas price for the transaction
                    const gasPrice = ethers.utils.parseUnits('20', 'gwei');
                    console.log(`Using gas price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);

                    // Submit transaction with specified gasLimit and gasPrice
                    const tx = await limitOrder.executeOrder(i, {
                        gasLimit: 3000000,
                        gasPrice: gasPrice
                    });

                    console.log(`Transaction sent: ${tx.hash}`);

                    const receipt = await tx.wait();

                    if (receipt.status === 0) {
                        try {
                            await provider.call(tx, tx.blockNumber);
                        } catch (error) {
                            console.error('Revert reason:', error.message);
                        }
                        throw new Error('Transaction reverted');
                    }

                    console.log(JSON.stringify({
                        message: 'Transaction confirmed',
                        data: {
                            blockNumber: receipt.blockNumber,
                            gasUsed: receipt.gasUsed.toString(),
                            effectiveGasPrice: ethers.utils.formatUnits(receipt.effectiveGasPrice, 'gwei')
                        }
                    }));
                } else {
                    console.log('Price conditions not met, skipping');
                }
            } catch (error) {
                console.error(`Failed to process order ${i}:`, error);
                if (error.receipt) {
                    try {
                        const tx = {
                            to: error.receipt.to,
                            from: error.receipt.from,
                            data: error.transaction.data,
                            gasLimit: error.transaction.gasLimit,
                            gasPrice: error.transaction.gasPrice,
                            value: error.transaction.value
                        };
                        await provider.call(tx, error.receipt.blockNumber);
                    } catch (callError) {
                        console.error('Detailed error:', callError.message);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Fatal error:', error);
        throw error;
    }

    console.log('Limit order check completed');
}

// For Defender
export {handler, getPrice}
