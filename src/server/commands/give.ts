import Object from "@rbxts/object-utils";
import { ZirconEnumBuilder, ZirconFunctionBuilder } from "@rbxts/zircon";
import { addFighterFor } from "@/server/utils/fighters";
import { FighterRarity } from "@/shared/constants/rarity";

const ItemType = new ZirconEnumBuilder("ItemType").FromArray(["fighter", "item"]);

export const giveCommand = new ZirconFunctionBuilder("give")
	.AddDescription("Give an item or entity to the player")
	.AddArgument(ItemType, "Item type")
	.AddArgument("string", "Item id")
	.AddArgument("unknown")
	.Bind((context, itemType, entityName, ...args) => {
		const player = context.GetExecutor();

		itemType.match({
			item: () => {
				context.LogInfo("Giving item");
			},
			fighter: () => {
				const zone = args[0] as string;

				if (zone === undefined) {
					context.LogError("Zone must be provided");
					return;
				}

				const rarityByZone = FighterRarity[(zone.lower() ?? "nrt") as keyof typeof FighterRarity];

				if (!rarityByZone) {
					context.LogError("Invalid zone");
					return;
				}

				const rarity = Object.entries(rarityByZone).find(([fighterName]) => fighterName === entityName) as
					| [string, number]
					| undefined;

				if (!rarity) {
					context.LogError("Invalid fighter name");
					return;
				}

				addFighterFor(player, {
					displayName: entityName,
					name: entityName,
					zone: zone.upper(),
					stats: {
						damage: math.random() * rarity[1] * 10,
						dexterity: math.random() * rarity[1] * 10,
						level: math.random(1, 3),
						sellPrice: math.random() * rarity[1] * 100,
						xp: 0,
					},
					rarity: rarity[1],
				});

				context.LogInfo(`Giving fighter ${entityName} to ${player.Name} ${player.UserId}`);
			},
		});
	});
