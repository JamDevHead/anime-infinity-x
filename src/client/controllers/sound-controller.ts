import { Controller } from "@flamework/core";
import { SoundTracker } from "@/shared/lib/sound-tracker";

@Controller()
export class SoundController {
	public tracker = new SoundTracker({
		hurt: ["rbxassetid://5797593439", "rbxassetid://4532087113"],
		death: "rbxassetid://7147484622",
		click: ["rbxassetid://6895079853"],
		reward: ["rbxassetid://3269373680", "rbxassetid://4612378086"],
	});
}
