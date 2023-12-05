import { useBindingListener, useCamera, useEventListener, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect, useMemo } from "@rbxts/roact";
import { ReplicatedStorage, RunService } from "@rbxts/services";
import { setInterval } from "@rbxts/set-timeout";
import { springs } from "@/client/constants/springs";
import { useRootStore } from "@/client/store";
import { useMotion } from "@/client/ui/hooks/use-motion";

const zonesFolder = ReplicatedStorage.assets.Zones;

export function Egg({ eggZoneName }: { eggZoneName: string }) {
	const dispatcher = useRootStore();
	const camera = useCamera();
	const [rotation, rotationMotion] = useMotion(0);
	const [size, sizeMotion] = useMotion(0);
	const [transparency, transparencyMotion] = useMotion(0);
	const eggZone = useMemo(() => zonesFolder.FindFirstChild(eggZoneName) as Folder | undefined, [eggZoneName]);
	const eggModel = useMemo(
		() =>
			eggZone?.FindFirstChild("Eggs")?.FindFirstChild("Incubadora")?.FindFirstChild("Egg")?.Clone() as
				| Model
				| undefined,
		[eggZone],
	);

	useEffect(() => {
		if (!eggModel) {
			print("egg model not found");
			return;
		}

		eggModel.GetDescendants().forEach((descendants) => {
			if (descendants.IsA("BasePart")) {
				descendants.CastShadow = false;
				descendants.Anchored = true;
				descendants.CanCollide = false;
				descendants.CanQuery = false;
			}
		});
		eggModel.ScaleTo(0.004);
		eggModel.Parent = camera;
		let state = true;
		let stage = 0;

		const cleanup = setInterval(() => {
			state = !state;
			stage++;
			rotationMotion.spring(80 * (state ? -1 : 1), springs.wobbly);

			if (stage >= 10) {
				rotationMotion.set(0);
				transparencyMotion.spring(1, springs.wobbly);
				sizeMotion.spring(0.01, springs.responsive);
				task.delay(0.7, () => {
					dispatcher.removeFromEggQueue(eggZoneName);
				});
				cleanup();
			}
		}, 0.1);

		return cleanup;
	}, [eggModel, camera, rotationMotion, transparencyMotion, sizeMotion, dispatcher, eggZoneName]);

	useEventListener(
		RunService.RenderStepped,
		() => {
			const scale = 0.06;
			const offset = new Vector3(0, -0.5, -6);
			const cameraOffset = new CFrame(offset.mul(scale));
			const eggCFrame = camera.CFrame.mul(cameraOffset).mul(CFrame.Angles(0, math.rad(-90), 0));

			const egg = eggModel as Model;
			const sizeValue = size.getValue();

			egg.PivotTo(eggCFrame.mul(CFrame.Angles(math.rad(rotation.getValue()), 0, 0)));

			if (sizeValue > 0) {
				egg.ScaleTo(sizeValue);
			}
		},
		{ connected: eggModel !== undefined },
	);

	useBindingListener(transparency, () => {
		const transparencyValue = transparency.getValue();
		eggModel?.GetDescendants().forEach((descendants) => {
			if (descendants.IsA("BasePart")) {
				descendants.Transparency = transparencyValue;
			}
		});
	});

	useUnmountEffect(() => {
		eggModel?.Destroy();
	});

	return <></>;
}
