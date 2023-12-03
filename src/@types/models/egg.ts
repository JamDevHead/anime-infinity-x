import { PlayerFighter } from "@/shared/store/players";

export type EggIncubator = {
	id: string;
	zone: string;
	name: string;
	availableFighters: PlayerFighter[];
};
