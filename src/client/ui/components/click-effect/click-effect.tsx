import { useMountEffect } from "@rbxts/pretty-react-hooks";
import Roact, { FunctionComponent, useEffect, useState } from "@rbxts/roact";
import { HttpService, UserInputService } from "@rbxts/services";
import { Image } from "@/client/ui/components/image";
import { useMotion } from "@/client/ui/hooks/use-motion";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

type RippleProps = {
	position: UDim2;
	onComplete?: () => void;
};

const Ripple: FunctionComponent<RippleProps> = ({ position, onComplete }) => {
	const rem = useRem();
	const [size, setSize] = useMotion(new UDim2());
	const [transparency, setTransparency] = useMotion(0.5);

	useMountEffect(() => {
		setSize.spring(UDim2.fromOffset(rem(75, "pixel"), rem(75, "pixel")));
		setTransparency.spring(1);

		setTransparency.onComplete(() => {
			onComplete?.();
		});
	});

	return (
		<Image
			anchorPoint={new Vector2(0.5, 0.5)}
			image={images.ui.click_effect}
			size={size}
			position={position}
			imageTransparency={transparency}
			zIndex={10}
		/>
	);
};

export const ClickEffect = () => {
	const [createdRipples, setCreatedRipples] = useState<Array<{ id: string; position: Vector2 }>>([]);

	useEffect(() => {
		const connection = UserInputService.InputEnded.Connect((input) => {
			if (input.UserInputType !== Enum.UserInputType.MouseButton1) return;

			const mousePosition = UserInputService.GetMouseLocation();
			const position = new Vector2(mousePosition.X, mousePosition.Y);

			const id = HttpService.GenerateGUID(false);
			setCreatedRipples((previous) => [...previous, { id, position }]);
		});
		return () => {
			connection.Disconnect();
		};
	}, []);

	return (
		<>
			{createdRipples.map((ripple, _) => {
				return (
					<Ripple
						key={ripple.id}
						position={UDim2.fromOffset(ripple.position.X, ripple.position.Y)}
						onComplete={() => {
							setCreatedRipples(createdRipples.filter((r) => r.id !== ripple.id));
						}}
					/>
				);
			})}
		</>
	);
};
