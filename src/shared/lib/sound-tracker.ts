import { t } from "@rbxts/t";

type SoundId = `rbxassetid://${number}`;
type SoundMap = SoundId | SoundId[];
type SoundProps = Partial<
	Omit<
		InstanceProperties<Sound>,
		"ClassName" | "IsLoaded" | "IsPaused" | "IsPlaying" | "PlaybackLoudness" | "TimeLength"
	>
>;

export class SoundTracker {
	private soundStore = new Map<string, Sound[]>();
	private soundMap = new Map<string, SoundMap>();
	private soundProps: SoundProps = {
		Volume: 0.4,
		RollOffMode: Enum.RollOffMode.Inverse,
		RollOffMinDistance: 5,
	};

	constructor(soundMap?: { [key: string]: SoundMap }) {
		if (soundMap) {
			for (const [name, id] of pairs(soundMap)) {
				this.addSound(name as string, id);
			}
		}
	}

	public addSound(name: string, id: SoundMap) {
		this.soundMap.set(name, id);
		this.getSoundFromStore(name);
	}

	public play(name: string, at: Instance, options?: SoundProps) {
		const sound = this.getSound(name, options);

		if (!sound) {
			return;
		}

		sound.Parent = at;
		sound.Play();
	}

	public stop(name: string) {
		const sound = this.getSound(name);

		if (!sound) {
			return;
		}

		sound.Stop();
		sound.Parent = undefined;
	}

	private getSound(name: string, options?: SoundProps) {
		const sound = this.getSoundFromStore(name);

		const id = this.soundMap.get(name);
		const selectedId = t.array(t.string)(id) ? id[math.random(id.size()) - 1] : id;

		if (selectedId !== undefined) {
			sound.SoundId = selectedId;
		}

		if (options) {
			for (const [key, soundProp] of pairs(options)) {
				sound[key] = soundProp as never;
			}
		}

		return sound;
	}

	private getSoundFromStore(name: string) {
		const sounds = this.soundStore.get(name) ?? [];
		let sound = sounds.find((sound) => !sound.IsPlaying);

		if (!sound) {
			sound = this.createSound();
			sounds.push(sound);
		}

		this.soundStore.set(name, sounds);
		return sound;
	}

	private createSound() {
		const sound = new Instance("Sound");

		for (const [key, soundProp] of pairs(this.soundProps)) {
			sound[key] = soundProp as never;
		}

		return sound;
	}
}
