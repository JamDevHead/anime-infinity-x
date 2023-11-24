import { Workspace } from "@rbxts/services";

const enemyCache = new Map<string, Model>();

export function getEnemyModelByUid(uid: string) {
	const enemyCached = enemyCache.get(uid);

	if (enemyCached !== undefined && enemyCached.Parent) {
		return enemyCache.get(uid);
	} else {
		enemyCache.delete(uid);
	}

	const enemiesFolder = Workspace.FindFirstChild("Enemies") as Folder | undefined;
	const enemyModel = enemiesFolder?.GetChildren().find((enemy) => enemy.GetAttribute("Guid") === uid) as
		| Model
		| undefined;

	if (!enemyModel) {
		return undefined;
	}

	enemyCache.set(uid, enemyModel);
	return enemyModel;
}
