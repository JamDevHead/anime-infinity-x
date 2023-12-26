import { FilterAction } from "@/server/store/filters/filter";

export const useridFilter: FilterAction = (player, action) => {
	if (action?.arguments[0] !== tostring(player.UserId)) {
		return;
	}

	return action;
};
