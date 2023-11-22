import { Controller, OnRender, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { createRoot } from "@rbxts/react-roblox";
import Roact, { StrictMode } from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import { Enemy } from "@/client/components/enemy";
import { OnCharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { OnInput } from "@/client/controllers/lifecycles/on-input";
import { getMouseTarget } from "@/client/utils/mouse";
import { EnemyProvider } from "@/client/providers/enemy-provider";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "@/client/store";
import { Components } from "@flamework/components";
import { selectHoveredEnemy } from "@/client/store/enemy-selection";

@Controller()
export class EnemySelector implements OnCharacterAdd, OnInput, OnStart, OnRender {
	private root: Part | undefined;
	private highlight = new Instance("Highlight");
	private selectionHighlight = new Instance("Highlight");
	private raycastParams = new RaycastParams();
	private currentEnemy: Enemy | undefined;
	private enemyFolder: Folder | undefined;

	constructor(
		private readonly logger: Logger,
		private readonly components: Components,
	) {}

	onStart() {
		const localPlayer = Players.LocalPlayer;
		const playerGui = localPlayer.WaitForChild("PlayerGui") as PlayerGui;
		const enemyFolder = Workspace.WaitForChild("Enemies") as Folder;

		this.enemyFolder = enemyFolder;

		const root = createRoot(new Instance("Folder"));

		root.render(
			<StrictMode>
				<ReflexProvider producer={store}>
					<EnemyProvider />
				</ReflexProvider>
			</StrictMode>,
		);

		this.highlight.DepthMode = Enum.HighlightDepthMode.Occluded;
		this.highlight.FillTransparency = 1;
		this.highlight.FillColor = Color3.fromRGB();

		this.selectionHighlight.DepthMode = Enum.HighlightDepthMode.Occluded;
		this.selectionHighlight.FillTransparency = 0.75;
		this.selectionHighlight.FillColor = Color3.fromRGB();

		this.highlight.Name = "EnemyHighlight";
		this.highlight.Parent = playerGui;

		this.selectionHighlight.Name = "EnemySelectionHighlight";
		this.selectionHighlight.Parent = playerGui;

		this.raycastParams.FilterType = Enum.RaycastFilterType.Include;
		this.raycastParams.AddToFilter(enemyFolder);
	}

	onRender() {
		const hoveredEnemy = store.getState(selectHoveredEnemy);
		const enemy = this.getEnemyAtMousePosition();

		if (hoveredEnemy === enemy) {
			return;
		}

		if (hoveredEnemy) {
			store.removeHoveredEnemy(hoveredEnemy);
		}

		if (enemy) {
			store.setHoveredEnemy(enemy);
		}
	}

	onCharacterAdded(character: Model) {
		this.root = character.WaitForChild("HumanoidRootPart") as unknown as Part;
	}

	onCharacterRemoved() {
		this.root = undefined;
		this.highlight.Adornee = undefined;
	}

	onInputBegan(input: InputObject, gameProcessedEvent: boolean) {
		if (!this.isValidInput(input) || gameProcessedEvent) {
			return;
		}

		const enemy = this.getEnemyAtMousePosition();

		if (!enemy) {
			if (this.currentEnemy) {
				store.removeSelectedEnemy(this.currentEnemy);
				this.currentEnemy = undefined;
			}
			return;
		}

		if (this.currentEnemy !== enemy) {
			if (this.currentEnemy) {
				store.removeSelectedEnemy(this.currentEnemy);
			}

			this.currentEnemy = enemy;
			store.setSelectedEnemy(enemy);
		}
	}

	onInputEnded(input: InputObject) {
		if (!this.isValidInput(input)) {
			return;
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

		return model && this.components.getComponent<Enemy>(model);
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
