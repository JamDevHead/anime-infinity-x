import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { store } from "@/client/store";
import { Loading } from "@/client/ui/layouts/loading-screen/loading";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	useEffect(() => {
		store.setMaxProgress(100);
		store.setProgress({
			progress: 100,
		});
	}, []);

	return (
		<RootProvider>
			<Loading />
		</RootProvider>
	);
});
