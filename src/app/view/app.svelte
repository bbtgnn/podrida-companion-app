<script lang="ts">
	import {
		App,
		IdleState,
		GameSetupState,
		RoundSetupState,
		RoundInProgressState,
		RoundEndedState,
		ResultsDisplayState,
		_RoundState,
		_GameState
	} from '@app/model';

	import IdleStateComponent from './states/idle-state.svelte';
	import GameSetupStateComponent from './states/game-setup-state.svelte';
	import RoundSetupStateComponent from './states/round-setup-state.svelte';
	import RoundInProgressStateComponent from './states/round-in-progress-state.svelte';
	import RoundEndedStateComponent from './states/round-ended-state.svelte';
	import ResultsDisplayStateComponent from './states/results-display-state.svelte';
	import GameHeader from './partials/game-header.svelte';
	import RoundHeader from './partials/round-header.svelte';

	//

	type Props = {
		app: App;
	};

	let { app }: Props = $props();
	const s = $derived(app.currentState);
</script>

<main class="flex flex-col">
	{#if s instanceof IdleState}
		<IdleStateComponent state={s} />
	{:else if s instanceof _GameState}
		<GameHeader state={s} />
		{#if s instanceof GameSetupState}
			<GameSetupStateComponent state={s} />
		{:else if s instanceof _RoundState}
			<RoundHeader state={s} />
			{#if s instanceof RoundSetupState}
				<RoundSetupStateComponent state={s} />
			{:else if s instanceof RoundInProgressState}
				<RoundInProgressStateComponent state={s} />
			{:else if s instanceof RoundEndedState}
				<RoundEndedStateComponent state={s} />
			{:else if s instanceof ResultsDisplayState}
				<ResultsDisplayStateComponent state={s} />
			{/if}
		{/if}
	{/if}
</main>
