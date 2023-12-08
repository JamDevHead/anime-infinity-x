import { Modding, OnStart, Service } from "@flamework/core";
import { MissionDecorator } from "@/server/services/missions";

@Service()
export class MissionDecoratorService implements OnStart {
	onStart() {
		const constructors = Modding.getDecorators<typeof MissionDecorator>();
		print("Mission decorator service started", constructors);
		for (const { object, arguments: args } of constructors) {
			print("MissionDecorator", args[0], object);
		}

		Modding.onListenerAdded<typeof MissionDecorator>((object) => {
			const decorator = Modding.getDecorator<typeof MissionDecorator>(object);

			if (decorator) {
				const [name] = decorator.arguments;
				print(object, "is the child of", name);
			}
		});
	}
}
