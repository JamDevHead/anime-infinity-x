import { BaseComponent, Component } from "@flamework/components";
import { OnRender, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { Trove } from "@rbxts/trove";
import { CharacterAdd } from "@/client/controllers/lifecycles/on-character-add";

interface FighterModel extends Model {
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
export class Fighter extends BaseComponent<NonNullable<unknown>, FighterModel> implements OnStart, OnRender {
	private humanoid = this.instance.Humanoid;
	private animator = this.humanoid.Animator;
	private trove = new Trove();
	private animationCache = new Map<string, AnimationTrack>();

	constructor(
		private readonly logger: Logger,
		private readonly characterAdd: CharacterAdd,
	) {
		super();
	}

	onStart() {
		this.logger.Debug("Created animator handler for fighter");

		this.trove.add(() => {
			this.animationCache.forEach((track) => track.Destroy());
			this.animationCache.clear();
		});
	}

	onRender(_dt: number) {
		const character = this.characterAdd.character;
		const humanoid = character?.FindFirstChild("Humanoid") as Humanoid | undefined;

		if (!humanoid?.RootPart) {
			return;
		}

		const bodyVelocity = humanoid.RootPart.AssemblyLinearVelocity.mul(new Vector3(1, 0, 1)).Magnitude;
		const isFalling = humanoid.FloorMaterial === Enum.Material.Air;
		const isJumping = humanoid.Jump;
		const isRunning = bodyVelocity > 0.03;

		switch (true) {
			case isFalling:
				this.swapAnimation("fall");
				break;
			case isJumping:
				this.swapAnimation("jump");
				break;
			case isRunning:
				this.getAnimationTrack("run")?.AdjustSpeed(bodyVelocity / 16);
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
}
