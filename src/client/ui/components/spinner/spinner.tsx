import { useInterval } from "@rbxts/pretty-react-hooks";
import Roact, { FunctionComponent, useState } from "@rbxts/roact";
import { SpriteSheet } from "@/client/ui/components/sprite-sheet";
import { images } from "@/shared/assets/images";

type Props = {
	/**
	 * Color of the spinner.
	 */
	color?: Color3;
	/**
	 * The size of the spinner.
	 */
	size?: UDim2;
	/**
	 * The position of the spinner.
	 */
	position?: UDim2;
};

export const Spinner: FunctionComponent<Props> = ({ position, color, size }) => {
	const [currentFrame, setCurrentFrame] = useState(0);

	useInterval(() => {
		setCurrentFrame((currentFrame) => (currentFrame + 1) % 80);
	}, 1 / 70);

	return (
		<SpriteSheet
			config={{
				images: [images.ui.material_spinner],
				size: 113.7,
				count: currentFrame,
				columns: 9,
				rows: 9,
			}}
			alpha={1}
			position={position}
			size={size}
			imageColor={color}
		/>
	);
};
