import Roact, { FunctionComponent } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { ratingColors } from "@/client/constants/rating-colors";
import { Frame } from "@/client/ui/components/frame";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

type StarProps = {
	position?: UDim2;
	size?: UDim2;
	imageColor?: Color3 | string;
	gradient?: Array<string>;
	glow?: boolean;
	active?: boolean;
	rotation?: number;
};

const Star: FunctionComponent<StarProps> = ({ size, imageColor, gradient, glow, active, position, rotation }) => {
	const rem = useRem();

	return (
		<Image
			image={images.icons.star_rating}
			size={size ?? UDim2.fromOffset(rem(32, "pixel"), rem(32, "pixel"))}
			imageColor={Color3.fromHex("#000")}
			anchorPoint={new Vector2(0.5, 0.5)}
			position={position}
			rotation={rotation}
		>
			{active && (
				<Image
					image={!glow ? images.icons.star_rating : images.icons.star_glow}
					size={UDim2.fromScale(1, 1)}
					imageColor={typeIs(imageColor, "string") ? Color3.fromHex(imageColor) : imageColor}
				>
					{gradient && (
						<uigradient
							Color={
								new ColorSequence(
									gradient.map((hex, index) => {
										return new ColorSequenceKeypoint(
											index / (gradient.size() - 1),
											Color3.fromHex(hex),
										);
									}) as unknown as Array<ColorSequenceKeypoint>,
								)
							}
							Rotation={-45}
						/>
					)}
				</Image>
			)}
			<uipadding
				PaddingLeft={new UDim(0, rem(glow ? 2 : 7, "pixel"))}
				PaddingRight={new UDim(0, rem(glow ? 2 : 7, "pixel"))}
				PaddingTop={new UDim(0, rem(glow ? 2 : 7, "pixel"))}
				PaddingBottom={new UDim(0, rem(glow ? 2 : 7, "pixel"))}
			/>
		</Image>
	);
};

type StarRatingProps = {
	stars?: number;
};

export const StarRating: FunctionComponent<StarRatingProps> = ({ stars }) => {
	const rem = useRem();

	const ratingColor = ratingColors[(stars ?? 0) - 1];

	return (
		<Stack
			fillDirection="Horizontal"
			horizontalAlignment="Center"
			size={UDim2.fromScale(1, 1)}
			padding={new UDim(0, rem(0.2))}
		>
			{stars !== undefined && stars <= 5 ? (
				<>
					{table.create(5, 0).map((_, index) => {
						const active = index < stars;
						return (
							<Star
								key={index}
								size={UDim2.fromOffset(rem(32, "pixel"), rem(32, "pixel"))}
								imageColor={ratingColor?.color ?? colors.white}
								gradient={ratingColor?.gradient}
								active={active}
							/>
						);
					})}
				</>
			) : (
				<Frame size={UDim2.fromScale(1, 0)} autoSize={Enum.AutomaticSize.Y} backgroundTransparency={1}>
					<Image
						image={images.ui.shadow_star}
						anchorPoint={new Vector2(0.5, 0.5)}
						position={UDim2.fromScale(0.5, 0.5)}
						size={UDim2.fromOffset(rem(178, "pixel"), rem(18, "pixel"))}
					/>

					<Star
						position={new UDim2(0.5, rem(38, "pixel"), 0.5, -rem(0, "pixel"))}
						imageColor={ratingColor.stars ? ratingColor.stars?.[0].color : ratingColor.color}
						gradient={ratingColor.stars ? ratingColor.stars?.[0].gradient : ratingColor.gradient}
						rotation={-7.5}
						glow
						active
					/>
					<Star
						position={UDim2.fromScale(0.5, 0.5)}
						size={UDim2.fromOffset(rem(36, "pixel"), rem(36, "pixel"))}
						imageColor={ratingColor.stars ? ratingColor.stars?.[1].color : ratingColor.color}
						gradient={ratingColor.stars ? ratingColor.stars?.[1].gradient : ratingColor.gradient}
						glow
						active
					/>
					<Star
						position={new UDim2(0.5, -rem(38, "pixel"), 0.5, -rem(0, "pixel"))}
						imageColor={ratingColor.stars ? ratingColor.stars?.[2].color : ratingColor.color}
						gradient={ratingColor.stars ? ratingColor.stars?.[2].gradient : ratingColor.gradient}
						rotation={7.5}
						glow
						active
					/>
				</Frame>
			)}
		</Stack>
	);
};
