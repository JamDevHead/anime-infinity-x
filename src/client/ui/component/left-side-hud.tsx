import Roact from "@rbxts/roact";
import { Grid } from "@/client/ui/component/grid";
import { SimpleButton } from "@/client/ui/component/simple-button";
import { Stack } from "@/client/ui/component/stack";
import { Stats } from "@/client/ui/component/stats";
import { UiScaleAspectRatio } from "@/client/ui/component/ui-scale-aspect-ratio";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

export const LeftSideHud = () => {
	const rem = useRem();

	return (
		<Stack
			fillDirection={Enum.FillDirection.Vertical}
			horizontalAlignment={Enum.HorizontalAlignment.Left}
			verticalAlignment={Enum.VerticalAlignment.Center}
			size={UDim2.fromScale(0, 1)}
			autoSize={Enum.AutomaticSize.XY}
			padding={new UDim(0, 12)}
		>
			<Stats.Root>
				<Stats.Item color={Color3.fromHex("fde9a4")}>
					<Stats.ItemIcon image={images.icons.coin} />
					<Stats.ItemText
						text="1,000,000"
						gradiant={{
							from: Color3.fromHex("FFDF37"),
							to: Color3.fromHex("F8610C"),
						}}
					/>
				</Stats.Item>
				<Stats.Item color={Color3.fromHex("95ccfe")}>
					<Stats.ItemIcon image={images.icons.star} />
					<Stats.ItemText
						text="1,000,000"
						gradiant={{
							from: Color3.fromHex("37E7FF"),
							to: Color3.fromHex("0C6AF8"),
						}}
					/>
				</Stats.Item>
				<UiScaleAspectRatio />
			</Stats.Root>

			<Grid
				fillDirection={Enum.FillDirection.Vertical}
				horizontalAlignment={Enum.HorizontalAlignment.Left}
				verticalAlignment={Enum.VerticalAlignment.Center}
				autoSize={Enum.AutomaticSize.XY}
				cellSize={UDim2.fromOffset(rem(6), rem(6))}
				cellPadding={UDim2.fromOffset(rem(1), rem(1))}
				rows={6}
				columns={2}
			>
				<SimpleButton color={Color3.fromHex("BF07FF")} icon={images.icons.daily_rewards} />
				<SimpleButton color={Color3.fromHex("BF07FF")} icon={images.icons.daily_rewards} />
				<SimpleButton color={Color3.fromHex("BF07FF")} icon={images.icons.daily_rewards} />
				<SimpleButton color={Color3.fromHex("BF07FF")} icon={images.icons.daily_rewards} />
				<UiScaleAspectRatio />
			</Grid>

			<uipadding PaddingLeft={new UDim(0, rem(1))} PaddingRight={new UDim(0, rem(2))} />
		</Stack>
	);
};
