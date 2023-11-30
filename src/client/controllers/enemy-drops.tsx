import { Controller, OnStart } from "@flamework/core";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import { CharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { SoundController } from "@/client/controllers/sound-controller";
import { EnemyDropProvider } from "@/client/providers/enemy-drop-provider";
import { store } from "@/client/store";
import { selectEnemiesDropsByOwnerId } from "@/shared/store/enemies/enemies-selectors";

@Controller()
export class EnemyDrops implements OnStart {
	private dropContainer = new Instance("Folder");

	constructor(
		private readonly characterAdd: CharacterAdd,
		private readonly soundController: SoundController,
	) {}

	onStart() {
		this.dropContainer.Name = "Drops";
		this.dropContainer.Parent = Workspace;

		const root = createRoot(new Instance("Folder"));
		const localPlayer = Players.LocalPlayer;
		const userId = tostring(localPlayer.UserId);

		root.render(
			createPortal(
				<ReflexProvider producer={store}>
					<EnemyDropProvider />
				</ReflexProvider>,
				this.dropContainer,
			),
		);

		store.observe(selectEnemiesDropsByOwnerId(userId), () => {
			return () => {
				const humanoidRoot = this.characterAdd.character?.FindFirstChild("HumanoidRootPart");
				if (humanoidRoot) {
					this.soundController.tracker.play("reward", humanoidRoot);
				}
			};
		});
	}
}
