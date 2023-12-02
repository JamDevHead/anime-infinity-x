import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { ClickEffect } from "@/client/ui/components/click-effect/click-effect";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	return (
		<RootProvider>
			<ClickEffect />
		</RootProvider>
	);
});
