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
		// this.persist();
		if (this.currentState) this.history.push(this.currentState);
		this.currentState = new StateConstructor(this);
	}

	isGameOver() {
		const isRoundEnded = this.currentState instanceof RoundEndedState;
		const isResultsDisplayed = this.currentState instanceof ResultsDisplayState;
		const isNextNumberOfCardsZero = this.currentGame?.nextNumberOfCards === 0;
		return (isRoundEnded || isResultsDisplayed) && isNextNumberOfCardsZero;
	}

	serialize(): AppStruct {
		return $state.snapshot({
			currentGame: this.currentGame?.serialize(),
			currentState: this.currentState?.constructor.name
		});
	}

	static deserialize(unknown: unknown): App {
		const { currentGame, currentState } = AppSchema.parse(unknown);
		const app = new App();
		app.currentGame = currentGame ? Game.deserialize(currentGame) : undefined;
		app.currentState = currentState
			? new AppStates[currentState as keyof typeof AppStates](app)
			: new IdleState(app);
		return app;
	}

	persist() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(this.serialize()));
	}

	load() {
		const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
		console.log('stored', stored);
		const app = App.deserialize(stored);
		this.currentGame = app.currentGame;
		this.currentState = app.currentState;
	}

	closeGame() {
		if (this.currentGame) {
			this.gameHistory.push(this.currentGame);
			this.currentGame = undefined;
		}
		this.currentState = new IdleState(this);
	}
}

const STORAGE_KEY = 'app';
