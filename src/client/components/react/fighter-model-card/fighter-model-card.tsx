import { useCamera, useEventListener, useLatest, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import { createPortal } from "@rbxts/react-roblox";
import Roact, { useEffect, useMemo, useState } from "@rbxts/roact";
import { ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { colors } from "@/client/constants/colors";
import { fonts } from "@/client/constants/fonts";
import { Text } from "@/client/ui/components/text";
import { PlayerFighter } from "@/shared/store/players";

const fightersFolder = ReplicatedStorage.assets.Avatars.FightersModels;
const fightersParticles = ReplicatedStorage.assets.Particles.EnemyUnbox;

function FighterModelBillboard({ name }: { name: string }) {
	return (
		<billboardgui StudsOffset={new Vector3(0, -0.2, 0.3)} Size={UDim2.fromScale(3, 0.15)} AlwaysOnTop>
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
	const [root, setRoot] = useState<BasePart | undefined>();

	useEventListener(
		RunService.RenderStepped,
		() => {
			const scale = 0.18;
			const offset = new Vector3(0, -0.5, -6);
			const cameraOffset = new CFrame(offset.mul(scale));
			const fighterCFrame = camera.CFrame.mul(cameraOffset).mul(CFrame.Angles(0, math.rad(180), 0));

			root?.PivotTo(fighterCFrame);
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
		const fighterRoot = humanoid.RootPart;

		if (!fighterRoot) {
			return;
		}

		const animator = (humanoid.FindFirstChild("Animator") as Animator) ?? new Instance("Animator");

		animator.Parent = humanoid;
		setRoot(fighterRoot);

		const idleAnimation = new Instance("Animation");
		idleAnimation.AnimationId = "rbxassetid://14451184535";
		idleAnimation.Name = "Idle";
		idleAnimation.Parent = animator;

		task.spawn(() => {
			while (!animator.IsDescendantOf(Workspace)) {
				task.wait();
			}

			const idleTrack = animator.LoadAnimation(idleAnimation);
			idleTrack.Play();
		});

		const bounding = fighterModel.GetBoundingBox()[0];
		const parts = [] as BasePart[];

		fighterRoot.Anchored = true;

		for (const descendant of fighterModel.GetDescendants()) {
			if (descendant.IsA("BasePart")) {
				descendant.CastShadow = false;
				descendant.CanCollide = false;
				descendant.CanQuery = false;

				if (descendant === fighterRoot) {
					continue;
				}

				descendant.Anchored = false;
				parts.push(descendant);
			}
		}

		setCollidableParts(parts);

		fighterModel.PrimaryPart = undefined;
		fighterModel.WorldPivot = bounding;
		fighterModel.ScaleTo(0.15);
		fighterModel.Parent = camera;

		// Create particles
		for (const particle of fightersParticles.GetChildren() as ParticleEmitter[]) {
			const clonedParticle = particle.Clone();
			clonedParticle.LockedToPart = true;
			clonedParticle.Parent = fighterRoot;

			task.delay(0.1, () => clonedParticle.Emit(1));
		}
	}, [camera, fighterModel]);

	useUnmountEffect(() => {
		fighterModel?.Destroy();
	});

	return <>{root && createPortal(<FighterModelBillboard name={fighter.name} />, root)}</>;
}
