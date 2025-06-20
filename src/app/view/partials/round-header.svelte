<script lang="ts">
	import { AppStates, type _RoundState } from '@app/model';

	interface Props {
		state: _RoundState;
	}

	let { state }: Props = $props();
	const arrow = $derived(state.game.nextDirection === 'forward' ? '↑' : '↓');
	const firstPlayer = $derived(state.game.players[state.round.firstPlayer]);

	//

	type StateDisplay = {
		label: string;
		bgColor: string;
		borderColor: string;
	};

	const stateDisplayMap: Record<string, StateDisplay> = {
		[AppStates.RoundSetupState.name]: {
			label: 'Round Setup',
			bgColor: 'bg-orange-300',
			borderColor: 'border-orange-400'
		},
		[AppStates.RoundInProgressState.name]: {
			label: 'Round In Progress',
			bgColor: 'bg-blue-300',
			borderColor: 'border-blue-400'
		},
		[AppStates.RoundEndedState.name]: {
			label: 'Round Ended',
			bgColor: 'bg-green-300',
			borderColor: 'border-green-400'
		},
		[AppStates.ResultsDisplayState.name]: {
			label: 'Results Display',
			bgColor: 'bg-purple-300',
			borderColor: 'border-purple-400'
		}
	};

	const stateDisplay = $derived.by(() => {
		const stateName = state.constructor.name;
		const stateDisplay = stateDisplayMap[stateName] as StateDisplay | undefined;
		if (!stateDisplay) {
			throw new Error(`State display not found for state: ${stateName}`);
		}
		return stateDisplay;
	});
</script>

<nav class="bg-background flex justify-between border-b p-2">
	<div>
		<p class="text-4xl">Round {state.round.numberOfCards}{arrow}</p>
		<p class="text-gray-400">First player: {firstPlayer}</p>
	</div>
	<div
		class={[
			stateDisplay.bgColor,
			stateDisplay.borderColor,
			'max-w-[100px] rounded-md border-2 p-2 text-balance'
		]}
	>
		{stateDisplay.label}
	</div>
</nav>
