import Roact, { FunctionComponent } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { fonts } from "@/client/constants/fonts";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

type InventoryStatusProps = {
	storage: number;
	fighters: number;
	maxStorage: number;
	maxFighters: number;
};

export const InventoryStatus: FunctionComponent<InventoryStatusProps> = ({
	storage,
	fighters,
	maxStorage,
	maxFighters,
}) => {
	const rem = useRem();

	return (
		<Stack
			fillDirection="Horizontal"
			verticalAlignment="Center"
			autoSize={Enum.AutomaticSize.XY}
			padding={new UDim(0, rem(32, "pixel"))}
			sortOrder={Enum.SortOrder.LayoutOrder}
		>
			<Stack
				fillDirection="Horizontal"
				verticalAlignment="Center"
				autoSize={Enum.AutomaticSize.XY}
				padding={new UDim(0, rem(32, "pixel"))}
				sortOrder={Enum.SortOrder.LayoutOrder}
			>
				<Image image={images.icons.backpack} size={UDim2.fromOffset(rem(48, "pixel"), rem(48, "pixel"))} />
				<Text
					text={`${storage}/${maxStorage}`}
					textSize={rem(24, "pixel")}
					font={fonts.gotham.bold}
					autoSize={Enum.AutomaticSize.XY}
					textColor={colors.white}
				/>
			</Stack>
			<Stack
				fillDirection="Horizontal"
				verticalAlignment="Center"
				autoSize={Enum.AutomaticSize.XY}
				padding={new UDim(0, rem(24, "pixel"))}
				sortOrder={Enum.SortOrder.LayoutOrder}
			>
				<Image image={images.icons.sword} size={UDim2.fromOffset(rem(32, "pixel"), rem(32, "pixel"))} />
				<Text
					text={`${fighters}/${maxFighters}`}
					textSize={rem(24, "pixel")}
					font={fonts.gotham.bold}
					autoSize={Enum.AutomaticSize.XY}
					textColor={colors.white}
				/>
			</Stack>
		</Stack>
	);
};
