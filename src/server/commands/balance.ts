import { Players } from "@rbxts/services";
import { ZirconEnumBuilder, ZirconFunctionBuilder } from "@rbxts/zircon";
import { store } from "@/server/store";
import { PlayerBalance } from "@/shared/store/players";

const Currency = new ZirconEnumBuilder("Currency").FromArray(["coins", "stars"]);

const giveCoins = new ZirconFunctionBuilder("give")
	.AddDescription("Give coins or stars to the player")
	.AddArgument("string", "Player name")
	.AddArgument("number", "Amount")
	.AddArgument(Currency, "Currency")
	.Bind((context, playerName, amount, currency) => {
		if (amount < 0) {
			context.LogError("Amount must be positive");
			return;
		}

		const player =
			playerName === "me" ? context.GetExecutor() : (Players.FindFirstChild(playerName) as Player | undefined);
		if (player === undefined) {
			context.LogError(`Player ${playerName} not found`);
			return;
		}

		store.addBalance(tostring(player.UserId), currency.getName() as keyof PlayerBalance, amount);
	});

const takeCoins = new ZirconFunctionBuilder("take")
	.AddDescription("Take coins or stars from the player")
	.AddArgument("string", "Player name")
	.AddArgument("number", "Amount")
	.AddArgument(Currency, "Currency")
	.Bind((context, playerName, amount, currency) => {
		const player = Players.FindFirstChild(playerName) as Player | undefined;
		if (player === undefined) {
			context.LogError(`Player ${playerName} not found`);
			return;
		}

		store.removeBalance(tostring(player.UserId), currency.getName() as keyof PlayerBalance, amount);
	});

export const balanceCommands = [giveCoins, takeCoins];
