import Gizmo from "@rbxts/gizmo";
import Log from "@rbxts/log";
import { ZirconFunctionBuilder } from "@rbxts/zircon";

export const EnableGizmos = new ZirconFunctionBuilder("enable_gizmos")
	.AddArgument("boolean?", "enabled")
	.Bind((_, enabled) => {
		enabled = enabled ?? true;
		enabled ? Gizmo.enable() : Gizmo.disable();
		Log.Info(`Gizmos ${enabled ? "enabled" : "disabled"}`);
	});
