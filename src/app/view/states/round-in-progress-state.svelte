<script lang="ts">
	import type { RoundInProgressState } from '@app/model';

	interface Props {
		state: RoundInProgressState;
	}

	let { state }: Props = $props();
	const game = $derived(state.game);
	const round = $derived(state.round);
</script>

<div class="round-in-progress">
	<div class="game-card">
		<div class="actions">
			<button class="end-round-button" onclick={() => state.endRound()}>
				End Round & Record Results
			</button>
		</div>
	</div>
</div>
