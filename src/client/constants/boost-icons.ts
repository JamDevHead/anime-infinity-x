import { BoostType } from "@/@types/models/boost";
import { images } from "@/shared/assets/images";

type BoostIcon = {
	[key in BoostType]: string;
};

export const boostIcons: BoostIcon = {
	coin: images.icons.boosts.coin_boost,
	lucky: images.icons.boosts.lucky_boost,
	stars: images.icons.boosts.stars_boost,
	strength: images.icons.boosts.strength_boost,
};
