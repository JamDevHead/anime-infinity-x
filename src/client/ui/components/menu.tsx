import Roact from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { Frame } from "@/client/ui/components/frame";
import { Image } from "@/client/ui/components/image";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

export const Menu = () => {
	const rem = useRem();

	return (
		<Frame size={new UDim2(0, 32, 1, 0)} backgroundColor={Color3.fromHex("#2F2B66")} cornerRadius={new UDim(0, 8)}>
			<Frame
				size={UDim2.fromScale(1, 1)}
				backgroundColor={Color3.fromHex("#2F2B66")}
				cornerRadius={new UDim(0, 4)}
			>
				<Image image={images.icons.quad_menu} size={UDim2.fromScale(1, 1)} />
				<uipadding
					PaddingLeft={new UDim(0, rem(4, "pixel"))}
					PaddingRight={new UDim(0, rem(4, "pixel"))}
					PaddingTop={new UDim(0, rem(4, "pixel"))}
					PaddingBottom={new UDim(0, rem(4, "pixel"))}
				/>
				<uistroke Thickness={2} Transparency={0.5} Color={colors.black} />
			</Frame>

			<uipadding
				PaddingLeft={new UDim(0, rem(4, "pixel"))}
				PaddingRight={new UDim(0, rem(4, "pixel"))}
				PaddingTop={new UDim(0, rem(4, "pixel"))}
				PaddingBottom={new UDim(0, rem(4, "pixel"))}
			/>
		</Frame>
	);
};
