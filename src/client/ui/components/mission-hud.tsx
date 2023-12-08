import Roact, { FunctionComponent, PropsWithChildren, useEffect, useRef } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { fonts } from "@/client/constants/fonts";
import { springs } from "@/client/constants/springs";
import { Button } from "@/client/ui/components/button";
import { Checkbox } from "@/client/ui/components/checkbox";
import { FadingFrame } from "@/client/ui/components/fading-frame";
import { Frame } from "@/client/ui/components/frame";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { useMotion } from "@/client/ui/hooks/use-motion";
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

type DropdownProps = {
	onClick?: () => void;
	closed?: boolean;
};

const Dropdown: FunctionComponent<DropdownProps> = ({ onClick, closed }) => {
	const rem = useRem();
	const [rotation, setRotation] = useMotion(0);

	useEffect(() => {
		setRotation.spring(closed ? 90 : 0, springs.responsive);
	}, [closed, setRotation]);

	return (
		<Button
			size={UDim2.fromOffset(rem(32, "pixel"), rem(32, "pixel"))}
			backgroundTransparency={1}
			onClick={onClick}
		>
			<Image image={images.ui.hud_arrow} size={UDim2.fromScale(1, 1)} rotation={rotation} />
		</Button>
	);
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
	const rem = useRem();

	return (
		<Stack
			fillDirection={Enum.FillDirection.Horizontal}
			horizontalAlignment={Enum.HorizontalAlignment.Right}
			verticalAlignment={Enum.VerticalAlignment.Center}
			autoSize={Enum.AutomaticSize.XY}
			padding={new UDim(0, rem(8, "pixel"))}
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
	completed?: boolean;
};

const ListItemText: FunctionComponent<ListItemTextProps> = ({ text, completed }) => {
	const rem = useRem();
	const [completedSize, setCompletedSizeMotion] = useMotion(0);

	useEffect(() => {
		setCompletedSizeMotion.spring(completed ? 1 : 0, springs.responsive);
	}, [completed, setCompletedSizeMotion]);

	return (
		<Text
			font={fonts.inter.bold}
			text={text}
			textSize={rem(2)}
			textAutoResize="XY"
			textWrapped={true}
			textXAlignment="Right"
			textColor={new Color3(1, 1, 1)}
		>
			<uistroke Color={new Color3(0, 0, 0)} Transparency={0.5} Thickness={rem(0.1)} />
			<Frame
				size={UDim2.fromScale(completedSize.getValue(), 0.1)}
				backgroundColor={colors.white}
				position={UDim2.fromScale(0, 0.5)}
			/>
		</Text>
	);
};

type ListCheckboxProps = {
	checked?: boolean;
};

const ListCheckbox: FunctionComponent<ListCheckboxProps> = ({ checked }) => {
	return <Checkbox checked={checked} disabled />;
};

type ListProps = {
	visible?: boolean;
};

const List: FunctionComponent<PropsWithChildren<ListProps>> = ({ children, visible }) => {
	const ref = useRef<Frame>();
	const rem = useRem();
	const [size, setSize] = useMotion(new UDim2());

	useEffect(() => {
		if (!ref.current) return;

		let height = 0;
		for (const child of ref.current.GetChildren() as Array<Frame>) {
			if (!child.IsA("Frame")) continue;

			height += child.AbsoluteSize.Y + rem(1);
		}

		setSize.spring(visible ? UDim2.fromOffset(0, height) : UDim2.fromOffset(0, 0));

		const connectionChildrenChanged = ref.current?.ChildAdded.Connect((child) => {
			if (!child.IsA("Frame")) return;

			height += child.AbsoluteSize.Y + rem(1);

			setSize.spring(visible ? UDim2.fromOffset(0, height) : UDim2.fromOffset(0, 0));
		});

		const connectionChildrenRemoved = ref.current?.ChildRemoved.Connect((child) => {
			if (!child.IsA("Frame")) return;

			height -= child.AbsoluteSize.Y + rem(1);

			setSize.spring(visible ? UDim2.fromOffset(0, height) : UDim2.fromOffset(0, 0));
		});

		return () => {
			connectionChildrenChanged?.Disconnect();
			connectionChildrenRemoved?.Disconnect();
		};
	}, [ref, rem, setSize, visible]);

	return (
		<Stack
			ref={ref}
			fillDirection={Enum.FillDirection.Vertical}
			horizontalAlignment={Enum.HorizontalAlignment.Right}
			padding={new UDim(0, rem(1))}
			size={size}
			autoSize="X"
			clipsDescendants
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
