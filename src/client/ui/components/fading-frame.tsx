import Roact, { PropsWithChildren } from "@rbxts/roact";
import { Frame, FrameProps } from "@/client/ui/components/frame";

interface FadingFrameProps extends PropsWithChildren, FrameProps {}

export function FadingFrame(props: FadingFrameProps) {
	return (
		<Frame
			{...props}
			anchorPoint={Vector2.one}
			backgroundColor={Color3.fromRGB(255, 255, 255)}
			cornerRadius={new UDim(0.154, 0)}
		>
			<uigradient
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

			{props.children}
		</Frame>
	);
}
