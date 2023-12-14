import { Service } from "@flamework/core";
import { OnPlayerAdd } from "@/server/services/lifecycles/on-player-add";
import { store } from "@/server/store";
import { Mission } from "@/shared/store/players/missions";
import { selectAllPlayerMissions } from "@/shared/store/players/missions/missions-selectors";
import { selectPlayerCurrentZone } from "@/shared/store/players/zones";

const zoneRewards = {
	NRT: 10_000,
	ONE: 15_000,
	AOT: 20_000,
	DBZ: 25_000,
	TKR: 30_000,
	DMS: 35_000,
} as { [zone: string]: number };

@Service()
export class MissionGenerator implements OnPlayerAdd {
	onPlayerAdded(player: Player) {
		const userId = tostring(player.UserId);
		const zoneSelector = selectPlayerCurrentZone(userId);

		store.subscribe(zoneSelector, (current) => this.onZoneChange(userId, current));
		this.onZoneChange(userId, store.getState(zoneSelector));
	}

	private onZoneChange(userId: string, zone: string | undefined) {
		if (zone === undefined) {
			return;
		}

		const missionSelector = selectAllPlayerMissions(userId);

		store.subscribe(missionSelector, (missions, lastMissions) => {
			this.onMissionsChange(userId, missions, zone);
			if (missions !== undefined && lastMissions !== undefined) {
				this.checkMissions(userId, missions, lastMissions, zone);
			}
		});
		this.onMissionsChange(userId, store.getState(missionSelector), zone);
	}

	private onMissionsChange(userId: string, missions: Mission[] | undefined, zone: string) {
		print("onMissionsChange", userId, missions, zone);
		if (!missions?.isEmpty()) {
			return;
		}

		const staticTasks = [
			{
				id: "level1",
				title: "Kill 50 level 1 enemies",
				progress: 0,
				maxProgress: 50,
			},
			{
				id: "level2",
				title: "Kill 35 level 2 enemies",
				progress: 0,
				maxProgress: 35,
			},
			{
				id: "level3",
				title: "Kill 25 level 3 enemies",
				progress: 0,
				maxProgress: 25,
			},
			{
				id: "level4",
				title: "Kill 15 level 4 enemies",
				progress: 0,
				maxProgress: 15,
			},
			{
				id: "boss",
				title: "Kill 3 bosses",
				progress: 0,
				maxProgress: 3,
			},
		];

		store.addMission(userId, {
			id: zone,
			title: `Kill enemies in ${zone}!`,
			tasks: staticTasks,
		});
	}

	private checkMissions(userId: string, missions: Mission[], lastMissions: Mission[], zone: string) {
		for (const mission of missions) {
			const lastMission = lastMissions.find((m) => m.id === mission.id);
			if (lastMission === undefined) {
				continue;
			}

			for (const task of mission.tasks) {
				const lastTask = lastMission.tasks.find((t) => t.id === task.id);
				if (lastTask === undefined) {
					continue;
				}

				if (task.progress > lastTask.progress) {
					if (task.progress === task.maxProgress) {
						store.addBalance(userId, "coins", zoneRewards[zone]);
					}
				}
			}
		}
	}
}
