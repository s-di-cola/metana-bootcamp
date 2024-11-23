<script lang="ts">
    import { Card, Heading, Badge, Button } from 'flowbite-svelte';
    import { getBalance } from '$lib/utils/wallet';
    import { addressStore } from '$lib/stores/address';
    import { networkStore } from '$lib/stores/networks';
    import { onMount, onDestroy } from "svelte";
    import { Wallet, RefreshCw } from 'lucide-svelte';

    let balance: bigint = BigInt(0);
    let ethPrice: string = "0";
    let isLoading = true;
    let isRefreshing = false;
    let priceInterval: NodeJS.Timer;

    function formatEth(wei: bigint): string {
        return (Number(wei) / 1e18).toFixed(6);
    }

    $: ethBalance = formatEth(balance);
    $: usdValue = (Number(ethBalance) * parseFloat(ethPrice));

    $: if ($addressStore.addresses[$addressStore.selectedIndex]?.publicAddress && $networkStore.selectedNetwork) {
        getBalanceForAddress();
    }

    async function fetchEthPrice() {
        try {
            const response = await fetch('/api/price/ETH');
            const priceData = await response.json();
            ethPrice = priceData.data[0].prices[0].value;
        } catch (err) {
            console.error('Error fetching ETH price:', err);
        }
    }

    async function getBalanceForAddress() {
        isLoading = true;
        const currentAddress = $addressStore.addresses[$addressStore.selectedIndex]?.publicAddress;
        if (currentAddress) {
            balance = await getBalance(currentAddress, $networkStore.selectedNetwork);
        }
        isLoading = false;
    }

    async function handleRefresh() {
        isRefreshing = true;
        await Promise.all([
            getBalanceForAddress(),
            fetchEthPrice()
        ]);
        isRefreshing = false;
    }

    onMount(async () => {
        await Promise.all([
            getBalanceForAddress(),
            fetchEthPrice()
        ]);
        priceInterval = setInterval(fetchEthPrice, 60000);
    });

    onDestroy(() => {
        if (priceInterval) clearInterval(priceInterval.toString());
    });
</script>

<Card size="xl">
    <div class="space-y-3">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Wallet class="w-5 h-5 text-gray-500" />
                <span class="text-gray-500">Available Balance</span>
            </div>
            <div class="flex items-center gap-2">
                <Badge>{$networkStore.selectedNetwork.name}</Badge>
                <Button color="light" size="sm" on:click={handleRefresh} disabled={isRefreshing} class="!p-2">
                    <RefreshCw class="w-4 h-4 {isRefreshing ? 'animate-spin' : ''}" />
                </Button>
            </div>
        </div>

        <div>
            <Heading tag="h2" class="text-3xl font-bold mb-2">
                {#if isLoading}
                    Loading...
                {:else}
                    ETH: {ethBalance}
                {/if}
            </Heading>
        </div>

        {#if !isLoading}
            <div class="text-sm text-gray-500 flex justify-between">
                <span>${usdValue}</span>
                <span>ETH: ${parseFloat(ethPrice).toFixed(2)}</span>
            </div>
        {/if}
    </div>
</Card>
