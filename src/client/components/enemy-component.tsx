import { Component, Components } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { createPortal, createRoot, Root } from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { EnemyHealth } from "@/client/components/react/enemy-health/enemy-health";
import { SoundController } from "@/client/controllers/sound-controller";
import { store } from "@/client/store";
import { getFighterByUid } from "@/client/utils/fighters";
import { EnemyComponent } from "@/shared/components/enemy-component";
import { AnimationMap, AnimationTracker } from "@/shared/lib/animation-tracker";
import { selectFighterWithTarget } from "@/shared/store/fighter-target/fighter-target-selectors";

const animationMap = {
	death: { id: "14485177001", priority: Enum.AnimationPriority.Action },
	hurt: { id: "14514314319", priority: Enum.AnimationPriority.Movement },
	idle: { id: "14451184535", priority: Enum.AnimationPriority.Idle },
} satisfies AnimationMap;

@Component({ tag: "EnemyNPC" })
export class Enemy extends EnemyComponent implements OnStart {
	private animator = this.humanoid.WaitForChild("Animator") as Animator;
	private animationTracker = new AnimationTracker(this.animator, animationMap);
	private hurtHighlight = new Instance("Highlight");
	private hurtParticle = new Instance("Part") as Part & { Particle: ParticleEmitter };
	private healthComponentRoot?: Root;

	constructor(
		private readonly components: Components,
		private readonly soundController: SoundController,
	) {
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
				this.hurt(currentHealth, health);
			}

			currentHealth = health;
		});

		this.animationTracker.playAnimationTrack("idle");

		// Enemy health component
		const head = this.instance.WaitForChild("Head");
		const root = createRoot(new Instance("Folder"));

		this.healthComponentRoot = root;

		root.render(createPortal(<EnemyHealth enemy={this} />, head));
	}

	destroy() {
		super.destroy();

		this.healthComponentRoot?.unmount();

		if (!this.instance.FindFirstChild("HumanoidRootPart")) {
			this.animationTracker.destroy();
			return;
		}

		// Play death animation
		this.animationTracker.swapAnimation("death");

		// Play death sound
		this.soundController.tracker.play("death", this.instance.HumanoidRootPart);

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

		this.animationTracker.destroy();
	}

	private hurt(currentHealth: number, newHealth: number) {
		if (!this.instance.FindFirstChild("HumanoidRootPart")) {
			return;
		}

		// Play hurt animation
		this.animationTracker.playAnimationTrack("hurt");

		// Flash highlight
		this.hurtHighlight.FillTransparency = 0.2;
		TweenService.Create(this.hurtHighlight, new TweenInfo(0.15), {
			FillTransparency: 1,
		}).Play();

		// Spawn hurt particle
		const damage = currentHealth - newHealth;
		this.createHurtParticle(damage);

		// Play particle
		this.hurtParticle.Particle.Emit(1);

		// Play hurt sound
		this.soundController.tracker.play("hurt", this.instance.HumanoidRootPart);

		// Notify current fighters of hurt
		const fighterUid = store.getState(selectFighterWithTarget(this.attributes.Guid));

		fighterUid.forEach((uid) => {
			const fighter = getFighterByUid(uid, this.components);

			fighter?.attack();
		});
	}

	private createHurtParticle(damage: number) {
		const hurtPart = new Instance("Part");
		const hurtBillboard = new Instance("BillboardGui");
		const hurtLabel = new Instance("TextLabel");
		const enemyScale = this.instance.GetScale();
		const FORCE = 5;

		hurtPart.Size = Vector3.one;
		hurtPart.Transparency = 1;
		hurtPart.Anchored = false;
		hurtPart.Massless = true;
		hurtPart.CanCollide = false;
		hurtPart.CanQuery = false;
		hurtPart.CanTouch = false;
		hurtPart.CFrame = this.root.CFrame;

		hurtBillboard.Size = UDim2.fromScale(enemyScale * 1.25, enemyScale);
		hurtBillboard.AlwaysOnTop = true;
		hurtBillboard.MaxDistance = 30;

		hurtLabel.BackgroundTransparency = 1;
		hurtLabel.Size = UDim2.fromScale(1, 1);
		hurtLabel.Text = `- ${damage}`;
		hurtLabel.TextColor3 = Color3.fromHex("#f64e4e");
		hurtLabel.TextScaled = true;
		hurtLabel.TextStrokeColor3 = Color3.fromHex("#000");
		hurtLabel.TextStrokeTransparency = 0.5;

		hurtLabel.Parent = hurtBillboard;
		hurtBillboard.Parent = hurtPart;
		hurtPart.Parent = Workspace.Terrain;

		hurtPart.ApplyImpulse(
			new Vector3(
				math.random(-FORCE, FORCE),
				FORCE * 4 + math.sqrt(Workspace.Gravity),
				math.random(-FORCE, FORCE),
			),
		);

		task.delay(enemyScale / 2, () => {
			hurtPart.Destroy();
		});
	}
}
