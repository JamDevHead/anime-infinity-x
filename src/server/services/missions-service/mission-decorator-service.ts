import { Modding, OnInit, OnStart, Service } from "@flamework/core";
import { Constructor } from "@flamework/core/out/utility";
import { Signal } from "@rbxts/beacon";
import { MissionComponent } from "@/server/services/missions-service/mission-component";

/**
 * Decorator for mission task classes.
 * @metadata flamework:implements flamework:parameters
 */
export const MissionTask = Modding.createMetaDecorator("Class");

@Service({
	loadOrder: 0,
})
export class MissionDecoratorService implements OnInit, OnStart {
	public missions = new Map<string, MissionComponent>();
	public taskSignal = new Signal<[type: string, ...args: unknown[]]>();

	onInit() {
		const taskConstructors = Modding.getDecorators<typeof MissionTask>();

		for (const { object: ctor } of taskConstructors) {
			print("Creating mission object", ctor);

			const missionComponent = Modding.resolveSingleton(ctor as Constructor<MissionComponent>);
			this.missions.set(tostring(ctor), missionComponent);
		}
	}

	onStart() {
		for (const [, mission] of this.missions) {
			task.spawn(() => mission.onStart?.());
		}

		this.taskSignal.Connect((missionType, ...args) => {
			this.missions.get(`${missionType}Mission`)?.action(...args);
		});
	}

	public getMissionOfType(Type: string) {
		for (const [taskName, task] of this.missions) {
			if (taskName.match(Type)[0] !== undefined) {
				return task;
			}
		}
	}
}
