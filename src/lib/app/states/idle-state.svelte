<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { IdleState } from '../app.svelte.js';

	interface Props {
		state: IdleState;
	}

	let { state }: Props = $props();
</script>

<div class="idle-state">
	<div class="welcome-card">
		<h1>Welcome to Podrida!</h1>
		<p>A fun card game for friends and family</p>
		<Button onclick={() => state.startGame()}>Start New Game</Button>
	</div>
</div>
