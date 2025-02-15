import {
	createPublicClient,
	createWalletClient,
	custom,
	http,
	type Hash,
	type Address
} from 'viem';
import { contract, virtual_mainnet } from '$lib/configs/tenderly.config';
import type { Order } from '$lib/types';
import IERC20 from '$lib/contract/abis/IERC20.json';

const publicClient = createPublicClient({
	chain: virtual_mainnet,
	transport: http()
});

async function placeOrder(order: Order): Promise<Hash> {
	const walletClient = createWalletClient({
		chain: virtual_mainnet,
		transport: custom(window.ethereum as any)
	});

	const [account] = await walletClient.requestAddresses();

	const { request } = await publicClient.simulateContract({
		account,
		...contract,
		functionName: 'placeOrder',
		args: [
			order.orderType,
			order.tokenIn,
			order.tokenOut,
			order.amount,
			order.targetPrice,
			order.expiry,
			order.fee
		]
	});

	const hash = await walletClient.writeContract(request);
	const receipt = await publicClient.waitForTransactionReceipt({ hash });

	// Check for token allowance and approve if necessary
	const allowance = (await publicClient.readContract({
		abi: IERC20,
		address: order.tokenIn as Address,
		functionName: 'allowance',
		args: [account, contract.address]
	})) as bigint;

	if (allowance < order.amount) {
		const approveRequest = await publicClient.simulateContract({
			account,
			abi: IERC20,
			address: order.tokenIn as Address,
			functionName: 'approve',
			args: [contract.address, order.amount]
		});
		await walletClient.writeContract(approveRequest.request);
	}

	return receipt.transactionHash;
}

export { placeOrder };
