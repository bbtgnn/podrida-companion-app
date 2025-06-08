/* Entities */

export class App {
	currentGame = $state<Game>();

	history = $state<AppState[]>([]);
	currentState = $state<AppState>();

	constructor() {
		this.currentState = new IdleState(this);
	}

	nextState(StateConstructor: new (app: App) => AppState) {
		if (this.currentState) this.history.push(this.currentState);
		this.currentState = new StateConstructor(this);
	}

	isGameOver() {
		const isRoundEnded = this.currentState instanceof RoundEndedState;
		const isResultsDisplayed = this.currentState instanceof ResultsDisplayState;
		const isNextNumberOfCardsZero = this.currentGame?.nextNumberOfCards === 0;
		return (isRoundEnded || isResultsDisplayed) && isNextNumberOfCardsZero;
	}
}

export class Game {
	players = $state<string[]>([]);
	rounds = $state<Round[]>([]);
	currentRound = $state<Round>();

	nextDirection = $state<'forward' | 'backward'>('forward');
	nextPlayerIndex = $state<number>(0);
	nextNumberOfCards = $state<number>(1);

	addPlayer(playerName: string) {
		this.players.push(playerName);
	}

	startRound() {
		if (this.currentRound) {
			this.currentRound.isOver = true;
			this.rounds.push(this.currentRound);
		}

		this.currentRound = new Round(this.nextNumberOfCards, this.nextPlayerIndex);
		this.nextPlayerIndex = (this.nextPlayerIndex + 1) % this.players.length;

		if (this.nextDirection === 'forward') {
			this.nextNumberOfCards++;
		} else {
			this.nextNumberOfCards--;
		}

		return this.currentRound;
	}

	startReturn() {
		this.nextDirection = 'backward';
	}

	getCurrentPlacings() {
		const acc: Record<PlayerID, number> = {};
		this.rounds
			.filter((round) => round.isOver)
			.map((round) => round.getRoundPoints())
			.forEach((points) => {
				for (const [playerID, pts] of Object.entries(points)) {
					const id = parseInt(playerID);
					acc[id] = (acc[id] || 0) + pts;
				}
			});
		return Object.entries(acc)
			.map(([playerID, points]) => {
				const id = parseInt(playerID);
				return {
					playerId: id,
					playerName: this.players[id],
					points
				};
			})
			.sort((a, b) => b.points - a.points);
	}
}

type PlayerID = number;

export class Round {
	bets = $state<Record<PlayerID, number>>({});
	results = $state<Record<PlayerID, Result>>({});
	isOver = $state(false);

	constructor(
		public numberOfCards: number,
		public firstPlayer: number
	) {}

	getRoundPoints(): Record<PlayerID, number> {
		if (!this.isOver) throw new Error('Round is not over');

		const points: Record<PlayerID, number> = {};
		for (const [playerID, result] of Object.entries(this.results)) {
			const id = parseInt(playerID);
			if (result === Result.Failure) {
				points[id] = 0;
			} else {
				points[id] = this.bets[id] * 2 + 10;
			}
		}
		return points;
	}
}

export enum Result {
	Success = 'success',
	Failure = 'failure'
}

/* States */

export type AppState =
	| IdleState
	| GameSetupState
	| RoundSetupState
	| RoundInProgressState
	| RoundEndedState
	| ResultsDisplayState
	| GameOverState;

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

	registerResult(playerIndex: number, result: Result) {
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
		const atLeastOneHasFailure = allResults.some((result) => result === Result.Failure);
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
