import { Components } from "@flamework/components";
import { Workspace } from "@rbxts/services";
import { FighterModel } from "@/client/components/fighter-model";

const enemyModelCache = new Map<string, Model>();
const enemyCache = new Map<string, FighterModel>();

export function getFighterModelByUid(uid: string) {
	const cachedFighter = enemyModelCache.get(uid);

	if (cachedFighter?.Parent) {
		return cachedFighter;
	}

	const fightersFolder = Workspace.FindFirstChild("Fighters") as Folder | undefined;
	const fighter = fightersFolder?.GetChildren().find((fighter) => fighter.GetAttribute("Uid") === uid) as
		| Model
		| undefined;

	if (!fighter) {
		enemyModelCache.delete(uid);
		return undefined;
	}

	enemyModelCache.set(uid, fighter);
	return fighter;
}

export function getFighterByUid(uid: string, components: Components) {
	if (enemyCache.has(uid)) {
		return enemyCache.get(uid);
	}

	const fighterModel = getFighterModelByUid(uid);
	const fighter = fighterModel ? components.getComponent<FighterModel>(fighterModel) : undefined;

	if (!fighter) {
		enemyCache.delete(uid);
		return undefined;
	}

	enemyCache.set(uid, fighter);
	return fighter;
}
