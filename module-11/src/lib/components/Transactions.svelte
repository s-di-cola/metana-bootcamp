<script lang="ts">
    import {
        Card,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Badge,
        Button
    } from 'flowbite-svelte';
    import {Clock, ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight, RefreshCw} from 'lucide-svelte';
    import {addressStore} from '$lib/stores/address';
    import {networkStore} from '$lib/stores/networks';

    $: currentAddress = $addressStore.addresses[$addressStore.selectedIndex]?.publicAddress;

    interface Transaction {
        blockNumber: string;
        from: string;
        to: string;
        value: string;
        hash: string;
        timeStamp: string;
    }

    let transactions: Transaction[] = [];
    let loading = true;
    let error: string | null = null;
    let currentPage = 0;
    const pageSize = 10;

    function formatEther(wei: string): string {
        const value = BigInt(wei);
        const divisor = BigInt('1000000000000000000');
        const quotient = value / divisor;
        const fraction = value % divisor;
        const decimals = fraction.toString().padStart(18, '0').slice(0, 4);
        return `${quotient}.${decimals}`;
    }

    async function fetchTransactions() {
        transactions = [];
        loading = true;
        error = null;
        currentPage = 0;

        if (!currentAddress) {
            loading = false;
            return;
        }

        try {
            const response = await fetch(`/api/transactions?address=${currentAddress}&network=${$networkStore.selectedNetwork.id}`);
            const data = await response.json();

            if (data.status === '1' && Array.isArray(data.result)) {
                transactions = data.result.map((tx: any) => ({
                    blockNumber: tx.blockNumber,
                    from: tx.from,
                    to: tx.to,
                    value: tx.value,
                    hash: tx.hash,
                    timeStamp: tx.timeStamp
                }));
            } else {
                throw new Error(data.message || 'Failed to fetch transactions');
            }
        } catch (e) {
            console.error('Transaction fetch error:', e);
            error = e instanceof Error ? e.message : 'Failed to fetch transactions';
        } finally {
            loading = false;
        }
    }

    $: if (currentAddress && $networkStore.selectedNetwork) {
        fetchTransactions();
    }

    $: paginatedTransactions = transactions.slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize
    );

    $: totalPages = Math.ceil(transactions.length / pageSize);

    function nextPage() {
        if (currentPage < totalPages - 1) currentPage++;
    }

    function prevPage() {
        if (currentPage > 0) currentPage--;
    }

    function truncateAddress(addr: string): string {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    }

    function getTransactionType(tx: Transaction): 'sent' | 'received' {
        return tx.from.toLowerCase() === currentAddress.toLowerCase() ? 'sent' : 'received';
    }

    function getBlockExplorerUrl(hash: string): string {
        const network = $networkStore.selectedNetwork.id;
        const subdomain = network === 'mainnet' ? '' : network + '.';
        return `https://${subdomain}etherscan.io/tx/${hash}`;
    }

    function formatDate(timestamp: string): string {
        return new Date(parseInt(timestamp) * 1000).toLocaleString();
    }

    async function handleRefresh() {
        await fetchTransactions();
    }

    $: showPagination = transactions.length > pageSize;

</script>

<Card size="xl">
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Clock class="w-5 h-5 text-gray-500"/>
                <h3 class="text-lg font-semibold">Transaction History</h3>
            </div>
            <div class="flex items-center gap-2">
                <Badge>{$networkStore.selectedNetwork.name}</Badge>
                <Button color="light" size="sm" on:click={handleRefresh} class="!p-2">
                    <RefreshCw class="w-4 h-4"/>
                </Button>
            </div>
        </div>

        {#if loading}
            <p class="text-gray-500">Loading transactions...</p>
        {:else if error}
            <p class="text-red-500">{error}</p>
        {:else if transactions.length === 0}
            <p class="text-gray-500">No transactions found</p>
        {:else}
            <Table noborder={true}>
                <TableHead class="border-b">
                    <TableHeadCell>Type</TableHeadCell>
                    <TableHeadCell>Hash</TableHeadCell>
                    <TableHeadCell>Time</TableHeadCell>
                    <TableHeadCell>Block</TableHeadCell>
                    <TableHeadCell>Value (ETH)</TableHeadCell>
                </TableHead>
                <TableBody>
                    {#each paginatedTransactions as tx}
                        <TableBodyRow>
                            <TableBodyCell>
                                {#if getTransactionType(tx) === 'received'}
                                    <Badge color="green" class="flex items-center gap-1">
                                        <ArrowDownLeft class="w-4 h-4"/>
                                        Received
                                    </Badge>
                                {:else}
                                    <Badge color="red" class="flex items-center gap-1">
                                        <ArrowUpRight class="w-4 h-4"/>
                                        Sent
                                    </Badge>
                                {/if}
                            </TableBodyCell>
                            <TableBodyCell>
                                <a
                                        href={getBlockExplorerUrl(tx.hash)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-blue-600 hover:underline"
                                >
                                    {truncateAddress(tx.hash)}
                                </a>
                            </TableBodyCell>
                            <TableBodyCell>{formatDate(tx.timeStamp)}</TableBodyCell>
                            <TableBodyCell>{parseInt(tx.blockNumber).toString()}</TableBodyCell>
                            <TableBodyCell>{formatEther(tx.value)}</TableBodyCell>
                        </TableBodyRow>
                    {/each}
                </TableBody>
            </Table>
        {/if}
        {#if showPagination}
            <div class="flex flex-col items-center gap-2 mt-4">
                <div class="flex gap-2">
                    <Button
                            size="xs"
                            disabled={currentPage === 0}
                            on:click={prevPage}
                    >
                        <ChevronLeft class="w-3 h-3"/>
                        Prev
                    </Button>
                    <Button
                            size="xs"
                            disabled={currentPage === totalPages - 1}
                            on:click={nextPage}
                    >
                        Next
                        <ChevronRight class="w-3 h-3"/>
                    </Button>
                </div>
                <div class="text-sm text-gray-500">
                    Showing {currentPage * pageSize + 1}
                    to {Math.min((currentPage + 1) * pageSize, transactions.length)} of {transactions.length}
                    transactions
                </div>
            </div>
        {/if}
    </div>
</Card>
