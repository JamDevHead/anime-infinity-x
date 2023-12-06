import { useCamera, useEventListener, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect, useMemo } from "@rbxts/roact";
import { ReplicatedStorage, RunService } from "@rbxts/services";
import { PlayerFighter } from "@/shared/store/players";

const fightersFolder = ReplicatedStorage.assets.Avatars.FightersModels;

export function FighterModelCard({ fighter }: { fighter: Pick<PlayerFighter, "zone" | "name"> }) {
	const camera = useCamera();
	const fighterModel = useMemo(() => {
		const fighterZone = fightersFolder.FindFirstChild(fighter.zone);
		const fighterModel = fighterZone?.FindFirstChild(fighter.name);

		return fighterModel?.Clone() as Model | undefined;
	}, [fighter.name, fighter.zone]);

	useEventListener(
		RunService.RenderStepped,
		() => {
			const model = fighterModel as Model;

			const scale = 0.06;
			const offset = new Vector3(0, -0.5, -6);
			const cameraOffset = new CFrame(offset.mul(scale));
			const fighterCFrame = camera.CFrame.mul(cameraOffset).mul(CFrame.Angles(0, math.rad(180), 0));

			model.PivotTo(fighterCFrame);
		},
		{ connected: fighterModel !== undefined },
	);

	useEffect(() => {
		if (!fighterModel) {
			return;
		}

		const humanoid = fighterModel.WaitForChild("Humanoid") as Humanoid;
		const animator = (humanoid.FindFirstChild("Animator") as Animator) ?? new Instance("Animator");
		animator.Parent = humanoid;

		const [bounding] = fighterModel.GetBoundingBox();
		fighterModel.GetDescendants().forEach((descendants) => {
			if (descendants.IsA("BasePart")) {
				descendants.CastShadow = false;
				descendants.Anchored = true;
				descendants.CanCollide = false;
				descendants.CanQuery = false;
			}
		});
		fighterModel.PrimaryPart = undefined;
		fighterModel.WorldPivot = bounding;
		fighterModel.ScaleTo(0.05);
		fighterModel.Parent = camera;
	}, [camera, fighterModel]);

	useUnmountEffect(() => {
		fighterModel?.Destroy();
	});

	return <></>;
}
