export class WindLine {
	public timer = 0;

	private trail = new Instance("Trail");
	private attachment0: Attachment;
	private attachment1: Attachment;

	constructor(
		container: Instance,
		private lifetime: number,
		origin: Vector3,
		private seed = math.random(1, 1000) * 0.1,
		private speed = 1,
		private direction = Vector3.zAxis,
	) {
		const attachment0 = new Instance("Attachment");
		const attachment1 = new Instance("Attachment");

		attachment0.Parent = container;
		attachment1.Parent = container;

		attachment0.Position = origin;
		attachment1.Position = origin.add(Vector3.yAxis);

		this.trail.Attachment0 = attachment0;
		this.trail.Attachment1 = attachment1;

		this.trail.WidthScale = new NumberSequence([
			new NumberSequenceKeypoint(0, 0.1),
			new NumberSequenceKeypoint(0.2, 0.5),
			new NumberSequenceKeypoint(0.8, 0.5),
			new NumberSequenceKeypoint(1, 0.1),
		]);
		this.trail.Transparency = new NumberSequence(0.7);
		this.trail.FaceCamera = true;
		this.trail.Parent = attachment0;

		this.attachment0 = attachment0;
		this.attachment1 = attachment1;
	}

	public update(time: number) {
		this.trail.MaxLength = 20 - 20 * (this.timer / this.lifetime);

		const seededClock = (time + this.seed) * (this.speed * 0.2);
		const startPosition = this.attachment0.Position;
		const wave = math.sin(seededClock);

		const goal = new CFrame(startPosition, startPosition.add(this.direction))
			.mul(new CFrame(this.direction.mul(this.speed * this.timer)))
			.Position.add(new Vector3(wave * 0.5, wave * 0.8, wave * 0.5));

		this.attachment0.Position = goal;
		this.attachment1.Position = goal.add(Vector3.yAxis);
	}

	public destroy() {
		this.attachment0.Destroy();
		this.attachment1.Destroy();
	}
}
