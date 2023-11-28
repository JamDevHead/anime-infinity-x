import { PlayerFighter } from "@/shared/store/players";

type Character = Pick<PlayerFighter, "stats"> & {
	display_name: string;
	model: string;
	rarity: number;
	base_yen: number;
};

type CharactersConfigSchema = {
	[key: string]: Array<Character>;
};

type WorldConfigSchema = {
	[key: string]: unknown;
};

export type Config = {
	world?: WorldConfigSchema;
	characters?: CharactersConfigSchema;
};

export type ConfigType = keyof Config;
