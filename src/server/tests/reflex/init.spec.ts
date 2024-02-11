/// <reference types="@rbxts/testez/globals" />

import { store } from "@/server/store";
import { resetStore } from "@/shared/tests/helpers/resetState";

export = () => {
	beforeEach(() => {
		resetStore(store);
	});

	afterAll(() => {
		store.destroy();
	});
};
