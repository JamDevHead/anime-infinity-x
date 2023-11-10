// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

module.exports = {
	extends: ["prettier", "react-app", "plugin:roblox-ts/recommended", "plugin:@typescript-eslint/recommended"],
	plugins: ["@typescript-eslint", "roblox-ts"],
	parserOptions: {
		parser: "@typescript-eslint/parser",
		ecmaFeatures: {
			jsx: true,
		},
		useJSXTextNode: true,
		ecmaVersion: 2018,
		sourceType: "module",
		project: "./tsconfig.json",
		tsconfigRootDir: __dirname,
	},
	ignorePatterns: ["/out"],
	rules: {
		"no-restricted-globals": "off",
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
			},
		],
		"sort-imports": [
			"error",
			{
				ignoreCase: true,
				ignoreDeclarationSort: true,
			},
		],
		"import/order": [
			1,
			{
				groups: ["external", "builtin", "internal", "sibling", "parent", "index"],
				pathGroups: [
					...getDirectoriesToSort().map((singleDir) => ({
						pattern: `${singleDir}/**`,
						group: "internal",
					})),
					{
						pattern: "env",
						group: "internal",
					},
					{
						pattern: "theme",
						group: "internal",
					},
					{
						pattern: "public/**",
						group: "internal",
						position: "after",
					},
				],
				pathGroupsExcludedImportTypes: ["internal"],
				alphabetize: {
					order: "asc",
					caseInsensitive: true,
				},
			},
		],
	},
};

function getDirectoriesToSort() {
	const ignoredSortingDirectories = [".git", ".next", ".vscode", "node_modules"];
	return getDirectories(process.cwd()).filter((f) => !ignoredSortingDirectories.includes(f));
}

function getDirectories(path) {
	return fs.readdirSync(path).filter(function (file) {
		return fs.statSync(path + "/" + file).isDirectory();
	});
}
