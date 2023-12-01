import { SoundCache } from "@/shared/lib/sound-tracker/sound-cache";

export type SoundId = `rbxassetid://${number}`;
type SoundMap = SoundId | SoundId[];
type SoundProps = Partial<
	Omit<
		InstanceProperties<Sound>,
		"ClassName" | "IsLoaded" | "IsPaused" | "IsPlaying" | "PlaybackLoudness" | "TimeLength"
	>
>;

export class SoundTracker {
	public soundMap = new Map<string, SoundMap>();
	public soundProps: SoundProps = {
		Volume: 0.4,
		RollOffMode: Enum.RollOffMode.Inverse,
		RollOffMinDistance: 5,
	};

	private soundStore = new Map<string, SoundCache>();

	constructor(soundMap?: { [key: string]: SoundMap }) {
		if (soundMap) {
			for (const [name, id] of pairs(soundMap)) {
				this.addSound(name as string, id);
			}
		}
	}

	public addSound(name: string, id: SoundMap) {
		this.soundMap.set(name, id);

		const soundCache = new SoundCache(name, this);

		this.soundStore.set(name, soundCache);
	}

	public play(name: string, at: Instance, options?: SoundProps) {
		const soundCache = this.soundStore.get(name);

		if (!soundCache) {
			return;
		}

		soundCache.play({ ...options, Parent: at });
		return soundCache;
	}

	public stop(name: string) {
		const soundCache = this.soundStore.get(name);

		if (!soundCache) {
			return;
		}

		soundCache.stop();
		return soundCache;
	}

	public pause(name: string) {
		const soundCache = this.soundStore.get(name);

		if (!soundCache) {
			return;
		}

		soundCache.pause();
		return soundCache;
	}
}
