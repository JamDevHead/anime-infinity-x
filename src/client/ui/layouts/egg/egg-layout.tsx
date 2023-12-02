import Roact, { FunctionComponent } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { BindingButton } from "@/client/ui/components/binding-button";
import { FighterCard } from "@/client/ui/components/fighter-card";
import { Frame } from "@/client/ui/components/frame";
import { Grid } from "@/client/ui/components/grid";
import { Image } from "@/client/ui/components/image";
import { Stack } from "@/client/ui/components/stack";
import { images } from "@/shared/assets/images";

type EggLayoutProps = {
	size?: UDim2;
	position?: UDim2;
};

export const EggLayout: FunctionComponent<EggLayoutProps> = ({ size, position }) => {
	return (
		<Frame anchorPoint={new Vector2(0.5, 0.5)} backgroundTransparency={1} position={position} size={size}>
			<Stack fillDirection="Vertical" size={UDim2.fromScale(1, 1)}>
				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					backgroundColor={colors.white}
					position={UDim2.fromScale(0.5, 0.5)}
					size={UDim2.fromScale(1, 1)}
					image={images.ui.egg_background}
					cornerRadius={new UDim(0, 8)}
				>
					<uistroke Color={colors.black} Thickness={4} />
					<Grid
						backgroundTransparency={1}
						anchorPoint={new Vector2(0.5, 0.5)}
						position={UDim2.fromScale(0.5, 0.5)}
						size={UDim2.fromScale(1, 1)}
						cornerRadius={new UDim(0, 4)}
						horizontalAlignment="Center"
						verticalAlignment="Center"
					>
						<FighterCard headshot={"Naro"} zone={"NRT"} padding={4} description={"2.21%"} />
						<FighterCard headshot={"Naro"} zone={"NRT"} padding={4} description={"2.21%"} />
						<FighterCard headshot={"Naro"} zone={"NRT"} padding={4} description={"2.21%"} />
						<FighterCard headshot={"Naro"} zone={"NRT"} padding={4} description={"2.21%"} />
						<FighterCard headshot={"Naro"} zone={"NRT"} padding={4} description={"2.21%"} />
						<FighterCard headshot={"Naro"} zone={"NRT"} padding={4} description={"2.21%"} />
						<FighterCard headshot={"Naro"} zone={"NRT"} padding={4} description={"2.21%"} />
						<FighterCard headshot={"Naro"} zone={"NRT"} padding={4} description={"2.21%"} />
						<FighterCard headshot={"Naro"} zone={"NRT"} padding={4} discovered description={"2.21%"} />
						<uistroke Color={colors.white} Thickness={4}>
							<uigradient
								Transparency={
									new NumberSequence([
										new NumberSequenceKeypoint(0, 0),
										new NumberSequenceKeypoint(0.5, 1),
										new NumberSequenceKeypoint(1, 1),
									])
								}
								Rotation={-90}
							/>
						</uistroke>
					</Grid>
					<uipadding
						PaddingBottom={new UDim(0, 4)}
						PaddingLeft={new UDim(0, 4)}
						PaddingRight={new UDim(0, 4)}
						PaddingTop={new UDim(0, 4)}
					/>
				</Image>

				<uipadding
					PaddingBottom={new UDim(0, 20)}
					PaddingLeft={new UDim(0, 20)}
					PaddingRight={new UDim(0, 20)}
					PaddingTop={new UDim(0, 20)}
				/>
			</Stack>

			<Stack
				fillDirection="Horizontal"
				horizontalAlignment="Center"
				verticalAlignment="Bottom"
				position={UDim2.fromScale(0.5, 1.2)}
				padding={new UDim(0, 12)}
				sortOrder={Enum.SortOrder.LayoutOrder}
			>
				<BindingButton text="Open" binding={Enum.KeyCode.E} size={UDim2.fromOffset(72, 72)} />
				<BindingButton text="Auto" binding={Enum.KeyCode.Q} size={UDim2.fromOffset(72, 72)} />
			</Stack>
		</Frame>
	);
};
