import Roact, { FunctionComponent, useEffect, useState } from "@rbxts/roact";
import { MarketplaceService, Players } from "@rbxts/services";
import { colors } from "@/client/constants/colors";
import { fonts } from "@/client/constants/fonts";
import { useRootSelector } from "@/client/store";
import { Button } from "@/client/ui/components/button";
import { Frame } from "@/client/ui/components/frame";
import { Grid } from "@/client/ui/components/grid";
import { Image } from "@/client/ui/components/image";
import { ScrollView } from "@/client/ui/components/scroll-view";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { useAbbreviator } from "@/client/ui/hooks/use-abbreviator";
import { useBreakpoint } from "@/client/ui/hooks/use-breakpoint";
import { useRem } from "@/client/ui/hooks/use-rem";
import { ShopFeaturedCard } from "@/client/ui/layouts/windows/shop/shop-featured-card";
import { TwitterCard } from "@/client/ui/layouts/windows/shop/twitter-card";
import { GamePasses } from "@/shared/assets/game-passes";
import { images } from "@/shared/assets/images";
import { Products } from "@/shared/assets/products";
import { selectStoreFeatured } from "@/shared/store/store/store-selectors";

type BigCardProps = {
	icon: string;
	title: string;
	description: string;
	gradient: ColorSequence;
	price?: number;
	onClick?: () => void;
	product?: number;
};

const GamePassCard: FunctionComponent<BigCardProps> = ({
	icon,
	price,
	title,
	description,
	gradient,
	onClick,
	product,
}) => {
	const rem = useRem();
	const abbreviator = useAbbreviator();

	const [info, setInfo] = useState<ProductInfo | undefined>(undefined);

	useEffect(() => {
		if (product === undefined) return;

		task.spawn(() => {
			const [success, info] = pcall(() => MarketplaceService.GetProductInfo(product, "GamePass"));

			if (!success) {
				return;
			}

			setInfo(info);
		});
	}, [product]);

	return (
		<Frame size={UDim2.fromScale(1, 1)} backgroundColor={colors.white} cornerRadius={new UDim(0, rem(12, "pixel"))}>
			<Button size={UDim2.fromScale(1, 1)} backgroundTransparency={1} onClick={onClick}>
				<Image image={images.ui.shop.placeholder_card} size={UDim2.fromScale(1, 1)}>
					<Stack
						size={UDim2.fromScale(1, 1)}
						fillDirection="Horizontal"
						padding={new UDim(0, rem(12, "pixel"))}
					>
						<Stack
							size={UDim2.fromScale(0.5, 1)}
							fillDirection="Vertical"
							verticalAlignment="Center"
							clipsDescendants
							padding={new UDim(0, rem(12, "pixel"))}
						>
							<Image
								image={icon}
								size={UDim2.fromOffset(rem(96, "pixel"), rem(96, "pixel"))}
								scaleType={"Fit"}
							/>

							<Text
								textColor={Color3.fromHex("#fff")}
								font={fonts.gotham.bold}
								textAutoResize="X"
								size={new UDim2(0, 0, 0, rem(35, "pixel"))}
								textSize={rem(32, "pixel")}
								text={` ${abbreviator.numberToString(price ?? info?.PriceInRobux ?? 0)}`}
							>
								<uistroke Color={Color3.fromHex("#000")} Thickness={2} />
							</Text>

							<uipadding
								PaddingLeft={new UDim(0, rem(12, "pixel"))}
								PaddingRight={new UDim(0, rem(12, "pixel"))}
								PaddingTop={new UDim(0, rem(12, "pixel"))}
								PaddingBottom={new UDim(0, rem(12, "pixel"))}
							/>
						</Stack>

						<Stack
							size={UDim2.fromScale(0.45, 1)}
							fillDirection="Vertical"
							horizontalAlignment="Center"
							verticalAlignment="Center"
							clipsDescendants
							padding={new UDim(0, rem(12, "pixel"))}
						>
							<Text
								textColor={Color3.fromHex("#fff")}
								font={fonts.gotham.bold}
								textAutoResize="XY"
								textWrapped
								textSize={rem(32, "pixel")}
								size={UDim2.fromOffset(0, 0)}
								text={title}
							>
								<uistroke Color={Color3.fromHex("#000")} Thickness={2} />
							</Text>
							<Text
								textColor={Color3.fromHex("#fff")}
								font={fonts.gotham.bold}
								textAutoResize="XY"
								textSize={rem(18, "pixel")}
								textWrapped
								size={UDim2.fromOffset(0, 0)}
								text={description}
							>
								<uistroke Color={Color3.fromHex("#000")} Thickness={2} />
							</Text>
						</Stack>
					</Stack>
				</Image>
			</Button>
			<uigradient Rotation={90} Color={gradient} />
			<uistroke Color={colors.white} Thickness={3} />
		</Frame>
	);
};

type SimpleCardProps = {
	icon: string;
	title: string;
	description: string;
	price?: number;
	product?: {
		id: number;
		type: "GamePass" | "Product";
	};
	onClick?: () => void;
};

const SimpleCard: FunctionComponent<SimpleCardProps> = ({ icon, price, title, description, onClick, product }) => {
	const abbreviator = useAbbreviator();
	const rem = useRem();

	const [info, setInfo] = useState<ProductInfo | GamePassProductInfo | undefined>(undefined);

	useEffect(() => {
		if (product === undefined) return;

		task.spawn(() => {
			const [success, info] = pcall(() => MarketplaceService.GetProductInfo(product.id, product.type));

			if (!success) {
				return;
			}

			setInfo(info as ProductInfo | GamePassProductInfo);
		});
	}, [product]);

	return (
		<Frame size={UDim2.fromScale(1, 1)} backgroundColor={colors.white} cornerRadius={new UDim(0, rem(12, "pixel"))}>
			<Button size={UDim2.fromScale(1, 1)} backgroundTransparency={1} onClick={onClick}>
				<Stack
					size={UDim2.fromScale(1, 1)}
					fillDirection="Vertical"
					horizontalAlignment="Center"
					clipsDescendants
					padding={new UDim(0, rem(12, "pixel"))}
				>
					<Text
						textColor={Color3.fromHex("#fff")}
						font={fonts.gotham.bold}
						textAutoResize="X"
						textScaled
						textWrapped
						textSize={rem(32, "pixel")}
						size={UDim2.fromScale(1, 0.25)}
						text={title}
					>
						<uistroke Color={Color3.fromHex("#000")} Thickness={2} />
					</Text>
					<Stack
						autoSize="XY"
						fillDirection="Horizontal"
						horizontalAlignment="Center"
						verticalAlignment="Center"
						clipsDescendants
						padding={new UDim(0, rem(12, "pixel"))}
					>
						<Image
							image={icon}
							size={UDim2.fromOffset(rem(84, "pixel"), rem(74, "pixel"))}
							scaleType={"Fit"}
						/>
						<Text
							textColor={Color3.fromHex("#fff")}
							font={fonts.gotham.bold}
							textAutoResize="XY"
							textWrapped
							textSize={rem(18, "pixel")}
							size={UDim2.fromOffset(0, 0)}
							text={description}
						>
							<uistroke Color={Color3.fromHex("#000")} Thickness={2} />
						</Text>
					</Stack>
					<Text
						textColor={Color3.fromHex("#fff")}
						font={fonts.gotham.bold}
						textAutoResize="X"
						size={new UDim2(0, 0, 0, 35)}
						textSize={rem(32, "pixel")}
						text={` ${abbreviator.numberToString(price ?? info?.PriceInRobux ?? 0)}`}
					>
						<uistroke Color={Color3.fromHex("#000")} Thickness={2} />
					</Text>
					<uipadding
						PaddingLeft={new UDim(0, rem(12, "pixel"))}
						PaddingRight={new UDim(0, rem(12, "pixel"))}
						PaddingTop={new UDim(0, rem(12, "pixel"))}
						PaddingBottom={new UDim(0, rem(12, "pixel"))}
					/>
				</Stack>
			</Button>
			<uigradient Rotation={90} Color={new ColorSequence(Color3.fromHex("#36ABFF"), Color3.fromHex("#3693FF"))} />
			<uistroke Color={colors.white} Thickness={3} />
		</Frame>
	);
};

export function Shop() {
	const LocalPlayer = Players.LocalPlayer;
	const breakpoint = useBreakpoint();
	const rem = useRem();
	const featured = useRootSelector(selectStoreFeatured);

	const [eggPrice, setEggPrice] = useState<number | undefined>(undefined);

	useEffect(() => {
		task.spawn(() => {
			const [success, info] = pcall(() =>
				MarketplaceService.GetProductInfo(Products.SECRET_EGG_ROBUX, "Product"),
			);

			if (!success) {
				return;
			}

			setEggPrice(info.PriceInRobux);
		});
	}, []);

	return (
		<Stack size={UDim2.fromScale(1, 1)} fillDirection={"Vertical"} clipsDescendants>
			<ScrollView
				backgroundTransparency={1}
				size={UDim2.fromScale(1, 1)}
				padding={new UDim(0, rem(12, "pixel"))}
				margin={{
					Top: new UDim(0, rem(12, "pixel")),
					Bottom: new UDim(0, rem(12, "pixel")),
					Left: new UDim(0, rem(12, "pixel")),
					Right: new UDim(0, rem(24, "pixel")),
				}}
			>
				<Text
					textScaled
					textColor={Color3.fromHex("#fff")}
					font={Font.fromName("GothamSSm", Enum.FontWeight.Heavy)}
					size={new UDim2(1, 0, 0, rem(35, "pixel"))}
					text="~ Featured ~"
				>
					<uitextsizeconstraint MaxTextSize={17} />
				</Text>
				{featured.map((card) => (
					<ShopFeaturedCard
						card={card}
						button={{
							text: `Buy for ${eggPrice} Robux`,
							onClick: () =>
								MarketplaceService.PromptProductPurchase(LocalPlayer, Products.SECRET_EGG_ROBUX),
						}}
					/>
				))}

				<Text
					textScaled
					textColor={Color3.fromHex("#fff")}
					font={Font.fromName("GothamSSm", Enum.FontWeight.Heavy)}
					size={new UDim2(1, 0, 0, rem(35, "pixel"))}
					text="~ Gamepasses ~"
				>
					<uitextsizeconstraint MaxTextSize={17} />
				</Text>
				<Stack
					size={UDim2.fromScale(1, 0)}
					fillDirection="Vertical"
					horizontalAlignment="Center"
					verticalAlignment="Center"
					autoSize="XY"
					padding={new UDim(0, rem(24, "pixel"))}
				>
					<Grid
						autoSize="Y"
						size={UDim2.fromScale(1, 0)}
						cellSize={
							breakpoint === "tablet"
								? UDim2.fromOffset(rem(400, "pixel"), rem(192, "pixel"))
								: UDim2.fromOffset(rem(300, "pixel"), rem(192, "pixel"))
						}
						cellPadding={UDim2.fromOffset(rem(24, "pixel"), rem(24, "pixel"))}
						horizontalAlignment="Center"
						rows={2}
					>
						<GamePassCard
							icon={images.icons.vip_mvp}
							title="MVP"
							description="Your fighter, chat tag and packs discount!"
							gradient={new ColorSequence(Color3.fromHex("#ffd600"), Color3.fromHex("#ff9900"))}
							product={GamePasses.VIP}
							onClick={() => MarketplaceService.PromptGamePassPurchase(LocalPlayer, GamePasses.VIP)}
						/>
						<GamePassCard
							icon={images.icons.dummy}
							title="Extra Equip (x5)"
							description="Equip +5 fighters instead of 3!"
							gradient={new ColorSequence(Color3.fromHex("#00fff0"), Color3.fromHex("#45b1ff"))}
							product={GamePasses.PET_EQUIP_2}
							onClick={() =>
								MarketplaceService.PromptGamePassPurchase(LocalPlayer, GamePasses.PET_EQUIP_2)
							}
						/>
						<GamePassCard
							icon={images.icons.dummy}
							title="Extra Equip (x2)"
							description="Equip +2 fighters instead of 3!"
							gradient={new ColorSequence(Color3.fromHex("#00fff0"), Color3.fromHex("#45b1ff"))}
							price={MarketplaceService.GetProductInfo(GamePasses.PET_EQUIP_5).PriceInRobux}
							product={GamePasses.PET_EQUIP_5}
							onClick={() =>
								MarketplaceService.PromptGamePassPurchase(LocalPlayer, GamePasses.PET_EQUIP_5)
							}
						/>
					</Grid>
					<Grid
						autoSize="Y"
						size={UDim2.fromScale(1, 0)}
						cellSize={UDim2.fromOffset(rem(192, "pixel"), rem(192, "pixel"))}
						cellPadding={UDim2.fromOffset(rem(24, "pixel"), rem(24, "pixel"))}
						horizontalAlignment="Center"
						rows={3}
					>
						<SimpleCard
							icon={images.icons.boosts.lucky_boost}
							title="Lucky"
							description="Lucky"
							product={{
								id: GamePasses.LUCKY,
								type: "GamePass",
							}}
							onClick={() => MarketplaceService.PromptGamePassPurchase(LocalPlayer, GamePasses.LUCKY)}
						/>
						<SimpleCard
							icon={images.icons.boosts.lucky_boost}
							title="Super Lucky"
							description="Lucky"
							product={{
								id: GamePasses.SUPER_LUCKY,
								type: "GamePass",
							}}
							onClick={() =>
								MarketplaceService.PromptGamePassPurchase(LocalPlayer, GamePasses.SUPER_LUCKY)
							}
						/>
						<SimpleCard
							icon={images.icons.boosts.lucky_boost}
							title="Dark Matter Lucky"
							description="Lucky"
							product={{
								id: GamePasses.DARK_MATTER_LUCKY,
								type: "GamePass",
							}}
							onClick={() =>
								MarketplaceService.PromptGamePassPurchase(LocalPlayer, GamePasses.DARK_MATTER_LUCKY)
							}
						/>
					</Grid>
				</Stack>
				<Frame size={UDim2.fromOffset(0, rem(24, "pixel"))} backgroundTransparency={1} />
				<TwitterCard />
			</ScrollView>
		</Stack>
	);
}
