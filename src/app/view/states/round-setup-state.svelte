<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { RoundSetupState } from '@app/model';
	import Container from '../partials/container.svelte';
	import BetInput from '../partials/bet-input.svelte';
	import PlayersTable from '../partials/players-table.svelte';

	interface Props {
		state: RoundSetupState;
	}

	let { state }: Props = $props();

	$effect(() => {
		state.allPlayersExceptLastHaveBet();
	});

	$inspect(state.round.bets);
</script>

<Container>
	<PlayersTable players={state.getPlayersOrder()}>
		{#snippet right({ player, isLast })}
			<BetInput
				bind:value={() => state.round.bets[player.id], (v) => state.addBet(player.id, v)}
				max={state.round.numberOfCards}
				invalidBet={isLast ? state.getInvalidBetForLastPlayer() : undefined}
				disabled={isLast && !state.allPlayersExceptLastHaveBet()}
			/>
		{/snippet}
	</PlayersTable>

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
