import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { setInterval } from "@rbxts/set-timeout";
import { boostIcons } from "@/client/constants/boost-icons";
import { useRootSelector } from "@/client/reflex/producers";
import { AttackButton } from "@/client/ui/component/attack-button";
import { Boost } from "@/client/ui/component/boost";
import { FadingFrame } from "@/client/ui/component/fading-frame";
import { Frame } from "@/client/ui/component/frame";
import { Image } from "@/client/ui/component/image";
import { SimpleButton } from "@/client/ui/component/simple-button";
import { Stack } from "@/client/ui/component/stack";
import { Text } from "@/client/ui/component/text";
import { UiScaleAspectRatio } from "@/client/ui/component/ui-scale-aspect-ratio";
import { usePlayerId } from "@/client/ui/hooks/use-player-id";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";
import { selectPlayerBoosts } from "@/shared/reflex/selectors";

export const BottomHudButtons = () => {
	const [hoveredBoosts, setHoveredBoosts] = useState<boolean[]>([]);
	const [boostTimers, setBoostTimers] = useState<number[]>([]);
	const imageRef = useRef<ImageLabel>();
	const rem = useRem();
	const id = usePlayerId();

	const { dps } = useRootSelector((state) => state.dps);
	const boosts = useRootSelector(selectPlayerBoosts(id));

	useEffect(() => {
		setHoveredBoosts(boosts?.all.map(() => false) ?? []);
	}, [boosts?.all]);

	useEffect(() => {
		const interval = setInterval(() => {
			setBoostTimers(boosts?.all.map((boost) => boost.expiresAt - os.time()) ?? []);
		}, 1);

		return () => {
			interval();
		};
	}, [boostTimers, boosts?.all]);

	return (
		<>
			<Stack
				fillDirection={Enum.FillDirection.Horizontal}
				horizontalAlignment={Enum.HorizontalAlignment.Center}
				verticalAlignment={Enum.VerticalAlignment.Bottom}
				size={UDim2.fromScale(1, 1)}
			>
				<Image
					ref={imageRef}
					anchorPoint={new Vector2(0.5, 0.5)}
					size={UDim2.fromOffset(312, 40)}
					image={images.ui.hud_bottom_curve}
				>
					<SimpleButton
						position={UDim2.fromScale(0, rem(-0.1))}
						anchorPoint={new Vector2(0.5, 0.5)}
						size={UDim2.fromOffset(96, 96)}
						color={Color3.fromRGB(255, 0, 0)}
						icon={images.icons.hand_click}
					>
						<Image
							position={UDim2.fromScale(1, 1)}
							size={UDim2.fromOffset(38, 38)}
							anchorPoint={new Vector2(1, 1)}
							image={images.icons.rebirth}
						/>
					</SimpleButton>
					<AttackButton
						position={UDim2.fromScale(0.5, rem(-0.2))}
						anchorPoint={new Vector2(0.5, 0.5)}
						size={UDim2.fromOffset(120, 120)}
						color={Color3.fromRGB(255, 255, 255)}
						icon={images.icons.hand_click}
					/>
					<SimpleButton
						position={UDim2.fromScale(1, rem(-0.1))}
						anchorPoint={new Vector2(0.5, 0.5)}
						size={UDim2.fromOffset(96, 96)}
						color={Color3.fromRGB(36, 166, 15)}
						icon={images.icons.sword_outline}
					>
						<Image
							position={UDim2.fromScale(1, 1)}
							size={UDim2.fromOffset(38, 38)}
							anchorPoint={new Vector2(1, 1)}
							image={images.icons.rebirth}
						/>
					</SimpleButton>
					<UiScaleAspectRatio />
				</Image>
				<uipadding
					PaddingBottom={new UDim(0, 16)}
					PaddingLeft={new UDim(0, 16)}
					PaddingRight={new UDim(0, 16)}
					PaddingTop={new UDim(0, 16)}
				/>
			</Stack>

			<Frame backgroundTransparency={1} size={UDim2.fromScale(1, 1)}>
				<Stack
					fillDirection={Enum.FillDirection.Horizontal}
					verticalAlignment={Enum.VerticalAlignment.Bottom}
					size={UDim2.fromScale(1, 1)}
				>
					<Stack
						fillDirection={Enum.FillDirection.Horizontal}
						horizontalAlignment={Enum.HorizontalAlignment.Left}
						verticalAlignment={Enum.VerticalAlignment.Bottom}
						padding={new UDim(0, 16)}
						size={UDim2.fromScale(0, 1)}
					>
						{boosts?.all.map((boost, index) => (
							<Boost.Root>
								<Boost.Icon
									onMouseEnter={() => {
										setHoveredBoosts((prev) => {
											prev[index] = true;
											return [...prev];
										});
									}}
									onMouseLeave={() => {
										setHoveredBoosts((prev) => {
											prev[index] = false;
											return [...prev];
										});
									}}
									image={boostIcons[boost.type]}
								>
									<Boost.Description
										active={hoveredBoosts[index]}
										description={DateTime.fromUnixTimestamp(
											boostTimers[index] ?? 0,
										).FormatUniversalTime("HH:mm:ss", "en-us")}
									/>
								</Boost.Icon>
							</Boost.Root>
						))}
						<UiScaleAspectRatio />
					</Stack>

					<Stack
						fillDirection={Enum.FillDirection.Horizontal}
						horizontalAlignment={Enum.HorizontalAlignment.Center}
						verticalAlignment={Enum.VerticalAlignment.Bottom}
						size={UDim2.fromScale(1, 1)}
					/>

					<Stack
						fillDirection={Enum.FillDirection.Horizontal}
						horizontalAlignment={Enum.HorizontalAlignment.Right}
						verticalAlignment={Enum.VerticalAlignment.Bottom}
					>
						<FadingFrame
							size={UDim2.fromOffset(200, 40)}
							anchorPoint={new Vector2(0.5, 0.5)}
							position={UDim2.fromScale(0.5, 0.5)}
						>
							<Text
								text={`${dps} DPS`}
								textColor={Color3.fromRGB(255, 255, 255)}
								textSize={24}
								size={UDim2.fromScale(1, 1)}
								anchorPoint={new Vector2(0.5, 0.5)}
								position={UDim2.fromScale(0.5, 0.5)}
							/>
						</FadingFrame>
						<UiScaleAspectRatio />
					</Stack>
					<uipadding
						PaddingBottom={new UDim(0, 16)}
						PaddingLeft={new UDim(0, 16)}
						PaddingRight={new UDim(0, 16)}
						PaddingTop={new UDim(0, 16)}
					/>
				</Stack>
			</Frame>
		</>
	);
};
