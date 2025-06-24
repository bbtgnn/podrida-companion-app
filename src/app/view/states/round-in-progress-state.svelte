<script lang="ts">
	import type { RoundInProgressState } from '@app/model';
	import Container from '../partials/container.svelte';
	import { Button } from '$lib/components/ui/button';
	import PlayersTable from '../partials/players-table.svelte';

	interface Props {
		state: RoundInProgressState;
	}

	let { state }: Props = $props();
	const game = $derived(state.game);
	const round = $derived(state.round);
</script>

<Container>
	<PlayersTable players={state.getPlayersOrder()}>
		{#snippet rightHeader()}
			<p>Bet</p>
		{/snippet}
		{#snippet right({ player })}
			{@const bet = state.round.bets[player.id]}
			<p>{bet}</p>
		{/snippet}
	</PlayersTable>

	{#snippet footer()}
		<Button onclick={() => state.endRound()}>End Round & Record Results</Button>
	{/snippet}
</Container>
