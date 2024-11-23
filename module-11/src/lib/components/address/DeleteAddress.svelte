<script lang="ts">
    import { Button, Modal } from 'flowbite-svelte';
    import { X } from 'lucide-svelte';
    import { addressStore } from '$lib/stores/address';

    export let addressIndex: number;
    let showModal = false;

    function deleteAddress() {
        addressStore.update(store => {
            const newAddresses = store.addresses.filter((_, index) => index !== addressIndex);
            let newSelectedIndex = store.selectedIndex;

            if (addressIndex === store.selectedIndex) {
                newSelectedIndex = Math.max(0, store.selectedIndex - 1);
            } else if (addressIndex < store.selectedIndex) {
                newSelectedIndex--;
            }

            if (newAddresses.length === 0) {
                newSelectedIndex = 0;
            }

            return {
                ...store,
                addresses: newAddresses,
                selectedIndex: newSelectedIndex
            };
        });

        showModal = false;
    }
</script>

<!-- Styled to match your UI -->
<button
        class="inline-flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-100 transition-colors duration-200"
        on:click={() => showModal = true}
>
    <X class="w-4 h-4 text-gray-400 hover:text-gray-600" />
</button>

<Modal bind:open={showModal} size="xs" class="p-6">
    <div class="text-center">
        <h3 class="mb-4 text-lg font-semibold text-gray-900">Delete Account</h3>
        <p class="mb-6 text-gray-600 text-sm">
            Are you sure you want to delete this account? This action cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
            <Button
                    color="alternative"
                    class="px-4 py-2 text-sm font-medium"
                    on:click={() => showModal = false}
            >
                Cancel
            </Button>
            <Button
                    color="red"
                    class="px-4 py-2 text-sm font-medium"
                    on:click={deleteAddress}
            >
                Delete
            </Button>
        </div>
    </div>
</Modal>
