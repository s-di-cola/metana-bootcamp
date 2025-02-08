import { writable } from "svelte/store";

export type Network = {
    id: string;
    name: string;
    chainId: number;
    url: string;
}

const networks: Network[] = [
    {
        id: 'sepolia',
        name: 'Sepolia Testnet',
        chainId: 11155111, // decimal for 0xaa36a7
        url: 'https://eth-sepolia.g.alchemy.com/v2'
    },
    {
        id: 'holesky',
        name: 'Holesky Testnet',
        chainId: 17000,    // decimal for 0x4268
        url: 'https://eth-holesky.g.alchemy.com/v2'
    },
    {
        id: 'mainnet',
        name: 'Ethereum Mainnet',
        chainId: 1,        // decimal for 0x1
        url: 'https://eth-mainnet.g.alchemy.com/v2'
    }
];

export const networkStore = writable({
    networks,
    selectedNetwork: networks[0]
});
