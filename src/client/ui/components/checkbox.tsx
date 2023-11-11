import Roact, { FunctionComponent, useState } from "@rbxts/roact";
import { Button } from "@/client/ui/components/button";
import { Image } from "@/client/ui/components/image";
import { images } from "@/shared/assets/images";

type CheckboxProps = {
	checked?: boolean;
	onCheck?: (checked: boolean) => void;
	disabled?: boolean;
};

export const Checkbox: FunctionComponent<CheckboxProps> = ({ checked, onCheck, disabled }) => {
	const [checkedState, setCheckedState] = useState(checked ?? false);

	return (
		<Button
			onClick={() => {
				if (disabled) return;
				setCheckedState(!checkedState);
				onCheck?.(!checkedState);
			}}
			autoSize={Enum.AutomaticSize.XY}
			backgroundTransparency={1}
		>
			<Image image={images.ui.checkbox} size={UDim2.fromOffset(32, 32)}>
				<Image
					image={images.ui.checkmark}
					visible={checkedState}
					position={UDim2.fromScale(0.5, 0.5)}
					anchorPoint={new Vector2(0.5, 0.5)}
					size={UDim2.fromOffset(20, 20)}
				/>
			</Image>
		</Button>
	);
};
