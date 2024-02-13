import { MissionTask } from "server/services/missions-service";
import { Enemy } from "@/server/components/enemy";
import { MissionComponent } from "@/server/services/missions-service/mission-component";
import { store } from "@/server/store";
import { Task } from "@/shared/store/players/missions";
import { selectPlayerMission } from "@/shared/store/players/missions/missions-selectors";
import { selectPlayerCurrentZone } from "@/shared/store/players/zones";

@MissionTask()
export class KillMission extends MissionComponent {
	name = "Kill many enemies";
	tasks = [
		{
			id: "level1",
			title: "Kill 50 level 1 enemies",
			progress: 0,
			maxProgress: 50,
		},
		{
			id: "level2",
			title: "Kill 35 level 2 enemies",
			progress: 0,
			maxProgress: 35,
		},
		{
			id: "level3",
			title: "Kill 25 level 3 enemies",
			progress: 0,
			maxProgress: 25,
		},
		{
			id: "level4",
			title: "Kill 15 level 4 enemies",
			progress: 0,
			maxProgress: 15,
		},
		{
			id: "level5",
			title: "Kill 3 bosses",
			progress: 0,
			maxProgress: 3,
		},
	] as Task[];

	action(playerId: string, target: Enemy): void {
		print("Kill mission task action", playerId, target);
		const currentZone = store.getState(selectPlayerCurrentZone(playerId));

		if (currentZone === undefined) {
			return;
		}

		const enemyType = target.attributes.Type.gsub(" ", "")[0].lower();
		const mission = store.getState(selectPlayerMission(playerId, currentZone));

		if (mission === undefined) {
			return;
		}

		const task = mission.tasks.find((task) => task.id === enemyType);
		if (task === undefined) {
			return;
		}

		if (task.progress < task.maxProgress) {
			store.addMissionProgress(playerId, mission.id, enemyType, 1);
		}
	}

	// reward(playerId: string, mission: Mission): void {}

	transform(index: number): Omit<Task, "id"> {
		return {
			title: this.name.format(index * 10),
			progress: 0,
			maxProgress: index * 10,
			description: this.description,
		};
	}
}
