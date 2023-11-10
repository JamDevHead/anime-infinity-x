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
		});
	});
};
