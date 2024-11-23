<script lang="ts">
    import { Select, Label } from 'flowbite-svelte';
    import { Network } from 'lucide-svelte';
    import { networkStore } from '$lib/stores/networks';

    // Convert networks to SelectOptionType format
    $: selectOptions = $networkStore.networks.map(network => ({
        name: network.name,
        value: network.id
    }));

    const handleNetworkChange = (event: Event) => {
        const select = event.target as HTMLSelectElement;
        const newNetwork = $networkStore.networks.find(n => n.id === select.value);
        if (newNetwork) {
            networkStore.update(store => ({
                ...store,
                selectedNetwork: newNetwork
            }));
        }
    };
</script>

<div class="flex items-center gap-4 mb-4">
    <div class="flex items-center gap-2">
        <Network class="w-5 h-5 text-gray-500" />
        <Label>Network</Label>
    </div>
    <Select
            class="w-48"
            items={selectOptions}
            value={$networkStore.selectedNetwork.id}
            on:change={handleNetworkChange}
    >
        <svelte:fragment slot="default" let:item>{item.name}</svelte:fragment>
    </Select>
</div>
