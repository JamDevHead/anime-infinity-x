export interface Zone extends Instance {
	Map: Folder;
	Spawn: Part;
	Nodes: {
		GetChildren(): Part[];
	} & Folder;
	Eggs: {
		GetChildren(): Part[];
	} & Folder;
}

export interface ZonesFolder extends Folder {
	GetChildren(): (Zone & Instance)[];
}
