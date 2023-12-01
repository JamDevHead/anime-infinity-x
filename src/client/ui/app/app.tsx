import Roact from "@rbxts/roact";
import { BlurEffect } from "@/client/ui/components/blur-effect";
import { GlobalContextMenu } from "@/client/ui/components/global-context-menu";
import { Layer } from "@/client/ui/components/layer";
import { WindowManager } from "@/client/ui/components/window-manager";
import { Hud } from "@/client/ui/layouts/hud/hud";

export const App = () => {
	return (
		<Layer>
			<Hud />
			<WindowManager />
			<GlobalContextMenu />
			<BlurEffect />
		</Layer>
	);
};
