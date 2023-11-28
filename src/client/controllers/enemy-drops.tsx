import { Components } from "@flamework/components";
import { Controller, OnStart } from "@flamework/core";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import { EnemyDropProvider } from "@/client/providers/enemy-drop-provider";
import { store } from "@/client/store";

@Controller()
export class EnemyDrops implements OnStart {
	private dropContainer = new Instance("Folder");

	constructor(private components: Components) {}

	onStart() {
		this.dropContainer.Name = "Drops";
		this.dropContainer.Parent = Workspace;

		const root = createRoot(new Instance("Folder"));
		const localPlayer = Players.LocalPlayer;

		root.render(
			createPortal(
				<ReflexProvider producer={store}>
					<EnemyDropProvider ownerId={tostring(localPlayer.UserId)} components={this.components} />
				</ReflexProvider>,
				this.dropContainer,
			),
		);
	}
}
