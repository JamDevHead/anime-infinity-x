import { Components } from "@flamework/components";
import { Controller, OnRender, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createRoot } from "@rbxts/react-roblox";
import Roact, { StrictMode } from "@rbxts/roact";
import { Players, UserInputService, Workspace } from "@rbxts/services";
import { OnCharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { OnInput } from "@/client/controllers/lifecycles/on-input";
import { EnemyProvider } from "@/client/providers/enemy-provider";
import { store } from "@/client/store";
import { selectHoveredEnemy } from "@/client/store/enemy-hover";
import { getMouseTarget } from "@/client/utils/mouse";
import { images } from "@/shared/assets/images";
import { EnemyComponent } from "@/shared/components/enemy-component";
import remotes from "@/shared/remotes";
import { selectSelectedEnemiesByPlayerId } from "@/shared/store/enemy-selection";
import { selectActivePlayerFighters } from "@/shared/store/players/fighters";

@Controller()
export class EnemySelector implements OnCharacterAdd, OnInput, OnStart, OnRender {
	public enemyFolder: Folder | undefined;

	private localPlayer = Players.LocalPlayer;
	private localUserId = tostring(this.localPlayer.UserId);
	private root: Part | undefined;
	private raycastParams = new RaycastParams();
	private isActiveFightersEmpty = false;
	private defaultCursorIcon = UserInputService.MouseIcon;
	private clickTimer = 0;

	constructor(
		private readonly logger: Logger,
		private readonly components: Components,
	) {}

	onStart() {
		this.enemyFolder = Workspace.WaitForChild("Enemies") as Folder;

		const root = createRoot(new Instance("Folder"));

		root.render(
			<StrictMode>
				<ReflexProvider producer={store}>
					<EnemyProvider userId={this.localUserId} components={this.components} />
				</ReflexProvider>
			</StrictMode>,
		);

		this.raycastParams.FilterType = Enum.RaycastFilterType.Exclude;
		this.raycastParams.AddToFilter(Workspace.WaitForChild("Players") as Folder);

		const selectLocalPlayerActiveFighters = selectActivePlayerFighters(this.localUserId);
		const onActiveFighterChange = (activeFighters: string[]) => {
			this.isActiveFightersEmpty = activeFighters.size() === 0;

			if (this.isActiveFightersEmpty) {
				this.clearSelection();
			}
		};

		store.subscribe(selectLocalPlayerActiveFighters, onActiveFighterChange);

		const activeFighters = store.getState(selectLocalPlayerActiveFighters);

		onActiveFighterChange(activeFighters);
	}

	onRender() {
		const hoveredEnemy = store.getState(selectHoveredEnemy);
		const enemy = this.getEnemyAtMousePosition();

		if (hoveredEnemy === enemy?.attributes.Guid) {
			return;
		}

		const selectedEnemies = store.getState(selectSelectedEnemiesByPlayerId(this.localUserId));

		if (hoveredEnemy !== undefined) {
			UserInputService.MouseIcon = this.defaultCursorIcon;
			store.removeHoveredEnemy();
		}

		if (enemy && !selectedEnemies?.includes(enemy.attributes.Guid)) {
			UserInputService.MouseIcon = images.icons.attack_cursor;
			store.setHoveredEnemy(enemy.attributes.Guid);
		}
	}

	onCharacterAdded(character: Model) {
		this.root = character.WaitForChild("HumanoidRootPart") as unknown as Part;
	}

	onCharacterRemoved() {
		this.root = undefined;
	}

	onInputBegan(input: InputObject) {
		if (!this.isValidInput(input) || this.isActiveFightersEmpty) {
			return;
		}

		this.clickTimer = tick();
	}

	onInputEnded(input: InputObject, gameProcessedEvent: boolean) {
		if (!this.isValidInput(input) || gameProcessedEvent || this.isActiveFightersEmpty) {
			return;
		}
		const timer = this.clickTimer;
		this.clickTimer = 0;

		if (tick() - timer > 0.15) {
			return;
		}

		const selectedEnemies = store.getState(selectSelectedEnemiesByPlayerId(this.localUserId));
		const enemy = this.getEnemyAtMousePosition();

		if (!enemy) {
			this.clearSelection();
			return;
		}

		const uid = enemy.attributes.Guid;

		if (!selectedEnemies?.includes(uid)) {
			this.clearSelection();
			remotes.fighterTarget.select.fire(uid);
		}
	}

	private clearSelection() {
		remotes.fighterTarget.unselectAll.fire();
	}

	private isValidInput(input: InputObject) {
		return (
			input.UserInputType === Enum.UserInputType.MouseButton1 || input.UserInputType === Enum.UserInputType.Touch
		);
	}

	private getEnemyModel(enemyPart: BasePart) {
		if (!this.enemyFolder) {
			return;
		}

		let model = enemyPart.FindFirstAncestorOfClass("Model");

		while (model?.Parent !== this.enemyFolder) {
			if (model === undefined) {
				break;
			}

			model = model.FindFirstAncestorOfClass("Model");
		}

		return model && this.components.getComponent<EnemyComponent>(model);
	}

	private getEnemyDistance(enemyPart: BasePart) {
		if (!this.root) {
			return 9e9;
		}

		if (!this.enemyFolder || !enemyPart.IsDescendantOf(this.enemyFolder)) {
			return 9e9;
		}

		const origin = this.root.Position;
		return origin.sub(enemyPart.Position).Magnitude;
	}

	private getEnemyAtMousePosition() {
		const target = getMouseTarget(this.raycastParams);
		const isTargetValid = target.Instance !== undefined && this.getEnemyDistance(target.Instance) <= 30; // TODO: put the range in a constant
		return isTargetValid ? this.getEnemyModel(target.Instance) : undefined;
	}
}
