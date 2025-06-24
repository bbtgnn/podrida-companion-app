import z from 'zod/v4';
import { Game, GameSchema } from './game.svelte';
import {
	AppStates,
	IdleState,
	ResultsDisplayState,
	RoundEndedState,
	type AppState
} from './states.svelte';

//

export const AppSchema = z.object({
	currentGame: GameSchema.optional(),
	currentState: z.string().optional()
});

type AppStruct = z.infer<typeof AppSchema>;

export class App {
	currentGame = $state<Game>();
	currentState = $state<AppState>();

	constructor() {
		this.currentState = new IdleState(this);
	}

	nextState(StateConstructor: new (app: App) => AppState) {
		this.currentState = new StateConstructor(this);
		this.persist();
	}

	isGameOver() {
		const isRoundEnded = this.currentState instanceof RoundEndedState;
		const isResultsDisplayed = this.currentState instanceof ResultsDisplayState;
		const isNextNumberOfCardsZero = this.currentGame?.nextNumberOfCards === 0;
		return (isRoundEnded || isResultsDisplayed) && isNextNumberOfCardsZero;
	}

	exitGame() {
		this.currentState = new IdleState(this);
	}

	//

	STORAGE_KEY = 'app';

	serialize(): AppStruct {
		return $state.snapshot({
			currentGame: this.currentGame?.serialize(),
			currentState: this.currentState?.getType()
		});
	}

	deserialize(unknown: unknown) {
		const { currentGame, currentState } = AppSchema.parse(unknown);
		this.currentGame = currentGame ? Game.deserialize(currentGame) : undefined;
		if (!currentState) {
			this.currentState = new IdleState(this);
		} else {
			const StateConstructor = AppStates[currentState as keyof typeof AppStates];
			if (!StateConstructor) throw new Error(`Unknown state: ${currentState}`);
			this.currentState = new StateConstructor(this);
		}
	}

	persist() {
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.serialize()));
	}

	load() {
		const stored = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
		this.deserialize(stored);
	}
}
