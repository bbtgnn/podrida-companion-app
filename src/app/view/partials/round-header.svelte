<script lang="ts">
	import type { _RoundState } from '@app/model';

	interface Props {
		state: _RoundState;
	}

	let { state }: Props = $props();
</script>

<nav class="bg-background justify-between border-b p-2 pr-4">
	<p class="text-right">Round – {state.round.numberOfCards} cards</p>
</nav>
