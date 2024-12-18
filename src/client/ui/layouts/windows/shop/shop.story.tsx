import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Windows } from "@/client/constants/windows";
import { Window } from "@/client/ui/components/window";
import { Shop } from "@/client/ui/layouts/windows/shop/shop";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	return (
		<RootProvider>
			<Window title="Shop" size={Windows.shop.size}>
				<Shop />
			</Window>
		</RootProvider>
	);
});
