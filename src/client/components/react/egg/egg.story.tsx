import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Egg } from "@/client/components/react/egg/egg";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	return (
		<RootProvider>
			<Egg eggZoneName={"NRT"} />
		</RootProvider>
	);
});
