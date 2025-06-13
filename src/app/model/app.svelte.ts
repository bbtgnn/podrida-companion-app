import z from 'zod';
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
	gameHistory = $state<Game[]>([]);

	history = $state<AppState[]>([]);
	currentState = $state<AppState>();

	constructor() {
		this.currentState = new IdleState(this);
	}

	nextState(StateConstructor: new (app: App) => AppState) {
		if (this.currentState) this.history.push(this.currentState);
		this.currentState = new StateConstructor(this);
		this.persist();
	}

	isGameOver() {
		const isRoundEnded = this.currentState instanceof RoundEndedState;
		const isResultsDisplayed = this.currentState instanceof ResultsDisplayState;
		const isNextNumberOfCardsZero = this.currentGame?.nextNumberOfCards === 0;
		return (isRoundEnded || isResultsDisplayed) && isNextNumberOfCardsZero;
	}

	closeGame() {
		if (this.currentGame) {
			this.gameHistory.push(this.currentGame);
			this.currentGame = undefined;
		}
		this.currentState = new IdleState(this);
	}

	//

	STORAGE_KEY = 'app';

	serialize(): AppStruct {
		return $state.snapshot({
			currentGame: this.currentGame?.serialize(),
			currentState: this.currentState?.constructor.name
		});
	}

	deserialize(unknown: unknown) {
		const { currentGame, currentState } = AppSchema.parse(unknown);
		this.currentGame = currentGame ? Game.deserialize(currentGame) : undefined;
		this.currentState = currentState
			? new AppStates[currentState as keyof typeof AppStates](this)
			: new IdleState(this);
	}

	persist() {
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.serialize()));
	}

	load() {
		const stored = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
		this.deserialize(stored);
	}
}
