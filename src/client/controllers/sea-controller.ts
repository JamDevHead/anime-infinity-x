import { Controller, OnRender, OnStart } from "@flamework/core";
import { ReplicatedStorage, Workspace } from "@rbxts/services";

const seaModel = ReplicatedStorage.assets.Sea;

@Controller()
export class SeaController implements OnStart, OnRender {
	private readonly SEA_LEVEL = -19;
	private camera = Workspace.CurrentCamera as Camera;
	private sea = seaModel.Clone();

	onStart() {
		this.sea = seaModel.Clone();
		this.sea.Parent = Workspace.Terrain;
	}

	onRender() {
		const position = this.camera.CFrame.Position;
		this.sea.PivotTo(new CFrame(position.X, this.SEA_LEVEL, position.Z));
	}
}
