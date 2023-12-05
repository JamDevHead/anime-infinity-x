import Roact from "@rbxts/roact";
import { useRootSelector } from "@/client/store";
import { ScrollView } from "@/client/ui/components/scroll-view";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { ShopFeaturedCard } from "@/client/ui/layouts/windows/shop/shop-featured-card";
import { selectStoreFeatured } from "@/shared/store/store/store-selectors";

export function Shop() {
	const featured = useRootSelector(selectStoreFeatured);

	return (
		<Stack size={new UDim2(1, 0, 1, 0)} fillDirection={"Vertical"} clipsDescendants>
			<Text
				textScaled
				textColor={Color3.fromHex("#fff")}
				font={Font.fromName("GothamSSm", Enum.FontWeight.Heavy)}
				size={new UDim2(1, 0, 0, 35)}
				text={"~ Featured ~"}
			>
				<uitextsizeconstraint MaxTextSize={17} />
			</Text>

			<ScrollView backgroundTransparency={1} size={UDim2.fromScale(1, 1)}>
				{featured.map((card) => (
					<ShopFeaturedCard card={card} />
				))}
			</ScrollView>
		</Stack>
	);
}
