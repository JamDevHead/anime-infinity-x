import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { Button } from "@/client/ui/components/button";
import { Frame } from "@/client/ui/components/frame";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { StarRating } from "@/client/ui/components/star-rating";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

export const FighterCard = () => {
	const rem = useRem();

	const randomBackground = () => {
		const backgrounds = Object.keys(images.ui.cards.backgrounds);
		const randomIndex = math.random(0, backgrounds.size() - 1);
		return images.ui.cards.backgrounds[backgrounds[randomIndex]];
	};

	return (
		<Button size={UDim2.fromScale(1, 1)} backgroundTransparency={1} cornerRadius={new UDim(0, 12)}>
			<Image image={randomBackground()} size={UDim2.fromScale(1, 1)} cornerRadius={new UDim(0, 12)}>
				<Stack
					fillDirection="Vertical"
					horizontalAlignment="Center"
					size={UDim2.fromScale(1, 1)}
					padding={new UDim(0, 12)}
					sortOrder={Enum.SortOrder.LayoutOrder}
				>
					<Frame
						size={new UDim2(1, 0, 1, -rem(48, "pixel"))}
						cornerRadius={new UDim(0, 12)}
						backgroundTransparency={0.5}
						backgroundColor={colors.black}
					/>
					<StarRating stars={math.random(1, 7)} />
				</Stack>
				<uipadding
					PaddingLeft={new UDim(0, rem(12, "pixel"))}
					PaddingRight={new UDim(0, rem(12, "pixel"))}
					PaddingTop={new UDim(0, rem(12, "pixel"))}
					PaddingBottom={new UDim(0, rem(12, "pixel"))}
				/>
			</Image>
		</Button>
	);
};
