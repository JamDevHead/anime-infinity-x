import { Controller, OnRender, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { Players, Workspace } from "@rbxts/services";
import { EnemyModel } from "@/client/components/enemy";
import { OnCharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { OnInput } from "@/client/controllers/lifecycles/on-input";
import { getMouseTarget } from "@/client/utils/mouse";

@Controller()
export class EnemyAttacker implements OnCharacterAdd, OnInput, OnStart, OnRender {
	private root: Part | undefined;
	private highlight = new Instance("Highlight");
	private raycastParams = new RaycastParams();
	private currentEnemy: EnemyModel | undefined;
	private enemyFolder: Folder | undefined;

	constructor(private readonly logger: Logger) {}

	onStart() {
		const localPlayer = Players.LocalPlayer;
		const playerGui = localPlayer.WaitForChild("PlayerGui") as PlayerGui;
		const enemyFolder = Workspace.WaitForChild("Enemies") as Folder;

		this.enemyFolder = enemyFolder;

		this.highlight.DepthMode = Enum.HighlightDepthMode.Occluded;
		this.highlight.FillTransparency = 0.75;
		this.highlight.FillColor = Color3.fromRGB();

		this.highlight.Name = "EnemyHighlight";
		this.highlight.Parent = playerGui;

		this.raycastParams.FilterType = Enum.RaycastFilterType.Include;
		this.raycastParams.AddToFilter(enemyFolder);
	}

	getEnemyModel(enemyPart: BasePart) {
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

		return model as EnemyModel | undefined;
	}

	getEnemyDistance(enemyPart: BasePart) {
		if (!this.root) {
			return 9e9;
		}

		const origin = this.root.Position;
		return origin.sub(enemyPart.Position).Magnitude;
	}

	onRender() {
		const target = getMouseTarget(this.raycastParams);
		const isTargetValid = target.Instance !== undefined && this.getEnemyDistance(target.Instance) <= 10;
		const enemyModel = isTargetValid ? this.getEnemyModel(target.Instance) : undefined;

		if (!isTargetValid) {
			this.highlight.Adornee = undefined;
			this.currentEnemy = undefined;
			return;
		}

		this.highlight.Adornee = enemyModel;
	}

	onCharacterAdded(character: Model) {
		this.root = character.WaitForChild("HumanoidRootPart") as unknown as Part;
	}

	onCharacterRemoved() {
		this.root = undefined;
		this.highlight.Adornee = undefined;
	}

	isValidInput(input: InputObject) {
		return input.UserInputType === Enum.UserInputType.MouseButton1;
	}

	onInputBegan(input: InputObject, gameProcessedEvent: boolean) {
		if (!this.isValidInput(input) || gameProcessedEvent) {
			return;
		}
	}

	onInputEnded(input: InputObject) {
		if (!this.isValidInput(input)) {
			return;
		}
	}
}
