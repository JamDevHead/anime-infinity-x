type Color = {
	color?: string;
	gradient?: string[];
};

interface RatingColor extends Color {
	stars?: Array<Color>;
}

export const ratingColors: Array<RatingColor> = [
	{
		color: "#fff",
	},
	{
		gradient: ["#00A3FF", "#0047FF"],
	},
	{
		gradient: ["#A61DD7", "#1D2FD7"],
	},
	{
		gradient: ["#FF9900", "#FFE500"],
	},
	{
		gradient: ["#FF78E1", "#FF006B"],
	},
	{
		color: "#fff",
	},
	{
		stars: [
			{
				gradient: ["#FF002E", "#FF00C7"],
			},
			{
				gradient: ["#00FF0A", "#00FF66"],
			},
			{
				gradient: ["#00C2FF", "#00FFF0"],
			},
		],
	},
];
