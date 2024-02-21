import { useBindingListener, useThrottleState } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { springs } from "@/client/constants/springs";
import { useRootSelector } from "@/client/store";
import { Frame } from "@/client/ui/components/frame";
import { useMotion } from "@/client/ui/hooks/use-motion";

export function FighterSpecialHud({ fighterId }: { fighterId: string }) {
	const special = useRootSelector((state) => state.fighterSpecials[fighterId]);

	const [size, sizeMotion] = useMotion(0);
	const [fade, fadeMotion] = useMotion(1);
	const [throttledSize, setThrottledSize] = useThrottleState(size.getValue(), { wait: 1, leading: true });

	useEffect(() => {
		if (special === undefined) return;

		sizeMotion.spring(special / 100, springs.responsive);
	}, [sizeMotion, special]);

	useBindingListener(size, () => {
		setThrottledSize(size.getValue());
	});

	useBindingListener(throttledSize, () => {
		if (special === undefined) return;

		const lastSizeValue = size.getValue();

		fadeMotion.spring(0, springs.responsive);

		if (special > 0) return;

		task.delay(1, () => {
			if (lastSizeValue !== size.getValue()) return;

			fadeMotion.linear(1);
		});
	});

	return (
		<Frame
			backgroundTransparency={fade.map((t) => t)}
			cornerRadius={new UDim(1, 0)}
			size={UDim2.fromScale(1, 1)}
			backgroundColor={Color3.fromHex("#b4acac")}
		>
			<Frame
				position={UDim2.fromScale(0.5, 0.5)}
				anchorPoint={new Vector2(0.5, 0.5)}
				size={UDim2.fromScale(0.95, 0.5)}
				backgroundTransparency={1}
			>
				<Frame
					backgroundTransparency={fade.map((t) => t)}
					cornerRadius={new UDim(1, 0)}
					size={size.map((t) => UDim2.fromScale(t, 1))}
					backgroundColor={Color3.fromHex("#3435aa")}
				/>
			</Frame>
		</Frame>
	);
}
