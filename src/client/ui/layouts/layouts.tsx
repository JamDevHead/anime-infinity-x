import Roact from "@rbxts/roact";
import { Frame } from "@/client/ui/components/frame";
import { EggLayout } from "@/client/ui/layouts/egg/egg-layout";

export const Layouts = () => {
	return (
		<Frame
			position={UDim2.fromScale(0.5, 0.5)}
			size={UDim2.fromScale(1, 1)}
			anchorPoint={new Vector2(0.5, 0.5)}
			backgroundTransparency={1}
		>
			<EggLayout />
		</Frame>
	);
};
