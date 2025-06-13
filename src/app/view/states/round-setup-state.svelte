<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { RoundSetupState } from '@app/model';

	interface Props {
		state: RoundSetupState;
	}

	let { state }: Props = $props();

	function setBet(playerIndex: number, bet: number) {
		state.addBet(playerIndex, bet);
	}
</script>

<form class="space-y-4 p-4">
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
	<!-- <div class="setup-card">
		<div class="round-info">
			<h1>Round {game.rounds.length + 1}</h1>
			<div class="round-details">
				<p><strong>Cards per player:</strong> {round.numberOfCards}</p>
				<p><strong>First player:</strong> {game.players[round.firstPlayer]}</p>
				<p><strong>Total bets:</strong> {getTotalBets()} / {round.numberOfCards}</p>
			</div>
		</div>

		<div class="betting-section">
			<h2>Place Your Bets</h2>
			<p class="instruction">Each player must bet how many tricks they think they'll win</p>

			<div class="players-grid">
				{#each game.players as player, index}
					<div class="player-bet">
						<label for="bet-{index}">{player}</label>
						<div class="bet-input">
							<input
								id="bet-{index}"
								type="number"
								min="0"
								max={round.numberOfCards}
								bind:value={bets[index]}
								oninput={(e) => setBet(index, parseInt(e.currentTarget.value) || 0)}
								placeholder="0"
							/>
							<span class="max-bet">/ {round.numberOfCards}</span>
						</div>
					</div>
				{/each}
			</div>

			{#if getTotalBets() === round.numberOfCards}
				<div class="warning">
					⚠️ Total bets equal the number of cards - someone will be disappointed!
				</div>
			{/if}
		</div>

		<div class="actions">
			<button
				class="start-round-button"
				onclick={() => state.startRound()}
				disabled={!canStartRound()}
			>
				Start Round
			</button>
			{#if !canStartRound()}
				<p class="help-text">All players must place their bets</p>
			{/if}
		</div>
	</div> -->
	<Button
		onclick={(e) => {
			e.preventDefault();
			state.startRound();
		}}
		disabled={!state.canStartRound()}
		class="w-full"
	>
		Start Round
	</Button>
</form>
