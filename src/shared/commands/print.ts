import Log from "@rbxts/log";
import { ZirconFunctionBuilder } from "@rbxts/zircon";

export const Print = new ZirconFunctionBuilder("print").Bind((_, ...args) => {
	Log.Info(args.map((a) => tostring(a)).join(" "));
});
