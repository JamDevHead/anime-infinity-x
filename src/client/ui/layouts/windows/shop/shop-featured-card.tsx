import Roact, { FunctionComponent, useEffect } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { fonts } from "@/client/constants/fonts";
import { Button } from "@/client/ui/components/button";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { useMotion } from "@/client/ui/hooks/use-motion";
import { useRem } from "@/client/ui/hooks/use-rem";
import { ContentCard } from "@/client/ui/layouts/windows/shop/content-card";
import { images } from "@/shared/assets/images";
import { StoreCard } from "@/shared/store/store/store-types";

type ShopFeaturedCardProps = {
	card: StoreCard;
	button?: {
		text: string;
		product?: string;
		onClick: () => void;
	};
};

export const ShopFeaturedCard: FunctionComponent<ShopFeaturedCardProps> = ({ card, button }) => {
	const rem = useRem();

	const [backStarsPosition, setBackStarsPosition] = useMotion(-1);
	const [frontStarsPosition, setFrontStarsPosition] = useMotion(-1);
	const [transparencyPulse, setTransparencyPulse] = useMotion(0);

	useEffect(() => {
		setTransparencyPulse.tween(1, {
			time: 0.8,
			style: Enum.EasingStyle.Linear,
			direction: Enum.EasingDirection.Out,
			repeatCount: -1,
			reverses: true,
		});
	}, [setTransparencyPulse]);

	useEffect(() => {
		setBackStarsPosition.tween(0, {
			time: 40,
			style: Enum.EasingStyle.Linear,
			direction: Enum.EasingDirection.Out,
			repeatCount: -1,
		});
		setFrontStarsPosition.tween(0, {
			time: 20,
			style: Enum.EasingStyle.Linear,
			direction: Enum.EasingDirection.Out,
			repeatCount: -1,
		});

		return () => {
			setBackStarsPosition.stop();
			setFrontStarsPosition.stop();
		};
	}, [setBackStarsPosition, setFrontStarsPosition]);

	return (
		<Image
			size={new UDim2(1, 0, 0, rem(256 * 1.2, "pixel"))}
			image={images.ui.shop.featured_background}
			cornerRadius={new UDim(0, rem(14, "pixel"))}
			clipsDescendants
		>
			<Image
				image={images.ui.shop.featured_stars_back}
				imageTransparency={0.9}
				size={UDim2.fromScale(1, 1)}
				position={backStarsPosition.map((value) => UDim2.fromScale(value, 0))}
			>
				<Image
					image={images.ui.shop.featured_stars_back}
					imageTransparency={0.9}
					size={UDim2.fromScale(1, 1)}
					position={UDim2.fromScale(1, 0)}
				/>
			</Image>
			<Image
				image={images.ui.shop.featured_stars_front}
				size={UDim2.fromScale(1, 1)}
				position={frontStarsPosition.map((value) => UDim2.fromScale(value, 0))}
			>
				<Image
					image={images.ui.shop.featured_stars_front}
					size={UDim2.fromScale(1, 1)}
					position={UDim2.fromScale(1, 0)}
				/>
			</Image>
			<Image
				imageTransparency={transparencyPulse}
				image={images.ui.shop.featured_inline}
				size={UDim2.fromScale(1, 1)}
			/>
			<Stack
				fillDirection="Vertical"
				autoSize="Y"
				size={UDim2.fromScale(1, 1)}
				sortOrder={Enum.SortOrder.LayoutOrder}
			>
				<Text
					//textScaled
					textColor={Color3.fromHex("#fff")}
					font={fonts.gotham.bold}
					size={UDim2.fromScale(1, 0)}
					textSize={rem(23, "pixel")}
					textAutoResize={"XY"}
					text={`・${card.title}・`}
				>
					<uitextsizeconstraint MaxTextSize={23} />
				</Text>

				<Stack
					fillDirection="Horizontal"
					backgroundTransparency={1}
					size={new UDim2(1, 0, 1, -rem(35, "pixel"))}
					padding={new UDim(0, rem(12, "pixel"))}
					horizontalAlignment="Center"
					verticalAlignment="Center"
				>
					{card.contents.map((contentId) => (
						<ContentCard contentId={contentId} />
					))}
				</Stack>

				<uipadding
					PaddingLeft={new UDim(0, rem(10, "pixel"))}
					PaddingRight={new UDim(0, rem(10, "pixel"))}
					PaddingTop={new UDim(0, rem(10, "pixel"))}
					PaddingBottom={new UDim(0, rem(18, "pixel"))}
				/>
			</Stack>

			{button && (
				<Button
					size={UDim2.fromOffset(rem(200, "pixel"), rem(50, "pixel"))}
					position={UDim2.fromScale(0.5, 0.98)}
					anchorPoint={new Vector2(0.5, 1)}
					onClick={button.onClick}
					cornerRadius={new UDim(0, rem(14, "pixel"))}
					backgroundColor={colors.white}
				>
					<Text
						textColor={Color3.fromHex("#fff")}
						font={fonts.gotham.bold}
						size={new UDim2(1, 0, 1, 0)}
						text={button.text}
						textSize={rem(20, "pixel")}
					/>
					<uigradient
						Color={new ColorSequence(Color3.fromHex("#0050c3"), Color3.fromHex("#7a00bc"))}
						Rotation={90}
					/>
				</Button>
			)}
			<uistroke Color={colors.white} Thickness={rem(4, "pixel")}>
				<uigradient
					Color={new ColorSequence(Color3.fromHex("#0050c3"), Color3.fromHex("#7a00bc"))}
					Rotation={90}
				/>
			</uistroke>
		</Image>
	);
};
