import { createPortal, createRoot } from "@rbxts/react-roblox";
import Roact, { StrictMode } from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { App } from "@/client/ui/app/app";
import { RootProvider } from "@/client/ui/providers/root-provider";

export const initializeReact = () => {
	const root = createRoot(new Instance("Folder"));
	const target = Players.LocalPlayer.WaitForChild("PlayerGui");

	root.render(
		createPortal(
			<StrictMode>
				<RootProvider key="root-provider">
					<App key="app" />
				</RootProvider>
			</StrictMode>,
			target,
		),
	);
};
