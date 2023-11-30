import { config, SpringOptions } from "@rbxts/ripple";

export const springs = {
	...config.spring,
	bubbly: { tension: 400, friction: 14 },
	responsive: { tension: 400 },
	gentle: { tension: 250, friction: 30 },
	bouncy: { damping: 30 },
} satisfies { [config: string]: SpringOptions };
