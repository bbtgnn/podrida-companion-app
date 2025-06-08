<script lang="ts">
	import type { RoundInProgressState } from '../app.svelte.js';

	interface Props {
		state: RoundInProgressState;
	}

	let { state }: Props = $props();
	const game = $derived(state.game);
	const round = $derived(state.round);
</script>

<div class="round-in-progress">
	<div class="game-card">
		<div class="round-header">
			<h1>Round {game.rounds.length + 1} - In Progress</h1>
			<div class="round-info">
				<span class="cards-info">{round.numberOfCards} cards each</span>
				<span class="first-player">First: {game.players[round.firstPlayer]}</span>
			</div>
		</div>

		<div class="game-status">
			<div class="status-card">
				<h2>🎮 Game in Progress</h2>
				<p>Players are now playing their cards and taking tricks.</p>
				<p>Keep track of who wins each trick!</p>
			</div>
		</div>

		<div class="players-bets">
			<h3>Player Bets</h3>
			<div class="bets-grid">
				{#each game.players as player, index}
					<div class="player-bet-display">
						<div class="player-name">{player}</div>
						<div class="bet-amount">{round.bets[index] ?? 0}</div>
						<div class="bet-label">bet</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="game-instructions">
			<div class="instruction-card">
				<h3>📋 How to Play</h3>
				<ul>
					<li>
						Players play cards in turn, starting with <strong
							>{game.players[round.firstPlayer]}</strong
						>
					</li>
					<li>Highest card of the leading suit wins the trick</li>
					<li>Trump cards beat all other suits</li>
					<li>Winner of each trick leads the next trick</li>
					<li>Keep track of tricks won by each player</li>
				</ul>
			</div>
		</div>

		<div class="actions">
			<button class="end-round-button" onclick={() => state.endRound()}>
				End Round & Record Results
			</button>
		</div>
	</div>
</div>

<style>
	.round-in-progress {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 20px;
	}

	.game-card {
		background: white;
		border-radius: 16px;
		padding: 32px;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
		max-width: 700px;
		width: 100%;
	}

	.round-header {
		text-align: center;
		margin-bottom: 32px;
	}

	h1 {
		color: #333;
		margin: 0 0 12px 0;
		font-size: 2rem;
		font-weight: 700;
	}

	.round-info {
		display: flex;
		justify-content: center;
		gap: 24px;
		flex-wrap: wrap;
	}

	.cards-info,
	.first-player {
		background: #f8f9fa;
		padding: 8px 16px;
		border-radius: 20px;
		color: #333;
		font-weight: 500;
	}

	.game-status {
		margin-bottom: 32px;
	}

	.status-card {
		background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
		color: white;
		padding: 24px;
		border-radius: 12px;
		text-align: center;
	}

	.status-card h2 {
		margin: 0 0 12px 0;
		font-size: 1.5rem;
	}

	.status-card p {
		margin: 8px 0;
		opacity: 0.9;
	}

	.players-bets {
		margin-bottom: 32px;
	}

	.players-bets h3 {
		color: #333;
		margin: 0 0 16px 0;
		font-size: 1.3rem;
		text-align: center;
	}

	.bets-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 12px;
	}

	.player-bet-display {
		background: #f8f9fa;
		border-radius: 8px;
		padding: 16px;
		text-align: center;
	}

	.player-name {
		color: #333;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.bet-amount {
		color: #667eea;
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 4px;
	}

	.bet-label {
		color: #666;
		font-size: 0.9rem;
	}

	.game-instructions {
		margin-bottom: 32px;
	}

	.instruction-card {
		background: #f8f9fa;
		border-radius: 12px;
		padding: 24px;
	}

	.instruction-card h3 {
		color: #333;
		margin: 0 0 16px 0;
		font-size: 1.2rem;
	}

	.instruction-card ul {
		margin: 0;
		padding-left: 20px;
		color: #333;
	}

	.instruction-card li {
		margin-bottom: 8px;
		line-height: 1.5;
	}

	.actions {
		text-align: center;
	}

	.end-round-button {
		background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
		color: white;
		border: none;
		border-radius: 8px;
		padding: 16px 32px;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
		width: 100%;
	}

	.end-round-button:hover {
		background: linear-gradient(135deg, #dd6b20 0%, #c05621 100%);
	}
</style>
