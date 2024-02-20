/// <reference types="@rbxts/testez/globals" />

import { store } from "@/server/store";
import { defaultPlayerData, selectPlayerData } from "@/shared/store/players";

export = () => {
	beforeEach(() => {
		store.loadPlayerData("1", defaultPlayerData);
		store.loadPlayerData("2", defaultPlayerData);
		store.flush();
	});

	afterEach(() => {
		store.unloadPlayerData("1");
		store.unloadPlayerData("2");
		store.flush();
	});

	it("should load and unload player data", () => {
		store.loadPlayerData("555", defaultPlayerData);
		store.flush();

		expect(store.getState(selectPlayerData("555"))).never.to.be.equal(undefined);

		store.unloadPlayerData("555");
		store.flush();

		expect(store.getState(selectPlayerData("555"))).to.be.equal(undefined);
	});
};
