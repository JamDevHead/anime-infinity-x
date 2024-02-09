import { Components } from "@flamework/components";
import { Controller, OnStart, OnTick } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Enemy } from "@/client/components/enemy-component";
import { store } from "@/client/store";
import { selectSpecificPerk } from "@/client/store/perks";
import { getEnemyByUid } from "@/client/utils/enemies";
import remotes from "@/shared/remotes";
import { selectEnemySelectionFromPlayer } from "@/shared/store/players/enemy-selection";

@Controller()
export class FighterAutoclick implements OnStart, OnTick {
	private autoClickEnabled = false;
	private selectedEnemy?: Enemy;
	private timer = 0;
	private localUserId = tostring(Players.LocalPlayer.UserId);

	constructor(private readonly components: Components) {}

	onStart() {
		store.subscribe(selectSpecificPerk("autoclick"), (autoClickEnabled) => {
			this.autoClickEnabled = autoClickEnabled;
		});

		store.subscribe(selectEnemySelectionFromPlayer(this.localUserId), (enemyId) => {
			this.selectedEnemy = enemyId !== undefined ? getEnemyByUid(enemyId, this.components) : undefined;
		});
	}

	onTick(dt: number) {
		if (!this.autoClickEnabled || !this.selectedEnemy) {
			return;
		}

		this.timer += dt;

		if (this.timer < 0.1) {
			return;
		}

		this.timer = 0;
		remotes.attackEnemy.fire();
	}
}
