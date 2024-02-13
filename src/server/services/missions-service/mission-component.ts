import { Task } from "@/shared/store/players/missions";

export abstract class MissionComponent {
	abstract name: string;
	description?: string;

	abstract tasks: Task[];

	onStart?(): void;
	abstract action(...args: unknown[]): void;
	// abstract reward(playerId: string, mission: Mission): void;
	abstract transform(index: number): Omit<Task, "id">;
}
