import Roact, { FunctionComponent, PropsWithChildren } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { Frame } from "@/client/ui/components/frame";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { TextField } from "@/client/ui/components/text-field";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

type SearchBarProps = {
	size?: UDim2;
	position?: UDim2;
};

export const SearchBar: FunctionComponent<PropsWithChildren<SearchBarProps>> = ({ size, position }) => {
	const rem = useRem();

	return (
		<Frame
			size={size ?? new UDim2(1, 0, 0, 48)}
			position={position}
			backgroundColor={colors.black}
			backgroundTransparency={0.5}
			cornerRadius={new UDim(0, 12)}
			visible
		>
			<Stack
				fillDirection="Horizontal"
				verticalAlignment="Center"
				size={UDim2.fromScale(1, 1)}
				padding={new UDim(0, 12)}
			>
				<Image
					image={images.icons.search}
					imageTransparency={0.5}
					size={UDim2.fromOffset(rem(24, "pixel"), rem(24, "pixel"))}
				/>
				<TextField
					placeholderText="Search"
					textColor={colors.white}
					size={new UDim2(1, 0, 1, 0)}
					textSize={rem(24, "pixel")}
					textXAlignment="Left"
				/>
				<uipadding
					PaddingLeft={new UDim(0, 12)}
					PaddingRight={new UDim(0, 12)}
					PaddingTop={new UDim(0, 12)}
					PaddingBottom={new UDim(0, 12)}
				/>
			</Stack>
		</Frame>
	);
};
