import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Window } from "@/client/ui/components/window";
import { useMockData } from "@/client/ui/hooks/use-mock-data";
import { Inventory } from "@/client/ui/layouts/windows/inventory/inventory";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	useMockData();

	return (
		<RootProvider>
			<Window title="Inventory" size={UDim2.fromScale(0.8, 0.8)}>
				<Inventory />
			</Window>
		</RootProvider>
	);
});
