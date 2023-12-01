import { useUpdate, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import Roact, { FunctionComponent, useEffect, useState } from "@rbxts/roact";
import { colors } from "@/client/constants/colors";
import { useRootSelector, useRootStore } from "@/client/store";
import { Frame } from "@/client/ui/components/frame";
import { Image } from "@/client/ui/components/image";
import { useMotion } from "@/client/ui/hooks/use-motion";

const letters = [
	{
		image: "rbxassetid://14749365674",
		position: UDim2.fromScale(0.0471910127, 0.303418815),
		size: UDim2.fromScale(0.0955056176, 0.303418815),
	},
	{
		image: "rbxassetid://14749366255",
		position: UDim2.fromScale(0.133707866, 0.226495728),
		size: UDim2.fromScale(0.0932584256, 0.303418815),
	},
	{
		image: "rbxassetid://14749366726",
		position: UDim2.fromScale(0.197752804, 0.1965812),
		size: UDim2.fromScale(0.0303370785, 0.269230783),
	},
	{
		image: "rbxassetid://14749367247",
		position: UDim2.fromScale(0.271910101, 0.170940176),
		size: UDim2.fromScale(0.10786517, 0.290598303),
	},
	{
		image: "rbxassetid://14749367794",
		position: UDim2.fromScale(0.370786518, 0.145299152),
		size: UDim2.fromScale(0.078651689, 0.273504287),
	},
	{
		image: "rbxassetid://14749368458",
		position: UDim2.fromScale(0.451685399, 0.132478639),
		size: UDim2.fromScale(0.0235955063, 0.260683775),
	},
	{
		image: "rbxassetid://14749368817",
		position: UDim2.fromScale(0.522471905, 0.132478639),
		size: UDim2.fromScale(0.0842696652, 0.260683775),
	},
	{
		image: "rbxassetid://14749369300",
		position: UDim2.fromScale(0.612359524, 0.141025648),
		size: UDim2.fromScale(0.076404497, 0.264957279),
	},
	{
		image: "rbxassetid://14749369857",
		position: UDim2.fromScale(0.667415738, 0.15384616),
		size: UDim2.fromScale(0.0269662924, 0.264957279),
	},
	{
		image: "rbxassetid://14749370397",
		position: UDim2.fromScale(0.734831452, 0.17521368),
		size: UDim2.fromScale(0.0898876414, 0.290598303),
	},
	{
		image: "rbxassetid://14749370983",
		position: UDim2.fromScale(0.795505643, 0.200854704),
		size: UDim2.fromScale(0.0303370785, 0.264957279),
	},
	{
		image: "rbxassetid://14749371521",
		position: UDim2.fromScale(0.86179775, 0.222222224),
		size: UDim2.fromScale(0.0842696652, 0.286324799),
	},
	{
		image: "rbxassetid://14749372206",
		position: UDim2.fromScale(0.953932583, 0.277777791),
		size: UDim2.fromScale(0.0898876414, 0.299145311),
	},
	{
		image: "rbxassetid://14749393023",
		position: UDim2.fromScale(0.480898887, 0.692307711),
		size: UDim2.fromScale(0.208988771, 0.615384638),
	},
];

type LetterProps = {
	image: string;
	position: UDim2;
	size: UDim2;
	enable?: boolean;
};

const Letter: FunctionComponent<LetterProps> = ({ image, position, size, enable }) => {
	const [activeColor, setActiveColor] = useState(false);
	const [imageSize, setImageSize] = useMotion(size);

	useEffect(() => {
		if (!enable) return;

		setImageSize.spring(size.add(UDim2.fromScale(size.X.Scale * 0.2, size.Y.Scale * 0.2)));
		setActiveColor(true);
		const cleanup = setImageSize.onComplete(() => {
			setImageSize.spring(size);
		});

		return () => {
			cleanup();
			setActiveColor(false);
		};
	}, [enable, setImageSize, size]);

	return (
		<Image
			image={image}
			anchorPoint={new Vector2(0.5, 0.5)}
			position={position}
			size={imageSize}
			imageColor={activeColor ? colors.white : Color3.fromRGB(128, 128, 128)}
		/>
	);
};

export const Loading = () => {
	const update = useUpdate();

	const [position, setPosition] = useMotion(UDim2.fromScale(0.5, 0.5));
	const [actives, setActives] = useState(table.create(letters.size(), false));
	const [internalProgress, setInternalProgress] = useState(0);

	const dispatcher = useRootStore();
	const { isLoading, progress, maxProgress } = useRootSelector((state) => state.loading);

	useUpdateEffect(() => {
		if (!isLoading) return;

		if (internalProgress >= 1) {
			task.wait(2);
			dispatcher.setLoading(false);
		}
	}, [internalProgress, isLoading, progress, maxProgress]);

	useEffect(() => {
		const newActives = [...actives];
		const activeCount = math.floor((progress / maxProgress) * letters.size());
		task.spawn(() => {
			for (let i = 0; i < activeCount; i++) {
				newActives[i] = true;
				task.wait(0.1);
				setActives(newActives);
				setInternalProgress((i + 1) / letters.size());
				update();
			}
		});
	}, [maxProgress, progress]);

	useEffect(() => {
		setPosition.spring(isLoading ? UDim2.fromScale(0.5, 0.5) : UDim2.fromScale(0.5, -2));
	}, [isLoading, setPosition]);

	return (
		<Frame
			size={UDim2.fromScale(1, 1)}
			anchorPoint={new Vector2(0.5, 0.5)}
			position={position}
			backgroundColor={Color3.fromRGB(11, 8, 26)}
		>
			<Frame
				size={UDim2.fromOffset(890, 234)}
				backgroundTransparency={1}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.5, 0.5)}
			>
				{letters.map((letter, index) => (
					<Letter key={index} {...letter} enable={actives[index]} />
				))}
				<uiaspectratioconstraint AspectRatio={3.8} AspectType={Enum.AspectType.ScaleWithParentSize} />
			</Frame>
		</Frame>
	);
};
