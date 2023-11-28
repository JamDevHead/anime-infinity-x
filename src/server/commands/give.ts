import { HttpService } from "@rbxts/services";
import { ZirconEnumBuilder, ZirconFunctionBuilder } from "@rbxts/zircon";
import { store } from "@/server/store";

const ItemType = new ZirconEnumBuilder("ItemType").FromArray(["fighter", "item"]);

export const giveCommand = new ZirconFunctionBuilder("give")
	.AddDescription("Give an item or entity to the player")
	.AddArgument(ItemType, "Item type")
	.AddArgument("string", "Item id")
	.AddArgument("unknown")
	.Bind((context, itemType, entityName, ...args) => {
		const playerId = context.GetExecutor().UserId;
		const uuid = HttpService.GenerateGUID(false);

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

				store.addFighter(tostring(playerId), uuid, {
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
				context.LogInfo(`Giving fighter ${entityName} to player ${playerId}`);
			},
		});
	});
