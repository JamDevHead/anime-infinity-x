import Roact from "@rbxts/roact";
import { Image } from "@/client/ui/components/image";
import { images } from "@/shared/assets/images";
import { Enemy } from "@/client/components/enemy";
import { useLifetime } from "@rbxts/pretty-react-hooks";

const speed = 10;

export function EnemyAura({ enemy }: { enemy: Enemy }) {
	const enemySize = new Vector3(4, 4, 1).mul(enemy.instance.GetScale());
	const auraPosition = enemy.root.Position.sub(Vector3.yAxis.mul(enemySize.Y / 2 + enemy.root.Size.Y / 2));
	const lifetime = useLifetime();
	const rotation = lifetime.map((time) => math.rad(time * 360) * speed);

	return (
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
	);
}
