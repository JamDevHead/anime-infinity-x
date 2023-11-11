import { useEffect } from "@rbxts/roact";
import { producer } from "@/client/reflex/producers";
import { defaultPlayerData } from "@/shared/reflex/slices/players/utils";

export const useMockData = () => {
	useEffect(() => {
		producer.loadPlayerData("1", {
			...defaultPlayerData,
			balance: {
				coins: 1e10,
				stars: 10000000,
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
		});
	});
};
