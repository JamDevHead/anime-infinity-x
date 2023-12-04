import { hoarcekat, useCamera, useEventListener, useUpdate } from "@rbxts/pretty-react-hooks";
import { createPortal } from "@rbxts/react-roblox";
import Roact, { useMemo, useRef } from "@rbxts/roact";
import { RunService, Workspace } from "@rbxts/services";
import { EnemyHealth } from "@/client/components/react/enemy-health/enemy-health";

interface EnemyModel extends Model {
	humanoid: Humanoid;
}

export = hoarcekat(() => {
	const camera = useCamera();

	const origin = useMemo(
		() => camera.CFrame.Position.add(camera.CFrame.LookVector.mul(3).sub(camera.CFrame.UpVector.mul(2))),
		[camera],
	);
	const enemyRef = useRef<EnemyModel>();
	const timer = useRef(0);
	const update = useUpdate();

	useEventListener(RunService.Heartbeat, (dt) => {
		timer.current += dt;

		if (timer.current >= 0.2) {
			if (!enemyRef.current) {
				return;
			}

			timer.current = 0;
			const humanoid = enemyRef.current.humanoid;

			if (humanoid.Health <= 10) {
				timer.current = -7;
				humanoid.Health = 0;
				task.wait(4);
				if (humanoid) {
					humanoid.Health = 100;
				}
			} else {
				humanoid.TakeDamage(math.random(3, 50));
			}
		}

		update();
	});

	return (
		<>
			{createPortal(
				<model ref={enemyRef} key={"Enemy"}>
					<humanoid key={"humanoid"} />
				</model>,
				Workspace.Terrain,
			)}
			{enemyRef.current &&
				createPortal(
					<part Archivable={false} Size={Vector3.one} Position={origin} Anchored={true}>
						<EnemyHealth enemy={{ humanoid: enemyRef.current.humanoid, instance: enemyRef.current }} />
					</part>,
					Workspace.Terrain,
				)}
		</>
	);
});
