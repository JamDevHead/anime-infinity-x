import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { FighterCard } from "@/client/ui/components/fighter-card";
import { selectStoreContent } from "@/shared/store/store/store-selectors";

export function ContentCard({ contentId }: { contentId: string }) {
	const info = useSelectorCreator(selectStoreContent, contentId);

	if (!info) {
		return <></>;
	}

	return <FighterCard headshot={info.content.name} zone={info.content.zone} />;
}
