import { BaseComponent, Component } from "@flamework/components";
import { OnPhysics, OnRender, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { Trove } from "@rbxts/trove";
import { CharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { Workspace } from "@rbxts/services";
import { FightersTracker } from "@/client/controllers/fighters-tracker";
import Gizmo from "@rbxts/gizmo";
import { FighterGoal } from "@/client/components/fighter-goal";
import { AnimationTracker } from "@/shared/lib/animation-tracker";

interface IFighterModel extends Model {
	Humanoid: Humanoid & {
		Animator: Animator;
	};
}

const animationMap = {
	idle: "14451184535",
	walk: "14678864223",
	run: "14678864223",
	jump: "125750702",
	fall: "180436148",
} as const;

@Component({ tag: "Fighter" })
export class FighterModel
	extends BaseComponent<NonNullable<unknown>, IFighterModel>
	implements OnStart, OnRender, OnPhysics
{
	public fighterGoal!: FighterGoal;

	private humanoid = this.instance.Humanoid;
	private torso = this.instance.FindFirstChild("Torso") as Part | undefined;
	private animator = this.humanoid.Animator;
	private animationTracker = new AnimationTracker(this.animator, animationMap);
	private trove = new Trove();
	private lastFighterPosition = Vector3.zero;
	private fighterVelocity = 0;
	private collidableParts = new Set<BasePart>();
	private raycastParams = new RaycastParams();

	constructor(
		private readonly logger: Logger,
		private readonly characterAdd: CharacterAdd,
		private readonly fightersTracker: FightersTracker,
	) {
		super();
	}

	onStart() {
		const root = this.humanoid.RootPart;

		if (!root) {
			this.logger.Warn("Failed to find fighter root");
			return;
		}

		// Setup fighter root
		root.Anchored = true;

		// Cleanup fighter model
		for (const part of this.instance.GetDescendants()) {
			if (part.IsA("BasePart")) {
				part.CanCollide = false;
				part.CanQuery = false;
				part.CanTouch = false;

				if (part === root) {
					continue;
				}

				this.collidableParts.add(part);
				part.Anchored = false;
			}
		}

		// Setup raycast params
		this.raycastParams.FilterType = Enum.RaycastFilterType.Exclude;
		this.raycastParams.AddToFilter(this.fightersTracker.fightersFolder);

		// Setup fighter pivot
		const [currentPivot, fighterSize] = this.instance.GetBoundingBox();
		const halfFighterSize = fighterSize.Y / 2;

		this.instance.PrimaryPart = undefined;
		this.instance.WorldPivot = currentPivot.sub(Vector3.yAxis.mul(halfFighterSize));

		// Setup fighter highlight
		const highlight = new Instance("Highlight");
		highlight.FillTransparency = 1;
		highlight.OutlineTransparency = 0;
		highlight.DepthMode = Enum.HighlightDepthMode.Occluded;
		highlight.OutlineColor = Color3.fromRGB();
		highlight.Parent = this.instance;

		// Setup fighter cleanup
		this.trove.add(() => this.animationTracker.destroy());
		this.trove.add(this.instance);
	}

	onPhysics() {
		if (!this.torso) {
			return;
		}

		this.collidableParts.forEach((part) => {
			part.CanCollide = false;
		});
	}

	onRender(dt: number) {
		const character = this.characterAdd.character;
		const humanoid = character?.FindFirstChild("Humanoid") as Humanoid | undefined;

		if (!this.humanoid?.RootPart || !humanoid) {
			return;
		}

		// Update fighter model
		this.instance.PivotTo(this.fighterGoal.fighterPart.CFrame);

		const root = this.humanoid.RootPart;
		const distance = root.Position.sub(this.lastFighterPosition).Magnitude;

		this.fighterVelocity = distance > 0.15 ? distance / dt : 0;
		this.lastFighterPosition = root.Position;

		const isFalling = !this.isGrounded();
		const isJumping = humanoid.Jump && this.fighterGoal.currentEnemy === undefined;
		const isRunning = this.fighterVelocity > 0.2;
		const animationTracker = this.animationTracker;

		switch (true) {
			case isJumping:
				animationTracker.swapAnimation("jump");
				break;
			case isFalling:
				animationTracker.swapAnimation("fall");
				break;
			case isRunning:
				animationTracker.getAnimationTrack("run")?.AdjustSpeed(this.fighterVelocity / 16);
				animationTracker.swapAnimation("run");
				break;
			default:
				animationTracker.swapAnimation("idle");
				break;
		}
	}

	destroy() {
		super.destroy();
		this.trove.destroy();
	}

	private isGrounded() {
		const origin = this.instance.GetPivot().Position.add(Vector3.yAxis.mul(1.5));
		const direction = Vector3.yAxis.mul(-2.75);
		const groundHit = Workspace.Raycast(origin, direction, this.raycastParams);

		Gizmo.arrow.styleDraw(
			{ color: groundHit ? Color3.fromRGB(255, 0, 0) : Color3.fromRGB(0, 255, 0), scale: 0.2 },
			origin,
			groundHit?.Position ?? origin.add(direction),
		);

		return groundHit !== undefined;
	}
}
