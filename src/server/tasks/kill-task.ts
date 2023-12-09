import { MissionTask, TaskDecoratorService } from "server/services/tasks";
import { TaskComponent } from "@/server/services/tasks/task-component";
import { Enemy } from "@/server/components/enemy";

@MissionTask()
export class KillTask extends TaskComponent {
	name = "Kill @N enemies";

	constructor(private missionDecoratorService: TaskDecoratorService) {
		super();
	}

	onStart() {}

	action(playerId: string, target: Enemy): void {
		print("Kill mission task action", playerId, target);
	}

	reward(): void {}
}
