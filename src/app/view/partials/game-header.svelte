<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import { GameSetupState, type _GameState } from '@app/model';

	interface Props {
		state: _GameState;
	}

	let { state }: Props = $props();
</script>

{#if state instanceof GameSetupState}
	<nav class="bg-background flex items-center justify-between border-b p-2 pr-4">
		<!-- <Button variant="outline" onclick={() => state.app.exitGame()}><ArrowLeft /></Button> -->
		<div class="flex flex-col items-end">
			<p class="font-bold">Game Setup</p>
			<p class="text-xs text-gray-400">Add players to start the game!</p>
		</div>
	</nav>
{/if}
