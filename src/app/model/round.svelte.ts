import z from 'zod';
import type { PlayerID } from './types';

//

export enum RoundResult {
	Success = 'success',
	Failure = 'failure'
}

export const RoundSchema = z.object({
	bets: z.record(z.number()),
	results: z.record(z.nativeEnum(RoundResult)),
	isOver: z.boolean(),
	numberOfCards: z.number().default(1),
	firstPlayer: z.number().default(0)
});

type RoundStruct = z.infer<typeof RoundSchema>;

export class Round implements RoundStruct {
	bets = $state<Record<PlayerID, number>>({});
	results = $state<Record<PlayerID, RoundResult>>({});
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
			if (result === RoundResult.Failure) {
				points[id] = 0;
			} else {
				points[id] = this.bets[id] * 2 + 10;
			}
		}
		return points;
	}

	serialize(): RoundStruct {
		return $state.snapshot({
			numberOfCards: this.numberOfCards,
			firstPlayer: this.firstPlayer,
			bets: this.bets,
			results: this.results,
			isOver: this.isOver
		});
	}

	static deserialize(unknown: unknown): Round {
		const { numberOfCards, firstPlayer, bets, results, isOver } = RoundSchema.parse(unknown);
		const round = new Round(numberOfCards, firstPlayer);
		round.bets = bets;
		round.results = results;
		round.isOver = isOver;
		return round;
	}
}
