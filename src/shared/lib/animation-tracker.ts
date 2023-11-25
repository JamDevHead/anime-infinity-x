export class AnimationTracker {
	private animationCache = new Map<string, AnimationTrack>();

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

	public getAnimationTrack(name: keyof typeof this.animationMap) {
		const id = this.animationMap[name];

		if (id === undefined) {
			return;
		}

		const cachedTrack = this.animationCache.get(id);

		if (cachedTrack) {
			return cachedTrack;
		}

		const animationInstance = new Instance("Animation");
		animationInstance.AnimationId = `rbxassetid://${id}`;
		animationInstance.Name = name;
		animationInstance.Parent = this.animator;

		const track = this.animator.LoadAnimation(animationInstance);

		this.animationCache.set(id, track);

		return track;
	}

	public destroy() {
		this.animationCache.forEach((track) => track.Destroy());
		this.animationCache.clear();
	}
}
