import { Component, Components } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ReplicatedStorage, TweenService } from "@rbxts/services";
import { store } from "@/client/store";
import { getFighterByUid } from "@/client/utils/fighters";
import { EnemyComponent } from "@/shared/components/enemy-component";
import { AnimationTracker } from "@/shared/lib/animation-tracker";
import { selectFighterWithTarget } from "@/shared/store/fighter-target/fighter-target-selectors";

const animationMap = {
	death: "14485177001",
	hurt: "14514314319",
} as const;

@Component({ tag: "EnemyNPC" })
export class Enemy extends EnemyComponent implements OnStart {
	private animator = this.humanoid.WaitForChild("Animator") as Animator;
	private animationTracker = new AnimationTracker(this.animator, animationMap);
	private hurtHighlight = new Instance("Highlight");
	private hurtParticle = new Instance("Part") as Part & { Particle: ParticleEmitter };

	constructor(private components: Components) {
		super();
	}

	onStart() {
		let currentHealth = this.humanoid.Health;

		this.hurtHighlight.DepthMode = Enum.HighlightDepthMode.Occluded;
		this.hurtHighlight.FillColor = Color3.fromHex("#000");
		this.hurtHighlight.FillTransparency = 1;
		this.hurtHighlight.OutlineTransparency = 1;
		this.hurtHighlight.Parent = this.instance;

		const particle = ReplicatedStorage.assets.Particles.HurtParticle.Clone();
		const [cframe, size] = this.instance.GetBoundingBox();

		particle.Name = "Particle";
		particle.Parent = this.hurtParticle;
		this.hurtParticle.Anchored = true;

		this.hurtParticle.Size = size;
		this.hurtParticle.CFrame = cframe;
		this.hurtParticle.CanCollide = false;
		this.hurtParticle.CanQuery = false;
		this.hurtParticle.CanTouch = false;
		this.hurtParticle.Transparency = 1;

		this.hurtParticle.Parent = this.instance;

		this.humanoid.HealthChanged.Connect((health) => {
			if (currentHealth > health && health > 0) {
				this.hurt();
			}

			currentHealth = health;
		});
	}

	destroy() {
		super.destroy();

		// Play death animation
		this.animationTracker.swapAnimation("death");

		// Fade out
		const tweenInfo = new TweenInfo(2, Enum.EasingStyle.Linear, Enum.EasingDirection.Out);
		const propertyTable = {
			Transparency: 1,
		};

		this.instance.GetDescendants().forEach((descendant) => {
			if (!descendant.IsA("BasePart")) {
				return;
			}

			TweenService.Create(descendant, tweenInfo, propertyTable).Play();
		});
	}

	private hurt() {
		// Play hurt animation
		this.animationTracker.playAnimationTrack("hurt");

		// Flash highlight
		this.hurtHighlight.FillTransparency = 0.2;
		TweenService.Create(this.hurtHighlight, new TweenInfo(0.15), {
			FillTransparency: 1,
		}).Play();

		// Play particle
		this.hurtParticle.Particle.Emit(1);

		// Notify current fighters of hurt
		const fighterUid = store.getState(selectFighterWithTarget(this.attributes.Guid));

		fighterUid.forEach((uid) => {
			const fighter = getFighterByUid(uid, this.components);

			fighter?.attack();
		});
	}
}
