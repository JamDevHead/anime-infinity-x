/// <reference types="@rbxts/testez/globals" />

import { store } from "@/client/store";

export = () => {
	it("should set loading progress", () => {
		expect(store.getState().loading.progress).to.be.equal(0);

		store.setProgress({ progress: 69 });
		store.flush();

		expect(store.getState().loading.progress).to.be.equal(69);
	});

	it("should set loading maxprogress", () => {
		expect(store.getState().loading.maxProgress).to.be.equal(0);

		store.setMaxProgress(100);
		store.flush();

		expect(store.getState().loading.maxProgress).to.be.equal(100);
	});
};
