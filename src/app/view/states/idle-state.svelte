<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { IdleState } from '@app/model';

	interface Props {
		state: IdleState;
	}

	let { state }: Props = $props();
</script>

<div class="flex grow items-center justify-center text-center">
	<div class="welcome-card space-y-8">
		<div class="flex flex-col items-center">
			<p>Welcome to</p>
			<h1 class="-rotate-1 text-6xl font-bold">Podrida!</h1>
		</div>

		<Button onclick={() => state.startGame()}>Start New Game</Button>
	</div>
</div>
