import type { App } from './app.svelte';
import { Game } from './game.svelte';
import { Round, RoundResult } from './round.svelte';

// Abstract states

export abstract class _AppState {
	public readonly app: App;

	constructor(app: App) {
		this.app = app;
	}

	abstract getType(): string;
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
	static readonly id = 'idle';
	getType() {
		return IdleState.id;
	}

	startGame() {
		const game = new Game();
		this.app.currentGame = game;
		this.app.nextState(GameSetupState);
	}
}

export class GameSetupState extends _GameState {
	static readonly id = 'game-setup';
	getType() {
		return GameSetupState.id;
	}

	addPlayer(playerName: string) {
		this.game.players.push(playerName);
	}

	removePlayer(playerIndex: number) {
		this.game.players.splice(playerIndex, 1);
	}

	canStartGame() {
		return this.game.players.length >= 2;
	}

	startGame() {
		if (!this.canStartGame()) return;
		this.game.startRound();
		this.app.nextState(RoundSetupState);
	}
}

export class RoundSetupState extends _RoundState {
	static readonly id = 'round-setup';
	getType() {
		return RoundSetupState.id;
	}

	addBet(playerIndex: number, bet: number) {
		// TODO - Add validation for bet, and for last player
		this.round.bets[playerIndex] = bet;
	}

	canStartRound() {
		return Object.keys(this.round.bets).length === this.game.players.length;
	}

	startRound() {
		if (!this.canStartRound()) return;
		this.app.nextState(RoundInProgressState);
	}
}

export class RoundInProgressState extends _RoundState {
	static readonly id = 'round-in-progress';
	getType() {
		return RoundInProgressState.id;
	}

	endRound() {
		this.app.nextState(RoundEndedState);
	}
}

export class RoundEndedState extends _RoundState {
	static readonly id = 'round-ended';
	getType() {
		return RoundEndedState.id;
	}

	getPlayerResult(playerIndex: number) {
		return this.round.results[playerIndex] ?? null;
	}

	registerResult(playerIndex: number, result: RoundResult) {
		this.round.results[playerIndex] = result;
	}

	canSubmitResults() {
		const allResults = Object.values(this.round.results);

		const allResultsAreDefined = allResults.every((result) => result !== null);
		const atLeastOneHasFailure = allResults.some((result) => result === RoundResult.Failure);
		const allResultsSubmitted = Object.keys(allResults).length === this.game.players.length;

		return allResultsSubmitted && allResultsAreDefined && atLeastOneHasFailure;
	}

	submitResults() {
		if (!this.canSubmitResults()) return;
		this.app.nextState(ResultsDisplayState);
	}
}

export class ResultsDisplayState extends _RoundState {
	static readonly id = 'results-display';
	getType() {
		return ResultsDisplayState.id;
	}

	// this.game.endRound();
	// 	if (this.app.isGameOver()) this.app.nextState(GameOverState);
	// 	else

	canStartReturn() {
		// TODO - Improve
		const isIncreasing = this.round.numberOfCards > (this.game.rounds.at(-1)?.numberOfCards ?? 0);
		return isIncreasing;
	}

	isNextDirectionBackward() {
		return this.game.nextDirection === 'backward';
	}

	toggleStartReturn() {
		console.log('toggleStartReturn');
		if (!this.canStartReturn()) return;
		this.game.nextDirection = this.game.nextDirection === 'forward' ? 'backward' : 'forward';
	}

	nextRound() {
		this.game.startRound();
		this.app.nextState(RoundSetupState);
	}

	isGameOver() {
		return this.game.nextDirection === 'backward' && this.round.numberOfCards === 1;
	}

	endGame() {
		this.game.isOver = true;
		this.app.currentGame = undefined;
		this.app.nextState(IdleState);
	}
}

// Index

export const AppStates = {
	[IdleState.id]: IdleState,
	[GameSetupState.id]: GameSetupState,
	[RoundSetupState.id]: RoundSetupState,
	[RoundInProgressState.id]: RoundInProgressState,
	[RoundEndedState.id]: RoundEndedState,
	[ResultsDisplayState.id]: ResultsDisplayState
};

export type AppState =
	| IdleState
	| GameSetupState
	| RoundSetupState
	| RoundInProgressState
	| RoundEndedState
	| ResultsDisplayState;
