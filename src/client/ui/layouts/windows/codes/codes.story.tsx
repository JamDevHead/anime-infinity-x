import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Window } from "@/client/ui/components/window";
import { Codes } from "@/client/ui/layouts/windows/codes/codes";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	return (
		<RootProvider>
			<Window title="Codes">
				<Codes />
			</Window>
		</RootProvider>
	);
});
