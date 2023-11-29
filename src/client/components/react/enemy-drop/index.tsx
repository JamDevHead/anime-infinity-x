import { useEventListener, useMountEffect } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { useCharacter } from "@/client/ui/hooks/use-character";
import { useMotion } from "@/client/ui/hooks/use-motion";
import { Drop } from "@/shared/store/enemies/drops";

const RNG = new Random();

export function EnemyDrop({ origin }: { drop: Drop; origin: Vector3 }) {
	const [position, positionMotion] = useMotion(origin);
	const character = useCharacter();

	useMountEffect(() => {
		const max = 5;
		const min = -5;
		const x = RNG.NextNumber() * (max - min) + min;
		const y = RNG.NextNumber() * (max - min) + min;

		const goal = origin.add(new Vector3(x, -4, y));

		positionMotion.spring(goal, { damping: 0.4, impulse: 0.009 });
	});

	useEventListener(RunService.Heartbeat, () => {
		const characterModel = character.getValue();

		if (!characterModel) {
			return;
		}

		const target = characterModel.GetPivot().Position;
		const distance = target.sub(position.getValue());

		if (distance.Magnitude > 6) {
			return;
		}

		positionMotion.spring(target, { damping: 0.3, impulse: 0.002 });
	});

	return (
		<part
			CanCollide={false}
			CanQuery={false}
			CanTouch={false}
			Size={Vector3.one}
			Position={position}
			Anchored
		></part>
	);
}
