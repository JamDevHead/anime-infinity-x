import Roact, { FunctionComponent, useEffect } from "@rbxts/roact";
import { UserInputService } from "@rbxts/services";
import { colors } from "@/client/constants/colors";
import { fonts } from "@/client/constants/fonts";
import { Button } from "@/client/ui/components/button";
import { Frame } from "@/client/ui/components/frame";
import { Text } from "@/client/ui/components/text";

type BindingButtonProps = {
	text: string;
	binding: Enum.KeyCode;
	size?: UDim2;
	position?: UDim2;
	onClick?: () => void;
};

export const BindingButton: FunctionComponent<BindingButtonProps> = ({ position, size, onClick, text, binding }) => {
	useEffect(() => {
		const inputBegan = (inputObject: InputObject, gameProcessedEvent: boolean) => {
			if (gameProcessedEvent) return;

			if (inputObject.KeyCode === binding) {
				onClick?.();
			}
		};

		const connection = UserInputService.InputBegan.Connect(inputBegan);

		return () => {
			connection.Disconnect();
		};
	}, [binding, onClick]);

	return (
		<Button
			position={position ?? UDim2.fromScale(0.5, 0.5)}
			size={size ?? UDim2.fromOffset(72, 72)}
			anchorPoint={new Vector2(0.5, 0.5)}
			backgroundTransparency={0}
			backgroundColor={colors.white}
			cornerRadius={new UDim(0, 12)}
			onClick={onClick}
		>
			<Text
				size={UDim2.fromScale(1, 1)}
				position={UDim2.fromScale(0.5, 0.5)}
				anchorPoint={new Vector2(0.5, 0.5)}
				text={text}
				font={fonts.gotham.bold}
				textColor={colors.white}
				textAutoResize="XY"
				autoSize="XY"
			>
				<uitextsizeconstraint MaxTextSize={18} MinTextSize={12} />
			</Text>

			<uigradient
				Color={
					new ColorSequence([
						new ColorSequenceKeypoint(0, Color3.fromHex("#151329")),
						new ColorSequenceKeypoint(1, colors.black),
					])
				}
				Rotation={90}
			/>
			<Frame
				size={UDim2.fromScale(1, 1)}
				backgroundTransparency={1}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.5, 0.5)}
				cornerRadius={new UDim(0, 4)}
			>
				<uistroke Color={colors.white} Thickness={3} />
			</Frame>
			<Frame
				size={UDim2.fromOffset(32, 32)}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(1, 1)}
				cornerRadius={new UDim(1, 0)}
				backgroundColor={colors.white}
			>
				<Text
					size={UDim2.fromScale(1, 1)}
					text={binding.Name}
					font={fonts.gotham.bold}
					textColor={colors.black}
					textSize={24}
				/>
			</Frame>
			<uipadding
				PaddingBottom={new UDim(0, 8)}
				PaddingLeft={new UDim(0, 8)}
				PaddingRight={new UDim(0, 8)}
				PaddingTop={new UDim(0, 8)}
			/>
		</Button>
	);
};
