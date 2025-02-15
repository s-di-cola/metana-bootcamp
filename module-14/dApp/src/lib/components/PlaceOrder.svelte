<script lang="ts">
	import { Button, Input, Label, Modal } from 'svelte-5-ui-lib';
	import { ArrowUpOutline, ArrowDownOutline, DollarOutline } from 'flowbite-svelte-icons';
	import { placeOrder } from '$lib/contract/place-order';
	import { getTokenInfo } from '$lib/utils/token';
	import type { Address } from 'viem';
	import { OrderType } from '$lib/types';
	import type { Order } from '$lib/types';
	import Notifier from '$lib/components/Notifier.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';

	let modalStatus = $state(false);
	let isLoading = $state(false);
	let customTokenInAddress = $state('');
	let customTokenOutAddress = $state('');
	let showNotifier: boolean = $state(false);
	let notifierMessage: string = $state('');
	let notifierType: 'success' | 'error' = $state('success');


	const commonTokens = [
		// Major DeFi Tokens
		{ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', label: 'WETH', symbol: 'WETH' },
		{ value: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', label: 'USDC', symbol: 'USDC' },
		{ value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', label: 'WBTC', symbol: 'WBTC' },
		{ value: '0xdAC17F958D2ee523a2206206994597C13D831ec7', label: 'USDT', symbol: 'USDT' },
		{ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F', label: 'DAI', symbol: 'DAI' },
		// Exchange & DeFi Platform Tokens
		{ value: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52', label: 'BNB', symbol: 'BNB' },
		{ value: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', label: 'AAVE', symbol: 'AAVE' },
		{ value: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', label: 'UNI', symbol: 'UNI' },
		{ value: '0x514910771AF9Ca656af840dff83E8264EcF986CA', label: 'LINK', symbol: 'LINK' },
		{ value: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', label: 'MKR', symbol: 'MKR' },
		// Popular DeFi & Gaming Tokens
		{ value: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', label: 'SHIB', symbol: 'SHIB' },
		{ value: '0x4d224452801ACEd8B2F0aebE155379bb5D594381', label: 'APE', symbol: 'APE' },
		{ value: '0x6810e776880C02933D47DB1b9fc05908e5386b96', label: 'GNO', symbol: 'GNO' },
		{ value: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7', label: 'GRT', symbol: 'GRT' },
		{ value: '0xD533a949740bb3306d119CC777fa900bA034cd52', label: 'CRV', symbol: 'CRV' },
		// Layer 2 & Scaling Tokens
		{ value: '0x4d224452801ACEd8B2F0aebE155379bb5D594381', label: 'OP', symbol: 'OP' },
		{ value: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', label: 'SUSHI', symbol: 'SUSHI' },
		{ value: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0', label: 'SAND', symbol: 'SAND' },
		{ value: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942', label: 'MANA', symbol: 'MANA' },
		{ value: '0x4a220E6096B25EADb88358cb44068A3248254675', label: 'QNT', symbol: 'QNT' }
	];

	// Uniswap V3 default fee tiers
	const feeTiers = [
		{ value: 100, label: '0.01%' },
		{ value: 500, label: '0.05%' },
		{ value: 3000, label: '0.3%' },
		{ value: 10000, label: '1%' }
	];

	let orderForm = $state({
		tokenIn: '' as Address,
		tokenOut: '' as Address,
		amount: null as number | null,
		limitPrice: null as number | null,
		orderType: OrderType.BUY,
		fee: 500, // Default to 0.05%
		expiry: BigInt(Math.floor(Date.now() / 1000) + 7 * 86400) // Default to 7 days from now
	});

	let tokenInInfo = $state({ symbol: '', decimals: 18 });
	let tokenOutInfo = $state({ symbol: '', decimals: 18 });
	let tokenInError = $state('');
	let tokenOutError = $state('');

	let isFormValid = $derived(
		orderForm.tokenIn &&
		orderForm.tokenOut &&
		orderForm.tokenIn !== orderForm.tokenOut &&
		orderForm.amount !== null &&
		orderForm.amount > 0 &&
		orderForm.limitPrice !== null &&
		orderForm.limitPrice > 0 &&
		!tokenInError &&
		!tokenOutError
	);

	async function validateTokenAddress(address: string): Promise<boolean> {
		try {
			if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
				return false;
			}
			await getTokenInfo(address as Address);
			return true;
		} catch (error) {
			console.error('Token validation error:', error);
			return false;
		}
	}

	async function handleTokenInChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const address = input.value;

		try {
			if (await validateTokenAddress(address)) {
				orderForm.tokenIn = address as Address;
				tokenInInfo = await getTokenInfo(address as Address);
				tokenInError = '';
			} else {
				tokenInError = 'Invalid token address';
			}
		} catch (error) {
			tokenInError = 'Error validating token';
			console.error(error);
		}
	}

	async function handleTokenOutChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const address = input.value;

		try {
			if (await validateTokenAddress(address)) {
				orderForm.tokenOut = address as Address;
				tokenOutInfo = await getTokenInfo(address as Address);
				tokenOutError = '';
			} else {
				tokenOutError = 'Invalid token address';
			}
		} catch (error) {
			tokenOutError = 'Error validating token';
			console.error(error);
		}
	}

	function handleCommonTokenSelect(type: 'in' | 'out', tokenAddress: Address) {
		if (type === 'in') {
			customTokenInAddress = tokenAddress;
			handleTokenInChange({ target: { value: tokenAddress } } as any);
		} else {
			customTokenOutAddress = tokenAddress;
			handleTokenOutChange({ target: { value: tokenAddress } } as any);
		}
	}

	async function handleCreateOrder() {
		if (!isFormValid) return;

		try {
			isLoading = true;

			const order: Order = {
				...orderForm,
				amount: BigInt(Math.floor(orderForm.amount! * 10 ** tokenInInfo.decimals)),
				targetPrice: BigInt(Math.floor(orderForm.limitPrice! * 10 ** 8)),
				fee: orderForm.fee,
				expiry: orderForm.expiry || BigInt(Math.floor(Date.now() / 1000) + 7 * 86400)
			};

			const hash = await placeOrder(order);
			console.log('Order placed:', hash);

			modalStatus = false;
			resetForm();
		} catch (error) {
			showNotifier = true;
			notifierType = 'error';
			notifierMessage = `Error placing order: ${error.message}`;
			console.error('Error placing order:', error);
		} finally {
			isLoading = false;
		}
	}

	function resetForm() {
		orderForm = {
			tokenIn: '' as Address,
			tokenOut: '' as Address,
			amount: null,
			limitPrice: null,
			orderType: OrderType.BUY,
			fee: 500,
			expiry: BigInt(Math.floor(Date.now() / 1000) + 86400)
		};
		customTokenInAddress = '';
		customTokenOutAddress = '';
		tokenInInfo = { symbol: '', decimals: 18 };
		tokenOutInfo = { symbol: '', decimals: 18 };
		tokenInError = '';
		tokenOutError = '';
	}

	$effect(() => {
		if (!modalStatus) {
			resetForm();
		}
	});
</script>

<!-- Trigger Button -->
<div class="flex flex-wrap gap-2">
	<Button color="dark" size="sm" onclick={() => modalStatus = true}>
		<DollarOutline />
		Place Order
	</Button>
</div>

<Modal {modalStatus} class="p-4 z-50" closeModal={() => modalStatus = false}>
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl overflow-hidden">
			<!-- Header -->
			<div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Create New Limit Order</h2>
				<button
					class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
					onclick={() => modalStatus = false}
				>
					<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Form Content -->
			<div class="p-6 space-y-6">
				<!-- Token Selection -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- From Token -->
					<div class="space-y-2">
						<Label for="tokenIn" class="text-sm font-medium">From Token</Label>
						<Input
							id="tokenIn"
							type="text"
							class="w-full"
							placeholder="Token Address (0x...)"
							value={customTokenInAddress}
							oninput={handleTokenInChange}
						/>
						{#if tokenInError}
							<p class="text-red-500 text-sm">{tokenInError}</p>
						{/if}
						{#if tokenInInfo.symbol}
							<div class="flex items-center space-x-2">
								<span class="text-green-500">✓</span>
								<p class="text-green-600 text-sm">Selected: {tokenInInfo.symbol}</p>
							</div>
						{/if}
						<div class="mt-2">
							<p class="text-sm text-gray-500 mb-2">Common Tokens:</p>
							<div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
								{#each commonTokens as token}
									<button
										class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
										onclick={() => handleCommonTokenSelect('in', token.value as Address)}
									>
										{token.symbol}
									</button>
								{/each}
							</div>
						</div>
					</div>

					<!-- To Token -->
					<div class="space-y-2">
						<Label for="tokenOut" class="text-sm font-medium">To Token</Label>
						<Input
							id="tokenOut"
							type="text"
							class="w-full"
							placeholder="Token Address (0x...)"
							value={customTokenOutAddress}
							oninput={handleTokenOutChange}
						/>
						{#if tokenOutError}
							<p class="text-red-500 text-sm">{tokenOutError}</p>
						{/if}
						{#if tokenOutInfo.symbol}
							<div class="flex items-center space-x-2">
								<span class="text-green-500">✓</span>
								<p class="text-green-600 text-sm">Selected: {tokenOutInfo.symbol}</p>
							</div>
						{/if}
						<div class="mt-2">
							<p class="text-sm text-gray-500 mb-2">Common Tokens:</p>
							<div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
								{#each commonTokens as token}
									<button
										class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
										onclick={() => handleCommonTokenSelect('out', token.value as Address)}
									>
										{token.symbol}
									</button>
								{/each}
							</div>
						</div>
					</div>
				</div>

				<!-- Amount, Price, Fee, and Expiry -->
				<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
					<div class="space-y-2">
						<Label for="amount" class="text-sm font-medium">Amount</Label>
						<Input
							id="amount"
							type="number"
							class="w-full"
							placeholder="Enter amount"
							value={orderForm.amount?.toString() ?? ''}
							oninput={(e) => orderForm.amount = parseFloat(e.target.value)}
							min="0"
							step="0.0001"
						/>
					</div>

					<div class="space-y-2">
						<Label for="limitPrice" class="text-sm font-medium">Limit Price (USDC)</Label>
						<Input
							id="limitPrice"
							type="number"
							class="w-full"
							placeholder="Enter limit price"
							value={orderForm.limitPrice?.toString() ?? ''}
							oninput={(e) => orderForm.limitPrice = parseFloat(e.target.value)}
							min="0"
							step="0.0001"
						/>
					</div>

					<div class="space-y-2">
						<Label for="fee" class="text-sm font-medium">Fee Tier</Label>
						<select
							id="fee"
							class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
							bind:value={orderForm.fee}
						>
							{#each feeTiers as tier}
								<option value={tier.value}>{tier.label}</option>
							{/each}
						</select>
					</div>

					<DatePicker
						value={orderForm.expiry}
						onChange={(newValue) => orderForm.expiry = newValue}
						label="Order Expiry"
					/>
				</div>

				<!-- Order Type -->
				<div class="space-y-2">
					<Label class="text-sm font-medium">Order Type</Label>
					<div class="grid grid-cols-2 gap-4">
						<button
							type="button"
							class="flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all duration-200
                {orderForm.orderType === OrderType.BUY
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'border-gray-200 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800'}"
							onclick={() => orderForm.orderType = OrderType.BUY}
						>
							<ArrowUpOutline class="w-5 h-5 mr-2" />
							Buy
						</button>

						<button
							type="button"
							class="flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all duration-200
                {orderForm.orderType === OrderType.SELL
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                  : 'border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800'}"
							onclick={() => orderForm.orderType = OrderType.SELL}
						>
							<ArrowDownOutline class="w-5 h-5 mr-2" />
							Sell
						</button>
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
				<button
					type="button"
					class="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
            {isFormValid && !isLoading
              ? 'bg-black hover:bg-gray-800 text-white cursor-pointer'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'}"
					disabled={!isFormValid || isLoading}
					onclick={handleCreateOrder}
				>
					{#if isLoading}
            <span class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Order...
            </span>
					{:else}
						Create Order
					{/if}
				</button>
			</div>
		</div>
	</div>
</Modal>
{#if showNotifier}
	<Notifier
		type={notifierType}
		message={notifierMessage}
	/>
{/if}
