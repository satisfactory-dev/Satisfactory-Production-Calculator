import type {
	Options,
} from 'ajv/dist/2020.js';

import Ajv from 'ajv/dist/2020.js';

import {
	writeFile,
} from 'node:fs/promises';

import {
	GenerateSchemas,
} from './lib/generate-schemas.ts';

import {
	GenerateValidators,
} from './lib/generate-validators.ts';

import production_data from './tests/utilities/production-data.ts';

import {
	is_supported_from,
} from './lib/supported.ts';

const ajv_options: Options = {
	verbose: false,
	logger: false,
	allErrors: true,
	code: {
		source: true,
		esm: true,
		lines: true,
		optimize: 2,
	},
};

for (const semver of Object.keys(is_supported_from)) {
	await writeFile(
		`${import.meta.dirname}/validator/${semver}.ts`,
		GenerateValidators.toStandalone(
			GenerateSchemas.factory(
				semver,
				await production_data(semver, 'en-US'),
			),
			new Ajv(ajv_options),
		),
	);
}
