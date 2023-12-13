import { BroadcastAction } from "@rbxts/reflex";
import { Client, createRemotes, namespace, remote, Server } from "@rbxts/remo";
import { Setting } from "@/@types/models/setting";
import { SharedState } from "@/shared/store";
import { PlayerFighter } from "@/shared/store/players";

const remotes = createRemotes({
	store: namespace({
		dispatch: remote<Client, [actions: BroadcastAction[]]>(),
		hydrate: remote<Client, [state: SharedState]>(),
		start: remote<Server>(),
	}),

	settings: namespace({
		save: remote<Server, [settings: Record<string, Setting>]>(),
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
		sellFighter: remote<Server, [fighterUid: string]>(),
		renameFighter: remote<Server, [fighterUid: string, displayName: string]>(),
	}),

	drops: namespace({
		collect: remote<Server, [collectableId: string]>(),
	}),

	zone: namespace({
		teleport: remote<Server, [zone: string]>(),
		buy: remote<Server, [zone: string]>(),
	}),

	firstTime: namespace({
		select: remote<Server, [fighterName: string]>(),
	}),

	eggs: namespace({
		open: remote<Server, [eggZone: string]>().returns<PlayerFighter | undefined>(),
	}),

	attackEnemy: remote<Server>(),
});

export default remotes;
