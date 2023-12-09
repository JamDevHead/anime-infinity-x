import { Modding, OnInit, OnStart, Service } from "@flamework/core";
import { MissionComponent } from "@/server/services/missions/mission-component";
import { Signal } from "@rbxts/beacon";
import { Constructor } from "@flamework/core/out/types";

/**
 * Decorator for mission classes.
 * @metadata flamework:implements flamework:parameters
 */
export const MissionDecorator = Modding.createMetaDecorator("Class");

@Service({
	loadOrder: 0,
})
export class MissionDecoratorService implements OnInit, OnStart {
	public missions = new Map<string, MissionComponent>();
	public missionSignal = new Signal<[type: string, ...args: unknown[]]>();

	onInit() {
		const missionConstructors = Modding.getDecorators<typeof MissionDecorator>();

		for (const { object: ctor } of missionConstructors) {
			print("Creating mission object", ctor);

			const missionComponent = Modding.resolveSingleton(ctor as Constructor<MissionComponent>);
			this.missions.set(tostring(ctor), missionComponent);
		}
	}

	onStart() {
		for (const [, mission] of this.missions) {
			task.spawn(() => mission.onStart());
		}

		this.missionSignal.Connect((missionType, ...args) => {
			this.missions.get(missionType + "Mission")?.action(...args);
		});
	}
}
