import {
	javascript as config,
} from '@signpostmarv/eslint-config';

export default [
	...config,
	{
		files: ['**/*.mjs'],
		ignores: ['**/*.js'],
	},
];
