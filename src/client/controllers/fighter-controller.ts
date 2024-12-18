import { Components } from "@flamework/components";
import { Controller, OnStart } from "@flamework/core";
import { createSelector } from "@rbxts/reflex";
import { Players } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import { Enemy } from "@/client/components/enemy-component";
import type { FighterAttributes } from "@/client/components/fighter";
import type { FighterComponent } from "@/client/components/fighter/fighter-component";
import { knownEnemies } from "@/client/components/fighter/fighter-enemies";
import { FIGHTERS_CONTAINER, GOAL_ROOT_OFFSET } from "@/client/constants/fighters";
import { store } from "@/client/store";
import { getEnemyByUid } from "@/client/utils/enemies";
import { getFormation } from "@/client/utils/fighters-math";
import { selectEnemySelectionFromPlayer } from "@/shared/store/players/enemy-selection";
import { identifyActiveFighter, selectActiveFightersFromPlayer } from "@/shared/store/players/fighters";
import { getFighterModelFromCharacterId } from "@/shared/utils/fighters";

@Controller()
export class FighterController implements OnStart {
	private playerFightersListeners = new Map<string, Trove>();
	private currentEnemy = new Map<string, Enemy>();

	constructor(private readonly components: Components) {}

	onStart() {
		Players.GetPlayers().forEach((player) => this.replicateFighters(player));
		Players.PlayerAdded.Connect((player) => this.replicateFighters(player));
		Players.PlayerRemoving.Connect((player) => this.clearFighters(player));
	}

	private replicateFighters(player: Player) {
		const playerId = tostring(player.UserId);
		const trove = new Trove();
		const fighters = new Set<FighterComponent>();

		this.listenForSelectedEnemy(trove, playerId, fighters);

		const selectActiveFightersFromLocalPlayer = createSelector(
			[selectActiveFightersFromPlayer(playerId)],
			(fighters) => fighters ?? [],
		);

		this.playerFightersListeners.set(playerId, trove);

		trove.add(
			store.observe(selectActiveFightersFromLocalPlayer, identifyActiveFighter, ({ fighterId, characterId }) => {
				const fighterModel = getFighterModelFromCharacterId(characterId)?.Clone();

				if (!fighterModel) {
					warn(`Failed to find fighter model ${fighterId} ${characterId}`);
					return;
				}

				const attributes = {
					fighterId,
					characterId,
					playerId,
				} satisfies FighterAttributes;

				for (const [name, value] of pairs(attributes)) {
					fighterModel.SetAttribute(name, value);
				}

				const fighterComponent = trove.add(this.components.addComponent<FighterComponent>(fighterModel));

				fighters.add(fighterComponent);
				fighterModel.Parent = FIGHTERS_CONTAINER;
				this.updateFighters(fighters);

				return () => {
					fighterComponent.destroy();
					fighterModel.Destroy();

					fighters.delete(fighterComponent);
					this.components.removeComponent<FighterComponent>(fighterModel);

					this.updateFighters(fighters);
				};
			}),
		);
	}

	private clearFighters(player: Player) {
		const playerId = tostring(player.UserId);

		this.playerFightersListeners.get(playerId)?.destroy();
		this.playerFightersListeners.delete(playerId);
	}

	private updateFighters(fighters: Set<FighterComponent>) {
		const troopAmount = fighters.size();
		const formation = getFormation(troopAmount);
		const formationSize = formation.size();

		let index = 0;

		for (const fighter of fighters) {
			index++;

			const fighterFormation = formation[index % formationSize];

			fighter.updateFighterGoal(new CFrame(GOAL_ROOT_OFFSET.add(fighterFormation)));
		}
	}

	private listenForSelectedEnemy(trove: Trove, playerId: string, fighters: Set<FighterComponent>) {
		const selectEnemySelectionFromLocalPlayer = selectEnemySelectionFromPlayer(playerId);
		const selectActiveFightersFromLocalPlayer = selectActiveFightersFromPlayer(playerId);

		let enemyDamaged: RBXScriptConnection | undefined;

		const onChanges = (enemyId?: string) => {
			const activeFighters = store.getState(selectActiveFightersFromLocalPlayer) ?? [];
			const currentEnemy = this.currentEnemy.get(playerId);

			if (currentEnemy) {
				const fightersSelectingEnemy = knownEnemies[currentEnemy.attributes.Guid] ?? new Set<string>();

				// Remove all fighters that are selecting old enemy
				for (const { fighterId } of activeFighters) {
					fightersSelectingEnemy.delete(fighterId);
				}

				knownEnemies[currentEnemy.attributes.Guid] = fightersSelectingEnemy;
			}

			const enemy = enemyId !== undefined ? getEnemyByUid(enemyId, this.components) : undefined;
			enemy ? this.currentEnemy.set(playerId, enemy) : this.currentEnemy.delete(playerId);

			if (!enemy) return;

			enemyDamaged?.Disconnect();

			let currentHealth = enemy.humanoid.Health;

			enemyDamaged = trove.add(
				enemy.humanoid.HealthChanged.Connect((newHealth) => {
					if (newHealth < currentHealth) {
						for (const fighter of fighters) {
							fighter.attack();
						}
					}

					currentHealth = newHealth;
				}),
			);

			const fightersSelectingEnemy = knownEnemies[enemy.attributes.Guid] ?? new Set<string>();

			// Add all fighters on current enemy
			for (const { fighterId } of activeFighters) {
				fightersSelectingEnemy.add(fighterId);
			}

			knownEnemies[enemy.attributes.Guid] = fightersSelectingEnemy;

			print(knownEnemies);
		};

		trove.add(store.subscribe(selectEnemySelectionFromLocalPlayer, (enemySelected) => onChanges(enemySelected)));

		onChanges(store.getState(selectEnemySelectionFromLocalPlayer));
	}

	public getCurrentEnemy(playerId: string) {
		return this.currentEnemy.get(playerId);
	}
}
