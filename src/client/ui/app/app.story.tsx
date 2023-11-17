import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { App } from "@/client/ui/app/app";
import { useMockData } from "@/client/ui/hooks/use-mock-data";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	useMockData();

	return (
		<RootProvider>
			<App />
		</RootProvider>
	);
});
