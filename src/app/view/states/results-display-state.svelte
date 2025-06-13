<script lang="ts">
	import type { ResultsDisplayState } from '@app/model';

	interface Props {
		state: ResultsDisplayState;
	}

	let { state }: Props = $props();
</script>

<div class="results-display">
	<div class="results-card">
		<h1>Results</h1>

		<pre>{JSON.stringify(state.game.getCurrentPlacings(), null, 2)}</pre>

		{#each state.game.getCurrentPlacings() as placement}
			<div class="placement">
				<div class="placement-name">{placement.playerName}</div>
				<div class="placement-score">{placement.points}</div>
			</div>
		{/each}
		<!-- 
		<div class="game-progress">
			<h3>Game Progress</h3>
			<div class="progress-info">
				<p><strong>Next round:</strong> {game.nextNumberOfCards} cards each</p>
				<p>
					<strong>Direction:</strong>
					{game.nextDirection === 'forward' ? '📈 Going up' : '📉 Going down'}
				</p>
				{#if shouldEndGame()}
					<p class="game-ending">🎯 This was the final round!</p>
				{/if}
			</div>
		</div>

		<div class="actions">
			{#if shouldEndGame()}
				<button class="end-game-button" onclick={() => state.endGame()}>
					🏆 End Game - {getWinner()?.name} Wins!
				</button>
			{:else}
				<button class="next-round-button" onclick={() => state.nextRound()}>
					Continue to Next Round
				</button>
				<button class="end-game-button secondary" onclick={() => state.endGame()}>
					End Game Early
				</button>
			{/if}
		</div> -->
	</div>
</div>
