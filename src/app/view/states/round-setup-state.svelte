<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { RoundSetupState } from '@app/model';
	import Container from '../partials/container.svelte';

	interface Props {
		state: RoundSetupState;
	}

	let { state }: Props = $props();
</script>

<Container>
	{#each state.getPlayersOrder() as player}
		<div>
			<Label for="bet-{player.id}">{player.name}</Label>
			<div>
				<Input
					id="bet-{player.id}"
					type="number"
					min="0"
					max={state.round.numberOfCards}
					bind:value={state.round.bets[player.id]}
				/>
			</div>
		</div>
	{/each}

	{#snippet footer()}
		<Button
			onclick={(e) => {
				e.preventDefault();
				state.startRound();
			}}
			disabled={!state.canStartRound()}
			class="w-full"
			size="lg"
		>
			Start Round
		</Button>
	{/snippet}
</Container>
