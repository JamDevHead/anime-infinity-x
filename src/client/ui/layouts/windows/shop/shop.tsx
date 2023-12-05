import Roact from "@rbxts/roact";
import { useRootSelector, useRootStore } from "@/client/store";
import { Image } from "@/client/ui/components/image";
import { ScrollView } from "@/client/ui/components/scroll-view";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { ToggleOption } from "@/client/ui/components/toggle-option";
import { useRem } from "@/client/ui/hooks/use-rem";
import { ShopFeaturedCard } from "@/client/ui/layouts/windows/shop/shop-featured-card";
import { images } from "@/shared/assets/images";
import { selectStoreFeatured } from "@/shared/store/store/store-selectors";

export function Shop() {
	const rem = useRem();
	const featured = useRootSelector(selectStoreFeatured);

	const { toggleWindowVisible } = useRootStore();

	return (
		<Stack size={new UDim2(1, 0, 1, 0)} fillDirection={"Vertical"} clipsDescendants>
			<ScrollView
				backgroundTransparency={1}
				size={UDim2.fromScale(1, 1)}
				padding={new UDim(0, 12)}
				margin={{
					Top: new UDim(0, 12),
					Bottom: new UDim(0, 12),
					Left: new UDim(0, 12),
					Right: new UDim(0, 24),
				}}
			>
				<Text
					textScaled
					textColor={Color3.fromHex("#fff")}
					font={Font.fromName("GothamSSm", Enum.FontWeight.Heavy)}
					size={new UDim2(1, 0, 0, 35)}
					text="~ Featured ~"
				>
					<uitextsizeconstraint MaxTextSize={17} />
				</Text>
				{featured.map((card) => (
					<ShopFeaturedCard card={card} />
				))}
				<Image size={new UDim2(1, 0, 0, rem(192, "pixel"))} image={images.ui.shop.redeem_background}>
					<ToggleOption
						position={UDim2.fromScale(0.98, 0.9)}
						anchorPoint={new Vector2(1, 1)}
						checked={true}
						onClick={() => toggleWindowVisible("codes")}
					/>
				</Image>
				<Text
					textScaled
					textColor={Color3.fromHex("#fff")}
					font={Font.fromName("GothamSSm", Enum.FontWeight.Heavy)}
					size={new UDim2(1, 0, 0, 35)}
					text="~ Gamepasses ~ (soon)"
				>
					<uitextsizeconstraint MaxTextSize={17} />
				</Text>
			</ScrollView>
		</Stack>
	);
}
