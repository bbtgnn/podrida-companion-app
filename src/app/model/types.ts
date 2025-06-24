import { z } from 'zod/v4';

export type PlayerID = string;

export const PlayerSchema = z.object({
	id: z.string(),
	name: z.string()
});

export type Player = z.infer<typeof PlayerSchema>;
