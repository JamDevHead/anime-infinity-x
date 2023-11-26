import { BaseComponent, Component, Components } from "@flamework/components";
import { OnRender, OnStart } from "@flamework/core";
import Gizmo from "@rbxts/gizmo";
import { Logger } from "@rbxts/log";
import { createSelector } from "@rbxts/reflex";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import { FighterModel } from "@/client/components/fighter-model";
import { FightersTracker } from "@/client/controllers/fighters-tracker";
import { CharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { store } from "@/client/store";
import { getEnemyByUid } from "@/client/utils/enemies";
import { EnemyComponent } from "@/shared/components/enemy-component";
import { selectFighterTarget } from "@/shared/store/fighter-target/fighter-target-selectors";
import { PlayerFighter } from "@/shared/store/players";
import { selectPlayerFighter, selectPlayerFighters } from "@/shared/store/players/fighters";

const FAR_CFRAME = new CFrame(0, 5e9, 0);
const HORIZONTAL_VECTOR = new Vector3(1, 0, 1);

const selectFighter = (playerId: string, uid: string) => {
	return createSelector(selectPlayerFighters(playerId), (fighters) => {
		return fighters?.all.find((fighter) => fighter.uid === uid);
	});
};

@Component({
	tag: "FighterGoal",
})
export class FighterGoal
	extends BaseComponent<{ UID: string; OwnerId: string; Offset: Vector3 }, Attachment>
	implements OnStart, OnRender
{
	public fighterPart = new Instance("Part");
	public currentEnemy: EnemyComponent | undefined;
	public fighterInfo: PlayerFighter | undefined;

	private raycastParams = new RaycastParams();
	private trove = new Trove();
	private root: Part | undefined;
	private fighterModel: FighterModel | undefined;
	private owner!: Player;

	constructor(
		private readonly logger: Logger,
		private readonly characterAdd: CharacterAdd,
		private readonly fightersTracker: FightersTracker,
		private readonly components: Components,
	) {
		super();
	}

	onStart() {
		const ownerId = tonumber(this.attributes.OwnerId);

		if (ownerId === undefined) {
			this.logger.Warn("Failed to find owner {ownerId}", this.attributes.OwnerId);
			return;
		}

		const localPlayer = Players.LocalPlayer;
		const owner = localPlayer.UserId !== ownerId ? Players.GetPlayerByUserId(ownerId) : localPlayer;

		if (!owner) {
			this.logger.Warn("Failed to find owner {ownerId}", this.attributes.OwnerId);
			return;
		}

		this.owner = owner;
		this.root = owner.Character?.FindFirstChild("HumanoidRootPart") as Part | undefined;

		this.fighterPart.Name = "FighterPart";
		this.fighterPart.Anchored = true;
		this.fighterPart.CanCollide = false;
		this.fighterPart.CanQuery = false;
		this.fighterPart.CanTouch = false;
		this.fighterPart.CastShadow = false;
		this.fighterPart.Size = Vector3.one;
		this.fighterPart.Transparency = 1;
		this.fighterPart.CFrame = this.instance.WorldCFrame;

		this.fighterPart.Parent = this.instance;

		this.trove.add(this.fighterPart);

		this.raycastParams.FilterType = Enum.RaycastFilterType.Exclude;
		if (this.root?.Parent) {
			this.raycastParams.AddToFilter(this.root.Parent);
		}
		this.raycastParams.AddToFilter(this.fightersTracker.fightersFolder);

		this.onNewFighterId(this.attributes.UID);
		this.onAttributeChanged("UID", (newUid, oldUid) => {
			if (newUid === oldUid) {
				// May never reach, but on roblox things change
				return;
			}

			this.onNewFighterId(newUid);
		});

		this.onFighterTargetUpdate(store.getState(selectFighterTarget(this.attributes.UID)));

		this.trove.add(
			store.subscribe(selectFighterTarget(this.attributes.UID), (enemyUid, lastEnemyUid) => {
				const lastEnemy = lastEnemyUid !== undefined ? getEnemyByUid(lastEnemyUid, this.components) : undefined;

				if (lastEnemy?.attackingFighters.includes(this.attributes.UID)) {
					// Remove fighter from last enemy
					lastEnemy.attackingFighters = lastEnemy.attackingFighters.filter(
						(fighterUid) => fighterUid !== this.attributes.UID,
					);
				}

				this.onFighterTargetUpdate(enemyUid);
			}),
		);

		this.trove.add(
			store.subscribe(selectPlayerFighter(tostring(this.attributes.OwnerId), this.attributes.UID), (fighter) => {
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

		if (!enemy || enemy.attackingFighters.includes(this.attributes.UID)) {
			return;
		}

		enemy.attackingFighters.push(this.attributes.UID);
	}

	private async onNewFighterId(uid: string) {
		const playerId = tostring(this.owner.UserId);
		const fighter = store.getState(selectFighter(playerId, uid));

		if (this.fighterModel) {
			this.trove.remove(this.fighterModel);
		}

		if (!fighter) {
			return;
		}

		this.fighterModel = await this.createFighterModel(fighter);
		this.updateFighterGoal(0.1);
	}

	private async createFighterModel(fighter: PlayerFighter) {
		const fighterZone = ReplicatedStorage.assets.Avatars.FightersModels.FindFirstChild(fighter.zone);
		const fighterModel = fighterZone?.FindFirstChild(fighter.name)?.Clone() as Model | undefined;

		if (!fighterModel) {
			this.logger.Warn("Failed to find fighter model {zone} {name}", fighter.zone, fighter.name);
			return;
		}

		fighterModel.SetAttribute("Uid", fighter.uid);
		fighterModel.Parent = this.fightersTracker.fightersFolder;
		fighterModel.AddTag("Fighter");

		const fighterModelComponent = await this.components.waitForComponent<FighterModel>(fighterModel);
		this.trove.add(fighterModelComponent);

		fighterModelComponent.fighterGoal = this;

		return fighterModelComponent;
	}

	private updateGoal() {
		if (!this.root) {
			return;
		}

		let target: CFrame | undefined;

		if (this.currentEnemy) {
			const total = this.currentEnemy.attackingFighters.size();
			const index = this.currentEnemy.attackingFighters.indexOf(this.attributes.UID);
			const enemySize = this.currentEnemy.instance.GetScale() * 2 + 2;
			const enemyPosition = this.currentEnemy.root.Position;

			// Thanks NPCsController
			const angle = math.rad((360 / total) * (index - 1));

			target = new CFrame(
				enemyPosition.add(new Vector3(math.cos(angle), 0, math.sin(angle)).mul(enemySize)),
				enemyPosition,
			);
		}

		this.instance.WorldCFrame = target ?? new CFrame(this.root.CFrame.PointToWorldSpace(this.attributes.Offset));
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
			this.fighterPart.CFrame = FAR_CFRAME;
			return;
		}

		debug.profilebegin(`fighter goal update ${this.attributes.UID}`);

		const character = this.characterAdd.character;
		const humanoid = character?.FindFirstChild("Humanoid") as Humanoid | undefined;
		const isFloating = humanoid?.GetState() === Enum.HumanoidStateType.Freefall;

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
