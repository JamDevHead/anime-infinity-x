import { Components } from "@flamework/components";
import { Controller, OnRender, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createRoot } from "@rbxts/react-roblox";
import Roact, { StrictMode } from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import { OnCharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { OnInput } from "@/client/controllers/lifecycles/on-input";
import { EnemyProvider } from "@/client/providers/enemy-provider";
import { store } from "@/client/store";
import { selectHoveredEnemy } from "@/client/store/enemy-hover";
import { getMouseTarget } from "@/client/utils/mouse";
import { EnemyComponent } from "@/shared/components/enemy-component";
import remotes from "@/shared/remotes";
import { selectSelectedEnemiesByPlayerId } from "@/shared/store/enemy-selection";

@Controller()
export class EnemySelector implements OnCharacterAdd, OnInput, OnStart, OnRender {
	private localPlayer = Players.LocalPlayer;
	private localUserId = tostring(this.localPlayer.UserId);
	private root: Part | undefined;
	private raycastParams = new RaycastParams();
	private enemyFolder: Folder | undefined;

	constructor(
		private readonly logger: Logger,
		private readonly components: Components,
	) {}

	onStart() {
		const enemyFolder = Workspace.WaitForChild("Enemies") as Folder;

		this.enemyFolder = enemyFolder;

		const root = createRoot(new Instance("Folder"));

		root.render(
			<StrictMode>
				<ReflexProvider producer={store}>
					<EnemyProvider userId={this.localUserId} />
				</ReflexProvider>
			</StrictMode>,
		);

		this.raycastParams.FilterType = Enum.RaycastFilterType.Include;
		this.raycastParams.AddToFilter(enemyFolder);
	}

	onRender() {
		const hoveredEnemy = store.getState(selectHoveredEnemy);
		const enemy = this.getEnemyAtMousePosition();

		if (hoveredEnemy === enemy?.attributes.Guid) {
			return;
		}

		const selectedEnemies = store.getState(selectSelectedEnemiesByPlayerId(this.localUserId));

		if (hoveredEnemy !== undefined) {
			store.removeHoveredEnemy();
		}

		if (enemy && !selectedEnemies?.includes(enemy.attributes.Guid)) {
			store.setHoveredEnemy(enemy.attributes.Guid);
		}
	}

	onCharacterAdded(character: Model) {
		this.root = character.WaitForChild("HumanoidRootPart") as unknown as Part;
	}

	onCharacterRemoved() {
		this.root = undefined;
	}

	onInputBegan(input: InputObject, gameProcessedEvent: boolean) {
		if (!this.isValidInput(input) || gameProcessedEvent) {
			return;
		}

		const selectedEnemies = store.getState(selectSelectedEnemiesByPlayerId(this.localUserId));
		const enemy = this.getEnemyAtMousePosition();

		const clearSelection = () => {
			if (selectedEnemies && selectedEnemies.size() > 0) {
				selectedEnemies.forEach((enemyUid) => remotes.fighterTarget.unselect.fire(enemyUid));
			}
		};

		if (!enemy) {
			clearSelection();
			return;
		}

		const uid = enemy.attributes.Guid;

		if (!selectedEnemies?.includes(uid)) {
			clearSelection();

			remotes.fighterTarget.select.fire(uid);
		}
	}

	private isValidInput(input: InputObject) {
		return input.UserInputType === Enum.UserInputType.MouseButton1;
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

		const origin = this.root.Position;
		return origin.sub(enemyPart.Position).Magnitude;
	}

	private getEnemyAtMousePosition() {
		const target = getMouseTarget(this.raycastParams);
		const isTargetValid = target.Instance !== undefined && this.getEnemyDistance(target.Instance) <= 80; // TODO: put the range in a constant
		return isTargetValid ? this.getEnemyModel(target.Instance) : undefined;
	}
}
