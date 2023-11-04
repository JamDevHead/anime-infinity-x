import Roact from "@rbxts/roact";

import { RemProvider, RemProviderProps } from "./rem-provider";

interface RootProviderProps extends RemProviderProps {}

export function RootProvider({ baseRem, remOverride, children }: RootProviderProps) {
	return (
		<RemProvider key="rem-provider" baseRem={baseRem} remOverride={remOverride}>
			{children}
		</RemProvider>
	);
}
