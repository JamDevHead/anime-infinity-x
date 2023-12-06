import Object from "@rbxts/object-utils";
import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { useRootSelector, useRootStore } from "@/client/store";
import { Popup } from "@/client/ui/components/popup/popup";
import { usePlayerId } from "@/client/ui/hooks/use-player-id";
import { useRem } from "@/client/ui/hooks/use-rem";
import { ZONES, ZONES_KEYS } from "@/shared/constants/zones";
import remotes from "@/shared/remotes";
import { selectPlayerZones } from "@/shared/store/players";

export const PortalPopup = () => {
	const playerId = usePlayerId();
	const rem = useRem();
	const zones = useSelectorCreator(selectPlayerZones, playerId);
	const { visible } = useRootSelector((store) => store.portal);
	const { setPortalVisible } = useRootStore();

	if (zones?.current === undefined) return <></>;

	const nextZone = Object.keys(ZONES).indexOf((zones?.current.lower() as keyof typeof ZONES) ?? "nrt") + 1;

	if (zones?.unlocked.includes(ZONES_KEYS[nextZone].upper())) return <></>;

	return visible ? (
		<Popup.Root
			size={UDim2.fromOffset(rem(1, "pixel"), rem(200, "pixel"))}
			gradient={
				new ColorSequence([
					new ColorSequenceKeypoint(0, Color3.fromHex("#243aa8")),
					new ColorSequenceKeypoint(1, Color3.fromHex("#1a2b65")),
				])
			}
			onClose={() => {
				setPortalVisible(false);
			}}
		>
			<Popup.Body>
				<Popup.Title text={`Your next zone is ${ZONES[ZONES_KEYS[nextZone]].name}`} />
				<Popup.Description
					text={`You can buy ${ZONES[ZONES_KEYS[nextZone]].name} for ${
						ZONES[ZONES_KEYS[nextZone]].price
					} yens.`}
				/>
			</Popup.Body>
			<Popup.Actions>
				<Popup.ActionButton text="Close" />
				<Popup.ActionButton
					text="Buy"
					onClick={() => {
						remotes.zone.buy.fire(ZONES_KEYS[nextZone]);
					}}
				/>
			</Popup.Actions>
		</Popup.Root>
	) : (
		<></>
	);
};
