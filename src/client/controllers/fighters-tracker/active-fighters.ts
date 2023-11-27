import { Trove } from "@rbxts/trove";
import { store } from "@/client/store";
import { selectActivePlayerFighters } from "@/shared/store/players/fighters";
import { Tracker } from "@/client/controllers/fighters-tracker/tracker";

type KeyOf<T> = T extends Map<infer K, infer _> ? K : never;
type ValueOf<T> = T extends Map<infer _, infer V> ? V : never;

export class ActiveFighters {
	public fighters = new Map<string, Attachment>();

	private trove = new Trove();
	private readonly goalContainer: Instance;

	constructor(private tracker: Tracker) {
		this.goalContainer = tracker.fightersTracker.goalContainer;

		this.trove.add(
			store.observe(selectActivePlayerFighters(tracker.localUserId), (uid) => this.onActiveFighter(uid)),
		);
	}

	public createFighterGoal(uid: string) {
		let goalAttachment = this.fighters.get(uid);

		if (!goalAttachment && this.goalContainer) {
			goalAttachment = new Instance("Attachment");
			goalAttachment.Name = "GoalAttachment";
			goalAttachment.Parent = this.goalContainer;
		}

		if (!goalAttachment) {
			return;
		}

		this.fighters.set(uid, goalAttachment);
	}

	public removeFighterGoal(uid: string) {
		const attachment = this.fighters.get(uid);

		attachment?.Destroy();

		this.fighters.delete(uid);
	}

	public forEach(callbackFn: (value: ValueOf<typeof this.fighters>, index: KeyOf<typeof this.fighters>) => void) {
		this.fighters.forEach(callbackFn);
	}

	public size() {
		return this.fighters.size();
	}

	public clean() {
		this.fighters.forEach((attachment) => {
			attachment.RemoveTag("FighterGoal");
			attachment.SetAttribute("OwnerId", undefined);
			attachment.SetAttribute("UID", undefined);
			attachment.SetAttribute("Offset", undefined);
		});
	}

	public destroy() {
		this.clean();
		this.fighters.clear();
		this.trove.destroy();
	}

	private onActiveFighter(uid: string) {
		print("new active fighter", uid);

		this.createFighterGoal(uid);
		this.tracker.updateFighters();

		return () => {
			this.removeFighterGoal(uid);
			this.tracker.updateFighters();
		};
	}
}
