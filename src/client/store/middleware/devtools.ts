import { ProducerMiddleware } from "@rbxts/reflex";
import { ReplicatedStorage, RunService } from "@rbxts/services";
import { RootState } from "@/client/store";

const blacklist = ["setHoveredEnemy", "removeHoveredEnemy", "removeDrop", "addDrop", "addBalance", "setPlayerDps"];
const event = ReplicatedStorage.FindFirstChild("REFLEX_DEVTOOLS") as RemoteEvent;

export const devToolsMiddleware: ProducerMiddleware<RootState> = () => {
	return (nextAction, actionName) => {
		return (...args) => {
			const state = nextAction(...args);

			if (RunService.IsStudio() && event && !blacklist.includes(actionName)) {
				event.FireServer({ name: actionName, args, state });
			}

			return state;
		};
	};
};
