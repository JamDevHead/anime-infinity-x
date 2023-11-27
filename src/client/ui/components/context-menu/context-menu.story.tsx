import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { ContextMenu } from "@/client/ui/components/context-menu/context-menu";
import { Text } from "@/client/ui/components/text";
import { images } from "@/shared/assets/images";

export = hoarcekat(() => {
	return (
		<ContextMenu.Root position={UDim2.fromScale(0.5, 0.5)}>
			<ContextMenu.Item>
				<Text text={"Hello, world!"} textColor={colors.white} size={UDim2.fromScale(1, 1)} />
			</ContextMenu.Item>
			<ContextMenu.ButtonItem
				icon={images.icons.sword}
				text={"Hello, world!"}
				gradient={
					new ColorSequence([
						new ColorSequenceKeypoint(0, Color3.fromHex("#0094FF")),
						new ColorSequenceKeypoint(1, Color3.fromHex("#0047FF")),
					])
				}
			/>
			<ContextMenu.ButtonItem color={colors.black} icon={images.icons.sword} text={"Hello, world!"} />
		</ContextMenu.Root>
	);
});
