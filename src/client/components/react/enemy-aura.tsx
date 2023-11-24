import Roact, { useRef } from "@rbxts/roact";
import { Image } from "@/client/ui/components/image";
import { images } from "@/shared/assets/images";
import { EnemyComponent } from "@/shared/components/enemy-component";
import { useLifetime, useMotor, useMountEffect } from "@rbxts/pretty-react-hooks";
import { Spring } from "@rbxts/flipper";

const auraSpeed = 20;

export function EnemyAura({ enemy }: { enemy: EnemyComponent }) {
	const enemySize = new Vector3(4, 4, 1).mul(enemy.instance.GetScale());
	const auraPosition = enemy.root.Position.sub(Vector3.yAxis.mul(enemySize.Y / 2 + enemy.root.Size.Y / 2));
	const lifetime = useLifetime();
	const rotation = lifetime.map((time) => math.rad(time * 360) * auraSpeed);
	const [highlightFade, setHighlightFade] = useMotor(1);
	const highlightRef = useRef<Highlight>();

	useMountEffect(() => {
		if (!highlightRef.current) {
			return;
		}

		setHighlightFade(new Spring(0.7));
		task.wait(0.125);
		setHighlightFade(new Spring(1));
	});

	return (
		<>
			<part
				Position={auraPosition}
				Anchored={true}
				Size={new Vector3(enemySize.X, 0.01, enemySize.Y)}
				Transparency={1}
				CanCollide={false}
				CanQuery={false}
				CanTouch={false}
			>
				<surfacegui SizingMode={Enum.SurfaceGuiSizingMode.PixelsPerStud} Face={Enum.NormalId.Top}>
					<Image rotation={rotation} size={UDim2.fromScale(1, 1)} image={images.fx.target_aura} />
				</surfacegui>
			</part>
			<highlight
				ref={highlightRef}
				DepthMode={Enum.HighlightDepthMode.Occluded}
				FillTransparency={highlightFade}
				FillColor={Color3.fromRGB(5, 5, 5)}
				OutlineTransparency={0.1}
				OutlineColor={Color3.fromRGB(255, 255, 255)}
			/>
		</>
	);
}
