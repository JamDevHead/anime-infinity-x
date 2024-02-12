import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact, { useEffect, useState } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { fonts } from "@/client/constants/fonts";
import { useRootSelector, useRootStore } from "@/client/store";
import { Button } from "@/client/ui/components/button";
import { ContextMenu } from "@/client/ui/components/context-menu/context-menu";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { TextField } from "@/client/ui/components/text-field";
import { useAbbreviator } from "@/client/ui/hooks/use-abbreviator";
import { usePlayerId } from "@/client/ui/hooks/use-player-id";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";
import remotes from "@/shared/remotes";
import { selectPlayerFighter, selectPlayerFighters } from "@/shared/store/players/fighters";

export const InventoryContextMenu = () => {
	const rem = useRem();
	const userId = usePlayerId();
	const abbreviator = useAbbreviator();

	const { setInventoryOpenedMenu } = useRootStore();
	const { openedContextMenu, menuPosition, selectedItem } = useRootSelector((state) => state.inventory);
	const playerFighters = useRootSelector(selectPlayerFighters(userId));
	const fighter = useSelectorCreator(selectPlayerFighter, userId, selectedItem ?? "");
	const [displayName, setDisplayName] = useState("");

	useEffect(() => {
		if (fighter || openedContextMenu) return;

		setInventoryOpenedMenu(false);
		setDisplayName("");
	}, [fighter, openedContextMenu, setInventoryOpenedMenu]);

	return (
		<ContextMenu.Root
			position={UDim2.fromOffset(menuPosition?.X, menuPosition?.Y ?? 0)}
			opened={openedContextMenu}
			onBackgroundClick={() => setInventoryOpenedMenu(false)}
		>
			<ContextMenu.Item>
				<TextField
					clipsDescendants
					placeholderText={fighter?.displayName ?? "Fighter"}
					clearTextOnFocus={false}
					font={fonts.fredokaOne.bold}
					textSize={rem(24, "pixel")}
					textColor={colors.white}
					size={UDim2.fromScale(1, 1)}
					text={displayName}
					change={{
						Text: ({ Text }) => {
							setDisplayName(Text.sub(1, 16));
						},
					}}
					event={{
						FocusLost: () => {
							if (!fighter) return;
							remotes.inventory.renameFighter.fire(fighter.uid, displayName);
							setInventoryOpenedMenu(false);
							setDisplayName("");
						},
					}}
				>
					<Button
						size={UDim2.fromOffset(rem(32, "pixel"), rem(32, "pixel"))}
						position={UDim2.fromScale(1, 0.5)}
						anchorPoint={new Vector2(1, 0.5)}
						backgroundTransparency={1}
						onClick={() => {
							if (!fighter) return;
							remotes.inventory.renameFighter.fire(fighter.uid, displayName);
							setInventoryOpenedMenu(false);
							setDisplayName("");
						}}
					>
						<Image
							image={images.icons.pencil}
							size={UDim2.fromScale(1, 1)}
							imageColor={colors.white}
							imageTransparency={displayName === "" ? 0.5 : 0}
						/>
					</Button>
				</TextField>
				<Image
					image={images.ui.separator}
					size={UDim2.fromScale(1, 0.3)}
					imageColor={colors.white}
					position={UDim2.fromScale(0, 1)}
				/>
			</ContextMenu.Item>
			<ContextMenu.Item>
				<Stack
					size={UDim2.fromScale(1, 1)}
					autoSize="XY"
					fillDirection="Horizontal"
					verticalAlignment="Center"
					horizontalAlignment="Center"
					padding={new UDim(0, rem(12, "pixel"))}
				>
					<Stack
						size={UDim2.fromScale(0.5, 1)}
						autoSize="XY"
						fillDirection="Horizontal"
						verticalAlignment="Center"
						clipsDescendants
						padding={new UDim(0, rem(12, "pixel"))}
					>
						<Image
							image={images.icons.sword}
							size={UDim2.fromOffset(rem(32, "pixel"), rem(32, "pixel"))}
							scaleType={"Fit"}
							imageColor={colors.white}
						/>
						<Text
							textColor={Color3.fromHex("#FFC700")}
							textSize={rem(24, "pixel")}
							text={`${abbreviator.numberToString(fighter?.stats.damage ?? 0)}`}
							font={fonts.fredokaOne.bold}
							textAutoResize="XY"
						/>
					</Stack>
					<Stack
						size={UDim2.fromScale(0.5, 1)}
						autoSize="XY"
						fillDirection="Horizontal"
						verticalAlignment="Center"
						clipsDescendants
						padding={new UDim(0, rem(12, "pixel"))}
					>
						<Image
							image={images.icons.star_rating}
							size={UDim2.fromOffset(rem(32, "pixel"), rem(32, "pixel"))}
							scaleType={"Fit"}
							imageColor={colors.white}
						/>
						<Text
							textColor={Color3.fromHex("#FFC700")}
							textSize={rem(24, "pixel")}
							text={`${abbreviator.numberToString(fighter?.stats.level ?? 0)}`}
							textAutoResize="XY"
							font={fonts.fredokaOne.bold}
						/>
					</Stack>
				</Stack>
				<uipadding
					PaddingLeft={new UDim(0, rem(12, "pixel"))}
					PaddingRight={new UDim(0, rem(12, "pixel"))}
					PaddingTop={new UDim(0, rem(12, "pixel"))}
					PaddingBottom={new UDim(0, rem(12, "pixel"))}
				/>
			</ContextMenu.Item>
			{playerFighters && playerFighters.actives.find(({ fighterId }) => fighterId === selectedItem) ? (
				<ContextMenu.ButtonItem
					text="Unequip"
					gradient={
						new ColorSequence([
							new ColorSequenceKeypoint(0, Color3.fromHex("#F31E85")),
							new ColorSequenceKeypoint(1, Color3.fromHex("#D32222")),
						])
					}
					icon={images.icons.sword}
					onClick={() => {
						if (!fighter) return;
						remotes.inventory.unequipFighter.fire(fighter.uid);
						setInventoryOpenedMenu(false);
					}}
				/>
			) : (
				<ContextMenu.ButtonItem
					text="Equip"
					gradient={
						new ColorSequence([
							new ColorSequenceKeypoint(0, Color3.fromHex("#0094FF")),
							new ColorSequenceKeypoint(1, Color3.fromHex("#0047FF")),
						])
					}
					icon={images.icons.sword}
					onClick={() => {
						if (!fighter) return;
						remotes.inventory.equipFighter.fire(fighter.uid);
						setInventoryOpenedMenu(false);
					}}
				/>
			)}
			<ContextMenu.ButtonItem
				text="Fuse"
				icon={images.icons.bolt}
				gradient={
					new ColorSequence([
						new ColorSequenceKeypoint(0, Color3.fromHex("#861CF0")),
						new ColorSequenceKeypoint(1, Color3.fromHex("#9909B2")),
					])
				}
			/>
			<ContextMenu.ButtonItem
				text={`Sell (${abbreviator.numberToString(fighter?.stats.sellPrice ?? 0, true)} yens)`}
				gradient={
					new ColorSequence([
						new ColorSequenceKeypoint(0, Color3.fromHex("#FFD600")),
						new ColorSequenceKeypoint(1, Color3.fromHex("#FF9900")),
					])
				}
				icon={images.icons.cash}
				onClick={() => {
					if (!fighter) return;
					remotes.inventory.sellFighter.fire(fighter.uid);
					setInventoryOpenedMenu(false);
				}}
			/>
			<ContextMenu.ButtonItem
				text="Cancel"
				gradient={
					new ColorSequence([
						new ColorSequenceKeypoint(0, Color3.fromHex("#D6195D")),
						new ColorSequenceKeypoint(1, Color3.fromHex("#8E130B")),
					])
				}
				icon={images.icons.arrow_left}
				onClick={() => {
					setInventoryOpenedMenu(false);
				}}
			/>
		</ContextMenu.Root>
	);
};
