<script lang="ts">
    import { Button, Modal } from 'flowbite-svelte';
    import { CheckCircleOutline, ClockOutline, BanOutline, PlusOutline } from 'flowbite-svelte-icons';
	import PlaceOrder from '$lib/components/PlaceOrder.svelte';
    let currentFilter: 'all' | 'active' | 'pending' | 'cancelled' = 'all';
    let isCreateOrderModalOpen = false; // Use this instead of showCreateOrderModal

    function handleOrderCreated(event) {
        const newOrder = event.detail;
        console.log('New order created:', newOrder);
        // Add logic to process the new order
    }
    // Expanded mock orders data
    let orders = [
        {
            id: '1',
            pair: 'ETH/USDC',
            type: 'Buy',
            amount: 0.5,
            limitPrice: 2000,
            status: 'active',
            timestamp: '2024-02-08 10:30:45'
        },
        {
            id: '2',
            pair: 'USDC/ETH',
            type: 'Sell',
            amount: 250,
            limitPrice: 0.0005,
            status: 'pending',
            timestamp: '2024-02-08 11:15:22'
        },
        {
            id: '3',
            pair: 'WBTC/USDC',
            type: 'Buy',
            amount: 0.1,
            limitPrice: 50000,
            status: 'cancelled',
            timestamp: '2024-02-08 09:45:11'
        },
        // Additional mock transactions
        {
            id: '4',
            pair: 'BNB/USDT',
            type: 'Buy',
            amount: 2,
            limitPrice: 300,
            status: 'active',
            timestamp: '2024-02-07 15:22:33'
        },
        {
            id: '5',
            pair: 'ADA/ETH',
            type: 'Sell',
            amount: 1000,
            limitPrice: 0.00035,
            status: 'pending',
            timestamp: '2024-02-07 16:45:12'
        },
        {
            id: '6',
            pair: 'DOT/USDC',
            type: 'Buy',
            amount: 50,
            limitPrice: 6.5,
            status: 'cancelled',
            timestamp: '2024-02-06 14:30:00'
        },
        {
            id: '7',
            pair: 'SOL/USDT',
            type: 'Sell',
            amount: 10,
            limitPrice: 100,
            status: 'active',
            timestamp: '2024-02-06 12:15:45'
        },
        {
            id: '8',
            pair: 'LINK/ETH',
            type: 'Buy',
            amount: 25,
            limitPrice: 0.005,
            status: 'pending',
            timestamp: '2024-02-05 17:50:22'
        }
    ];

    // Status configuration
    const statusConfig = {
        active: {
            color: 'green',
            icon: CheckCircleOutline
        },
        pending: {
            color: 'yellow',
            icon: ClockOutline
        },
        cancelled: {
            color: 'red',
            icon: BanOutline
        }
    };

    function formatDate(timestamp: string) {
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Computed property for filtered orders
    $: filteredOrders = currentFilter === 'all'
        ? orders
        : orders.filter(order => order.status === currentFilter);

    // Function to set filter and update displayed orders
    function setFilter(filter: 'all' | 'active' | 'pending' | 'cancelled') {
        currentFilter = currentFilter === filter ? 'all' : filter;
    }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col max-w-3xl mx-auto p-6">
    <!-- Header -->
    <header class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">Limit Order dApp</h1>
        <div class="flex items-center gap-4">
            <Button
                    color="red"
                    on:click={() => isCreateOrderModalOpen = true}
            class="flex items-center gap-2"
            >
            <PlusOutline class="w-4 h-4" />
            Create New Order
            </Button>
            <Button color="blue">Connect Wallet</Button>
        </div>
    </header>

    <!-- Overview Cards -->
    <div class="grid grid-cols-4 gap-4 mb-8">
        {#each [
            {
                label: 'Total Volume',
                value: '$1,234,567',
                filter: 'all'
            },
            {
                label: 'Active Orders',
                value: '24',
                filter: 'active'
            },
            {
                label: 'Pending Orders',
                value: '12',
                filter: 'pending'
            },
            {
                label: 'Executed Orders',
                value: '56',
                filter: 'cancelled'
            }
        ] as stat}
            <div
                    role="button"
                    tabindex="0"
                    class="bg-white shadow-md rounded-xl p-4 text-center cursor-pointer
                    hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500
                    {currentFilter === stat.filter ? 'ring-2 ring-blue-500' : ''}"
                    on:click={() => setFilter(stat.filter)}
                    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && setFilter(stat.filter)}
                    aria-pressed={currentFilter === stat.filter}
            >
                <h5 class="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h5>
                <p class="text-gray-500 text-xs">{stat.label}</p>
            </div>
        {/each}
    </div>

    <!-- Orders Section with Scrolling -->
    <div class="flex-grow overflow-auto space-y-4 mb-6">
        {#each filteredOrders as order}
            <div class="bg-white shadow-md rounded-xl p-5">
                <div class="flex justify-between items-center">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <h4 class="text-lg font-semibold">{order.pair}</h4>
                            <span class="text-sm text-gray-500">
                                {formatDate(order.timestamp)}
                            </span>
                        </div>
                        <div class="text-sm text-gray-600">
                            {order.type} • Amount: {order.amount} • Limit Price: {order.limitPrice}
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <svelte:component
                                this={statusConfig[order.status].icon}
                                class="w-5 h-5 text-{statusConfig[order.status].color}-500"
                        />
                        <span class="capitalize text-{statusConfig[order.status].color}-500">
                            {order.status}
                        </span>
                        {#if order.status === 'pending'}
                            <Button color="light" size="sm">Cancel</Button>
                        {/if}
                    </div>
                </div>
            </div>
        {/each}
    </div>
    <PlaceOrder
            bind:isOpen={isCreateOrderModalOpen}
            on:orderCreated={handleOrderCreated}
    />
</div>
