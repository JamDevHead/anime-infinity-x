import { Controller, OnStart } from "@flamework/core";
import Make from "@rbxts/make";
import { Players, Workspace } from "@rbxts/services";
import { Tracker } from "@/client/controllers/fighters-tracker/tracker";
import { store } from "@/client/store";
import remotes from "@/shared/remotes";
import { selectEnemySelectionFromPlayer } from "@/shared/store/players/enemy-selection";
import { selectActiveFightersFromPlayer } from "@/shared/store/players/fighters";

@Controller()
export class FightersTracker implements OnStart {
	public readonly RootOffset = new Vector3(0, -3, 4);
	public readonly fightersFolder = Make("Folder", {
		Name: "Fighters",
		Parent: Workspace,
	});

	private trackers = new Map<string, Tracker>();

	onStart() {
		const onNewPlayer = (player: Player) => {
			const tracker = new Tracker(player, this);

			this.trackers.set(tostring(player.UserId), tracker);
		};

		Players.GetPlayers().forEach(onNewPlayer);
		Players.PlayerAdded.Connect(onNewPlayer);
		this.listenForEnemySelection();

		Players.PlayerRemoving.Connect((player) => {
			const userId = tostring(player.UserId);

			this.trackers.get(userId)?.destroy();
			this.trackers.delete(userId);
		});
	}

	public getFormation(troopAmount: number, spacing = 4) {
		const rows = math.ceil((math.sqrt(8 * troopAmount + 1) - 1) / 2);

		return this.generateTriangleFormation(rows, spacing);
	}

	private listenForEnemySelection() {
		const userId = tostring(Players.LocalPlayer.UserId);

		store.subscribe(selectEnemySelectionFromPlayer(userId), (enemyId) => {
			const activeFighters = store.getState(selectActiveFightersFromPlayer(userId));

			activeFighters?.forEach(({ fighterId }) => {
				if (fighterId !== undefined) {
					enemyId !== undefined
						? remotes.fighterTarget.set.fire(fighterId, enemyId)
						: remotes.fighterTarget.remove.fire(fighterId);
				}
			});
		});
	}

	private generateTriangleFormation(rows: number, spacing: number) {
		const formationShape: Vector3[] = [];

		const halfWidth = ((rows - 1) * spacing) / 2;

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j <= i; j++) {
				let x = i * spacing - halfWidth;
				const z = j * spacing;

				if (j % 2 === 0) {
					x += spacing / 2;
				}

				formationShape.push(new Vector3(x - spacing / 2, 0, z));
			}
		}

		return formationShape;
	}
}
