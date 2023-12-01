import { Controller, OnStart } from "@flamework/core";
import { mainStep } from "@/client/controllers/loading/steps/main-step";
import { store } from "@/client/store";

@Controller()
export class LoadingController implements OnStart {
	private stepsListeners = new Map<string, () => void>();

	onStart(): void {
		this.setupSteps();

		store.setMaxProgress(this.stepsListeners.size());

		for (const [step, listener] of this.stepsListeners) {
			const loading = store.getState((selector) => selector.loading);

			listener();
			store.setProgress({
				progress: loading.progress + 1,
				status: step,
			});
		}
	}

	setupSteps() {
		this.addStep("Main", mainStep);
		this.addStep("Loading", () => {
			task.wait(2);
		});
	}

	addStep(step: string, listener: () => void) {
		this.stepsListeners.set(step, listener);
	}

	removeStep(step: string) {
		this.stepsListeners.delete(step);
	}

	getSteps() {
		return this.stepsListeners.size();
	}
}
