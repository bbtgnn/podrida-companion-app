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
	} from './app.svelte.js';

	import IdleStateComponent from './states/idle-state.svelte';
	import GameSetupStateComponent from './states/game-setup-state.svelte';
	import RoundSetupStateComponent from './states/round-setup-state.svelte';
	import RoundInProgressStateComponent from './states/round-in-progress-state.svelte';
	import RoundEndedStateComponent from './states/round-ended-state.svelte';
	import ResultsDisplayStateComponent from './states/results-display-state.svelte';
	import GameOverStateComponent from './states/game-over.svelte';

	// Create the main app instance
	let app = $state(new App());
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
		<!-- 
	{:else if app.currentState instanceof RoundSetupState}
		{#if app.currentGame && app.currentGame.currentRound}
			<RoundSetupStateComponent state={app.currentState} />
		{/if}
	{:else if app.currentState instanceof RoundInProgressState}
		{#if app.currentGame && app.currentGame.currentRound}
			<RoundInProgressStateComponent state={app.currentState} />
		{/if}
	{:else if app.currentState instanceof RoundEndedState}
		{#if app.currentGame && app.currentGame.currentRound}
			<RoundEndedStateComponent state={app.currentState} />
		{/if}
	{:else if app.currentState instanceof ResultsDisplayState}
		{#if app.currentGame && app.currentGame.currentRound}
			<ResultsDisplayStateComponent state={app.currentState} />
		{/if} -->
	{/if}
</main>
