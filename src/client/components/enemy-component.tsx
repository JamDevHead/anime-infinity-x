import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import Make from "@rbxts/make";
import { createPortal, createRoot, Root } from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { EnemyHealth } from "@/client/components/react/enemy-health/enemy-health";
import { fonts } from "@/client/constants/fonts";
import { EnemySelectorController } from "@/client/controllers/enemy-selector-controller";
import { SoundController } from "@/client/controllers/sound-controller";
import { useAbbreviator } from "@/client/ui/hooks/use-abbreviator";
import { EnemyComponent } from "@/shared/components/enemy-component";
import { AnimationMap, AnimationTracker } from "@/shared/lib/animation-tracker";

const coinParticleFolder = ReplicatedStorage.assets.Particles.Coins;
const RNG = new Random();
const animationMap = {
	death: { id: "14485177001", priority: Enum.AnimationPriority.Action },
	hurt: { id: "14514314319", priority: Enum.AnimationPriority.Movement },
	idle: { id: "14451184535", priority: Enum.AnimationPriority.Idle },
} satisfies AnimationMap;

@Component({ tag: "EnemyNPC" })
export class Enemy extends EnemyComponent implements OnStart {
	public highlight = new Instance("Highlight");

	private animator = this.humanoid.WaitForChild("Animator") as Animator;
	private animationTracker = new AnimationTracker(this.animator, animationMap);
	private particleContainer = new Instance("Part") as Part & {
		Particle: ParticleEmitter;
		CoinParticle: ParticleEmitter;
	};
	private healthComponentRoot?: Root;
	private abbreviator = useAbbreviator({ defaultDecimalPlaces: 0 });

	constructor(
		private readonly soundController: SoundController,
		private readonly enemySelector: EnemySelectorController,
	) {
		super();
	}

	onStart() {
		this.highlight.DepthMode = Enum.HighlightDepthMode.Occluded;
		this.highlight.FillColor = Color3.fromHex("#000");
		this.highlight.FillTransparency = 1;
		this.highlight.OutlineTransparency = 1;

		this.highlight.GetPropertyChangedSignal("OutlineTransparency").Connect(() => {
			this.highlight.Parent = this.highlight.OutlineTransparency === 1 ? undefined : this.instance;
		});

		const particle = ReplicatedStorage.assets.Particles.HurtParticle.Clone();
		const [cframe, size] = this.instance.GetBoundingBox();
		const coins = coinParticleFolder.GetChildren();
		const coinParticle = coins[RNG.NextInteger(0, coins.size() - 1)]?.Clone() as ParticleEmitter | undefined;

		if (coinParticle !== undefined) {
			coinParticle.Enabled = false;
			coinParticle.Name = "CoinParticle";
			coinParticle.Parent = this.particleContainer;
		}

		particle.Name = "Particle";
		particle.Parent = this.particleContainer;

		this.particleContainer.Size = size;
		this.particleContainer.CFrame = cframe;
		this.particleContainer.Anchored = true;
		this.particleContainer.CanCollide = false;
		this.particleContainer.CanQuery = false;
		this.particleContainer.CanTouch = false;
		this.particleContainer.Transparency = 1;

		this.particleContainer.Parent = this.instance;

		// Fix enemy model
		this.instance.GetDescendants().forEach((descendant) => {
			if (descendant.IsA("BasePart")) {
				descendant.CastShadow = true;
				descendant.CanCollide = false;
			}
		});

		// Play idle animation
		this.animationTracker.playAnimationTrack("idle");

		// Enemy health component
		const head = this.instance.WaitForChild("Head");
		const root = createRoot(new Instance("Folder"));

		this.healthComponentRoot = root;

		root.render(createPortal(<EnemyHealth enemy={this} />, head));
	}

	onDestroy() {
		this.healthComponentRoot?.unmount();

		this.highlight.Destroy();

		if (!this.instance.FindFirstChild("HumanoidRootPart")) {
			this.animationTracker.destroy();
			return;
		}

		// Play coin drop particles
		this.particleContainer.CoinParticle.Emit(30);

		// Play death animation
		this.animationTracker.swapAnimation("death");

		// Play death sound
		this.soundController.tracker.play("death", this.instance.HumanoidRootPart);

		// Clear selection
		this.enemySelector.clearSelection();

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

	onHealthChanged(currentHealth: number, newHealth: number) {
		if (currentHealth > newHealth && newHealth > 0) {
			this.hurt(currentHealth, newHealth);
		}
	}

	private hurt(currentHealth: number, newHealth: number) {
		if (!this.instance.FindFirstChild("HumanoidRootPart")) {
			return;
		}

		// Play hurt animation
		this.animationTracker.playAnimationTrack("hurt");

		// Flash highlight
		this.highlight.FillTransparency = 0.2;
		TweenService.Create(this.highlight, new TweenInfo(0.15), {
			FillTransparency: 1,
		}).Play();

		// Spawn hurt particle
		const damage = currentHealth - newHealth;
		this.createHurtParticle(damage);

		// Play particle
		this.particleContainer.Particle.Emit(1);

		// Play hurt sound
		this.soundController.tracker.play("hurt", this.instance.HumanoidRootPart);
	}

	private createHurtParticle(damage: number) {
		const enemyScale = this.instance.GetScale();
		const damageAbbreviated = this.abbreviator.numberToString(damage, true);

		const hurtPart = Make("Part", {
			Size: Vector3.one,
			Transparency: 1,
			Anchored: false,
			Massless: true,
			CanCollide: false,
			CanQuery: false,
			CanTouch: false,
			CFrame: this.root.CFrame,
			Parent: Workspace.Terrain,

			Children: [
				Make("BillboardGui", {
					Size: UDim2.fromScale(enemyScale * 2.5, enemyScale),
					AlwaysOnTop: true,
					MaxDistance: 50 * enemyScale,
					Children: [
						Make("TextLabel", {
							BackgroundTransparency: 1,
							Size: UDim2.fromScale(1, 1),
							Text: `- ${damageAbbreviated}`,
							FontFace: fonts.fredokaOne.bold,
							TextColor3: Color3.fromHex("#f64e4e"),
							TextScaled: true,
							TextStrokeColor3: Color3.fromHex("#000"),
							TextStrokeTransparency: 0.5,
							Children: [
								Make("UITextSizeConstraint", {
									MaxTextSize: 55,
								}),
							],
						}),
					],
				}),
			],
		});

		const FORCE = 5;

		hurtPart.ApplyImpulse(
			new Vector3(
				math.random(-FORCE, FORCE),
				FORCE * 4 + math.sqrt(Workspace.Gravity),
				math.random(-FORCE, FORCE),
			),
		);

		task.delay(math.sqrt(Workspace.Gravity / (enemyScale * 5)) / 4, () => {
			hurtPart.Destroy();
		});
	}
}
