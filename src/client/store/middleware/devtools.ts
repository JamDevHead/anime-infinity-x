import Object from "@rbxts/object-utils";
import { ProducerMiddleware } from "@rbxts/reflex";
import { ReplicatedStorage, RunService } from "@rbxts/services";
import { RootState } from "@/client/store";

const blacklist = ["setHoveredEnemy", "removeHoveredEnemy", "removeDrop", "addDrop", "addBalance", "setPlayerDps"];
const event = ReplicatedStorage.FindFirstChild("REFLEX_DEVTOOLS") as RemoteEvent;

function getDiff(state: RootState, lastState: RootState) {
	const diff: { [key: string]: unknown } = {};

	for (const [key, value] of Object.entries(lastState)) {
		if (type(value) !== "table") {
			if (value !== state[key]) {
				diff[key] = "[[removed]]";
			}
		} else if (state[key] !== undefined) {
			const subDiff = getDiff(value as unknown as RootState, state[key] as unknown as RootState);

			if (Object.entries(subDiff).size() > 0) {
				diff[key] = subDiff;
			}
		}
	}

	for (const [key, value] of Object.entries(state)) {
		if (type(value) !== "table") {
			if (value !== lastState[key]) {
				diff[key] = value;
			}
		} else if (lastState[key] !== undefined) {
			const subDiff = getDiff(value as unknown as RootState, lastState[key] as unknown as RootState);

			if (Object.entries(subDiff).size() > 0) {
				diff[key] = subDiff;
			}
		}
	}

	return diff;
}

export const devToolsMiddleware: ProducerMiddleware<RootState> = () => {
	let lastState: RootState | undefined;

	return (nextAction, actionName) => {
		return (...args) => {
			const state = nextAction(...args);

			if (RunService.IsStudio() && event && !blacklist.includes(actionName)) {
				const diff = lastState ? getDiff(state as RootState, lastState) : {};

				lastState = state as RootState;

				event.FireServer({ name: actionName, args, state: diff });
			}

			return state;
		};
	};
};
