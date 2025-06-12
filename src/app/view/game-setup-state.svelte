<script lang="ts">
	import type { GameSetupState } from '@app/model';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	//

	interface Props {
		state: GameSetupState;
	}

	let { state: setupState }: Props = $props();

	//

	let newPlayerName = $state('');
	const players = $derived(setupState.game.players);

	function addPlayer() {
		if (newPlayerName.trim()) {
			setupState.addPlayer(newPlayerName.trim());
			newPlayerName = '';
		}
	}
</script>

<div class="game-setup">
	<div class="setup-card">
		<h1>Game Setup</h1>
		<p>Add players to start the game</p>

		<div class="player-input">
			<Input type="text" placeholder="Enter player name" bind:value={newPlayerName} />
			<Button onclick={addPlayer} disabled={!newPlayerName.trim()}>Add Player</Button>
		</div>

		{#if players.length > 0}
			<div class="players-list">
				<h3>Players ({players.length})</h3>
				<ul>
					{#each players as player, index}
						<li>{index + 1}. {player}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<div class="actions">
			<Button onclick={() => setupState.startGame()} disabled={!setupState.canStartGame()}>
				Start Game
			</Button>
			{#if players.length < 2}
				<p class="help-text">Add at least 2 players to start</p>
			{/if}
		</div>
	</div>
</div>
