import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { useRootSelector, useRootStore } from "@/client/store";
import { ContextMenu } from "@/client/ui/components/context-menu/context-menu";
import { usePlayerId } from "@/client/ui/hooks/use-player-id";
import { images } from "@/shared/assets/images";
import remotes from "@/shared/remotes";
import { selectPlayerFighter, selectPlayerFighters } from "@/shared/store/players/fighters";

export const InventoryContextMenu = () => {
	const userId = usePlayerId();

	const { setInventoryOpenedMenu } = useRootStore();
	const { openedContextMenu, menuPosition, selectedItem } = useRootSelector((state) => state.inventory);
	const playerFighters = useRootSelector(selectPlayerFighters(userId));
	const fighter = useSelectorCreator(selectPlayerFighter, userId, selectedItem ?? "");

	useEffect(() => {
		if (fighter) return;

		setInventoryOpenedMenu(false);
	}, [fighter, setInventoryOpenedMenu]);

	return (
		<ContextMenu.Root position={UDim2.fromOffset(menuPosition?.X, menuPosition?.Y ?? 0)} opened={openedContextMenu}>
			{playerFighters && playerFighters.actives.find((fighter) => fighter === selectedItem) ? (
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
				onClick={() => {
					print("Use");
				}}
			/>
			<ContextMenu.ButtonItem
				text="Sell"
				gradient={
					new ColorSequence([
						new ColorSequenceKeypoint(0, Color3.fromHex("#FFD600")),
						new ColorSequenceKeypoint(1, Color3.fromHex("#FF9900")),
					])
				}
				icon={images.icons.cash}
				onClick={() => {
					print("Sell");
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
