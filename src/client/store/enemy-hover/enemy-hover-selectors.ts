import { RootState } from "@/client/store";

export const selectHoveredEnemy = (state: RootState) => state.enemyHover.hoveredEnemy;
