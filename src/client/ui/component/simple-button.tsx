import Roact, { PropsWithChildren } from "@rbxts/roact";
import { Button } from "@/client/ui/component/button";
import { FrameProps } from "@/client/ui/component/frame";
import { Image } from "@/client/ui/component/image";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

interface SimpleButtonProps extends PropsWithChildren, FrameProps {
	color: Color3;
	icon: string;
	onClick?: () => void;
}

export function SimpleButton({ children, position, size, color, onClick, icon, anchorPoint }: SimpleButtonProps) {
	const rem = useRem();

	return (
		<Button
			position={position}
			size={size || UDim2.fromOffset(64, 64)}
			onClick={onClick}
			cornerRadius={new UDim(1, 0)}
			backgroundTransparency={1}
			anchorPoint={anchorPoint}
		>
			<Image size={UDim2.fromScale(1, 1)} image={images.ui.rounded_button_base} imageColor={color}>
				<uipadding
					PaddingLeft={new UDim(0, rem(24, "pixel"))}
					PaddingRight={new UDim(0, rem(24, "pixel"))}
					PaddingTop={new UDim(0, rem(24, "pixel"))}
					PaddingBottom={new UDim(0, rem(24, "pixel"))}
				/>
				<Image size={UDim2.fromScale(1, 1)} image={icon} />
			</Image>
			{children}
		</Button>
	);
}
