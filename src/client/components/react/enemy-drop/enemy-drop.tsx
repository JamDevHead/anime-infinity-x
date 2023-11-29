import { useEventListener, useMountEffect, useThrottleCallback } from "@rbxts/pretty-react-hooks";
import Roact, { useMemo, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { useCharacter } from "@/client/ui/hooks/use-character";
import { useMotion } from "@/client/ui/hooks/use-motion";
import remotes from "@/shared/remotes";
import { Drop } from "@/shared/store/enemies/drops";

const RNG = new Random();

export function EnemyDrop({ drop }: { drop: Drop }) {
	const origin = useMemo(() => drop.origin, [drop]);
	const [position, positionMotion] = useMotion(origin);
	const character = useCharacter();
	const [debug, setDebug] = useState(false);
	const partRef = useRef<Part>();

	const collectThrottle = useThrottleCallback(
		() => {
			setDebug(true);
			remotes.drops.collect.fire(drop.id);
		},
		{ wait: 5 },
	);

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
		const distance = target.sub(position.getValue()).Magnitude;

		if (distance > 6) {
			return;
		}

		positionMotion.spring(target, { damping: 0.3, impulse: 0.002 });

		if (distance < 2.5) {
			collectThrottle.run();
		}
	});

	return (
		<part
			ref={partRef}
			CanCollide={false}
			CanQuery={false}
			CanTouch={false}
			Size={Vector3.one}
			Position={position}
			Anchored
		>
			<selectionbox Adornee={partRef} Color3={debug ? Color3.fromHex("#63e82e") : Color3.fromHex("#de2222")} />
		</part>
	);
}
