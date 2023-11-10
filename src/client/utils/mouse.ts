import { Players, UserInputService, Workspace } from "@rbxts/services";

const localPlayer = Players.LocalPlayer;
const mouse = localPlayer.GetMouse();
const camera = Workspace.CurrentCamera;

export const raycastParams = new RaycastParams();
raycastParams.FilterType = Enum.RaycastFilterType.Exclude;
raycastParams.FilterDescendantsInstances = [Workspace.Terrain];

export function getMouseTarget(RaycastParams: RaycastParams = raycastParams) {
	if (!camera) {
		return {
			Position: Vector3.zero,
			Normal: Vector3.zero,
			Distance: 1_000,
		} as RaycastResult & { Instance: undefined };
	}

	debug.profilebegin("getMouseTarget");

	const mousePosition = UserInputService.GetMouseLocation();
	const mouseRay = camera.ViewportPointToRay(mousePosition.X, mousePosition.Y);

	const cameraCFrame = camera.CFrame;
	const origin = cameraCFrame.Position;
	const direction = mouseRay.Direction.mul(1_000);

	const raycastResult = Workspace.Raycast(origin, direction, RaycastParams);
	const result =
		raycastResult ??
		({
			Position: origin.add(direction),
			Normal: Vector3.zero,
			Distance: 1_000,
		} as RaycastResult & { Instance: undefined });

	debug.profileend();

	return result;
}

export function getMouseHit(RaycastParams: RaycastParams = raycastParams) {
	if (!camera) {
		return mouse.Hit;
	}

	debug.profilebegin("getMouseHit");

	const target = getMouseTarget(RaycastParams);
	const position = target.Position;
	const cameraCFrame = camera.CFrame;

	debug.profileend();

	return CFrame.lookAt(position, cameraCFrame.Position);
}
