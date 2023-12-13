import Object from "@rbxts/object-utils";
import { Setting } from "@/@types/models/setting";

export const DefaultSettings: Record<string, Setting> = {
	music: {
		label: "Toggle Music",
		value: true,
	},
	shadow: {
		label: "Toggle Shadow",
		value: true,
	},
};

export const transformSettingsToPacket = (settings: Record<string, Setting>): Record<string, Setting> => {
	const packet: Record<string, unknown> = {};

	for (const [key, setting] of Object.entries(settings)) {
		packet[key] = setting.value;
	}

	return packet as Record<string, Setting>;
};
