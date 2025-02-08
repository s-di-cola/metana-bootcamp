const { Defender } = require('@openzeppelin/defender-sdk');
const { ethers } = require('ethers');

const LIMIT_ORDER_ADDRESS = '0x50cE9f01972dB1Ed5745ADb0Ae3fF4F4e82fB5D6';

// Use checksum addresses
const PRICE_FEEDS = {
    '0xB4FBF271143F4FBf7B91A5ded31805e42B2208D6': '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612', // WETH
    '0x07865c6E87B9F70255377e024ace6630C1Eaa37F': '0x4C82b870165b945F2aB06E65fA201DB3A12B5197', // USDC
};

const DECIMALS = {
    '0xB4FBF271143F4FBf7B91A5ded31805e42B2208D6': 18, // WETH
    '0x07865c6E87B9F70255377e024ace6630C1Eaa37F': 6,  // USDC
};

// Chainlink ABI and LimitOrder ABI (include getOrderCount)
const chainlinkAbi = [
    {
        inputs: [],
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
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [{ type: 'uint8' }],
        stateMutability: 'view',
        type: 'function'
    }
];

const limitOrderAbi = [
    {
        inputs: [{ type: 'uint256' }],
        name: 's_orders',
        outputs: [
            { name: 'orderType', type: 'uint8' },
            { name: 'state', type: 'uint8' },
            { name: 'maker', type: 'address' },
            { name: 'tokenIn', type: 'address' },
            { name: 'tokenOut', type: 'address' },
            { name: 'amount', type: 'uint256' },
            { name: 'targetPrice', type: 'uint256' },
            { name: 'expiry', type: 'uint256' },
            { name: 'fee', type: 'uint16' },
            { name: 'executed', type: 'bool' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ type: 'uint256' }],
        name: 'executeOrder',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getOrders',
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    }
];

async function getChainlinkPrice(provider, feedAddress) {
    const priceFeed = new ethers.Contract(feedAddress, chainlinkAbi, provider);
    const [roundData, feedDecimals] = await Promise.all([
        priceFeed.latestRoundData(),
        priceFeed.decimals()
    ]);
    return { price: roundData.answer, decimals: feedDecimals };
}

async function getNormalizedPrice(provider, tokenAddress) {
    const checksumAddr = ethers.utils.getAddress(tokenAddress);
    const priceFeed = PRICE_FEEDS[checksumAddr];
    if (!priceFeed) throw new Error(`No price feed for token ${checksumAddr}`);

    const { price, decimals: feedDecimals } = await getChainlinkPrice(provider, priceFeed);
    const tokenDecimals = DECIMALS[checksumAddr];

    return price.mul(ethers.BigNumber.from(10).pow(18 - feedDecimals))
        .div(ethers.BigNumber.from(10).pow(tokenDecimals));
}

async function handler(event) {
    const client = new Defender(event);
    // Get the provider and signer using ethers v5 defaults
    const provider = client.relaySigner.getProvider();
    const signer = await client.relaySigner.getSigner(provider, { speed: 'fast' });

    const limitOrder = new ethers.Contract(LIMIT_ORDER_ADDRESS, limitOrderAbi, signer);
    const orderCount = await limitOrder.getOrders();

    for (let i = 0; i < orderCount; i++) {
        try {
            const order = await limitOrder.s_orders(i);
            if (order.executed || order.state !== 0) continue;
            if (order.expiry.lte(Math.floor(Date.now() / 1000))) continue;

            const [tokenInPrice, tokenOutPrice] = await Promise.all([
                getNormalizedPrice(provider, order.tokenIn),
                getNormalizedPrice(provider, order.tokenOut)
            ]);

            // Correct calculation without WeiPerEther
            const currentPrice = tokenInPrice.div(tokenOutPrice);
            const shouldExecute = order.orderType === 0
                ? currentPrice.lte(order.targetPrice)
                : currentPrice.gte(order.targetPrice);

            if (shouldExecute) {
                console.log(`Executing order ${i}`);
                const tx = await limitOrder.executeOrder(i);
                console.log(`Tx hash: ${tx.hash}`);
                await tx.wait();
            }
        } catch (error) {
            console.error(`Order ${i} error:`, error.message);
        }
    }
}

module.exports = { handler };
