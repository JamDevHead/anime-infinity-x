import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { GlobalContextMenu } from "@/client/ui/components/global-context-menu";
import { WindowManager } from "@/client/ui/components/window-manager";
import { useMockData } from "@/client/ui/hooks/use-mock-data";
import { Hud } from "@/client/ui/layouts/hud/hud";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	useMockData();

	return (
		<RootProvider>
			<Hud />
			<WindowManager />
			<GlobalContextMenu />
		</RootProvider>
	);
});
