import { md5 } from "@rbxts/rbxts-hashlib";
import { ReplicatedStorage } from "@rbxts/services";

const fightersFolder = ReplicatedStorage.assets.Avatars.FightersModels;
const charactersId = new Map<string, string>();

function setupCharactersName() {
	for (const zoneFolder of fightersFolder.GetChildren()) {
		for (const fighter of zoneFolder.GetChildren()) {
			charactersId.set(fighter.Name, md5(fighter.Name));
		}
	}
}

export function calculateStun(dexterity: number) {
	// 10 dexterity = 1 second stun, 100 dexterity = 0.1 second stun
	return 10 / dexterity;
}

export function getCharacterId(name: string) {
	const cached = charactersId.get(name);
	const id = cached ?? md5(name);

	charactersId.set(name, id);

	return id;
}

export function getFighterFromCharacterId(id: string) {
	let fighterName = undefined;

	for (const [name, characterId] of charactersId) {
		if (id === characterId) {
			fighterName = name;
			break;
		}
	}

	return fighterName !== undefined ? fightersFolder.FindFirstChild(fighterName) : undefined;
}

setupCharactersName();
