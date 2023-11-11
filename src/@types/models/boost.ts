export type BoostType = "coin" | "lucky" | "stars" | "strength";

export interface Boost {
	id: string;
	type: BoostType;
	expiresAt: number;
}
