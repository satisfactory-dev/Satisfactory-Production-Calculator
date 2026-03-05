import {
	typescript as config,
} from '@signpostmarv/eslint-config';
import parser from '@typescript-eslint/parser';

export default [
	{
		languageOptions: {
			parser,
			parserOptions: {
				project: ['./tsconfig.eslint.json'],
			},
		},
	},
	...config,
	{
		files: ['**/*.ts'],
		ignores: [
			'**/*.d.ts',
			'**/*.js',
			'**/*.mjs',
			'./generated-types/**/*.*',
		],
	},
	{
		rules: {
			'@stylistic/type-annotation-spacing': ['error', {
				before: false,
				after: true,
				overrides: {
					arrow: {
						before: true,
						after: true,
					},
				},
			}],
		},
	},
];
