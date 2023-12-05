import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { FighterModelCard } from "@/client/components/react/fighter-model-card/fighter-model-card";

export = hoarcekat(() => {
	return (
		<FighterModelCard
			fighter={{
				name: "Naro",
				zone: "NRT",
			}}
		/>
	);
});
