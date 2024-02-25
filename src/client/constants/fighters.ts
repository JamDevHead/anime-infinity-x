import Make from "@rbxts/make";
import { Workspace } from "@rbxts/services";

export const FIGHTER_GOAL_CONTAINER = Make("Folder", {
	Name: "GoalContainer",
	Parent: Workspace.Terrain,
});

export const FIGHTERS_CONTAINER = Make("Folder", {
	Name: "Fighters",
	Parent: Workspace,
});

export const GOAL_ROOT_OFFSET = new Vector3(0, -3, 4);

export const FIGHTER_FAR_CFRAME = new CFrame(0, 4e9, 0);
