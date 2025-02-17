import { createPublicClient, http, type Address, formatUnits } from 'viem';
import { virtual_mainnet } from '$lib/configs/tenderly.config';

const erc20Abi = [
	{
		name: 'symbol',
		type: 'function',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'string' }]
	},
	{
		name: 'decimals',
		type: 'function',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'uint8' }]
	}
] as const;

const client = createPublicClient({
	chain: virtual_mainnet,
	transport: http()
});

export interface TokenInfo {
	symbol: string;
	decimals: number;
}

// Cache for token info to avoid repeated calls
const tokenInfoCache = new Map<string, TokenInfo>();

export async function getTokenInfo(address: Address): Promise<TokenInfo> {
	const cached = tokenInfoCache.get(address);
	if (cached) return cached;

	try {
		const [symbol, decimals] = await Promise.all([
			client.readContract({
				address,
				abi: erc20Abi,
				functionName: 'symbol'
			}),
			client.readContract({
				address,
				abi: erc20Abi,
				functionName: 'decimals'
			})
		]);

		const tokenInfo = { symbol, decimals };
		tokenInfoCache.set(address, tokenInfo);
		return tokenInfo;
	} catch (error) {
		console.error(`Error fetching token info for ${address}:`, error);
		// Return a fallback with shortened address as symbol and 18 decimals
		return {
			symbol: `${address.slice(0, 6)}...${address.slice(-4)}`,
			decimals: 18
		};
	}
}

export function formatTokenAmount(amount: bigint, decimals: number): string {
	try {
		return formatUnits(amount, decimals);
	} catch (error) {
		console.error('Error formatting token amount:', error);
		return amount.toString();
	}
}
