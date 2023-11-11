import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { useMockData } from "@/client/ui/hooks/use-mock-data";
import { Hud } from "@/client/ui/layouts/hud/hud";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	useMockData();

	return (
		<RootProvider>
			<Hud />
		</RootProvider>
	);
});
