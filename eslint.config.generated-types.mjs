import config from './eslint.config.mjs';

export default [
	...config,
	{
		languageOptions: {
			parserOptions: {
				project: 'tsconfig.generated-types-check.json',
			},
		},
		rules: {
			'@stylistic/comma-dangle': 'off',
			'@stylistic/max-len': 'off',
			'object-curly-newline': 'off',
			'sort-imports': 'off',
			'@typescript-eslint/consistent-type-imports': 'error',
		},
		ignores: ['**/*.js'],
	},
];
