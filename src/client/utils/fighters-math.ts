import Object from "@rbxts/object-utils";
import { Workspace } from "@rbxts/services";
import { Enemy } from "@/client/components/enemy-component";

export function getFormation(troopAmount: number, spacing = 4) {
	const rows = math.ceil((math.sqrt(8 * troopAmount + 1) - 1) / 2);

	return generateTriangleFormation(rows, spacing);
}

export function generateTriangleFormation(rows: number, spacing: number) {
	const formationShape: Vector3[] = [];
	const halfWidth = ((rows - 1) * spacing) / 2;

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j <= i; j++) {
			let x = i * spacing - halfWidth;
			const z = j * spacing;

			if (j % 2 === 0) {
				x += spacing / 2;
			}

			formationShape.push(new Vector3(x - spacing / 2, 0, z));
		}
	}

	return formationShape;
}

export function calculateFighterPositionOnEnemy(enemy: Enemy, fighters: Set<string>, fighterId: string) {
	const enemySize = enemy.instance.GetScale() * 2 + 2;
	const enemyPosition = enemy.root.Position;

	const total = fighters.size();
	const index = Object.keys(fighters).indexOf(fighterId);

	const angle = math.rad((360 / total) * (index - 1));

	return new CFrame(
		enemyPosition.add(new Vector3(math.cos(angle), 0, math.sin(angle)).mul(enemySize)),
		enemyPosition,
	);
}

export function getClosestPositionToGoal(origin: Vector3, target: CFrame, raycastParams: RaycastParams) {
	const direction = target.Position.sub(origin);

	const backwardsDirection = target.LookVector.Unit.mul(-1);
	const angleCos = math.acos(direction.Unit.Dot(backwardsDirection));

	const backLength = (direction.Magnitude * angleCos) / 2;
	const backDirection = backwardsDirection.mul(backLength);
	const backPosition = origin.add(backDirection);

	const rightDirection = target.Position.sub(backPosition);

	let backResult = Workspace.Raycast(origin, backDirection, raycastParams);
	let result = target.Position;

	if (!backResult) {
		backResult = {
			Position: backPosition,
		} as RaycastResult;
	}

	let rightResult = Workspace.Raycast(
		backResult.Position.sub(rightDirection.Unit.mul(1.5)),
		rightDirection.mul(1.5),
		raycastParams,
	);

	if (!rightResult) {
		rightResult = {
			Position: backResult.Position.add(rightDirection),
		} as RaycastResult;
	}

	if (rightResult?.Normal) {
		result = rightResult.Position.sub(rightResult.Normal.mul(-1));
	}

	return result;
}

export function getGroundPosition(target: Vector3, raycastParams: RaycastParams) {
	const raycastUp = Workspace.Raycast(target, Vector3.yAxis.mul(100), raycastParams);

	const origin = raycastUp ? raycastUp.Position : target.add(Vector3.yAxis.mul(2));

	const raycastDown = Workspace.Raycast(origin, Vector3.yAxis.mul(-100), raycastParams);

	return raycastDown?.Position;
}
