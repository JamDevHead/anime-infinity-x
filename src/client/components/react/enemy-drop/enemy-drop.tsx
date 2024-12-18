import { useDebounceCallback, useEventListener, useLifetime } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect, useMemo, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { store } from "@/client/store";
import { Image } from "@/client/ui/components/image";
import { useCharacter } from "@/client/ui/hooks/use-character";
import { useMotion } from "@/client/ui/hooks/use-motion";
import { images } from "@/shared/assets/images";
import { SoundTracker } from "@/shared/lib/sound-tracker";
import remotes from "@/shared/remotes";
import { Drop } from "@/shared/store/enemies/drops";
import { getEnemyModelByUid } from "@/shared/utils/enemies";

const RNG = new Random();

export function EnemyDrop({ drop, soundTracker }: { drop: Drop; soundTracker: SoundTracker }) {
	const origin = useMemo(() => drop.origin, [drop]);
	const enemy = useMemo(() => getEnemyModelByUid(drop.enemyId), [drop.enemyId]);
	const [position, positionMotion] = useMotion(origin);
	const character = useCharacter();
	const partRef = useRef<Part>();
	const attachment0Ref = useRef<Attachment>();
	const attachment1Ref = useRef<Attachment>();
	const lifetime = useLifetime();
	const [trailEnabled, setTrailEnabled] = useState(false);
	const root = useMemo(
		() => character.getValue()?.FindFirstChild("HumanoidRootPart") as Part | undefined,
		[character],
	);

	const collectDebounce = useDebounceCallback(
		() => {
			if (root) {
				soundTracker.play("reward", root, { Volume: 0.1 });
			}

			store.removeDrop(drop.id);
			remotes.drops.collect.fire(drop.id);
		},
		{ wait: 3, leading: true, trailing: true, maxWait: 3 },
	);

	useEffect(() => {
		if (!enemy) {
			return;
		}

		const max = 7;
		const min = -7;
		const x = RNG.NextNumber() * (max - min) + min;
		const y = RNG.NextNumber() * (max - min) + min;
		const height = enemy.GetBoundingBox()[1].Y;
		const scale = enemy.GetScale();

		const goal = origin.add(new Vector3(x, -height / 2.05 + 0.5 + (scale >= 5 ? (scale % 5) + 0.5 : 0), y));

		positionMotion.spring(goal, { damping: 0.4, impulse: 0.009 });
		task.delay(0.5, () => setTrailEnabled(true));
	}, [enemy, origin, positionMotion]);

	useEventListener(RunService.Heartbeat, () => {
		if (!root) {
			return;
		}

		if (lifetime.getValue() < 0.8) {
			return;
		}

		const target = root.Position;
		const distance = target.sub(position.getValue()).Magnitude;

		if (distance > 6) {
			return;
		}

		positionMotion.spring(target, {
			tension: 400,
			friction: 15,
		});

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
				{drop.quantity > 1 && (
					<textlabel
						AnchorPoint={new Vector2(1, 0)}
						Text={`${drop.quantity}x`}
						Size={UDim2.fromScale(0.7, 0.7)}
						Position={UDim2.fromScale(1.13, -0.1)}
						BackgroundTransparency={1}
						Font={Enum.Font.Kalam}
						TextStrokeTransparency={0.35}
						TextColor3={Color3.fromHex("#dfd0d0")}
						TextScaled
					>
						<uitextsizeconstraint MaxTextSize={50} />
					</textlabel>
				)}
			</billboardgui>

			<trail
				Enabled={trailEnabled}
				Attachment0={attachment0Ref}
				Attachment1={attachment1Ref}
				FaceCamera={true}
				Lifetime={0.5}
				Transparency={new NumberSequence(0.3)}
				Color={
					new ColorSequence([
						new ColorSequenceKeypoint(0, Color3.fromHex("#ffeb10")),
						new ColorSequenceKeypoint(1, Color3.fromHex("#ffe621")),
					])
				}
				WidthScale={
					new NumberSequence([
						new NumberSequenceKeypoint(0, 0.05),
						new NumberSequenceKeypoint(0.5, 0.5),
						new NumberSequenceKeypoint(1, 0.05),
					])
				}
			/>

			<attachment ref={attachment0Ref} Position={Vector3.yAxis.mul(1)} />
			<attachment ref={attachment1Ref} Position={Vector3.yAxis.mul(-1)} />
		</part>
	);
}
