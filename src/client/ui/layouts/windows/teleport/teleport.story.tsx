import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Window } from "@/client/ui/components/window";
import { Teleport } from "@/client/ui/layouts/windows/teleport/teleport";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	return (
		<RootProvider>
			<Window title="Teleport">
				<Teleport />
			</Window>
		</RootProvider>
	);
});
