export interface FighterAttributes {
	fighterId: string;
	characterId: string;
	playerId: string;
}

export interface FighterInstance extends Model {
	Humanoid: Humanoid & {
		Animator: Animator;
	};
	HumanoidRootPart: Part;
	Torso: Part;
}

export type FighterEnemies = { [enemyId: string]: Set<string> | undefined };
