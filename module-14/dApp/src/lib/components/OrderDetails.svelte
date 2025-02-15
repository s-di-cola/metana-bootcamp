<script lang="ts">
	import { Card, Badge, Button, P, Label } from 'svelte-5-ui-lib';
	import { LinkOutline, CloseCircleSolid } from 'flowbite-svelte-icons';
	import { type Address } from 'viem';
	import { getTokenInfo, formatTokenAmount } from '$lib/utils/token';
	import type { Order } from '$lib/types';
	import cancelOrder from '$lib/contract/cancel-order';
	import { virtual_mainnet } from '$lib/configs/tenderly.config';

	let { order, onTransactionStatus } = $props<{
		order: Order,
		onTransactionStatus: (status: { success: boolean, message: string }) => void
	}>();
	let tokenPair = $state('Loading...');
	let amount = $state('Loading...');
	let isLoading = $state(false);

	function formatTimestamp(timestamp: string | number): string {
		try {
			const date = new Date(Number(timestamp) * 1000);
			if (isNaN(date.getTime())) {
				return 'Invalid Date';
			}
			return new Intl.DateTimeFormat('default', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			}).format(date);
		} catch (error) {
			console.error('Error formatting timestamp:', error);
			return 'Invalid Date';
		}
	}

	function formatExpiry(expiry?: bigint): string {
		// If expiry is undefined or null, return 'No expiry'
		if (expiry === undefined || expiry === null) {
			return 'No expiry';
		}

		const date = new Date(Number(expiry) * 1000);
		return new Intl.DateTimeFormat('default', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}

	function getExplorerLink(hash: string): string {
		return `${virtual_mainnet.blockExplorers.default.url}/tx/mainnet/${hash}`;
	}

	async function handleCancel() {
		if (!order.orderID) return;
		try {
			isLoading = true;
			const tx = await cancelOrder(BigInt(order.orderID));
			onTransactionStatus({
				success: true,
				message: `Order #${order.orderID} cancelled successfully`
			});
		} catch (error) {
			console.error('Error cancelling order:', error);
			onTransactionStatus({
				success: false,
				message: 'Failed to cancel order. Please try again.'
			});
		} finally {
			isLoading = false;
		}
	}

	$effect(() => {
		Promise.all([
			getTokenInfo(order.tokenIn as Address),
			getTokenInfo(order.tokenOut as Address)
		]).then(([inToken, outToken]) => {
			tokenPair = `${inToken.symbol}/${outToken.symbol}`;
			amount = formatTokenAmount(order.amount, inToken.decimals);
		});
	});

	const statusColors = {
		PLACED: 'yellow',
		EXECUTED: 'green',
		CANCELLED: 'red'
	};
</script>

<Card
	size="lg"
	padding="xl"
	class="max-w-4xl mx-auto bg-white hover:shadow-xl transition-all duration-200"
	rounded="xl"
>
	<div class="flex justify-between items-start mb-6">
		<div class="space-y-1">
			<div class="flex items-center gap-3">
				<P size="lg" weight="semibold">Order #{order.orderID}</P>
				<Badge
					color={statusColors[order.state]}
					rounded="full"
					gradient
					border
					size="lg"
					class="uppercase tracking-wider"
				>
					{order.state}
				</Badge>
			</div>
			<P size="sm" color="muted">Created {formatTimestamp(order.timestamp)}</P>
		</div>

		{#if order.transactionHash}
			<a
				href={getExplorerLink(order.transactionHash)}
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary-600 hover:text-primary-700 p-2 hover:bg-gray-50 rounded-full transition-colors"
			>
				<LinkOutline class="w-5 h-5" />
			</a>
		{/if}
	</div>

	<div class="grid grid-cols-4 gap-x-12 gap-y-4">
		<div>
			<Label class="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Trading Pair</Label>
			<P weight="medium">{tokenPair}</P>
		</div>
		<div>
			<Label class="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</Label>
			<P weight="medium">{amount}</P>
		</div>
		<div>
			<Label class="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Limit Price</Label>
			<P weight="medium">
				${formatTokenAmount(order.targetPrice, 8)} USDC
			</P>
		</div>
		<div>
			<Label class="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</Label>
			<P weight="medium">{formatExpiry(order.expiry)}</P>
		</div>
	</div>

	{#if order.state === 'PLACED'}
		<div class="mt-6 flex justify-end ">
			<Button
				size="sm"
				color="red"
				disabled={isLoading}
				onclick={handleCancel}
				pill
			>
				<CloseCircleSolid class="me-2 h-5 w-5 " />
				Cancel Order
			</Button>
		</div>
	{/if}
</Card>
