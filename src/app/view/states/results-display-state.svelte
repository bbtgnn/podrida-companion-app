<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import type { ResultsDisplayState } from '@app/model';

	interface Props {
		state: ResultsDisplayState;
	}

	let { state }: Props = $props();
</script>

<div class="results-display">
	<div class="results-card">
		<h1>Results</h1>

		<table class="w-full">
			<tbody>
				{#each state.game.getCurrentPlacings() as placement, index}
					<tr>
						<td>{index + 1}</td>
						<td>{placement.playerName}</td>
						<td>{placement.points}</td>
					</tr>
				{/each}
			</tbody>
		</table>

		{#if !state.isGameOver()}
			{#if state.canStartReturn()}
				<pre>{state.game.nextDirection}</pre>
				<Label>
					<Switch
						checked={state.isNextDirectionBackward()}
						onCheckedChange={() => state.toggleStartReturn()}
					/>
					<span>Start return</span>
				</Label>
			{/if}
			<Button onclick={() => state.nextRound()}>Next Round</Button>
		{:else}
			<Button onclick={() => state.endGame()}>End Game</Button>
		{/if}
	</div>
</div>
