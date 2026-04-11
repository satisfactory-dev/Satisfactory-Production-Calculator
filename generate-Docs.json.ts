import {
	generation_factory,

// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/src/version-specific/0.8.3.3/generation_factory.js';

import {
	is_supported,

// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/src/version-specific/0.3.7.7/supported_lang.js';

const [,, ...remaining] = process.argv;

const lang = remaining.filter((maybe) => !maybe.startsWith('--'))[0];

const process_generation = {
	types: false,
	data: true,
};

if (remaining.includes('--skip-data')) {
	process_generation.data = false;
}

if (!is_supported(lang)) {
	throw new Error('Unsupported language');
}

const {
	default: release_data,
} = await import(
	`${import.meta.dirname}/data/0.8.3.3/Docs/Docs.utf8.json`,
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
	process_generation,
	{
		// oxlint-disable-next-line @stylistic/max-len
		alternate_source: '@satisfactory-dev/docs.json.ts/generated-types/0.8.3.3/',
		root_directory: `${import.meta.dirname}/`,
	},
);
