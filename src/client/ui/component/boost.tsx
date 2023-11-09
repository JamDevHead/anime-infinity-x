import Roact, { FunctionComponent, PropsWithChildren } from "@rbxts/roact";
import { fonts } from "@/client/constants/fonts";
import { Frame } from "@/client/ui/component/frame";
import { Image } from "@/client/ui/component/image";
import { Text } from "@/client/ui/component/text";
import { useRem } from "@/client/ui/hooks/use-rem";

interface DescriptionProps extends PropsWithChildren {
	description: string;
}

const Description: FunctionComponent<DescriptionProps> = ({ description }) => {
	const rem = useRem();
	return (
		<Text
			text={description}
			font={fonts.inter.bold}
			size={UDim2.fromScale(1, 1)}
			textYAlignment="Bottom"
			textSize={rem(2)}
			textColor={Color3.fromHex("0A12CD")}
		>
			<uistroke Thickness={rem(0.2)} Color={new Color3(1, 1, 1)} />
		</Text>
	);
};

interface IconProps extends PropsWithChildren {
	image: string;
}

const Icon: FunctionComponent<IconProps> = ({ image, children }) => {
	return (
		<Image image={image} size={UDim2.fromScale(1, 1)}>
			{children}
		</Image>
	);
};

const Root: FunctionComponent<PropsWithChildren> = ({ children }) => {
	return (
		<Frame size={UDim2.fromOffset(64, 64)} backgroundTransparency={1} anchorPoint={new Vector2(0.5, 0.5)}>
			{children}
		</Frame>
	);
};

export const Boost = {
	Root,
	Icon,
	Description,
};
