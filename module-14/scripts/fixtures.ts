import { createWalletClient, http, parseEther, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { virtual_mainnet } from "../dApp/src/lib/config/chains";
import {config} from 'dotenv';
config({path: '../.env'});

// IMPORTANT: Replace with your actual private key
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

// Contract and token addresses
const LIMIT_ORDER_ADDRESS = "0xBD6F10eC5927d3ee421A6796497314C6AdaC1191";

// Token addresses on mainnet
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

// Updated ABI to match new contract interface
const abi = [
    {
        "inputs": [
            {"internalType": "enum LimitOrder.OrderType", "name": "orderType", "type": "uint8"},
            {"internalType": "address", "name": "tokenIn", "type": "address"},
            {"internalType": "address", "name": "tokenOut", "type": "address"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"},
            {"internalType": "uint256", "name": "targetPrice", "type": "uint256"},
            {"internalType": "uint256", "name": "expiry", "type": "uint256"},
            {"internalType": "uint16", "name": "fee", "type": "uint16"}
        ],
        "name": "placeOrder",
        "outputs": [{"internalType": "uint256", "name": "orderID", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_orderID", "type": "uint256"}],
        "name": "cancelOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;

// Create wallet client using private key
const account = privateKeyToAccount(PRIVATE_KEY);
const client = createWalletClient({
    account,
    chain: virtual_mainnet,
    transport: http(virtual_mainnet.rpcUrls.default.http[0]),
});

// More diverse token pairs
const pairs = [
    { tokenIn: USDC, tokenOut: WETH, fee: 500 },
    { tokenIn: WETH, tokenOut: USDC, fee: 500 },
    { tokenIn: WBTC, tokenOut: USDC, fee: 500 },
    { tokenIn: DAI, tokenOut: WETH, fee: 3000 },
    { tokenIn: WETH, tokenOut: DAI, fee: 3000 }
];

async function placeOrders() {
    const now = Math.floor(Date.now() / 1000);

    // Create and place 10 different orders
    for (let i = 0; i < 2; i++) {
        const pair = pairs[i % pairs.length];

        // Alternate between BUY and SELL
        const orderType = i % 2 === 0 ? 0 : 1;

        // Vary amount based on token decimals
        const amount = pair.tokenIn === USDC || pair.tokenIn === DAI
            ? parseUnits(((i + 1) * 100).toString(), 6)  // Stablecoins have 6 decimals
            : parseEther(((i + 1) * 0.01).toString());   // ETH/BTC tokens have 18 decimals

        // Dynamic target prices
        const basePrice = orderType === 0 ? 1800 : 2200;
        const targetPrice = parseEther((basePrice + (i * 50)).toString());

        // Varied expiry times
        const expiry = now + (86400 * (i + 1)); // Different expiry times, up to 10 days

        console.log(`Placing order ${i + 1}/10...`);

        try {
            const hash = await client.writeContract({
                address: LIMIT_ORDER_ADDRESS,
                abi,
                functionName: 'placeOrder',
                args: [
                    orderType,
                    pair.tokenIn,
                    pair.tokenOut,
                    amount,
                    targetPrice,
                    expiry,
                    pair.fee
                ]
            });

            console.log(`Order ${i + 1} placed. Tx: ${hash}`);

            // Randomly cancel some orders
            if (i % 3 === 0) {
                console.log(`Cancelling order ${i}...`);
                await client.writeContract({
                    address: LIMIT_ORDER_ADDRESS,
                    abi,
                    functionName: 'cancelOrder',
                    args: [i]
                });
            }
        } catch (error) {
            console.error(`Error placing/cancelling order ${i + 1}:`, error);
        }
    }
}

(async () => {
    try {
        console.log(`Placing orders from wallet: ${account.address}`);
        await placeOrders();
        console.log("Done!");
    } catch (e) {
        console.error("Unexpected error:", e);
        process.exitCode = 1;
    }
})();
