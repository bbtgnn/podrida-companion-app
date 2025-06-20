<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		footer?: Snippet;
		containerClass?: string;
		class?: string;
	}

	let { children, footer, class: className, containerClass }: Props = $props();
</script>

<div class={['flex grow flex-col justify-between overflow-hidden', containerClass]}>
	<div class={['space-y-2 p-2', className]}>
		{@render children()}
	</div>

	{#if footer}
		<div class="bg-background space-y-2 border-t p-2">{@render footer()}</div>
	{/if}
</div>
