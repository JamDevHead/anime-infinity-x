import { BaseComponent, Component } from "@flamework/components";
import { OnRender, OnStart } from "@flamework/core";
import Gizmo from "@rbxts/gizmo";
import { Logger } from "@rbxts/log";
import { createSelector } from "@rbxts/reflex";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import { CharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { producer } from "@/client/reflex/producers";
import { selectPlayerFighters } from "@/shared/reflex/selectors";

@Component({
	tag: "FighterGoal",
})
export class FighterGoal extends BaseComponent<{ UID: string }, Attachment> implements OnStart, OnRender {
	private fighterPart = new Instance("Part");
	private root = this.instance.Parent as Part | undefined;
	private raycastParams = new RaycastParams();
	private trove = new Trove();
	private fighterModel: Model | undefined;

	constructor(
		private readonly logger: Logger,
		private readonly characterAdd: CharacterAdd,
	) {
		super();
	}

	onStart() {
		const localPlayer = Players.LocalPlayer;

		this.fighterPart.Name = "FighterPart";
		this.fighterPart.Anchored = true;
		this.fighterPart.CanCollide = false;
		this.fighterPart.CanQuery = false;
		this.fighterPart.CanTouch = false;
		this.fighterPart.CastShadow = false;
		this.fighterPart.Size = Vector3.one;
		this.fighterPart.Transparency = 0;

		this.fighterPart.Parent = this.instance;

		this.instance.Visible = true;

		this.raycastParams.FilterType = Enum.RaycastFilterType.Exclude;
		if (this.root?.Parent) {
			this.raycastParams.AddToFilter(this.root.Parent);
		}

		const selectFighter = (playerId: string, uid: string) => {
			return createSelector(selectPlayerFighters(playerId), (fighters) => {
				return fighters?.all.find((fighter) => fighter.uid === uid);
			});
		};

		this.logger.Debug("Fighter UID: {uid}", this.attributes.UID);

		this.trove.add(
			producer.subscribe(selectFighter(tostring(localPlayer.UserId), this.attributes.UID), (fighter) => {
				this.logger.Debug("fighter: {@fighter}", fighter);

				if (!fighter) {
					return;
				}

				const fighterZone = ReplicatedStorage.assets.Avatars.FindFirstChild(fighter.zone);
				const fighterModel = fighterZone?.FindFirstChild(fighter.name) as Model | undefined;

				if (fighterModel) {
					// Cleanup fighter model
					for (const part of fighterModel.GetDescendants()) {
						if (part.IsA("BasePart")) {
							part.CanCollide = false;
							part.CanQuery = false;
							part.CanTouch = false;
							part.Anchored = true;
						}
					}

					const fighterPivot = fighterModel.GetPivot();
					fighterModel.WorldPivot = fighterPivot.sub(Vector3.yAxis.mul(-3));
					fighterModel.Parent = this.instance;

					this.fighterModel = fighterModel;
				}
			}),
		);
	}

	destroy() {
		super.destroy();
		this.trove.destroy();
	}

	onRender(dt: number) {
		this.updateFighterGoal(dt);
		this.updateFighterModel();
	}

	private updateFighterModel() {
		if (!this.fighterModel) {
			return;
		}

		this.fighterModel.PivotTo(this.fighterPart.CFrame);
	}

	private updateFighterGoal(dt: number) {
		const goal = this.instance.WorldPosition;
		const newGoal = this.getOcclusionResult(goal);
		const groundResult = newGoal && this.getGroundResult(newGoal);

		if (!newGoal || !groundResult) {
			return;
		}

		const character = this.characterAdd.character;
		const humanoid = character?.FindFirstChild("Humanoid") as Humanoid | undefined;
		const isFloating = humanoid?.FloorMaterial === Enum.Material.Air;

		const rootPosition = this.root?.Position.add(this.root?.CFrame.LookVector.mul(6)) ?? goal;
		const finalGoal = new Vector3(newGoal.X, isFloating ? goal.Y : groundResult.Position.Y, newGoal.Z);
		const goalLookAt = new Vector3(rootPosition.X, finalGoal.Y, rootPosition.Z);

		// Lerp part to origin
		this.fighterPart.CFrame = this.fighterPart.CFrame.Lerp(new CFrame(finalGoal, goalLookAt), dt * 10);
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

		Gizmo.arrow.styleDraw(
			{
				color: Color3.fromRGB(255, 0, 0),
			},
			origin,
			rightResult?.Position ?? goal,
		);

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

		return downRaycast;
	}
}
