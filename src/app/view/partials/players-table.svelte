<script lang="ts">
	import type { Player } from '@app/model/types';
	import type { Snippet } from 'svelte';

	type Props = {
		players: Player[];
		right?: Snippet<[{ player: Player; isLast: boolean }]>;
		rightHeader?: Snippet;
	};

	let { players, right, rightHeader }: Props = $props();
</script>

<table class="w-full table-auto border-separate border-spacing-y-1">
	<thead>
		<tr class="text-left text-[0.5rem] font-normal tracking-wide uppercase">
			<th class="px-2">Player</th>
			<th class="px-2">{@render rightHeader?.()}</th>
		</tr>
	</thead>
	<tbody>
		{#each players as player}
			{@const isLast = players.length === players.indexOf(player)}
			<tr class="!rounded-lg bg-purple-50">
				<td class="p-2">{player.name}</td>
				<td class="p-2">{@render right?.({ player, isLast })}</td>
			</tr>
		{/each}
	</tbody>
</table>
