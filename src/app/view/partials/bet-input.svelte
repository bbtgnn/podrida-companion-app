<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Array } from 'effect';

	type Props = {
		value: number;
		max: number;
		invalidBet: number | undefined;
		disabled?: boolean;
	};

	let { value = $bindable(), invalidBet, max, disabled = false }: Props = $props();
</script>

<div class="flex items-center gap-1">
	{#each Array.range(0, max) as number}
		<Button
			variant="secondary"
			size="icon"
			disabled={disabled || number == invalidBet}
			onclick={() => {
				value = number;
			}}
			class={{ 'bg-primary text-white': value == number }}
		>
			{number}
		</Button>
	{/each}
</div>
