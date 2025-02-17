<script lang="ts">
	import { Heading, P, Span, Toast } from 'svelte-5-ui-lib';
	import { onMount } from 'svelte';
	import { type Address, createPublicClient } from 'viem';
	import { http } from 'wagmi';
	import { virtual_mainnet } from '$lib/configs/tenderly.config';
	import { modal } from '$lib/configs/wallet.config';
	import type { Order } from '$lib/types';
	import type { UseAppKitAccountReturn } from '@reown/appkit';
	import { fetchOrders } from '$lib/graphql/graphql';
	import OrdersOverview from '$lib/components/OrdersOverview.svelte';
	import OrderDetails from '$lib/components/OrderDetails.svelte';
	import Welcome from '$lib/components/Welcome.svelte';
	import PlaceOrder from '$lib/components/PlaceOrder.svelte';
	import { fly } from 'svelte/transition';
	import { linear } from 'svelte/easing';

	let isConnected = $state(false);
	let orders = $state<Order[]>([]);
	let account = $state<Address | undefined>();
	let unwatch: (() => void) | undefined;
	let selectedState = $state<string | null>(null);
	let showToast = $state(false);
	let toastMessage = $state('');
	let toastType = $state<'success' | 'error'>('success');

	let filteredOrders = $derived(selectedState
		? orders.filter(o => o.state === selectedState)
		: orders
	);

	const publicClient = createPublicClient({
		chain: virtual_mainnet,
		transport: http()
	});

	async function startWatchingBlocks() {
		if (unwatch) {
			unwatch();
		}
		unwatch = publicClient.watchBlocks({
			onBlock: async () => {
				console.log('New block mined! Refreshing orders...');
				await refreshOrders();
			}
		});
	}

	async function refreshOrders() {
		if (!account) return;
		try {
			orders = await fetchOrders(account.toString());
		} catch (error) {
			console.error('Error fetching orders:', error);
		}
	}

	function handleStateClick(state: string | null) {
		selectedState = selectedState === state ? null : state;
	}

	function handleTransactionStatus({ success, message }: { success: boolean, message: string }) {
		toastMessage = message;
		toastType = success ? 'success' : 'error';
		showToast = true;
		setTimeout(() => showToast = false, 5000);
	}

	onMount(() => {
		// Subscribe to account changes (address, connection status)
		modal.subscribeAccount((newAccount: UseAppKitAccountReturn) => {
			account = newAccount.address as Address;
			isConnected = !!account;
			if (account) {
				refreshOrders();
				startWatchingBlocks();
			}
		});
	});
</script>

<div class="min-h-screen bg-gray-50">
	{#if !isConnected}
		<Welcome />
	{:else}
		<div class="container mx-auto px-4 py-6 max-w-5xl">
			<div class="flex justify-end">
				<appkit-button balance="hide"></appkit-button>
				<PlaceOrder />
			</div>
			<div class="flex justify-center items-center flex-col mb-6">
				<Heading tag="h1" class="mb-2 text-4xl font-extrabold md:text-5xl text-center">
					<Span gradient="amberToEmerald">Limit Order</Span> Dashboard
				</Heading>
				<P class="text-gray-600">Place and manage your limit orders with ease</P>
			</div>
			<OrdersOverview
				{orders}
				onStateClick={handleStateClick}
				selectedState={selectedState}
			/>

			<div class="mt-6 space-y-3">
				{#each filteredOrders as order (order.orderID)}
					<OrderDetails
						{order}
						onTransactionStatus={handleTransactionStatus}
					/>
				{/each}
			</div>
		</div>
	{/if}
</div>

{#if showToast}
	<div class="relative h-56">
	<Toast
		position="bottom-right"
		color={toastType === 'success' ? 'green' : 'red'}
		transition={fly}
		params={{duration:300,easing:linear,x:150}}
	>
		{toastMessage}
	</Toast>
	</div>
{/if}
