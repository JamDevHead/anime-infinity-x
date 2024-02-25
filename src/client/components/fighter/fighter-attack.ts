import { FighterAnimator } from "@/client/components/fighter/fighter-animator";
import { store } from "@/client/store";
import { selectPlayerFighter } from "@/shared/store/players/fighters";
import { calculateStun } from "@/shared/utils/fighters";

export class FighterAttack {
	public lastAttack = tick();

	private stunTime = 0.1;
	private attackState: 1 | 2 = 1;

	constructor(
		playerId: string,
		fighterId: string,
		private animator: FighterAnimator,
	) {
		const fighter = store.getState(selectPlayerFighter(playerId, fighterId));

		if (fighter) {
			this.stunTime = calculateStun(fighter.stats.dexterity);
		}
	}

	public attack() {
		const now = tick();

		if (now - this.lastAttack < this.stunTime) {
			return;
		}

		this.lastAttack = now;
		this.attackState = this.attackState === 1 ? 2 : 1;
		this.animator.updateAnimation(`soco${this.attackState}`);
	}
}
