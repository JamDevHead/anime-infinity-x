import Object from "@rbxts/object-utils";
import { md5 } from "@rbxts/rbxts-hashlib";
import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact, { FunctionComponent, useEffect, useMemo } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { useRootSelector, useRootStore } from "@/client/store";
import { selectEggUiStatus } from "@/client/store/egg-ui/egg-ui-selectors";
import { selectHudVisible } from "@/client/store/hud/hud-selectors";
import { BindingButton } from "@/client/ui/components/binding-button";
import { FighterCard } from "@/client/ui/components/fighter-card";
import { Frame } from "@/client/ui/components/frame";
import { Grid } from "@/client/ui/components/grid";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { useMotion } from "@/client/ui/hooks/use-motion";
import { usePlayerId } from "@/client/ui/hooks/use-player-id";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";
import { FighterRarity } from "@/shared/constants/rarity";
import { selectPlayerIndex } from "@/shared/store/players";
import { selectPlayerCurrentZone } from "@/shared/store/players/zones/zones-selectors";

type EggLayoutProps = {
	size?: UDim2;
};

export const EggLayout: FunctionComponent<EggLayoutProps> = ({ size }) => {
	const rem = useRem();
	const userId = usePlayerId();
	const currentZone = useSelectorCreator(selectPlayerCurrentZone, userId);
	const playerIndex = useSelectorCreator(selectPlayerIndex, userId);
	const dispatcher = useRootStore();
	const opened = useRootSelector(selectEggUiStatus);
	const hudVisible = useRootSelector(selectHudVisible);

	const [positionMotion, setPositionMotion] = useMotion<UDim2>(UDim2.fromScale(0.5, -1));

	const rarityByZone = useMemo(
		() => FighterRarity[(currentZone?.lower() ?? "nrt") as keyof typeof FighterRarity],
		[currentZone],
	);

	useEffect(() => {
		setPositionMotion.spring(opened ? UDim2.fromScale(0.5, 0.3) : UDim2.fromScale(0.5, -1));
	}, [opened, setPositionMotion]);

	if (!hudVisible) {
		return <></>;
	}
	const buyEgg = () => {
		if (!opened || !setPositionMotion.isComplete()) return;
		dispatcher.addToEggQueue(currentZone ?? "NRT");
	};

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			backgroundTransparency={1}
			position={positionMotion}
			size={size ?? UDim2.fromOffset(rem(400, "pixel"), rem(400, "pixel"))}
		>
			<Stack fillDirection="Vertical" size={UDim2.fromScale(1, 1)}>
				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					backgroundColor={colors.white}
					position={UDim2.fromScale(0.5, 0.5)}
					size={UDim2.fromScale(1, 1)}
					image={images.ui.egg_background}
					cornerRadius={new UDim(0, 8)}
				>
					<uistroke Color={colors.black} Thickness={4} />
					<Grid
						backgroundTransparency={1}
						anchorPoint={new Vector2(0.5, 0.5)}
						position={UDim2.fromScale(0.5, 0.5)}
						size={UDim2.fromScale(1, 1)}
						cornerRadius={new UDim(0, 4)}
						cellSize={UDim2.fromOffset(rem(96, "pixel"), rem(96, "pixel"))}
						horizontalAlignment="Center"
						verticalAlignment="Center"
						sortOrder={Enum.SortOrder.LayoutOrder}
					>
						{Object.entries<Record<string, number>>(rarityByZone)
							.sort(([, a], [, b]) => a > b)
							.map(([key, value]) => {
								const characterUUID = md5(key);

								return (
									<FighterCard
										headshot={key}
										zone={currentZone ?? "nrt"}
										padding={4}
										discovered={playerIndex?.discovered.includes(characterUUID)}
										description={`${value}%`}
									/>
								);
							})}
						<uistroke Color={colors.white} Thickness={4}>
							<uigradient
								Transparency={
									new NumberSequence([
										new NumberSequenceKeypoint(0, 0),
										new NumberSequenceKeypoint(0.5, 1),
										new NumberSequenceKeypoint(1, 1),
									])
								}
								Rotation={-90}
							/>
						</uistroke>
					</Grid>
					<uipadding
						PaddingBottom={new UDim(0, rem(4, "pixel"))}
						PaddingLeft={new UDim(0, rem(4, "pixel"))}
						PaddingRight={new UDim(0, rem(4, "pixel"))}
						PaddingTop={new UDim(0, rem(4, "pixel"))}
					/>
				</Image>

				<uipadding
					PaddingBottom={new UDim(0, rem(20, "pixel"))}
					PaddingLeft={new UDim(0, rem(20, "pixel"))}
					PaddingRight={new UDim(0, rem(20, "pixel"))}
					PaddingTop={new UDim(0, rem(20, "pixel"))}
				/>
			</Stack>

			<Stack
				fillDirection="Horizontal"
				horizontalAlignment="Center"
				verticalAlignment="Bottom"
				position={UDim2.fromScale(0.5, 1.2)}
				padding={new UDim(0, rem(12, "pixel"))}
				sortOrder={Enum.SortOrder.LayoutOrder}
			>
				<BindingButton
					text="Open"
					binding={Enum.KeyCode.E}
					onClick={buyEgg}
					size={UDim2.fromOffset(rem(72, "pixel"), rem(72, "pixel"))}
				/>
				<BindingButton
					text="Auto"
					binding={Enum.KeyCode.Q}
					size={UDim2.fromOffset(rem(72, "pixel"), rem(72, "pixel"))}
				/>
				<BindingButton
					icon={images.icons.boost_colored}
					color={"#132913"}
					borderColor={"#65d666"}
					iconRotation={45}
					binding={Enum.KeyCode.R}
					size={UDim2.fromOffset(rem(72, "pixel"), rem(72, "pixel"))}
				/>
				<BindingButton
					icon={images.icons.gift_colored}
					color={"#291316"}
					borderColor={"#e62e49"}
					binding={Enum.KeyCode.T}
					size={UDim2.fromOffset(rem(72, "pixel"), rem(72, "pixel"))}
				/>
			</Stack>
		</Frame>
	);
};
