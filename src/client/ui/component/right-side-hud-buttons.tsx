import Roact from "@rbxts/roact";
import { Frame } from "@/client/ui/component/frame";
import { Grid } from "@/client/ui/component/grid";
import { SimpleButton } from "@/client/ui/component/simple-button";
import { Stack } from "@/client/ui/component/stack";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

export const RightSideHudButtons = () => {
	const rem = useRem();

	return (
		<Stack
			fillDirection={Enum.FillDirection.Vertical}
			horizontalAlignment={Enum.HorizontalAlignment.Right}
			size={UDim2.fromScale(1, 1)}
		>
			<Stack
				fillDirection={Enum.FillDirection.Horizontal}
				horizontalAlignment={Enum.HorizontalAlignment.Right}
				verticalAlignment={Enum.VerticalAlignment.Center}
				size={UDim2.fromScale(1, 1)}
			>
				<Stack
					fillDirection={Enum.FillDirection.Vertical}
					horizontalAlignment={Enum.HorizontalAlignment.Center}
					verticalAlignment={Enum.VerticalAlignment.Center}
					autoSize={Enum.AutomaticSize.XY}
				>
					<SimpleButton color={new Color3(1, 0, 0)} icon={images.icons.sword_outline} />
					<SimpleButton color={new Color3(1, 0, 0)} icon={images.icons.sword_outline} />
				</Stack>

				<Stack
					fillDirection={Enum.FillDirection.Vertical}
					horizontalAlignment={Enum.HorizontalAlignment.Center}
					verticalAlignment={Enum.VerticalAlignment.Center}
					autoSize={Enum.AutomaticSize.XY}
				>
					<SimpleButton color={new Color3(1, 0, 0)} icon={images.icons.sword_outline} />
					<SimpleButton color={new Color3(1, 0, 0)} icon={images.icons.sword_outline} />
					<SimpleButton color={new Color3(1, 0, 0)} icon={images.icons.sword_outline} />
				</Stack>

				<uipadding PaddingLeft={new UDim(0, rem(1))} PaddingRight={new UDim(0, rem(2))} />
			</Stack>
		</Stack>
	);
};
