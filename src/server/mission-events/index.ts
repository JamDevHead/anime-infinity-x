import { playerCollectedDrop } from "./collect-drops";
import { playerKilledEnemy } from "./kill-enemies";

export * from "./kill-enemies";
export * from "./collect-drops";

export const events = {
	collect: playerCollectedDrop,
	kill: playerKilledEnemy,
} as const;

export type MissionTypes = keyof typeof events;
