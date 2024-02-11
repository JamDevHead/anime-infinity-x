/// <reference types="@rbxts/testez/globals" />

import { store } from "@/server/store";
import { addFighterFor, removeFighterFor } from "@/server/utils/fighters";
import { selectPlayerFighters } from "@/shared/store/players/fighters";

export = () => {
	const selectPlayer1Fighters = selectPlayerFighters("1");
	const mockFighterData = {
		name: "Naro",
		rarity: 123,
		zone: "NRT",
		displayName: "naro",
		stats: {
			damage: 5,
			level: 1,
			xp: 0,
			sellPrice: 100,
			dexterity: 23,
		},
	};

	it("should have player1's fighter data", () => {
		const playerFighters = store.getState(selectPlayer1Fighters);

		expect(playerFighters).to.never.equal(undefined);
	});

	it("should add and remove fighters from player", () => {
		const player = { UserId: 1 } as Player;
		const fighter = addFighterFor(player, mockFighterData);

		store.flush();

		expect(fighter).to.never.equal(undefined);
		expect(store.getState(selectPlayer1Fighters)?.all.size()).to.be.equal(1);

		if (fighter) {
			removeFighterFor(player, fighter.uid);
			store.flush();
		}

		expect(store.getState(selectPlayer1Fighters)?.all.size()).to.be.equal(0);
	});
};
