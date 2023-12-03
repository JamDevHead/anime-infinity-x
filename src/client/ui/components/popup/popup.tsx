import { useMountEffect } from "@rbxts/pretty-react-hooks";
import Roact, { FunctionComponent, PropsWithChildren } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { fonts } from "@/client/constants/fonts";
import { springs } from "@/client/constants/springs";
import { Button } from "@/client/ui/components/button";
import { CanvasGroup } from "@/client/ui/components/canvas-group";
import { Frame } from "@/client/ui/components/frame";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { useMotion } from "@/client/ui/hooks/use-motion";

type ActionButtonProps = {
	text: string;
	onClick?: () => void;
	size?: UDim2;
};

const ActionButton: FunctionComponent<ActionButtonProps> = ({ text, onClick, size }) => {
	return (
		<Button
			autoSize="XY"
			backgroundColor={Color3.fromRGB(255, 255, 255)}
			onClick={onClick}
			cornerRadius={new UDim(1, 0)}
			size={size}
		>
			<Text text={text} textSize={12} textColor={colors.black} font={fonts.gotham.bold} textAutoResize="XY" />
			<uipadding
				PaddingLeft={new UDim(0, 16)}
				PaddingRight={new UDim(0, 16)}
				PaddingTop={new UDim(0, 12)}
				PaddingBottom={new UDim(0, 12)}
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
};

const Title: FunctionComponent<TitleProps> = ({ text }) => {
	return <Text text={text} textColor={colors.white} font={fonts.gotham.bold} textSize={24} textAutoResize="XY" />;
};

type DescriptionProps = {
	text: string;
};

const Description: FunctionComponent<DescriptionProps> = ({ text }) => {
	return <Text text={text} textColor={colors.white} font={fonts.gotham.medium} textSize={16} textAutoResize="XY" />;
};

type RootProps = {
	size?: UDim2;
	color?: Color3;
};

const Root: FunctionComponent<PropsWithChildren<RootProps>> = ({ children, size, color }) => {
	const [scale, setScale] = useMotion(0.1);
	const [animatedTransparency, setAnimatedTransparency] = useMotion(1);

	useMountEffect(() => {
		setAnimatedTransparency.spring(0);
		setScale.spring(1, springs.responsive);
	});

	return (
		<CanvasGroup
			position={UDim2.fromScale(0.5, 0.5)}
			anchorPoint={new Vector2(0.5, 0.5)}
			cornerRadius={new UDim(0.2, 8)}
			autoSize="XY"
			size={size}
			backgroundTransparency={1}
			groupTransparency={animatedTransparency}
		>
			<Frame size={UDim2.fromScale(1, 1)} cornerRadius={new UDim(0.2, 8)} backgroundColor={color ?? colors.black}>
				{children}

				<uipadding
					PaddingLeft={new UDim(0, 16)}
					PaddingRight={new UDim(0, 16)}
					PaddingTop={new UDim(0, 16)}
					PaddingBottom={new UDim(0, 16)}
				/>
			</Frame>
			<uiscale Scale={scale} />
		</CanvasGroup>
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
