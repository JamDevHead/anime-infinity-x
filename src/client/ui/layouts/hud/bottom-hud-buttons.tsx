import { useEventListener } from "@rbxts/pretty-react-hooks";
import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { setInterval } from "@rbxts/set-timeout";
import { boostIcons } from "@/client/constants/boost-icons";
import { useRootStore } from "@/client/store";
import { selectSpecificPerk } from "@/client/store/perks";
import { AttackButton } from "@/client/ui/components/attack-button";
import { Boost } from "@/client/ui/components/boost";
import { FadingFrame } from "@/client/ui/components/fading-frame";
import { Frame } from "@/client/ui/components/frame";
import { Image } from "@/client/ui/components/image";
import { SimpleButton } from "@/client/ui/components/simple-button";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { usePlayerId } from "@/client/ui/hooks/use-player-id";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";
import { selectPlayerDamagePerSecond } from "@/shared/store/dps";
import { selectPlayerBoosts } from "@/shared/store/players";

function AutoFarmButton() {
	const dispatcher = useRootStore();
	const autofarm = useSelectorCreator(selectSpecificPerk, "autofarm");
	const rem = useRem();
	const [rotation, setRotation] = useState(0);

	useEventListener(
		RunService.Heartbeat,
		(deltaTime) => {
			setRotation(rotation + math.deg(deltaTime) * 5);
		},
		{ connected: autofarm },
	);

	return (
		<SimpleButton
			position={UDim2.fromScale(1, -0.8)}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={UDim2.fromOffset(rem(96, "pixel"), rem(96, "pixel"))}
			color={autofarm ? Color3.fromHex("#24a60f") : Color3.fromHex("#ff0000")}
			icon={images.icons.sword_outline}
			onClick={() => dispatcher.toggleAutofarm()}
		>
			<Image
				position={UDim2.fromScale(1, 1)}
				size={UDim2.fromOffset(rem(38, "pixel"), rem(38, "pixel"))}
				anchorPoint={new Vector2(1, 1)}
				image={images.icons.rebirth}
				rotation={rotation}
			/>
		</SimpleButton>
	);
}

function AutoClickButton() {
	const dispatcher = useRootStore();
	const autoclick = useSelectorCreator(selectSpecificPerk, "autoclick");
	const rem = useRem();
	const [rotation, setRotation] = useState(0);

	useEventListener(
		RunService.Heartbeat,
		(deltaTime) => {
			setRotation(rotation + math.deg(deltaTime) * 5);
		},
		{ connected: autoclick },
	);

	return (
		<SimpleButton
			position={UDim2.fromScale(0, -0.8)}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={UDim2.fromOffset(rem(96, "pixel"), rem(96, "pixel"))}
			color={autoclick ? Color3.fromHex("#24a60f") : Color3.fromHex("#ff0000")}
			icon={images.icons.hand_click}
			onClick={() => dispatcher.toggleAutoclick()}
		>
			<Image
				position={UDim2.fromScale(1, 1)}
				size={UDim2.fromOffset(rem(38, "pixel"), rem(38, "pixel"))}
				anchorPoint={new Vector2(1, 1)}
				image={images.icons.rebirth}
				rotation={rotation}
			/>
		</SimpleButton>
	);
}

export const BottomHudButtons = () => {
	const [hoveredBoosts, setHoveredBoosts] = useState<boolean[]>([]);
	const [boostTimers, setBoostTimers] = useState<number[]>([]);
	const imageRef = useRef<ImageLabel>();
	const rem = useRem();
	const id = usePlayerId();

	const dps = useSelectorCreator(selectPlayerDamagePerSecond, id);
	const boosts = useSelectorCreator(selectPlayerBoosts, id);

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
					size={UDim2.fromOffset(rem(312, "pixel"), rem(40, "pixel"))}
					image={images.ui.hud_bottom_curve}
				>
					<AutoClickButton />

					<AttackButton
						position={UDim2.fromScale(0.5, -1.7)}
						anchorPoint={new Vector2(0.5, 0.5)}
						size={UDim2.fromOffset(rem(120, "pixel"), rem(120, "pixel"))}
						color={Color3.fromRGB(255, 255, 255)}
						icon={images.icons.hand_click}
					/>

					<AutoFarmButton />
				</Image>
				<uipadding
					PaddingBottom={new UDim(0, rem(16, "pixel"))}
					PaddingLeft={new UDim(0, rem(16, "pixel"))}
					PaddingRight={new UDim(0, rem(16, "pixel"))}
					PaddingTop={new UDim(0, rem(16, "pixel"))}
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
						padding={new UDim(0, rem(16, "pixel"))}
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
							size={UDim2.fromOffset(rem(200, "pixel"), rem(40, "pixel"))}
							anchorPoint={new Vector2(0.5, 0.5)}
							position={UDim2.fromScale(0.5, 0.5)}
						>
							<Text
								text={`${dps ?? 0} DPS`}
								textColor={Color3.fromRGB(255, 255, 255)}
								textSize={rem(24, "pixel")}
								size={UDim2.fromScale(1, 1)}
								anchorPoint={new Vector2(0.5, 0.5)}
								position={UDim2.fromScale(0.5, 0.5)}
							/>
						</FadingFrame>
					</Stack>
					<uipadding
						PaddingBottom={new UDim(0, rem(16, "pixel"))}
						PaddingLeft={new UDim(0, rem(16, "pixel"))}
						PaddingRight={new UDim(0, rem(16, "pixel"))}
						PaddingTop={new UDim(0, rem(16, "pixel"))}
					/>
				</Stack>
			</Frame>
		</>
	);
};
