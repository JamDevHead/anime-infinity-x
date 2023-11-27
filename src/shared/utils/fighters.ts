export function calculateStun(dexterity: number) {
	// 10 dexterity = 1 second stun, 100 dexterity = 0.1 second stun
	return 10 / dexterity;
}
