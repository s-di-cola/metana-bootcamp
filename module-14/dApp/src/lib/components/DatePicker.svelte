<script lang="ts">
	import { Label, Input } from 'svelte-5-ui-lib';

	let { value, onChange, label = 'Expiry Date & Time' } = $props<{
		value: bigint;
		onChange: (value: bigint) => void;
		label?: string;
	}>();

	// Get current date and set to current time
	function getCurrentDateTime(): string {
		const now = new Date();
		// Format to match datetime-local input (YYYY-MM-DDThh:mm)
		return now.toISOString().slice(0, 16);
	}

	let minDateTime = $state(getCurrentDateTime());

	function timestampToDatetimeLocal(timestamp: bigint): string {
		const date = new Date(Number(timestamp) * 1000);
		return date.toISOString().slice(0, 16); // Format: "YYYY-MM-DDThh:mm"
	}

	function handleChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const selectedDate = new Date(input.value);

		// Validate that selected date is in the future
		if (selectedDate <= new Date()) {
			// Reset to minimum date/time if selection is in the past
			input.value = minDateTime;
			const currentTimestamp = BigInt(Math.floor(Date.now() / 1000));
			onChange(currentTimestamp);
			return;
		}

		const timestamp = BigInt(Math.floor(selectedDate.getTime() / 1000));
		onChange(timestamp);
	}
</script>

<div>
	<Label for="expiry" class="mb-2">
		{label}
	</Label>
	<Input
		id="expiry"
		type="datetime-local"
		class="w-full"
		min={minDateTime}
		value={timestampToDatetimeLocal(value)}
		oninput={handleChange}
	/>
</div>
