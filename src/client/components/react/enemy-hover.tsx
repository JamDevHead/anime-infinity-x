import { Spring } from "@rbxts/flipper";
import { lerp, useMotor, useMountEffect, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";

export function EnemyHover() {
	const [mount, setMount] = useMotor(1);

	useMountEffect(() => {
		setMount(new Spring(0));
	});

	useUnmountEffect(() => {
		setMount(new Spring(1));
	});

	return (
		<highlight
			DepthMode={Enum.HighlightDepthMode.Occluded}
			FillTransparency={1}
			OutlineTransparency={mount.map((t) => lerp(0, 1, t))}
			OutlineColor={Color3.fromRGB(255, 255, 255)}
		/>
	);
}
