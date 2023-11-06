import Roact, { FunctionComponent } from "@rbxts/roact";
import { Frame, FrameProps } from "@/client/ui/component/frame";

interface FlexBoxProps extends FrameProps {
	fillDirection: Enum.FillDirection;
	horizontalAlignment?: Enum.HorizontalAlignment;
	verticalAlignment?: Enum.VerticalAlignment;
	sortOrder?: Enum.SortOrder;
	padding?: UDim;
}

export const Stack: FunctionComponent<FlexBoxProps> = (props) => {
	return (
		<Frame
			ref={props.ref}
			size={props.size}
			position={props.position}
			anchorPoint={props.anchorPoint}
			rotation={props.rotation}
			backgroundColor={props.backgroundColor}
			backgroundTransparency={props.backgroundTransparency || 1}
			clipsDescendants={props.clipsDescendants}
			visible={props.visible}
			zIndex={props.zIndex}
			layoutOrder={props.layoutOrder}
			event={props.event}
			change={props.change}
		>
			<uilistlayout
				FillDirection={props.fillDirection}
				HorizontalAlignment={props.horizontalAlignment}
				VerticalAlignment={props.verticalAlignment}
				SortOrder={props.sortOrder}
				Padding={props.padding}
			/>
			{props.children}
		</Frame>
	);
};
