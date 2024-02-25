import Make from "@rbxts/make";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createPortal, createRoot, Root } from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { Trove } from "@rbxts/trove";
import { FighterAttack } from "@/client/components/fighter/fighter-attack";
import { FighterInstance } from "@/client/components/fighter/fighter-types";
import { FighterSpecialHud } from "@/client/components/react/fighter-special-hud/fighter-special-hud";
import { store } from "@/client/store";
import { getMouseTarget, raycastParams } from "@/client/utils/mouse";
import remotes from "@/shared/remotes";

export class FighterSpecial {
	private hudRoot: Root;
	private raycastParams = new RaycastParams();
	private special = 0;
	private highlight = Make("Highlight", {
		FillTransparency: 0.75,
		OutlineTransparency: 0.95,
		FillColor: Color3.fromHex("#fff"),
		OutlineColor: Color3.fromHex("#fff"),
		DepthMode: Enum.HighlightDepthMode.Occluded,
	});

	constructor(
		trove: Trove,
		private instance: FighterInstance,
		private fighterId: string,
		private fighterAttack: FighterAttack,
	) {
		const root = createRoot(new Instance("Folder"));

		root.render(
			createPortal(
				<ReflexProvider producer={store}>
					<billboardgui Size={UDim2.fromScale(2.5, 0.15)} StudsOffsetWorldSpace={Vector3.yAxis.mul(3)}>
						<FighterSpecialHud fighterId={fighterId} />
					</billboardgui>
				</ReflexProvider>,
				instance.HumanoidRootPart,
			),
		);

		this.hudRoot = root;
		this.highlight.Parent = instance;
		raycastParams.AddToFilter(instance);

		trove.add(
			store.subscribe(
				(state) => state.fighterSpecials[fighterId],
				(special) => {
					if (special === undefined) return;

					this.special = special;

					if (special === 100) {
						remotes.fighter.activateSpecial.fire(this.fighterId);
					}
				},
			),
		);
	}

	destroy() {
		this.hudRoot.unmount();
	}

	onRender(currentEnemyExists: boolean) {
		if (!currentEnemyExists) {
			this.highlight.Enabled = false;
			return;
		}

		const mouseTarget = getMouseTarget(this.raycastParams);
		this.highlight.Enabled = mouseTarget.Instance?.IsDescendantOf(this.instance);
	}

	onUserInput(input: InputObject, gameProccessedEvent: boolean) {
		if (
			this.special === 0 ||
			(input.UserInputType !== Enum.UserInputType.MouseButton1 &&
				input.UserInputType !== Enum.UserInputType.Touch) ||
			!this.highlight.Enabled ||
			gameProccessedEvent
		) {
			return;
		}

		remotes.fighter.activateSpecial.fire(this.fighterId);
		this.fighterAttack.lastAttack += 5;
	}
}
