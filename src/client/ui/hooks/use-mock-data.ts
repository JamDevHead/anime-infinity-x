import { useEffect } from "@rbxts/roact";
import { store } from "@/client/store";
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
		store.loadPlayerData("1", {
			...defaultPlayerData,
			balance: {
				coins: 1e10,
				stars: 10000000,
			},
			fighters: {
				all: [
					{
						uid: "1",
						name: "Naro",
						displayName: "Naro",
						stats: {
							damage: 10,
							dexterity: 10,
							level: 1,
							xp: 0,
							sellPrice: 0,
						},
						rarity: 1,
						zone: "nrt",
					},
					{
						uid: "2",
						name: "Colossal",
						displayName: "Colossal",
						stats: {
							damage: 10,
							dexterity: 10,
							level: 1,
							xp: 0,
							sellPrice: 0,
						},
						rarity: 2,
						zone: "aot",
					},
					{
						uid: "3",
						name: "Gyo",
						displayName: "Gyo",
						stats: {
							damage: 10,
							dexterity: 10,
							level: 1,
							xp: 0,
							sellPrice: 0,
						},
						rarity: 3,
						zone: "dms",
					},
					{
						uid: "4",
						name: "Geku",
						displayName: "Geku",
						stats: {
							damage: 10,
							dexterity: 10,
							level: 1,
							xp: 0,
							sellPrice: 0,
						},
						rarity: 4,
						zone: "dbz",
					},
					{
						uid: "5",
						name: "Luffo",
						displayName: "Luffo",
						stats: {
							damage: 10,
							dexterity: 10,
							level: 1,
							xp: 0,
							sellPrice: 0,
						},
						rarity: 5,
						zone: "one",
					},
					{
						uid: "6",
						name: "Sho",
						displayName: "Sho",
						stats: {
							damage: 10,
							dexterity: 10,
							level: 1,
							xp: 0,
							sellPrice: 0,
						},
						rarity: 6,
						zone: "tkr",
					},
					{
						uid: "7",
						name: "Naro",
						displayName: "Naro",
						stats: {
							damage: 10,
							dexterity: 10,
							level: 1,
							xp: 0,
							sellPrice: 0,
						},
						rarity: 7,
						zone: "nrt",
					},
				],
				actives: ["1", "3", "5"],
			},
			missions: {
				all: [
					{
						title: "Mission 1",
						description: "This is a mission",
						type: "collect",
						completed: false,
						reward: 99999,
						level: 2,
						id: "1",
					},
					{
						title: "Mission 2",
						description: "This is a mission",
						type: "collect",
						completed: false,
						reward: 99999,
						level: 2,
						id: "1",
					},
					{
						title: "Mission 3",
						description: "This is a mission",
						type: "collect",
						completed: true,
						reward: 99999,
						level: 2,
						id: "1",
					},
					{
						title: "Mission 4",
						description: "This is a mission",
						type: "collect",
						completed: false,
						reward: 99999,
						level: 2,
						id: "1",
					},
				],
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
			...props?.customData,
		});
	});
};
