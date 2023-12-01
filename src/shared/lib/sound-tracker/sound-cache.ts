import { t } from "@rbxts/t";
import { SoundTracker } from "@/shared/lib/sound-tracker/index";

type SoundOptions = Partial<
	Omit<
		InstanceProperties<Sound>,
		"ClassName" | "IsLoaded" | "IsPaused" | "IsPlaying" | "PlaybackLoudness" | "TimeLength"
	>
>;

export class SoundCache {
	public time = 1;

	private cache = new Set<Sound>();

	constructor(
		private readonly name: string,
		private readonly tracker: SoundTracker,
	) {
		this.getSound();
	}

	public play(options?: SoundOptions) {
		const sound = this.getSound(options);

		sound.Play();
		return sound;
	}

	public stop() {
		this.cache.forEach((sound) => {
			sound.Stop();
			sound.Parent = undefined;
		});
	}

	public pause() {
		this.cache.forEach((sound) => {
			sound.Pause();
		});
	}

	public getSound(options?: SoundOptions) {
		let sound: Sound | undefined;

		for (const cached of this.cache) {
			if (!cached.IsPlaying && cached.IsLoaded) {
				sound = cached;
			}
		}

		if (!sound) {
			sound = this.createSound();
		}

		// Update sound id
		const id = this.tracker.soundMap.get(this.name);
		const selectedId = t.array(t.string)(id) ? id[math.random(id.size()) - 1] : id;

		if (selectedId !== undefined) {
			sound.SoundId = selectedId;

			task.spawn(() => {
				if (!sound) {
					return;
				}

				if (!sound.IsLoaded) {
					sound.Loaded.Wait();
				}

				// Don't ask why im doing this second check, sound could be nil idk
				if (sound) {
					this.time = sound.TimeLength;
				}
			});
		}

		// Update sound props
		if (options) {
			for (const [key, value] of pairs(options)) {
				sound[key] = value as never;
			}
		}

		return sound;
	}

	private createSound() {
		const sound = new Instance("Sound");

		for (const [key, value] of pairs(this.tracker.soundProps)) {
			sound[key] = value as never;
		}

		sound.Name = this.name;

		this.cache.add(sound);
		return sound;
	}
}
