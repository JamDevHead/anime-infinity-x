import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { FighterCard } from "@/client/ui/components/fighter-card";
import { useRem } from "@/client/ui/hooks/use-rem";
import { selectStoreContent } from "@/shared/store/store/store-selectors";

export function ContentCard({ contentId }: { contentId: string }) {
	const rem = useRem();
	const info = useSelectorCreator(selectStoreContent, contentId);

	if (info === undefined) return <></>;

	return (
		<FighterCard
			headshot={info.content.name}
			zone={info.content.zone}
			size={UDim2.fromOffset(rem(128, "pixel"), rem(158, "pixel"))}
			padding={rem(8, "pixel")}
			discovered
		/>
	);
}
