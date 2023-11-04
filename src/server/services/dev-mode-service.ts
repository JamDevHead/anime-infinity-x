import { OnStart, Service } from "@flamework/core";
import { RunService, Workspace } from "@rbxts/services";

@Service()
export class DevModeService implements OnStart {
	onStart(): void {
		if (!RunService.IsStudio()) return;

		Workspace.FindFirstChild("LunaAssets")?.Destroy();
	}
}
