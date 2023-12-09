export abstract class TaskComponent {
	abstract id: string;
	abstract name: string;
	description?: string;

	abstract onStart(): void;
	abstract action(...args: unknown[]): void;
	abstract reward(): void;
}
