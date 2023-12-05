import Roact from "@rbxts/roact";
import { Grid } from "@/client/ui/components/grid";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { ContentCard } from "@/client/ui/layouts/windows/shop/content-card";
import { images } from "@/shared/assets/images";
import { StoreCard } from "@/shared/store/store/store-types";

export function ShopFeaturedCard({ card }: { card: StoreCard }) {
	return (
		<Image sizeConstraint={"RelativeXX"} size={UDim2.fromScale(1, 0.45)} image={images.ui.shop.featured_background}>
			<Stack autoSize={"Y"} size={UDim2.fromScale(1, 1)} fillDirection={"Vertical"}>
				<Text
					key={1}
					textScaled
					textColor={Color3.fromHex("#fff")}
					font={Font.fromName("GothamSSm", Enum.FontWeight.Heavy)}
					size={new UDim2(1, 0, 0, 35)}
					text={`・${card.title}・`}
				>
					<uitextsizeconstraint MaxTextSize={23} />
				</Text>

				<Grid
					backgroundTransparency={1}
					size={new UDim2(1, 0, 1, -35)}
					horizontalAlignment="Center"
					verticalAlignment="Center"
				>
					{card.contents.map((contentId, index) => (
						<ContentCard contentId={contentId} key={index + 1} />
					))}
				</Grid>
			</Stack>
		</Image>
	);
}
