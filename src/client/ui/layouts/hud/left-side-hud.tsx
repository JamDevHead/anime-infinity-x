import Roact from "@rbxts/roact";
import { useRootSelector, useRootStore } from "@/client/store";
import { Grid } from "@/client/ui/components/grid";
import { SimpleButton } from "@/client/ui/components/simple-button";
import { Stack } from "@/client/ui/components/stack";
import { Stats } from "@/client/ui/components/stats";
import { UiScaleAspectRatio } from "@/client/ui/components/ui-scale-aspect-ratio";
import { useAbbreviator } from "@/client/ui/hooks/use-abbreviator";
import { usePlayerId } from "@/client/ui/hooks/use-player-id";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";
import { selectPlayerBalance } from "@/shared/store/players";

export const LeftSideHud = () => {
	const rem = useRem();
	const id = usePlayerId();
	const abbreviator = useAbbreviator({});

	const balance = useRootSelector(selectPlayerBalance(id));

	const { toggleWindowVisible } = useRootStore();

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
						text={abbreviator.numberToString(balance?.coins ?? 0)}
						gradiant={{
							from: Color3.fromHex("FFDF37"),
							to: Color3.fromHex("F8610C"),
						}}
					/>
				</Stats.Item>
				<Stats.Item color={Color3.fromHex("95ccfe")}>
					<Stats.ItemIcon image={images.icons.star} />
					<Stats.ItemText
						text={abbreviator.numberToString(balance?.stars ?? 0)}
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
				<SimpleButton
					color={Color3.fromHex("#68CA58")}
					icon={images.icons.store}
					onClick={() => toggleWindowVisible("shop")}
				/>
				<SimpleButton color={Color3.fromHex("#ff0000")} icon={images.icons.gift} />
				<SimpleButton
					color={Color3.fromHex("#E5E923")}
					icon={images.icons.characters}
					onClick={() => toggleWindowVisible("inventory")}
				/>
				<SimpleButton color={Color3.fromHex("#c7480e")} icon={images.icons.inventory} />
				<UiScaleAspectRatio />
			</Grid>

			<uipadding PaddingLeft={new UDim(0, rem(1))} PaddingRight={new UDim(0, rem(2))} />
		</Stack>
	);
};
