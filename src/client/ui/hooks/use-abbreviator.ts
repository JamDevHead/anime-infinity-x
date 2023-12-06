import Abbreviator from "@rbxts/abbreviate";

type AbbreviatorSettings = {
	defaultDecimalPlaces?: number;
	defaultSuffixTable?: string[];
	defaultStripTrailingZeroes?: boolean;
};

export const useAbbreviator = ({
	defaultStripTrailingZeroes,
	defaultSuffixTable,
	defaultDecimalPlaces,
}: AbbreviatorSettings = {}) => {
	const abbreviator = new Abbreviator();
	abbreviator.setSetting("decimalPlaces", defaultDecimalPlaces ?? 2);
	abbreviator.setSetting("stripTrailingZeroes", defaultStripTrailingZeroes ?? true);
	abbreviator.setSetting(
		"suffixTable",
		defaultSuffixTable ?? ["K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"],
	);

	return abbreviator;
};
