import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { fonts } from "@/client/constants/fonts";
import { useRootProducer, useRootSelector } from "@/client/reflex/producers";
import { Image } from "@/client/ui/components/image";
import { ScrollView } from "@/client/ui/components/scroll-view";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { ToggleOption } from "@/client/ui/components/toggle-option";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

export const Settings = () => {
	const rem = useRem();

	const { settings } = useRootSelector((store) => store.settings);
	const dispatch = useRootProducer();

	return (
		<>
			<Stack
				fillDirection="Vertical"
				verticalAlignment="Top"
				horizontalAlignment="Center"
				padding={new UDim(0, 32)}
				size={UDim2.fromScale(1, 1)}
			>
				<Text
					text="~ General ~"
					font={fonts.inter.bold}
					textSize={rem(3)}
					size={UDim2.fromScale(1, 0)}
					textColor={Color3.fromRGB(255, 255, 255)}
				/>
				<ScrollView size={UDim2.fromScale(1, 1)} padding={new UDim(0, 8)}>
					{Object.entries(settings).map(([key, value]) => (
						<Image key={key} size={UDim2.fromScale(1, 0.2)} image={images.ui.option_background}>
							<Stack size={UDim2.fromScale(1, 1)} fillDirection="Horizontal" verticalAlignment="Center">
								<Text
									text={value.label}
									font={fonts.inter.bold}
									textSize={rem(2)}
									size={UDim2.fromScale(0.8, 1)}
									textColor={Color3.fromRGB(255, 255, 255)}
								/>
								{typeOf(value.value) === "boolean" && (
									<ToggleOption
										checked={value.value as boolean}
										onChange={(value) => dispatch.setSetting(key as never, value)}
									/>
								)}
							</Stack>
							<uipadding
								PaddingLeft={new UDim(0, rem(2.5))}
								PaddingRight={new UDim(0, rem(2.5))}
								PaddingTop={new UDim(0, rem(2.5))}
								PaddingBottom={new UDim(0, rem(2.5))}
							/>
						</Image>
					))}
				</ScrollView>
			</Stack>
			<uipadding
				PaddingLeft={new UDim(0, rem(2.5))}
				PaddingRight={new UDim(0, rem(2.5))}
				PaddingTop={new UDim(0, rem(2.5))}
				PaddingBottom={new UDim(0, rem(2.5))}
			/>
		</>
	);
};
