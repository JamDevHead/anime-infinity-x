import Object from "@rbxts/object-utils";
import { Setting } from "@/@types/models/setting";

export const DefaultSettings: Record<string, Setting> = {
	music: {
		label: "Toggle Music",
		value: false,
	},
	shadow: {
		label: "Toggle Shadow",
		value: false,
	},
};

export const transformSettingsToPacket = (settings: Record<string, Setting>): Record<string, boolean | number> => {
	const packet: Record<string, unknown> = {};

	for (const [key, setting] of Object.entries(settings)) {
		packet[key] = setting.value;
	}

	return packet as Record<string, boolean | number>;
};
