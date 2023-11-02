import Roact, { PropsWithChildren } from "@rbxts/roact";

interface WindowProps extends PropsWithChildren {
	Title: string;
	Size: UDim2;
}

export function Window({ children, Title, Size }: WindowProps) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(0, 0, 0)}
			BorderSizePixel={0}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
			key={"Bounds"}
		>
			<uiaspectratioconstraint key={"UIAspectRatioConstraint"} />

			<frame
				key={"Frame"}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BackgroundTransparency={1}
				BorderColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={Size}
			>
				<frame
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					ZIndex={0}
					key={"Background"}
				>
					<imagelabel
						Image={"rbxassetid://14547833083"}
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundColor3={Color3.fromRGB(255, 255, 255)}
						BackgroundTransparency={1}
						BorderColor3={Color3.fromRGB(0, 0, 0)}
						BorderSizePixel={0}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(1, 1)}
						key={"Label"}
					>
						<uistroke
							key={"UIStroke"}
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							Color={Color3.fromRGB(255, 255, 255)}
							LineJoinMode={Enum.LineJoinMode.Bevel}
							Thickness={3}
						>
							<uigradient
								key={"UIGradient"}
								Color={
									new ColorSequence([
										new ColorSequenceKeypoint(0, Color3.fromRGB(255, 153, 0)),
										new ColorSequenceKeypoint(1, Color3.fromRGB(255, 214, 0)),
									])
								}
								Rotation={90}
							/>
						</uistroke>
					</imagelabel>

					<frame
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundColor3={Color3.fromRGB(255, 255, 255)}
						BackgroundTransparency={1}
						BorderColor3={Color3.fromRGB(0, 0, 0)}
						BorderSizePixel={0}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={new UDim2(1, 16, 1, 16)}
						ZIndex={0}
						key={"Geometry"}
					>
						<imagelabel
							Image={"rbxassetid://14547918297"}
							AnchorPoint={new Vector2(0.5, 0.5)}
							BackgroundColor3={Color3.fromRGB(255, 255, 255)}
							BackgroundTransparency={1}
							BorderColor3={Color3.fromRGB(0, 0, 0)}
							BorderSizePixel={0}
							Position={UDim2.fromScale(0.51, 0.484)}
							Size={UDim2.fromScale(1.1, 1.13)}
							ZIndex={0}
							key={"Label"}
						/>
					</frame>

					<canvasgroup
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundColor3={Color3.fromRGB(255, 255, 255)}
						BackgroundTransparency={1}
						BorderColor3={Color3.fromRGB(0, 0, 0)}
						BorderSizePixel={0}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(1, 1)}
						ZIndex={2}
						key={"BackTriangles"}
					>
						<imagelabel
							Image={"rbxassetid://14547779251"}
							ImageColor3={Color3.fromRGB(0, 0, 0)}
							ImageTransparency={0.95}
							AnchorPoint={new Vector2(0.5, 0.5)}
							BackgroundColor3={Color3.fromRGB(255, 255, 255)}
							BackgroundTransparency={1}
							BorderColor3={Color3.fromRGB(0, 0, 0)}
							BorderSizePixel={0}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromOffset(100, 100)}
							key={"Triangle"}
						/>
					</canvasgroup>
				</frame>

				<frame
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					key={"Content"}
				>
					{children}
				</frame>

				<frame
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					ZIndex={2}
					key={"Foreground"}
				>
					<frame
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundColor3={Color3.fromRGB(255, 255, 255)}
						BackgroundTransparency={1}
						BorderColor3={Color3.fromRGB(0, 0, 0)}
						BorderSizePixel={0}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={new UDim2(1, -8, 1, -8)}
						key={"Inline"}
					>
						<uistroke
							key={"UIStroke"}
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							LineJoinMode={Enum.LineJoinMode.Miter}
							Thickness={4}
							Transparency={0.5}
						/>
					</frame>
				</frame>

				<frame
					AnchorPoint={new Vector2(0.25, 1)}
					AutomaticSize={Enum.AutomaticSize.X}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.025, 0.05)}
					Rotation={-3.69}
					Size={UDim2.fromScale(0, 0.128)}
					ZIndex={3}
					key={"Title"}
				>
					<frame
						AnchorPoint={new Vector2(0, 0.5)}
						AutomaticSize={Enum.AutomaticSize.X}
						BackgroundColor3={Color3.fromRGB(255, 255, 255)}
						BackgroundTransparency={1}
						BorderColor3={Color3.fromRGB(0, 0, 0)}
						BorderSizePixel={0}
						Position={UDim2.fromScale(0, 0.5)}
						Size={UDim2.fromScale(0, 1)}
						key={"Label"}
					>
						<textlabel
							FontFace={
								new Font(
									"rbxasset://fonts/families/GothamSSm.json",
									Enum.FontWeight.Heavy,
									Enum.FontStyle.Normal,
								)
							}
							Text={Title}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							TextScaled={true}
							TextSize={14}
							TextWrapped={true}
							AnchorPoint={new Vector2(0, 0.5)}
							AutomaticSize={Enum.AutomaticSize.X}
							BackgroundColor3={Color3.fromRGB(255, 255, 255)}
							BackgroundTransparency={1}
							BorderColor3={Color3.fromRGB(0, 0, 0)}
							BorderSizePixel={0}
							LayoutOrder={2}
							Position={UDim2.fromScale(0, 0.5)}
							Size={UDim2.fromScale(0, 0.7)}
							key={"Label"}
						>
							<uistroke key={"UIStroke"} Thickness={3} Transparency={0.25}>
								<uigradient
									key={"UIGradient"}
									Rotation={90}
									Transparency={
										new NumberSequence([
											new NumberSequenceKeypoint(0, 0),
											new NumberSequenceKeypoint(1, 0.667),
										])
									}
								/>
							</uistroke>
						</textlabel>

						<uilistlayout
							key={"UIListLayout"}
							FillDirection={Enum.FillDirection.Horizontal}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							SortOrder={Enum.SortOrder.LayoutOrder}
							VerticalAlignment={Enum.VerticalAlignment.Center}
						/>

						<frame
							BackgroundColor3={Color3.fromRGB(255, 255, 255)}
							BackgroundTransparency={1}
							BorderColor3={Color3.fromRGB(0, 0, 0)}
							BorderSizePixel={0}
							LayoutOrder={1}
							Size={UDim2.fromScale(0.469, 1)}
							SizeConstraint={Enum.SizeConstraint.RelativeYY}
							key={"Padding"}
						/>

						<frame
							BackgroundColor3={Color3.fromRGB(255, 255, 255)}
							BackgroundTransparency={1}
							BorderColor3={Color3.fromRGB(0, 0, 0)}
							BorderSizePixel={0}
							LayoutOrder={3}
							Size={UDim2.fromScale(0.469, 1)}
							SizeConstraint={Enum.SizeConstraint.RelativeYY}
							key={"Padding"}
						/>
					</frame>

					<frame
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundColor3={Color3.fromRGB(255, 255, 255)}
						BackgroundTransparency={1}
						BorderColor3={Color3.fromRGB(0, 0, 0)}
						BorderSizePixel={0}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(1, 1)}
						ZIndex={0}
						key={"Back"}
					>
						<imagelabel
							Image={"rbxassetid://14548396550"}
							ScaleType={Enum.ScaleType.Slice}
							SliceCenter={new Rect(42, 0, 46, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							BackgroundColor3={Color3.fromRGB(255, 255, 255)}
							BackgroundTransparency={1}
							BorderColor3={Color3.fromRGB(0, 0, 0)}
							BorderSizePixel={0}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(1, 1)}
							ZIndex={-3}
							key={"Color"}
						>
							<uigradient
								key={"UIGradient"}
								Color={
									new ColorSequence([
										new ColorSequenceKeypoint(0, Color3.fromRGB(40, 64, 190)),
										new ColorSequenceKeypoint(1, Color3.fromRGB(26, 53, 193)),
									])
								}
								Rotation={90}
							/>
						</imagelabel>

						<imagelabel
							Image={"rbxassetid://14548395602"}
							ImageColor3={Color3.fromRGB(0, 0, 0)}
							ImageTransparency={0.5}
							ScaleType={Enum.ScaleType.Slice}
							SliceCenter={new Rect(42, 0, 46, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							BackgroundColor3={Color3.fromRGB(255, 255, 255)}
							BackgroundTransparency={1}
							BorderColor3={Color3.fromRGB(0, 0, 0)}
							BorderSizePixel={0}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(1, 1)}
							ZIndex={-2}
							key={"Inline"}
						/>

						<imagelabel
							Image={"rbxassetid://14548394535"}
							ScaleType={Enum.ScaleType.Slice}
							SliceCenter={new Rect(42, 0, 46, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							BackgroundColor3={Color3.fromRGB(255, 255, 255)}
							BackgroundTransparency={1}
							BorderColor3={Color3.fromRGB(0, 0, 0)}
							BorderSizePixel={0}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(1, 1)}
							ZIndex={-1}
							key={"Outline"}
						>
							<uigradient
								key={"UIGradient"}
								Color={
									new ColorSequence([
										new ColorSequenceKeypoint(0, Color3.fromRGB(255, 214, 0)),
										new ColorSequenceKeypoint(1, Color3.fromRGB(255, 153, 0)),
									])
								}
								Rotation={90}
							/>
						</imagelabel>
					</frame>
				</frame>

				<imagebutton
					Image={"rbxassetid://14557812960"}
					ScaleType={Enum.ScaleType.Fit}
					AutoButtonColor={false}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(0, 0, 0)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(1, 0)}
					Size={UDim2.fromScale(0.17, 0.17)}
					ZIndex={3}
					key={"CloseButton"}
				>
					<uiaspectratioconstraint key={"UIAspectRatioConstraint"} AspectRatio={0.95} />
				</imagebutton>
			</frame>
		</frame>
	);
}
