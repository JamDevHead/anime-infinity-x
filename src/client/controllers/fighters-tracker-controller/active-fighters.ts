type KeyOf<T> = T extends Map<infer K, infer _> ? K : never;
type ValueOf<T> = T extends Map<infer _, infer V> ? V : never;

export class ActiveFighters {
	public fighters = new Map<string, Attachment>();

	constructor(private readonly goalContainer: Instance) {}

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

	public clear() {
		this.fighters.forEach((attachment) => {
			attachment.RemoveTag("FighterGoal");
			attachment.SetAttribute("OwnerId", undefined);
			attachment.SetAttribute("UID", undefined);
			attachment.SetAttribute("Offset", undefined);
		});
	}

	public destroy() {
		this.clear();
		this.fighters.clear();
	}
}
