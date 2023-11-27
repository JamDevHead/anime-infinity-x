import { Workspace } from "@rbxts/services";

export class AnimationTracker {
	private animationCache = new Map<string, AnimationTrack>();
	private animationsInQueue = new Set<string>();

	constructor(
		private animator: Animator,
		private readonly animationMap: Record<string, string>,
	) {
		try {
			for (const [name] of pairs(animationMap)) {
				this.getAnimationTrack(name);
			}
		} catch (exception) {
			warn("Failed to load animations: ", exception);
		}
	}

	public swapAnimation(name: keyof typeof this.animationMap) {
		this.stopAllAnimations(name);
		this.playAnimationTrack(name);
	}

	public playAnimationTrack(name: keyof typeof this.animationMap) {
		const fighterTrack = this.getAnimationTrack(name);

		if (fighterTrack && !fighterTrack.IsPlaying) {
			fighterTrack.Play();
		}
	}

	public stopAllAnimations(exception?: keyof typeof this.animationMap) {
		this.animationCache.forEach((track) => {
			if (exception === track.Name) {
				return;
			}

			track.Stop();
		});
	}

	public isAnimationPlaying(name: keyof typeof this.animationMap) {
		const track = this.getAnimationTrack(name);

		if (!track) {
			return false;
		}

		return track.IsPlaying;
	}

	public getAnimationTrack(name: keyof typeof this.animationMap) {
		const id = this.animationMap[name];

		if (id === undefined) {
			return;
		}

		const cachedTrack = this.animationCache.get(id);

		if (cachedTrack) {
			return cachedTrack;
		}

		if (this.animationsInQueue.has(id)) {
			while (this.animationCache.get(id) === undefined) {
				task.wait();
			}
			return this.animationCache.get(id);
		}

		const animationInstance = new Instance("Animation");
		animationInstance.AnimationId = `rbxassetid://${id}`;
		animationInstance.Name = name;
		animationInstance.Parent = this.animator;

		if (!this.animator.IsDescendantOf(Workspace)) {
			this.animationsInQueue.add(id);

			let timeout = 300;

			while (!this.animator.IsDescendantOf(Workspace)) {
				task.wait();
				timeout--;
				if (timeout <= 0) {
					break;
				}
			}

			if (timeout <= 0) {
				warn("Failed to load animation: ", id);
				this.animationsInQueue.delete(id);
				return;
			}

			this.animationsInQueue.delete(id);
		}

		const track = this.animator.LoadAnimation(animationInstance);

		this.animationCache.set(id, track);

		return track;
	}

	public destroy() {
		this.animationCache.forEach((track) => track.Destroy());
		this.animationCache.clear();
	}
}
