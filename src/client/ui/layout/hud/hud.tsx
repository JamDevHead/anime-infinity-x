import Roact from "@rbxts/roact";
import { BottomHudButtons } from "@/client/ui/component/bottom-hud-buttons";
import { Frame } from "@/client/ui/component/frame";

export const Hud = () => {
	return (
		<Frame size={new UDim2(1, 0, 1, 0)} backgroundTransparency={1}>
			<Frame
				position={UDim2.fromScale(0, 1)}
				size={UDim2.fromScale(1, 0.1)}
				anchorPoint={new Vector2(0, 1)}
				backgroundTransparency={1}
			>
				<BottomHudButtons />
			</Frame>
		</Frame>
	);
};
