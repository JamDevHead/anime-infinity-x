import { useCamera } from "@rbxts/pretty-react-hooks";
import Roact, { FunctionComponent } from "@rbxts/roact";

interface Props {
	factor?: number;
}

export const UiScaleAspectRatio: FunctionComponent<Props> = ({ factor }) => {
	const camera = useCamera();

	const aspectRatio = camera ? (camera.ViewportSize.Y / 1080) * (factor === undefined ? 1.5 : factor) : 1;

	return <uiscale Scale={aspectRatio} />;
};
