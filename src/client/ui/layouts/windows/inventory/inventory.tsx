import Roact from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { Button } from "@/client/ui/components/button";
import { Frame } from "@/client/ui/components/frame";
import { Image } from "@/client/ui/components/image";
import { Menu } from "@/client/ui/components/menu";
import { SearchBar } from "@/client/ui/components/search-bar";
import { Stack } from "@/client/ui/components/stack";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

export const Inventory = () => {
	const rem = useRem();

	return (
		<Stack fillDirection="Vertical" size={UDim2.fromScale(1, 1)} padding={new UDim(0, 12)}>
			<Frame
				backgroundColor={colors.black}
				backgroundTransparency={0.5}
				size={new UDim2(1, 0, 0, rem(48, "pixel"))}
				cornerRadius={new UDim(0, 12)}
			>
				<Stack
					fillDirection="Horizontal"
					verticalAlignment="Center"
					size={UDim2.fromScale(1, 1)}
					padding={new UDim(0, 12)}
				>
					<Menu />
					<Button size={UDim2.fromOffset(rem(32, "pixel"), rem(32, "pixel"))} backgroundTransparency={1}>
						<Image image={images.icons.filter} size={UDim2.fromScale(1, 1)} />
					</Button>
					<SearchBar size={UDim2.fromScale(0.4, 1)} />
					<uipadding
						PaddingLeft={new UDim(0, rem(12, "pixel"))}
						PaddingRight={new UDim(0, rem(12, "pixel"))}
						PaddingTop={new UDim(0, rem(4, "pixel"))}
						PaddingBottom={new UDim(0, rem(4, "pixel"))}
					/>
				</Stack>
			</Frame>
			<Frame
				backgroundColor={colors.black}
				backgroundTransparency={0.5}
				size={new UDim2(1, 0, 1, -48)}
				cornerRadius={new UDim(0, 12)}
			></Frame>
			<uipadding
				PaddingLeft={new UDim(0, 12)}
				PaddingRight={new UDim(0, 12)}
				PaddingTop={new UDim(0, rem(42, "pixel"))}
				PaddingBottom={new UDim(0, 12)}
			/>
		</Stack>
	);
};
