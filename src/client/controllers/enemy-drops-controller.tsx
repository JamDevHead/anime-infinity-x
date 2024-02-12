import { Controller, OnStart } from "@flamework/core";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { SoundController } from "@/client/controllers/sound-controller";
import { EnemyDropProvider } from "@/client/providers/enemy-drop-provider";
import { store } from "@/client/store";

@Controller()
export class EnemyDropsController implements OnStart {
	private dropContainer = new Instance("Folder");

	constructor(private readonly soundController: SoundController) {}

	onStart() {
		this.dropContainer.Name = "Drops";
		this.dropContainer.Parent = Workspace;

		const root = createRoot(new Instance("Folder"));

		root.render(
			createPortal(
				<ReflexProvider producer={store}>
					<EnemyDropProvider soundTracker={this.soundController.tracker} />
				</ReflexProvider>,
				this.dropContainer,
			),
		);
	}
}
