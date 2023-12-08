import Roact, { PropsWithChildren, useCallback, useEffect, useState } from "@rbxts/roact";
import { Enemy } from "@/client/components/enemy-component";
import { colors } from "@/client/constants/colors";
import { springs } from "@/client/constants/springs";
import { Frame } from "@/client/ui/components/frame";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { Text } from "@/client/ui/components/text";
import { useAbbreviator } from "@/client/ui/hooks/use-abbreviator";
import { useMotion } from "@/client/ui/hooks/use-motion";
import { images } from "@/shared/assets/images";

function HealthBar({
	image,
	color,
	scaleType,
	size,
	position,
	sizeConstraint,
	zIndex,
	children,
}: PropsWithChildren & {
	image: string;
	color?: Color3;
	scaleType?: Roact.InferEnumNames<Enum.ScaleType>;
	size?: UDim2 | Roact.Binding<UDim2>;
	position?: UDim2 | Roact.Binding<UDim2>;
	sizeConstraint?: Roact.InferEnumNames<Enum.SizeConstraint>;
	zIndex?: number;
}) {
	return (
		<Image
			image={image}
			size={size ?? UDim2.fromScale(6.4, 1)}
			position={position}
			scaleType={scaleType ?? "Stretch"}
			sizeConstraint={sizeConstraint ?? "RelativeXY"}
			imageColor={color}
			zIndex={zIndex}
		>
			{children}
			<uigradient Rotation={90} Color={new ColorSequence(Color3.fromHex("#8f8f8f"), Color3.fromHex("#efefef"))} />
		</Image>
	);
}

export function EnemyHealth({ enemy }: { enemy: Enemy | { instance: Model; humanoid: Humanoid } }) {
	const humanoid = enemy.humanoid;
	const [healthBar, healthBarMotion] = useMotion(UDim2.fromScale(1, 1));
	const [healthBarBackground, healthBarBackgroundMotion] = useMotion(UDim2.fromScale(1, 1));
	const [healthText, setHealthText] = useState("0/0 hp");
	const enemyScale = enemy.instance.GetScale();
	const abbreviator = useAbbreviator({ defaultDecimalPlaces: 0 });

	const updateHealthText = useCallback(() => {
		const maxHealth = humanoid.MaxHealth;
		const health = humanoid.Health;

		setHealthText(`${abbreviator.numberToString(health)} / ${abbreviator.numberToString(maxHealth)} hp`);
	}, [abbreviator, humanoid.Health, humanoid.MaxHealth]);

	useEffect(() => {
		if (!humanoid) {
			return;
		}

		const connection = humanoid.HealthChanged.Connect((newHealth) => {
			const maxHealth = humanoid.MaxHealth;
			const currentHealth = humanoid.Health;
			const currentRatio = currentHealth / maxHealth;
			const newRatio = newHealth / maxHealth;

			updateHealthText();
			healthBarMotion.spring(UDim2.fromScale(newRatio, 1), springs.responsive);
			task.wait(0.25);
			healthBarBackgroundMotion.spring(UDim2.fromScale(currentRatio, 1), {
				...springs.responsive,
				damping: 2,
			});
		});

		const startingRatio = humanoid.Health / humanoid.MaxHealth;
		updateHealthText();

		healthBarMotion.spring(UDim2.fromScale(startingRatio, 1), springs.responsive);
		task.delay(0.25, () => {
			healthBarBackgroundMotion.spring(UDim2.fromScale(startingRatio, 1), {
				...springs.responsive,
				damping: 2,
			});
		});

		return () => connection.Disconnect();
	}, [healthBarBackgroundMotion, healthBarMotion, humanoid, updateHealthText]);

	return (
		<billboardgui
			Size={UDim2.fromScale(4 * enemyScale, 1.25 * enemyScale)}
			MaxDistance={40 * enemyScale}
			StudsOffsetWorldSpace={Vector3.yAxis.mul(3 * enemyScale)}
		>
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
					<uisizeconstraint MaxSize={new Vector2(512, 80)} />

					<Frame key={"health"} backgroundTransparency={1} size={healthBar} clipsDescendants={true}>
						<HealthBar
							zIndex={3}
							color={Color3.fromHex("#1ff27d")}
							image={images.ui.enemy_health.health_bar_fill}
							scaleType={"Fit"}
							sizeConstraint={"RelativeYY"}
						/>
					</Frame>

					<Frame
						key={"health_background"}
						backgroundTransparency={1}
						size={healthBarBackground}
						clipsDescendants={true}
					>
						<HealthBar
							zIndex={2}
							image={images.ui.enemy_health.health_bar_fill}
							scaleType={"Fit"}
							sizeConstraint={"RelativeYY"}
						/>
					</Frame>

					<HealthBar
						key={"background"}
						image={images.ui.enemy_health.health_bar_fill}
						color={Color3.fromHex("#ee513c")}
						size={UDim2.fromScale(1, 1)}
					/>

					<Text
						text={healthText}
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
