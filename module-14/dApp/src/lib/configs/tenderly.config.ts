import { type Address, defineChain } from 'viem';
import limitOrderAbi from '$lib/contract/abis/LimitOrder.json';

export const virtual_mainnet = defineChain({
	id: 9898998,
	name: 'Tenderly Virtual Mainnet',
	nativeCurrency: {
		name: 'VETH',
		symbol: 'VETH',
		decimals: 18
	},
	rpcUrls: {
		default: {
			http: ['https://virtual.mainnet.rpc.tenderly.co/a65bcf13-d6f5-48a4-ae02-128b471ff0d8']
		}
	},
	blockExplorers: {
		default: {
			name: 'Tenderly Explorer',
			url: 'https://dashboard.tenderly.co/sdicola/project/testnet/65d7fc5c-e361-4775-9e21-28378f4271e5'
		}
	}
});

export const contract = {
	address: '0xf65a0930ac58e0640d46b60a038dd8406512834c' as Address,
	abi: limitOrderAbi.abi
};
