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
		const occlusionResult = Workspace.Spherecast(origin, 1, direction.add(direction.Unit), this.raycastParams);
		let result = goal;

		Gizmo.arrow.draw(origin, occlusionResult?.Position ?? goal);

		if (occlusionResult) {
			result = occlusionResult.Position.sub(occlusionResult.Normal.mul(-1));
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
