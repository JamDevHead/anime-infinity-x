import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerZones } from "@/shared/store/players/players-types";

export interface ZonesState {
	readonly [playerId: string]: PlayerZones | undefined;
}

const initialState: ZonesState = {};

export const zonesSlice = createProducer(initialState, {
	loadPlayerData: (state, playerId: string, data: PlayerData) => ({
		...state,
		[playerId]: data.zones,
	}),

	unloadPlayerData: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),

	unlockZone: (state, playerId: string, zone: string) => {
		const playerZones = state[playerId];

		if (!playerZones) {
			return state;
		}

		return {
			...state,
			[playerId]: {
				...playerZones,
				unlocked: [...playerZones.unlocked, zone],
			},
		};
	},

	setCurrentZone: (state, playerId: string, zone: string) => {
		const playerZones = state[playerId];

		if (!playerZones) {
			return state;
		}

		return {
			...state,
			[playerId]: {
				...playerZones,
				current: zone,
			},
		};
	},
});
