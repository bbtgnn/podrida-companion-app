import type { App } from './app.svelte';
import { Game } from './game.svelte';
import { Round, RoundResult } from './round.svelte';

// Abstract states

export abstract class _AppState {
	public readonly app: App;

	constructor(app: App) {
		this.app = app;
	}
}

export abstract class _GameState extends _AppState {
	public readonly game: Game;

	constructor(app: App) {
		super(app);
		if (!this.app.currentGame) throw new Error('Game not found');
		this.game = this.app.currentGame;
	}
}

export abstract class _RoundState extends _GameState {
	public readonly round: Round;

	constructor(app: App) {
		super(app);
		if (!this.game.currentRound) throw new Error('Round not found');
		this.round = this.game.currentRound;
	}

	getPlayersOrder() {
		const playersOrder: { name: string; id: number }[] = [];
		for (let i = 0; i < this.game.players.length; i++) {
			const id = (this.round.firstPlayer + i) % this.game.players.length;
			playersOrder.push({ name: this.game.players[id], id });
		}
		return playersOrder;
	}
}

// Concrete states

export class IdleState extends _AppState {
	startGame() {
		const game = new Game();
		this.app.currentGame = game;
		this.app.nextState(GameSetupState);
	}
}

export class GameSetupState extends _GameState {
	addPlayer(playerName: string) {
		this.game.addPlayer(playerName);
	}

	startGame() {
		if (!this.canStartGame()) return;
		this.game.startRound();
		this.app.nextState(RoundSetupState);
	}

	canStartGame() {
		const players = this.game.players;
		return players && players.length >= 2;
	}
}

export class RoundSetupState extends _RoundState {
	addBet(playerIndex: number, bet: number) {
		// TODO - Add validation for bet, and for last player
		this.round.bets[playerIndex] = bet;
	}

	startRound() {
		if (!this.canStartRound()) return;
		this.app.nextState(RoundInProgressState);
	}

	canStartRound() {
		return Object.keys(this.round.bets).length === this.game.players.length;
	}
}

export class RoundInProgressState extends _RoundState {
	endRound() {
		this.app.nextState(RoundEndedState);
	}
}

export class RoundEndedState extends _RoundState {
	getPlayerResult(playerIndex: number) {
		return this.round.results[playerIndex] ?? null;
	}

	registerResult(playerIndex: number, result: RoundResult) {
		this.round.results[playerIndex] = result;
	}

	submitResults() {
		if (!this.canSubmitResults()) return;
		else if (this.app.isGameOver()) this.app.nextState(GameOverState);
		else this.app.nextState(ResultsDisplayState);
	}

	canSubmitResults() {
		const allResults = Object.values(this.round.results);

		const allResultsAreDefined = allResults.every((result) => result !== null);
		const atLeastOneHasFailure = allResults.some((result) => result === RoundResult.Failure);
		const allResultsSubmitted = Object.keys(allResults).length === this.game.players.length;

		return allResultsSubmitted && allResultsAreDefined && atLeastOneHasFailure;
	}
}

export class ResultsDisplayState extends _RoundState {
	nextRound() {
		this.game.startRound();
		this.app.nextState(RoundSetupState);
	}
}

export class GameOverState extends _GameState {
	endGame() {
		this.app.currentGame = undefined;
		this.app.nextState(IdleState);
	}
}

// Index

export const AppStates = {
	IdleState,
	GameSetupState,
	RoundSetupState,
	RoundInProgressState,
	RoundEndedState,
	ResultsDisplayState,
	GameOverState
};

export type AppState =
	| IdleState
	| GameSetupState
	| RoundSetupState
	| RoundInProgressState
	| RoundEndedState
	| ResultsDisplayState
	| GameOverState;
