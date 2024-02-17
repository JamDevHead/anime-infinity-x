/// <reference types="@rbxts/testez/globals" />

import { store } from "@/server/store";
import { addFighterFor, doesPlayerHasFighter, isFighterEquipped, removeFighterFor } from "@/server/utils/fighters";
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
		assert(fighter);

		expect(store.getState(selectPlayer1Fighters)?.all[fighter.uid]).to.never.equal(undefined);
		expect(doesPlayerHasFighter(player, fighter.uid)).to.be.equal(true);
		removeFighterFor(player, fighter.uid);

		store.flush();

		expect(store.getState(selectPlayer1Fighters)?.all[fighter.uid]).to.be.equal(undefined);
	});

	it("should add and remove active fighters from player", () => {
		const player = { UserId: 1 } as Player;
		const fighter = addFighterFor(player, mockFighterData);

		assert(fighter);

		store.addActiveFighter(tostring(player.UserId), fighter.uid);
		store.flush();

		expect(isFighterEquipped(player, fighter.uid)).to.be.equal(true);

		removeFighterFor(player, fighter.uid);
		store.flush();

		expect(isFighterEquipped(player, fighter.uid)).to.be.equal(false);
	});
};
