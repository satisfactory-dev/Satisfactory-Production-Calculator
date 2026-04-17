import {
	generation_factory,

// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/src/version-specific/1.2.1.0/generation_factory.js';

import {
	is_supported,

// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/src/version-specific/1.2.0.0/supported_lang.js';

const [,, ...remaining] = process.argv;

const lang = remaining.filter((maybe) => !maybe.startsWith('--'))[0];

if (!is_supported(lang)) {
	throw new Error('Unsupported language');
}

const {
	default: release_data,
} = await import(
	`${import.meta.dirname}/data/1.2.1.0/Docs/${lang}.utf8.json`,
	{
		with: {
			type: 'json',
		},
	},
) as {
	default: unknown,
};

await generation_factory(
	release_data,
	lang,
	{
		types: false,
		data: true,
	},
	{
	// oxlint-disable-next-line @stylistic/max-len
	alternate_source: '@satisfactory-dev/docs.json.ts/generated-types/1.2.1.0/',
	root_directory: `${import.meta.dirname}/`,
});
