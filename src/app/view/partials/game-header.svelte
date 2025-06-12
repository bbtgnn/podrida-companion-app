<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import type { _GameState } from '@app/model';

	interface Props {
		state: _GameState;
	}

	let { state }: Props = $props();
</script>

<nav class="bg-background flex items-center justify-between border-b p-2 pr-4">
	<Button variant="outline" onclick={() => state.app.closeGame()}><ArrowLeft /></Button>
	<p>{state.game.id}</p>
</nav>
