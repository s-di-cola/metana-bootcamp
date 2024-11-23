<script lang="ts">
    import {Card, Button, Input, Label, Badge, Modal} from 'flowbite-svelte';
    import {addressStore} from '$lib/stores/address';
    import {networkStore} from '$lib/stores/networks';
    import {ArrowUpRight, ArrowDownLeft, QrCode, ExternalLink, Wallet} from 'lucide-svelte';
    import {
        estimateGas,
        getBalance,
        getNonce,
        getGasPrice,
        prepareTransaction,
        signTransaction
    } from "$lib/utils/wallet";
    import QRCode from 'qrcode';

    let showSendModal = false;
    let showReceiveModal = false;
    let amount = '';
    let recipientAddress = '';
    let data = '0x';
    let loading = false;
    let error: string | null = null;
    let estimatedGas = BigInt(21000);
    let gasPrice = BigInt(0);
    let balance = BigInt(0);
    let qrCodeData = '';
    let transactionHash: string | null = null;

    $: selectedAddress = $addressStore.addresses[$addressStore.selectedIndex];
    $: isValidRecipientAddress = recipientAddress ? isValidAddress(recipientAddress) : true;
    $: addressError = recipientAddress && !isValidRecipientAddress ? 'Invalid Ethereum address format' : null;
    $: isValidData = data.startsWith('0x') && /^0x[0-9a-fA-F]*$/.test(data);
    $: dataError = data && !isValidData ? 'Invalid hex data format' : null;
    $: valueWei = amount ? BigInt(Math.floor(parseFloat(amount) * 1e18)) : BigInt(0);
    $: totalCostWei = valueWei + (estimatedGas * gasPrice);
    $: disabled = loading || !amount || !recipientAddress || !isValidRecipientAddress ||
        !isValidData || totalCostWei > balance;

    function isValidAddress(address: string): boolean {
        if (!address) return false;
        if (!address.startsWith('0x')) return false;
        if (address.length !== 42) return false;
        return /^0x[0-9a-fA-F]{40}$/i.test(address);
    }

    function formatEth(wei: bigint): string {
        return (Number(wei) / 1e18).toFixed(6);
    }

    function formatGwei(wei: bigint): string {
        return (Number(wei) / 1e9).toFixed(2);
    }

    function getEtherscanUrl(hash: string): string {
        const network = $networkStore.selectedNetwork.id;
        const subdomain = network === 'mainnet' ? '' : network + '.';
        return `https://${subdomain}etherscan.io/tx/${hash}`;
    }

    async function generateQRCode() {
        try {
            qrCodeData = await QRCode.toDataURL(`ethereum:${selectedAddress?.publicAddress}`);
        } catch (err) {
            console.error('Error generating QR code:', err);
        }
    }

    function resetForm() {
        amount = '';
        recipientAddress = '';
        data = '0x';
        error = null;
        transactionHash = null;
    }

    async function openSendModal() {
        resetForm();
        showSendModal = true;
    }

    async function openReceiveModal() {
        await generateQRCode();
        showReceiveModal = true;
    }

  
    async function handleTransfer() {
        if (!selectedAddress || !amount || !recipientAddress) {
            error = 'All fields are required';
            return;
        }

        if (!isValidAddress(recipientAddress)) {
            error = 'Invalid recipient address';
            return;
        }

        try {
            loading = true;
            error = null;
            transactionHash = null;

            const [currentNonce, currentGasPrice] = await Promise.all([
                getNonce(selectedAddress.publicAddress, $networkStore.selectedNetwork),
                getGasPrice($networkStore.selectedNetwork)
            ]);

            const txToSign = {
                nonce: currentNonce,
                gasPrice: currentGasPrice,
                gasLimit: estimatedGas,
                to: recipientAddress,
                value: valueWei,
                data: data,
                chainId: $networkStore.selectedNetwork.chainId
            };

            console.log('Transaction details:', {
                nonce: currentNonce,
                gasPrice: formatGwei(currentGasPrice) + ' Gwei',
                gasLimit: estimatedGas.toString(),
                value: formatEth(valueWei) + ' ETH',
                totalCost: formatEth(valueWei + (currentGasPrice * estimatedGas)) + ' ETH',
                balance: formatEth(balance) + ' ETH'
            });

            const prepared = prepareTransaction(txToSign);
            const signed = await signTransaction(
                prepared,
                selectedAddress.privateKey,
                $networkStore.selectedNetwork.chainId
            );

            const response = await fetch('/api/rpc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    baseURL: $networkStore.selectedNetwork.url,
                    method: 'eth_sendRawTransaction',
                    params: [signed.serialized]
                })
            });

            const responseData = await response.json();

            if (!response.ok || responseData.error) {
                throw new Error(responseData.error?.message || `Transaction failed: ${JSON.stringify(responseData)}`);
            }

            transactionHash = responseData;

            // Clear form
            amount = '';
            recipientAddress = '';
            data = '0x';

        } catch (e) {
            console.error('Transfer error:', e);
            error = (e as Error).message;
        } finally {
            loading = false;
        }
    }

    async function updateGasEstimate() {
        if (selectedAddress?.publicAddress && recipientAddress && amount && isValidAddress(recipientAddress)) {
            try {
                error = null;
                const valueWei = BigInt(Math.floor(parseFloat(amount) * 1e18));
                const valueHex = '0x' + valueWei.toString(16);

                const basicTx = {
                    from: selectedAddress.publicAddress,
                    to: recipientAddress,
                    value: valueHex,
                    data: data || '0x'
                };

                // Get current values
                const [newEstimatedGas, newGasPrice, newBalance] = await Promise.all([
                    estimateGas(basicTx, $networkStore.selectedNetwork),
                    getGasPrice($networkStore.selectedNetwork),
                    getBalance(selectedAddress.publicAddress, $networkStore.selectedNetwork)
                ]);

                // Update state
                estimatedGas = newEstimatedGas;
                gasPrice = newGasPrice;
                balance = newBalance;

            } catch (e) {
                console.error('Error updating gas estimate:', e);
                error = (e as Error).message;
            }
        }
    }

    $: if (amount && recipientAddress && isValidAddress(recipientAddress)) {
        updateGasEstimate();
    }
</script>

<Card size="xl">
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <div class="flex items-start gap-2">
                <Wallet class="w-6 h-6 text-gray-500 mt-1"/>
                <div>
                    <h3 class="text-xl font-semibold">Ethereum Transfer</h3>
                    <p class="text-sm text-gray-500">Send or receive ETH</p>
                </div>
            </div>
            <Badge>{$networkStore.selectedNetwork.name}</Badge>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <Button
                    color="dark"
                    class="flex items-center justify-center gap-2"
                    on:click={openSendModal}
            >
                <ArrowUpRight class="w-5 h-5"/>
                <span>Send ETH</span>
            </Button>

            <Button
                    color="dark"
                    class="flex items-center justify-center gap-2"
                    on:click={openReceiveModal}
            >
                <ArrowDownLeft class="w-5 h-5"/>
                <span>Receive ETH</span>
            </Button>
        </div>
    </div>
</Card>

<!-- Send Modal -->
<Modal
        bind:open={showSendModal}
        size="lg"
        autoclose={false}
        class="w-full"
>
    <div class="flex items-center gap-2 mb-6">
        <ArrowUpRight class="w-6 h-6 text-red-500"/>
        <h3 class="text-xl font-semibold">Send ETH</h3>
    </div>

    <div class="space-y-4">
        <div class="space-y-1">
            <Label for="recipient">Recipient Address</Label>
            <Input
                    id="recipient"
                    bind:value={recipientAddress}
                    placeholder="0x..."
                    class="font-mono"
                    invalid={!!addressError}
            />
            {#if addressError}
                <p class="text-sm text-red-600">{addressError}</p>
            {/if}
        </div>

        <div>
            <Label for="amount">Amount (ETH)</Label>
            <Input
                    id="amount"
                    type="number"
                    bind:value={amount}
                    step="0.000001"
                    min="0"
                    placeholder="0.0"
            />
        </div>

        <div class="space-y-1">
            <Label for="data">Data (hex)</Label>
            <Input
                    id="data"
                    bind:value={data}
                    placeholder="0x..."
                    class="font-mono"
                    invalid={!!dataError}
            />
            {#if dataError}
                <p class="text-sm text-red-600">{dataError}</p>
            {/if}
        </div>

        {#if amount && recipientAddress && isValidRecipientAddress}
            <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Network:</span>
                    <span class="font-medium">{$networkStore.selectedNetwork.name}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Transfer Amount:</span>
                    <span class="font-medium">{formatEth(valueWei)} ETH</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Gas Units (Limit):</span>
                    <span class="font-medium">{estimatedGas.toString()}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Gas Price:</span>
                    <span class="font-medium">{formatGwei(gasPrice)} Gwei</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Max Gas Cost:</span>
                    <span class="font-medium">{formatEth(estimatedGas * gasPrice)} ETH</span>
                </div>
                <div class="border-t pt-2 flex justify-between font-medium">
                    <span>Total Cost:</span>
                    <span>{formatEth(totalCostWei)} ETH</span>
                </div>
                <div class="flex justify-between text-sm text-gray-600">
                    <span>Balance:</span>
                    <span>{formatEth(balance)} ETH</span>
                </div>
            </div>
        {/if}

        {#if transactionHash}
            <div class="bg-green-50 p-4 rounded-lg space-y-3">
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p class="text-green-700 font-medium">Transaction submitted successfully!</p>
                </div>
                <div class="space-y-2">
                    <p class="text-sm text-green-600">
                        Your transaction has been submitted to the network and is being processed.
                    </p>
                    <div class="flex flex-col gap-2">
                        <div class="text-sm text-gray-600">
                            <span class="font-medium">Transaction Hash: </span>
                            <span class="font-mono break-all">{transactionHash}</span>
                        </div>
                        <a
                                href={getEtherscanUrl(transactionHash)}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            View on Etherscan
                            <ExternalLink class="w-3 h-3"/>
                        </a>
                    </div>
                </div>
            </div>

            <div class="flex gap-2">
                <Button color="light" on:click={() => showSendModal = false}>
                    Close
                </Button>
                <Button color="dark" on:click={() => {
                    resetForm();
                }}>
                    Send Another Transaction
                </Button>
            </div>
        {:else}
            <div class="flex gap-2">
                <Button color="light" on:click={() => showSendModal = false}>
                    Cancel
                </Button>
                <Button
                        color="dark"
                        disabled={disabled}
                        on:click={handleTransfer}
                >
                    {#if loading}
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending Transaction...
                        </div>
                    {:else}
                        Send ETH
                    {/if}
                </Button>
            </div>
        {/if}

        {#if error}
            <div class="bg-red-50 p-4 rounded-lg space-y-2">
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                    <p class="text-red-700 font-medium">Transaction Failed</p>
                </div>
                <p class="text-sm text-red-600">{error}</p>
            </div>
        {/if}
    </div>
</Modal>

<!-- Receive Modal -->
<Modal bind:open={showReceiveModal} size="md" autoclose={false}>
    <div class="flex items-center gap-2 mb-6">
        <ArrowDownLeft class="w-6 h-6 text-green-500"/>
        <h3 class="text-xl font-semibold">Receive ETH</h3>
    </div>

    <div class="space-y-4">
        <div class="space-y-2">
            <Label>Your Address (Share to receive ETH)</Label>
            <div class="flex items-center gap-2">
                <Input
                        value={selectedAddress?.publicAddress}
                        readonly
                        class="font-mono"
                />
                <Button
                        color="dark"
                        on:click={() => {
                        navigator.clipboard.writeText(selectedAddress?.publicAddress);
                    }}
                >
                    <QrCode class="w-4 h-4"/>
                </Button>
            </div>
        </div>

        {#if qrCodeData}
            <div class="flex flex-col items-center gap-4 py-4">
                <img src={qrCodeData} alt="QR Code" class="w-48 h-48"/>
                <p class="text-sm text-gray-500">Scan this QR code to get the address</p>
            </div>
        {/if}

        <Button color="light" class="w-full" on:click={() => showReceiveModal = false}>
            Close
        </Button>
    </div>
</Modal>
