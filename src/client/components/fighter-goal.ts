import { BaseComponent, Component } from "@flamework/components";
import { OnRender, OnStart } from "@flamework/core";
import Gizmo from "@rbxts/gizmo";
import { Logger } from "@rbxts/log";
import { Workspace } from "@rbxts/services";

@Component({
	tag: "FighterGoal",
})
export class FighterGoal extends BaseComponent<NonNullable<unknown>, Attachment> implements OnStart, OnRender {
	private fighterPart = new Instance("Part");
	private root = this.instance.Parent as Part | undefined;
	private raycastParams = new RaycastParams();

	constructor(private readonly logger: Logger) {
		super();
	}

	onStart() {
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
	}

	onRender(dt: number) {
		const goal = this.instance.WorldPosition;
		const newGoal = this.getOcclusionResult(goal);
		const groundResult = newGoal && this.getGroundResult(newGoal);

		if (!newGoal || !groundResult) {
			return;
		}

		const finalGoal = new CFrame(new Vector3(newGoal.X, groundResult.Position.Y, newGoal.Z));

		// Lerp part to origin
		this.fighterPart.CFrame = this.fighterPart.CFrame.Lerp(finalGoal, dt * 10);
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
