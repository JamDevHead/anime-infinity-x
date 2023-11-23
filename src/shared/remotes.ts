import { BroadcastAction } from "@rbxts/reflex";
import { Client, createRemotes, namespace, remote, Server } from "@rbxts/remo";
import { SharedState } from "@/shared/store";

const remotes = createRemotes({
	store: namespace({
		dispatch: remote<Client, [actions: BroadcastAction[]]>(),
		hydrate: remote<Client, [state: SharedState]>(),
		start: remote<Server>(),
	}),

	settings: namespace({
		load: remote<Client, [settings: Record<string, boolean | number>]>(),
		save: remote<Server, [settings: Record<string, boolean | number>]>(),
	}),
});

export default remotes;
