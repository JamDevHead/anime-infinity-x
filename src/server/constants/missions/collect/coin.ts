import { generateTasks, hashTasks } from "@/server/constants/missions/utils";

export default hashTasks(
	[
		...generateTasks(3, (index) => ({
			title: `Collect ${index * 10} coins`,
			description: "Collect them all",
			level: 0, // ??
			reward: index * 100,
		})),
	],
	script.Name,
);
