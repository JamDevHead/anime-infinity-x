import { useCamera, useEventListener, useLatest, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect, useMemo, useState } from "@rbxts/roact";
import { ReplicatedStorage, RunService } from "@rbxts/services";
import { PlayerFighter } from "@/shared/store/players";

const fightersFolder = ReplicatedStorage.assets.Avatars.FightersModels;

export function FighterModelCard({ fighter }: { fighter: Pick<PlayerFighter, "zone" | "name"> }) {
	const camera = useCamera();
	const [collidableParts, setCollidableParts] = useState<BasePart[]>([]);
	const latestCollidableParts = useLatest(collidableParts);
	const fighterModel = useMemo(() => {
		const fighterZone = fightersFolder.FindFirstChild(fighter.zone);
		const fighterModel = fighterZone?.FindFirstChild(fighter.name);

		return fighterModel?.Clone() as Model | undefined;
	}, [fighter.name, fighter.zone]);

	useEventListener(
		RunService.RenderStepped,
		() => {
			const model = fighterModel as Model;

			const scale = 0.18;
			const offset = new Vector3(0, -0.5, -6);
			const cameraOffset = new CFrame(offset.mul(scale));
			const fighterCFrame = camera.CFrame.mul(cameraOffset).mul(CFrame.Angles(0, math.rad(180), 0));

			model.PivotTo(fighterCFrame);
		},
		{ connected: fighterModel !== undefined },
	);

	useEventListener(RunService.Stepped, () => {
		latestCollidableParts.current.forEach((part) => {
			part.CanCollide = false;
		});
	});

	useEffect(() => {
		if (!fighterModel) {
			return;
		}

		const humanoid = fighterModel.WaitForChild("Humanoid") as Humanoid;
		const animator = (humanoid.FindFirstChild("Animator") as Animator) ?? new Instance("Animator");
		animator.Parent = humanoid;

		const [bounding] = fighterModel.GetBoundingBox();
		const parts = [] as BasePart[];

		fighterModel.GetDescendants().forEach((descendant) => {
			if (descendant.IsA("BasePart")) {
				descendant.CastShadow = false;
				descendant.Anchored = true;
				descendant.CanCollide = false;
				descendant.CanQuery = false;
				parts.push(descendant);
			}
		});

		setCollidableParts(parts);

		fighterModel.PrimaryPart = undefined;
		fighterModel.WorldPivot = bounding;
		fighterModel.ScaleTo(0.15);
		fighterModel.Parent = camera;
	}, [camera, fighterModel]);

	useUnmountEffect(() => {
		fighterModel?.Destroy();
	});

	return <></>;
}
