import { t } from "@rbxts/t";

type SoundId = `rbxassetid://${number}`;
type SoundMap = SoundId | SoundId[];

export class SoundTracker {
	private cachedSounds = new Map<string, Sound>();
	private soundMap = new Map<string, SoundMap>();

	constructor(soundMap?: { [key: string]: SoundMap }) {
		if (soundMap) {
			for (const [name, id] of pairs(soundMap)) {
				this.addSound(name as string, id);
			}
		}
	}

	public addSound(name: string, id: SoundMap) {
		this.soundMap.set(name, id);
		this.load(name);
	}

	public load(name: string) {
		const cachedSound = this.cachedSounds.get(name);

		if (cachedSound?.Parent) {
			return cachedSound;
		}

		const id = this.soundMap.get(name);

		if (id === undefined) {
			return;
		}

		const sound = new Instance("Sound");
		const selectedId = t.array(t.string)(id) ? id[math.random(id.size()) - 1] : id;

		if (selectedId !== undefined) {
			sound.SoundId = selectedId;
		}

		this.cachedSounds.set(name, sound);
		return sound;
	}

	public play(name: string, at: Instance) {
		const sound = this.load(name);

		if (!sound) {
			return;
		}

		sound.Parent = at;
		sound.Play();
	}

	public stop(name: string) {
		const sound = this.load(name);

		if (!sound) {
			return;
		}

		sound.Stop();
		sound.Parent = undefined;
	}
}
