/// <reference types="@rbxts/testez/globals" />

export = () => {
	it('"three" variable should be equal to 3', () => {
		const CONSTANT = 0;

		const three = CONSTANT + 3;

		return expect(three).to.be.equal(3);
	});
};
