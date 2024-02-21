import { BaseComponent, Component } from "@flamework/components";
import { OnPhysics, OnRender, OnStart } from "@flamework/core";
import Gizmo from "@rbxts/gizmo";
import { Logger } from "@rbxts/log";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import { FighterGoal } from "@/client/components/fighter-goal/fighter-goal-component";
import { FighterGoalAttributes } from "@/client/components/fighter-goal/fighter-goal-types";
import { FighterSpecialHud } from "@/client/components/react/fighter-special-hud/fighter-special-hud";
import { FightersTracker } from "@/client/controllers/fighters-tracker-controller/tracker-controller";
import { CharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { OnInput } from "@/client/controllers/lifecycles/on-input";
import { store } from "@/client/store";
import { getMouseTarget } from "@/client/utils/mouse";
import { AnimationMap, AnimationTracker } from "@/shared/lib/animation-tracker";
import remotes from "@/shared/remotes";
import { calculateStun } from "@/shared/utils/fighters/fighters-utils";

interface IFighterModel extends Model {
	Humanoid: Humanoid & {
		Animator: Animator;
	};
}

const animationMap = {
	idle: { id: "14451184535" },
	walk: { id: "14678864223" },
	run: { id: "14678864223" },
	jump: { id: "125750702", priority: Enum.AnimationPriority.Action },
	fall: { id: "15484732189" },
	soco1: { id: "15461463119" },
	soco2: { id: "15461470426" },
} satisfies AnimationMap;

@Component()
export class FighterModel
	extends BaseComponent<Pick<FighterGoalAttributes, "fighterId">, IFighterModel>
	implements OnStart, OnPhysics, OnRender, OnInput
{
	public fighterGoal: FighterGoal | undefined;

	private humanoid = this.instance.Humanoid;
	private torso = this.instance.FindFirstChild("Torso") as Part | undefined;
	private animator = this.humanoid.Animator;
	private animationTracker = new AnimationTracker(this.animator, animationMap);
	private trove = new Trove();
	private lastFighterPosition = Vector3.zero;
	private collidableParts = new Set<BasePart>();
	private raycastParams = new RaycastParams();
	private currentState: Enum.HumanoidStateType = Enum.HumanoidStateType.None;
	private fighterStun = 0;
	private attackState = 1;

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
				part.CanQuery = true;
				part.CanTouch = false;

				if (part === root) {
					continue;
				}

				this.collidableParts.add(part);
				part.Anchored = false;
			}
		}

		this.humanoid.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None;

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
		highlight.OutlineTransparency = 0.5;
		highlight.DepthMode = Enum.HighlightDepthMode.Occluded;
		highlight.OutlineColor = Color3.fromRGB();
		highlight.Parent = this.instance;

		// Fighter special hud
		const specialRoot = createRoot(new Instance("Folder"));

		specialRoot.render(
			createPortal(
				<ReflexProvider producer={store}>
					<billboardgui Size={UDim2.fromScale(2.5, 0.15)} StudsOffsetWorldSpace={Vector3.yAxis.mul(3)}>
						<FighterSpecialHud fighterId={this.attributes.fighterId} />
					</billboardgui>
				</ReflexProvider>,
				root,
			),
		);

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
		this.fighterStun = math.max(this.fighterStun - dt, 0);

		const character = this.characterAdd.character;
		const humanoid = character?.FindFirstChild("Humanoid") as Humanoid | undefined;

		if (!this.humanoid?.RootPart || !humanoid || !this.fighterGoal) {
			return;
		}

		const root = this.humanoid.RootPart;
		const rootDisplacement = root.Position.sub(this.lastFighterPosition);
		const rootVelocity = rootDisplacement.div(dt);
		const speed = rootVelocity.Magnitude;

		this.lastFighterPosition = root.Position;

		const isGrounded = this.isGrounded();
		const isFalling = !isGrounded && rootVelocity.Y < 0;
		const isJumping = humanoid.Jump && this.fighterGoal.currentEnemy === undefined;
		const isRunning = isGrounded && speed > 5;
		const animationTracker = this.animationTracker;

		if (animationTracker.isAnimationPlaying("soco1") || animationTracker.isAnimationPlaying("soco2")) {
			return;
		}

		let newState = this.currentState;

		switch (true) {
			case isJumping:
				newState = Enum.HumanoidStateType.Jumping;
				animationTracker.swapAnimation("jump");
				break;
			case isFalling:
				if (newState !== Enum.HumanoidStateType.FallingDown) {
					newState = Enum.HumanoidStateType.FallingDown;
					animationTracker.swapAnimation("fall");
				}
				break;
			case isRunning:
				if (newState !== Enum.HumanoidStateType.Running) {
					newState = Enum.HumanoidStateType.Running;
					animationTracker.getAnimationTrack("run")?.AdjustSpeed(speed / 16);
					animationTracker.swapAnimation("run");
				}
				break;
			case isGrounded:
				if (newState !== Enum.HumanoidStateType.Landed) {
					newState = Enum.HumanoidStateType.Landed;
					animationTracker.swapAnimation("idle");
				}
				break;
		}

		this.currentState = newState;
	}

	onInputBegan(input: InputObject, gameProcessedEvent: boolean) {
		if (
			gameProcessedEvent ||
			(input.UserInputType !== Enum.UserInputType.MouseButton1 &&
				input.UserInputType !== Enum.UserInputType.Touch)
		) {
			return;
		}

		const target = getMouseTarget();

		if (!target.Instance?.IsDescendantOf(this.instance)) return;

		// TODO: make fighter do an animation

		remotes.fighter.activateSpecial.fire(this.attributes.fighterId);
		this.fighterStun += 5;
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

	public attack() {
		const dexterity = this.fighterGoal?.fighterStats?.dexterity;

		if (dexterity === undefined || this.fighterStun > 0) {
			return;
		}

		this.fighterStun = calculateStun(dexterity);

		this.attackState = this.attackState === 1 ? 2 : 1;
		this.animationTracker.playAnimationTrack(`soco${this.attackState}`);
	}
}
