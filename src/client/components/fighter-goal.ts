import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";

@Component({
	tag: "FighterGoal",
})
export class FighterGoal extends BaseComponent<{}, Attachment> implements OnStart {
	onStart() {
		this.instance.Visible = true;
	}
}
