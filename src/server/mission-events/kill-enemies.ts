import { Enemy } from "@/server/components/enemy";

export function playerKilledEnemy(killerId: string, enemy: Enemy) {
	print(killerId, enemy);
}
