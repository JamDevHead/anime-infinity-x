import Roact, { Binding, FunctionComponent } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { fonts } from "@/client/constants/fonts";
import { Button } from "@/client/ui/components/button";
import { CanvasGroup } from "@/client/ui/components/canvas-group";
import { Frame } from "@/client/ui/components/frame";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { StarRating } from "@/client/ui/components/star-rating";
import { Text } from "@/client/ui/components/text";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

type FighterCardProps = {
	active?: boolean;
	headshot: string;
	zone: string;
	rating?: number;
	padding?: number;
	onClick?: () => void;
	description?: string;
	discovered?: boolean;
	size?: Binding<UDim2> | UDim2;
	onHover?: () => void;
	onLeave?: () => void;
};

export const FighterCard: FunctionComponent<FighterCardProps> = ({
	onClick,
	active,
	headshot,
	zone,
	rating,
	padding,
	discovered,
	description,
	size,
	onHover,
	onLeave,
}) => {
	const rem = useRem();

	const headshots = images.characters.headshots as unknown as Record<string, Record<string, string>>;
	const formattedHeadshot = headshot?.split(" ").join("_").lower();

	const zonePath = headshots[zone?.lower()];
	const headshotElement = zonePath?.[formattedHeadshot];

	return (
		<Button
			size={size ?? UDim2.fromScale(1, 1)}
			backgroundTransparency={1}
			cornerRadius={new UDim(0, 12)}
			onClick={onClick}
			event={{
				MouseEnter: onHover,
				MouseLeave: onLeave,
			}}
		>
			<CanvasGroup size={UDim2.fromScale(1, 1)} cornerRadius={new UDim(0, 12)} backgroundTransparency={1}>
				<Image
					image={images.ui.cards.backgrounds[zone?.lower() as keyof typeof images.ui.cards.backgrounds]}
					size={UDim2.fromScale(1, 1)}
				>
					{active && (
						<Frame
							position={UDim2.fromScale(1.1, 0)}
							anchorPoint={new Vector2(0.5, 0)}
							size={UDim2.fromOffset(rem(300, "pixel"), rem(48, "pixel"))}
							backgroundColor={Color3.fromHex("#00ff20")}
							rotation={45}
						/>
					)}
					<Stack
						fillDirection="Vertical"
						horizontalAlignment="Center"
						size={UDim2.fromScale(1, 1)}
						padding={new UDim(0, 12)}
						sortOrder={Enum.SortOrder.LayoutOrder}
					>
						<CanvasGroup
							size={new UDim2(1, 0, 1, rating !== undefined ? -rem(48, "pixel") : 0)}
							cornerRadius={new UDim(0, 12)}
							backgroundTransparency={0.5}
							backgroundColor={colors.black}
						>
							<Image
								image={headshotElement ?? images.icons.fish}
								position={UDim2.fromScale(0, 1)}
								anchorPoint={new Vector2(0, 1)}
								size={UDim2.fromScale(1, 0.8)}
								imageColor={discovered ? colors.white : colors.black}
							>
								{description !== undefined && (
									<Text
										text={description}
										position={UDim2.fromScale(0.5, 1)}
										anchorPoint={new Vector2(0.5, 1)}
										textAutoResize="XY"
										autoSize="XY"
										font={fonts.gotham.bold}
										textColor={colors.white}
										textXAlignment="Center"
										textScaled
										textWrapped
									/>
								)}
							</Image>
						</CanvasGroup>
						{rating !== undefined && <StarRating stars={rating} />}
					</Stack>
					<uipadding
						PaddingLeft={new UDim(0, rem(padding ?? 12, "pixel"))}
						PaddingRight={new UDim(0, rem(padding ?? 12, "pixel"))}
						PaddingTop={new UDim(0, rem(padding ?? 12, "pixel"))}
						PaddingBottom={new UDim(0, rem(padding ?? 12, "pixel"))}
					/>
				</Image>
			</CanvasGroup>
		</Button>
	);
};
