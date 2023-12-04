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

	fighterTarget: namespace({
		set: remote<Server, [fighterUid: string, targetUid: string]>(),
		remove: remote<Server, [fighterUid: string, targetUid: string]>(),
		select: remote<Server, [targetUid: string]>(),
		unselect: remote<Server, [targetUid: string]>(),
		unselectAll: remote<Server>(),
	}),

	inventory: namespace({
		equipFighter: remote<Server, [fighterUid: string]>(),
		unequipFighter: remote<Server, [fighterUid: string]>(),
	}),

	drops: namespace({
		collect: remote<Server, [collectableId: string]>(),
	}),

	zone: namespace({
		teleport: remote<Server, [zone: string]>(),
	}),

	firstTime: namespace({
		select: remote<Server, [fighterName: string]>(),
	}),

	attackEnemy: remote<Server>(),
});

export default remotes;
