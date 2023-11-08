import Roact, { Element, FunctionComponent, PropsWithChildren, useEffect, useState } from "@rbxts/roact";
import { Stack } from "@/client/ui/component/stack";

const Root: FunctionComponent<PropsWithChildren> = ({ children }) => {
	const [stacks, setStacks] = useState<Element[]>([]);

	useEffect(() => {
		const childrenArray = children as unknown as Array<Element>;

		const stacks: Element[] = [];

		for (let i = 0; i < childrenArray.size(); i++) {
			const child = childrenArray[i];

			if (i % 3 === 0) {
				const stack = (
					<Stack
						fillDirection={Enum.FillDirection.Vertical}
						horizontalAlignment={Enum.HorizontalAlignment.Center}
						verticalAlignment={Enum.VerticalAlignment.Center}
						autoSize={Enum.AutomaticSize.XY}
					>
						{child}
						{childrenArray[i + 1]}
						{childrenArray[i + 2]}
					</Stack>
				);

				stacks.push(stack);
			}
		}

		const invertedStacks: Element[] = [];
		stacks.forEach((stack, index) => {
			invertedStacks[stacks.size() - index] = stack;
		});

		setStacks(invertedStacks);
	}, [children]);

	return <>{stacks}</>;
};

export const SideGroupButtons = {
	Root,
};
