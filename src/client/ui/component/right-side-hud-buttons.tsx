import Roact from "@rbxts/roact";
import { MissionHud } from "@/client/ui/component/mission-hud";
import { SideGroupButtons } from "@/client/ui/component/side-group-buttons";
import { SimpleButton } from "@/client/ui/component/simple-button";
import { Stack } from "@/client/ui/component/stack";
import { UiScaleAspectRatio } from "@/client/ui/component/ui-scale-aspect-ratio";
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
				fillDirection={Enum.FillDirection.Vertical}
				horizontalAlignment={Enum.HorizontalAlignment.Right}
				verticalAlignment={Enum.VerticalAlignment.Center}
				size={UDim2.fromScale(0, 1)}
				autoSize={Enum.AutomaticSize.XY}
				padding={new UDim(0, rem(1))}
			>
				<MissionHud.Root>
					<MissionHud.CardRoot>
						<MissionHud.Dropdown />
						<MissionHud.Card>
							<MissionHud.MissionText text="0/1" />
							<MissionHud.Title text="Mission Title" />
							<MissionHud.MissionIcon />
						</MissionHud.Card>
					</MissionHud.CardRoot>
					<MissionHud.List>
						<MissionHud.ListItem>
							<MissionHud.ListItemText text="Mission" />
							<MissionHud.ListCheckbox checked={true} />
						</MissionHud.ListItem>
						<MissionHud.ListItem>
							<MissionHud.ListItemText text="Mission" />
							<MissionHud.ListCheckbox />
						</MissionHud.ListItem>
						<MissionHud.ListItem>
							<MissionHud.ListItemText text="Mission" />
							<MissionHud.ListCheckbox />
						</MissionHud.ListItem>
						<MissionHud.ListItem>
							<MissionHud.ListItemText text="Mission" />
							<MissionHud.ListCheckbox />
						</MissionHud.ListItem>
					</MissionHud.List>
					<UiScaleAspectRatio factor={1} />
				</MissionHud.Root>
				<Stack
					fillDirection={Enum.FillDirection.Horizontal}
					horizontalAlignment={Enum.HorizontalAlignment.Right}
					verticalAlignment={Enum.VerticalAlignment.Center}
					autoSize={Enum.AutomaticSize.XY}
					sortOrder={Enum.SortOrder.Name}
				>
					<SideGroupButtons.Root>
						<SimpleButton color={Color3.fromHex("BF07FF")} icon={images.icons.daily_rewards} />
						<SimpleButton color={Color3.fromHex("076AFF")} icon={images.icons.inventory} />
						<SimpleButton color={Color3.fromHex("16792C")} icon={images.icons.boost} />
						<SimpleButton color={Color3.fromHex("07A6FF")} icon={images.icons.twitter} />
						<SimpleButton color={new Color3(1, 1, 1)} icon={images.icons.settings} />
					</SideGroupButtons.Root>
					<UiScaleAspectRatio />
				</Stack>

				<uipadding PaddingLeft={new UDim(0, rem(1))} PaddingRight={new UDim(0, rem(2))} />
			</Stack>
		</Stack>
	);
};
