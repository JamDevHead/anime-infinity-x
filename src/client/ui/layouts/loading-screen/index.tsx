import { useMountEffect } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { Layer } from "@/client/ui/components/layer";
import { Loading } from "@/client/ui/layouts/loading-screen/loading";

export const LoadingScreen = () => {
	useMountEffect(() => {
		// This is a hacky way to remove the loading screen, but it works.
		Players.LocalPlayer.WaitForChild("PlayerGui").WaitForChild("LoadingScreen").Destroy();
	});

	return (
		<Layer displayOrder={100}>
			<Loading />
		</Layer>
	);
};
