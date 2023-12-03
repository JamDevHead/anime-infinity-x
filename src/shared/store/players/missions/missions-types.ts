export interface Mission {
	id: string;
	title: string;
	description?: string;
	tasks: Task[];
	completed: boolean;
}

export interface Task {
	id: string;
	title: string;
	description: string;
	done: boolean;
	reward: number;
	level: number;
	type: string;
}
