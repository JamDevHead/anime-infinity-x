import Roact, { FunctionComponent, PropsWithChildren } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { fonts } from "@/client/constants/fonts";
import { UiController } from "@/client/controllers/ui-controller";
import { Button } from "@/client/ui/components/button";
import { Frame, FrameProps } from "@/client/ui/components/frame";
import { Image } from "@/client/ui/components/image";
import { Text } from "@/client/ui/components/text";
import { useMotion } from "@/client/ui/hooks/use-motion";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

type WindowProps = FrameProps & {
	title: string;
	size?: UDim2;
	onClose?: () => void;
	hiddenClose?: boolean;
};

export const Window: FunctionComponent<PropsWithChildren<WindowProps>> = ({
	children,
	size,
	title,
	onClose,
	position,
	hiddenClose,
}) => {
	const rem = useRem();
	const [closeSize, closeSizeMotion] = useMotion(UDim2.fromOffset(rem(5), rem(5)));

	return (
		<Frame
			size={UDim2.fromScale(1, 1)}
			position={UDim2.fromScale(0.5, 0.5)}
			anchorPoint={new Vector2(0.5, 0.5)}
			backgroundTransparency={1}
		>
			<uiaspectratioconstraint AspectRatio={1.5} />
			<Image
				image={images.ui.window_container}
				anchorPoint={new Vector2(0.5, 0.5)}
				size={size || UDim2.fromScale(0.5, 0.5)}
				position={position || UDim2.fromScale(0.5, 0.5)}
			>
				<Image
					image={images.ui.window_background}
					size={UDim2.fromScale(0.85, 0.85)}
					position={UDim2.fromScale(0.5, 0.5)}
					anchorPoint={new Vector2(0.5, 0.5)}
				>
					<Frame
						size={new UDim2(1, rem(-8, "pixel"), 1, rem(-8, "pixel"))}
						position={UDim2.fromScale(0.5, 0.5)}
						anchorPoint={new Vector2(0.5, 0.5)}
						backgroundTransparency={1}
					>
						<uistroke Thickness={4} Color={Color3.fromRGB(0, 0, 0)} />
					</Frame>
					<Frame
						size={new UDim2(1, rem(-12, "pixel"), 1, rem(-12, "pixel"))}
						position={UDim2.fromScale(0.5, 0.5)}
						anchorPoint={new Vector2(0.5, 0.5)}
						backgroundTransparency={1}
					>
						{children}
					</Frame>
					<uistroke Thickness={4} Color={Color3.fromRGB(255, 255, 255)}>
						<uigradient
							Color={
								new ColorSequence([
									new ColorSequenceKeypoint(0, Color3.fromHex("#FF9900")),
									new ColorSequenceKeypoint(1, Color3.fromHex("#FFD600")),
								])
							}
							Rotation={90}
						/>
					</uistroke>
				</Image>

				<Frame
					position={UDim2.fromScale(0.01, 0.02)}
					autoSize={Enum.AutomaticSize.XY}
					backgroundTransparency={1}
				>
					<Image
						image={images.ui.window_title}
						size={UDim2.fromScale(1, 1)}
						scaleType={"Slice"}
						sliceCenter={new Rect(42, 0, 46, 0)}
						rotation={-3}
					>
						<Text
							text={title}
							textSize={rem(2)}
							font={fonts.inter.bold}
							textColor={Color3.fromRGB(255, 255, 255)}
							backgroundTransparency={1}
							textAutoResize="XY"
						>
							<uistroke Thickness={2} Color={Color3.fromRGB(0, 0, 0)}>
								<uigradient
									Transparency={
										new NumberSequence([
											new NumberSequenceKeypoint(0, 0),
											new NumberSequenceKeypoint(1, 0.7),
										])
									}
									Rotation={90}
								/>
							</uistroke>
						</Text>
						<uipadding
							PaddingLeft={new UDim(0, rem(48, "pixel"))}
							PaddingRight={new UDim(0, rem(48, "pixel"))}
							PaddingTop={new UDim(0, rem(24, "pixel"))}
							PaddingBottom={new UDim(0, rem(24, "pixel"))}
						/>
						<uigradient
							Color={new ColorSequence(Color3.fromHex("#2840be"), Color3.fromHex("#1a35c1"))}
							Rotation={90}
						/>
					</Image>
					<Image
						image={images.ui.window_title_inline}
						imageColor={colors.black}
						rotation={-3}
						position={UDim2.fromScale(0.01, 0.02)}
						size={UDim2.fromScale(1, 1)}
						scaleType={"Slice"}
						sliceCenter={new Rect(42, 0, 46, 0)}
					/>
					<Image
						image={images.ui.window_title_outline}
						imageColor={colors.white}
						rotation={-3}
						position={UDim2.fromScale(0.01, 0.02)}
						size={UDim2.fromScale(1, 1)}
						scaleType={"Slice"}
						sliceCenter={new Rect(42, 0, 46, 0)}
					>
						<uigradient
							Color={new ColorSequence(Color3.fromHex("#ffd600"), Color3.fromHex("#ff9900"))}
							Rotation={90}
						/>
					</Image>
				</Frame>
				{!hiddenClose && (
					<Button
						onClick={() => {
							UiController.onClickSound.Fire();
							onClose?.();
						}}
						size={closeSize}
						position={UDim2.fromScale(0.92, 0.1)}
						anchorPoint={new Vector2(0.5, 0.5)}
						rotation={-4}
						backgroundTransparency={1}
						event={{
							MouseEnter: () => {
								closeSizeMotion.spring(UDim2.fromOffset(rem(6), rem(6)));
							},
							MouseLeave: () => {
								closeSizeMotion.spring(UDim2.fromOffset(rem(5), rem(5)));
							},
						}}
					>
						<Image image={images.ui.window_close} size={UDim2.fromScale(1, 1)} />
					</Button>
				)}
			</Image>
		</Frame>
	);
};
