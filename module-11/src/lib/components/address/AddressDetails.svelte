<script lang="ts">
    import { Button } from 'flowbite-svelte';
    import { Copy, Check, Eye, EyeOff } from 'lucide-svelte';

    export let publicAddress: string;
    export let privateKey: string;

    let showPrivateKey = false;
    let copySuccess: Record<string, boolean> = {};

    async function copyToClipboard(text: string, key: string) {
        await navigator.clipboard.writeText(text);
        copySuccess[key] = true;
        setTimeout(() => {
            copySuccess[key] = false;
        }, 2000);
    }

    function truncatePrivateKey(key: string) {
        return `${key.slice(0, 22)}...${key.slice(-22)}`;
    }
</script>

<div class="px-3 py-4 bg-gray-50 space-y-4">
    <!-- Public Address -->
    <div>
        <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700">
                Public Address
            </label>
            <Button
                    size="xs"
                    color="light"
                    on:click={() => copyToClipboard(publicAddress, 'public')}
            >
                {#if copySuccess['public']}
                    <Check class="h-4 w-4 mr-1"/>
                    Copied!
                {:else}
                    <Copy class="h-4 w-4 mr-1"/>
                    Copy
                {/if}
            </Button>
        </div>
        <div class="flex items-center bg-white rounded-lg border px-3 py-2 text-sm font-mono text-gray-600 break-all">
            {publicAddress}
        </div>
    </div>

    <!-- Private Key -->
    <div>
        <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700">
                Private Key
            </label>
            <div class="flex gap-2">
                {#if showPrivateKey}
                    <Button
                            size="xs"
                            color="light"
                            on:click={() => copyToClipboard(privateKey, 'private')}
                    >
                        {#if copySuccess['private']}
                            <Check class="h-4 w-4 mr-1"/>
                            Copied!
                        {:else}
                            <Copy class="h-4 w-4 mr-1"/>
                            Copy
                        {/if}
                    </Button>
                {/if}
                <Button
                        size="xs"
                        color="light"
                        on:click={() => showPrivateKey = !showPrivateKey}
                >
                    {#if showPrivateKey}
                        <EyeOff class="h-4 w-4 mr-1"/>
                        Hide
                    {:else}
                        <Eye class="h-4 w-4 mr-1"/>
                        Show
                    {/if}
                </Button>
            </div>
        </div>
        <div class="flex items-center bg-white rounded-lg border px-3 py-2 text-sm font-mono text-gray-600 break-all">
            {#if showPrivateKey}
                {truncatePrivateKey(privateKey)}
            {:else}
                {'•'.repeat(32)}
            {/if}
        </div>
    </div>
</div>
