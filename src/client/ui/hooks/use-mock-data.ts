import { md5 } from "@rbxts/rbxts-hashlib";
import { useEffect } from "@rbxts/roact";
import { ReplicatedStorage } from "@rbxts/services";
import { store } from "@/client/store";
import { PlayerFighter } from "@/shared/store/players";
import { defaultPlayerData } from "@/shared/store/players/players-utils";

type MockDataProps = {
	/**
	 * Represents custom data for the player.
	 * This is useful for testing specific scenarios.
	 * @example
	 * useMockData({ customData: { balance: { coins: 1000000, stars: 1000000 } } });
	 * @type {Partial<typeof defaultPlayerData>}
	 * @memberof MockDataProps
	 * @default undefined
	 */
	customData?: Partial<typeof defaultPlayerData>;
};

/**
 * This hook is used to load mock data into the store for testing purposes.
 * This should only be used in development and should never be used in production.
 *
 * @example
 * useMockData();
 *
 * @returns void
 */
export const useMockData = (props?: MockDataProps): void => {
	useEffect(() => {
		const fightersModels = ReplicatedStorage.assets.Avatars.FightersModels.GetChildren();
		const randomZone = fightersModels[math.random(fightersModels.size()) - 1];
		const fightersData = randomZone.GetChildren().map((fighterModel, index) => {
			return {
				uid: tostring(index),
				characterUid: tostring(index + 1000),
				name: fighterModel.Name,
				displayName: fighterModel.Name,
				stats: {
					damage: 10,
					dexterity: 10,
					level: 1,
					xp: 0,
					sellPrice: 0,
				},
				rarity: 1,
				zone: randomZone.Name,
			} satisfies PlayerFighter;
		});

		store.loadPlayerData("1", {
			...defaultPlayerData,
			balance: {
				coins: 1e10,
				stars: 10000000,
			},
			fighters: {
				all: fightersData,
				actives: fightersData.map((fighter) => fighter.uid),
			},
			missions: {
				all: table.create(5, false).map((_, index) => ({
					id: tostring(index),
					title: `Mission ${index}`,
					type: "kill",
					tasks: [],
				})),
				active: undefined,
			},
			boosts: {
				all: [
					{
						id: "1",
						type: "coin",
						expiresAt: os.time() + 60 * 60,
					},
					{
						id: "2",
						type: "stars",
						expiresAt: os.time() + 60 * 60,
					},
					{
						id: "3",
						type: "lucky",
						expiresAt: os.time() + 60 * 60,
					},
					{
						id: "4",
						type: "strength",
						expiresAt: os.time() + 60 * 60,
					},
				],
			},
			inventory: {
				maxStorage: 100,
				maxFighters: 3,
			},
			zones: {
				current: "nrt",
				changing: false,
				unlocked: ["nrt", "aot"],
			},
			info: {
				firstTime: false,
				version: "1.0.0",
			},
			index: {
				discovered: [md5("Naro")],
			},
			...props?.customData,
		});
	});
};
