module.exports = {
	env: {
		es2021: true,
		jest: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended",
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:import/typescript",
		"plugin:promise/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: [
		"@typescript-eslint",
		"simple-import-sort",
		"promise",
		"prettier",
		"import",
	],
	rules: {
		"prettier/prettier": ["error", { useTabs: true }],
		"import/extensions": "off",
		"simple-import-sort/imports": "error",
		"simple-import-sort/exports": "error",
	},
};
