export const mainStep = () => {
	while (!game.IsLoaded()) task.wait();
};
