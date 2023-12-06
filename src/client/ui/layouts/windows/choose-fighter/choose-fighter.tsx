import Roact, { FunctionComponent, useState } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { fonts } from "@/client/constants/fonts";
import { springs } from "@/client/constants/springs";
import { FighterCard } from "@/client/ui/components/fighter-card";
import { Popup } from "@/client/ui/components/popup/popup";
import { ScrollView } from "@/client/ui/components/scroll-view";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { useBreakpoint } from "@/client/ui/hooks/use-breakpoint";
import { useMotion } from "@/client/ui/hooks/use-motion";
import { useRem } from "@/client/ui/hooks/use-rem";
import { INITIAL_FIGHTERS } from "@/shared/constants/initial-fighters";
import remotes from "@/shared/remotes";

type AnimatedCardProps = {
	headshot: string;
	zone: string;
	onClick?: () => void;
	onHover?: () => void;
	onLeave?: () => void;
	discovered?: boolean;
	selected?: boolean;
};

const AnimatedCard: FunctionComponent<AnimatedCardProps> = ({
	headshot,
	zone,
	onHover,
	onClick,
	onLeave,
	discovered,
	selected,
}) => {
	const breakpoint = useBreakpoint();
	const rem = useRem();
	const initialSizeX = breakpoint === "mobile" ? rem(150, "pixel") : rem(200, "pixel");
	const initialSizeY = breakpoint === "mobile" ? rem(200, "pixel") : rem(250, "pixel");
	const [size, setSize] = useMotion(UDim2.fromOffset(initialSizeX, initialSizeY));

	const onCardHover = () => {
		setSize.spring(UDim2.fromOffset(initialSizeX * 1.1, initialSizeY * 1.1), springs.gentle);
		onHover?.();
	};

	const onCardLeave = () => {
		setSize.spring(UDim2.fromOffset(initialSizeX, initialSizeY), springs.gentle);
		onLeave?.();
	};

	return (
		<FighterCard
			size={size}
			headshot={headshot}
			zone={zone}
			onClick={onClick}
			onHover={onCardHover}
			onLeave={onCardLeave}
			discovered={discovered}
			active={selected}
		/>
	);
};

export const ChooseFighter = () => {
	const rem = useRem();
	const breakpoint = useBreakpoint();

	const [selectedFighter, setSelectedFighter] = useState<string | undefined>(undefined);
	const [showPopup, setShowPopup] = useState(false);

	return (
		<>
			<Stack
				fillDirection="Vertical"
				verticalAlignment="Center"
				horizontalAlignment="Center"
				size={UDim2.fromScale(1, 1)}
				padding={new UDim(0, rem(24, "pixel"))}
			>
				<Text
					text="Choose your first fighter"
					font={fonts.gotham.bold}
					textSize={breakpoint === "mobile" ? rem(24, "pixel") : rem(48, "pixel")}
					textColor={colors.white}
					textAutoResize="XY"
				/>
				<ScrollView
					fillDirection="Horizontal"
					verticalAlignment="Center"
					horizontalAlignment="Center"
					padding={new UDim(0, rem(24, "pixel"))}
					size={UDim2.fromScale(1, 0.6)}
					clipsDescendants
				>
					{INITIAL_FIGHTERS.map((fighter) => (
						<AnimatedCard
							onClick={() => {
								setShowPopup(true);
								setSelectedFighter(fighter.name);
							}}
							headshot={fighter.name}
							zone={fighter.zone}
							discovered
							selected={selectedFighter === fighter.name}
						/>
					))}
				</ScrollView>
			</Stack>
			{showPopup && (
				<Popup.Root
					size={breakpoint === "mobile" ? UDim2.fromScale(0.6, 0.6) : UDim2.fromScale(0.6, 0.4)}
					gradient={
						new ColorSequence([
							new ColorSequenceKeypoint(0, Color3.fromHex("#243aa8")),
							new ColorSequenceKeypoint(1, Color3.fromHex("#1a2b65")),
						])
					}
					onClose={() => {
						setShowPopup(false);
					}}
				>
					<Popup.Body>
						<Popup.Title
							size={UDim2.fromScale(1, 0.4)}
							autoSize={"Y"}
							text="Are you sure you want to choose\nthis fighter?"
						/>
						<Popup.Description text="You can't change your fighter after this." />
					</Popup.Body>
					<Popup.Actions>
						<Popup.ActionButton
							text="Cancel"
							onClick={() => {
								setSelectedFighter(undefined);
							}}
						/>
						<Popup.ActionButton
							text="Confirm"
							preventClose
							onClick={() => {
								if (selectedFighter === undefined) return;

								remotes.firstTime.select.fire(selectedFighter);
							}}
						/>
					</Popup.Actions>
				</Popup.Root>
			)}
		</>
	);
};
