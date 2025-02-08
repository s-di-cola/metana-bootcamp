<script lang="ts">
    import { Button, Modal, Select } from 'flowbite-svelte';
    import { ArrowUpCircle, ArrowDownCircle } from 'lucide-svelte';

    export let onOrderCreated: (order: typeof orderForm) => void = () => {};
    export let isOpen = false;

    const tokens = [
        { value: 'ETH', name: 'Ethereum (ETH)' },
        { value: 'USDC', name: 'USD Coin (USDC)' },
        { value: 'WBTC', name: 'Wrapped Bitcoin (WBTC)' },
        { value: 'BNB', name: 'Binance Coin (BNB)' },
        { value: 'ADA', name: 'Cardano (ADA)' },
        { value: 'DOT', name: 'Polkadot (DOT)' },
        { value: 'USDT', name: 'Tether (USDT)' }
    ];

    let orderForm = {
        fromToken: '',
        toToken: '',
        amount: null as number | null,
        limitPrice: null as number | null,
        orderType: 'buy'
    };

    $: isFormValid =
        orderForm.fromToken &&
        orderForm.toToken &&
        orderForm.fromToken !== orderForm.toToken &&
        orderForm.amount !== null &&
        orderForm.amount > 0 &&
        orderForm.limitPrice !== null &&
        orderForm.limitPrice > 0;

    function createOrder() {
        if (isFormValid) {
            onOrderCreated(orderForm);
            isOpen = false;
        }
    }

    $: if (!isOpen) {
        orderForm = {
            fromToken: '',
            toToken: '',
            amount: null,
            limitPrice: null,
            orderType: 'buy'
        };
    }

    function handleAmountInput(event: Event) {
        const input = event.target as HTMLInputElement;
        const value = parseFloat(input.value);
        orderForm.amount = isNaN(value) || value < 0 ? null : value;
    }

    function handleLimitPriceInput(event: Event) {
        const input = event.target as HTMLInputElement;
        const value = parseFloat(input.value);
        orderForm.limitPrice = isNaN(value) || value < 0 ? null : value;
    }
</script>

<Modal bind:open={isOpen} title="Create New Limit Order" size="md" class="w-full max-w-md ">
    <form onsubmit={(event) => { event.preventDefault(); createOrder(); }} class="space-y-6 p-4">
        <!-- Token Selection -->
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label for="fromToken" class="block mb-2 text-sm font-medium text-gray-800">From Token</label>
                <Select id="fromToken" bind:value={orderForm.fromToken} items={tokens} placeholder="Select From Token" class="w-full" />
            </div>

            <div>
                <label for="toToken" class="block mb-2 text-sm font-medium text-gray-800">To Token</label>
                <Select id="toToken" bind:value={orderForm.toToken} items={tokens.filter(token => token.value !== orderForm.fromToken)} placeholder="Select To Token" class="w-full" />
            </div>
        </div>

        <!-- Amount Input -->
        <div>
            <label for="amount" class="block mb-2 text-sm font-medium text-gray-800">Amount</label>
            <input type="number" id="amount" oninput={handleAmountInput} step="0.0001" min="0"
                   value={orderForm.amount !== null ? orderForm.amount : ''}
                   class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="$" required
            />
        </div>

        <!-- Limit Price Input -->
        <div>
            <label for="limitPrice" class="block mb-2 text-sm font-medium text-gray-800">Limit Price</label>
            <input type="number" id="limitPrice" oninput={handleLimitPriceInput} step="0.0001" min="0"
                   value={orderForm.limitPrice !== null ? orderForm.limitPrice : ''}
                   class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="$" required
            />
        </div>

        <!-- Order Type -->
        <div>
            <label class="block mb-2 text-sm font-medium text-gray-800">Order Type</label>
            <div class="grid grid-cols-2 gap-4">
                <Button
                        type="button"
                        color={orderForm.orderType === 'buy' ? 'green' : 'gray'}
                        class="w-full flex justify-center items-center"
                        on:click={() => orderForm.orderType = 'buy'}
                >
                    <ArrowUpCircle size={20} class="mr-2" />
                    Buy
                </Button>

                <Button
                        type="button"
                        color={orderForm.orderType === 'sell' ? 'red' : 'gray'}
                        class="w-full flex justify-center items-center"
                        on:click={() => orderForm.orderType = 'sell'}
                >
                    <ArrowDownCircle size={20} class="mr-2" />
                    Sell
                </Button>
            </div>
        </div>

        <!-- Submit Button -->
        <Button type="submit" color="blue" class="w-full disabled:opacity-50" disabled={!isFormValid}>
            Create Limit Order
        </Button>
    </form>
</Modal>
