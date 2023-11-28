import { ZirconEnumBuilder, ZirconFunctionBuilder } from "@rbxts/zircon";
import { store } from "@/server/store";

const ItemType = new ZirconEnumBuilder("ItemType").FromArray(["fighter", "item"]);

export const giveCommand = new ZirconFunctionBuilder("give")
	.AddDescription("Give an item or entity to the player")
	.AddArgument(ItemType, "Item type")
	.AddArgument("string", "Item id")
	.Bind((context, itemType, entityName) => {
		const playerId = context.GetExecutor().UserId;

		itemType.match({
			item: () => {
				context.LogInfo("Giving item");
			},
			fighter: () => {
				store.addFighter(tostring(playerId), entityName, {
					displayName: entityName,
					name: entityName,
					zone: "NRT",
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
