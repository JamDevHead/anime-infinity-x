import { MissionDecorator, MissionDecoratorService } from "@/server/services/missions";
import { MissionComponent } from "@/server/services/missions/mission-component";

@MissionDecorator()
export class TestMission extends MissionComponent {
	constructor(private missionDecoratorService: MissionDecoratorService) {
		super();
	}

	onStart() {
		print("TestMission onStart");
	}

	action(): void {}

	reward(): void {}
}
