import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { store } from "@/client/store";
import { useMockData } from "@/client/ui/hooks/use-mock-data";
import { PortalPopup } from "@/client/ui/layouts/portal/portal-popup";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	useMockData();

	useEffect(() => {
		store.setPortalVisible(true);
	}, []);

	return (
		<RootProvider>
			<PortalPopup />
		</RootProvider>
	);
});
