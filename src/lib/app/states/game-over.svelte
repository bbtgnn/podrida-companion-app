<script lang="ts">
	import { GameOverState } from '../app.svelte.js';

	type Props = {
		state: GameOverState;
	};

	let { state }: Props = $props();
</script>

<div>
	<h1>Game Over</h1>
</div>
