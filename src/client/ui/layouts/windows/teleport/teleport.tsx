import Object from "@rbxts/object-utils";
import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact, { FunctionComponent } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { fonts } from "@/client/constants/fonts";
import { useRootStore } from "@/client/store";
import { Button } from "@/client/ui/components/button";
import { CanvasGroup } from "@/client/ui/components/canvas-group";
import { Frame } from "@/client/ui/components/frame";
import { Image } from "@/client/ui/components/image";
import { ScrollView } from "@/client/ui/components/scroll-view";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { useMotion } from "@/client/ui/hooks/use-motion";
import { usePlayerId } from "@/client/ui/hooks/use-player-id";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";
import { ZONES } from "@/shared/constants/zones";
import remotes from "@/shared/remotes";
import { selectPlayerZones } from "@/shared/store/players/zones";

type TeleportCardProps = {
	image: string;
	text: string;
	locked?: boolean;
	onClick?: () => void;
};

const TeleportCard: FunctionComponent<TeleportCardProps> = ({ text, image, locked, onClick }) => {
	const rem = useRem();
	const [imageSize, setImageSize] = useMotion(UDim2.fromScale(1, 1));

	return (
		<CanvasGroup
			size={new UDim2(1, 0, 0, rem(8))}
			cornerRadius={new UDim(0, 12)}
			event={{
				MouseEnter: () => {
					if (locked) return;
					setImageSize.spring(UDim2.fromScale(1.1, 1.1));
				},
				MouseLeave: () => {
					if (locked) return;
					setImageSize.spring(UDim2.fromScale(1, 1));
				},
			}}
		>
			<Button onClick={onClick} backgroundTransparency={1} size={UDim2.fromScale(1, 1)}>
				<Image
					position={UDim2.fromScale(0.5, 0.5)}
					anchorPoint={new Vector2(0.5, 0.5)}
					image={image}
					size={imageSize}
					scaleType="Crop"
				/>
				<Stack
					size={UDim2.fromScale(1, 1)}
					fillDirection="Vertical"
					verticalAlignment="Bottom"
					horizontalAlignment="Left"
					padding={new UDim(0, 12)}
				>
					<Text
						text={text}
						textSize={rem(32, "pixel")}
						textColor={colors.white}
						font={fonts.inter.bold}
						textAutoResize="XY"
					>
						<uistroke Color={colors.black} Thickness={2} />
					</Text>
					<uipadding PaddingLeft={new UDim(0, 8)} PaddingBottom={new UDim(0, 8)} />
				</Stack>
				{locked && (
					<Frame
						size={UDim2.fromScale(1, 1)}
						backgroundTransparency={0.4}
						backgroundColor={colors.black}
						zIndex={1}
					>
						<Stack
							size={UDim2.fromScale(1, 1)}
							fillDirection="Vertical"
							verticalAlignment="Center"
							horizontalAlignment="Center"
							padding={new UDim(0, rem(2, "pixel"))}
						>
							<Image
								position={UDim2.fromScale(0.5, 0.5)}
								anchorPoint={new Vector2(0.5, 0.5)}
								image={images.icons.lock}
								size={UDim2.fromOffset(rem(64, "pixel"), rem(64, "pixel"))}
							/>
							<Text
								text="Locked"
								textSize={rem(32, "pixel")}
								textColor={colors.white}
								font={fonts.inter.bold}
								textAutoResize="XY"
							/>
						</Stack>
					</Frame>
				)}
			</Button>
			<uistroke Color={colors.white} Thickness={2} />
		</CanvasGroup>
	);
};

export const Teleport = () => {
	const rem = useRem();
	const userId = usePlayerId();

	const zones = useSelectorCreator(selectPlayerZones, userId);
	const dispatcher = useRootStore();

	const unlockedZone = (zone: string) => {
		if (zones !== undefined) {
			return zones.unlocked.find((unlockedZone) => unlockedZone.lower() === zone) !== undefined;
		}
		return false;
	};

	return (
		<ScrollView
			fillDirection="Vertical"
			horizontalAlignment="Center"
			size={UDim2.fromScale(1, 1)}
			padding={new UDim(0, 12)}
		>
			<Text
				text="・  World 1  ・"
				textSize={rem(32, "pixel")}
				textColor={colors.white}
				font={fonts.inter.bold}
				textAutoResize="XY"
			/>
			{Object.entries(ZONES)
				.sort(([, { price: a }], [, { price: b }]) => a < b)
				.map(([zone, { name, background }]) => (
					<TeleportCard
						key={zone}
						text={name}
						image={background}
						locked={!unlockedZone(zone)}
						onClick={() => {
							if (!unlockedZone(zone) || zones?.current === zone.upper()) return;

							dispatcher.setProgress({
								progress: 0,
								status: "Loading zone...",
							});
							dispatcher.setMaxProgress(100);
							dispatcher.setLoading(true);

							task.wait(1);
							remotes.zone.teleport.fire(zone);
						}}
					/>
				))}
			<uipadding
				PaddingLeft={new UDim(0, rem(24, "pixel"))}
				PaddingRight={new UDim(0, rem(42, "pixel"))}
				PaddingTop={new UDim(0, rem(42, "pixel"))}
				PaddingBottom={new UDim(0, rem(14, "pixel"))}
			/>
		</ScrollView>
	);
};
