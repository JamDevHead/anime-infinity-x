import { Controller, OnTick } from "@flamework/core";
import { Workspace } from "@rbxts/services";
import { WindLine } from "@/client/controllers/wind-controller/wind-line";

const SPAWN_RATE = 1 / 10;
const LIFETIME = 1.5;

@Controller()
export class WindController implements OnTick {
	private lines = table.create(10) as WindLine[];
	private spawn_timer = 0;
	private camera = Workspace.CurrentCamera as Camera;

	onTick(dt: number) {
		this.spawn_timer += dt;

		if (this.spawn_timer >= SPAWN_RATE) {
			this.spawn_timer = 0;
			this.lines.push(new WindLine(LIFETIME, this.getWindLinePosition()));
		}

		this.lines.forEach((line, index) => {
			line.timer += dt;

			if (line.timer >= LIFETIME) {
				line.destroy();
				this.lines.unorderedRemove(index);
				return;
			}

			line.update(os.clock());
		});
	}

	private getWindLinePosition() {
		return this.camera.CFrame.mul(
			CFrame.Angles(math.rad(math.random(-30, 70)), math.rad(math.random(-80, 80)), 0),
		).mul(new Vector3(0, 0, math.random(400, 800) * -0.1));
	}
}
