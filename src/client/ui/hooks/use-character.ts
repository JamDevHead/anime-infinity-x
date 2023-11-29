import { useEventListener } from "@rbxts/pretty-react-hooks";
import { useBinding } from "@rbxts/roact";
import { Players } from "@rbxts/services";

export function useCharacter(player = Players.LocalPlayer) {
	const [character, setCharacter] = useBinding(player?.Character);

	useEventListener(player?.CharacterAdded, (_character) => {
		setCharacter(_character);
	});

	useEventListener(player?.CharacterRemoving, () => {
		setCharacter(undefined);
	});

	return character;
}
