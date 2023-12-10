import Roact, { useEffect } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { fonts } from "@/client/constants/fonts";
import { useRootStore } from "@/client/store";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { ToggleOption } from "@/client/ui/components/toggle-option";
import { useMotion } from "@/client/ui/hooks/use-motion";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

export const TwitterCard = () => {
	const rem = useRem();
	const { toggleWindowVisible } = useRootStore();

	const [giftPosition, setGiftPosition] = useMotion(1.5);
	const [transparencyPulse, setTransparencyPulse] = useMotion(0);

	useEffect(() => {
		setTransparencyPulse.tween(1, {
			time: 0.8,
			style: Enum.EasingStyle.Linear,
			direction: Enum.EasingDirection.Out,
			repeatCount: -1,
			reverses: true,
		});
		setGiftPosition.tween(1.4, {
			time: 2,
			style: Enum.EasingStyle.Sine,
			direction: Enum.EasingDirection.InOut,
			repeatCount: -1,
			reverses: true,
		});
	}, [setGiftPosition, setTransparencyPulse]);

	return (
		<Image
			size={new UDim2(1, 0, 0, rem(192, "pixel"))}
			cornerRadius={new UDim(0, rem(14, "pixel"))}
			image={images.ui.shop.redeem_background}
			clipsDescendants
		>
			<Image
				imageTransparency={transparencyPulse}
				image={images.ui.shop.featured_inline}
				size={UDim2.fromScale(1, 1)}
			/>
			<Image
				image={images.ui.shop.gift}
				position={giftPosition.map((value) => UDim2.fromScale(1.1, value))}
				anchorPoint={new Vector2(1, 1)}
				size={UDim2.fromOffset(rem(240, "pixel"), rem(240, "pixel"))}
			/>
			<Stack
				size={UDim2.fromScale(1, 1)}
				fillDirection="Vertical"
				horizontalAlignment="Left"
				padding={new UDim(0, rem(4, "pixel"))}
			>
				<Text
					text="Secret codes & FREE items!"
					textColor={colors.white}
					textSize={rem(24, "pixel")}
					textAutoResize="XY"
					font={fonts.fredokaOne.bold}
				>
					<uistroke Color={Color3.fromHex("#004C96")} Thickness={rem(5, "pixel")} />
				</Text>
				<Text
					text="Redeem now!"
					textColor={colors.white}
					textSize={rem(48, "pixel")}
					textAutoResize="XY"
					font={fonts.fredokaOne.bold}
				>
					<uigradient
						Color={new ColorSequence(Color3.fromHex("#a8ffbb"), Color3.fromHex("#40ff6a"))}
						Rotation={90}
					/>
					<uistroke Color={Color3.fromHex("#063d3d")} Thickness={rem(5, "pixel")} />
				</Text>
				<uipadding
					PaddingLeft={new UDim(0, rem(12, "pixel"))}
					PaddingRight={new UDim(0, rem(12, "pixel"))}
					PaddingTop={new UDim(0, rem(12, "pixel"))}
					PaddingBottom={new UDim(0, rem(12, "pixel"))}
				/>
			</Stack>

			<ToggleOption
				position={UDim2.fromScale(0.98, 0.9)}
				anchorPoint={new Vector2(1, 1)}
				checked={true}
				onClick={() => toggleWindowVisible("codes")}
			/>
			<uistroke Color={colors.white} Thickness={rem(4, "pixel")}>
				<uigradient
					Color={new ColorSequence(Color3.fromHex("#1a3fff"), Color3.fromHex("#1aadff"))}
					Rotation={90}
				/>
			</uistroke>
		</Image>
	);
};
