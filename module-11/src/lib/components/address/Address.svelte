<script lang="ts">
    import { Button, Card, Heading } from 'flowbite-svelte';
    import { Wallet, ChevronDown, ChevronUp, Shield } from 'lucide-svelte';
    import { addressStore } from '$lib/stores/address';
    import DeleteAddress from "$lib/components/address/DeleteAddress.svelte";
    import GenerateAddress from "./GenerateAddress.svelte";
    import AddressDetails from "$lib/components/address/AddressDetails.svelte";

    let expandedIndex: number | null = null;

    function toggleExpand(index: number, event: MouseEvent) {
        event.stopPropagation();
        expandedIndex = expandedIndex === index ? null : index;
    }

    function selectAddress(index: number) {
        addressStore.update(store => ({
            ...store,
            selectedIndex: index
        }));
    }

    function handleKeyPress(event: KeyboardEvent, index: number) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectAddress(index);
        }
    }

    $: isExpanded = (index: number) => index === expandedIndex;
    $: isSelected = (index: number) => index === $addressStore.selectedIndex;
</script>

<Card size="xl">
    <div class="space-y-6">
        <!-- Header Section -->
        <div class="flex justify-between items-center">
            <div class="flex items-start gap-2">
                <Shield class="w-6 h-6 text-gray-500 mt-1" />
                <div>
                    <Heading tag="h2" class="text-2xl font-bold mb-1">Ethereum Account</Heading>
                    <p class="text-gray-500 text-sm">Manage your Ethereum addresses</p>
                </div>
            </div>
            <GenerateAddress />
        </div>

        <!-- Account List -->
        {#if $addressStore.addresses.length > 0}
            <div class="border rounded-lg divide-y">
                {#each $addressStore.addresses as address, index}
                    <div class="bg-white">
                        <div
                                role="button"
                                tabindex="0"
                                class="w-full px-3 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 cursor-pointer
                                {isSelected(index) ? 'bg-blue-50' : ''}
                                {isExpanded(index) ? 'bg-gray-50' : ''}"
                                on:click={() => selectAddress(index)}
                                on:keydown={(e) => handleKeyPress(e, index)}
                                aria-label="Select Account {index + 1}"
                        >
                            <div class="flex items-center gap-2">
                                <Wallet class="w-4 h-4 text-gray-500" />
                                <div class="text-left">
                                    <div class="font-medium">Account {index + 1}</div>
                                    <div class="text-sm text-gray-500">
                                        {address.publicAddress.slice(0, 6)}...{address.publicAddress.slice(-4)}
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <DeleteAddress addressIndex={index}/>
                                <div
                                        role="button"
                                        tabindex="0"
                                        class="p-1 hover:bg-gray-100 rounded"
                                        on:click={(e) => toggleExpand(index, e)}
                                        on:keydown={(e) => e.key === 'Enter' && toggleExpand(index, e)}
                                        aria-label={isExpanded(index) ? "Collapse details" : "Expand details"}
                                >
                                    {#if isExpanded(index)}
                                        <ChevronUp class="w-4 h-4 text-gray-400"/>
                                    {:else}
                                        <ChevronDown class="w-4 h-4 text-gray-400"/>
                                    {/if}
                                </div>
                            </div>
                        </div>

                        {#if isExpanded(index)}
                            <AddressDetails
                                    publicAddress={address.publicAddress}
                                    privateKey={address.privateKey}
                            />
                        {/if}
                    </div>
                {/each}
            </div>
        {:else}
            <div class="text-gray-500 p-2 border rounded">
                No accounts created yet
            </div>
        {/if}
    </div>
</Card>
