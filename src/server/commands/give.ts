import { ZirconEnumBuilder, ZirconFunctionBuilder } from "@rbxts/zircon";
import { addFighterFor } from "@/server/utils/fighters";

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

				addFighterFor(player, {
					displayName: entityName,
					name: entityName,
					zone: zone.upper(),
					stats: {
						damage: 1,
						dexterity: 10,
						level: 1,
						sellPrice: 0,
						xp: 0,
					},
					rarity: 1,
				});

				context.LogInfo(`Giving fighter ${entityName} to ${player.Name} ${player.UserId}`);
			},
		});
	});
