import { ReflexProvider } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";

import { RemProvider, RemProviderProps } from "./rem-provider";
import { producer } from "@/client/reflex/producers";

type RootProviderProps = RemProviderProps;

export function RootProvider({ baseRem, remOverride, children }: RootProviderProps) {
	return (
		<RemProvider key="rem-provider" baseRem={baseRem} remOverride={remOverride}>
			<ReflexProvider producer={producer} key="reflex-provider">
				{children}
			</ReflexProvider>
		</RemProvider>
	);
}
