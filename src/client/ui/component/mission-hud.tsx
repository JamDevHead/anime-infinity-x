import Roact, { FunctionComponent, PropsWithChildren } from "@rbxts/roact";
import { fonts } from "@/client/constants/fonts";
import { FadingFrame } from "@/client/ui/component/fading-frame";
import { Image } from "@/client/ui/component/image";
import { Stack } from "@/client/ui/component/stack";
import { Text } from "@/client/ui/component/text";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

type TitleProps = {
	text: string;
};

const Title: FunctionComponent<TitleProps> = ({ text }) => {
	const rem = useRem();

	return (
		<Text
			font={fonts.inter.bold}
			text={text}
			textSize={rem(2)}
			textAutoResize="XY"
			textXAlignment="Center"
			textYAlignment="Center"
			textColor={new Color3(1, 1, 1)}
		>
			<uistroke Color={new Color3(0, 0, 0)} Transparency={0.5} Thickness={rem(0.1)} />
			<uipadding PaddingLeft={new UDim(0, rem(3))} />
		</Text>
	);
};

type MissionTextProps = {
	text: string;
};

const MissionText: FunctionComponent<MissionTextProps> = ({ text }) => {
	const rem = useRem();

	return (
		<Text font={fonts.inter.bold} text={text} textSize={rem(2)} textAutoResize="XY" textColor={new Color3(1, 1, 1)}>
			<uigradient
				Color={
					new ColorSequence([
						new ColorSequenceKeypoint(0, Color3.fromHex("FF9900")),
						new ColorSequenceKeypoint(1, Color3.fromHex("FFD600")),
					])
				}
				Rotation={90}
			/>
			<uistroke Color={new Color3(0, 0, 0)} Transparency={0.5} Thickness={rem(0.1)} />
		</Text>
	);
};

const MissionIcon: FunctionComponent = () => {
	const rem = useRem();

	return <Image image={images.icons.mission} size={UDim2.fromOffset(rem(32, "pixel"), rem(32, "pixel"))} />;
};

const Dropdown: FunctionComponent = () => {
	const rem = useRem();

	return <Image image={images.ui.hud_arrow} size={UDim2.fromOffset(rem(32, "pixel"), rem(32, "pixel"))} />;
};

const Card: FunctionComponent<PropsWithChildren> = ({ children }) => {
	const rem = useRem();

	return (
		<Stack
			fillDirection={Enum.FillDirection.Vertical}
			autoSize={Enum.AutomaticSize.XY}
			padding={new UDim(0, rem(1))}
		>
			<FadingFrame autoSize={Enum.AutomaticSize.XY}>
				<Stack
					fillDirection={Enum.FillDirection.Horizontal}
					autoSize={Enum.AutomaticSize.XY}
					padding={new UDim(0, rem(1))}
				>
					{children}
					<uipadding
						PaddingLeft={new UDim(0, rem(1))}
						PaddingRight={new UDim(0, rem(1))}
						PaddingTop={new UDim(0, rem(1))}
						PaddingBottom={new UDim(0, rem(1))}
					/>
				</Stack>
			</FadingFrame>
		</Stack>
	);
};

const CardRoot: FunctionComponent<PropsWithChildren> = ({ children }) => {
	return (
		<Stack
			fillDirection={Enum.FillDirection.Horizontal}
			horizontalAlignment={Enum.HorizontalAlignment.Right}
			verticalAlignment={Enum.VerticalAlignment.Center}
			autoSize={Enum.AutomaticSize.XY}
			padding={new UDim(0, 8)}
		>
			{children}
		</Stack>
	);
};

const ListItem: FunctionComponent<PropsWithChildren> = ({ children }) => {
	const rem = useRem();

	return (
		<Stack
			fillDirection={Enum.FillDirection.Horizontal}
			horizontalAlignment={Enum.HorizontalAlignment.Right}
			verticalAlignment={Enum.VerticalAlignment.Center}
			autoSize={Enum.AutomaticSize.Y}
			size={UDim2.fromScale(0.3, 0)}
			padding={new UDim(0, rem(1))}
		>
			{children}
		</Stack>
	);
};

type ListItemTextProps = {
	text: string;
};

const ListItemText: FunctionComponent<ListItemTextProps> = ({ text }) => {
	const rem = useRem();

	return (
		<Text
			font={fonts.inter.bold}
			text={text}
			textSize={rem(2)}
			textAutoResize="XY"
			textWrapped={true}
			textXAlignment="Right"
			size={UDim2.fromScale(1, 0)}
			textColor={new Color3(1, 1, 1)}
		>
			<uistroke Color={new Color3(0, 0, 0)} Transparency={0.5} Thickness={rem(0.1)} />
		</Text>
	);
};

type ListCheckboxProps = {
	checked?: boolean;
};

const ListCheckbox: FunctionComponent<ListCheckboxProps> = ({ checked }) => {
	const rem = useRem();

	return (
		<Image
			image={checked ? images.icons.fish : images.icons.twitter}
			size={UDim2.fromOffset(rem(32, "pixel"), rem(32, "pixel"))}
		/>
	);
};

const List: FunctionComponent<PropsWithChildren> = ({ children }) => {
	const rem = useRem();

	return (
		<Stack
			fillDirection={Enum.FillDirection.Vertical}
			horizontalAlignment={Enum.HorizontalAlignment.Right}
			autoSize={Enum.AutomaticSize.XY}
			padding={new UDim(0, rem(1))}
		>
			{children}
			<uipadding PaddingLeft={new UDim(0, rem(1))} PaddingRight={new UDim(0, rem(1))} />
		</Stack>
	);
};

const Root: FunctionComponent<PropsWithChildren> = ({ children }) => {
	const rem = useRem();

	return (
		<Stack
			fillDirection={Enum.FillDirection.Vertical}
			horizontalAlignment={Enum.HorizontalAlignment.Right}
			verticalAlignment={Enum.VerticalAlignment.Center}
			autoSize={Enum.AutomaticSize.XY}
			padding={new UDim(0, rem(1))}
		>
			{children}
		</Stack>
	);
};

export const MissionHud = {
	Root,
	Title,
	Dropdown,
	Card,
	CardRoot,
	MissionIcon,
	MissionText,
	List,
	ListItem,
	ListItemText,
	ListCheckbox,
};
