export interface FighterGoalAttributes {
	fighterId: string;
	characterId: string;
	playerId: number;
	goalOffset: CFrame;
}

export type FighterGoalInstance = Part & { weld: WeldConstraint };
