import { contract, virtual_mainnet } from '$lib/configs/tenderly.config';
import { createPublicClient, createWalletClient, custom, http, type Hex, type Abi } from 'viem';

const publicClient = createPublicClient({
	chain: virtual_mainnet,
	transport: http()
});

async function cancelOrder(orderId: bigint): Promise<Hex> {
	const walletClient = createWalletClient({
		chain: virtual_mainnet,
		transport: custom(window.ethereum)
	});

	const [account] = await walletClient.requestAddresses();

	const { request } = await publicClient.simulateContract({
		account,
		abi: contract.abi as any,
		address: contract.address,
		functionName: 'cancelOrder',
		args: [orderId]
	});

	const hash = await walletClient.writeContract(request);
	const receipt = await publicClient.waitForTransactionReceipt({ hash });
	return receipt.transactionHash;
}

export default cancelOrder;
