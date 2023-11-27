import Roact from "@rbxts/roact";
import { useRootSelector, useRootStore } from "@/client/store";
import { ContextMenu } from "@/client/ui/components/context-menu/context-menu";
import { images } from "@/shared/assets/images";

export const InventoryContextMenu = () => {
	const { setInventoryOpenedMenu } = useRootStore();
	const { openedContextMenu, menuPosition } = useRootSelector((state) => state.inventory);

	return (
		<ContextMenu.Root position={UDim2.fromOffset(menuPosition?.X, menuPosition?.Y ?? 0)} opened={openedContextMenu}>
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
					print("Set as Active");
				}}
			/>
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
