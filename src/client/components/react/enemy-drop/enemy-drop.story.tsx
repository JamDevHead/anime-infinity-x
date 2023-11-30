import { hoarcekat, useCamera } from "@rbxts/pretty-react-hooks";
import { createPortal } from "@rbxts/react-roblox";
import Roact, { useMemo } from "@rbxts/roact";
import { HttpService, Workspace } from "@rbxts/services";
import { EnemyDrop } from "@/client/components/react/enemy-drop";
import { SoundTracker } from "@/shared/lib/sound-tracker";
import { Drop } from "@/shared/store/enemies/drops";

function generateDrops(origin: Vector3) {
	const drops = [] as Drop[];

	for (const _ of $range(1, 10)) {
		const id = HttpService.GenerateGUID(false);
		drops.push({
			owner: "-1",
			enemyId: "123",
			quantity: 10,
			type: "Gold",
			origin,
			id,
		} satisfies Drop);
	}

	return drops;
}

export = hoarcekat(() => {
	const camera = useCamera();

	const origin = camera.CFrame.Position.add(camera.CFrame.LookVector.mul(3));
	const drops = generateDrops(origin);
	const soundTracker = useMemo(() => new SoundTracker(), []);

	return (
		<>
			{createPortal(<attachment Position={origin} Visible />, Workspace.Terrain)}
			{drops.map((drop) =>
				createPortal(<EnemyDrop soundTracker={soundTracker} drop={drop} />, Workspace.Terrain),
			)}
		</>
	);
});
