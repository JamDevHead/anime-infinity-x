import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import Object from "@rbxts/object-utils";
import { addFighterFor } from "@/server/utils/fighters";
import { FighterRarity } from "@/shared/constants/rarity";
import remotes from "@/shared/remotes";

@Service()
export class EggService implements OnStart {
	constructor(private readonly logger: Logger) {}

	onStart(): void {
		this.logger.Info("EggService started");

		remotes.eggs.open.onRequest((player, zone) => {
			this.logger.Info(`Player ${player.Name} opened egg ${zone}`);

			const rarityByZone = FighterRarity[(zone.lower() ?? "nrt") as keyof typeof FighterRarity];

			if (!rarityByZone) return;

			const randomRarity = math.random(0.0001, 100);
			const rarity = Object.entries(rarityByZone).find(([, rarity]) => randomRarity <= (rarity as number)) as
				| [string, number]
				| undefined;
			if (!rarity) return;

			this.logger.Info(`Player ${player.Name} got ${rarity[0]} from egg ${zone}`);

			return addFighterFor(player, {
				name: rarity[0],
				displayName: rarity[0],
				rarity: 1,
				stats: {
					damage: math.random() * rarity[1] * 10,
					dexterity: math.random() * rarity[1] * 10,
					sellPrice: math.random() * rarity[1] * 100,
					level: math.random(1, 3),
					xp: 0,
				},
				zone,
			});
		});
	}
}
