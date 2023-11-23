import Roact from "@rbxts/roact";
import { IS_EDIT } from "@/client/constants/constants";

interface LayerProps {
	displayOrder?: number;
	children?: Roact.Children;
}

export function Layer({ displayOrder, children }: LayerProps) {
	return IS_EDIT ? (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(1, 0, 1, 0)}
			Position={new UDim2(0, 0, 0, 0)}
			ZIndex={displayOrder}
		>
			{children}
		</frame>
	) : (
		<screengui
			DisplayOrder={displayOrder}
			IgnoreGuiInset
			ResetOnSpawn={false}
			ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
		>
			{children}
		</screengui>
	);
}
