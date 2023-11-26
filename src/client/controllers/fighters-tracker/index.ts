import { Controller, OnStart } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import { Tracker } from "@/client/controllers/fighters-tracker/tracker";
import remotes from "@/shared/remotes";

@Controller()
export class FightersTracker implements OnStart {
	public readonly RootOffset = new Vector3(0, -3, 4);
	public readonly fightersFolder = new Instance("Folder");
	public readonly goalContainer = Workspace.Terrain;

	private troves = new Map<string, Trove>();
	private activePlayerFighters = new Map<string, Map<string, Attachment>>();

	onStart() {
		this.fightersFolder.Name = "Fighters";
		this.fightersFolder.Parent = Workspace;

		const onPlayerCleanup = (player: Player) => {
			const userId = tostring(player.UserId);
			const activeFighters = this.activePlayerFighters.get(userId);

			if (!activeFighters) {
				return;
			}

			activeFighters.forEach((attachment) => {
				attachment.RemoveTag("FighterGoal");
			});
			activeFighters.clear();
		};

		const onNewPlayer = (player: Player) => {
			const trove = new Trove();

			this.troves.set(tostring(player.UserId), trove);

			const tracker = trove.add(new Tracker(player, this));

			trove.add(
				player.CharacterRemoving.Connect(() => {
					tracker.onCharacterRemoving();
				}),
			);
		};

		Players.GetPlayers().forEach(onNewPlayer);
		Players.PlayerAdded.Connect(onNewPlayer);

		Players.PlayerRemoving.Connect((player) => {
			const userId = tostring(player.UserId);

			onPlayerCleanup(player);
			this.activePlayerFighters.delete(userId);

			this.troves.get(userId)?.destroy();
			this.troves.delete(userId);
		});
	}

	public setFighterTarget(uid: string, enemyUid: string) {
		remotes.fighterTarget.set.fire(uid, enemyUid);
	}

	public removeFighterTarget(uid: string, enemyUid: string) {
		remotes.fighterTarget.remove.fire(uid, enemyUid);
	}

	public getFormation(troopAmount: number, spacing = 4) {
		const rows = math.ceil((math.sqrt(8 * troopAmount + 1) - 1) / 2);

		return this.generateTriangleFormation(rows, spacing);
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
