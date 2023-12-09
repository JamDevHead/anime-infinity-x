import { Modding, OnInit, OnStart, Service } from "@flamework/core";
import { TaskComponent } from "@/server/services/tasks/task-component";
import { Signal } from "@rbxts/beacon";
import { Constructor } from "@flamework/core/out/types";

/**
 * Decorator for mission task classes.
 * @metadata flamework:implements flamework:parameters
 */
export const MissionTask = Modding.createMetaDecorator("Class");

@Service({
	loadOrder: 0,
})
export class TaskDecoratorService implements OnInit, OnStart {
	public tasks = new Map<string, TaskComponent>();
	public taskSignal = new Signal<[type: string, ...args: unknown[]]>();

	onInit() {
		const taskConstructors = Modding.getDecorators<typeof MissionTask>();

		for (const { object: ctor } of taskConstructors) {
			print("Creating mission object", ctor);

			const taskComponent = Modding.resolveSingleton(ctor as Constructor<TaskComponent>);
			this.tasks.set(tostring(ctor), taskComponent);
		}
	}

	onStart() {
		for (const [, taskComponent] of this.tasks) {
			task.spawn(() => taskComponent.onStart());
		}

		this.taskSignal.Connect((missionType, ...args) => {
			this.tasks.get(missionType + "Task")?.action(...args);
		});
	}
}
