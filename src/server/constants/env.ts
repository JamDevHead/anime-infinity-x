import { $env } from "rbxts-transform-env";

export const env = {
	REMOTE_CONFIG_TOKEN: $env.string("REMOTE_CONFIG_TOKEN"),
	GAME_ANALYTICS_GAME_KEY: $env.string("GAME_ANALYTICS_GAME_KEY"),
	GAME_ANALYTICS_SECRET_KEY: $env.string("GAME_ANALYTICS_SECRET_KEY"),
};
