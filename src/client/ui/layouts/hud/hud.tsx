import Roact from "@rbxts/roact";
import { useRootSelector } from "@/client/store";
import { selectHudVisible } from "@/client/store/hud/hud-selectors";
import { Frame } from "@/client/ui/components/frame";
import { BottomHudButtons } from "@/client/ui/layouts/hud/bottom-hud-buttons";
import { LeftSideHud } from "@/client/ui/layouts/hud/left-side-hud";
import { RightSideHud } from "@/client/ui/layouts/hud/right-side-hud";

export const Hud = () => {
	const hudVisible = useRootSelector(selectHudVisible);

	if (!hudVisible) return <></>;

	return (
		<Frame size={UDim2.fromScale(1, 1)} backgroundTransparency={1}>
			<LeftSideHud />
			<RightSideHud />
			<BottomHudButtons />
		</Frame>
	);
};
