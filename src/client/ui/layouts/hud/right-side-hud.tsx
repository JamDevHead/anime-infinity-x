import Roact from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { useRootSelector, useRootStore } from "@/client/store";
import { MissionHud } from "@/client/ui/components/mission-hud";
import { SideGroupButtons } from "@/client/ui/components/side-group-buttons";
import { SimpleButton } from "@/client/ui/components/simple-button";
import { Stack } from "@/client/ui/components/stack";
import { usePlayerId } from "@/client/ui/hooks/use-player-id";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";
import { selectPlayerMissions } from "@/shared/store/players";

export const RightSideHud = () => {
	const rem = useRem();
	const id = usePlayerId();

	const { missionVisible } = useRootSelector((state) => state.hud);
	const playerMissions = useRootSelector(selectPlayerMissions(id));

	const { toggleMissionVisible, toggleWindowVisible } = useRootStore();

	return (
		<Stack
			fillDirection={Enum.FillDirection.Vertical}
			horizontalAlignment={Enum.HorizontalAlignment.Right}
			verticalAlignment={Enum.VerticalAlignment.Center}
			size={UDim2.fromScale(1, 1)}
			autoSize={Enum.AutomaticSize.XY}
			padding={new UDim(0, rem(1))}
		>
			<MissionHud.Root>
				<MissionHud.CardRoot>
					<MissionHud.Dropdown onClick={() => toggleMissionVisible()} closed={missionVisible ?? false} />
					<MissionHud.Card>
						<MissionHud.MissionText
							text={`${playerMissions?.all
								.filter((mission) => mission.completed)
								.size()}/${playerMissions?.all.size()}`}
						/>
						<MissionHud.Title
							text={
								playerMissions?.all.filter((mission) => !mission.completed)[0]?.title ?? "No Missions"
							}
						/>
						<MissionHud.MissionIcon />
					</MissionHud.Card>
				</MissionHud.CardRoot>
				<MissionHud.List visible={missionVisible}>
					{playerMissions?.all.map((mission) => (
						<MissionHud.ListItem>
							<MissionHud.ListItemText text={mission.title} completed={mission.completed} />
							<MissionHud.ListCheckbox checked={mission.completed} />
						</MissionHud.ListItem>
					))}
				</MissionHud.List>
			</MissionHud.Root>
			<Stack
				fillDirection={Enum.FillDirection.Horizontal}
				horizontalAlignment={Enum.HorizontalAlignment.Right}
				verticalAlignment={Enum.VerticalAlignment.Center}
				sortOrder={Enum.SortOrder.Name}
				autoSize="XY"
			>
				<SideGroupButtons.Root>
					<SimpleButton color={Color3.fromHex("#BF07FF")} icon={images.icons.daily_rewards} />
					<SimpleButton
						color={Color3.fromHex("#076AFF")}
						icon={images.icons.book}
						onClick={() => toggleWindowVisible("teleport")}
					/>
					<SimpleButton color={Color3.fromHex("#16792C")} icon={images.icons.boost} />
					<SimpleButton
						color={Color3.fromHex("#07A6FF")}
						icon={images.icons.twitter}
						onClick={() => toggleWindowVisible("codes")}
					/>
					<SimpleButton
						color={colors.white}
						icon={images.icons.settings}
						onClick={() => toggleWindowVisible("settings")}
					/>
				</SideGroupButtons.Root>
			</Stack>

			<uipadding PaddingLeft={new UDim(0, rem(1))} PaddingRight={new UDim(0, rem(2))} />
		</Stack>
	);
};
