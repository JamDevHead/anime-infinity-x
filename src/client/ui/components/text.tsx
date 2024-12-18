import Roact from "@rbxts/roact";
import { fonts } from "@/client/constants/fonts";
import { FrameProps } from "@/client/ui/components/frame";
import { useRem } from "@/client/ui/hooks/use-rem";

export interface TextProps<T extends Instance = TextLabel> extends FrameProps<T> {
	font?: Font;
	text?: string | Roact.Binding<string>;
	textColor?: Color3 | Roact.Binding<Color3>;
	textStroke?: Color3 | Roact.Binding<Color3>;
	textStrokeTransparency?: number | Roact.Binding<number>;
	textSize?: number | Roact.Binding<number>;
	textTransparency?: number | Roact.Binding<number>;
	textWrapped?: boolean | Roact.Binding<boolean>;
	textXAlignment?: Roact.InferEnumNames<Enum.TextXAlignment>;
	textYAlignment?: Roact.InferEnumNames<Enum.TextYAlignment>;
	textTruncate?: Roact.InferEnumNames<Enum.TextTruncate>;
	textScaled?: boolean | Roact.Binding<boolean>;
	textHeight?: number | Roact.Binding<number>;
	textAutoResize?: "X" | "Y" | "XY";
	richText?: boolean | Roact.Binding<boolean>;
	maxVisibleGraphemes?: number | Roact.Binding<number>;
}

export function Text(props: TextProps) {
	const rem = useRem();

	return (
		<textlabel
			Font={Enum.Font.Unknown}
			FontFace={props.font || fonts.inter.regular}
			Text={props.text}
			TextColor3={props.textColor}
			TextStrokeColor3={props.textStroke}
			TextStrokeTransparency={props.textStrokeTransparency}
			TextSize={props.textSize ?? rem(1)}
			TextTransparency={props.textTransparency}
			TextWrapped={props.textWrapped}
			TextXAlignment={props.textXAlignment}
			TextYAlignment={props.textYAlignment}
			TextTruncate={props.textTruncate}
			TextScaled={props.textScaled}
			LineHeight={props.textHeight}
			RichText={props.richText}
			MaxVisibleGraphemes={props.maxVisibleGraphemes}
			Size={props.size}
			AutomaticSize={props.textAutoResize}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			BackgroundColor3={props.backgroundColor}
			BackgroundTransparency={props.backgroundTransparency ?? 1}
			ClipsDescendants={props.clipsDescendants}
			Visible={props.visible}
			ZIndex={props.zIndex}
			LayoutOrder={props.layoutOrder}
			Change={props.change || {}}
			Event={props.event || {}}
			Rotation={props.rotation}
		>
			{props.cornerRadius && <uicorner key="corner" CornerRadius={props.cornerRadius} />}
			{props.children}
		</textlabel>
	);
}
