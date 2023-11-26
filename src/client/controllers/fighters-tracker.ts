import { Controller, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { Players, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import { Trove } from "@rbxts/trove";
import { selectSelectedEnemiesByPlayerId } from "shared/store/enemy-selection";
import { store } from "@/client/store";
import remotes from "@/shared/remotes";
import { selectFighterTarget } from "@/shared/store/fighter-target/fighter-target-selectors";
import { selectActivePlayerFighters } from "@/shared/store/players/fighters";

@Controller()
export class FightersTracker implements OnStart {
	public fightersFolder = new Instance("Folder");

	private readonly RootOffset = new Vector3(0, -3, 4);
	private troves = new Map<string, Trove>();
	private goalContainer = Workspace.Terrain;
	private activePlayerFighters = new Map<string, Map<string, Attachment>>();
	private rootCache = new Map<string, Part>();

	constructor(private readonly logger: Logger) {}

	onStart() {
		this.fightersFolder.Name = "Fighters";
		this.fightersFolder.Parent = Workspace;

		const onPlayerCleanup = (player: Player) => {
			const userId = tostring(player.UserId);
			const fighters = store.getState(selectActivePlayerFighters(userId));

			this.activePlayerFighters.get(userId)?.forEach((attachment) => {
				attachment.RemoveTag("FighterGoal");
			});

			if (fighters) {
				fighters.forEach((uid) => {
					this.removeFighter(uid, userId);
				});
			}
		};

		const onNewPlayer = (player: Player) => {
			const trove = new Trove();

			this.troves.set(tostring(player.UserId), trove);
			this.trackFighters(player);

			trove.add(
				player.CharacterRemoving.Connect(() => {
					onPlayerCleanup(player);
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

	// onCharacterAdded(character: Model) {
	// 	this.root = character.WaitForChild("HumanoidRootPart") as Part;
	// 	this.updateFighters();
	// }
	//
	// onCharacterRemoved() {
	// 	this.root = undefined;
	// 	this.activeFighters.forEach((fighterAttachment) => {
	// 		fighterAttachment.RemoveTag("FighterGoal");
	// 	});
	// 	this.activeFighters.clear();
	// }

	private trackFighters(player: Player) {
		const userId = tostring(player.UserId);
		const trove = this.troves.get(userId) as Trove;

		const enemyAdded = (enemyUid: string) => {
			const doesNotHaveTarget = (enemies: string[] | undefined) => {
				return enemies?.includes(enemyUid) === false;
			};

			const cleanup = this.enemyObserver(enemyUid, userId);

			trove.add(store.once(selectSelectedEnemiesByPlayerId(userId), doesNotHaveTarget, cleanup));
		};

		const onNewCharacter = () => {
			this.getRootByPlayerId(userId);
			this.updateFighters(userId);
		};

		const onNewActiveFighter = (uid: string) => {
			this.createFighter(uid, userId);
			this.updateFighters(userId);
		};

		const activeFighters = store.getState(selectActivePlayerFighters(userId));

		if (activeFighters) {
			activeFighters.forEach(onNewActiveFighter);
		}

		trove.add(
			store.observe(selectActivePlayerFighters(userId), (uid) => {
				onNewActiveFighter(uid);

				return () => {
					this.logger.Debug("Removing fighter {uid}", uid);
					this.removeFighter(uid, userId);
					this.updateFighters(userId);
				};
			}),
		);

		trove.add(
			store.subscribe(selectSelectedEnemiesByPlayerId(userId), (enemiesSelected, previousEnemiesSelected) => {
				if (!enemiesSelected) {
					return;
				}

				// eslint-disable-next-line roblox-ts/no-array-pairs
				for (const [enemyIndex, enemyUid] of pairs(enemiesSelected)) {
					if (previousEnemiesSelected?.[enemyIndex] !== undefined) {
						continue;
					}

					enemyAdded(enemyUid);
				}
			}),
		);

		if (player.Character) {
			onNewCharacter();
		}
		trove.add(player.CharacterAdded.Connect(onNewCharacter));
	}

	private enemyObserver(enemyUid: string, userId: string) {
		this.activePlayerFighters.forEach((_, uid) => {
			remotes.fighterTarget.set.fire(uid, enemyUid);
		});

		this.updateFighters(userId);

		return () => {
			this.activePlayerFighters.forEach((_, uid) => {
				const fighterTargetUid = store.getState(selectFighterTarget(uid));

				if (fighterTargetUid === undefined || fighterTargetUid !== enemyUid) {
					return;
				}

				remotes.fighterTarget.remove.fire(uid, enemyUid);
			});

			this.updateFighters(userId);
		};
	}

	private createFighter(uid: string, userId: string) {
		const activeFighters = this.getActivePlayerFighters(userId);
		let goalAttachment = activeFighters.get(uid);

		if (!goalAttachment && this.goalContainer) {
			goalAttachment = new Instance("Attachment");
			goalAttachment.Name = "GoalAttachment";
			goalAttachment.Parent = this.goalContainer;
		}

		if (!goalAttachment) {
			return;
		}

		activeFighters.set(uid, goalAttachment);
		this.activePlayerFighters.set(userId, activeFighters);

		goalAttachment.SetAttribute("UID", uid);
	}

	private removeFighter(uid: string, userId: string) {
		const activeFighters = this.getActivePlayerFighters(userId);
		const attachment = activeFighters?.get(uid);

		attachment?.Destroy();

		activeFighters.delete(uid);
		this.activePlayerFighters.set(userId, activeFighters);
	}

	private updateFighters(userId: string) {
		const root = this.getRootByPlayerId(userId);

		if (!root) {
			return;
		}

		const activeFighters = this.activePlayerFighters.get(userId);

		if (!activeFighters) {
			return;
		}

		const troopSize = activeFighters.size();
		const formation = this.getFormation(troopSize);
		const formationSize = formation.size();
		let index = 0;

		for (const [uid, goalAttachment] of activeFighters) {
			index++;

			if (!goalAttachment) {
				continue;
			}

			const fighterGoal = formation[index % formationSize];
			const fighterOffset = this.RootOffset.add(fighterGoal);

			goalAttachment.WorldPosition = root.Position.add(fighterOffset);
			goalAttachment.SetAttribute("Offset", fighterOffset);
			goalAttachment.SetAttribute("UID", uid);
			goalAttachment.SetAttribute("OwnerId", userId);
			goalAttachment.AddTag("FighterGoal");
		}
	}

	private getFormation(troopAmount: number, spacing = 4) {
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

	private getRootByPlayerId(userIdStr: string) {
		const cachedRoot = this.rootCache.get(userIdStr);

		if (cachedRoot?.Parent) {
			return cachedRoot;
		}

		const userId = tonumber(userIdStr);

		if (!t.number(userId)) {
			return;
		}

		const player = Players.GetPlayerByUserId(userId);
		const character = player?.Character;

		const root = character?.FindFirstChild("HumanoidRootPart") as Part | undefined;

		if (root) {
			this.rootCache.set(userIdStr, root);
		}

		return root;
	}

	private getActivePlayerFighters(userId: string) {
		if (this.activePlayerFighters.has(userId)) {
			return this.activePlayerFighters.get(userId) as Map<string, Attachment>;
		}

		const activeFighters = new Map<string, Attachment>();
		this.activePlayerFighters.set(userId, activeFighters);

		return activeFighters;
	}
}
