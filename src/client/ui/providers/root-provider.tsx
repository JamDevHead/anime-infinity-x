import { ReflexProvider } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";

import { RemProvider, RemProviderProps } from "./rem-provider";
import { store } from "@/client/store";

type RootProviderProps = RemProviderProps;

export function RootProvider({ baseRem, remOverride, children }: RootProviderProps) {
	return (
		<RemProvider key="rem-provider" baseRem={baseRem} remOverride={remOverride}>
			<ReflexProvider producer={store} key="reflex-provider">
				{children}
			</ReflexProvider>
		</RemProvider>
	);
}
