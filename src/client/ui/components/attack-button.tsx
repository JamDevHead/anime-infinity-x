import Roact, { PropsWithChildren } from "@rbxts/roact";
import { Button } from "@/client/ui/components/button";
import { FrameProps } from "@/client/ui/components/frame";
import { Image } from "@/client/ui/components/image";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";
import remotes from "@/shared/remotes";

interface AttackButtonProps extends PropsWithChildren, FrameProps {
	color: Color3;
	icon: string;
	onClick?: () => void;
}

export function AttackButton({ children, position, size, color, onClick, icon, anchorPoint }: AttackButtonProps) {
	const rem = useRem();

	function onMouseDown() {
		remotes.attackEnemy.fire();
	}

	return (
		<Button
			onMouseDown={onMouseDown}
			position={position}
			size={size || UDim2.fromOffset(rem(64, "pixel"), rem(64, "pixel"))}
			onClick={onClick}
			cornerRadius={new UDim(1, 0)}
			backgroundTransparency={1}
			anchorPoint={anchorPoint}
		>
			<Image size={UDim2.fromScale(1, 1)} image={images.ui.attack_button_base} imageColor={color}>
				<uipadding
					PaddingLeft={new UDim(0, rem(32, "pixel"))}
					PaddingRight={new UDim(0, rem(32, "pixel"))}
					PaddingTop={new UDim(0, rem(32, "pixel"))}
					PaddingBottom={new UDim(0, rem(32, "pixel"))}
				/>
				<Image size={UDim2.fromScale(1, 1)} image={icon} />
			</Image>
			{children}
		</Button>
	);
}
