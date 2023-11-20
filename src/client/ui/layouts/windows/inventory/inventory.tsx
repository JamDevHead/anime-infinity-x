import Roact from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { Frame } from "@/client/ui/components/frame";
import { SearchBar } from "@/client/ui/components/search-bar";
import { Stack } from "@/client/ui/components/stack";
import { useRem } from "@/client/ui/hooks/use-rem";

export const Inventory = () => {
	const rem = useRem();

	return (
		<Stack fillDirection="Vertical" size={UDim2.fromScale(1, 1)} padding={new UDim(0, 12)}>
			<Frame
				backgroundColor={colors.black}
				backgroundTransparency={0.5}
				size={new UDim2(1, 0, 0, rem(48, "pixel"))}
				cornerRadius={new UDim(0, 12)}
			>
				<Stack
					fillDirection="Horizontal"
					verticalAlignment="Center"
					size={UDim2.fromScale(1, 1)}
					padding={new UDim(0, 12)}
				>
					<SearchBar size={UDim2.fromOffset(rem(248, "pixel"), rem(38, "pixel"))} />
				</Stack>
			</Frame>
			<Frame
				backgroundColor={colors.black}
				backgroundTransparency={0.5}
				size={new UDim2(1, 0, 1, -48)}
				cornerRadius={new UDim(0, 12)}
			></Frame>
			<uipadding
				PaddingLeft={new UDim(0, 12)}
				PaddingRight={new UDim(0, 12)}
				PaddingTop={new UDim(0, rem(42, "pixel"))}
				PaddingBottom={new UDim(0, 12)}
			/>
		</Stack>
	);
};
