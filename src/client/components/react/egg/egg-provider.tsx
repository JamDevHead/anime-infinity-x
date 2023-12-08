import Roact from "@rbxts/roact";
import { Egg } from "@/client/components/react/egg/egg";
import { useRootSelector } from "@/client/store";
import { selectEggPurchases } from "@/client/store/egg-queue/egg-queue-selectors";

export function EggProvider() {
	const eggPurchases = useRootSelector(selectEggPurchases);

	return (
		<>
			{eggPurchases.map((purchasedFighter) => (
				<Egg fighter={purchasedFighter} />
			))}
		</>
	);
}
