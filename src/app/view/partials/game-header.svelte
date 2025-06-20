<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import { GameSetupState, type _GameState } from '@app/model';

	interface Props {
		state: _GameState;
	}

	let { state }: Props = $props();
</script>

<nav class="bg-background flex items-center justify-between border-b p-2 pr-4">
	<Button variant="outline" onclick={() => state.app.closeGame()}><ArrowLeft /></Button>
	{#if state instanceof GameSetupState}
		<div class="flex flex-col items-end">
			<p class="font-bold">Game Setup</p>
			<p class="text-xs text-gray-400">Add players to start the game!</p>
		</div>
	{/if}
</nav>
