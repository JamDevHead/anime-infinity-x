import { MissionTypes } from "server/mission-events";

export interface Mission {
	id: string;
	title: string;
	description?: string;
	type: MissionTypes;
	tasks: Task[];
}

export interface Task {
	id: string;
	title: string;
	description: string;
	progress: number;
	maxProgress: number;
}
