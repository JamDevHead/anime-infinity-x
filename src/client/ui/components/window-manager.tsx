import Roact, { useEffect } from "@rbxts/roact";
import { Windows } from "@/client/constants/windows";
import { RootState, store, useRootSelector, useRootStore } from "@/client/store";
import { Frame } from "@/client/ui/components/frame";
import { Window } from "@/client/ui/components/window";
import { useMotion } from "@/client/ui/hooks/use-motion";
import { Codes } from "@/client/ui/layouts/windows/codes/codes";
import { Inventory } from "@/client/ui/layouts/windows/inventory/inventory";
import { Settings } from "@/client/ui/layouts/windows/settings/settings";
import { Shop } from "@/client/ui/layouts/windows/shop/shop";
import { Teleport } from "@/client/ui/layouts/windows/teleport/teleport";

export const WindowManager = () => {
	const { currentWindow, visible } = useRootSelector((store) => store.window);
	const { resetInventorySlice, setVisibility, setBlur } = useRootStore();
	const window = Windows[currentWindow ?? "codes"];

	const [position, positionMotion] = useMotion(new UDim2());

	const selectWindow = (state: RootState) => state.window.currentWindow;

	useEffect(() => {
		if (visible === false) {
			resetInventorySlice();
		}
	}, [resetInventorySlice, visible]);

	useEffect(() => {
		return store.subscribe(selectWindow, (currentWindow, lastWindow) => {
			if (currentWindow !== lastWindow) {
				setVisibility(false);
				task.wait(0.2);
				setVisibility(true);
			}
		});
	}, [setBlur, setVisibility]);

	useEffect(() => {
		setBlur(visible === true ? 12 : 0);
		positionMotion.spring(visible === true ? UDim2.fromScale(0.5, 0.5) : UDim2.fromScale(0.5, -1));
	}, [currentWindow, positionMotion, setBlur, visible]);

	const getWindowContent = () => {
		switch (currentWindow) {
			case "codes":
				return <Codes />;
			case "settings":
				return <Settings />;
			case "inventory":
				return <Inventory />;
			case "teleport":
				return <Teleport />;
			case "shop":
				return <Shop />;
		}
	};

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			position={UDim2.fromScale(0.5, 0.5)}
			size={UDim2.fromScale(1, 1)}
			backgroundTransparency={1}
		>
			<Window
				title={window.title}
				size={window.size}
				position={position}
				onClose={() => {
					setVisibility(false);
				}}
			>
				{getWindowContent()}
			</Window>
		</Frame>
	);
};
