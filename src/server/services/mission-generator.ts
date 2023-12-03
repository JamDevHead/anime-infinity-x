import { OnStart, Service } from "@flamework/core";
import Object from "@rbxts/object-utils";
import { Trove } from "@rbxts/trove";
import { Missions } from "@/server/constants/missions";
import { OnPlayerAdd } from "@/server/services/lifecycles/on-player-add";
import { store } from "@/server/store";
import { Mission } from "@/shared/store/players/missions";
import { selectAllPlayerMissions } from "@/shared/store/players/missions/missions-selectors";

@Service()
export class MissionGenerator implements OnPlayerAdd, OnStart {
	private playerTroves = new Map<Player, Trove>();

	onStart() {
		print("Missions", Missions);
	}

	onPlayerAdded(player: Player) {
		const trove = new Trove();
		const userId = tostring(player.UserId);

		trove.add(
			store.subscribe(selectAllPlayerMissions(userId), (missions) => {
				print("missions changed", missions);

				const uncompletedMissions = missions.filter((mission) => !mission.completed);

				if (uncompletedMissions.size() !== 0) {
					return;
				}

				for (const _ of $range(1, 3)) {
					const mission = this.generateMission();
					mission.title += tostring(_);
					store.addMission(userId, mission);
				}
			}),
		);

		this.playerTroves.set(player, trove);
	}

	onPlayerRemoved(player: Player) {
		this.playerTroves.get(player)?.destroy();
	}

	private generateMission() {
		const tasksArray = Object.values(Missions);
		const randomTasks = tasksArray[math.random(tasksArray.size()) - 1];
		const id = randomTasks.reduce((acc, task) => acc + task.id.sub(1, 3), "");

		return {
			id,
			completed: false,
			description: "Random mission",
			title: "Mission",
			tasks: randomTasks,
		} as Mission;
	}
}
