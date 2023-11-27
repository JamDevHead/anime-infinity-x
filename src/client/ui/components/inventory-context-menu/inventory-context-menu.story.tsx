import { hoarcekat, useCamera } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { store } from "@/client/store";
import { InventoryContextMenu } from "@/client/ui/components/inventory-context-menu/inventory-context-menu";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	const camera = useCamera();

	// MOCK: Set the inventory menu position to the center of the screen
	useEffect(() => {
		store.setInventoryOpenedMenu(true);
		store.setInventoryMenuPosition(new Vector2(camera.ViewportSize.X / 2, camera.ViewportSize.Y / 2));
		return () => {
			store.setInventoryOpenedMenu(false);
		};
	}, [camera.ViewportSize.X, camera.ViewportSize.Y]);

	return (
		<RootProvider>
			<InventoryContextMenu />
		</RootProvider>
	);
});
