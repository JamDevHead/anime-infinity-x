import { BaseComponent, Component } from "@flamework/components";
import { OnRender, OnStart } from "@flamework/core";
import Gizmo from "@rbxts/gizmo";
import { Logger } from "@rbxts/log";
import { createSelector } from "@rbxts/reflex";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import { FightersTracker } from "@/client/controllers/fighters-tracker";
import { CharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { store } from "@/client/store";
import { PlayerFighter, selectPlayerFighters } from "@/shared/store/players";
import { selectFighterTarget } from "@/client/store/fighter-target/fighter-target-selectors";
import { Enemy } from "@/client/components/enemy";

const FAR_CFRAME = new CFrame(0, 5e9, 0);

@Component({
	tag: "FighterGoal",
})
export class FighterGoal
	extends BaseComponent<{ UID: string; OwnerId: number; Offset: Vector3 }, Attachment>
	implements OnStart, OnRender
{
	private fighterPart = new Instance("Part");
	private raycastParams = new RaycastParams();
	private trove = new Trove();
	private root: Part | undefined;
	private fighterModel: Model | undefined;
	private currentEnemy: Enemy | undefined;

	constructor(
		private readonly logger: Logger,
		private readonly characterAdd: CharacterAdd,
		private readonly fightersTracker: FightersTracker,
	) {
		super();
	}

	onStart() {
		const localPlayer = Players.LocalPlayer;
		const owner =
			localPlayer.UserId !== this.attributes.OwnerId
				? Players.GetPlayerByUserId(this.attributes.OwnerId)
				: localPlayer;

		if (!owner) {
			this.logger.Warn("Failed to find owner {ownerId}", this.attributes.OwnerId);
			return;
		}

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

		this.raycastParams.FilterType = Enum.RaycastFilterType.Exclude;
		if (this.root?.Parent) {
			this.raycastParams.AddToFilter(this.root.Parent);
		}
		this.raycastParams.AddToFilter(this.fightersTracker.fightersFolder);

		const playerId = tostring(localPlayer.UserId);
		const selectFighter = (playerId: string, uid: string) => {
			return createSelector(selectPlayerFighters(playerId), (fighters) => {
				return fighters?.all.find((fighter) => fighter.uid === uid);
			});
		};

		const onNewFighterUid = (uid: string) => {
			const fighter = store.getState(selectFighter(playerId, uid));

			if (this.fighterModel) {
				this.trove.remove(this.fighterModel);
			}

			if (!fighter) {
				return;
			}

			this.fighterModel = this.createFighterModel(fighter);
			this.updateFighterGoal(0.1);
		};

		onNewFighterUid(this.attributes.UID);
		this.onAttributeChanged("UID", (newUid, oldUid) => {
			if (newUid === oldUid) {
				// May never reach, but on roblox things change
				return;
			}

			onNewFighterUid(newUid);
		});

		this.trove.add(
			store.subscribe(selectFighterTarget(this.attributes.UID), (enemy) => {
				print("new enemy");
				this.currentEnemy = enemy;
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
		this.updateFighterModel();
	}

	private createFighterModel(fighter: PlayerFighter) {
		const fighterZone = ReplicatedStorage.assets.Avatars.FightersModels.FindFirstChild(fighter.zone);
		const fighterModel = fighterZone?.FindFirstChild(fighter.name)?.Clone() as Model | undefined;

		if (!fighterModel) {
			this.logger.Warn("Failed to find fighter model {zone} {name}", fighter.zone, fighter.name);
			return;
		}

		fighterModel.Parent = this.fightersTracker.fightersFolder;
		fighterModel.AddTag("Fighter");

		this.trove.add(fighterModel);
		return fighterModel;
	}

	private updateGoal() {
		if (!this.root) {
			return;
		}

		let target: Vector3 | undefined;

		if (this.currentEnemy) {
			target = this.currentEnemy.root.Position;
		}

		this.instance.WorldPosition = target ?? this.root.CFrame.PointToWorldSpace(this.attributes.Offset);
	}

	private updateFighterModel() {
		if (!this.fighterModel) {
			return;
		}

		const fighterPartSize = this.fighterPart.Size.Y / 2;

		this.fighterModel.PivotTo(this.fighterPart.CFrame.add(Vector3.yAxis.mul(3 - fighterPartSize)));
	}

	private updateFighterGoal(dt: number) {
		if (!this.root) {
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

		const horizontalVector = new Vector3(1, 0, 1);

		const fighterGoalDiff = finalGoal.sub(fighterPosition).mul(horizontalVector);
		const lookAt =
			fighterGoalDiff.Magnitude > 0.8 && !isFloating ? fighterGoalDiff.Unit : this.root.CFrame.LookVector;

		const goalLookAt = finalGoal.add(lookAt.mul(horizontalVector).mul(1.5));
		const goalCFrame = new CFrame(finalGoal, goalLookAt);

		if (this.fighterPart.Position.Magnitude === math.huge) {
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
