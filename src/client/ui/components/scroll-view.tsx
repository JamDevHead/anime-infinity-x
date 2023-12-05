import Roact, { forwardRef, Ref } from "@rbxts/roact";
import { FrameProps } from "@/client/ui/components/frame";

type ScrollViewProps = FrameProps<ScrollingFrame> & {
	canvasPosition?: Vector2;
	canvasSize?: UDim2;
	elasticBehavior?: Enum.ElasticBehavior;
	verticalScrollBarInset?: Enum.ScrollBarInset;
	horizontalScrollBarInset?: Enum.ScrollBarInset;
	autoCanvasSize?: Enum.AutomaticSize;
	bottomImage?: string;
	midImage?: string;
	topImage?: string;
	scrollImageColor3?: Color3;
	scrollImageTransparency?: number;
	thickness?: number;
	scrollingDirection?: Enum.ScrollingDirection;
	enabled?: boolean;
	verticalScrollBarPosition?: Enum.VerticalScrollBarPosition;
	fillDirection?: Enum.FillDirection | "Vertical" | "Horizontal";
	horizontalAlignment?: Enum.HorizontalAlignment | "Center" | "Left" | "Right";
	verticalAlignment?: Enum.VerticalAlignment | "Center" | "Top" | "Bottom";
	padding?: UDim;
	cellPadding?: UDim2;
	cellSize?: UDim2;
	fillDirectionMaxCells?: number;
	sortOrder?: Enum.SortOrder | "LayoutOrder" | "Name" | "Custom";
	grid?: boolean;
	margin?: { Left?: UDim; Right?: UDim; Top?: UDim; Bottom?: UDim };
};

export const ScrollView = forwardRef((props: ScrollViewProps, ref: Ref<ScrollingFrame>) => {
	return (
		<scrollingframe
			ref={ref}
			Size={props.size}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			Rotation={props.rotation}
			BackgroundColor3={props.backgroundColor}
			BackgroundTransparency={props.backgroundTransparency ?? 1}
			ClipsDescendants={props.clipsDescendants}
			Visible={props.visible}
			ZIndex={props.zIndex}
			LayoutOrder={props.layoutOrder}
			BorderSizePixel={0}
			Event={props.event || {}}
			Change={props.change || {}}
			AutomaticSize={props.autoSize}
			CanvasPosition={props.canvasPosition}
			CanvasSize={props.canvasSize ?? UDim2.fromScale(0, 0)}
			ElasticBehavior={props.elasticBehavior}
			VerticalScrollBarInset={props.verticalScrollBarInset}
			HorizontalScrollBarInset={props.horizontalScrollBarInset}
			AutomaticCanvasSize={props.autoCanvasSize ?? Enum.AutomaticSize.Y}
			BottomImage={props.bottomImage}
			MidImage={props.midImage}
			TopImage={props.topImage}
			ScrollBarImageColor3={props.scrollImageColor3}
			ScrollBarImageTransparency={props.scrollImageTransparency}
			ScrollBarThickness={props.thickness}
			ScrollingDirection={props.scrollingDirection}
			ScrollingEnabled={props.enabled}
			VerticalScrollBarPosition={props.verticalScrollBarPosition}
		>
			{props.grid ? (
				<uigridlayout
					FillDirection={props.fillDirection ?? Enum.FillDirection.Vertical}
					HorizontalAlignment={props.horizontalAlignment ?? Enum.HorizontalAlignment.Right}
					VerticalAlignment={props.verticalAlignment ?? Enum.VerticalAlignment.Top}
					CellSize={props.cellSize ?? new UDim2(1, 0, 0, 36)}
					FillDirectionMaxCells={props.fillDirectionMaxCells}
					SortOrder={props.sortOrder ?? Enum.SortOrder.LayoutOrder}
					CellPadding={props.cellPadding}
				/>
			) : (
				<uilistlayout
					FillDirection={props.fillDirection ?? Enum.FillDirection.Vertical}
					HorizontalAlignment={props.horizontalAlignment ?? Enum.HorizontalAlignment.Right}
					VerticalAlignment={props.verticalAlignment ?? Enum.VerticalAlignment.Top}
					SortOrder={props.sortOrder ?? Enum.SortOrder.LayoutOrder}
					Padding={props.padding ?? new UDim(0, 0)}
				/>
			)}
			{props.margin && (
				<uipadding
					key="padding"
					PaddingBottom={props.margin.Bottom}
					PaddingLeft={props.margin.Left}
					PaddingRight={props.margin.Right}
					PaddingTop={props.margin.Top}
				/>
			)}
			{props.cornerRadius && <uicorner key="corner" CornerRadius={props.cornerRadius} />}
			{props.children}
		</scrollingframe>
	);
});
