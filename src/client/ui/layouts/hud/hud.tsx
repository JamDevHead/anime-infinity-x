import Roact from "@rbxts/roact";
import { Frame } from "@/client/ui/components/frame";
import { Stack } from "@/client/ui/components/stack";
import { BottomHudButtons } from "@/client/ui/layouts/hud/bottom-hud-buttons";
import { LeftSideHud } from "@/client/ui/layouts/hud/left-side-hud";
import { RightSideHud } from "@/client/ui/layouts/hud/right-side-hud";

export const Hud = () => {
	return (
		<Frame size={new UDim2(1, 0, 1, 0)} backgroundTransparency={1}>
			<Stack
				fillDirection={Enum.FillDirection.Vertical}
				horizontalAlignment={Enum.HorizontalAlignment.Left}
				size={UDim2.fromScale(1, 1)}
			>
				<LeftSideHud />
			</Stack>

			<Stack
				fillDirection={Enum.FillDirection.Vertical}
				horizontalAlignment={Enum.HorizontalAlignment.Right}
				size={UDim2.fromScale(1, 1)}
			>
				<RightSideHud />
			</Stack>

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
