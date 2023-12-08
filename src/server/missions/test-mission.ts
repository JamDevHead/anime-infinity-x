import { MissionDecorator } from "@/server/services/missions";

@MissionDecorator()
export class TestMission {
	constructor() {
		print("TestMission constructor");
	}
}
