export interface Setting {
	label: string;
	value: boolean | number;
}

export interface Settings {
	[key: string]: Setting;
}
