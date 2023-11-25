import Roact from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { Button } from "@/client/ui/components/button";
import { FighterCard } from "@/client/ui/components/fighter-card";
import { Frame } from "@/client/ui/components/frame";
import { Grid } from "@/client/ui/components/grid";
import { Image } from "@/client/ui/components/image";
import { InventoryStatus } from "@/client/ui/components/inventory-status";
import { Menu } from "@/client/ui/components/menu";
import { ScrollView } from "@/client/ui/components/scroll-view";
import { SearchBar } from "@/client/ui/components/search-bar";
import { Stack } from "@/client/ui/components/stack";
import { useRem } from "@/client/ui/hooks/use-rem";
import { images } from "@/shared/assets/images";

export const Inventory = () => {
	const rem = useRem();

	return (
		<Stack fillDirection="Vertical" size={UDim2.fromScale(1, 1)} padding={new UDim(0, 12)}>
			<Frame
				backgroundColor={colors.black}
				backgroundTransparency={0.5}
				size={new UDim2(1, 0, 0, rem(3))}
				cornerRadius={new UDim(0, 12)}
			>
				<Stack
					fillDirection="Horizontal"
					verticalAlignment="Center"
					size={UDim2.fromScale(1, 1)}
					padding={new UDim(0, 12)}
					sortOrder={Enum.SortOrder.LayoutOrder}
				>
					<Menu />
					<Button size={UDim2.fromOffset(rem(32, "pixel"), rem(32, "pixel"))} backgroundTransparency={1}>
						<Image image={images.icons.filter} size={UDim2.fromScale(1, 1)} />
					</Button>
					<SearchBar size={UDim2.fromScale(0.4, 1)} />
					<InventoryStatus />
					<uipadding
						PaddingLeft={new UDim(0, rem(12, "pixel"))}
						PaddingRight={new UDim(0, rem(12, "pixel"))}
						PaddingTop={new UDim(0, rem(4, "pixel"))}
						PaddingBottom={new UDim(0, rem(4, "pixel"))}
					/>
				</Stack>
			</Frame>
			<Frame
				backgroundColor={colors.black}
				backgroundTransparency={0.5}
				size={new UDim2(1, 0, 1, -48)}
				cornerRadius={new UDim(0, 12)}
			>
				<ScrollView
					size={UDim2.fromScale(1, 1)}
					padding={new UDim(0, 12)}
					scrollingDirection={Enum.ScrollingDirection.XY}
					clipsDescendants
				>
					<Grid
						fillDirection="Horizontal"
						horizontalAlignment="Center"
						cellSize={UDim2.fromOffset(rem(120 * 1.8, "pixel"), rem(160 * 1.8, "pixel"))}
						cellPadding={new UDim2(0, rem(12, "pixel"), 0, rem(12, "pixel"))}
						size={UDim2.fromScale(1, 1)}
						autoSize="Y"
					>
						{table.create(100, 1).map((_, index) => (
							<FighterCard key={index} />
						))}
					</Grid>
					<uipadding
						PaddingLeft={new UDim(0, rem(12, "pixel"))}
						PaddingRight={new UDim(0, rem(12, "pixel"))}
						PaddingTop={new UDim(0, rem(12, "pixel"))}
						PaddingBottom={new UDim(0, rem(12, "pixel"))}
					/>
				</ScrollView>
			</Frame>
			<uipadding
				PaddingLeft={new UDim(0, 12)}
				PaddingRight={new UDim(0, 12)}
				PaddingTop={new UDim(0, rem(42, "pixel"))}
				PaddingBottom={new UDim(0, 12)}
			/>
		</Stack>
	);
};
