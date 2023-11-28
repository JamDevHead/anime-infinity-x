import { $env } from "rbxts-transform-env";

export const env = {
	REMOTE_CONFIG_TOKEN: $env.string("REMOTE_CONFIG_TOKEN"),
};
