import { ZirconConfigurationBuilder, ZirconNamespaceBuilder } from "@rbxts/zircon";
import { EnableGizmos } from "@/shared/commands/debug/enable-gizmos";
import { Print } from "@/shared/commands/print";

export const ZirconServerConfig = ZirconConfigurationBuilder.default()
	.CreateDefaultCreatorGroup()
	.CreateGroup(0, "Devs", (group) => {
		return group
			.SetPermissions({
				CanAccessConsole: true,
				CanRecieveServerLogMessages: true,
				CanExecuteZirconiumScripts: true,
				CanViewLogMetadata: true,
			})
			.BindToUserIds([3077902399, 78662128, 168572769]);
	})
	.AddFunction(Print, ["Devs"])
	.AddNamespace(new ZirconNamespaceBuilder("debug").AddFunction(EnableGizmos).Build(), ["Devs"]);
