import { useDebounceCallback, useEventListener, useMountEffect } from "@rbxts/pretty-react-hooks";
import Roact, { useMemo, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { store } from "@/client/store";
import { Image } from "@/client/ui/components/image";
import { useCharacter } from "@/client/ui/hooks/use-character";
import { useMotion } from "@/client/ui/hooks/use-motion";
import { images } from "@/shared/assets/images";
import remotes from "@/shared/remotes";
import { Drop } from "@/shared/store/enemies/drops";

const RNG = new Random();

export function EnemyDrop({ drop }: { drop: Drop }) {
	const origin = useMemo(() => drop.origin, [drop]);
	const [position, positionMotion] = useMotion(origin);
	const character = useCharacter();
	const partRef = useRef<Part>();
	const attachment0Ref = useRef<Attachment>();
	const attachment1Ref = useRef<Attachment>();
	const [trailEnabled, setTrailEnabled] = useState(false);

	const collectDebounce = useDebounceCallback(
		() => {
			store.removeDrop(drop.id);
			remotes.drops.collect.fire(drop.id);
		},
		{ wait: 3, leading: true, trailing: true, maxWait: 3 },
	);

	useMountEffect(() => {
		const max = 7;
		const min = -7;
		const x = RNG.NextNumber() * (max - min) + min;
		const y = RNG.NextNumber() * (max - min) + min;

		const goal = origin.add(new Vector3(x, -4, y));

		positionMotion.spring(goal, { damping: 0.4, impulse: 0.009 });
		task.delay(0.5, () => setTrailEnabled(true));
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

		if (distance < 1) {
			collectDebounce.run();
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
			Transparency={1}
			Anchored
		>
			<billboardgui MaxDistance={500} Size={UDim2.fromScale(2, 2)} Brightness={2} LightInfluence={0}>
				<Image image={images.icons.coin} size={UDim2.fromScale(1, 1)} />
			</billboardgui>

			<trail
				Enabled={trailEnabled}
				Attachment0={attachment0Ref}
				Attachment1={attachment1Ref}
				FaceCamera={true}
				Lifetime={0.5}
				WidthScale={
					new NumberSequence([new NumberSequenceKeypoint(0, 0.5), new NumberSequenceKeypoint(1, 0.5)])
				}
			/>

			<attachment ref={attachment0Ref} Position={Vector3.yAxis.mul(1)} />
			<attachment ref={attachment1Ref} Position={Vector3.yAxis.mul(-1)} />
		</part>
	);
}