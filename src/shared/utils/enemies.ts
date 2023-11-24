import { Workspace } from "@rbxts/services";

export function getEnemyModelByUid(uid: string) {
	const enemiesFolder = Workspace.FindFirstChild("Enemies") as Folder | undefined;

	return enemiesFolder?.GetChildren().find((enemy) => enemy.GetAttribute("Guid") === uid) as Model | undefined;
}
