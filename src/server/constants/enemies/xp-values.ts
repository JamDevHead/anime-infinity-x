// Tecnically 1000xp === 1 level but for the sake
// of modularity and future proofiness this will do

export const ENEMIES_XP_WORTH_VALUES = {
	"Level 1": 100,
	"Level 2": 300,
	"Level 3": 500,
	"Level 4": 700,
	"Level 5": 900,
} as { [key: `Level ${number}`]: number };
