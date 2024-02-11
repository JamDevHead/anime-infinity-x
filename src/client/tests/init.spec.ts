/// <reference types="@rbxts/testez/globals" />

export = () => {
	it("should throw an epic error", () => {
		expect(() => error("Epic error")).to.throw("Epic error")
	})
};
