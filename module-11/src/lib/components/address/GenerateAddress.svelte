<script lang="ts">
    import { Button } from 'flowbite-svelte';
    import { PlusCircle } from 'lucide-svelte';
    import { generateKeysPair } from '$lib/utils/wallet';
    import { addressStore } from '$lib/stores/address';

    function generateNewAddress() {
        const { privateKey, publicAddress } = generateKeysPair();
        addressStore.update(store => ({
            addresses: [...store.addresses, { privateKey, publicAddress }],
            selectedIndex: store.addresses.length
        }));
    }
</script>

<Button color="dark" on:click={generateNewAddress}>
    <PlusCircle class="mr-2 h-4 w-4" />
    New Account
</Button>
