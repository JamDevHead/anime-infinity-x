import { RunService } from "@rbxts/services";

export const IS_EDIT = RunService.IsStudio() && !RunService.IsRunning();
export const IS_PRODUCTION = !RunService.IsStudio() && RunService.IsRunning();
