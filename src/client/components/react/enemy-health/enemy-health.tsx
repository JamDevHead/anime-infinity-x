import Roact, { useEffect, useState } from "@rbxts/roact";
import { Enemy } from "@/client/components/enemy-component";
import { colors } from "@/client/constants/colors";
import { springs } from "@/client/constants/springs";
import { Frame } from "@/client/ui/components/frame";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { useMotion } from "@/client/ui/hooks/use-motion";
import { images } from "@/shared/assets/images";

function HealthBar({
	image,
	color,
	scaleType,
	size,
	sizeConstraint,
	zIndex,
}: {
	image: string;
	color?: Color3;
	scaleType?: Roact.InferEnumNames<Enum.ScaleType>;
	size?: UDim2;
	sizeConstraint?: Roact.InferEnumNames<Enum.SizeConstraint>;
	zIndex?: number;
}) {
	return (
		<Image
			image={image}
			size={size ?? UDim2.fromScale(6.4, 1)}
			scaleType={scaleType ?? "Fit"}
			sizeConstraint={sizeConstraint ?? "RelativeYY"}
			imageColor={color}
			zIndex={zIndex}
		>
			<uigradient Rotation={90} Color={new ColorSequence(Color3.fromHex("#8f8f8f"), Color3.fromHex("#efefef"))} />
		</Image>
	);
}

export function EnemyHealth({ enemy }: { enemy: Enemy | { instance: Instance; humanoid: Humanoid } }) {
	const humanoid = enemy.humanoid;
	const [healthBar, healthBarMotion] = useMotion(UDim2.fromScale(1, 1));
	const [healthBarBackground, healthBarBackgroundMotion] = useMotion(UDim2.fromScale(1, 1));
	const [health, setHealth] = useState("0/0");

	useEffect(() => {
		if (!humanoid) {
			return;
		}

		const connection = humanoid.HealthChanged.Connect((newHealth) => {
			const maxHealth = humanoid.MaxHealth;
			const currentHealth = humanoid.Health;
			const currentRatio = math.min(currentHealth / maxHealth, 0.977);
			const newRatio = math.min(newHealth / maxHealth, 0.977);

			setHealth(`${currentHealth}/${maxHealth}`);
			healthBarMotion.spring(UDim2.fromScale(newRatio, 1), springs.responsive);
			task.wait(0.25);
			healthBarBackgroundMotion.spring(UDim2.fromScale(currentRatio, 1), {
				...springs.responsive,
				damping: 2,
			});
		});

		const startingRatio = humanoid.Health / humanoid.MaxHealth;
		setHealth(`${humanoid.Health}/${humanoid.MaxHealth}`);

		healthBarMotion.spring(UDim2.fromScale(startingRatio, 1), springs.responsive);
		task.delay(0.25, () => {
			healthBarBackgroundMotion.spring(UDim2.fromScale(startingRatio, 1), {
				...springs.responsive,
				damping: 2,
			});
		});

		return () => connection.Disconnect();
	}, [healthBarBackgroundMotion, healthBarMotion, humanoid]);

	return (
		<billboardgui Size={UDim2.fromScale(4, 1.25)} MaxDistance={300} StudsOffsetWorldSpace={Vector3.yAxis.mul(3)}>
			<Stack
				horizontalAlignment={"Center"}
				fillDirection={Enum.FillDirection.Vertical}
				padding={new UDim(0.1, 0)}
				size={UDim2.fromScale(1, 1)}
			>
				<Text
					text={enemy.instance.Name}
					font={Font.fromName("SourceSansPro", Enum.FontWeight.Heavy)}
					size={UDim2.fromScale(1, 0.4)}
					textColor={colors.white}
					textStroke={Color3.fromHex("#140526")}
					textStrokeTransparency={0}
					textScaled
					textWrapped
				/>
				<Image
					imageColor={Color3.fromHex("#140526")}
					key={"outline"}
					image={images.ui.enemy_health.health_bar_outline}
					size={UDim2.fromScale(1, 0.5)}
					clipsDescendants={true}
					zIndex={4}
				>
					<uisizeconstraint MaxSize={new Vector2(512, 160)} />

					<Frame key={"health"} backgroundTransparency={1} size={healthBar} clipsDescendants={true}>
						<HealthBar
							zIndex={3}
							color={Color3.fromHex("#1ff27d")}
							image={images.ui.enemy_health.health_bar_fill}
						/>
					</Frame>

					<Frame
						key={"health_background"}
						backgroundTransparency={1}
						size={healthBarBackground}
						clipsDescendants={true}
					>
						<HealthBar zIndex={2} image={images.ui.enemy_health.health_bar_fill} />
					</Frame>

					<HealthBar
						image={images.ui.enemy_health.health_bar_fill}
						color={Color3.fromHex("#ee513c")}
						sizeConstraint={"RelativeXY"}
						scaleType={"Stretch"}
						size={UDim2.fromScale(1, 1)}
					/>

					<Text
						text={health}
						font={Font.fromName("GothamSSm", Enum.FontWeight.Heavy)}
						size={UDim2.fromScale(0.8, 0.65)}
						position={UDim2.fromScale(0.5, 0.5)}
						anchorPoint={Vector2.one.mul(0.5)}
						textColor={colors.white}
						textStroke={Color3.fromHex("#140526")}
						textStrokeTransparency={0}
						zIndex={5}
						textXAlignment={"Left"}
						textScaled
						textWrapped
					/>
				</Image>
			</Stack>
		</billboardgui>
	);
}
