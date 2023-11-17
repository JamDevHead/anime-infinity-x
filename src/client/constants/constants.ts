import { RunService } from "@rbxts/services";

export const IS_PLUGIN = RunService.IsRunning() && !RunService.IsRunning();
