import { Controller, OnInit } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { $git } from "rbxts-transform-debug";

@Controller({ loadOrder: 1 })
export class VersionController implements OnInit {
	constructor(private readonly logger: Logger) {}

	onInit(): void | Promise<void> {
		this.logger.Info("Git commit: {commit} (hash: {hash})", $git("Commit").Commit, $git("CommitHash").CommitHash);
		this.logger.Info("Git branch: {branch}", $git("Branch").Branch);
		this.logger.Info("Commit date: {date}", $git("ISODate").ISODate);
		const tag = $git("LatestTag").LatestTag;
		if (tag.size() > 0) {
			this.logger.Info("Git tag: {tag}", tag);
		}
	}
}
