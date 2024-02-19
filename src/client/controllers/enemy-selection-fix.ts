import { Controller, OnStart } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import { store } from "@/client/store";
import { selectPlayerCurrentZone } from "@/shared/store/players/zones";

@Controller()
export class EnemySelectionFix implements OnStart {
	onStart() {
		const fightersFolder = Workspace.WaitForChild("Fighters");

		const localPlayer = Players.LocalPlayer;
		const playerId = tostring(localPlayer.UserId);

		const selectLocalPlayerCurrentZone = selectPlayerCurrentZone(playerId);

		store.subscribe(selectLocalPlayerCurrentZone, (zone, lastZone) => {
			if (zone === lastZone || zone === undefined) {
				return;
			}

			// Fix to enemy selection raycast not working after being streamed in
			fightersFolder.Parent = undefined;
			fightersFolder.Parent = Workspace;
		});
	}
}
