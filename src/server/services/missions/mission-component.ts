export abstract class MissionComponent {
	abstract onStart(): void;
	abstract action(...args: unknown[]): void;
	abstract reward(): void;
}
