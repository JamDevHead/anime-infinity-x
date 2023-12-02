import Roact, { FunctionComponent, PropsWithChildren } from "@rbxts/roact";
import { Frame, FrameProps } from "@/client/ui/components/frame";

interface GridProps extends FrameProps {
	columns?: number;
	rows?: number;
	fillDirection?: Enum.FillDirection | "Horizontal" | "Vertical";
	cellSize?: UDim2;
	cellPadding?: UDim2;
	horizontalAlignment?: Enum.HorizontalAlignment | "Center" | "Left" | "Right";
	verticalAlignment?: Enum.VerticalAlignment | "Center" | "Top" | "Bottom";
	sortOrder?: Enum.SortOrder | "LayoutOrder";
	startCorner?: Enum.StartCorner | "BottomLeft" | "BottomRight" | "TopLeft" | "TopRight";
}

export const Grid: FunctionComponent<PropsWithChildren<GridProps>> = (props) => {
	return (
		<Frame
			ref={props.ref}
			size={props.size}
			position={props.position}
			anchorPoint={props.anchorPoint}
			rotation={props.rotation}
			backgroundColor={props.backgroundColor}
			backgroundTransparency={props.backgroundTransparency ?? 1}
			clipsDescendants={props.clipsDescendants}
			visible={props.visible}
			zIndex={props.zIndex}
			layoutOrder={props.layoutOrder}
			event={props.event}
			change={props.change}
			autoSize={props.autoSize}
			cornerRadius={props.cornerRadius}
		>
			<uigridlayout
				CellSize={props.cellSize}
				CellPadding={props.cellPadding}
				SortOrder={props.sortOrder}
				HorizontalAlignment={props.horizontalAlignment}
				VerticalAlignment={props.verticalAlignment}
				FillDirection={props.fillDirection}
				StartCorner={props.startCorner}
				FillDirectionMaxCells={props.columns}
			/>
			{props.children}
		</Frame>
	);
};
