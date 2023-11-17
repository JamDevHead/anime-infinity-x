import Roact from "@rbxts/roact";
import { fonts } from "@/client/constants/fonts";
import { Button } from "@/client/ui/components/button";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { TextField } from "@/client/ui/components/text-field";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

export const Codes = () => {
	const rem = useRem();
	return (
		<Stack
			fillDirection="Vertical"
			verticalAlignment="Center"
			horizontalAlignment="Center"
			padding={new UDim(0, 12)}
			size={UDim2.fromScale(1, 1)}
		>
			<Text
				text="Follow our social medias for CODES and redeem for FREE items!"
				font={fonts.inter.bold}
				textSize={rem(24, "pixel")}
				textColor={Color3.fromRGB(255, 255, 255)}
				size={UDim2.fromScale(1, 0.2)}
				textWrapped
			/>
			<Stack
				fillDirection="Horizontal"
				verticalAlignment="Center"
				horizontalAlignment="Center"
				size={UDim2.fromScale(1, 0.15)}
			>
				<TextField
					placeholderText="Enter code here..."
					textSize={rem(24, "pixel")}
					font={fonts.inter.bold}
					textColor={Color3.fromRGB(255, 255, 255)}
					size={UDim2.fromScale(0.7, 1)}
					textWrapped
				>
					<Image image={images.ui.text_field} size={UDim2.fromScale(1, 1)} />
				</TextField>
				<Button size={UDim2.fromOffset(rem(100, "pixel"), rem(50, "pixel"))} backgroundTransparency={1}>
					<Image image={images.ui.confirm_button} size={UDim2.fromScale(1, 1)} />
				</Button>
			</Stack>
		</Stack>
	);
};
