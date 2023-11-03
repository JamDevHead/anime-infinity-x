import Roact, { PropsWithChildren } from "@rbxts/roact";

interface FadingFrameProps extends PropsWithChildren, Frame {}

export function FadingFrame(props: FadingFrameProps) {
	return (
		<frame
			key={"DPS"}
			{...props}
			AnchorPoint={Vector2.one}
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
		>
			<uigradient
				key={"UIGradient"}
				Color={
					new ColorSequence([
						new ColorSequenceKeypoint(0, Color3.fromRGB(0, 0, 0)),
						new ColorSequenceKeypoint(1, Color3.fromRGB(0, 0, 0)),
					])
				}
				Rotation={90}
				Transparency={
					new NumberSequence([new NumberSequenceKeypoint(0, 0.5), new NumberSequenceKeypoint(1, 0.75)])
				}
			/>

			<uicorner key={"UICorner"} CornerRadius={new UDim(0.154, 0)} />

			{props.children}

			<uiaspectratioconstraint key={"UIAspectRatioConstraint"} AspectRatio={3.85} />
		</frame>
	);
}
