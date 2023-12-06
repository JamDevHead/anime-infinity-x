import { useMountEffect } from "@rbxts/pretty-react-hooks";
import Roact, { createContext, FunctionComponent, PropsWithChildren, useContext } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { fonts } from "@/client/constants/fonts";
import { springs } from "@/client/constants/springs";
import { Button } from "@/client/ui/components/button";
import { CanvasGroup } from "@/client/ui/components/canvas-group";
import { Frame } from "@/client/ui/components/frame";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { useMotion } from "@/client/ui/hooks/use-motion";
import { useRem } from "@/client/ui/hooks/use-rem";

type ActionButtonProps = {
	text: string;
	onClick?: () => void;
	size?: UDim2;
	preventClose?: boolean;
};

const PopupContext = createContext<{
	onClose?: () => void;
}>({});

const ActionButton: FunctionComponent<ActionButtonProps> = ({ text, onClick, preventClose, size }) => {
	const rem = useRem();
	const { onClose } = useContext(PopupContext);

	return (
		<Button
			autoSize="XY"
			backgroundColor={Color3.fromRGB(255, 255, 255)}
			onClick={() => {
				onClick?.();
				if (!preventClose) {
					onClose?.();
				}
			}}
			cornerRadius={new UDim(1, 0)}
			size={size}
		>
			<Text
				text={text}
				textSize={rem(16, "pixel")}
				textColor={colors.black}
				font={fonts.gotham.bold}
				textAutoResize="XY"
				size={UDim2.fromScale(1, 1)}
				textXAlignment={"Center"}
				textYAlignment={"Center"}
			/>
			<uipadding
				PaddingLeft={new UDim(0, rem(24, "pixel"))}
				PaddingRight={new UDim(0, rem(24, "pixel"))}
				PaddingTop={new UDim(0, rem(12, "pixel"))}
				PaddingBottom={new UDim(0, rem(12, "pixel"))}
			/>
		</Button>
	);
};

type ActionsProps = {
	padding?: UDim;
	margin?: UDim;
};

const Actions: FunctionComponent<PropsWithChildren<ActionsProps>> = ({ children, padding, margin }) => {
	return (
		<Stack
			fillDirection="Horizontal"
			verticalAlignment="Bottom"
			horizontalAlignment="Center"
			autoSize="XY"
			position={UDim2.fromScale(0.5, 0.5)}
			size={UDim2.fromScale(1, 1)}
			anchorPoint={new Vector2(0.5, 0.5)}
			backgroundTransparency={1}
			padding={padding ?? new UDim(0, 12)}
		>
			{children}
			<uipadding PaddingBottom={margin ?? new UDim(0, 0)} />
		</Stack>
	);
};

const Body: FunctionComponent<PropsWithChildren> = ({ children }) => {
	return (
		<Stack
			fillDirection="Vertical"
			verticalAlignment="Top"
			horizontalAlignment="Center"
			position={UDim2.fromScale(0.5, 0.5)}
			size={UDim2.fromScale(1, 1)}
			anchorPoint={new Vector2(0.5, 0.5)}
			backgroundTransparency={1}
			padding={new UDim(0, 12)}
		>
			{children}
			<uipadding PaddingBottom={new UDim(0, 16)} />
		</Stack>
	);
};

type TitleProps = {
	text: string;
	size?: UDim2;
	autoSize?: "X" | "Y" | "XY";
	wrapped?: boolean;
};

const Title: FunctionComponent<TitleProps> = ({ text, size, autoSize, wrapped }) => {
	const rem = useRem();

	return (
		<Text
			text={text}
			textColor={colors.white}
			font={fonts.gotham.bold}
			textSize={rem(24, "pixel")}
			textWrapped={wrapped ?? true}
			size={size ?? UDim2.fromScale(1, 0)}
			textAutoResize={autoSize ?? "XY"}
		/>
	);
};

type DescriptionProps = {
	text: string;
	size?: UDim2;
	autoSize?: "X" | "Y" | "XY";
	wrapped?: boolean;
};

const Description: FunctionComponent<DescriptionProps> = ({ text, size, autoSize, wrapped }) => {
	const rem = useRem();

	return (
		<Text
			text={text}
			textColor={colors.white}
			font={fonts.gotham.medium}
			textWrapped={wrapped ?? true}
			textSize={rem(16, "pixel")}
			size={size ?? UDim2.fromScale(1, 0)}
			textAutoResize={autoSize ?? "XY"}
		/>
	);
};

type RootProps = {
	size?: UDim2;
	color?: Color3;
	gradient?: ColorSequence;
	onClose?: () => void;
};

const Root: FunctionComponent<PropsWithChildren<RootProps>> = ({ children, size, color, gradient, onClose }) => {
	const rem = useRem();
	const [scale, setScale] = useMotion(0.1);
	const [animatedTransparency, setAnimatedTransparency] = useMotion(1);
	const [backdropTransparency, setBackdropTransparency] = useMotion(1);

	useMountEffect(() => {
		setAnimatedTransparency.spring(0);
		setBackdropTransparency.spring(0.5);
		setScale.spring(1, {
			...springs.responsive,
			damping: 1,
		});
	});

	return (
		<PopupContext.Provider
			value={{
				onClose: () => {
					setAnimatedTransparency.spring(1);
					setBackdropTransparency.spring(1);
					setScale.spring(0.1, springs.responsive);
					setScale.onComplete(() => {
						onClose?.();
					});
				},
			}}
		>
			<Button
				size={UDim2.fromScale(1, 1)}
				backgroundTransparency={backdropTransparency}
				backgroundColor={colors.black}
				zIndex={1}
				onClick={() => {
					setAnimatedTransparency.spring(1);
					setBackdropTransparency.spring(1);
					setScale.spring(0.1, springs.responsive);
					setScale.onComplete(() => {
						onClose?.();
					});
				}}
			/>
			<CanvasGroup
				position={UDim2.fromScale(0.5, 0.5)}
				anchorPoint={new Vector2(0.5, 0.5)}
				cornerRadius={new UDim(0, 12)}
				autoSize="XY"
				size={size}
				backgroundTransparency={1}
				groupTransparency={animatedTransparency}
				zIndex={2}
			>
				<Frame size={UDim2.fromScale(1, 1)} backgroundColor={color ?? !gradient ? colors.black : colors.white}>
					{children}

					{gradient && <uigradient Rotation={90} Color={gradient} />}

					<uipadding
						PaddingLeft={new UDim(0, rem(16, "pixel"))}
						PaddingRight={new UDim(0, rem(16, "pixel"))}
						PaddingTop={new UDim(0, rem(16, "pixel"))}
						PaddingBottom={new UDim(0, rem(16, "pixel"))}
					/>
				</Frame>
				<uiscale Scale={scale} />
			</CanvasGroup>
		</PopupContext.Provider>
	);
};

export const Popup = {
	Root,
	Body,
	Title,
	Description,
	ActionButton,
	Actions,
};
