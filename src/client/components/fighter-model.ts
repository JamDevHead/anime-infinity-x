import { BaseComponent, Component } from "@flamework/components";
import { OnPhysics, OnRender, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { Trove } from "@rbxts/trove";
import { CharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { Workspace } from "@rbxts/services";
import { FightersTracker } from "@/client/controllers/fighters-tracker";
import Gizmo from "@rbxts/gizmo";
import { FighterGoal } from "@/client/components/fighter-goal";

interface IFighterModel extends Model {
	Humanoid: Humanoid & {
		Animator: Animator;
	};
}

const animationMap = {
	idle: "180435571",
	walk: "180426354",
	run: "180426354",
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
	private trove = new Trove();
	private animationCache = new Map<string, AnimationTrack>();
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

		// Setup fighter cleanup
		this.trove.add(() => {
			this.animationCache.forEach((track) => track.Destroy());
			this.animationCache.clear();
		});
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

		switch (true) {
			case isFalling:
				this.swapAnimation("fall");
				break;
			case isJumping:
				this.swapAnimation("jump");
				break;
			case isRunning:
				this.getAnimationTrack("run")?.AdjustSpeed(this.fighterVelocity / 16);
				this.swapAnimation("run");
				break;
			default:
				this.swapAnimation("idle");
				break;
		}
	}

	destroy() {
		super.destroy();
		this.trove.destroy();
	}

	private swapAnimation(name: keyof typeof animationMap) {
		this.stopAllAnimations(name);
		this.playAnimationTrack(name);
	}

	private playAnimationTrack(name: keyof typeof animationMap) {
		const fighterTrack = this.getAnimationTrack(name);

		if (fighterTrack && !fighterTrack.IsPlaying) {
			fighterTrack.Play();
		}
	}

	private stopAllAnimations(exception?: keyof typeof animationMap) {
		this.animationCache.forEach((track) => {
			if (exception === track.Name) {
				return;
			}

			track.Stop();
		});
	}

	private getAnimationTrack(name: keyof typeof animationMap) {
		const id = animationMap[name];

		if (!id) {
			return;
		}

		const cachedTrack = this.animationCache.get(id);

		if (cachedTrack) {
			return cachedTrack;
		}

		const animationInstance = new Instance("Animation");
		animationInstance.AnimationId = `http://www.roblox.com/asset/?id=${id}`;
		animationInstance.Name = name;
		animationInstance.Parent = this.animator;

		const track = this.animator.LoadAnimation(animationInstance);

		this.animationCache.set(id, track);

		return track;
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
