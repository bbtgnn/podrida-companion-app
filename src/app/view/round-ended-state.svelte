<script lang="ts">
	import { RoundResult, type RoundEndedState } from '@app/model';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	//

	interface Props {
		state: RoundEndedState;
	}

	let { state }: Props = $props();
</script>

<div class="round-ended">
	{#each state.getPlayersOrder() as player}
		{@const id = `result-${player.id}`}
		<div>
			<Label class="flex items-center justify-between">
				<span>
					{player.name}
				</span>
			</Label>
			<RadioGroup.Root
				bind:value={
					() => state.getPlayerResult(player.id), (v) => state.registerResult(player.id, v)
				}
			>
				<div class="flex items-center space-x-2">
					<RadioGroup.Item value={RoundResult.Success} id={`${id}-success`} />
					<Label for={`${id}-success`}>Success</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroup.Item value={RoundResult.Failure} id={`${id}-failure`} />
					<Label for={`${id}-failure`}>Failure</Label>
				</div>
			</RadioGroup.Root>
		</div>
	{/each}

	<Button onclick={() => state.submitResults()} disabled={!state.canSubmitResults()}>
		{#if state.app.isGameOver()}
			Game Over
		{:else}
			Next Round
		{/if}
	</Button>
	<!-- <div class="results-card">
		<div class="round-header">
			<h1>Round {game.rounds.length + 1} - Record Results</h1>
			<div class="round-info">
				<span class="cards-info">{round.numberOfCards} cards total</span>
				<span class="tricks-info">Total tricks: {getTotalTricks()} / {round.numberOfCards}</span>
			</div>
		</div>

		<div class="results-section">
			<h2>Record Tricks Won</h2>
			<p class="instruction">Enter how many tricks each player actually won</p>

			<div class="players-grid">
				{#each game.players as player, index}
					<div
						class="player-result"
						class:success={getPlayerStatus(index) === 'success'}
						class:failed={getPlayerStatus(index) === 'failed'}
					>
						<div class="player-info">
							<div class="player-name">{player}</div>
							<div class="bet-info">Bet: {round.bets[index] || 0}</div>
						</div>

						<div class="result-input">
							<label for="result-{index}">Tricks won:</label>
							<input
								id="result-{index}"
								type="number"
								min="0"
								max={round.numberOfCards}
								bind:value={results[index]}
								oninput={(e) => setResult(index, parseInt(e.currentTarget.value) || 0)}
								placeholder="0"
							/>
						</div>

						<div class="status-indicator">
							{#if getPlayerStatus(index) === 'success'}
								✅ Made bet!
							{:else if getPlayerStatus(index) === 'failed'}
								❌ Missed bet
							{:else}
								⏳ Pending
							{/if}
						</div>
					</div>
				{/each}
			</div>

			{#if getTotalTricks() !== round.numberOfCards && canSubmitResults()}
				<div class="warning">
					⚠️ Total tricks ({getTotalTricks()}) doesn't equal cards dealt ({round.numberOfCards})
				</div>
			{/if}
		</div>

		<div class="actions">
			<button
				class="submit-results-button"
				onclick={() => state.submitResults()}
				disabled={!canSubmitResults()}
			>
				Submit Results
			</button>
			{#if !canSubmitResults()}
				<p class="help-text">Enter results for all players</p>
			{/if}
		</div>
	</div> -->
</div>
