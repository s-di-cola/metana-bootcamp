<script>
    import Balance from "$lib/components/Balance.svelte";
    import Address from "$lib/components/address/Address.svelte";
    import Transactions from "$lib/components/Transactions.svelte";
    import ETHTransfer from "$lib/components/ETHTransfer.svelte";
    import NetworkSelector from "$lib/components/NetworkSelector.svelte";
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-1/3 p-4">
        <NetworkSelector/>
        <Address/>
        <Balance/>
        <Transactions/>
        <ETHTransfer/>
    </div>
</div>
