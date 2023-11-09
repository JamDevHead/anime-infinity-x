import Roact, { FunctionComponent, PropsWithChildren } from "@rbxts/roact";
import { fonts } from "@/client/constants/fonts";
import { Image } from "@/client/ui/component/image";
import { Stack } from "@/client/ui/component/stack";
import { Text } from "@/client/ui/component/text";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

type ItemProps = {
	color?: Color3;
	image?: string;
};

const Item: FunctionComponent<PropsWithChildren<ItemProps>> = ({ children, color, image }) => {
	const rem = useRem();
	return (
		<Stack fillDirection={Enum.FillDirection.Horizontal} autoSize={Enum.AutomaticSize.XY}>
			<Image
				imageColor={color}
				image={image === undefined ? images.ui.stats_bar_base : image}
				size={UDim2.fromOffset(rem(297, "pixel"), rem(82, "pixel"))}
			>
				{children}
			</Image>
		</Stack>
	);
};

type ItemIconProps = {
	image: string;
};

const ItemIcon: FunctionComponent<ItemIconProps> = ({ image }) => {
	const rem = useRem();
	return (
		<Image
			image={image}
			size={UDim2.fromOffset(rem(124, "pixel"), rem(124, "pixel"))}
			position={UDim2.fromOffset(rem(-32, "pixel"), rem(-24, "pixel"))}
		/>
	);
};

type ItemTextProps = {
	text: string;
	gradiant?: {
		from: Color3;
		to: Color3;
	};
};

const ItemText: FunctionComponent<ItemTextProps> = ({ text, gradiant }) => {
	const rem = useRem();
	return (
		<Text
			font={fonts.inter.bold}
			text={text}
			size={UDim2.fromScale(0.8, 1)}
			position={UDim2.fromScale(1, 0.5)}
			anchorPoint={new Vector2(1, 0.5)}
			textXAlignment="Center"
			textSize={rem(2)}
			textWrapped={true}
			textColor={new Color3(1, 1, 1)}
		>
			<uigradient
				Color={
					new ColorSequence([
						new ColorSequenceKeypoint(0, gradiant?.from || Color3.fromHex("FF9900")),
						new ColorSequenceKeypoint(1, gradiant?.to || Color3.fromHex("FFD600")),
					])
				}
				Rotation={90}
			/>
			<uistroke Color={new Color3(0, 0, 0)} Thickness={rem(0.15)} />
		</Text>
	);
};

const Root: FunctionComponent<PropsWithChildren> = ({ children }) => {
	return (
		<Stack
			fillDirection={Enum.FillDirection.Vertical}
			horizontalAlignment={Enum.HorizontalAlignment.Left}
			verticalAlignment={Enum.VerticalAlignment.Center}
			autoSize={Enum.AutomaticSize.XY}
		>
			{children}
		</Stack>
	);
};

export const Stats = {
	Root,
	Item,
	ItemIcon,
	ItemText,
};
