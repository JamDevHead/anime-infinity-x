import { useMountEffect } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { useMotion } from "@/client/ui/hooks/use-motion";
import { Drop } from "@/shared/store/enemies/drops";

const RNG = new Random();

export function EnemyDrop({ origin }: { drop: Drop; origin: Vector3 }) {
	const [position, positionMotion] = useMotion(origin);

	useMountEffect(() => {
		const max = 5;
		const min = -5;
		const x = RNG.NextNumber() * (max - min) + min;
		const y = RNG.NextNumber() * (max - min) + min;

		const goal = origin.add(new Vector3(x, -3, y));

		positionMotion.spring(goal, { damping: 0.4, impulse: 0.009 });
	});

	return <part Size={Vector3.one} Position={position} Anchored></part>;
}
