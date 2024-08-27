import config from '../eslint.config.mjs';

export default [
	...config,
	{
		languageOptions: {
			parserOptions: {
				project: 'tsconfig.generated-types-check.json',
			},
		},
		rules: {
			'comma-dangle': 'warn',
			'max-len': 'off',
			'object-curly-newline': 'off',
			'sort-imports': 'off',
		},
	},
];
