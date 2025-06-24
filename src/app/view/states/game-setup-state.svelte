<script lang="ts">
	import type { GameSetupState } from '@app/model';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Plus, Trash } from 'lucide-svelte';
	import { Separator } from '$lib/components/ui/separator';
	import Container from '../partials/container.svelte';

	//

	interface Props {
		state: GameSetupState;
	}

	let { state: setupState }: Props = $props();
	const game = $derived(setupState.game);

	//

	let newPlayerName = $state('');
	const players = $derived(game.players);

	let inputRef = $state<HTMLInputElement | null>(null);

	function addPlayer() {
		if (newPlayerName.trim()) {
			setupState.addPlayer(newPlayerName.trim());
			newPlayerName = '';
			inputRef?.focus();
		}
	}
</script>

<Container>
	{#if players.length > 0}
		<p class="text-sm font-semibold">Players ({players.length})</p>
		<ul class="space-y-2">
			{#each players as player (player.id)}
				<li class="flex items-center gap-2">
					<Input
						type="text"
						placeholder="Enter player name"
						bind:value={
							() => game.getPlayerById(player.id).name, (name) => game.renamePlayer(player.id, name)
						}
					/>
					<Button variant="secondary" size="icon" onclick={() => game.removePlayer(player.id)}>
						<Trash />
					</Button>
				</li>
			{/each}
		</ul>
	{/if}

	{#snippet footer()}
		<div class="flex items-center gap-2">
			<Input
				bind:ref={inputRef}
				type="text"
				placeholder="Enter player name"
				bind:value={newPlayerName}
			/>
			<Button variant="secondary" size="icon" onclick={addPlayer} disabled={!newPlayerName.trim()}>
				<Plus />
			</Button>
		</div>

		<Separator />

		{#if players.length < 2}
			<p class="text-center text-xs text-gray-400">Add at least 2 players to start</p>
		{/if}
		<Button
			class="w-full"
			onclick={() => setupState.startGame()}
			disabled={!setupState.canStartGame()}
		>
			Start Game
		</Button>
	{/snippet}
</Container>
