import Roact, { FunctionComponent } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { fonts } from "@/client/constants/fonts";
import { useRootSelector, useRootStore } from "@/client/store";
import { Frame } from "@/client/ui/components/frame";
import { Grid } from "@/client/ui/components/grid";
import { Image } from "@/client/ui/components/image";
import { ScrollView } from "@/client/ui/components/scroll-view";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { ToggleOption } from "@/client/ui/components/toggle-option";
import { useAbbreviator } from "@/client/ui/hooks/use-abbreviator";
import { useBreakpoint } from "@/client/ui/hooks/use-breakpoint";
import { useRem } from "@/client/ui/hooks/use-rem";
import { ShopFeaturedCard } from "@/client/ui/layouts/windows/shop/shop-featured-card";
import { images } from "@/shared/assets/images";
import { selectStoreFeatured } from "@/shared/store/store/store-selectors";

type BigCardProps = {
	icon: string;
	title: string;
	description: string;
	gradient: ColorSequence;
	price?: number;
};

const BigCard: FunctionComponent<BigCardProps> = ({ icon, price, title, description, gradient }) => {
	const rem = useRem();
	const abbreviator = useAbbreviator();

	return (
		<Frame size={UDim2.fromScale(1, 1)} backgroundColor={colors.white} cornerRadius={new UDim(0, rem(12, "pixel"))}>
			<Image image={images.ui.shop.placeholder_card} size={UDim2.fromScale(1, 1)}>
				<Stack size={UDim2.fromScale(1, 1)} fillDirection="Horizontal" padding={new UDim(0, rem(12, "pixel"))}>
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
							text={` ${abbreviator.numberToString(price ?? 0)}`}
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
};

const SimpleCard: FunctionComponent<SimpleCardProps> = ({ icon, price, title, description }) => {
	const abbreviator = useAbbreviator();
	const rem = useRem();

	return (
		<Frame size={UDim2.fromScale(1, 1)} backgroundColor={colors.white} cornerRadius={new UDim(0, rem(12, "pixel"))}>
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
					textAutoResize="XY"
					textWrapped
					textSize={rem(32, "pixel")}
					size={UDim2.fromOffset(0, 0)}
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
					<Image image={icon} size={UDim2.fromOffset(rem(84, "pixel"), rem(74, "pixel"))} scaleType={"Fit"} />
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
					text={` ${abbreviator.numberToString(price ?? 0)}`}
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
			<uigradient Rotation={90} Color={new ColorSequence(Color3.fromHex("#36ABFF"), Color3.fromHex("#3693FF"))} />
			<uistroke Color={colors.white} Thickness={3} />
		</Frame>
	);
};

export function Shop() {
	const breakpoint = useBreakpoint();
	const rem = useRem();
	const featured = useRootSelector(selectStoreFeatured);

	const { toggleWindowVisible } = useRootStore();

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
							breakpoint === "mobile"
								? UDim2.fromOffset(rem(400, "pixel"), rem(192, "pixel"))
								: UDim2.fromOffset(rem(300, "pixel"), rem(192, "pixel"))
						}
						cellPadding={UDim2.fromOffset(rem(24, "pixel"), rem(24, "pixel"))}
						horizontalAlignment="Center"
						rows={2}
					>
						<BigCard
							icon={images.icons.vip_mvp}
							title="MVP"
							description="Your fighter, chat tag and packs discount!"
							gradient={new ColorSequence(Color3.fromHex("#ffd600"), Color3.fromHex("#ff9900"))}
							price={1000}
						/>
						<BigCard
							icon={images.icons.dummy}
							title="Extra Equip"
							description="Equip 6 fighters instead of 3!"
							gradient={new ColorSequence(Color3.fromHex("#00fff0"), Color3.fromHex("#45b1ff"))}
							price={250}
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
						<SimpleCard icon={images.icons.boosts.lucky_boost} title="Lucky" description="Lucky" />
						<SimpleCard icon={images.icons.boosts.lucky_boost} title="Lucky" description="Lucky" />
						<SimpleCard icon={images.icons.boosts.lucky_boost} title="Lucky" description="Lucky" />
					</Grid>
				</Stack>
			</ScrollView>
		</Stack>
	);
}
