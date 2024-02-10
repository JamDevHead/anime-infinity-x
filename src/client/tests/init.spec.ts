/// <reference types="@rbxts/testez/globals" />

export = () => {
	print("Running tests on client");

	it("should throw an epic error", () => {
		error("Epic error")
	})
};
