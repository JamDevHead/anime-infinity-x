import { Task } from "@/shared/store/players/missions";

export abstract class MissionComponent {
	abstract name: string;
	description?: string;

	abstract tasks: Task[];

	abstract onStart(): void;
	abstract action(...args: unknown[]): void;
	abstract reward(): void;
	abstract transform(index: number): Omit<Task, "id">;
}
