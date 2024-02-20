export function generatePlayer(playerId?: number | string) {
	const player = {
		UserId: (playerId as number) ?? 0,
	};

	return player as Player;
}
