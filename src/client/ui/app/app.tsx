import Roact from "@rbxts/roact";
import { WindowManager } from "@/client/ui/components/window-manager";
import { Hud } from "@/client/ui/layouts/hud/hud";

export const App = () => {
	return (
		<screengui key="app" ResetOnSpawn={false} IgnoreGuiInset={true}>
			<Hud />
			<WindowManager />
		</screengui>
	);
};
