import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		plugins: { js },

		extends: ['js/recommended'],
		languageOptions: { globals: globals.browser },
	},
	tseslint.configs.recommended,
]);

module.exports = {
	parser: '@typescript-eslint/parser',

	parserOptions: {
		project: './tsconfig.json',

		tsconfigRootDir: __dirname,
	},

	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
};
