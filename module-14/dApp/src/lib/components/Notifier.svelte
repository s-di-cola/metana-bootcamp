<script lang="ts">
	import { Toast } from 'svelte-5-ui-lib';
	import { fly } from 'svelte/transition';
	import { linear } from 'svelte/easing';

	const { type, message } = $props<{ type: 'success' | 'error', message: string }>();
</script>
	<Toast
		color={type === 'success' ? 'green' : 'red'}
		position="top-left"
		transition={fly}
		params={{duration:300,easing:linear,x:150}}
	>
		{message}
	</Toast>
