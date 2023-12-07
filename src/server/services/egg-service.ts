import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import Object from "@rbxts/object-utils";
import { addFighterFor, generateStats } from "@/server/utils/fighters";
import { FighterRarity, Rarity } from "@/shared/constants/rarity";
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
				rarity: this.getRarityByEnum(rarity[1]) ?? 1,
				stats: generateStats(rarity[1]),
				zone,
			});
		});
	}

	getRarityByEnum(rarity: number) {
		return tonumber(Rarity[rarity].split("_")[1]);
	}
}
