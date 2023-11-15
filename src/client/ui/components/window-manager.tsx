import Roact from "@rbxts/roact";
import { Windows } from "@/client/constants/windows";
import { useRootProducer, useRootSelector } from "@/client/reflex/producers";
import { Frame } from "@/client/ui/components/frame";
import { Window } from "@/client/ui/components/window";
import { Codes } from "@/client/ui/layouts/windows/codes/codes";
import { Settings } from "@/client/ui/layouts/windows/settings/settings";

export const WindowManager = () => {
	const { currentWindow, visible } = useRootSelector((store) => store.window);
	const { setVisibility } = useRootProducer();
	const window = Windows[currentWindow ?? "codes"];

	if (!visible || currentWindow === undefined) return <></>;

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			position={UDim2.fromScale(0.5, 0.5)}
			size={UDim2.fromScale(1, 1)}
			backgroundTransparency={1}
		>
			<Window title={window.title} size={window.size} onClose={() => setVisibility(false)}>
				{currentWindow === "codes" && <Codes />}
				{currentWindow === "settings" && <Settings />}
			</Window>
		</Frame>
	);
};
