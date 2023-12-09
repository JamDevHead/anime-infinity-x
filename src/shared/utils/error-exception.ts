export class Error {
	constructor(public message: string) {}

	public toString() {
		return `Error: ${this.message}`;
	}

	public static throw(message: string) {
		throw new Error(message);
	}

	public static assert(condition: boolean, message: string) {
		if (!condition) {
			throw new Error(message);
		}
	}
}
