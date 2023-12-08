import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { store } from "@/client/store";
import { useMockData } from "@/client/ui/hooks/use-mock-data";
import { EggLayout } from "@/client/ui/layouts/egg/egg-layout";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	useMockData();
	useEffect(() => {
		store.setHudVisible(true);
		store.setEggOpen(true);
		return () => {
			store.setEggOpen(false);
			store.setHudVisible(false);
		};
	}, []);

	return (
		<RootProvider>
			<EggLayout />
		</RootProvider>
	);
});
