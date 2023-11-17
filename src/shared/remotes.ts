import Net from "@rbxts/net";
import { BroadcastAction } from "@rbxts/reflex";

const Remotes = Net.Definitions.Create({
	reflex: Net.Definitions.Namespace({
		start: Net.Definitions.ClientToServerEvent(),
		dispatch: Net.Definitions.ServerToClientEvent<[actions: BroadcastAction[]]>(),
	}),
	settings: Net.Definitions.Namespace({
		save: Net.Definitions.ClientToServerEvent<[settings: Record<string, boolean | number>]>(),
		load: Net.Definitions.ServerToClientEvent<[settings: Record<string, boolean | number>]>(),
	}),
});

export default Remotes;
