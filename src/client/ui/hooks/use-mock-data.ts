import { useEffect } from "@rbxts/roact";
import { store } from "@/client/store";
import { defaultPlayerData } from "@/shared/store/players/players-utils";

export const useMockData = () => {
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
						level: 1,
						zone: "nrt",
					},
					{
						uid: "2",
						name: "Naro",
						level: 2,
						zone: "nrt",
					},
					{
						uid: "3",
						name: "Naro",
						level: 3,
						zone: "nrt",
					},
					{
						uid: "4",
						name: "Naro",
						level: 4,
						zone: "nrt",
					},
					{
						uid: "5",
						name: "Naro",
						level: 5,
						zone: "nrt",
					},
					{
						uid: "6",
						name: "Naro",
						level: 6,
						zone: "nrt",
					},
					{
						uid: "7",
						name: "Naro",
						level: 7,
						zone: "nrt",
					},
				],
				actives: ["1"],
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
		});
	});
};
