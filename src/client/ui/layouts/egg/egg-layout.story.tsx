import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { EggLayout } from "@/client/ui/layouts/egg/egg-layout";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	return (
		<RootProvider>
			<EggLayout position={new UDim2(0.5, 0, 0.3, 0)} size={new UDim2(0, 400, 0, 400)} />
		</RootProvider>
	);
});
