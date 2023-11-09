import Roact, { PropsWithChildren } from "@rbxts/roact";
import { Button } from "@/client/ui/component/button";
import { FrameProps } from "@/client/ui/component/frame";
import { Image } from "@/client/ui/component/image";
import { images } from "@/shared/assets/images";

interface AttackButtonProps extends PropsWithChildren, FrameProps {
	color: Color3;
	icon: string;
	onClick?: () => void;
}

export function AttackButton({ children, position, size, color, onClick, icon, anchorPoint }: AttackButtonProps) {
	return (
		<Button
			position={position}
			size={size || UDim2.fromOffset(64, 64)}
			onClick={onClick}
			cornerRadius={new UDim(1, 0)}
			backgroundTransparency={1}
			anchorPoint={anchorPoint}
		>
			<Image size={UDim2.fromScale(1, 1)} image={images.ui.attack_button_base} imageColor={color}>
				<uipadding
					PaddingLeft={new UDim(0, 32)}
					PaddingRight={new UDim(0, 32)}
					PaddingTop={new UDim(0, 32)}
					PaddingBottom={new UDim(0, 32)}
				/>
				<Image size={UDim2.fromScale(1, 1)} image={icon} />
			</Image>
			{children}
		</Button>
	);
}
