import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Window } from "@/client/ui/components/window";
import { useMockData } from "@/client/ui/hooks/use-mock-data";
import { Teleport } from "@/client/ui/layouts/windows/teleport/teleport";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	useMockData();

	return (
		<RootProvider>
			<Window title="Teleport">
				<Teleport />
			</Window>
		</RootProvider>
	);
});
