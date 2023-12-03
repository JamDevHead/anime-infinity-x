import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Popup } from "@/client/ui/components/popup/popup";
import { RootProvider } from "@/client/ui/providers/root-provider";

export = hoarcekat(() => {
	return (
		<RootProvider>
			<Popup.Root size={UDim2.fromScale(0.2, 0.2)}>
				<Popup.Body>
					<Popup.Title text="Hello" />
					<Popup.Description text="This is a popup" />
				</Popup.Body>
				<Popup.Actions margin={new UDim(0, 0)}>
					<Popup.ActionButton text="Accept" />
					<Popup.ActionButton text="Deny" />
				</Popup.Actions>
			</Popup.Root>
		</RootProvider>
	);
});
