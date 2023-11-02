import Roact, { PropsWithChildren } from "@rbxts/roact";

interface StatsBarProps extends PropsWithChildren {
	IconId: string;
	StatText: string;
}

export function StatsBar({ IconId, StatText }: StatsBarProps) {
	return (
		<frame
			AnchorPoint={new Vector2(0, 0.5)}
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			Position={UDim2.fromScale(0, 0.381)}
			Size={UDim2.fromScale(1, 0.24)}
			SizeConstraint={Enum.SizeConstraint.RelativeXX}
			key={"StarsBar"}
		>
			<imagelabel
				Image={"rbxassetid://14930728426"}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.0267, -0.0694)}
				Size={UDim2.fromScale(0.99, 1.14)}
				ZIndex={0}
				key={"Background"}
			/>

			<imagelabel
				Image={IconId}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.0733, 0.514)}
				Size={UDim2.fromScale(0.393, 1.62)}
				ZIndex={2}
				key={"Icon"}
			/>

			<textlabel
				FontFace={
					new Font("rbxasset://fonts/families/GothamSSm.json", Enum.FontWeight.Heavy, Enum.FontStyle.Normal)
				}
				Text={StatText}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
				TextSize={14}
				TextWrapped={true}
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.275, 0.5)}
				Size={UDim2.fromScale(0.65, 0.525)}
				key={"Label"}
			>
				<uigradient
					key={"UIGradient"}
					Color={
						new ColorSequence([
							new ColorSequenceKeypoint(0, Color3.fromRGB(55, 231, 255)),
							new ColorSequenceKeypoint(1, Color3.fromRGB(12, 106, 248)),
						])
					}
					Rotation={90}
				/>

				<uistroke key={"UIStroke"} Color={Color3.fromRGB(0, 12, 56)} Thickness={2} />
			</textlabel>
		</frame>
	);
}
