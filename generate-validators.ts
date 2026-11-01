import type {
	Options,
} from 'ajv/dist/2020.js';

import Ajv from 'ajv/dist/2020.js';

import {
	writeFile,
} from 'node:fs/promises';

import ts from 'typescript';

import {
	GenerateSchemas,
} from './lib/generate-schemas.ts';

import {
	GenerateValidators,
} from './lib/generate-validators.ts';

import production_data from './tests/utilities/production-data.ts';

import {
	is_supported_from,
	is_supported_semver,
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

// Optional CLI args restrict generation to specific versions,
// e.g. `node ./generate-validators.ts 1.2.2.0`. Defaults to all.
const [, , ...requested_versions] = process.argv;

const versions
	= requested_versions.length > 0
		? requested_versions
		: Object.keys(is_supported_from);

for (const semver of versions) {
	is_supported_semver(semver);

	await writeFile(
		`${import.meta.dirname}/validator/${semver}.ts`,
		GenerateValidators.toStandalone(
			GenerateSchemas.factory(
				semver,
				await production_data(semver, 'en-US'),
			),
			new Ajv(ajv_options),
			ts,
		),
	);
}
