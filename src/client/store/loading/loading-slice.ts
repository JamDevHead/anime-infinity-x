import { createProducer } from "@rbxts/reflex";

type LoadingState = {
	isLoading: boolean;
	progress: number;
	status: string;
	maxProgress: number;
};

const initialState: LoadingState = {
	isLoading: true,
	progress: 0,
	status: "",
	maxProgress: 0,
};

export const loadingSlice = createProducer(initialState, {
	setLoading: (state, isLoading) => ({
		...state,
		isLoading: isLoading,
	}),
	setProgress: (state, { progress, status }: { progress: number; status?: string }) => ({
		...state,
		progress: progress,
		status: status ?? state.status,
	}),
	setMaxProgress: (state, maxProgress: number) => ({
		...state,
		maxProgress: maxProgress,
	}),
});
