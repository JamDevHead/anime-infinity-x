import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Windows } from "@/client/constants/windows";
import { Window } from "@/client/ui/components/window";
import { ChooseFighter } from "@/client/ui/layouts/windows/choose-fighter/choose-fighter";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	return (
		<RootProvider>
			<Window title={Windows.chooseFighter.title} size={Windows.chooseFighter.size} hiddenClose>
				<ChooseFighter />
			</Window>
		</RootProvider>
	);
});
