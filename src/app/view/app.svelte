<script lang="ts">
	import {
		App,
		IdleState,
		GameSetupState,
		RoundSetupState,
		RoundInProgressState,
		RoundEndedState,
		ResultsDisplayState,
		GameOverState,
		_RoundState
	} from '@app/model';

	import IdleStateComponent from './idle-state.svelte';
	import GameSetupStateComponent from './game-setup-state.svelte';
	import RoundSetupStateComponent from './round-setup-state.svelte';
	import RoundInProgressStateComponent from './round-in-progress-state.svelte';
	import RoundEndedStateComponent from './round-ended-state.svelte';
	import ResultsDisplayStateComponent from './results-display-state.svelte';
	import GameOverStateComponent from './game-over.svelte';

	//

	type Props = {
		app: App;
	};

	let { app }: Props = $props();
	const s = $derived(app.currentState);
</script>

<main class="app">
	{#if s instanceof IdleState}
		<IdleStateComponent state={s} />
	{:else if s instanceof GameSetupState}
		<GameSetupStateComponent state={s} />
	{:else if s instanceof _RoundState}
		<!-- Round header -->
		{#if s instanceof RoundSetupState}
			<RoundSetupStateComponent state={s} />
		{:else if s instanceof RoundInProgressState}
			<RoundInProgressStateComponent state={s} />
		{:else if s instanceof RoundEndedState}
			<RoundEndedStateComponent state={s} />
		{/if}
	{:else if s instanceof ResultsDisplayState}
		<ResultsDisplayStateComponent state={s} />
	{:else if s instanceof GameOverState}
		<GameOverStateComponent state={s} />
	{/if}
</main>
