import { BaseComponent, Component, Components } from "@flamework/components";
import { OnRender, OnStart } from "@flamework/core";
import Gizmo from "@rbxts/gizmo";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import { FighterGoalAttributes, FighterGoalInstance } from "@/client/components/fighter-goal/fighter-goal-types";
import { FighterModel } from "@/client/components/fighter-model";
import { EnemySelectorController } from "@/client/controllers/enemy-selector-controller";
import { FightersTracker } from "@/client/controllers/fighters-tracker-controller/tracker-controller";
import { store } from "@/client/store";
import { getEnemyByUid } from "@/client/utils/enemies";
import { EnemyComponent } from "@/shared/components/enemy-component";
import { selectFighterTarget } from "@/shared/store/fighter-target/fighter-target-selectors";
import { PlayerFighter } from "@/shared/store/players";
import { selectPlayerFighter } from "@/shared/store/players/fighters";
import { getFighterFromCharacterId } from "@/shared/utils/fighters";

const FAR_CFRAME = new CFrame(0, 5e9, 0);
const HORIZONTAL_VECTOR = new Vector3(1, 0, 1);

@Component({
	tag: "FighterGoal",
})
export class FighterGoal
	extends BaseComponent<FighterGoalAttributes, FighterGoalInstance>
	implements OnStart, OnRender
{
	public currentEnemy: EnemyComponent | undefined;
	public fighterInfo: PlayerFighter | undefined;

	private raycastParams = new RaycastParams();
	private trove = new Trove();
	private puffParticle = ReplicatedStorage.assets.Particles.Puff.Clone();
	private fighterModelComponent: FighterModel;
	private goal = CFrame.identity;
	private player = Players.GetPlayerByUserId(this.attributes.playerId);
	private humanoid?: Humanoid;
	private enemyHealthChangedEvent?: RBXScriptConnection;
	private currentPosition = this.instance.CFrame;

	constructor(
		private readonly fightersTracker: FightersTracker,
		private readonly enemySelector: EnemySelectorController,
		private readonly components: Components,
	) {
		super();

		const fighterModel = getFighterFromCharacterId(this.attributes.characterId)?.Clone();

		assert(fighterModel, `Failed to find fighter from character id ${this.attributes.characterId}`);

		fighterModel.Parent = this.fightersTracker.fightersFolder;

		const fighterModelComponent = this.components.addComponent<FighterModel>(fighterModel);
		fighterModelComponent.fighterGoal = this;

		this.fighterModelComponent = fighterModelComponent;

		this.trove.add(fighterModel);
		this.trove.add(fighterModelComponent);
	}

	onStart() {
		this.puffParticle.Parent = this.instance;
		this.raycastParams.FilterType = Enum.RaycastFilterType.Exclude;

		const selectCurrentFighterTarget = selectFighterTarget(this.attributes.fighterId);
		const filterList = [
			this.enemySelector.enemyFolder,
			this.fightersTracker.fightersFolder,
			Workspace.FindFirstChild("Players"),
		];

		this.raycastParams.AddToFilter(filterList.filterUndefined());
		this.onFighterTargetUpdate(store.getState(selectCurrentFighterTarget));

		this.trove.add(
			store.subscribe(selectCurrentFighterTarget, (enemyUid, lastEnemyUid) => {
				const lastEnemy = lastEnemyUid !== undefined ? getEnemyByUid(lastEnemyUid, this.components) : undefined;

				if (lastEnemy?.attackingFighters.includes(this.attributes.fighterId)) {
					// Remove fighter from last enemy
					lastEnemy.attackingFighters = lastEnemy.attackingFighters.filter(
						(fighterId) => fighterId !== this.attributes.fighterId,
					);
				}

				this.onFighterTargetUpdate(enemyUid);
			}),
		);

		this.trove.add(
			store.subscribe(
				selectPlayerFighter(tostring(this.attributes.playerId), this.attributes.fighterId),
				(fighter) => {
					if (!fighter) {
						return;
					}

					this.fighterInfo = fighter;
				},
			),
		);
	}

	destroy() {
		super.destroy();
		this.trove.destroy();
	}

	onRender(dt: number) {
		this.currentPosition = this.fighterModelComponent.instance.GetPivot();
		this.updateGoal();
		this.currentEnemy ? this.updateFighterTarget(dt) : this.updateFighterGoal(dt);
	}

	private setPosition(position: CFrame, alpha?: number) {
		const alphaExists = alpha !== undefined;
		const positionDiff = alphaExists ? position.Position.sub(this.currentPosition.Position).Magnitude : 101;

		this.fighterModelComponent.instance.PivotTo(
			alphaExists && positionDiff < FAR_CFRAME.Position.Magnitude * 0.5
				? this.currentPosition.Lerp(position, alpha)
				: position,
		);
	}

	private onFighterTargetUpdate(enemyUid: string | undefined) {
		const enemy = enemyUid !== undefined ? getEnemyByUid(enemyUid, this.components) : undefined;

		this.currentEnemy = enemy;
		this.enemyHealthChangedEvent?.Disconnect();

		if (!enemy || enemy.attackingFighters.includes(this.attributes.fighterId)) {
			return;
		}

		let currentHealth = enemy.humanoid.Health;

		this.enemyHealthChangedEvent = enemy.humanoid.HealthChanged.Connect((newHealth) => {
			if (currentHealth > newHealth) {
				this.fighterModelComponent?.attack();
			}

			currentHealth = enemy.humanoid.Health;
		});

		enemy.attackingFighters.push(this.attributes.fighterId);
	}

	private updateGoal() {
		if (this.currentEnemy) {
			const total = this.currentEnemy.attackingFighters.size();
			const index = this.currentEnemy.attackingFighters.indexOf(this.attributes.fighterId);
			const enemySize = this.currentEnemy.instance.GetScale() * 2 + 2;
			const enemyPosition = this.currentEnemy.root.Position;

			// Thanks NPCsController
			const angle = math.rad((360 / total) * (index - 1));

			this.goal = new CFrame(
				enemyPosition.add(new Vector3(math.cos(angle), 0, math.sin(angle)).mul(enemySize)),
				enemyPosition,
			);
		} else {
			this.goal = this.instance.CFrame;
		}
	}

	private updateFighterTarget(dt: number) {
		const groundResult = this.getGroundResult(this.goal.Position);

		if (!groundResult) {
			return;
		}

		this.setPosition(CFrame.lookAlong(groundResult, this.goal.LookVector), dt * 8);
	}

	private updateFighterGoal(dt: number) {
		const currentFighterCFrame = this.currentPosition;
		const origin = this.instance.CFrame.ToWorldSpace(this.attributes.goalOffset.Inverse());
		const occlusionResult = this.getOcclusionResult(origin.Position, this.goal.Position);
		const groundResult = occlusionResult && this.getGroundResult(occlusionResult);

		// if no result from ray-casts, set the fighter to far_cframe (far away from player)
		if (!occlusionResult || !groundResult) {
			if (currentFighterCFrame !== FAR_CFRAME) {
				this.puffParticle.Emit(15);
				this.setPosition(FAR_CFRAME);
			}

			return;
		}

		const character = this.player?.Character;
		const humanoid = this.humanoid?.Parent
			? this.humanoid
			: (character?.FindFirstChild("Humanoid") as Humanoid | undefined);

		// cache humanoid for future calls
		this.humanoid = humanoid;

		const isFloating = humanoid?.GetState() === Enum.HumanoidStateType.Freefall;
		const finalGoal = new Vector3(occlusionResult.X, isFloating ? this.goal.Y : groundResult.Y, occlusionResult.Z);

		const fighterGoalDiff = finalGoal.sub(currentFighterCFrame.Position);
		const fighterGoalDiffHorizontal = fighterGoalDiff.mul(HORIZONTAL_VECTOR);

		const lookAt =
			fighterGoalDiffHorizontal.Magnitude > 0.8 && !isFloating
				? fighterGoalDiffHorizontal.Unit
				: this.instance.CFrame.LookVector;

		const goalLookAt = finalGoal.add(lookAt.mul(HORIZONTAL_VECTOR).mul(1.5));
		const goalCFrame = new CFrame(finalGoal, goalLookAt);

		if (fighterGoalDiff.Magnitude > 4e9) {
			this.puffParticle.Emit(15);
			this.fighterModelComponent.instance.PivotTo(goalCFrame);
			return;
		}

		// Lerp part to origin
		this.setPosition(goalCFrame, dt * 8);
	}

	private getOcclusionResult(origin: Vector3, goal: Vector3) {
		const direction = goal.sub(origin);

		const backwardsDirection = this.instance.CFrame.LookVector.Unit.mul(-1);
		const angleCos = math.acos(direction.Unit.Dot(backwardsDirection));

		const backLength = (direction.Magnitude * angleCos) / 2;
		const backDirection = backwardsDirection.mul(backLength);
		const backPosition = origin.add(backDirection);

		const rightDirection = goal.sub(backPosition);

		let backResult = Workspace.Raycast(origin, backDirection, this.raycastParams);
		let result = goal;

		if (!backResult) {
			backResult = {
				Position: backPosition,
			} as RaycastResult;
		}

		let rightResult = Workspace.Raycast(
			backResult.Position.sub(rightDirection.Unit.mul(1.5)),
			rightDirection.mul(1.5),
			this.raycastParams,
		);

		if (!rightResult) {
			rightResult = {
				Position: backResult.Position.add(rightDirection),
			} as RaycastResult;
		}

		const purple = {
			color: Color3.fromRGB(160, 32, 240),
		};

		Gizmo.arrow.styleDraw(purple, origin, backResult.Position);

		Gizmo.arrow.styleDraw(purple, backResult.Position.sub(rightDirection.Unit.mul(1.5)), rightResult.Position);

		if (rightResult?.Normal) {
			result = rightResult.Position.sub(rightResult.Normal.mul(-1));
		}

		return result;
	}

	private getGroundResult(goal: Vector3) {
		const upRaycast = Workspace.Raycast(goal, Vector3.yAxis.mul(100), this.raycastParams);
		let origin = goal.add(Vector3.yAxis.mul(2));

		if (upRaycast) {
			origin = upRaycast.Position;
		}

		const downRaycast = Workspace.Raycast(origin, Vector3.yAxis.mul(-100), this.raycastParams);

		Gizmo.arrow.draw(goal, origin);
		Gizmo.arrow.draw(origin, downRaycast?.Position ?? origin.add(Vector3.yAxis.mul(-100)));

		return downRaycast?.Position;
	}
}
