import { md5 } from "@rbxts/rbxts-hashlib";
import { Task } from "@/shared/store/players/missions";

type BaseTask = Omit<Task, "id" | "done" | "type">;

export function hashTasks(tasks: BaseTask[], Type: string) {
	return tasks.map((task) => {
		return {
			...task,
			id: md5(task.title),
			done: false,
			type: Type,
		} as Task;
	});
}

export function generateTasks(amount: number, generator: (index: number) => BaseTask) {
	return table.create(amount, 0).map((_, index) => {
		return generator(index + 1);
	});
}
