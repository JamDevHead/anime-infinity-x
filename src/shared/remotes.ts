import Net from "@rbxts/net";
import { BroadcastAction } from "@rbxts/reflex";

const Remotes = Net.Definitions.Create({
	reflex: Net.Definitions.Namespace({
		start: Net.Definitions.ClientToServerEvent(),
		dispatch: Net.Definitions.ServerToClientEvent<[actions: BroadcastAction[]]>(),
	}),
});

export default Remotes;
