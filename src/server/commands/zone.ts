import { ZirconFunctionBuilder } from "@rbxts/zircon";
import { store } from "@/server/store";
import { ZONES } from "@/shared/constants/zones";

const unlock = new ZirconFunctionBuilder("unlock")
	.AddDescription("Unlock a zone")
	.AddArgument("string", "Zone")
	.Bind((context, zone) => {
		const player = context.GetExecutor();

		const zoneData = ZONES[zone.lower() as keyof typeof ZONES];

		if (zoneData === undefined) {
			context.LogError("Invalid zone");
			return;
		}

		store.unlockZone(tostring(player.UserId), zone.upper());
		store.setCurrentZone(tostring(player.UserId), zone.upper());

		context.LogInfo(`Unlocked zone ${zone}`);
	});

export const zoneCommands = [unlock];
