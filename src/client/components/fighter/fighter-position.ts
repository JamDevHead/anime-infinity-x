import { Workspace } from "@rbxts/services";
import { Enemy } from "@/client/components/enemy-component";
import { FighterEnemies, FighterInstance } from "@/client/components/fighter/fighter-types";
import { FIGHTER_FAR_CFRAME } from "@/client/constants/fighters";
import {
	calculateFighterPositionOnEnemy,
	getClosestPositionToGoal,
	getGroundPosition,
} from "@/client/utils/fighters-math";

const HORIZONTAL_VECTOR = new Vector3(1, 0, 1);

export class FighterPosition {
	constructor(
		private instance: FighterInstance,
		private fighterId: string,
		private goal: Part,
		private raycastParams: RaycastParams,
	) {
		const filterList = [
			Workspace.FindFirstChild("Enemies"),
			Workspace.FindFirstChild("Fighters"),
			Workspace.FindFirstChild("Players"),
		];

		this.raycastParams.AddToFilter(filterList.filterUndefined());
	}

	onTick() {
		return this.instance.GetPivot();
	}

	public setCurrentCFrame(currentCFrame: CFrame, cframe: CFrame, alpha?: number) {
		const positionDiff = currentCFrame.Position.sub(cframe.Position);
		const tooFar = positionDiff.Y > 100 || HORIZONTAL_VECTOR.mul(positionDiff).Magnitude > 1000;

		this.instance.PivotTo(!tooFar && alpha ? currentCFrame.Lerp(cframe, alpha) : cframe);
	}

	public getFighterPositionOnEnemy(currentEnemy: Enemy, enemies: FighterEnemies) {
		if (!currentEnemy) return;

		const fighters = enemies[currentEnemy.attributes.Guid];

		if (!fighters) return;

		const fighterPosition = calculateFighterPositionOnEnemy(currentEnemy, fighters, this.fighterId);
		const groundPosition = getGroundPosition(fighterPosition.Position, this.raycastParams);

		if (!groundPosition) return;

		return CFrame.lookAlong(groundPosition, fighterPosition.LookVector);
	}

	public getFighterPosition(goalOffset: CFrame, currentCFrame: CFrame, humanoid?: Humanoid) {
		const origin = this.goal.CFrame.ToWorldSpace(goalOffset.Inverse()).Position;

		const closestPosition = getClosestPositionToGoal(origin, this.goal.CFrame, this.raycastParams);
		const groundPosition = getGroundPosition(closestPosition, this.raycastParams);

		if (!groundPosition) {
			return FIGHTER_FAR_CFRAME;
		}

		const isFloating = humanoid?.GetState() === Enum.HumanoidStateType.Freefall;
		const finalGoal = new Vector3(
			closestPosition.X,
			isFloating ? this.goal.Position.Y : groundPosition.Y,
			closestPosition.Z,
		);

		const fighterGoalDiff = finalGoal.sub(currentCFrame.Position);
		const fighterGoalDiffHorizontal = fighterGoalDiff.mul(HORIZONTAL_VECTOR);

		const lookAt =
			fighterGoalDiffHorizontal.Magnitude > 0.8 && !isFloating
				? fighterGoalDiffHorizontal.Unit
				: this.goal.CFrame.LookVector;

		const goalLookAt = finalGoal.add(lookAt.mul(HORIZONTAL_VECTOR).mul(1.5));
		const goalCFrame = new CFrame(finalGoal, goalLookAt);

		if (fighterGoalDiff.Magnitude > FIGHTER_FAR_CFRAME.Position.Magnitude) {
			return goalCFrame;
		}

		return goalCFrame;
	}
}
