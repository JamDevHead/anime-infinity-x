import Roact, { useCallback, useEffect, useRef, useState } from "@rbxts/roact";
import { Egg } from "@/client/components/react/egg/egg";
import { FighterModelCard } from "@/client/components/react/fighter-model-card/fighter-model-card";
import { SoundController } from "@/client/controllers/sound-controller";
import { useRootSelector, useRootStore } from "@/client/store";
import { selectEggQueue } from "@/client/store/egg-queue/egg-queue-selectors";
import remotes from "@/shared/remotes";
import { PlayerFighter } from "@/shared/store/players";

export function EggProvider({ soundController }: { soundController: SoundController }) {
	const eggQueue = useRootSelector(selectEggQueue);
	const dispatcher = useRootStore();
	const queueList = useRef<string[]>();
	const [currentFighter, setCurrentFighter] = useState<PlayerFighter | undefined>();

	const entityAdded = useCallback(
		(eggZone: string) => {
			print("egg added", eggZone);
			const doesNotHaveEgg = (entities: string[]) => {
				return !entities.includes(eggZone);
			};

			dispatcher.setHudVisible(false);

			dispatcher.once(selectEggQueue, doesNotHaveEgg, async () => {
				print("egg removed", eggZone);
				const fighter = await remotes.eggs.open.request(eggZone).timeout(10);

				if (fighter) {
					soundController.tracker.play("reward");
					setCurrentFighter(fighter);
					task.delay(2, () => {
						setCurrentFighter(undefined);
						dispatcher.setHudVisible(true);
					});
				} else {
					setCurrentFighter(undefined);
					dispatcher.setHudVisible(true);
				}
			});
		},
		[dispatcher, soundController.tracker],
	);

	const onEggQueueChanged = useCallback(
		(current: string[], previous: string[]) => {
			current.forEach((eggZone) => {
				if (previous.includes(eggZone)) {
					return;
				}
				entityAdded(eggZone);
			});
		},
		[entityAdded],
	);

	useEffect(() => {
		print("egg queue changed", eggQueue, queueList.current);

		onEggQueueChanged(eggQueue, queueList.current ?? []);
		queueList.current = eggQueue;
	}, [dispatcher, eggQueue, onEggQueueChanged]);

	return (
		<>
			{eggQueue.map((eggZone) => (
				<Egg eggZoneName={eggZone} />
			))}
			{currentFighter && <FighterModelCard fighter={currentFighter} />}
		</>
	);
}
