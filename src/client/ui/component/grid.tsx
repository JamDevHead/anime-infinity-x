import Roact, { FunctionComponent, PropsWithChildren } from "@rbxts/roact";
import { Frame, FrameProps } from "@/client/ui/component/frame";

interface GridProps extends FrameProps {
	columns?: number;
	rows?: number;
	fillDirection?: Enum.FillDirection;
	cellSize?: UDim2;
	cellPadding?: UDim2;
	horizontalAlignment?: Enum.HorizontalAlignment;
	verticalAlignment?: Enum.VerticalAlignment;
	sortOrder?: Enum.SortOrder;
	startCorner?: Enum.StartCorner;
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
			backgroundTransparency={props.backgroundTransparency || 1}
			clipsDescendants={props.clipsDescendants}
			visible={props.visible}
			zIndex={props.zIndex}
			layoutOrder={props.layoutOrder}
			event={props.event}
			change={props.change}
			autoSize={props.autoSize}
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
