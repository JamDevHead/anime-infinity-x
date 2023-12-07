import { ZirconFunctionBuilder } from "@rbxts/zircon";
import { store } from "@/server/store";
import { defaultPlayerData } from "@/shared/store/players";

const reset = new ZirconFunctionBuilder("reset").AddDescription("Reset player data").Bind((context) => {
	const player = context.GetExecutor();

	store.loadPlayerData(tostring(player.UserId), defaultPlayerData);
	context.LogInfo("Your data has been reset");
});

export const playerDataCommands = [reset];
