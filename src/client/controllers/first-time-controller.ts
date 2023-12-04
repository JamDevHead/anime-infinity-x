import { Controller, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { Players, Workspace } from "@rbxts/services";
import { OnCharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { store } from "@/client/store";
import { selectPlayerInfo } from "@/shared/store/players";

interface Zone extends Instance {
	Map: Folder;
	Spawn: Part;
	Nodes: {
		GetChildren(): Part[];
	} & Folder;
}

interface ZonesFolder extends Folder {
	GetChildren(): (Zone & Instance)[];
}

@Controller()
export class FirstTimeController implements OnStart, OnCharacterAdd {
	private zonesFolder = Workspace.WaitForChild("Zones") as ZonesFolder;
	private initialZone = "NRT";

	constructor(private readonly logger: Logger) {}

	onStart(): void {
		this.logger.Info("FirstTimeController started");

		this.setupCamera();

		store.subscribe(selectPlayerInfo(tostring(Players.LocalPlayer.UserId)), (playerInfo) => {
			playerInfo?.firstTime ? this.setupCamera() : this.restoreCamera();
		});
	}

	onCharacterAdded() {
		this.setupCamera();
	}

	onCharacterRemoved() {
		this.restoreCamera();
	}

	setupCamera() {
		const playerInfo = store.getState(selectPlayerInfo(tostring(Players.LocalPlayer.UserId)));

		if (!playerInfo?.firstTime) return;

		const zone = this.zonesFolder.FindFirstChild(this.initialZone) as Zone | undefined;
		if (!zone) return;

		const cameraRef = zone.WaitForChild("Camera") as Part;

		const camera = Workspace.CurrentCamera as Camera;
		camera.CameraSubject = cameraRef;
		camera.CameraType = Enum.CameraType.Scriptable;
		camera.CFrame = cameraRef.CFrame;
	}

	restoreCamera() {
		const camera = Workspace.CurrentCamera as Camera;
		camera.CameraType = Enum.CameraType.Custom;
		camera.CameraSubject = Players.LocalPlayer.Character?.FindFirstChildOfClass("Humanoid");
	}
}
