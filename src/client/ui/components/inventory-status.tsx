import Roact from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { fonts } from "@/client/constants/fonts";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { images } from "@/shared/assets/images";

export const InventoryStatus = () => {
	return (
		<Stack
			fillDirection="Horizontal"
			verticalAlignment="Center"
			autoSize={Enum.AutomaticSize.XY}
			padding={new UDim(0, 24)}
			sortOrder={Enum.SortOrder.LayoutOrder}
		>
			<Stack
				fillDirection="Horizontal"
				verticalAlignment="Center"
				autoSize={Enum.AutomaticSize.XY}
				padding={new UDim(0, 24)}
				sortOrder={Enum.SortOrder.LayoutOrder}
			>
				<Image image={images.icons.backpack} size={UDim2.fromOffset(32, 32)} />
				<Text
					text="0/100"
					textSize={14}
					font={fonts.gotham.bold}
					autoSize={Enum.AutomaticSize.XY}
					textColor={colors.white}
				/>
			</Stack>
			<Stack
				fillDirection="Horizontal"
				verticalAlignment="Center"
				autoSize={Enum.AutomaticSize.XY}
				padding={new UDim(0, 24)}
				sortOrder={Enum.SortOrder.LayoutOrder}
			>
				<Image image={images.icons.sword} size={UDim2.fromOffset(32, 32)} />
				<Text
					text="0/100"
					textSize={14}
					font={fonts.gotham.bold}
					autoSize={Enum.AutomaticSize.XY}
					textColor={colors.white}
				/>
			</Stack>
		</Stack>
	);
};
