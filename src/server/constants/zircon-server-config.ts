import { ZirconConfigurationBuilder, ZirconNamespaceBuilder } from "@rbxts/zircon";
import { EnableGizmos } from "@/shared/commands/debug/enable-gizmos";
import { Print } from "@/shared/commands/print";

export const ZirconServerConfig = ZirconConfigurationBuilder.default()
	.AddFunction(Print, ["User"])
	.AddNamespace(new ZirconNamespaceBuilder("debug").AddFunction(EnableGizmos).Build(), ["User"]);
