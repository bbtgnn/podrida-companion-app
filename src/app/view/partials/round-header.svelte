<script lang="ts">
	import type { _RoundState } from '@app/model';

	interface Props {
		state: _RoundState;
	}

	let { state }: Props = $props();
	const arrow = $derived(state.game.nextDirection === 'forward' ? '↑' : '↓');
	const firstPlayer = $derived(state.game.players[state.round.firstPlayer]);
</script>

<nav class="bg-background justify-between border-b p-2 pr-4 text-center">
	<p class="text-5xl">Round {state.round.numberOfCards}{arrow}</p>
	<p>First player: {firstPlayer}</p>
</nav>
