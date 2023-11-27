import Roact, { FunctionComponent } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { Button } from "@/client/ui/components/button";
import { Frame } from "@/client/ui/components/frame";
import { Image } from "@/client/ui/components/image";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

type MenuProps = {
	onClick?: () => void;
};

export const Menu: FunctionComponent<MenuProps> = ({ onClick }) => {
	const rem = useRem();

	return (
		<Button size={UDim2.fromOffset(rem(2.5), rem(2.5))} backgroundTransparency={1} onClick={onClick}>
			<Frame
				size={UDim2.fromScale(1, 1)}
				backgroundColor={Color3.fromHex("#2F2B66")}
				cornerRadius={new UDim(0, rem(8, "pixel"))}
			>
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
		</Button>
	);
};
