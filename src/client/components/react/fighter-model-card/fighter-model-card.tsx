import { useCamera, useEventListener, useLatest, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import { createPortal } from "@rbxts/react-roblox";
import Roact, { useEffect, useMemo, useState } from "@rbxts/roact";
import { ReplicatedStorage, RunService } from "@rbxts/services";
import { colors } from "@/client/constants/colors";
import { fonts } from "@/client/constants/fonts";
import { Text } from "@/client/ui/components/text";
import { PlayerFighter } from "@/shared/store/players";

const fightersFolder = ReplicatedStorage.assets.Avatars.FightersModels;
const fightersParticles = ReplicatedStorage.assets.Particles.EnemyUnbox;

function FighterModelBillboard({ name }: { name: string }) {
	return (
		<billboardgui StudsOffsetWorldSpace={new Vector3(0, -1.5, -0.3)} Size={UDim2.fromScale(3, 1)} AlwaysOnTop>
			<Text
				size={UDim2.fromScale(1, 1)}
				backgroundTransparency={1}
				text={name}
				font={fonts.fredokaOne.bold}
				textColor={colors.white}
				textScaled
			>
				<uistroke Thickness={5.7} />
			</Text>
		</billboardgui>
	);
}

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

		// create particle
		const particlePart = new Instance("Part");

		particlePart.Size = Vector3.one;
		particlePart.Anchored = true;
		particlePart.CanCollide = false;
		particlePart.CanQuery = false;
		particlePart.Transparency = 1;
		particlePart.CFrame = bounding;
		particlePart.Parent = fighterModel;

		const particles = fightersParticles.GetChildren() as ParticleEmitter[];

		particles.forEach((particle) => {
			const clonedParticle = particle.Clone();

			clonedParticle.Parent = particlePart;
			clonedParticle.Emit(1);
		});
	}, [camera, fighterModel]);

	useUnmountEffect(() => {
		fighterModel?.Destroy();
	});

	return <>{fighterModel && createPortal(<FighterModelBillboard name={fighter.name} />, fighterModel)}</>;
}
