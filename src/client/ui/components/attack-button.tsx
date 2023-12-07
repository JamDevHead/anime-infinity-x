import Roact, { PropsWithChildren } from "@rbxts/roact";
import { springs } from "@/client/constants/springs";
import { Button } from "@/client/ui/components/button";
import { FrameProps } from "@/client/ui/components/frame";
import { Image } from "@/client/ui/components/image";
import { useRem } from "@/client/ui/hooks/use-rem";
import { useMotion } from "@/client/ui/hooks/use-motion";
import { images } from "@/shared/assets/images";
import remotes from "@/shared/remotes";

interface AttackButtonProps extends PropsWithChildren, FrameProps {
	color: Color3;
	icon: string;
	onClick?: () => void;
}

export function AttackButton({ children, position, size, color, onClick, icon, anchorPoint }: AttackButtonProps) {
	const rem = useRem();
	const [click, clickMotion] = useMotion(1);

	function onMouseDown() {
		clickMotion.spring(0.65, springs.stiff);
		remotes.attackEnemy.fire();
		task.delay(0.1, () => {
			clickMotion.spring(1, springs.stiff);
		});
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
			<uiscale Scale={click} />
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
