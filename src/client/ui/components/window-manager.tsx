import Roact, { useEffect } from "@rbxts/roact";
import { Windows } from "@/client/constants/windows";
import { RootState, store, useRootSelector, useRootStore } from "@/client/store";
import { Frame } from "@/client/ui/components/frame";
import { Window } from "@/client/ui/components/window";
import { useMotion } from "@/client/ui/hooks/use-motion";
import { Codes } from "@/client/ui/layouts/windows/codes/codes";
import { Settings } from "@/client/ui/layouts/windows/settings/settings";

export const WindowManager = () => {
	const { currentWindow, visible } = useRootSelector((store) => store.window);
	const { setVisibility } = useRootStore();
	const window = Windows[currentWindow ?? "codes"];

	const [position, positionMotion] = useMotion(new UDim2());

	const selectWindow = (state: RootState) => state.window.currentWindow;

	useEffect(() => {
		return store.subscribe(selectWindow, (currentWindow, lastWindow) => {
			if (currentWindow !== lastWindow) {
				setVisibility(false);
				task.wait(0.2);
				setVisibility(true);
			}
		});
	}, [setVisibility]);

	useEffect(() => {
		positionMotion.spring(visible === true ? UDim2.fromScale(0.5, 0.5) : UDim2.fromScale(0.5, -1));
	}, [currentWindow, positionMotion, visible]);

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			position={UDim2.fromScale(0.5, 0.5)}
			size={UDim2.fromScale(1, 1)}
			backgroundTransparency={1}
		>
			<Window title={window.title} size={window.size} position={position} onClose={() => setVisibility(false)}>
				{currentWindow === "codes" && <Codes />}
				{currentWindow === "settings" && <Settings />}
			</Window>
		</Frame>
	);
};
