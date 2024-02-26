import Gizmo from "@rbxts/gizmo";
import { Workspace } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import { FighterInstance } from "@/client/components/fighter/fighter-types";
import { AnimationMap, AnimationTracker } from "@/shared/lib/animation-tracker";

const animationMap = {
	idle: { id: "14451184535" },
	walk: { id: "14678864223" },
	run: { id: "14678864223" },
	jump: { id: "125750702", priority: Enum.AnimationPriority.Action },
	fall: { id: "15484732189" },
	soco1: { id: "15461463119" },
	soco2: { id: "15461470426" },
} satisfies AnimationMap;

export class FighterAnimator {
	private lastFighterPosition = Vector3.zero;
	private animationTracker: AnimationTracker;
	private animationState: keyof typeof animationMap = "idle";

	constructor(
		trove: Trove,
		private instance: FighterInstance,
		private raycastParams: RaycastParams,
	) {
		this.animationTracker = trove.add(new AnimationTracker(this.instance.Humanoid.Animator, animationMap));
	}

	onPhysics(dt: number, humanoid: Humanoid | undefined, hasEnemy: boolean) {
		if (!humanoid) return;

		const root = this.instance.HumanoidRootPart;

		const rootDisplacement = root.Position.sub(this.lastFighterPosition);
		const rootVelocity = rootDisplacement.div(dt);
		const speed = rootVelocity.Magnitude;

		this.lastFighterPosition = root.Position;

		const isGrounded = this.checkGround();
		const isFalling = !isGrounded && rootVelocity.Y < 0;
		const isJumping = humanoid.Jump && hasEnemy;
		const isRunning = isGrounded && speed > 5;

		let newState = this.animationState;

		switch (true) {
			case isJumping:
				newState = "jump";
				break;
			case isFalling:
				newState = "fall";
				break;
			case isRunning:
				newState = "run";
				break;
			case isGrounded:
				newState = "idle";
				break;
		}

		if (newState !== this.animationState) {
			if (
				this.animationState.match("soco")[0] !== undefined &&
				this.animationTracker.isAnimationPlaying(this.animationState)
			) {
				return;
			}

			this.updateAnimation(newState, speed);
		}
	}

	private checkGround() {
		// TODO: Optimize this function, NOT USING RAYCASTS
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

	public updateAnimation(state: typeof this.animationState, speed?: number) {
		if (state === "run" && speed !== undefined) {
			this.animationTracker.getAnimationTrack(state)?.AdjustSpeed(speed / 16);
		}

		this.animationState = state;
		this.animationTracker.swapAnimation(state);
	}
}
