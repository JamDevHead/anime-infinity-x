import { BaseComponent, Component, Components } from "@flamework/components";
import { OnRender, OnStart } from "@flamework/core";
import Gizmo from "@rbxts/gizmo";
import { Logger } from "@rbxts/log";
import Make from "@rbxts/make";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import { FighterGoalAttributes } from "@/client/components/fighter-goal/fighter-goal-types";
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
export class FighterGoal extends BaseComponent<FighterGoalAttributes, Attachment> implements OnStart, OnRender {
	public fighterPart = Make("Part", {
		Name: "FighterPart",
		Anchored: true,
		CanCollide: false,
		CanQuery: false,
		CanTouch: false,
		CastShadow: false,
		Size: Vector3.one,
		Transparency: 1,
	});
	public currentEnemy: EnemyComponent | undefined;
	public fighterInfo: PlayerFighter | undefined;

	private raycastParams = new RaycastParams();
	private trove = new Trove();
	private root: Part | undefined;
	private puffParticle = ReplicatedStorage.assets.Particles.Puff.Clone();
	private humanoid: Humanoid | undefined;
	private fighterModelComponent: FighterModel | undefined;

	constructor(
		private readonly logger: Logger,
		private readonly fightersTracker: FightersTracker,
		private readonly enemySelector: EnemySelectorController,
		private readonly components: Components,
	) {
		super();

		const fighterModel = getFighterFromCharacterId(this.attributes.characterId)?.Clone();

		if (!fighterModel) {
			return;
		}

		fighterModel.Parent = this.fightersTracker.fightersFolder;

		const fighterModelComponent = this.components.addComponent<FighterModel>(fighterModel);
		fighterModelComponent.fighterGoal = this;

		this.fighterModelComponent = fighterModelComponent;

		this.trove.add(fighterModel);
		this.trove.add(fighterModelComponent);
	}

	onStart() {
		const userId = tonumber(this.attributes.playerId);

		if (userId === undefined) {
			this.logger.Warn("Failed to find owner {ownerId}", this.attributes.playerId);
			return;
		}

		const localPlayer = Players.LocalPlayer;
		const player = localPlayer.UserId !== userId ? Players.GetPlayerByUserId(userId) : localPlayer;

		if (!player) {
			this.logger.Warn("Failed to find owner {ownerId}", this.attributes.playerId);
			return;
		}

		this.root = player.Character?.FindFirstChild("HumanoidRootPart") as Part | undefined;
		this.humanoid = player.Character?.FindFirstChild("Humanoid") as Humanoid | undefined;

		this.fighterPart.CFrame = this.instance.WorldCFrame;

		this.puffParticle.Parent = this.instance;
		this.fighterPart.Parent = this.instance;

		this.trove.add(this.fighterPart);
		this.raycastParams.FilterType = Enum.RaycastFilterType.Exclude;

		if (this.root?.Parent) {
			this.raycastParams.AddToFilter(this.root.Parent);
		}
		if (this.enemySelector.enemyFolder) {
			this.raycastParams.AddToFilter(this.enemySelector.enemyFolder);
		}
		this.raycastParams.AddToFilter(this.fightersTracker.fightersFolder);
		task.spawn(() => {
			this.raycastParams.AddToFilter(Workspace.WaitForChild("Players"));
		});

		const selectCurrentFighterTarget = selectFighterTarget(this.attributes.fighterId);

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
			store.subscribe(selectPlayerFighter(tostring(userId), this.attributes.fighterId), (fighter) => {
				if (!fighter) {
					return;
				}

				this.fighterInfo = fighter;
			}),
		);
	}

	destroy() {
		super.destroy();
		this.trove.destroy();
	}

	onRender(dt: number) {
		this.updateGoal();
		this.updateFighterGoal(dt);
	}

	private onFighterTargetUpdate(enemyUid: string | undefined) {
		const enemy = enemyUid !== undefined ? getEnemyByUid(enemyUid, this.components) : undefined;

		this.currentEnemy = enemy;

		if (!enemy || enemy.attackingFighters.includes(this.attributes.fighterId)) {
			return;
		}

		let currentHealth = enemy.humanoid.Health;

		this.trove.add(
			enemy.humanoid.HealthChanged.Connect((newHealth) => {
				if (currentHealth > newHealth) {
					this.fighterModelComponent?.attack();
				}

				currentHealth = enemy.humanoid.Health;
			}),
		);

		enemy.attackingFighters.push(this.attributes.fighterId);
	}

	private updateGoal() {
		if (!this.root) {
			return;
		}

		let target: CFrame | undefined;

		if (this.currentEnemy) {
			const total = this.currentEnemy.attackingFighters.size();
			const index = this.currentEnemy.attackingFighters.indexOf(this.attributes.fighterId);
			const enemySize = this.currentEnemy.instance.GetScale() * 2 + 2;
			const enemyPosition = this.currentEnemy.root.Position;

			// Thanks NPCsController
			const angle = math.rad((360 / total) * (index - 1));

			target = new CFrame(
				enemyPosition.add(new Vector3(math.cos(angle), 0, math.sin(angle)).mul(enemySize)),
				enemyPosition,
			);
		}

		this.instance.WorldCFrame =
			target ?? new CFrame(this.root.CFrame.PointToWorldSpace(this.attributes.goalOffset));
	}

	private updateFighterGoal(dt: number) {
		if (!this.root) {
			return;
		}

		if (this.currentEnemy) {
			const groundResult = this.getGroundResult(this.instance.WorldPosition)?.mul(Vector3.yAxis) ?? Vector3.zero;
			const goalCFrame = this.instance.WorldCFrame;

			this.fighterPart.CFrame = this.fighterPart.CFrame.Lerp(
				goalCFrame.sub(goalCFrame.Position.mul(Vector3.yAxis)).add(groundResult),
				dt * 8,
			);
			return;
		}

		const goal = this.instance.WorldPosition;
		const fighterPosition = this.fighterPart.Position;
		const occlusionResult = this.getOcclusionResult(goal);
		const groundResult = occlusionResult && this.getGroundResult(occlusionResult);

		if (!occlusionResult || !groundResult) {
			if (this.fighterPart.CFrame !== FAR_CFRAME) {
				this.puffParticle.Emit(15);
				this.fighterPart.CFrame = FAR_CFRAME;
			}
			return;
		}

		debug.profilebegin(`fighter goal update ${this.attributes.fighterId}`);

		const isFloating = this.humanoid?.GetState() === Enum.HumanoidStateType.Freefall;

		const finalGoal = new Vector3(occlusionResult.X, isFloating ? goal.Y : groundResult.Y, occlusionResult.Z);

		const fighterGoalDiff = finalGoal.sub(fighterPosition).mul(HORIZONTAL_VECTOR);
		const lookAt =
			fighterGoalDiff.Magnitude > 0.8 && !isFloating ? fighterGoalDiff.Unit : this.root.CFrame.LookVector;

		const goalLookAt = finalGoal.add(lookAt.mul(HORIZONTAL_VECTOR).mul(1.5));
		const goalCFrame = new CFrame(finalGoal, goalLookAt);

		if (this.fighterPart.Position.Magnitude === math.huge || this.fighterPart.Position.Magnitude > 4e9) {
			this.fighterPart.Position = goalCFrame.Position;
			return;
		}

		// Lerp part to origin
		this.fighterPart.CFrame = this.fighterPart.CFrame.Lerp(goalCFrame, dt * 8);
		debug.profileend();
	}

	private getOcclusionResult(goal: Vector3) {
		if (!this.root) {
			return;
		}

		const origin = this.root.Position;
		const direction = goal.sub(origin);

		const backwardsDirection = this.root.CFrame.LookVector.Unit.mul(-1);
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