import { createPortal } from "@rbxts/react-roblox";
import Roact, { useEffect } from "@rbxts/roact";
import { Lighting } from "@rbxts/services";
import { useRootStore } from "@/client/store";
import { useMotion } from "@/client/ui/hooks/use-motion";

export const BlurEffect = () => {
	const [blurSize, setBlurSize] = useMotion(0);
	const dispatcher = useRootStore();

	useEffect(() => {
		const unsubscribe = dispatcher.subscribe(
			(state) => state.blur.size,
			(size, prevSize) => {
				if (size === prevSize) return;

				setBlurSize.spring(size);
			},
		);
		return () => unsubscribe();
	}, [dispatcher, setBlurSize]);

	return <>{createPortal(<blureffect key="blur-effect" Size={blurSize} />, Lighting)}</>;
};
