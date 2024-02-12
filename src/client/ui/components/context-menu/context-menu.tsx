import Roact, { FunctionComponent, PropsWithChildren, useEffect, useState } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { fonts } from "@/client/constants/fonts";
import { springs } from "@/client/constants/springs";
import { Button } from "@/client/ui/components/button";
import { Frame } from "@/client/ui/components/frame";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { useMotion } from "@/client/ui/hooks/use-motion";
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
	const [sizeMotion, setSizeMotion] = useMotion(size ?? UDim2.fromOffset(rem(216, "pixel"), rem(38, "pixel")));

	return (
		<Button
			size={sizeMotion}
			backgroundTransparency={0}
			cornerRadius={new UDim(0, 8)}
			backgroundColor={color ? color : gradient ? colors.white : undefined}
			onClick={() => {
				onClick?.();
				task.spawn(() => {
					setSizeMotion.spring(
						UDim2.fromOffset(
							sizeMotion.getValue().X.Offset - rem(12, "pixel"),
							sizeMotion.getValue().Y.Offset - rem(12, "pixel"),
						),
						springs.responsive,
					);
					task.wait(0.1);
					setSizeMotion.spring(
						size ?? UDim2.fromOffset(rem(216, "pixel"), rem(38, "pixel")),
						springs.responsive,
					);
				});
			}}
		>
			<Frame
				size={UDim2.fromScale(1, 1)}
				backgroundColor={color ? color : gradient ? colors.white : undefined}
				cornerRadius={new UDim(0, 4)}
			>
				{icon !== undefined && (
					<Image
						image={icon}
						position={UDim2.fromScale(0.2, 0.5)}
						anchorPoint={new Vector2(0.5, 0.5)}
						size={UDim2.fromOffset(rem(24, "pixel"), rem(24, "pixel"))}
						backgroundTransparency={1}
					/>
				)}
				<Stack
					fillDirection="Horizontal"
					horizontalAlignment="Center"
					verticalAlignment="Center"
					size={UDim2.fromScale(1, 1)}
					padding={new UDim(0, rem(4, "pixel"))}
					sortOrder={Enum.SortOrder.LayoutOrder}
				>
					<Text
						text={text}
						font={fonts.inter.bold}
						textSize={rem(18, "pixel")}
						textColor={colors.white}
						textAutoResize={"XY"}
						backgroundTransparency={1}
					/>
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
	onBackgroundClick?: () => void;
};

const Root: FunctionComponent<PropsWithChildren<ContextMenuProps>> = ({
	position,
	size,
	autoSize,
	opened,
	spacing,
	padding,
	children,
	onBackgroundClick,
}) => {
	const rem = useRem();
	const [openedMotion, setOpenedMotion] = useMotion(0);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setOpenedMotion.tween(opened ? 1 : 0, {
			style: Enum.EasingStyle.Quint,
			direction: Enum.EasingDirection.Out,
			time: 0.6,
		});

		setOpenedMotion.onStep((value) => {
			setIsVisible(value > 0.5);
		});
	}, [opened, setOpenedMotion]);

	return (
		<Button size={UDim2.fromScale(1, 1)} backgroundTransparency={1} visible={isVisible} onClick={onBackgroundClick}>
			<Frame
				position={position}
				size={size}
				autoSize={autoSize ?? "XY"}
				backgroundColor={colors.black}
				cornerRadius={new UDim(0, rem(12, "pixel"))}
			>
				<uiscale Scale={openedMotion} />
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
		</Button>
	);
};

export const ContextMenu = {
	Root,
	Item,
	ButtonItem,
};
