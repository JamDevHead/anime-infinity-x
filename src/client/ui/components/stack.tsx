import Roact, { FunctionComponent } from "@rbxts/roact";
import { Frame, FrameProps } from "@/client/ui/components/frame";

interface FlexBoxProps extends FrameProps {
	fillDirection: Enum.FillDirection | "Horizontal" | "Vertical";
	horizontalAlignment?: Enum.HorizontalAlignment | "Center" | "Left" | "Right";
	verticalAlignment?: Enum.VerticalAlignment | "Center" | "Top" | "Bottom";
	sortOrder?: Enum.SortOrder;
	padding?: UDim;
}

export const Stack: FunctionComponent<FlexBoxProps> = (props) => {
	return (
		<Frame
			ref={props.ref}
			size={props.size || UDim2.fromScale(1, 1)}
			position={props.position}
			anchorPoint={props.anchorPoint}
			rotation={props.rotation}
			backgroundColor={props.backgroundColor}
			backgroundTransparency={1 || props.backgroundTransparency}
			clipsDescendants={props.clipsDescendants}
			visible={props.visible}
			zIndex={props.zIndex}
			layoutOrder={props.layoutOrder}
			event={props.event}
			change={props.change}
			autoSize={props.autoSize}
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
