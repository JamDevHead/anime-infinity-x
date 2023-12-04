import Roact from "@rbxts/roact";
import { BlurEffect } from "@/client/ui/components/blur-effect";
import { ClickEffect } from "@/client/ui/components/click-effect/click-effect";
import { GlobalContextMenu } from "@/client/ui/components/global-context-menu";
import { Layer } from "@/client/ui/components/layer";
import { WindowManager } from "@/client/ui/components/window-manager";
import { FirstTime } from "@/client/ui/layouts/first-time/first-time";
import { Hud } from "@/client/ui/layouts/hud/hud";

export const App = () => {
	return (
		<Layer>
			<FirstTime />
			<Hud />
			<WindowManager />
			<GlobalContextMenu />
			<BlurEffect />
			<ClickEffect />
		</Layer>
	);
};
