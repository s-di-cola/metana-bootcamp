<script lang="ts">
	import { Card, Label, P } from 'svelte-5-ui-lib';
	import type { Order } from '$lib/types';

	let { orders, onStateClick, selectedState } = $props<{
		orders: Order[],
		onStateClick: (state: string | null) => void,
		selectedState: string | null
	}>();

	let counts = $derived({
		PLACED: orders.filter(o => o.state === 'PLACED').length,
		EXECUTED: orders.filter(o => o.state === 'EXECUTED').length,
		CANCELLED: orders.filter(o => o.state === 'CANCELLED').length
	});

	const stateConfig = {
		PLACED: {
			label: 'PENDING ORDERS',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
			color: 'text-yellow-500'
		},
		EXECUTED: {
			label: 'EXECUTED ORDERS',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>`,
			color: 'text-green-500'
		},
		CANCELLED: {
			label: 'CANCELLED ORDERS',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>`,
			color: 'text-red-500'
		}
	};
</script>

<div class="grid grid-cols-3 gap-4 mb-6 max-w-4xl mx-auto">
	{#each Object.entries(stateConfig) as [state, config]}
		<Card
			size="lg"
			padding="lg"
			rounded="xl"
			class={`cursor-pointer transition-all duration-200 bg-white hover:shadow-xl
				${selectedState === state ? 'ring-2 ring-primary-500' : 'hover:ring-2 hover:ring-primary-200'}`}
			onclick={() => onStateClick(state)}
		>
			<div class="p-4">
				<div class="flex items-center justify-between mb-3">
					<Label class="text-xs font-medium text-gray-500 uppercase tracking-wider">{config.label}</Label>
					<svg class={`w-5 h-5 ${config.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
						{@html config.icon}
					</svg>
				</div>
				<P size="3xl" weight="bold" class="mt-2">{counts[state]}</P>
			</div>
		</Card>
	{/each}
</div>
