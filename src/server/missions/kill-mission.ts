import { MissionDecorator, MissionDecoratorService } from "@/server/services/missions";
import { MissionComponent } from "@/server/services/missions/mission-component";
import { Enemy } from "@/server/components/enemy";

@MissionDecorator()
export class KillMission extends MissionComponent {
	constructor(private missionDecoratorService: MissionDecoratorService) {
		super();
	}

	onStart() {}

	action(playerId: string, target: Enemy): void {
		print("Kill mission action", playerId, target);
	}

	reward(): void {}
}
