import { hoarcekat, useCamera } from "@rbxts/pretty-react-hooks";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createPortal } from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { FighterSpecialHud } from "@/client/components/react/fighter-special-hud/fighter-special-hud";
import { store } from "@/client/store";

export = hoarcekat(() => {
	const camera = useCamera();

	const origin = camera.CFrame.Position.add(camera.CFrame.LookVector.mul(3));

	return (
		<ReflexProvider producer={store}>
			{createPortal(
				<attachment Position={origin}>
					<billboardgui Size={UDim2.fromScale(2, 0.15)}>
						<FighterSpecialHud fighterId={"123"} />
					</billboardgui>
				</attachment>,
				Workspace.Terrain,
			)}
		</ReflexProvider>
	);
});
