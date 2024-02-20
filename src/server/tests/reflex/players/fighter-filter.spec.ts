/// <reference types="@rbxts/testez/globals" />

import { store } from "@/server/store";
import { filterFighters } from "@/server/store/filters/state/players-filters/fighters-filter";
import { generateMockFighter } from "@/server/tests/helpers/generateMockFighter";
import { generatePlayer } from "@/server/tests/helpers/generatePlayer";
import { addFighterFor } from "@/server/utils/fighters";

export = () => {
	const player = generatePlayer(1);

	it("should filter out fighter data", () => {
		const player2 = generatePlayer(2);
		const playerId2 = tostring(player2.UserId);

		const fighterFromPlayer2 = addFighterFor(player2, generateMockFighter());

		assert(fighterFromPlayer2);

		store.addActiveFighter(playerId2, fighterFromPlayer2.uid, fighterFromPlayer2.characterUid);

		const state = store.getState().players.fighters;
		const filteredState = filterFighters(player, state);

		expect(filteredState[playerId2]?.all[fighterFromPlayer2.uid]).to.be.equal(undefined);
		expect(filteredState[playerId2]?.actives.size()).to.be.equal(1);
	});
};
