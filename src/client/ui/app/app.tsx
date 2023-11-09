import Roact from "@rbxts/roact";
import { Hud } from "@/client/ui/layout/hud/hud";

export const App = () => {
	return (
		<screengui key="app" ResetOnSpawn={false} IgnoreGuiInset={true}>
			<Hud />
		</screengui>
	);
};
