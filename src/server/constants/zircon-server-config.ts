import { ZirconConfigurationBuilder, ZirconNamespaceBuilder } from "@rbxts/zircon";
import { EnableGizmos } from "@/shared/commands/debug/enable-gizmos";
import { Print } from "@/shared/commands/print";

export const ZirconServerConfig = ZirconConfigurationBuilder.default()
	.CreateDefaultCreatorGroup()
	.CreateDefaultUserGroup({
		CanAccessConsole: true,
	})
	.AddFunction(Print, ["User"])
	.AddNamespace(new ZirconNamespaceBuilder("debug").AddFunction(EnableGizmos).Build(), ["User"]);
