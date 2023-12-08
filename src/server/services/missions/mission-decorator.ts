import { Modding } from "@flamework/core";

export const MissionDecorator = Modding.createDecorator("Class", (descriptor) => {
	print("MissionDecorator", descriptor.object);
	print(descriptor);
});
