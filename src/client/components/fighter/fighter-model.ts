import { ReplicatedStorage } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import { FighterInstance } from "@/client/components/fighter";

export class FighterModel {
	private puffParticle: ParticleEmitter;
	private collidableParts = new Set<BasePart>();

	constructor(trove: Trove, instance: FighterInstance, goal: Part) {
		const root = instance.HumanoidRootPart;

		this.puffParticle = trove.add(ReplicatedStorage.assets.Particles.Puff.Clone());
		this.puffParticle.Parent = goal;

		root.Anchored = true;

		// Cleanup fighter model
		for (const part of instance.GetDescendants()) {
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

		// Remove humanoid name
		instance.Humanoid.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None;

		// Fix model pivot
		const [currentPivot, fighterSize] = instance.GetBoundingBox();
		const halfFighterSize = fighterSize.Y / 2;

		instance.PrimaryPart = undefined;
		instance.WorldPivot = currentPivot.sub(Vector3.yAxis.mul(halfFighterSize));
	}

	onPhysics() {
		for (const part of this.collidableParts) {
			part.CanCollide = false;
		}
	}

	public puff() {
		this.puffParticle.Emit(15);
	}
}
