import Roact, { FunctionComponent, PropsWithChildren } from "@rbxts/roact";
import { Frame, FrameProps } from "@/client/ui/component/frame";

interface GridProps extends FrameProps {
	columns?: number;
	rows?: number;
	cellSize?: UDim2;
	cellPadding?: UDim2;
	cellHorizontalAlignment?: Enum.HorizontalAlignment;
	cellVerticalAlignment?: Enum.VerticalAlignment;
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
		>
			<uigridlayout
				CellSize={props.cellSize}
				CellPadding={props.cellPadding}
				SortOrder={props.sortOrder}
				HorizontalAlignment={props.cellHorizontalAlignment}
				VerticalAlignment={props.cellVerticalAlignment}
				FillDirection={Enum.FillDirection.Horizontal}
				StartCorner={props.startCorner}
				FillDirectionMaxCells={props.columns}
			/>
			{props.children}
		</Frame>
	);
};
