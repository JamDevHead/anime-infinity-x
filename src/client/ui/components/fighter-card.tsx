import Roact, { FunctionComponent } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { Button } from "@/client/ui/components/button";
import { CanvasGroup } from "@/client/ui/components/canvas-group";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { StarRating } from "@/client/ui/components/star-rating";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

type FighterCardProps = {
	headshot: string;
	zone: keyof typeof images.ui.cards.backgrounds;
	rating: number;
};

export const FighterCard: FunctionComponent<FighterCardProps> = ({ headshot, zone, rating }) => {
	const rem = useRem();

	const zonePath = images.characters.headshots[zone] as Record<string, string>;
	const headshotElement = zonePath[headshot];

	return (
		<Button size={UDim2.fromScale(1, 1)} backgroundTransparency={1} cornerRadius={new UDim(0, 12)}>
			<Image
				image={images.ui.cards.backgrounds[zone]}
				size={UDim2.fromScale(1, 1)}
				cornerRadius={new UDim(0, 12)}
			>
				<Stack
					fillDirection="Vertical"
					horizontalAlignment="Center"
					size={UDim2.fromScale(1, 1)}
					padding={new UDim(0, 12)}
					sortOrder={Enum.SortOrder.LayoutOrder}
				>
					<CanvasGroup
						size={new UDim2(1, 0, 1, -rem(48, "pixel"))}
						cornerRadius={new UDim(0, 12)}
						backgroundTransparency={0.5}
						backgroundColor={colors.black}
					>
						<Image image={headshotElement ?? images.icons.fish} size={UDim2.fromScale(1, 1)} />
					</CanvasGroup>
					<StarRating stars={rating} />
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
