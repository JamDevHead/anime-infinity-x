import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { Windows } from "@/client/constants/windows";
import { Frame } from "@/client/ui/components/frame";
import { Window } from "@/client/ui/components/window";
import { usePlayerId } from "@/client/ui/hooks/use-player-id";
import { ChooseFighter } from "@/client/ui/layouts/windows/choose-fighter/choose-fighter";
import { selectPlayerInfo } from "@/shared/store/players";

export const FirstTime = () => {
	const playerId = usePlayerId();
	const info = useSelectorCreator(selectPlayerInfo, playerId);

	if (!info?.firstTime) return <></>;

	return (
		<Frame size={UDim2.fromScale(1, 1)} backgroundTransparency={1}>
			<Window title={Windows.chooseFighter.title} size={Windows.chooseFighter.size} hiddenClose>
				<ChooseFighter />
			</Window>
		</Frame>
	);
};
