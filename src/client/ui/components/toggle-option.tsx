import Roact, { FunctionComponent } from "@rbxts/roact";
import { Button } from "@/client/ui/components/button";
import { Image } from "@/client/ui/components/image";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

type ToggleOptionProps = {
	checked: boolean;
	onChange?: (checked: boolean) => void;
};

export const ToggleOption: FunctionComponent<ToggleOptionProps> = ({ checked, onChange }) => {
	const rem = useRem();

	return (
		<Button
			size={UDim2.fromOffset(rem(96, "pixel"), rem(48, "pixel"))}
			onClick={() => onChange?.(!checked)}
			backgroundTransparency={1}
		>
			<Image
				image={images.ui.option_toggle_base}
				size={UDim2.fromScale(1, 1)}
				imageColor={checked ? Color3.fromHex("#0f0") : Color3.fromHex("#f00")}
			>
				<Image
					image={checked ? images.ui.option_toggle_on : images.ui.option_toggle_off}
					position={UDim2.fromScale(0.5, 0.5)}
					size={UDim2.fromOffset(rem(32, "pixel"), rem(32, "pixel"))}
					anchorPoint={new Vector2(0.5, 0.5)}
				/>
			</Image>
		</Button>
	);
};
