import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { TweenService } from "@rbxts/services";
import { EnemyComponent } from "@/shared/components/enemy-component";
import { AnimationTracker } from "@/shared/lib/animation-tracker";

const animationMap = {
	death: "14485177001",
	hurt: "14514314319",
} as const;

@Component({ tag: "EnemyNPC" })
export class Enemy extends EnemyComponent implements OnStart {
	private animator = this.humanoid.WaitForChild("Animator") as Animator;
	private animationTracker = new AnimationTracker(this.animator, animationMap);
	private hurtHighlight = new Instance("Highlight");

	onStart() {
		let currentHealth = this.humanoid.Health;

		this.hurtHighlight.DepthMode = Enum.HighlightDepthMode.Occluded;
		this.hurtHighlight.FillColor = Color3.fromHex("#000");
		this.hurtHighlight.FillTransparency = 1;
		this.hurtHighlight.OutlineTransparency = 1;
		this.hurtHighlight.Parent = this.instance;

		this.humanoid.HealthChanged.Connect((health) => {
			if (currentHealth > health) {
				this.hurt();
			}

			currentHealth = health;
		});
	}

	destroy() {
		super.destroy();

		// Play death animation
		this.animationTracker.swapAnimation("death");
	}

	private hurt() {
		// Play hurt animation
		this.animationTracker.playAnimationTrack("hurt");

		// Flash highlight
		this.hurtHighlight.FillTransparency = 0.2;
		TweenService.Create(this.hurtHighlight, new TweenInfo(0.15), {
			FillTransparency: 1,
		}).Play();
	}
}
