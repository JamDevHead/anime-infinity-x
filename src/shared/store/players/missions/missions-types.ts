export interface Mission {
	id: string;
	title: string;
	description?: string;
	tasks: Task[];
}

export interface Task {
	id: string;
	title: string;
	description?: string;
	progress: number;
	maxProgress: number;
}
