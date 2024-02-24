import Roact, { Binding, createBinding, FunctionComponent } from "@rbxts/roact";
import { Image, ImageProps } from "@/client/ui/components/image";

function mapBinding<T, U>(value: T | Binding<T>, transform: (value: T) => U): Binding<U> {
	if (typeIs(value, "table") && "getValue" in value) {
		return value.map(transform);
	} else {
		return createBinding(transform(value))[0];
	}
}

interface Props extends Omit<ImageProps, "image"> {
	/**
	 * The configuration for the spritesheet.
	 */
	config: {
		/**
		 * The size of each image in the spritesheet.
		 */
		size: number;
		/**
		 * The number of images in the spritesheet.
		 */
		count: number;
		/**
		 * The number of columns in the spritesheet.
		 */
		columns: number;
		/**
		 * The number of rows in the spritesheet.
		 */
		rows: number;
		/**
		 * The images in the spritesheet.
		 * The first image is used when the alpha is less than 0.
		 */
		images: string[];
	};
	/**
	 * The alpha value of the spritesheet. Can also be a binding.
	 */
	alpha: number | Binding<number>;
}

export const SpriteSheet: FunctionComponent<Props> = (props) => {
	const reducedProps = { ...props, config: undefined, alpha: undefined };

	const mapped = mapBinding(props.alpha, (alpha) => {
		const { size, count, columns, rows, images } = props.config;
		const num = math.min(math.floor(alpha * count), count - 1);
		const page = math.floor(num / (columns * rows));
		const pageNum = num - columns * rows * page;
		const x = (pageNum % columns) * size;
		const y = math.floor(pageNum / columns) * size;

		return { alpha, x, y, page, images, size };
	});

	return (
		<Image
			{...reducedProps}
			image={mapped.map((m) => m.images[m.alpha < 0 ? 0 : m.page])}
			imageRectSize={mapped.map((m) => new Vector2(m.size, m.size))}
			imageRectOffset={mapped.map((m) => new Vector2(m.x, m.y))}
		/>
	);
};
