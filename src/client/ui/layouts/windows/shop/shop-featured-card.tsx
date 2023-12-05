import Roact from "@rbxts/roact";
import { fonts } from "@/client/constants/fonts";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { useRem } from "@/client/ui/hooks/use-rem";
import { ContentCard } from "@/client/ui/layouts/windows/shop/content-card";
import { images } from "@/shared/assets/images";
import { StoreCard } from "@/shared/store/store/store-types";

export function ShopFeaturedCard({ card }: { card: StoreCard }) {
	const rem = useRem();

	return (
		<Image size={new UDim2(1, 0, 0, rem(256, "pixel"))} image={images.ui.shop.featured_background}>
			<Stack fillDirection="Vertical" autoSize="Y" size={UDim2.fromScale(1, 1)}>
				<Text
					textScaled
					textColor={Color3.fromHex("#fff")}
					font={fonts.gotham.bold}
					size={new UDim2(1, 0, 0, 35)}
					text={`・${card.title}・`}
				>
					<uitextsizeconstraint MaxTextSize={23} />
				</Text>

				<Stack
					fillDirection="Horizontal"
					backgroundTransparency={1}
					size={new UDim2(1, 0, 1, -35)}
					horizontalAlignment="Center"
					verticalAlignment="Center"
				>
					{card.contents.map((contentId) => (
						<ContentCard contentId={contentId} />
					))}
				</Stack>
			</Stack>
			<uipadding
				PaddingLeft={new UDim(0, 10)}
				PaddingRight={new UDim(0, 10)}
				PaddingTop={new UDim(0, 10)}
				PaddingBottom={new UDim(0, 10)}
			/>
		</Image>
	);
}
