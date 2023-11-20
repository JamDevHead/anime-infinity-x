import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Window } from "@/client/ui/components/window";
import { Inventory } from "@/client/ui/layouts/windows/inventory/inventory";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	return (
		<RootProvider>
			<Window title="Inventory">
				<Inventory />
			</Window>
		</RootProvider>
	);
});
