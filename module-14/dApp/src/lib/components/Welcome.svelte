<script>
	import { Button, Card, Heading, P } from 'svelte-5-ui-lib';
</script>

<div class="container mx-auto px-4 py-6 max-w-5xl">
	<div class="flex justify-center items-center min-h-[calc(100vh-100px)]">
		<Card
			class="text-center max-w-lg w-full bg-white shadow-lg rounded-xl"
			size="lg"
			padding="xl"
		>
			<Heading tag="h2" class="mb-4 text-2xl font-bold text-gray-900">
				Welcome to Limit Orders
			</Heading>
			<P class="mb-6 text-center text-base text-gray-600">
				Connect your wallet to start placing and managing limit orders for your crypto assets
			</P>
			<div class="flex justify-center">
				<appkit-button
					label="Connect Wallet"
					balance="hide"
					size="md"
					loadingLabel="Connecting..."
				/>
			</div>
		</Card>
	</div>
</div>
