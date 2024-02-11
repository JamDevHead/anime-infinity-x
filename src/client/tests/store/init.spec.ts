/// <reference types="@rbxts/testez/globals" />

import { store } from "@/client/store";
import { resetStore } from "@/shared/tests/helpers/resetState";

export = () => {
	beforeEach(() => {
		resetStore(store);
	});
};
