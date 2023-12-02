import { ProducerMiddleware } from "@rbxts/reflex";
import { IS_PRODUCTION } from "shared/constants/core";

export const profilerMiddleware: ProducerMiddleware = () => {
	return (dispatch, name) => {
		if (IS_PRODUCTION) {
			return dispatch;
		}

		return (...args) => {
			debug.profilebegin(`${name} dispatcher`);
			const result = dispatch(...args);
			debug.profileend();
			return result;
		};
	};
};
