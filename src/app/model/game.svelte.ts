import z from 'zod';
import { Round, RoundSchema } from './round.svelte';
import type { PlayerID } from './types';
import { nanoid } from 'nanoid';

//

export const GameSchema = z.object({
	id: z.string(),
	players: z.array(z.string()),
	rounds: z.array(RoundSchema),
	currentRound: RoundSchema.optional(),
	nextDirection: z.enum(['forward', 'backward']),
	nextPlayerIndex: z.number(),
	nextNumberOfCards: z.number(),
	isOver: z.boolean().default(false)
});

type GameStruct = z.infer<typeof GameSchema>;

export class Game implements GameStruct {
	id = nanoid(21);
	isOver = $state(false);

	players = $state<string[]>([]);
	rounds = $state<Round[]>([]);
	currentRound = $state<Round>();

	nextDirection = $state<'forward' | 'backward'>('forward');
	nextPlayerIndex = $state(0);
	nextNumberOfCards = $state(1);

	addPlayer(playerName: string) {
		this.players.push(playerName);
	}

	endRound() {
		if (!this.currentRound) return;
		this.currentRound.isOver = true;
		this.rounds.push(this.currentRound);
	}

	startRound() {
		if (this.nextDirection === 'forward') {
			this.nextNumberOfCards++;
		} else {
			this.nextNumberOfCards--;
		}

		this.currentRound = new Round(this.nextNumberOfCards, this.nextPlayerIndex);
		this.nextPlayerIndex = (this.nextPlayerIndex + 1) % this.players.length;

		return this.currentRound;
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

	serialize(): GameStruct {
		return $state.snapshot({
			id: this.id,
			players: this.players,
			rounds: this.rounds.map((round) => round.serialize()),
			currentRound: this.currentRound?.serialize(),
			nextDirection: this.nextDirection,
			nextPlayerIndex: this.nextPlayerIndex,
			nextNumberOfCards: this.nextNumberOfCards,
			isOver: this.isOver
		});
	}

	static deserialize(unknown: unknown): Game {
		const {
			id,
			players,
			rounds,
			currentRound,
			nextDirection,
			nextPlayerIndex,
			nextNumberOfCards,
			isOver
		} = GameSchema.parse(unknown);
		const game = new Game();
		game.id = id;
		game.players = players;
		game.rounds = rounds.map((round) => Round.deserialize(round));
		game.currentRound = currentRound ? Round.deserialize(currentRound) : undefined;
		game.nextDirection = nextDirection;
		game.nextPlayerIndex = nextPlayerIndex;
		game.nextNumberOfCards = nextNumberOfCards;
		game.isOver = isOver;
		return game;
	}
}
