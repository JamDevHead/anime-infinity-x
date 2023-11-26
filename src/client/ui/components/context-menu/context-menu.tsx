import Roact, { FunctionComponent, PropsWithChildren } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { Button } from "@/client/ui/components/button";
import { Frame } from "@/client/ui/components/frame";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { useRem } from "@/client/ui/hooks/use-rem";

type ItemProps = {
	size?: UDim2;
};

const Item: FunctionComponent<PropsWithChildren<ItemProps>> = ({ size, children }) => {
	const rem = useRem();

	return (
		<Frame
			size={size ?? UDim2.fromOffset(rem(216, "pixel"), rem(48, "pixel"))}
			backgroundTransparency={1}
			cornerRadius={new UDim(0, 12)}
		>
			{children}
		</Frame>
	);
};

type ButtonItemProps = ItemProps & {
	icon?: string;
	text?: string;
	onClick?: () => void;
	color?: Color3;
	gradient?: ColorSequence;
};

const ButtonItem: FunctionComponent<PropsWithChildren<ButtonItemProps>> = ({
	onClick,
	color,
	gradient,
	size,
	text,
	icon,
	children,
}) => {
	const rem = useRem();

	return (
		<Button
			size={size ?? UDim2.fromOffset(rem(216, "pixel"), rem(48, "pixel"))}
			backgroundTransparency={0}
			cornerRadius={new UDim(0, 12)}
			onClick={onClick}
			backgroundColor={color ? color : gradient ? colors.white : undefined}
		>
			<Frame
				size={UDim2.fromScale(1, 1)}
				backgroundColor={color ? color : gradient ? colors.white : undefined}
				cornerRadius={new UDim(0, 8)}
			>
				<Stack
					fillDirection="Horizontal"
					horizontalAlignment="Center"
					verticalAlignment="Center"
					size={UDim2.fromScale(1, 1)}
					padding={new UDim(0, rem(4, "pixel"))}
					sortOrder={Enum.SortOrder.LayoutOrder}
				>
					{icon !== undefined && (
						<Image
							image={icon}
							size={UDim2.fromOffset(rem(32, "pixel"), rem(32, "pixel"))}
							backgroundTransparency={1}
						/>
					)}
					<Text text={text} textColor={colors.white} textAutoResize={"XY"} backgroundTransparency={1} />
					{children}
				</Stack>
				<uigradient Color={gradient} Rotation={90} />
				<uistroke
					Thickness={rem(2, "pixel")}
					Color={colors.black}
					Transparency={0.85}
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				/>
			</Frame>
			<uipadding
				PaddingLeft={new UDim(0, rem(4, "pixel"))}
				PaddingRight={new UDim(0, rem(4, "pixel"))}
				PaddingTop={new UDim(0, rem(4, "pixel"))}
				PaddingBottom={new UDim(0, rem(4, "pixel"))}
			/>
			<uigradient Color={gradient} Rotation={90} />
		</Button>
	);
};

type ContextMenuProps = {
	opened?: boolean;
	position?: UDim2;
	size?: UDim2;
	autoSize?: "X" | "Y" | "XY";
	spacing?: number;
	padding?: number;
};

const Root: FunctionComponent<PropsWithChildren<ContextMenuProps>> = ({
	position,
	size,
	autoSize,
	opened,
	spacing,
	padding,
	children,
}) => {
	const rem = useRem();

	return (
		<Frame
			visible={opened}
			position={position}
			size={size}
			autoSize={autoSize ?? "XY"}
			backgroundColor={colors.black}
			cornerRadius={new UDim(0, rem(12, "pixel"))}
		>
			<Frame
				size={UDim2.fromScale(1, 1)}
				backgroundColor={colors.white}
				cornerRadius={new UDim(0, rem(8, "pixel"))}
			>
				<uigradient
					Color={
						new ColorSequence([
							new ColorSequenceKeypoint(0, Color3.fromHex("#232645")),
							new ColorSequenceKeypoint(1, Color3.fromHex("#12163F")),
						])
					}
					Rotation={90}
				/>
				<Stack
					fillDirection="Vertical"
					horizontalAlignment="Center"
					size={UDim2.fromScale(1, 1)}
					padding={new UDim(0, rem(spacing ?? 4, "pixel"))}
					sortOrder={Enum.SortOrder.LayoutOrder}
				>
					{children}
				</Stack>
				<uipadding
					PaddingLeft={new UDim(0, rem(padding ?? 4, "pixel"))}
					PaddingRight={new UDim(0, rem(padding ?? 4, "pixel"))}
					PaddingTop={new UDim(0, rem(padding ?? 4, "pixel"))}
					PaddingBottom={new UDim(0, rem(padding ?? 4, "pixel"))}
				/>
			</Frame>
			<uistroke
				Thickness={rem(2, "pixel")}
				Color={Color3.fromHex("#FF9900")}
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
			/>
			<uipadding
				PaddingLeft={new UDim(0, rem(4, "pixel"))}
				PaddingRight={new UDim(0, rem(4, "pixel"))}
				PaddingTop={new UDim(0, rem(4, "pixel"))}
				PaddingBottom={new UDim(0, rem(4, "pixel"))}
			/>
		</Frame>
	);
};

export const ContextMenu = {
	Root,
	Item,
	ButtonItem,
};
