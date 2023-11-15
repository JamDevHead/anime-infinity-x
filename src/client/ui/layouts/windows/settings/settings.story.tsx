import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Window } from "@/client/ui/components/window";
import { Settings } from "@/client/ui/layouts/windows/settings/settings";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	return (
		<RootProvider>
			<Window title="Settings">
				<Settings />
			</Window>
		</RootProvider>
	);
});
