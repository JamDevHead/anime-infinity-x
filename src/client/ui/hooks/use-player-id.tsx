import { Players } from "@rbxts/services";

export const usePlayerId = () => {
	return tostring(Players.LocalPlayer ? Players.LocalPlayer.UserId : 1);
};
