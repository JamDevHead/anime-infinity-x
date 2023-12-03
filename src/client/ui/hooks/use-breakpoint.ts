import { useViewport } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/roact";

/**
 * This hook returns the current breakpoint of the game. It will update when the screen resolution changes.
 * @returns The current breakpoint of the game.
 * @example
 * const breakpoint = useBreakpoint();
 * print(breakpoint); // "mobile" | "tablet" | "desktop"
 * const padding = breakpoint === "mobile" ? 20 : 40;
 */
export const useBreakpoint = () => {
	const [breakpoint, setBreakpoint] = useState<"mobile" | "tablet" | "desktop">("mobile");

	useViewport((viewport) => {
		if (viewport.X < 768) {
			setBreakpoint("mobile");
		} else if (viewport.X < 1024) {
			setBreakpoint("tablet");
		} else {
			setBreakpoint("desktop");
		}
	});

	return breakpoint;
};
