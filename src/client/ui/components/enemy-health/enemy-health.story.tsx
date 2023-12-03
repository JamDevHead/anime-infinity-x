import { hoarcekat, useCamera, useEventListener, useUpdate } from "@rbxts/pretty-react-hooks";
import { createPortal } from "@rbxts/react-roblox";
import Roact, { useRef } from "@rbxts/roact";
import { RunService, Workspace } from "@rbxts/services";
import { EnemyHealth } from "@/client/ui/components/enemy-health/enemy-health";

export = hoarcekat(() => {
	const camera = useCamera();

	const origin = camera.CFrame.Position.add(camera.CFrame.LookVector.mul(3));
	const humanoidRef = useRef<Humanoid>();
	const timer = useRef(0);
	const update = useUpdate();

	useEventListener(RunService.Heartbeat, (dt) => {
		timer.current += dt;

		if (timer.current >= 0.2) {
			if (!humanoidRef.current) {
				return;
			}

			timer.current = 0;

			if (humanoidRef.current.Health <= 10) {
				timer.current = -7;
				humanoidRef.current.Health = 0;
				task.wait(4);
				if (humanoidRef.current) {
					humanoidRef.current.Health = 100;
				}
			} else {
				humanoidRef.current.TakeDamage(math.random(3, 50));
			}

			update();
		}
	});

	return (
		<>
			{createPortal(<humanoid ref={humanoidRef} />, Workspace.Terrain)}
			{humanoidRef.current &&
				createPortal(
					<part Archivable={false} Size={Vector3.one} Position={origin} Anchored={true}>
						<EnemyHealth enemy={{ humanoid: humanoidRef.current }} />
					</part>,
					Workspace.Terrain,
				)}
		</>
	);
});
