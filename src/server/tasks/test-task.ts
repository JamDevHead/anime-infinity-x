import { MissionTask, TaskDecoratorService } from "server/services/tasks";
import { TaskComponent } from "@/server/services/tasks/task-component";

@MissionTask()
export class TestTask extends TaskComponent {
	id = "test";
	name = "gamer";

	constructor(private missionDecoratorService: TaskDecoratorService) {
		super();
	}

	onStart() {
		print("TestTask onStart");
	}

	action(): void {}

	reward(): void {}
}
