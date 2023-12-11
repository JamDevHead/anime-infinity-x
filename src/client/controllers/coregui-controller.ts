import { Controller, OnStart } from "@flamework/core";
import { StarterGui } from "@rbxts/services";
import { RootState, store } from "@/client/store";

@Controller()
export class CoreguiController implements OnStart {
	onStart() {
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);
		const selectHudVisible = (state: RootState) => state.hud.visible;

		store.subscribe(selectHudVisible, (visible) => {
			StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Chat, visible);
			StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.PlayerList, visible);
			StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.EmotesMenu, visible);
			StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Captures, visible);
		});
	}
}
