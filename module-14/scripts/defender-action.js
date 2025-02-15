const {Defender} = require('@openzeppelin/defender-sdk');
const {ethers} = require('ethers');

const LIMIT_ORDER_ADDRESS = '0xa0C458f3814a7AFE0c3AB9737f5C38f73CdB7BD4';
const FEED_REGISTRY = "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf";
const USD = "0x0000000000000000000000000000000000000348";

const feedRegistryAbi = [
    {
        inputs: [
            {internalType: "address", name: "base", type: "address"},
            {internalType: "address", name: "quote", type: "address"}
        ],
        name: "latestRoundData",
        outputs: [
            {name: 'roundId', type: 'uint80'},
            {name: 'answer', type: 'int256'},
            {name: 'startedAt', type: 'uint256'},
            {name: 'updatedAt', type: 'uint256'},
            {name: 'answeredInRound', type: 'uint80'}
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {internalType: "address", name: "base", type: "address"},
            {internalType: "address", name: "quote", type: "address"}
        ],
        name: "decimals",
        outputs: [{type: 'uint8'}],
        stateMutability: 'view',
        type: 'function'
    }
];

// Copied directly from LimitOrder.json
const limitOrderAbi = [
    {
        "inputs": [],
        "name": "getOrders",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "orders",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "type": "uint256"
            }
        ],
        "name": "s_orders",
        "outputs": [
            {
                "internalType": "uint16",
                "name": "fee",
                "type": "uint16"
            },
            {
                "internalType": "enum LimitOrder.OrderType",
                "name": "orderType",
                "type": "uint8"
            },
            {
                "internalType": "enum LimitOrder.OrderState",
                "name": "state",
                "type": "uint8"
            },
            {
                "internalType": "bool",
                "name": "executed",
                "type": "bool"
            },
            {
                "internalType": "address",
                "name": "maker",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "tokenIn",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "tokenOut",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "targetPrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "expiry",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "transactionHash",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_orderID",
                "type": "uint256"
            }
        ],
        "name": "executeOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

async function getPrice(feedRegistry, tokenIn, tokenOut) {
    try {
        const [inData, outData] = await Promise.all([
            feedRegistry.latestRoundData(tokenIn, USD),
            feedRegistry.latestRoundData(tokenOut, USD)
        ]);
        // Convert answers (which may be ethers.BigNumber or native bigint) to native BigInt:
        const inAnswer = BigInt(inData.answer.toString());
        const outAnswer = BigInt(outData.answer.toString());
        if (inAnswer <= 0n || outAnswer <= 0n) {
            throw new Error('Invalid price feed data');
        }
        // Normalize from 8 decimals to 6 decimals
        const price = outAnswer / (10n ** 2n);
        return { price };
    } catch (error) {
        throw new Error(`Price calculation failed: ${error.message}`);
    }
}



async function handler(event) {
    const client = new Defender(event);
    const provider = client.relaySigner.getProvider();
    const signer = await client.relaySigner.getSigner(provider, {speed: 'fast'});

    const feedRegistry = new ethers.Contract(FEED_REGISTRY, feedRegistryAbi, provider);
    const limitOrder = new ethers.Contract(LIMIT_ORDER_ADDRESS, limitOrderAbi, signer);

    try {
        const orders = await limitOrder.getOrders();
        console.log('Total orders:', orders.toString());

        // Convert orders to a number and loop through them
        for (let i = 0n; i < orders; i++) {
            try {
                const order = await limitOrder.s_orders(i);

                // Skip if order is not active
                if (order.executed || order.state !== 0n) continue;

                // Skip if order is expired
                if (order.expiry <= BigInt(Math.floor(Date.now() / 1000))) continue;

                const {price} = await getPrice(feedRegistry, order.tokenIn, order.tokenOut);

                const shouldExecute = order.orderType === 0n ? price <= order.targetPrice : price >= order.targetPrice;

                if (shouldExecute) {
                    console.log(`Executing order ${i}`);
                    const tx = await limitOrder.executeOrder(i);
                    console.log(`Transaction hash: ${tx.hash}`);
                    await tx.wait();
                }
            } catch (error) {
                console.error(`Error processing order ${i}:`, error.message);
            }
        }
    } catch (error) {
        console.error('Error getting orders:', error);
        throw error;
    }
}

module.exports = {
    handler,
    getPrice
};
