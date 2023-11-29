import { hoarcekat, useCamera } from "@rbxts/pretty-react-hooks";
import { createPortal } from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { HttpService, Workspace } from "@rbxts/services";
import { EnemyDrop } from "@/client/components/react/enemy-drop/index";
import { Drop } from "@/shared/store/enemies/drops";

function generateDrops() {
	const drops = [] as Drop[];

	for (const _ of $range(1, 10)) {
		const id = HttpService.GenerateGUID(false);
		drops.push({
			owner: "-1",
			enemyId: "123",
			quantity: 10,
			id,
		} satisfies Drop);
	}

	return drops;
}

export = hoarcekat(() => {
	const camera = useCamera();

	const origin = camera.CFrame.Position.add(camera.CFrame.LookVector.mul(3));
	const drops = generateDrops();

	return (
		<>
			{createPortal(<attachment Position={origin} Visible />, Workspace.Terrain)}
			{drops.map((drop) => createPortal(<EnemyDrop drop={drop} origin={origin} />, Workspace.Terrain))}
		</>
	);
});
