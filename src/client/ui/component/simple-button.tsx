import Roact, { PropsWithChildren } from "@rbxts/roact";

interface SimpleButtonProps extends PropsWithChildren {
	IconId?: string;
}

export function SimpleButton({ children, IconId }: SimpleButtonProps) {
	return (
		<imagebutton
			AnchorPoint={new Vector2(0, 0.5)}
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			Position={UDim2.fromScale(0, 0.325)}
			Size={UDim2.fromScale(0.46, 0.46)}
			SizeConstraint={Enum.SizeConstraint.RelativeXX}
			key={"Teleport"}
		>
			<imagelabel
				Image={"rbxassetid://14416174912"}
				ImageRectOffset={new Vector2(128, 0)}
				ImageRectSize={new Vector2(128, 128)}
				AnchorPoint={new Vector2(0.5, 0.75)}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0.75)}
				Size={UDim2.fromScale(1, 1)}
				key={"Background"}
			>
				{IconId ? (
					<imagelabel
						Image={IconId}
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundColor3={Color3.fromRGB(255, 255, 255)}
						BackgroundTransparency={1}
						BorderColor3={Color3.fromRGB(0, 0, 0)}
						BorderSizePixel={0}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.583, 0.583)}
						ZIndex={2}
						key={"Icon"}
					/>
				) : undefined}
				{children}
			</imagelabel>
			<uicorner CornerRadius={new UDim(1, 0)} key={"UICorner"} />
		</imagebutton>
	);
}
