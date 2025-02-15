import { type Address, defineChain } from 'viem';
import limitOrderAbi from "$lib/contract/abis/LimitOrder.json";

export const virtual_mainnet = defineChain({
  id: 1,
  name: 'Virtual Mainnet',
  nativeCurrency: {
    name: 'VETH',
    symbol: 'VETH',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://virtual.mainnet.rpc.tenderly.co/5a63e6ed-9e7a-448e-bd49-1fcf1bbe2f22']
    }
  },
  blockExplorers: {
    default: {
      name: 'Tenderly Explorer',
      url: 'https://dashboard.tenderly.co/sdicola/project/testnet/d963b8e2-ba38-48d8-91cb-bf8c02d77345'
    }
  },
  network: 'mainnet',
  // Required for defineChain
  contracts: {},
  testnet: false,
  sourceId: 1
});

export const contract = {
  address: '0xeaa1934dff38dad950831f4b3b0c7d1a449f2720' as Address,
  abi: limitOrderAbi.abi
};
