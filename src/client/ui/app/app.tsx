import Roact from "@rbxts/roact";
import { Button } from "@/client/ui/component/button";
import { Text } from "@/client/ui/component/text";

export const App = () => {
	return (
		<screengui>
			<Button
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(0, 100, 0, 50)}
				anchorPoint={new Vector2(0.5, 0.5)}
				cornerRadius={new UDim(0, 5)}
			></Button>
		</screengui>
	);
};
